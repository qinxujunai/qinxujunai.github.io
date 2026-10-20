// Six case studies, one page each at /work/<slug>/ and /en/work/<slug>/.
// Every number has a source, noted next to it: a repository document, the resume, or src/stats.json ({ stat }).
// Section blocks the renderer understands: p, metrics, flow, scope, table, list, timeline, after.

const VF = 'https://github.com/qinxujunai/VoiceFlow';
const A2T = 'https://github.com/qinxujunai/Audio2Text';
const SIG = 'https://github.com/qinxujunai/ai-signal';

export const CASES = [
  // ───────────────────────── VoiceFlow ─────────────────────────
  // Sources: VoiceFlow README, docs/flagship-reliability-architecture.md, docs/decisions/ADR-001…005,
  // docs/model-strategy.md, docs/feedback-review-2026-07-28.md, docs/release-performance-evidence-2026-08-11.md,
  // docs/resource-profile-2026-07-28.md, docs/release-evidence-0.3.2/0.3.3/0.3.8.md, git tags.
  {
    slug: 'voiceflow',
    kind: 'product',
    image: { key: 'voiceflow-app', mobile: 'voiceflow-app-m' },
    zh: {
      name: 'VoiceFlow',
      kind: '产品 · 独立开发',
      title: '说完就上屏，一个字都不丢。',
      sub: 'Windows 离线语音输入，为每天和 AI 长对话的人而做：光标在哪，就在哪说话；录音和识别都不离开自己的电脑。',
      card: '离线语音输入。按 F2 说话，文字直接出现在光标处。',
      imageAlt: 'VoiceFlow 的主界面：已就绪、快捷键、试说一句和最近听写',
      facts: [
        ['角色', '独立开发：产品、设计、工程、发布'],
        ['时间', '2026.05 至今'],
        ['形态', 'Windows 桌面应用，开源'],
        ['技术', 'Python · PyQt6 · Sherpa-ONNX · SenseVoice · Zipformer'],
      ],
      links: [['官网', 'https://qinxujunai.github.io/VoiceFlow/'], ['源码', VF], ['下载', `${VF}/releases/latest`]],
      results: [
        { stat: 'stars', l: 'GitHub Star' },
        { v: '427 ms', l: '停止到粘贴，P95（0–10 秒录音）' },
        { v: '796 项', l: '自动化测试，每次发布都跑' },
        { v: '14 次', l: '发布，从 v0.1.0 到 v0.3.8' },
      ],
      sections: [
        {
          h: '为什么要做',
          p: [
            '和 AI 对话时，真正花时间的往往不是那句指令，而是补充背景、解释约束、继续追问。这些话常常比指令本身长得多，打字成了瓶颈。',
            '现有的语音输入大多要联网、要登录，长段落容易丢掉结尾，识别完还得从另一个窗口复制回来。我想要的很简单：光标在哪，就在哪说；说完，文字就在那里。',
          ],
        },
        {
          h: '难在哪里',
          list: [
            '快和准互相拉扯。边说边出字，需要一个流式小模型，但它不够准；准的模型，要等完整的音频。',
            '发出 Ctrl+V 不等于文字送到了。目标窗口可能换了，剪贴板可能被占用，权限可能不够。',
            '声卡驱动和 ONNX 推理都是原生代码。任何一个卡死，都可能让整个应用失去响应。',
            '长录音会同时拖垮内存、预览队列和终稿计算。',
          ],
        },
        {
          h: '边界',
          scope: {
            do: ['快捷键触发的日常输入', '中文、英文和中英混说', '本机识别，安装后离线可用，无需登录', '自定义术语和明确纠错'],
            dont: ['会议记录和说话人区分', '靠云端改写、润色', '没有足够语料之前，宣称准确率优于其他产品'],
          },
        },
        {
          h: '架构',
          flow: [
            { t: '界面进程（Qt）', n: ['AppController：所有操作的唯一入口', '全局热键 F2，先于模型启动', '原生绘制的录音胶囊', '交付与本地历史'] },
            { t: '三个受监督的子进程', n: ['audio_worker：采集麦克风，写恢复日志', 'preview_worker：流式 Zipformer，边说边出字', 'asr_worker：SenseVoice + VAD，整段终稿'] },
            { t: '交付链', n: ['写入剪贴板，逐字回读核对', '复核停止那一刻的前台窗口', '只发一次 Ctrl+V，不盲目重试', '写入本地历史 history.jsonl'] },
          ],
          after: [
            '每个子进程都有心跳、有界队列和强制结束路径。驱动或模型卡死，只重启那一个进程，界面和热键照常响应。',
            '一次听写是一个可恢复的会话：IDLE → ARMING → RECORDING → FINALIZING → DELIVERING → COMPLETE 或 RECOVERABLE。停下的那一刻先锁定最后一个采样点，预览立即作废，终稿只认 SenseVoice 对完整音频的结果。只有文字在剪贴板里核对无误、并写进历史，才算完成；没送到的录音留在本机，下次启动时提醒你找回。',
          ],
        },
        {
          h: '我放弃了什么',
          table: {
            head: ['决定', '原因', '放弃的方案'],
            rows: [
              ['默认只带 SenseVoice 一个终稿模型', '同机、中英各一条公开样本上，它最快，也没有输；Qwen3-ASR 输出了繁体，Whisper 多出约 1 GB 却没有更好', '让用户在设置里自己挑模型'],
              ['预览和终稿分开', '流式模型负责“快”，完整音频负责“准”，预览永远不能覆盖终稿', '一个模型同时管两件事'],
              ['不接在线识别', '它会打破“离线”这个承诺', '更多模型、更高的上限'],
              ['成功时不弹“已完成”', '文字已经出现在输入框里，再确认一次只会显得更慢', '每次都播一段确认动画'],
              ['胶囊改用 Qt 原生绘制', '一个 34 px 高的小胶囊，不该带上整套 Chromium 运行时', '更省事的网页渲染'],
            ],
          },
        },
        {
          h: '怎么证明它可靠',
          p: ['v0.3.1 发布机实测（Windows 11 · Ryzen 7 5800H），每一档 20 个样本，取 P95：'],
          metrics: [
            { v: '6 ms', l: '按下 F2 到第一帧反馈', g: '门槛 ≤ 50 ms' },
            { v: '427 ms', l: '0–10 秒录音，停止到粘贴', g: '门槛 ≤ 500 ms' },
            { v: '541 ms', l: '两分钟录音，停止到粘贴', g: '门槛 ≤ 2.5 s' },
            { v: '1,024 MB', l: '安装后常驻内存', g: '早期 1,324.6 MB' },
          ],
          list: [
            '796 项自动化测试，v0.3.3 时是 396 项。',
            '500 次录音生命周期，10,000 组随机的开始、停止、取消、退出序列，50,000 个异常文本模糊用例。',
            '从 v0.3.2 起，每个版本都附一份发布与验证记录。',
            '用户提过的 12 条反馈，每条都写下结论和理由：采纳、按门槛暂缓，或者拒绝。',
          ],
          after: ['这些是延迟和机制的证据，不是准确率。仓库里写明：没有足够的授权真实语料，就不对外宣称准确率。'],
        },
        {
          h: '时间线',
          timeline: [
            ['2026.05.23', '第一次提交'],
            ['2026.07.04', 'v0.1.0 发布'],
            ['2026.07.28', 'v0.2.0：逐条回应 12 条用户反馈'],
            ['2026.08.10', 'v0.3.0：可恢复的会话，交付前先核对剪贴板'],
            ['2026.08.25', 'v0.3.2：三个受监督的子进程，每版附发布证据'],
            ['2026.10.11', 'v0.3.8：原生胶囊，796 项测试'],
          ],
        },
        {
          h: '还差什么',
          list: [
            '安装包还没有代码签名，Windows 会弹出安全提示。',
            '正式版只支持 Windows 10 / 11。',
            '中文、英文和混说的准确率还没有公开结论，要等足够的真实语料。',
            '两个识别模型常驻，内存约 1 GB，仍然是一笔不小的成本。',
          ],
        },
      ],
    },
    en: {
      name: 'VoiceFlow',
      kind: 'Product · built solo',
      title: 'Say it, and it’s on the screen. Every word.',
      sub: 'Offline voice typing for Windows, made for people who talk to AI all day: speak wherever the cursor is, and your audio never leaves your computer.',
      card: 'Offline voice typing. Press F2, speak, and the text lands at your cursor.',
      imageAlt: 'VoiceFlow main window (in Chinese): ready state, hotkeys, a test dictation box and recent history',
      facts: [
        ['Role', 'Solo: product, design, engineering, release'],
        ['When', 'May 2026 to now'],
        ['Form', 'Windows desktop app, open source'],
        ['Stack', 'Python · PyQt6 · Sherpa-ONNX · SenseVoice · Zipformer'],
      ],
      links: [['Website', 'https://qinxujunai.github.io/VoiceFlow/?lang=en'], ['Source', VF], ['Download', `${VF}/releases/latest`]],
      results: [
        { stat: 'stars', l: 'GitHub stars' },
        { v: '427 ms', l: 'Stop to paste, P95 (0–10 s clips)' },
        { v: '796', l: 'Automated tests on every release' },
        { v: '14', l: 'Releases, v0.1.0 to v0.3.8' },
      ],
      sections: [
        {
          h: 'Why build it',
          p: [
            'When you work with AI, the instruction is rarely the long part. The context, the constraints and the follow-up questions are. Typing becomes the bottleneck.',
            'Most voice input needs a network and an account, drops the end of long passages, and leaves you copying text back from another window. I wanted something simpler: speak where the cursor is, and find the words there when you stop.',
          ],
        },
        {
          h: 'What made it hard',
          list: [
            'Speed and accuracy pull against each other. Live text needs a small streaming model, which is less accurate; the accurate model needs the whole recording.',
            'Sending Ctrl+V is not the same as delivering text. The window may have changed, the clipboard may be busy, permissions may block it.',
            'Audio drivers and ONNX inference are native code. If either hangs, the whole app can freeze.',
            'Long recordings strain memory, the preview queue and final recognition all at once.',
          ],
        },
        {
          h: 'Scope',
          scope: {
            do: ['Everyday input from a hotkey', 'Chinese, English and both mixed', 'On-device recognition, offline after install, no account', 'Custom terms and explicit corrections'],
            dont: ['Meeting notes or speaker separation', 'Cloud rewriting or polishing', 'Claims of beating other products before there is enough speech data'],
          },
        },
        {
          h: 'Architecture',
          flow: [
            { t: 'UI process (Qt)', n: ['AppController: the single entry point', 'Global F2 hotkey, live before the models load', 'Natively painted recording capsule', 'Delivery and local history'] },
            { t: 'Three supervised workers', n: ['audio_worker: microphone and recovery journal', 'preview_worker: streaming Zipformer, text as you speak', 'asr_worker: SenseVoice + VAD, the final text'] },
            { t: 'Delivery chain', n: ['Write to the clipboard, read it back', 'Re-check the foreground window at stop', 'One Ctrl+V, never a blind retry', 'Append to local history.jsonl'] },
          ],
          after: [
            'Every worker has a heartbeat, a bounded queue and a hard kill path. If a driver or model hangs, only that process restarts; the window and the hotkey keep responding.',
            'A dictation is a recoverable session: IDLE → ARMING → RECORDING → FINALIZING → DELIVERING → COMPLETE or RECOVERABLE. Stopping latches the last audio sample, discards the preview, and trusts only SenseVoice’s pass over the full recording. A session is complete only when the clipboard has been verified and history written; anything undelivered stays on the machine and is offered back at the next launch.',
          ],
        },
        {
          h: 'What I gave up',
          table: {
            head: ['Decision', 'Why', 'Given up'],
            rows: [
              ['Ship one final model: SenseVoice', 'On one public Chinese and one English sample on the same machine, it was fastest and lost nothing; Qwen3-ASR returned Traditional Chinese, Whisper added about 1 GB without doing better', 'A model picker in settings'],
              ['Separate preview from final text', 'The streaming model is for speed, the full recording is for accuracy, and the preview may never overwrite the final', 'One model doing both jobs'],
              ['No online recognition', 'It would break the promise of working offline', 'More models and a higher ceiling'],
              ['No “Done” on success', 'The text is already in the box; confirming it again only makes it feel slower', 'A confirmation animation every time'],
              ['Paint the capsule natively in Qt', 'A 34-pixel capsule should not carry a whole Chromium runtime', 'The convenience of web rendering'],
            ],
          },
        },
        {
          h: 'How I know it holds up',
          p: ['Measured for v0.3.1 on the release machine (Windows 11, Ryzen 7 5800H), 20 samples per bucket, P95:'],
          metrics: [
            { v: '6 ms', l: 'F2 to first feedback', g: 'Gate ≤ 50 ms' },
            { v: '427 ms', l: 'Stop to paste, 0–10 s clips', g: 'Gate ≤ 500 ms' },
            { v: '541 ms', l: 'Stop to paste, two-minute clips', g: 'Gate ≤ 2.5 s' },
            { v: '1,024 MB', l: 'Resident memory after install', g: 'Earlier 1,324.6 MB' },
          ],
          list: [
            '796 automated tests, up from 396 at v0.3.3.',
            '500 recording lifecycles, 10,000 random start, stop, cancel and exit sequences, 50,000 malformed-text fuzz cases.',
            'Since v0.3.2, every release ships with a release and verification record.',
            'Twelve pieces of user feedback, each with a written decision and reason: adopted, deferred behind a gate, or declined.',
          ],
          after: ['This is evidence about latency and mechanics, not accuracy. The repository’s rule: no accuracy claims without enough authorized real speech.'],
        },
        {
          h: 'Timeline',
          timeline: [
            ['2026.05.23', 'First commit'],
            ['2026.07.04', 'v0.1.0 released'],
            ['2026.07.28', 'v0.2.0: a written answer to all 12 pieces of user feedback'],
            ['2026.08.10', 'v0.3.0: recoverable sessions; the clipboard is verified before delivery'],
            ['2026.08.25', 'v0.3.2: three supervised workers; evidence with every release'],
            ['2026.10.11', 'v0.3.8: native capsule, 796 tests'],
          ],
        },
        {
          h: 'What’s still missing',
          list: [
            'The installer is not code-signed yet, so Windows shows a warning.',
            'The release supports Windows 10 and 11 only.',
            'No public accuracy figures for Chinese, English or mixed speech until there is enough real speech to measure.',
            'Keeping two recognizers resident costs about 1 GB of memory.',
          ],
        },
      ],
    },
  },

  // ───────────────────────── AI Signal ─────────────────────────
  // Sources: ai-signal repository v3 (2026-10-20): README, scripts/prepare-digest.js, remix-digest.js, render.js,
  // .github/workflows/daily.yml; the first v3 issue (docs/archive/2026-10-20.html: 60 new items, 30 picked);
  // GitHub Actions history (last run of the old workflow 2026-07-22, state disabled_inactivity).
  {
    slug: 'ai-signal',
    kind: 'product',
    image: { key: 'ai-signal', mobile: 'ai-signal-m' },
    zh: {
      name: 'AI Signal',
      kind: '产品 · 独立开发',
      title: '几百条 AI 资讯里，替我挑出值得看的那几条。',
      sub: '一份每天自动运行的 AI 简报：七类信源，DeepSeek 按写死的编辑标准挑选，3 分钟读完，早上十点进邮箱。',
      card: '每天自动运行的 AI 简报。模型只能引用编号，链接和数字由代码回填，一个都编不出来。',
      imageAlt: 'AI Signal 的一期：标题、30 秒读完、头条和要闻，每条下面一行写着来源和热度',
      facts: [
        ['角色', '独立开发'],
        ['时间', '2026.05 起；v3 于 2026.10'],
        ['形态', '自动化工作流，开源'],
        ['技术', 'Node.js · GitHub Actions · DeepSeek · SMTP'],
      ],
      links: [['最新一期', 'https://qinxujunai.github.io/ai-signal/'], ['往期', 'https://qinxujunai.github.io/ai-signal/archive/'], ['源码', SIG]],
      results: [
        { v: '7 类', l: '信源：X、播客、官方博客、HN、论文、GitHub、中文媒体' },
        { v: '60 → 30', l: 'v3 第一期：60 条新内容里选出 30 条' },
        { v: '0', l: '由模型写出的链接：全部由代码回填' },
        { v: '$0.003', l: '每天的模型成本' },
      ],
      sections: [
        {
          h: '为什么要做',
          p: [
            'AI 的信息太多了：推文、播客、博客、论文、GitHub，每天几百条，真正值得看的不到 5 条。刷信息流费时间，还容易被情绪和噪音带着走。',
            '我想要一位靠谱的编辑：每天替我读一遍，只留下会改变判断的东西，3 分钟读完。',
          ],
        },
        {
          h: '难在哪里',
          list: [
            '模型会编。让它自己写链接和数字，迟早会出现一个看起来很真的假链接。',
            '同一件事会在博客、Hacker News 和推文里同时出现，不合并就是重复。',
            '它会悄悄停掉。2026-07-22 之后，GitHub 因为仓库 60 天没有新提交，暂停了定时任务；简报停发了将近三个月，没有任何报错。',
            '旧的信源在烂：GitHub Trending 用的第三方接口失效了，机器之心的 RSS 也没了，旧的反馈按钮指向一个 404 的服务。',
          ],
        },
        {
          h: '边界',
          scope: {
            do: ['聚合公开信源', '按写死的编辑标准挑选、合并、改写', '每天一封邮件和一期网页版，每条都附原文'],
            dont: ['需要 X、YouTube 的 API key', '做 App 和账号体系', '追踪读者：没有像素，没有点击统计'],
          },
        },
        {
          h: '架构',
          flow: [
            { t: '收集 · prepare-digest', n: ['X 上的 builder、播客（follow-builders）', 'OpenAI、DeepMind、Google AI、Hugging Face 官方博客', 'Hacker News：36 小时内、60 分以上', 'Hugging Face 论文热榜、GitHub 今日趋势、量子位', '去掉 60 天内发过的'] },
            { t: '编号', n: ['每条素材一个编号：H3、P1、G2…'] },
            { t: '编辑 · DeepSeek', n: ['按「三问」挑选，多来源合并', '只输出 JSON，只能引用编号'] },
            { t: '回填 · remix-digest', n: ['代码按编号填回链接、分数、star 数', '编号不存在，这条直接丢弃', '模型失败：按热度排出降级版'] },
            { t: '送达 · deliver', n: ['邮件主题就是当天的标题', '网页版和已发列表提交回仓库'] },
          ],
          after: [
            '编辑标准写在提示词里，每条内容必须过三问：读者会因为这条信息做出不同的决策吗？这是新的事实，还是噪音？有没有具体的数字或名字？',
            '排版参照 TLDR、The Rundown 和 Axios：一栏，标题即事实，每条下面一行写来源、热度和讨论链接；论文和开源项目用两栏的排行列表。',
          ],
        },
        {
          h: '我放弃了什么',
          table: {
            head: ['决定', '原因', '放弃的方案'],
            rows: [
              ['模型只引用编号，不写链接', '链接和数字最容易被编造；由代码回填，就不可能出错', '让模型直接写，再事后校验'],
              ['每天把网页版提交回仓库', '既是存档，也让定时任务不会因为 60 天无活动被暂停', '只发邮件，不留痕迹'],
              ['去掉 👍 / 👎 和追踪像素', '接收反馈的服务早已返回 404，留着就是坏链接', '假装有反馈回路'],
              ['Hacker News 改用 Algolia，按整词匹配', '旧做法只看首页 30 条，按子串匹配，「said」也会被当成 AI', '首页接口'],
              ['用 DeepSeek 的 chat 模型', '每天约 $0.003', '更贵的推理模型'],
            ],
          },
        },
        {
          h: '怎么证明它可靠',
          list: [
            'v3 第一期（2026-10-20）从 60 条新内容里选出 30 条，自动发信，并发布网页版和往期。',
            '链接和数字全部来自原始数据；模型引用了不存在的编号，这条就不会出现。',
            '模型无响应时照样发出一期，按来源热度排序，并在邮件里写明；某个信源挂了，页脚会写出来。',
            '发过的链接记录 60 天，下一期不会重复。',
          ],
        },
        {
          h: '时间线',
          timeline: [
            ['2026.05', '第一版：follow-builders 的推文和播客，LLM 策展，邮件送达'],
            ['2026.05.22', 'v2：加入 Hacker News、ArXiv、GitHub、中文媒体'],
            ['2026.07.22', '最后一次自动发送；之后定时任务因 60 天无提交被暂停'],
            ['2026.10.20', 'v3：重写信源、编辑方式和排版，恢复每日发送'],
          ],
        },
        {
          h: '还差什么',
          list: [
            '推文和播客仍依赖第三方的 follow-builders feed，它一停，这两类就会断。',
            'Reddit 拒绝自动化请求，社区讨论目前只有 Hacker News。',
            '中文来源只有量子位。',
            '没有读者反馈回路；编辑标准只能靠人读了再改。',
          ],
        },
      ],
    },
    en: {
      name: 'AI Signal',
      kind: 'Product · built solo',
      title: 'Hundreds of AI headlines a day. It keeps the few worth reading.',
      sub: 'A daily AI briefing that runs itself: seven kinds of sources, DeepSeek editing to a fixed brief, three minutes to read, in the inbox at 10 a.m.',
      card: 'A daily AI briefing. The model may only cite IDs; links and numbers are filled in by code, so none can be made up.',
      imageAlt: 'An AI Signal issue: headline, 30-second summary, lead story and stories, each with a source line',
      facts: [
        ['Role', 'Built solo'],
        ['When', 'Since May 2026; v3 in Oct 2026'],
        ['Form', 'Automated workflow, open source'],
        ['Stack', 'Node.js · GitHub Actions · DeepSeek · SMTP'],
      ],
      links: [['Latest issue', 'https://qinxujunai.github.io/ai-signal/'], ['Archive', 'https://qinxujunai.github.io/ai-signal/archive/'], ['Source', SIG]],
      results: [
        { v: '7', l: 'Source types: X, podcasts, lab blogs, HN, papers, GitHub, Chinese media' },
        { v: '60 → 30', l: 'First v3 issue: 30 picked from 60 new items' },
        { v: '0', l: 'Links written by the model: all filled in by code' },
        { v: '$0.003', l: 'Model cost per day' },
      ],
      sections: [
        {
          h: 'Why build it',
          p: [
            'There is too much AI news: posts, podcasts, blogs, papers, GitHub. Hundreds of items a day, and fewer than five worth reading. Scrolling a feed costs time and lets noise set the mood.',
            'I wanted a dependable editor: someone who reads everything each day and keeps only what would change a decision, in three minutes.',
          ],
        },
        {
          h: 'What made it hard',
          list: [
            'Models make things up. Let one write links and numbers and sooner or later a convincing fake appears.',
            'The same story shows up on a blog, on Hacker News and on X at once. Without merging, it repeats.',
            'It can stop silently. After 2026-07-22, GitHub paused the schedule because the repository had no commits for 60 days. The briefing stopped for almost three months with no error anywhere.',
            'Old sources rot: the third-party GitHub Trending API died, a Chinese media RSS feed disappeared, and the old feedback buttons pointed at a service returning 404.',
          ],
        },
        {
          h: 'Scope',
          scope: {
            do: ['Aggregate public sources', 'Select, merge and rewrite to a fixed editorial brief', 'One email and one web issue a day, every item linked'],
            dont: ['Require X or YouTube API keys', 'Build an app or accounts', 'Track readers: no pixels, no click counting'],
          },
        },
        {
          h: 'Architecture',
          flow: [
            { t: 'Collect · prepare-digest', n: ['Builders on X and podcasts (follow-builders)', 'OpenAI, DeepMind, Google AI, Hugging Face blogs', 'Hacker News: last 36 h, 60+ points', 'HF Daily Papers, GitHub Trending, QbitAI', 'Drop anything sent in the last 60 days'] },
            { t: 'Number', n: ['Every item gets an ID: H3, P1, G2…'] },
            { t: 'Edit · DeepSeek', n: ['Select by three questions, merge sources', 'JSON only, IDs only'] },
            { t: 'Resolve · remix-digest', n: ['Code fills in links, scores and stars by ID', 'Unknown ID: the item is dropped', 'Model down: a ranked fallback issue'] },
            { t: 'Deliver · deliver', n: ['The subject line is the day’s headline', 'Web edition and sent list committed back'] },
          ],
          after: [
            'The editorial standard lives in the prompt. Every item must pass three questions: Would the reader decide differently because of it? Is it a new fact or noise? Does it carry a concrete number or name?',
            'The layout follows TLDR, The Rundown and Axios: one column, headlines that state facts, one source line under every item, and ranked two-column lists for papers and repositories.',
          ],
        },
        {
          h: 'What I gave up',
          table: {
            head: ['Decision', 'Why', 'Given up'],
            rows: [
              ['The model cites IDs, never links', 'Links and numbers are the easiest things to invent; filled in by code, they cannot be wrong', 'Let the model write them and check afterwards'],
              ['Commit the web edition every day', 'It is the archive, and it keeps the schedule from being paused after 60 quiet days', 'Email only, no trace'],
              ['Remove 👍 / 👎 and the tracking pixel', 'The feedback service had been returning 404; keeping them meant broken links', 'Pretending there is a feedback loop'],
              ['Hacker News through Algolia, whole-word matching', 'The old code read 30 front-page stories and matched substrings, so “said” counted as AI', 'The front-page API'],
              ['DeepSeek’s chat model', 'About $0.003 a day', 'A pricier reasoning model'],
            ],
          },
        },
        {
          h: 'How I know it holds up',
          list: [
            'The first v3 issue (2026-10-20) picked 30 of 60 new items, went out by email, and published a web edition and archive.',
            'Every link and number comes from the raw data; an item that cites an unknown ID never appears.',
            'If the model is down, an issue still goes out, ranked by source signal and labelled as such; a failed source is named in the footer.',
            'Sent links are remembered for 60 days, so nothing repeats.',
          ],
        },
        {
          h: 'Timeline',
          timeline: [
            ['2026.05', 'First version: follow-builders posts and podcasts, LLM curation, email'],
            ['2026.05.22', 'v2: Hacker News, ArXiv, GitHub and Chinese media added'],
            ['2026.07.22', 'Last automatic send; the schedule was then paused after 60 days without commits'],
            ['2026.10.20', 'v3: new sources, editing and layout; daily sends restored'],
          ],
        },
        {
          h: 'What’s still missing',
          list: [
            'Posts and podcasts still depend on the third-party follow-builders feed.',
            'Reddit refuses automated requests, so community discussion comes only from Hacker News.',
            'QbitAI is the only Chinese source.',
            'There is no reader feedback loop; the editorial brief improves only when someone reads and edits it.',
          ],
        },
      ],
    },
  },

  // ───────────────────────── 万象成文 ─────────────────────────
  // Sources: Audio2Text README (positioning, scope, platform table, live smoke 2026-08-11, loopback port + token,
  // SHA-256/SBOM/provenance), AGENTS.md (text priority, FastAPI, 521 KB → 2 KB, 30–40%), docs/transcription-benchmark.md.
  {
    slug: 'wanxiang',
    kind: 'product',
    image: { key: 'wanxiang', mobile: 'wanxiang-m' },
    zh: {
      name: '万象成文',
      kind: '产品 · 独立开发',
      title: '一个链接进去，可用的文字出来。',
      sub: '把公开视频、播客、图文链接和本地音视频，整理成能读、能复制、能下载的文字与媒体。Windows 本地优先。',
      card: '视频、播客、图文，一个链接变成可用的文字和原始媒体。',
      imageAlt: '万象成文首页：把链接或文件，直接变成文字。下面是粘贴链接的输入框',
      facts: [
        ['角色', '独立开发'],
        ['时间', '2026'],
        ['形态', 'Windows 桌面应用，另有网页预览'],
        ['技术', 'Tauri 2 · React · FastAPI · SenseVoice · Faster-Whisper · yt-dlp'],
      ],
      links: [['官网', 'https://qinxujunai.github.io/Audio2Text/'], ['源码', A2T], ['下载', `${A2T}/releases/latest`]],
      results: [
        { v: '6 个', l: '平台：B 站、小宇宙、抖音、小红书、公众号、YouTube' },
        { v: '0.035', l: 'CPU 转写实时率 RTF，单样本探测（越小越快）' },
        { v: '521 KB → 2 KB', l: '小红书单次提取的传输量' },
        { v: '3 件事', l: '只做转文字、提图文、下原件' },
      ],
      sections: [
        {
          h: '为什么要做',
          p: [
            '好内容散落在视频、播客和图文里，可工作需要的是文字：能检索、能引用、能交给 AI。现有的办法往往要装好几个工具，再在它们之间来回复制。',
            '万象成文只解决这一件事：给它一个链接或一个文件，拿回可用的文字和原始媒体。',
          ],
        },
        {
          h: '难在哪里',
          list: [
            '每个平台的结构都不一样，而且经常变；抖音和小红书还会在会话或网络受限时拦截。',
            '转写又慢又吃机器，不能要求每个人都有显卡。',
            '桌面端要在没装 Python 的电脑上跑起来，同时不能把本地接口暴露给别的程序。',
          ],
        },
        {
          h: '边界',
          scope: {
            do: ['音频、视频转文字', '图文链接提取正文和图片', '预览并下载原视频、原音频、图片和文本'],
            dont: ['账号体系', '支付、套餐、积分', '多工作台、Agent 后台', '平台化配置中心'],
          },
        },
        {
          h: '架构',
          flow: [
            { t: '桌面外壳', n: ['Tauri 2（Rust）+ React', '首次运行只准备必要组件，约 222 MB', '运行包校验 SHA-256'] },
            { t: '本地服务', n: ['FastAPI，随应用启动', '只监听随机的本机端口', '每次启动生成短期令牌', 'SSE 实时推送进度'] },
            { t: '取文字', n: ['平台字幕 → 页面正文 → 转写', '命中字幕或正文，就跳过转写'] },
            { t: '转写', n: ['默认 SenseVoice int8，CPU 即可', '有显卡且实测有收益时，用 Faster-Whisper', '初始化失败，自动回落'] },
          ],
          after: ['同一套服务也能部署成网页预览；Windows 桌面端是完整的主产品。'],
        },
        {
          h: '我放弃了什么',
          table: {
            head: ['决定', '原因', '放弃的方案'],
            rows: [
              ['默认用 SenseVoice', 'CPU 上 RTF 约 0.035，Faster-Whisper medium 在 CPU 上约 2.01；一段 989 秒的课程，SenseVoice 用 48 秒，RTX 3060 上的 Whisper 用 97 秒', '默认上更大的模型'],
              ['能读字幕和正文，就不转写', '最快的转写，是不用转写', '所有内容统一走转写'],
              ['小红书直接读页面里的结构化数据', '不再传整页 HTML：传输量从 521 KB 降到 2 KB，总耗时少 30–40%', '先抓整页，再解析'],
              ['只做三件事', '账号、支付、工作台，会把一个工具变成一个平台', '做成平台'],
            ],
          },
        },
        {
          h: '怎么证明它可靠',
          list: [
            '2026-08-11 用真实样本跑了一轮线上冒烟测试：B 站、小宇宙、抖音、公众号通过；小红书一篇 15 张图、14 个 Live 片段的图文通过。',
            '平台状态写在 README 的表格里，每一行标明最近一次验证，不当作永久承诺。',
            '安装包、运行包和发布产物都提供 SHA-256；GitHub Actions 同时生成 SBOM 和构建来源证明。',
            '换转写模型之前，先要过 60 个样本、3 小时音频的评测门槛。',
          ],
        },
        {
          h: '还差什么',
          list: [
            '安装包还没有代码签名，Windows 会弹出安全提示。',
            '小红书的视频样本目前会触发平台的会话验证；YouTube 在国内网络下经常超时。',
            '准确率还没有大样本结论。现在的模型选择，是速度和安装体积的取舍。',
          ],
        },
      ],
    },
    en: {
      name: 'Wanxiang',
      kind: 'Product · built solo',
      title: 'Paste a link. Get usable text back.',
      sub: 'Turns public videos, podcasts, articles and local recordings into text and media you can read, copy and download. Local-first, for Windows.',
      card: 'Videos, podcasts and articles: one link in, usable text and original media out.',
      imageAlt: 'Wanxiang home screen (in Chinese): turn a link or a file straight into text, with a box to paste a link',
      facts: [
        ['Role', 'Built solo'],
        ['When', '2026'],
        ['Form', 'Windows desktop app, plus a web preview'],
        ['Stack', 'Tauri 2 · React · FastAPI · SenseVoice · Faster-Whisper · yt-dlp'],
      ],
      links: [['Website', 'https://qinxujunai.github.io/Audio2Text/'], ['Source', A2T], ['Download', `${A2T}/releases/latest`]],
      results: [
        { v: '6', l: 'Platforms: Bilibili, Xiaoyuzhou, Douyin, Xiaohongshu, WeChat articles, YouTube' },
        { v: '0.035', l: 'Real-time factor on CPU, single-sample probe (lower is faster)' },
        { v: '521 → 2 KB', l: 'Transfer per Xiaohongshu extraction' },
        { v: '3', l: 'Jobs: transcribe, extract, download' },
      ],
      sections: [
        {
          h: 'Why build it',
          p: [
            'Good material lives in videos, podcasts and articles, but work runs on text: something you can search, quote and hand to an AI. Getting it usually means several tools and a lot of copying between them.',
            'Wanxiang does one thing: give it a link or a file, and get usable text and the original media back.',
          ],
        },
        {
          h: 'What made it hard',
          list: [
            'Every platform is structured differently and changes often; Douyin and Xiaohongshu block requests when a session or network looks wrong.',
            'Transcription is slow and hardware-hungry, and not everyone has a GPU.',
            'The desktop app has to run on a computer without Python, without exposing its local API to other programs.',
          ],
        },
        {
          h: 'Scope',
          scope: {
            do: ['Transcribe audio and video', 'Extract article text and images', 'Preview and download original video, audio, images and text'],
            dont: ['Accounts', 'Payments, plans or credits', 'Workspaces or an agent console', 'A platform-style settings center'],
          },
        },
        {
          h: 'Architecture',
          flow: [
            { t: 'Desktop shell', n: ['Tauri 2 (Rust) + React', 'First run fetches only what it needs, about 222 MB', 'Runtime packs verified by SHA-256'] },
            { t: 'Local service', n: ['FastAPI, launched with the app', 'Listens only on a random local port', 'A short-lived token per launch', 'Progress streamed over SSE'] },
            { t: 'Get the text', n: ['Platform subtitles → page text → transcription', 'If subtitles or text exist, skip transcription'] },
            { t: 'Transcribe', n: ['SenseVoice int8 on CPU by default', 'Faster-Whisper on a GPU only when measured to help', 'Falls back automatically on failure'] },
          ],
          after: ['The same service can also run as a web preview; the Windows app is the complete product.'],
        },
        {
          h: 'What I gave up',
          table: {
            head: ['Decision', 'Why', 'Given up'],
            rows: [
              ['SenseVoice by default', 'RTF about 0.035 on CPU versus about 2.01 for Faster-Whisper medium; a 989-second lecture took SenseVoice 48 s and Whisper on an RTX 3060 97 s', 'A bigger default model'],
              ['Use subtitles and page text when they exist', 'The fastest transcription is the one you skip', 'Transcribe everything'],
              ['Read Xiaohongshu’s structured page data directly', 'No full-page HTML: transfer fell from 521 KB to 2 KB and total time by 30–40%', 'Fetch the page, then parse it'],
              ['Do three things only', 'Accounts, payments and workspaces turn a tool into a platform', 'Becoming a platform'],
            ],
          },
        },
        {
          h: 'How I know it holds up',
          list: [
            'A live smoke test with real samples on 2026-08-11: Bilibili, Xiaoyuzhou, Douyin and WeChat articles passed; a Xiaohongshu post with 15 images and 14 Live clips passed.',
            'Platform status lives in a README table, each row with its last verification, not a permanent promise.',
            'Installers, runtime packs and release files all carry SHA-256; GitHub Actions also produces an SBOM and build provenance.',
            'Replacing the transcription model requires passing a 60-sample, three-hour benchmark first.',
          ],
        },
        {
          h: 'What’s still missing',
          list: [
            'The installer is not code-signed yet, so Windows shows a warning.',
            'Xiaohongshu video samples currently trigger session checks; YouTube often times out on networks in mainland China.',
            'No large-sample accuracy figures yet. Today’s model choice is a trade-off of speed and install size.',
          ],
        },
      ],
    },
  },

  // ───────────────────────── 企业 AI 方案（比智科技） ─────────────────────────
  // Source: resume, 杭州比智科技 · AI 解决方案架构 · 2025.11 起. Client names are not in the resume: keep them generic.
  {
    slug: 'enterprise-ai',
    kind: 'solution',
    big: { zh: '100%', en: '100%' },
    zh: {
      name: '企业 AI 方案',
      kind: '方案 · 比智科技',
      title: '从第一次需求会，到 100% 回款。',
      sub: '在比智科技做 AI 解决方案架构：帮金融、政企客户把“想用 AI”，变成能采购、能交付、能回款的项目。',
      card: '数据智能与 AI 问数方案，从需求诊断一路跟到回款。',
      bigLabel: '3 万–10 万+ 项目回款率',
      facts: [
        ['角色', 'AI 解决方案架构'],
        ['时间', '2025.11 起'],
        ['公司', '比智科技'],
        ['客户', '金融控股集团、通信与政企客户'],
        ['方向', '数据平台 · 智能分析 · AI 问数'],
      ],
      results: [
        { v: '5+', l: '客户进入采购评估' },
        { v: '100%', l: '负责项目的回款率' },
        { v: '3 万–10 万+', l: '项目规模，全链路闭环' },
      ],
      sections: [
        {
          h: '客户的问题',
          p: [
            '“想用 AI”离“能采购”很远。中间隔着一串问题：业务痛点到底是什么，ROI 算不算得过来，交付边界在哪里，采购和合规怎么走。',
            '我的工作，是把这些问题一个个答清楚，再把答案变成一个能签、能交、能收回款的项目。',
          ],
        },
        {
          h: '我怎么做',
          flow: [
            { t: '找到对的人', n: ['从公开招投标、行业信息、客户画像和会议交流里筛线索', '识别关键人、预算和采购路径'] },
            { t: '诊断', n: ['需求挖掘', '梳理业务痛点、ROI、交付边界'] },
            { t: '方案', n: ['围绕数据平台、智能分析、AI 问数设计方案', '产品演示'] },
            { t: '选型', n: ['自研方案和外采产品一起评估', '能力 · 成本 · 交付周期 · ROI', '输出选型建议，推动决策链'] },
            { t: '招投标', n: ['材料梳理、资质准备', '政企采购准入与合规'] },
            { t: '闭环', n: ['方案 → 合同 → 开票 → 回款', '协同销管、财务、法务'] },
          ],
        },
        {
          h: '关键时刻',
          list: [
            '统筹一家金融控股集团的高层来访：协调生态伙伴和售前资源，围绕数据治理与 AI 应用场景做诊断和演示，之后进入商务沟通。',
            '主导通信、政企客户的招投标全流程：材料、资质、跨部门协同，以及采购准入与合规要求。',
            '准备政企、金融、制造客户的接待材料和交流话术，把 ROI、交付边界和 AI 融合场景讲清楚。',
            '把线索筛选和客户跟进沉淀成一套 SOP。',
          ],
        },
      ],
    },
    en: {
      name: 'Enterprise AI solutions',
      kind: 'Solution · Bizhi Technology',
      title: 'From first meeting to full payment.',
      sub: 'As an AI solution architect at Bizhi Technology, I helped finance and government clients turn “we want AI” into projects that could be bought, delivered and paid for.',
      card: 'Data-intelligence and natural-language-query solutions, followed from diagnosis to payment.',
      bigLabel: 'Payment collected on ¥30k–100k+ projects',
      facts: [
        ['Role', 'AI Solution Architect'],
        ['When', 'From Nov 2025'],
        ['Company', 'Bizhi Technology'],
        ['Clients', 'A financial holding group; telecom and government clients'],
        ['Focus', 'Data platforms · analytics · natural-language data queries'],
      ],
      results: [
        { v: '5+', l: 'Clients moved into procurement evaluation' },
        { v: '100%', l: 'Payment collected on my projects' },
        { v: '¥30k–100k+', l: 'Projects run end to end' },
      ],
      sections: [
        {
          h: 'The client’s problem',
          p: [
            '“We want AI” is a long way from a purchase order. In between sit the real questions: what the business pain is, whether the ROI adds up, where delivery ends, and how procurement and compliance work.',
            'My job was to answer those questions one by one, then turn the answers into a project that could be signed, delivered and paid for.',
          ],
        },
        {
          h: 'How I worked',
          flow: [
            { t: 'Find the right people', n: ['Screen leads from public tenders, industry news, client profiles and events', 'Identify decision makers, budget and buying path'] },
            { t: 'Diagnose', n: ['Requirements discovery', 'Map the pain points, ROI and delivery boundary'] },
            { t: 'Propose', n: ['Design around data platforms, analytics and natural-language queries', 'Product demos'] },
            { t: 'Select', n: ['Weigh in-house against bought-in products', 'Capability · cost · delivery time · ROI', 'Recommend, and move the decision chain'] },
            { t: 'Tender', n: ['Documents and qualifications', 'Government procurement and compliance'] },
            { t: 'Close the loop', n: ['Proposal → contract → invoice → payment', 'With sales ops, finance and legal'] },
          ],
        },
        {
          h: 'Key moments',
          list: [
            'Organized an executive visit from a financial holding group: brought in ecosystem partners and presales, and ran a diagnosis and demo on data governance and AI use cases that moved into commercial talks.',
            'Led full tender processes for telecom and government clients: documents, qualifications, cross-team coordination, and procurement and compliance rules.',
            'Prepared briefing material for government, finance and manufacturing clients that made ROI, delivery boundaries and AI use cases concrete.',
            'Turned lead screening and client follow-up into a repeatable SOP.',
          ],
        },
      ],
    },
  },

  // ───────────────────────── 飞书脚本智能体（一念智能） ─────────────────────────
  // Source: resume, 杭州一念智能 · AI 项目负责人 · 2024.08–2025.10.
  {
    slug: 'script-agent',
    kind: 'solution',
    big: { zh: '20 分钟', en: '20 min' },
    zh: {
      name: '飞书脚本智能体',
      kind: '方案 · 一念智能',
      title: '把 3 小时的脚本，压到 20 分钟。',
      sub: '在一念智能，我为创始人 IP 搭起了公司第一个 AI 驱动的内容工作流。',
      card: '拆解 50+ 个爆款案例，在飞书搭成脚本生成智能体。',
      bigLabel: '写一条脚本，原来要 3 小时',
      facts: [
        ['角色', 'AI 项目负责人，AI 内容工作流负责人'],
        ['时间', '2024.08 – 2025.10'],
        ['公司', '一念智能'],
        ['平台', '飞书智能体'],
      ],
      results: [
        { v: '50+', l: '个爆款案例，逐条拆解' },
        { v: '3 小时 → 20 分钟', l: '单条脚本的创作时间' },
        { v: '第一个', l: '公司 AI 驱动的内容工作流' },
      ],
      sections: [
        {
          h: '为什么要做',
          p: ['创始人 IP 要持续出内容，可一条脚本要写 3 个小时。靠人堆，产量上不去，质量也不稳定。'],
        },
        {
          h: '我怎么做',
          flow: [
            { t: '拆解', n: ['找来 50+ 个爆款案例', '逐条拆出背后的逻辑'] },
            { t: '沉淀', n: ['把这些逻辑整理成智能体的规则和上下文'] },
            { t: '搭建', n: ['在飞书搭出“爆款脚本生成智能体”'] },
            { t: '进入流程', n: ['接进创始人 IP 的选题和脚本生产'] },
          ],
          after: ['这就是“组织上下文的能力”：模型写得好不好，很大程度上取决于你喂给它的东西有多结构化。'],
        },
        {
          h: '结果',
          list: [
            '单条脚本从 3 小时缩到 20 分钟。',
            '成为公司第一个“AI 驱动”的内容生产工作流。',
          ],
        },
      ],
    },
    en: {
      name: 'Feishu script agent',
      kind: 'Solution · Yinian Intelligence',
      title: 'A three-hour script, written in twenty minutes.',
      sub: 'At Yinian Intelligence I built the company’s first AI-driven content workflow, for the founder’s personal brand.',
      card: '50+ hit videos broken down and rebuilt as a script-writing agent in Feishu.',
      bigLabel: 'Per script, down from three hours',
      facts: [
        ['Role', 'AI Project Lead; owner of the AI content workflow'],
        ['When', 'Aug 2024 – Oct 2025'],
        ['Company', 'Yinian Intelligence'],
        ['Platform', 'Feishu (Lark) agents'],
      ],
      results: [
        { v: '50+', l: 'Hit videos broken down, one by one' },
        { v: '3h → 20min', l: 'Time to write one script' },
        { v: 'First', l: 'AI-driven content workflow at the company' },
      ],
      sections: [
        {
          h: 'Why build it',
          p: ['The founder’s brand needed a steady stream of content, and one script took three hours. More people would not fix the volume or the uneven quality.'],
        },
        {
          h: 'How I worked',
          flow: [
            { t: 'Break down', n: ['Collect 50+ hit videos', 'Extract the logic behind each one'] },
            { t: 'Distill', n: ['Turn that logic into the agent’s rules and context'] },
            { t: 'Build', n: ['A “hit script” agent in Feishu'] },
            { t: 'Put it to work', n: ['Wire it into topic planning and script production'] },
          ],
          after: ['This is what organizing context means in practice: how well a model writes depends largely on how structured its inputs are.'],
        },
        {
          h: 'Results',
          list: [
            'One script went from three hours to twenty minutes.',
            'It became the company’s first AI-driven content production workflow.',
          ],
        },
      ],
    },
  },

  // ───────────────────────── 微众银行 AI 课程（一念智能） ─────────────────────────
  // Source: resume, 杭州一念智能 · 项目管理/危机处理.
  {
    slug: 'webank-rescue',
    kind: 'solution',
    big: { zh: '5 天', en: '5 days' },
    zh: {
      name: '微众银行 AI 课程',
      kind: '项目交付 · 一念智能',
      title: '48 小时找到病因，5 天交完 30 天的量。',
      sub: '一个 10.5 万元的 AI 课程项目，因为前期交付质量出了问题，客户信任受损、濒临违约。我临时接手。',
      card: '10.5 万元的项目濒临违约。接手后 48 小时诊断，5 天交完 30 天的量。',
      bigLabel: '完成原定 30 天的交付量',
      facts: [
        ['角色', '项目负责人，临时接手'],
        ['时间', '一念智能期间（2024.08 – 2025.10）'],
        ['客户', '微众银行'],
        ['团队', '2 人小组'],
      ],
      results: [
        { v: '48 小时', l: '完成诊断，拿出补救方案' },
        { v: '5 天', l: '完成原定 30 天的交付量' },
        { v: '3 节', l: 'AI 赋能课程，全部交付' },
        { v: '20–30 万', l: '级别的后续合作意向' },
      ],
      sections: [
        {
          h: '接手的时候',
          p: ['项目价值 10.5 万元。前期交付质量出了问题，客户的信任已经受损，项目随时可能违约，公司面临亏损。'],
        },
        {
          h: '我怎么做',
          flow: [
            { t: '48 小时内', n: ['诊断问题出在哪里', '制定补救方案'] },
            { t: '重建信任', n: ['开线上会议，把问题和方案摆到桌面上', '重建沟通节奏'] },
            { t: '交付', n: ['带 2 人小组', '5 天完成原定 30 天的量', '3 节 AI 赋能课程'] },
            { t: '之后', n: ['修复客户关系', '推动企业 AI 化陪跑的后续合作'] },
          ],
        },
        {
          h: '结果',
          list: [
            '客户点名要我继续负责项目剩下的部分。',
            '项目从潜在亏损，变成 20–30 万级别的后续合作意向。',
          ],
        },
      ],
    },
    en: {
      name: 'WeBank AI course',
      kind: 'Delivery · Yinian Intelligence',
      title: '48 hours to find the problem. Five days to deliver a month of work.',
      sub: 'A ¥105,000 AI training project for WeBank was close to default after early delivery problems had cost the client’s trust. I was brought in to take it over.',
      card: 'A ¥105,000 project close to default: diagnosed in 48 hours, 30 days of work delivered in five.',
      bigLabel: 'To deliver 30 days of planned work',
      facts: [
        ['Role', 'Project lead, brought in mid-project'],
        ['When', 'At Yinian Intelligence (Aug 2024 – Oct 2025)'],
        ['Client', 'WeBank'],
        ['Team', 'Two people'],
      ],
      results: [
        { v: '48 h', l: 'To diagnose and propose a recovery plan' },
        { v: '5 days', l: 'To deliver 30 days of planned work' },
        { v: '3', l: 'AI training sessions, all delivered' },
        { v: '¥200k–300k', l: 'Follow-on work under discussion' },
      ],
      sections: [
        {
          h: 'When I took over',
          p: ['The project was worth ¥105,000. Early delivery had gone wrong, the client’s trust was damaged, and the project could default at any moment, at a loss to the company.'],
        },
        {
          h: 'How I worked',
          flow: [
            { t: 'Within 48 hours', n: ['Find what actually went wrong', 'Write the recovery plan'] },
            { t: 'Rebuild trust', n: ['An online meeting with the problems and the plan on the table', 'A new rhythm of communication'] },
            { t: 'Deliver', n: ['A team of two', '30 days of planned work in five', 'Three AI training sessions'] },
            { t: 'After', n: ['A repaired relationship', 'Talks on ongoing AI adoption support'] },
          ],
        },
        {
          h: 'Results',
          list: [
            'The client asked for me by name to run the rest of the project.',
            'A likely loss became talks on ¥200,000–300,000 of follow-on work.',
          ],
        },
      ],
    },
  },
];
