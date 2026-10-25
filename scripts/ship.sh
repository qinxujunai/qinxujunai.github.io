#!/usr/bin/env bash
# One command from a finished change to live: build, check, commit as the owner, rebase on GitHub, rebuild, then
# browser QA and the player test on a local server serving exactly that tree, then push. Anything failing stops it
# before the push: nothing is published (a commit may stay local, which the next ship builds on).
# Usage: npm run ship -- "what changed"
set -euo pipefail
msg="${1:?usage: npm run ship -- \"what changed\"}"
who=(-c user.name=qinxujunai -c user.email=266454737+qinxujunai@users.noreply.github.com)
branch="$(git branch --show-current)"
port=4173
npm run -s build >/dev/null
npm run -s check
git add -A
git "${who[@]}" commit -q -m "$msg"
git pull -q --rebase origin "$branch"
# Someone else (a scheduled data update) may have landed first: rebuild so the pages match the merged data.
npm run -s build >/dev/null
if ! git diff --quiet; then git add -A; git "${who[@]}" commit -q -m "Rebuild after rebase"; fi
npm run -s check >/dev/null

# Browser QA (v27.20) on what is about to be pushed. A server we start is stopped on any exit.
started=""
stop() { if [ -n "$started" ]; then kill "$started" 2>/dev/null || true; pkill -f "http-server . -p $port" 2>/dev/null || true; fi; }
trap stop EXIT
if ! curl -s -o /dev/null "http://127.0.0.1:$port/"; then
  npm run -s serve >/dev/null 2>&1 &
  started=$!
  for _ in $(seq 1 30); do curl -s -o /dev/null "http://127.0.0.1:$port/" && break; sleep 1; done
fi
if ! curl -s "http://127.0.0.1:$port/" | cmp -s - index.html; then
  echo "the server on :$port is not serving this folder; stop it or free the port, then ship again (nothing pushed)" >&2
  exit 1
fi
if ! npm run -s qa || ! node scripts/test-player.cjs "http://127.0.0.1:$port/" '[data-film-play]'; then
  echo "browser QA or the player test failed: nothing pushed (the commit is local)" >&2
  exit 1
fi
bash scripts/push.sh "$branch"
