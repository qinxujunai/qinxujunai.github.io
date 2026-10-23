// Three project pages, one each at /work/<slug>/ and /en/work/<slug>/.
// Every number has a source, noted next to it: a repository document, the resume, or src/stats.json ({ stat }).
// Section blocks the renderer understands: p, metrics, flow, scope, table, list, timeline, after.

const VF = 'https://github.com/qinxujunai/VoiceFlow';
const A2T = 'https://github.com/qinxujunai/Audio2Text';
const SIG = 'https://github.com/qinxujunai/ai-signal';

export const CASES = [
  // ───────────────────────── VoiceFlow ─────────────────────────
  // Sources: VoiceFlow README, docs/flagship-reliability-architecture.md, docs/decisions/ADR-001…005,
  // docs/model-strategy.md, docs/feedback-review-2026-07-28.md, docs/release-performance-evidence-2026-08-11.md,
  // docs/resource-profile-2026-07-28.md, docs/release-evidence-0.3.2/0.3.3/0.3.8.md,
  // docs/release-notes-0.3.9.md, docs/release-validation-0.3.9.md (822 tests, 2026-10-21),
  // docs/release-notes-0.3.10.md, docs/release-validation-0.3.10.md (829 tests; released 2026-10-22, tag c9df2cc), git tags (16),
  // requirements.lock (PySide6 6.11.1).
  {
    slug: 'voiceflow',
    kind: 'product',
    image: { key: 'site-voiceflow', mobile: 'site-voiceflow-m' },
    zh: {
      name: 'VoiceFlow',
      kind: '',
      title: '按一下，说话，文字就出现在光标处。',
      sub: 'Windows 上的语音输入，全程在本机完成，不联网，不用登录。',
      card: 'Windows 上的语音输入，全部在自己的电脑上完成。',
      // Home page: one plain line (what it does for you) above the picture, plain facts below it.
      line: '不想打字时，按 F2 说话，文字直接打在光标处',
      note: 'Windows 语音输入 · 装好后断网也能用 · 免费开源',
      // The judgement behind it, for the home page (from the sections below).
      why: '预览负责快，终稿只认完整录音；剪贴板没核对过，不算送达。',
      // Why he built it, in his words (his answer, 2026-10-21). Shown on the home page under the picture.
      story: '我常对着 AI 一说就是十几分钟。用过的输入法，网一卡，整段话就没了；最后几句常常出不来；光标不在输入框，说完的话直接消失。所以我做了一个全在本机跑的：说到最后一个字，就出来最后一个字。',
      imageAlt: 'VoiceFlow 的官网：让想法成文。按一下，说出你的话。',
      facts: [
        ['角色', '独立开发：产品、设计、工程、发布'],
        ['时间', '2026.05 至今'],
        ['形态', 'Windows 桌面应用，开源'],
        ['技术', 'Python · PySide6 · Sherpa-ONNX · SenseVoice · Zipformer'],
      ],
      links: [['打开官网', 'https://qinxujunai.github.io/VoiceFlow/'], ['下载 Windows 版', `${VF}/releases/latest`]],
      results: [
        { stat: 'stars', l: 'GitHub Star' },
        { v: '427 ms', l: '说完到文字送出（95% 的情况）' },
        { v: '829 项', l: '自动化测试' },
        { v: '16 次', l: '正式发布' },
      ],
      sections: [
        {
          h: '起因',
          p: [
            // His answer, 2026-10-21.
            '我用语音跟 AI 聊天、做开发，一说就是五六分钟，甚至十几分钟。',
            '试过的工具各有各的好：国外有能用 AI 校对的，要付费；国内的输入法识别得很好。但我碰到三个问题。第一，说完一结束，网一卡，整段话就没了。第二，最后几句常常识别不出来，可我要的是完整：说到最后一个字，就得出来最后一个字。第三，光标不在输入框里，说完的话直接消失。',
            '所以我想要一个全在本机跑的：没有网络延迟，说的每句话都完整落下；光标不在输入框，也先留在剪贴板，保证一个字都不丢。',
          ],
        },
        {
          h: '难点',
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
            { t: '界面进程（Qt）', n: ['所有操作走同一个入口', '全局热键 F2，先于模型启动', '原生绘制的录音胶囊', '交付与本地历史'] },
            { t: '三个受监督的子进程', n: ['录音进程：采集麦克风，同时留一份可恢复的录音', '预览进程：流式模型，边说边出字', '识别进程：SenseVoice 读完整段录音，出终稿'] },
            { t: '交付链', n: ['写入剪贴板，逐字回读核对', '复核停止那一刻的前台窗口', '只发一次 Ctrl+V，不盲目重试', '写进本地历史'] },
          ],
          after: [
            '每个子进程都有心跳、有界队列和强制结束路径。驱动或模型卡死，只重启那一个进程，界面和热键照常响应。',
            '每次听写都可以恢复。停下的那一刻，先锁定最后一段声音，预览随即作废，终稿只认对完整录音的识别结果。文字在剪贴板里核对无误、写进历史，才算完成；没送到的录音留在本机，下次启动时提醒找回。',
          ],
        },
        {
          h: '取舍',
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
          h: '验证',
          p: ['v0.3.1 在发布机上实测（Windows 11 · Ryzen 7 5800H）。每一档 20 个样本，数字是 95% 的情况都能做到的值：'],
          metrics: [
            { v: '6 ms', l: '按下 F2 到第一帧反馈', g: '门槛 ≤ 50 ms' },
            { v: '427 ms', l: '10 秒内的录音，说完到送出文字', g: '门槛 ≤ 500 ms' },
            { v: '541 ms', l: '两分钟的录音，说完到送出文字', g: '门槛 ≤ 2.5 s' },
            { v: '1,024 MB', l: '安装后私有内存（v0.3.1）', g: '早期 1,324.6 MB' },
          ],
          list: [
            '829 项自动化测试，v0.3.3 时是 396 项。',
            '500 次录音生命周期，10,000 组随机的开始、停止、取消、退出序列，50,000 个异常文本模糊用例。',
            '从 v0.3.2 起，每个版本都附一份发布与验证记录。',
            '用户提过的 12 条反馈，每条都写下结论和理由：采纳、按门槛暂缓，或者拒绝。',
          ],
          after: ['这些是延迟和机制的证据，不是准确率。项目的规矩：没有足够的授权真实语料，就不对外宣称准确率。'],
        },
        {
          h: '历程',
          timeline: [
            ['2026.05.23', '第一次提交'],
            ['2026.07.04', 'v0.1.0 发布'],
            ['2026.07.28', 'v0.2.0：逐条回应 12 条用户反馈'],
            ['2026.08.10', 'v0.3.0：可恢复的会话，交付前先核对剪贴板'],
            ['2026.08.25', 'v0.3.2：三个受监督的子进程，每版附发布证据'],
            ['2026.10.11', 'v0.3.8：原生胶囊'],
            ['2026.10.21', 'v0.3.9：设置只留一个保存入口，词典可以搜索、批量删除、撤销；822 项测试'],
            // VoiceFlow v0.3.10 (released 2026-10-22; docs/release-notes-0.3.10.md).
            ['2026.10.22', 'v0.3.10：设置界面按系统设置的样子重做；识别中的字逐个淡入，终稿原地替换草稿；829 项测试'],
          ],
        },
        {
          h: '还差什么',
          list: [
            '安装包还没有代码签名，Windows 会弹出安全提示。',
            '正式版只支持 Windows 10 / 11。',
            '中文、英文和混说的准确率还没有公开结论，要等足够的真实语料。',
            '两个识别模型常驻，私有内存约 1 GB，仍然是一笔不小的成本。',
            '它只能核对剪贴板，确认不了文字真的进了输入框；部分应用里还得手动按 Ctrl+V。',
          ],
        },
      ],
    },
    en: {
      name: 'VoiceFlow',
      kind: '',
      title: 'Press a key, talk, and the words appear at your cursor.',
      sub: 'Voice typing for Windows that runs entirely on the device: no internet, no account.',
      card: 'Voice typing for Windows, entirely on your own computer.',
      line: 'When typing is too slow, press F2, speak, and the words land at your cursor',
      note: 'Voice typing for Windows · Offline after install · Free, open source',
      why: 'The live preview is for speed; the final text trusts only the full recording. Nothing counts as delivered until the clipboard is checked.',
      story: 'I often talk to an AI for ten minutes or more at a time. With the voice input I used, one network hiccup and the whole passage was gone; the last few sentences often never appeared; if the cursor wasn’t in a text box, everything I said simply vanished. So I built one that runs entirely on my own computer: when I say the last word, the last word appears.',
      imageAlt: 'The VoiceFlow website (in Chinese): let ideas take shape. Press once, say what you mean.',
      facts: [
        ['Role', 'Solo: product, design, engineering, release'],
        ['When', 'May 2026 to now'],
        ['Form', 'Windows desktop app, open source'],
        ['Stack', 'Python · PySide6 · Sherpa-ONNX · SenseVoice · Zipformer'],
      ],
      links: [['Open the website', 'https://qinxujunai.github.io/VoiceFlow/?lang=en'], ['Download for Windows', `${VF}/releases/latest`]],
      results: [
        { stat: 'stars', l: 'GitHub stars' },
        { v: '427 ms', l: 'From stopping to text sent (95% of cases)' },
        { v: '829', l: 'Automated tests' },
        { v: '16', l: 'Releases' },
      ],
      sections: [
        {
          h: 'Why',
          p: [
            'I talk to AI by voice while I chat and build, often for five or six minutes at a time, sometimes more than ten.',
            'The tools I tried each had strengths: one from abroad could clean up text with AI, for a fee; the voice input on Chinese phones and PCs recognised speech well. But I kept hitting three problems. First, when I stopped, one network hiccup and the whole passage was gone. Second, the last few sentences often never appeared, when what I needed was all of it: the last word I say should be the last word on screen. Third, if the cursor wasn’t in a text box, everything I said simply vanished.',
            'So I wanted one that runs entirely on my own computer: no network delay, every sentence landing in full, and if there’s no text box, the words wait on the clipboard so not one is lost.',
          ],
        },
        {
          h: 'Hard parts',
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
          h: 'How it’s built',
          flow: [
            { t: 'UI process (Qt)', n: ['One entry point for every action', 'Global F2 hotkey, live before the models load', 'Natively painted recording capsule', 'Delivery and local history'] },
            { t: 'Three supervised workers', n: ['Recording: the microphone, plus a recoverable copy', 'Preview: a streaming model, text as you speak', 'Recognition: SenseVoice reads the whole clip for the final text'] },
            { t: 'Delivery chain', n: ['Write to the clipboard, read it back', 'Re-check the foreground window at stop', 'One Ctrl+V, never a blind retry', 'Save to local history'] },
          ],
          after: [
            'Every worker has a heartbeat, a bounded queue and a hard kill path. If a driver or model hangs, only that process restarts; the window and the hotkey keep responding.',
            'Every dictation can be recovered. Stopping locks in the last bit of audio, drops the preview, and trusts only SenseVoice’s pass over the full recording. It counts as done only when the clipboard checks out and history is written; anything undelivered stays on the machine and is offered back at the next launch.',
          ],
        },
        {
          h: 'Trade-offs',
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
          h: 'Evidence',
          p: ['Measured for v0.3.1 on the release machine (Windows 11, Ryzen 7 5800H). 20 samples per bucket; each number holds in 95% of cases:'],
          metrics: [
            { v: '6 ms', l: 'F2 to first feedback', g: 'Gate ≤ 50 ms' },
            { v: '427 ms', l: 'Clips under 10 s, stopping to text sent', g: 'Gate ≤ 500 ms' },
            { v: '541 ms', l: 'Two-minute clips, stopping to text sent', g: 'Gate ≤ 2.5 s' },
            { v: '1,024 MB', l: 'Private memory after install (v0.3.1)', g: 'Earlier 1,324.6 MB' },
          ],
          list: [
            '829 automated tests, up from 396 at v0.3.3.',
            '500 recording lifecycles, 10,000 random start, stop, cancel and exit sequences, 50,000 malformed-text fuzz cases.',
            'Since v0.3.2, every release ships with a release and verification record.',
            'Twelve pieces of user feedback, each with a written decision and reason: adopted, deferred behind a gate, or declined.',
          ],
          after: ['This is evidence about latency and mechanics, not accuracy. The project’s rule: no accuracy claims without enough authorized real speech.'],
        },
        {
          h: 'Timeline',
          timeline: [
            ['2026.05.23', 'First commit'],
            ['2026.07.04', 'v0.1.0 released'],
            ['2026.07.28', 'v0.2.0: a written answer to all 12 pieces of user feedback'],
            ['2026.08.10', 'v0.3.0: recoverable sessions; the clipboard is verified before delivery'],
            ['2026.08.25', 'v0.3.2: three supervised workers; evidence with every release'],
            ['2026.10.11', 'v0.3.8: native capsule'],
            ['2026.10.21', 'v0.3.9: one Save button in settings; a dictionary you can search, bulk-delete and undo; 822 tests'],
            ['2026.10.22', 'v0.3.10: settings redesigned after the system Settings app; words fade in as they’re recognised, and the final text replaces the draft in place; 829 tests'],
          ],
        },
        {
          h: 'Still missing',
          list: [
            'The installer is not code-signed yet, so Windows shows a warning.',
            'The release supports Windows 10 and 11 only.',
            'No public accuracy figures for Chinese, English or mixed speech until there is enough real speech to measure.',
            'Keeping two recognizers resident costs about 1 GB of private memory.',
            'It verifies the clipboard, not the target box; some apps still need a manual Ctrl+V.',
          ],
        },
      ],
    },
  },

  // ───────────────────────── AI Signal ─────────────────────────
  // Sources: ai-signal repository v3 (2026-10-20): README, scripts/prepare-digest.js, remix-digest.js, render.js,
  // .github/workflows/daily.yml; the first v3 issue (docs/archive/2026-10-20.html: 60 new items, 30 picked);
  // GitHub Actions history (last run of the old workflow 2026-07-22, state disabled_inactivity).
  // v4 (2026-10-22, commit 4647f40): README, scripts/sources.js, clock.js, daily.yml (04:07–09:47 queue, claim,
  // 09:35 collect, 10:00:00 send), scripts/test (7 tests); Actions history 2026-10-22 (09:41 cron started 14:32,
  // 10:17 cron 15:31); Reddit returns 403 to direct requests, so threads come via AINews (Latent Space RSS).
  // v4.1.0 (2026-10-23, GitHub Release; CHANGELOG.md): product site at the root, latest/, archive/, feed.xml (Atom, 30 issues),
  // MIT licence; scripts/test (8 tests).
  {
    slug: 'ai-signal',
    kind: 'product',
    image: { key: 'site-ai-signal', mobile: 'site-ai-signal-m' },
    zh: {
      name: 'AI Signal',
      kind: '',
      title: '每天上午一期，几分钟读完当天的 AI。',
      sub: '每天读一遍 X、Hacker News、Reddit、论文、新模型和各大实验室的博客，只留下值得看的，北京时间 10:00 整发到我的邮箱，也发布在网上。',
      card: '它替我读 X、Hacker News、论文和各家博客，只留下值得看的。',
      line: 'AI 消息太多，它每天挑出值得看的，一页读完',
      note: '北京时间每天 10:00 送达 · 每条都附原文 · 往期都能翻',
      why: '模型只能引用编号，链接由代码回填，写不出假链接。',
      // His answer, 2026-10-21.
      story: 'AI 的消息每天成百上千。难的不是看到，是分清哪些可信、哪些值得看；GitHub 上的好项目，我也想第一时间知道它能解决什么问题。所以我让它每天替我读一遍。',
      imageAlt: 'AI Signal 的网站：AI 的消息每天成百上千，它替你读一遍，只留下值得看的；下面是今天这期的标题和三条要点',
      facts: [
        ['角色', '独立开发'],
        ['时间', '2026.05 起；v4 于 2026.10'],
        ['形态', '自动化工作流，开源'],
        ['技术', 'Node.js · GitHub Actions · DeepSeek · SMTP'],
      ],
      links: [['打开官网', 'https://qinxujunai.github.io/ai-signal/'], ['今天这期', 'https://qinxujunai.github.io/ai-signal/latest/']],
      results: [
        { v: '11 类', l: '信源' },
        { v: '10:00', l: '每天准点送达' },
        // 10-23 issue: Send step 10:00:00–10:00:03 Beijing (run 39870655280).
        { v: '0 条', l: '模型自己写的链接' },
        // scripts/prepare-digest.js keeps data/seen.json for 60 days.
        { v: '60 天', l: '发过的内容不再重复' },
      ],
      sections: [
        {
          h: '起因',
          p: [
            // His answer, 2026-10-21.
            'AI 的信息太多：推文、播客、博客、论文、GitHub，每天几百条。难的不是看到，是分清哪些来自可信的来源、哪些是真正有价值的，而不是噪音。GitHub 上的好项目，我也想第一时间知道它能解决什么问题。',
            '我觉得在 AI 时代，提出一个好问题会越来越重要；好问题背后是判断力，判断力靠长期吃进好的信息。所以我想要一位靠谱的编辑：每天替我读一遍，只留下会改变判断的内容，几分钟读完。',
          ],
        },
        {
          h: '难点',
          list: [
            '模型会编。让它自己写链接和数字，迟早会出现一个看起来很真的假链接。',
            '同一件事会在博客、Hacker News 和推文里同时出现，不合并就是重复。',
            '它会悄悄停掉。2026-07-22 之后，GitHub 因为项目 60 天没有更新，暂停了定时任务；简报停发了将近三个月，没有任何报错。',
            '旧的信源在烂：GitHub Trending 用的第三方接口失效了，机器之心的 RSS 也没了，旧的反馈按钮指向一个 404 的服务。',
            '从来没准点过。GitHub 的定时任务高峰期会晚好几个小时：10-22 定在 09:41 的任务，14:32 才开始跑，还可能直接被丢掉。',
            'Reddit 拒绝自动请求，直接抓会被 403。',
          ],
        },
        {
          h: '边界',
          scope: {
            do: ['聚合公开信源', '按写死的编辑标准挑选、合并、改写', '每天一封邮件、一期网页版和 RSS，每条都附原文'],
            dont: ['需要 X、YouTube 的 API key', '做 App 和账号体系', '追踪读者：没有像素，没有点击统计'],
          },
        },
        {
          h: '架构',
          flow: [
            { t: '排队', n: ['北京时间 04:07 到 09:47，每 20 分钟排一次', '第一个启动的任务认领当天，其余看到就退出'] },
            { t: '收集 · 09:35', n: ['X 上的 builder、播客（follow-builders）', 'OpenAI、Anthropic、DeepMind、Google AI、Qwen 等官方博客', 'Hacker News、Techmeme、Reddit（经 AINews 汇总）', '论文热榜、Hugging Face 热门模型、GitHub 今日趋势、Product Hunt', '量子位、36氪', '去掉 60 天内发过的'] },
            { t: '编号', n: ['每条素材一个编号：H3、R1、M2…'] },
            { t: '编辑 · DeepSeek', n: ['按「三问」挑选，多来源合并', '只输出 JSON，只能引用编号'] },
            { t: '回填', n: ['代码按编号填回链接、分数、star 数', '编号不存在，这条直接丢弃', '模型失败：按热度排出降级版'] },
            { t: '送达 · 10:00', n: ['等到 10:00:00 发出，发之前再查一次今天发过没有', '邮件主题就是当天的标题', '同时发布网页版和往期'] },
          ],
          after: [
            '编辑标准写在提示词里，每条内容必须过三问：读者会因为这条信息做出不同的决策吗？这是新的事实，还是噪音？有没有具体的数字或名字？',
            '排版参照 Apple 的新闻邮件和 Stratechery：白底黑字，层级只靠字号、字重和留白，全期只有链接一种颜色。开头是期号、当天最重要的一件事和主编的一句话；头条写「为什么重要」；每条下面一行写分类、信号强度（●●○）、来源和讨论；之后是社区在聊、观点、新模型、新产品、论文、开源、快讯。',
            '信号强度：几个独立来源报道了同一件事，或者社区里讨论得有多热，最多三个点。',
          ],
        },
        {
          h: '取舍',
          table: {
            head: ['决定', '原因', '放弃的方案'],
            rows: [
              ['模型只引用编号，不写链接', '链接和数字最容易被编造；由代码回填，至少保证它们真实存在', '让模型直接写，再事后校验'],
              ['每天发布一期网页版', '既是存档，也让定时任务不会因为 60 天无活动被暂停', '只发邮件，不留痕迹'],
              ['去掉 👍 / 👎 和追踪像素', '接收反馈的服务早已返回 404，留着就是坏链接', '假装有反馈回路'],
              ['Hacker News 改用 Algolia，按整词匹配', '旧做法只看首页 30 条，按子串匹配，「said」也会被当成 AI', '首页接口'],
              ['凌晨起每 20 分钟排一次，先认领再等到 10:00', '只用 GitHub 就能吃下几个小时的延迟，不用另租服务器', '外部定时服务去触发'],
              ['Reddit 经 AINews 的每日汇总', '直接请求被 403；AINews 每天整理 Reddit 热帖，带讨论热度', '登录 Reddit 接口，要管账号和密钥'],
              ['用 DeepSeek 的 chat 模型', '一年几美元', '更贵的推理模型'],
            ],
          },
        },
        {
          h: '验证',
          list: [
            'v3 第一期（2026-10-20）从 60 条新内容里选出 30 条，自动发信，并发布网页版和往期。',
            '链接和数字全部来自原始数据；模型引用了不存在的编号，这条就不会出现。',
            '模型无响应时照样发出一期，按来源热度排序，并在邮件里写明；某个信源挂了，页脚会写出来。',
            '发过的链接记录 60 天，下一期不会重复。',
            '8 组自动测试：各信源的解析、热度、北京时间的计算、配色上限，以及网站和 RSS；每次提交都在云端跑一遍。',
            '准点：2026-10-23 那期，北京时间 10:00:00 开始发送，10:00:03 发完；同一早上排队的另一次运行看到已发，自动退出，没有重复发（GitHub 运行记录）。',
          ],
        },
        {
          h: '历程',
          timeline: [
            ['2026.05', '第一版：follow-builders 的推文和播客，LLM 策展，邮件送达'],
            ['2026.05.22', 'v2：加入 Hacker News、ArXiv、GitHub、中文媒体'],
            ['2026.07.22', '最后一次自动发送；之后定时任务因 60 天无提交被暂停'],
            ['2026.10.20', 'v3：重写信源、编辑方式和排版，恢复每日发送'],
            ['2026.10.22', 'v4：10:00 整送达；加入 Techmeme、Reddit、热门模型、Product Hunt、Anthropic、Qwen、36氪；版式改成白底黑字，只留链接一种颜色'],
            ['2026.10.23', 'v4.1：有了自己的网站，打开先看到它是什么和今天这期的要点；加上 RSS、开源许可和版本发布'],
          ],
        },
        {
          h: '还差什么',
          list: [
            '推文和播客仍依赖第三方的 follow-builders feed，它一停，这两类就会断。',
            '准点靠 GitHub 在早上把十几次排队里的任意一次及时启动；一次都没轮上，那天就由 10 点以后的补发兜底，会晚。',
            'Reddit 依赖 AINews 的汇总，它哪天停更，社区这一栏就会空。',
            '没有读者反馈回路；编辑标准只能靠人读了再改。',
            '模型可能引错编号：链接是真的，但不一定配对。第一期里也还有「正面挑战」「标志性」这类编辑标准不允许的评语。',
          ],
        },
      ],
    },
    en: {
      name: 'AI Signal',
      kind: '',
      title: 'One issue each morning: the day’s AI in a few minutes.',
      sub: 'Every day it reads X, Hacker News, Reddit, papers, new models and lab blogs, keeps what’s worth reading, and sends it to my inbox at exactly 10:00 Beijing time, and to the web.',
      card: 'It reads X, Hacker News, papers and lab blogs for me, and keeps what’s worth reading.',
      line: 'Too much AI news? It picks what’s worth reading each day, on one page',
      note: 'Arrives daily at 10:00 Beijing time · Every item links to its source · Full archive',
      why: 'The model may only cite item numbers; code fills in every link, so it cannot invent one.',
      story: 'Hundreds of AI updates arrive every day. The hard part isn’t seeing them; it’s telling which are credible and which are worth reading. I also want to know about good GitHub projects early, and what problem each one solves. So it reads everything for me each morning.',
      imageAlt: 'The AI Signal website (in Chinese): it reads the day’s AI news for you and keeps what’s worth reading; below, today’s headline and three key points',
      facts: [
        ['Role', 'Built solo'],
        ['When', 'Since May 2026; v4 in Oct 2026'],
        ['Form', 'Automated workflow, open source'],
        ['Stack', 'Node.js · GitHub Actions · DeepSeek · SMTP'],
      ],
      links: [['Open the website', 'https://qinxujunai.github.io/ai-signal/'], ['Today’s issue', 'https://qinxujunai.github.io/ai-signal/latest/']],
      results: [
        { v: '11', l: 'Source types' },
        { v: '10:00', l: 'On time, every day' },
        { v: '0', l: 'Links written by the model' },
        { v: '60 days', l: 'Before anything repeats' },
      ],
      sections: [
        {
          h: 'Why',
          p: [
            'There is too much AI news: posts, podcasts, blogs, papers, GitHub. Hundreds of items a day. The hard part isn’t seeing them; it’s telling which come from credible sources and which are worth anything, rather than noise. I also want to know about good GitHub projects early, and what problem each one solves.',
            'In the age of AI, asking a good question matters more and more; behind a good question is judgement, and judgement is built by taking in good information over a long time. So I wanted a dependable editor: someone who reads everything each day and keeps only what would change a decision, readable in a few minutes.',
          ],
        },
        {
          h: 'Hard parts',
          list: [
            'Models make things up. Let one write links and numbers and sooner or later a convincing fake appears.',
            'The same story shows up on a blog, on Hacker News and on X at once. Without merging, it repeats.',
            'It can stop silently. After 2026-07-22, GitHub paused the schedule because the project had not been updated for 60 days. The briefing stopped for almost three months with no error anywhere.',
            'Old sources rot: the third-party GitHub Trending API died, a Chinese media RSS feed disappeared, and the old feedback buttons pointed at a service returning 404.',
            'It was never on time. GitHub’s scheduler runs hours late at busy times: on 22 Oct the 09:41 job started at 14:32. It may also drop runs.',
            'Reddit refuses automated requests with a 403.',
          ],
        },
        {
          h: 'Scope',
          scope: {
            do: ['Aggregate public sources', 'Select, merge and rewrite to a fixed editorial brief', 'One email, one web issue and an RSS entry a day, every item linked'],
            dont: ['Require X or YouTube API keys', 'Build an app or accounts', 'Track readers: no pixels, no click counting'],
          },
        },
        {
          h: 'How it’s built',
          flow: [
            { t: 'Queue', n: ['A run every 20 minutes from 04:07 to 09:47 Beijing', 'The first to start claims the day; the rest stop'] },
            { t: 'Collect · 09:35', n: ['Builders on X and podcasts (follow-builders)', 'OpenAI, Anthropic, DeepMind, Google AI, Qwen and other lab blogs', 'Hacker News, Techmeme, Reddit (via AINews)', 'HF Daily Papers and trending models, GitHub Trending, Product Hunt', 'QbitAI, 36Kr', 'Drop anything sent in the last 60 days'] },
            { t: 'Number', n: ['Every item gets an ID: H3, R1, M2…'] },
            { t: 'Edit · DeepSeek', n: ['Select by three questions, merge sources', 'JSON only, IDs only'] },
            { t: 'Resolve', n: ['Code fills in links, scores and stars by ID', 'Unknown ID: the item is dropped', 'Model down: a ranked fallback issue'] },
            { t: 'Deliver · 10:00', n: ['Sent at 10:00:00, after checking once more that today hasn’t gone out', 'The subject line is the day’s headline', 'A web edition and archive go up the same day'] },
          ],
          after: [
            'The editorial standard lives in the prompt. Every item must pass three questions: Would the reader decide differently because of it? Is it a new fact or noise? Does it carry a concrete number or name?',
            'The layout follows Apple’s own newsletters and Stratechery: black type on white, hierarchy from size, weight and space alone, and one colour, for links. It opens with the issue number, the day’s one big thing and an editor’s line; the lead says why it matters; one line under every item gives its tag, signal strength (●●○), source and discussion; then community, voices, new models, new products, papers, open source and quick hits.',
            'Signal strength: how many independent sources covered the story, or how hot the discussion is, up to three dots.',
          ],
        },
        {
          h: 'Trade-offs',
          table: {
            head: ['Decision', 'Why', 'Given up'],
            rows: [
              ['The model cites IDs, never links', 'Links and numbers are the easiest things to invent; filled in by code, they at least always exist', 'Let the model write them and check afterwards'],
              ['Publish a web edition every day', 'It is the archive, and it keeps the schedule from being paused after 60 quiet days', 'Email only, no trace'],
              ['Remove 👍 / 👎 and the tracking pixel', 'The feedback service had been returning 404; keeping them meant broken links', 'Pretending there is a feedback loop'],
              ['Hacker News through Algolia, whole-word matching', 'The old code read 30 front-page stories and matched substrings, so “said” counted as AI', 'The front-page API'],
              ['Queue from before dawn every 20 minutes; claim first, then wait for 10:00', 'GitHub alone absorbs hours of delay, with no server to rent', 'An external scheduler triggering the run'],
              ['Reddit through AINews’ daily recap', 'Direct requests get a 403; AINews collects the hottest threads every day, with their activity', 'Logging in to Reddit’s API, with an account and keys to manage'],
              ['DeepSeek’s chat model', 'A few dollars a year', 'A pricier reasoning model'],
            ],
          },
        },
        {
          h: 'Evidence',
          list: [
            'The first v3 issue (2026-10-20) picked 30 of 60 new items, went out by email, and published a web edition and archive.',
            'Every link and number comes from the raw data; an item that cites an unknown ID never appears.',
            'If the model is down, an issue still goes out, ranked by source signal and labelled as such; a failed source is named in the footer.',
            'Sent links are remembered for 60 days, so nothing repeats.',
            'Eight groups of automated tests (source parsing, signal strength, Beijing-time arithmetic, the colour limit, the website and RSS) run in the cloud on every commit.',
            'On time: the 23 Oct issue began sending at 10:00:00 Beijing time and finished at 10:00:03; another queued run that morning saw it had gone out and stopped, so nothing was sent twice (GitHub run log).',
          ],
        },
        {
          h: 'Timeline',
          timeline: [
            ['2026.05', 'First version: follow-builders posts and podcasts, LLM curation, email'],
            ['2026.05.22', 'v2: Hacker News, ArXiv, GitHub and Chinese media added'],
            ['2026.07.22', 'Last automatic send; the schedule was then paused after 60 days without commits'],
            ['2026.10.20', 'v3: new sources, editing and layout; daily sends restored'],
            ['2026.10.22', 'v4: on the hour at 10:00; Techmeme, Reddit, trending models, Product Hunt, Anthropic, Qwen and 36Kr added; black on white, one colour for links'],
            ['2026.10.23', 'v4.1: a website of its own that opens with what it is and today’s key points; RSS, an open-source licence and versioned releases'],
          ],
        },
        {
          h: 'Still missing',
          list: [
            'Posts and podcasts still depend on the third-party follow-builders feed.',
            'Punctuality depends on GitHub starting any one of a dozen morning runs in time; if none does, the late backups after 10:00 send it, late.',
            'Reddit depends on the AINews recap; if it stops, the community section goes empty.',
            'There is no reader feedback loop; the editorial brief improves only when someone reads and edits it.',
            'The model can cite the wrong ID: the link is real but may not match the item. The first issue still had phrases the brief forbids, like “a head-on challenge”.',
          ],
        },
      ],
    },
  },

  // ───────────────────────── 万象成文 ─────────────────────────
  // Sources: Audio2Text README (positioning, scope, platform table, live smoke 2026-08-11, loopback port + token,
  // SHA-256/SBOM/provenance), AGENTS.md (text priority, FastAPI, 521 KB → 2 KB, 30–40%), docs/transcription-benchmark.md,
  // docs/platform-benchmark-20261021.md (five platforms, 137/180, 4 timeouts; history),
  // v2.3.0 (released 2026-10-23, frozen a192250): docs/project-status.md, docs/release-2.3.0.md,
  // docs/platform-benchmark-20261022.md (same 60 links × 3 rounds: 141/180, 0 timeouts; installed app: a 2,804 s
  // Bilibili video gave text in 25.452 s, original video at 92.970 s; DASH-only background video was 854×462 vs 1280×692),
  // docs/ascend-accuracy-20261012.md (ASCEND, SenseVoice FP32 on CUDA: CER 9.31%, WER 23.34%, MER 15.52%; 72-clip
  // same-audio test vs Whisper medium; same-weight CPU/CUDA 12.65×), the live site's platform list (YouTube retired 2026-10-21).
  {
    slug: 'wanxiang',
    kind: 'product',
    image: { key: 'site-wanxiang', mobile: 'site-wanxiang-m' },
    zh: {
      name: '万象成文',
      kind: '',
      title: '贴一个链接，拿回一篇文字。',
      sub: '视频、播客、图文链接或本地音视频文件都行，Windows 版，全程在本机处理。',
      card: '视频、播客、图文都行。',
      line: '视频和播客里的内容，贴个链接就变成文字',
      note: 'Windows 版 · B 站、小宇宙、公众号已验证 · 本机处理不用显卡',
      why: '能读字幕和正文，就不转写；不用显卡也能跑。',
      // His WeChat post the night he started (2026) and his answer (2026-10-21).
      story: '我想把一期两个小时的小宇宙播客转成文字，拿去跟 AI 聊。试了几个小程序，要么太长转不动，要么太贵。我不会写代码，那天晚上，还是按下了 Win+R。',
      imageAlt: '万象成文的官网：把视频、播客和图文，直接变成可用的文字与媒体。',
      facts: [
        ['角色', '独立开发'],
        ['时间', '2026'],
        ['形态', 'Windows 桌面应用，另有网页预览'],
        ['技术', 'Tauri 2 · React · FastAPI · SenseVoice · Faster-Whisper · yt-dlp'],
      ],
      links: [['打开官网', 'https://qinxujunai.github.io/Audio2Text/'], ['下载 Windows 版', `${A2T}/releases/latest`]],
      results: [
        { v: '25 秒', l: '47 分钟视频出文字（实测）' },
        { v: '0 次', l: '超时（三轮 180 次）' },
        { v: '约 2 分钟', l: '普通 CPU 转写 1 小时音频' },
        { stat: 'downloads', l: '次安装包下载' },
      ],
      sections: [
        {
          h: '起因',
          p: [
            // His WeChat post the night he started (2026) and his answer (2026-10-21).
            '我常听小宇宙的播客，一期两三个小时，有的更长。有一期我觉得特别有价值，想转成文字，拿去跟 AI 聊。试了好几个小程序，要么时长太长转不动，要么收费太贵。',
            '我想，这功能用代码实现应该不难吧？可我不会写代码。命令行那个黑底白字的界面，光想想就觉得不是我能碰的世界。那天晚上我跟 AI 说：别给我列计划了，直接带我做。它说，第一步，按 Win+R。我按了。',
            '代码跑通、第一次找到我下载的那个音频文件时，我是真的开心，很具体的那种「我居然做到了」。那晚我在朋友圈写：今晚我上车了。',
            '后来它长成了现在的样子：给它一个链接或一个文件，拿回可用的文字和原始媒体。',
          ],
        },
        {
          h: '难点',
          list: [
            '每个平台的结构都不一样，而且经常变；抖音和小红书还会在会话或网络受限时拦截。',
            '转写又慢又吃机器，不能要求每个人都有显卡。',
            '长视频要先下完整段原视频才能转写，几百 MB 的文件会把整件事拖到超时。',
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
            { t: '取文字', n: ['平台字幕 → 页面正文 → 转写', '命中字幕或正文，就跳过转写', '视频先下音轨，马上出文字；原视频在后台补齐'] },
            { t: '转写', n: ['默认 SenseVoice，CPU 即可', '有 NVIDIA 显卡时可以走 CUDA', 'CPU 版和显卡版在不同进程里，互不干扰'] },
          ],
          after: ['同一套服务也能部署成网页预览；Windows 桌面端是完整的主产品。'],
        },
        {
          h: '取舍',
          table: {
            head: ['决定', '原因', '放弃的方案'],
            rows: [
              ['默认用 SenseVoice', '在 CPU 上，SenseVoice 的实时率约 0.035（1 小时音频约 2 分钟转完），Faster-Whisper medium 约 2.01。同一批 72 段人工标注的语音、都在显卡上跑 3 轮：普通话错误率 SenseVoice 12.75%、Whisper medium 37.50%，用时 23 秒对 138 秒', '默认上更大的模型'],
              ['能读字幕和正文，就不转写', '最快的转写，是不用转写', '所有内容统一走转写'],
              ['先出文字，原视频后台补齐', '旧的 4 次超时都卡在转写前下载完整原视频（样本 260 MB）；改完同一批链接三轮 0 次超时', '等原视频下完再转写'],
              ['后台补的原视频仍取原画质', '只取分段流会更快，但同一段视频只有 854×462，原视频是 1280×692', '用清晰度换速度'],
              ['小红书直接读页面里的结构化数据', '不再传整页 HTML：传输量从 521 KB 降到 2 KB，总耗时少 30–40%', '先抓整页，再解析'],
              ['只做三件事', '账号、支付、工作台，会把一个工具变成一个平台', '做成平台'],
            ],
          },
        },
        {
          h: '历程',
          // His answer, 2026-10-21.
          timeline: [
            ['第一步', '先在命令行里跑起来：装好 FFmpeg，下载转写模型，直到第一次转出文字'],
            ['第二步', '给它一个好用的界面，参照苹果的设计来做'],
            ['第三步', '小红书等平台的图片和文字也能抓，下载原图原视频，不带平台水印'],
            ['之后', '一遍遍地改，直到稳定可用'],
            // Audio2Text v2.3.0, released 2026-10-23.
            ['2026.10.23', 'v2.3.0：AI 校对、显卡加速、处理时显示还要多久；视频先出文字，原视频后台补齐'],
          ],
        },
        {
          h: '验证',
          list: [
            '2026-08-11 用真实样本跑了一轮线上冒烟测试：B 站、小宇宙、抖音、公众号通过；小红书一篇 15 张图、14 个 Live 片段的图文通过。',
            '2026-10-21：5 个平台、60 条链接，各跑 3 轮。180 次里 137 次完整拿到结果，4 次超时，所以 2.3 那时没有发布。',
            '2026-10-22，改完后用同一批链接重跑 3 轮：141 次完整，0 次超时。B 站 57/57、公众号 30/30、小宇宙 27/30、抖音 24/30、小红书 3/33；失败全部留在分母里。',
            '准确率：在公开语料 ASCEND（香港的中英双语对话，人工标注）上，显卡版 SenseVoice 的普通话字错误率 9.31%、英文词错误率 23.34%、中英混说 15.52%（5,735 段，各跑 3 轮）。',
            'v2.3.0 的安装包先在他的电脑上、再在一台全新的 Windows 上验收；发布的就是验收过的同一个文件，从官网下载后核对 SHA-256 一致。',
            '每个平台的状态都公开写在说明页，标明最近一次验证的日期，不当作永久承诺。',
            '安装包、运行包和发布产物都提供 SHA-256；GitHub Actions 同时生成 SBOM 和构建来源证明。',
          ],
        },
        {
          h: '还差什么',
          list: [
            '安装包还没有代码签名，Windows 会弹出安全提示。',
            // docs/platform-benchmark-20261022.md: 39 failures, kept in the denominator.
            '三轮里还有 39 次没拿到：10 条不带分享参数的旧小红书链接读不到；2 条抖音作品分享接口返回空，原因还没查清，不能说登录就能解决；1 期小宇宙读不到内容。',
            '英文的错误率还偏高。测评语料是香港的对话，代表不了方言、背景音乐和所有长视频；不用显卡的版本用的是另一套权重，还没做同样规模的测评。',
            '只有 Windows 版。',
          ],
        },
      ],
    },
    en: {
      name: 'Wanxiang',
      kind: '',
      title: 'Paste a link, get the text back.',
      sub: 'Videos, podcasts, articles or local recordings, handled on the device by a Windows app.',
      card: 'Videos, podcasts and articles all work.',
      line: 'What’s said in a video or podcast, turned into text from a pasted link',
      note: 'For Windows · Tested on Bilibili, Xiaoyuzhou and WeChat articles · Runs locally, no GPU',
      why: 'If there are subtitles or page text, it skips transcription. No GPU needed.',
      story: 'I wanted to turn a two-hour podcast episode into text so I could discuss it with an AI. The apps I tried either couldn’t handle the length or cost too much. I couldn’t code. That night I pressed Win+R anyway.',
      imageAlt: 'The Wanxiang website (in Chinese): turn videos, podcasts and articles into usable text and media.',
      facts: [
        ['Role', 'Built solo'],
        ['When', '2026'],
        ['Form', 'Windows desktop app, plus a web preview'],
        ['Stack', 'Tauri 2 · React · FastAPI · SenseVoice · Faster-Whisper · yt-dlp'],
      ],
      links: [['Open the website', 'https://qinxujunai.github.io/Audio2Text/'], ['Download for Windows', `${A2T}/releases/latest`]],
      results: [
        { v: '25 s', l: 'Text from a 47-minute video (measured)' },
        { v: '0', l: 'Timeouts (180 runs)' },
        { v: '~2 min', l: 'An hour of audio on an ordinary CPU' },
        { stat: 'downloads', l: 'Installer downloads' },
      ],
      sections: [
        {
          h: 'Why',
          p: [
            'I listen to podcasts on Xiaoyuzhou; an episode runs two or three hours, sometimes longer. One felt so valuable that I wanted it as text, to discuss with an AI. The apps I tried either couldn’t handle the length or cost too much.',
            'Surely this couldn’t be hard to do in code? But I couldn’t code. The black-and-white command line felt like a world I wasn’t allowed into. That night I told the AI: skip the study plan, just walk me through it. It said: step one, press Win+R. I pressed it.',
            'When the code first ran and found the audio file I had downloaded, I was genuinely happy, the very specific kind of “I actually did it”. That night I posted: tonight, I got on the train.',
            'It has since grown into what it is now: give it a link or a file, and get usable text and the original media back.',
          ],
        },
        {
          h: 'Hard parts',
          list: [
            'Every platform is structured differently and changes often; Douyin and Xiaohongshu block requests when a session or network looks wrong.',
            'Transcription is slow and hardware-hungry, and not everyone has a GPU.',
            'A long video used to be downloaded in full before transcription; a file of a few hundred MB could stall the whole job until it timed out.',
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
          h: 'How it’s built',
          flow: [
            { t: 'Desktop shell', n: ['Tauri 2 (Rust) + React', 'First run fetches only what it needs, about 222 MB', 'Runtime packs verified by SHA-256'] },
            { t: 'Local service', n: ['FastAPI, launched with the app', 'Listens only on a random local port', 'A short-lived token per launch', 'Progress streamed over SSE'] },
            { t: 'Get the text', n: ['Platform subtitles → page text → transcription', 'If subtitles or text exist, skip transcription', 'Video: fetch the audio first and deliver the text; the original video follows in the background'] },
            { t: 'Transcribe', n: ['SenseVoice on CPU by default', 'CUDA on an NVIDIA GPU, when there is one', 'CPU and GPU runtimes in separate processes'] },
          ],
          after: ['The same service can also run as a web preview; the Windows app is the complete product.'],
        },
        {
          h: 'Trade-offs',
          table: {
            head: ['Decision', 'Why', 'Given up'],
            rows: [
              ['SenseVoice by default', 'On a CPU, SenseVoice runs at a real-time factor of about 0.035 (an hour of audio in about two minutes) versus about 2.01 for Faster-Whisper medium. On the same 72 hand-transcribed clips, both on a GPU, three rounds: Mandarin character error rate 12.75% for SenseVoice and 37.50% for Whisper medium, in 23 s against 138 s', 'A bigger default model'],
              ['Use subtitles and page text when they exist', 'The fastest transcription is the one you skip', 'Transcribe everything'],
              ['Text first, original video in the background', 'All 4 old timeouts were waiting for the whole original video (a 260 MB sample) before transcription; with the change, the same links ran three rounds with no timeouts', 'Wait for the video, then transcribe'],
              ['The background video keeps the original quality', 'The split streams alone are faster, but the same video came out at 854×462 instead of the original 1280×692', 'Trading resolution for speed'],
              ['Read Xiaohongshu’s structured page data directly', 'No full-page HTML: transfer fell from 521 KB to 2 KB and total time by 30–40%', 'Fetch the page, then parse it'],
              ['Do three things only', 'Accounts, payments and workspaces turn a tool into a platform', 'Becoming a platform'],
            ],
          },
        },
        {
          h: 'Timeline',
          timeline: [
            ['Step 1', 'Get it running in the command line: install FFmpeg, download a transcription model, until the first text came out'],
            ['Step 2', 'Give it a good interface, modelled on Apple’s design'],
            ['Step 3', 'Pull images and text from Xiaohongshu and other platforms too, without their watermarks'],
            ['Since', 'Rework it again and again until it was stable'],
            ['2026.10.23', 'v2.3.0: AI proofreading, GPU acceleration, an estimate of the time left; video text first, the original in the background'],
          ],
        },
        {
          h: 'Evidence',
          list: [
            'A live smoke test with real samples on 2026-08-11: Bilibili, Xiaoyuzhou, Douyin and WeChat articles passed; a Xiaohongshu post with 15 images and 14 Live clips passed.',
            '2026-10-21: five platforms, 60 links, three rounds each. 137 of 180 runs delivered in full and 4 timed out, so 2.3 was held back.',
            '2026-10-22, after the fixes, the same links over three rounds: 141 delivered in full, no timeouts. Bilibili 57/57, WeChat 30/30, Xiaoyuzhou 27/30, Douyin 24/30, Xiaohongshu 3/33; every failure stays in the count.',
            'Accuracy: on the public ASCEND corpus (hand-transcribed Hong Kong conversations in Chinese and English), the GPU build of SenseVoice scored a Mandarin character error rate of 9.31%, an English word error rate of 23.34% and 15.52% on mixed speech (5,735 clips, three rounds each).',
            'The v2.3.0 installer was accepted on his own PC and then on a clean Windows machine; the file released is that same file, and a download from the website matches its SHA-256.',
            'Each platform’s status is published with the date of its last check, not as a permanent promise.',
            'Installers, runtime packs and release files all carry SHA-256; GitHub Actions also produces an SBOM and build provenance.',
          ],
        },
        {
          h: 'Still missing',
          list: [
            'The installer is not code-signed yet, so Windows shows a warning.',
            '39 of the 180 runs still failed: 10 old Xiaohongshu links without their share parameters can’t be read; for 2 Douyin posts the share API returns nothing, for reasons not yet known, so signing in isn’t a proven fix; 1 Xiaoyuzhou episode has no readable content.',
            'The English error rate is still high. The test corpus is Hong Kong conversation; it can’t stand in for dialects, background music or every long video. The CPU build uses different weights and hasn’t been tested at the same scale.',
            'Windows only.',
          ],
        },
      ],
    },
  },

];
