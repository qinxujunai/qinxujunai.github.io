// Every word on the home page lives here, in both languages. Case studies live in src/cases.mjs.
// Facts must trace to the owner's own words, his repositories, his resume, or his answers. See CLAUDE.md.
// Lines marked "his words" are verbatim from text he committed himself (ai.vibecoding, May 2026).

export const SITE = 'https://qinxujunai.github.io';
export const GITHUB = 'https://github.com/qinxujunai';
// Links go to the project's live site, not its source (his request, 2026-10-20).
export const VIBECODING = 'https://qinxujunai.github.io/qinxujun-ai-vibecoding/';

// Photographs: his own. Landscapes, buildings and objects only.
const photos = (alt) => [
  { key: 'photo-aerial', alt: alt[0] },
  { key: 'photo-pagoda', alt: alt[1] },
  { key: 'photo-buddha', alt: alt[2], tall: true },
  { key: 'photo-gate', alt: alt[3] },
  { key: 'photo-wall', alt: alt[4] },
  { key: 'photo-dusk', alt: alt[5] },
  { key: 'photo-sky', alt: alt[6] },
  { key: 'photo-autumn', alt: alt[7] },
];

export const content = {
  zh: {
    lang: 'zh-CN',
    path: '/',
    title: '秦徐俊',
    description: '秦徐俊。我用 AI 做自己每天在用的东西：VoiceFlow、AI Signal、万象成文。',
    skip: '跳到正文',
    switchLabel: 'English',
    switchLang: 'en',
    themeLabel: '切换深色或浅色',
    name: '秦徐俊',
    // The name card's two lines under the name. He presents himself, not an employer or a job title.
    role: '用 AI 做东西',
    org: 'qinxujunai.github.io',
    portraitAlt: '秦徐俊的照片',
    eyebrow: '',
    lede: '我用 AI 做自己每天在用的东西。',
    now: '说一句话就变成文字的 VoiceFlow，每天替我读 AI 新闻的 AI Signal，把视频变成文章的万象成文。工作里，我帮公司把 AI 用进业务。',
    addWechat: '加我微信',
    navWechat: '加微信',
    seeWork: '看看作品',
    navLabel: '章节',
    nav: { work: '作品', thinking: '想法', method: '方法', path: '经历', contact: '联系' },
    home: '首页',

    workTitle: '作品',
    workHeadline: '我做的东西。',
    workIntro: '',
    productsLabel: '我做的东西',
    solutionsLabel: '工作里做的事',
    readCase: '怎么做的',
    siteLabel: '官网',
    flagship: {
      key: 'F2',
      hint: '按一下开始，再按一下完成',
      lines: ['请比较这两份方案的成本与风险，再给出你的建议。', '明早十点，把方案同步给团队。', '这周的方案已经整理好了，明天一起看看。'],
      body: 'Windows 上的语音输入。全部在你自己的电脑上完成，不联网，不登录。',
      facts: { stars: 'GitHub Star', downloads: '次下载', forks: 'Fork', version: '最新版本' },
      factsNote: (date) => `数据每 6 小时从 GitHub 自动更新，最近一次：${date}。`,
    },

    thinkingTitle: '我怎么用 AI',
    thinkingHeadline: '让 AI 负责拆解、生成与验证，让你守住目标、边界与品味。', // his words
    thinkingSource: ['摘自我写的 ', 'ai.vibecoding'],
    abilitiesHeadline: '',
    abilities: [
      {
        label: '',
        title: '提出问题', // his words
        body: '问题定义得越清楚，模型越像工程伙伴，而不是许愿池。', // his words
      },
      {
        label: '',
        title: '组织上下文', // his words
        body: '上下文越结构化，输出越接近你的真实意图。', // his words
      },
      {
        label: '',
        title: '交付确定性', // his words
        body: '模型负责执行，人负责边界。', // his words
      },
    ],

    methodTitle: '方法',
    methodHeadline: '先立边界，再把概率压成确定性。', // his words
    methodIntro: 'AI 写代码很快，但交付靠流程。', // his words
    steps: [ // his words
      { name: '访谈对话', en: 'Interview', body: '先问问题，不写代码。把模糊需求压缩成目标用户、业务边界、验收标准与 AGENTS.md 草案。' },
      { name: '上下文装载', en: 'Context', body: '读取 README、AGENTS.md、package.json、启动脚本和相关源码，把项目事实、规则与风险装进同一张 Context Map。' },
      { name: '计划闸门', en: 'Plan Gate', body: '在改动前锁定文件责任、用户可见变化、动效守恒和测试路径。计划未经确认，不允许进入实现。' },
      { name: '原子修改', en: 'Atomic Patch', body: '把大任务拆成小补丁，沿着组件边界精确落点，拒绝无关重构和全盘翻新。' },
      { name: '构建自愈', en: 'Verify Loop', body: '运行 npm run build，遇到类型、构建或依赖错误先自修复。没有新鲜验证证据，不声明完成。' },
      { name: '浏览器验收', en: 'Ship Review', body: '用真实浏览器检查页面、移动端宽度、复制、弹窗、外链与控制台日志，再提交、推送和部署。' },
    ],
    methodClosing: '这个网站也是这么做出来的。',
    methodLink: '访问 ai.vibecoding',
    vibecodingAlt: 'ai.vibecoding 首屏的 Claude Code 终端：先访谈、再计划、最后实现并验证',

    pathTitle: '经历',
    pathHeadline: '先拍片，后来做 AI。',
    journey: [
      { when: '2025.11', role: 'AI 解决方案架构', org: '比智科技', desc: '给金融、政企客户做数据和 AI 问数方案，从需求聊到上线。', case: 'enterprise-ai' },
      { when: '2024.08', role: 'AI 项目负责人', org: '一念智能', desc: '在飞书搭了写脚本的智能体，也接手做完了微众银行的 AI 课程。', case: 'script-agent' },
      { when: '2023.04', role: '商业内容项目交付', org: '专致网络', desc: '拍商业片，写了 150 多条广告脚本；拍工商银行宣传片那次，演员没来，我自己上了。' },
      { when: '2022.06', role: '社区运营（实习）', org: '抖音数字学堂', desc: '做公益项目的社群和宣传，出镜、拍摄、剪辑都自己来。' },
      { when: '本科', role: '网络与新媒体', org: '云南民族大学', desc: '' },
    ],

    photosTitle: '影像',
    photosHeadline: '我拍的照片。',
    photosIntro: '拍片、剪辑、航拍，是我最早的手艺。',
    prev: '上一张',
    next: '下一张',
    photos: photos([
      '航拍：山脚下的城区和远处的群山',
      '湖上的游船，远处山顶有一座塔',
      '暗处的一尊金色佛像',
      '挂着红灯笼的木牌坊',
      '黄墙寺院与红灯笼',
      '黄昏时湖边的建筑和喷泉',
      '日落时金色的云层',
      '航拍：被群山围住的城市',
    ]),

    contactTitle: '联系',
    contactHeadline: '加个微信，聊聊。',
    contactLead: '聊自然语言编程、AI Agent 工作流，或者把你的项目问题直接带过来。', // his words
    cardLabel: '秦徐俊的名片',
    qrAlt: '秦徐俊的微信二维码',
    hint: {
      default: '用微信扫一扫；在微信里打开时，长按二维码即可识别。',
      wechat: '长按二维码，选择「识别图中的二维码」即可添加。',
      phone: '先保存名片或截图，再在微信「扫一扫」里从相册选这张图。',
      desktop: '打开手机微信，用「扫一扫」扫这张二维码。',
    },
    save: '保存名片',
    github: '我的 GitHub',
    closing: '这不仅是自然语言编程的边界，也是创造者的终极浪漫。', // his words
    footerSource: '本站源码',
    notFound: { title: '这一页不存在', body: '链接可能写错了，或者页面已经搬走。', back: '回到首页' },

    // Case page chrome
    caseLabels: {
      crumb: '作品',
      facts: '项目信息',
      results: '关键结果',
      links: '链接',
      doLabel: '做',
      dontLabel: '不做',
      more: '其他作品',
      contactHeadline: '加个微信，聊聊。',
      contactBody: '聊自然语言编程、AI Agent 工作流，或者把你的项目问题直接带过来。',
      liveNote: (date) => `GitHub 数据每 6 小时自动更新，最近一次：${date}。`,
    },
  },

  en: {
    lang: 'en',
    path: '/en/',
    title: 'Qin Xujun',
    description: 'Qin Xujun. I use AI to build things I use every day: VoiceFlow, AI Signal and Wanxiang.',
    skip: 'Skip to content',
    switchLabel: '中文',
    switchLang: 'zh-CN',
    themeLabel: 'Switch between dark and light',
    name: 'Qin Xujun',
    role: 'I build things with AI.',
    org: 'qinxujunai.github.io',
    portraitAlt: 'Photo of Qin Xujun',
    eyebrow: '',
    lede: 'I use AI to build things I use every day.',
    now: 'VoiceFlow turns what I say into text. AI Signal reads the AI news for me every morning. Wanxiang turns a video into an article. At work, I help companies put AI to use.',
    addWechat: 'Add me on WeChat',
    navWechat: 'WeChat',
    seeWork: 'See what I’ve made',
    navLabel: 'Sections',
    nav: { work: 'Work', thinking: 'Ideas', method: 'Method', path: 'Path', contact: 'Contact' },
    home: 'Home',

    workTitle: 'Work',
    workHeadline: 'Things I’ve made.',
    workIntro: '',
    productsLabel: 'Things I’ve made',
    solutionsLabel: 'At work',
    readCase: 'How it works',
    siteLabel: 'Website',
    flagship: {
      key: 'F2',
      hint: 'Press to start, press again to finish',
      lines: ['Compare the costs and risks of these two proposals, then recommend an approach.', 'Share the plan with the team at ten.', 'The proposal is ready. Let’s go over it tomorrow.'],
      body: 'Voice typing for Windows. Everything happens on your own computer: no internet, no account.',
      facts: { stars: 'GitHub stars', downloads: 'Downloads', forks: 'Forks', version: 'Latest release' },
      factsNote: (date) => `Pulled from GitHub every six hours. Last update: ${date}.`,
    },

    thinkingTitle: 'How I work with AI',
    thinkingHeadline: 'Let AI decompose, generate, and verify, while you protect the goal, boundaries, and taste.', // his words
    thinkingSource: ['From ', 'ai.vibecoding', ', which I wrote'],
    abilitiesHeadline: '',
    abilities: [
      {
        label: '',
        title: 'Asking better questions', // his words
        body: 'Natural-language programming does not begin with “build a page.” It begins by interviewing a vague idea into goals, users, boundaries, and acceptance criteria.', // his words
      },
      {
        label: '',
        title: 'Organizing context', // his words
        body: 'README, AGENTS.md, Skills, MCP, screenshots, logs, and decisions are not attachments. They are the model’s working memory.', // his words
      },
      {
        label: '',
        title: 'Delivering certainty', // his words
        body: 'The model executes; the human guards the boundary.', // his words
      },
    ],

    methodTitle: 'Method',
    methodHeadline: 'Set the boundary first, then compress probability into certainty.', // his words
    methodIntro: 'AI writes quickly, but delivery depends on process.', // his words
    steps: [ // his words
      { name: 'Interview', en: '', body: 'Ask before coding. Compress vague needs into users, boundaries, acceptance criteria, and an AGENTS.md draft.' },
      { name: 'Context', en: '', body: 'Read README, AGENTS.md, package.json, launch scripts, and relevant source so facts, rules, and risks share one Context Map.' },
      { name: 'Plan Gate', en: '', body: 'Lock file responsibility, visible changes, motion constraints, and test paths before editing.' },
      { name: 'Atomic Patch', en: '', body: 'Split large work into small patches that land on component boundaries and avoid unrelated redesign.' },
      { name: 'Verify Loop', en: '', body: 'Run the build and repair type, build, or dependency failures before claiming progress.' },
      { name: 'Ship Review', en: '', body: 'Check the real browser, mobile width, copy actions, modals, links, and console logs before committing or deploying.' },
    ],
    methodClosing: 'This site was made the same way.',
    methodLink: 'Visit ai.vibecoding',
    vibecodingAlt: 'The Claude Code terminal on ai.vibecoding: interview first, then plan, then build and verify',

    pathTitle: 'Path',
    pathHeadline: 'Film first, then AI.',
    journey: [
      { when: '2025.11', role: 'AI Solution Architect', org: 'Bizhi Technology', desc: 'Data and natural-language-query projects for finance and government clients, from the first conversation to launch.', case: 'enterprise-ai' },
      { when: '2024.08', role: 'AI Project Lead', org: 'Yinian Intelligence', desc: 'Built a script-writing agent in Feishu, and took over and finished an AI course for WeBank.', case: 'script-agent' },
      { when: '2023.04', role: 'Branded Content Producer', org: 'Zhuanzhi Network', desc: 'Shot commercial films and wrote 150-odd ad scripts. On an ICBC film, the actor didn’t show up, so I stepped in.' },
      { when: '2022.06', role: 'Community Operations (intern)', org: 'Douyin Digital Academy', desc: 'Community and outreach for public-interest programs; I did the on-camera work, shooting and editing myself.' },
      { when: 'B.A.', role: 'Network and New Media', org: 'Yunnan Minzu University', desc: '' },
    ],

    photosTitle: 'Photos',
    photosHeadline: 'Photos I’ve taken.',
    photosIntro: 'Shooting, editing and flying drones were my first craft.',
    prev: 'Previous photo',
    next: 'Next photo',
    photos: photos([
      'Aerial view of a town at the foot of the mountains',
      'A boat on a lake, a pagoda on the hill behind it',
      'A golden Buddha statue in the dark',
      'A wooden gateway hung with red lanterns',
      'A yellow temple wall with red lanterns',
      'Lakeside buildings and a fountain at dusk',
      'Golden clouds at sunset',
      'Aerial view of a city surrounded by hills',
    ]),

    contactTitle: 'Contact',
    contactHeadline: 'Add me on WeChat. Let’s talk.',
    contactLead: 'About natural-language programming, AI agent workflows, or a problem you’re working on.',
    cardLabel: 'Qin Xujun’s card',
    qrAlt: 'Qin Xujun’s WeChat QR code',
    hint: {
      default: 'Scan with WeChat. Inside WeChat, long-press the code to add me.',
      wechat: 'Long-press the code and choose “Scan QR code in image”.',
      phone: 'Save the card or take a screenshot, then open WeChat’s Scan and pick it from your album.',
      desktop: 'Open WeChat on your phone and use Scan on this code.',
    },
    save: 'Save the card',
    github: 'My GitHub',
    closing: 'This is not only the frontier of natural-language programming. It is also the creator’s ultimate romance.', // his words
    footerSource: 'Source of this site',
    notFound: { title: 'This page doesn’t exist', body: 'The link may be mistyped, or the page has moved.', back: 'Back to home' },

    caseLabels: {
      crumb: 'Work',
      facts: 'At a glance',
      results: 'Key results',
      links: 'Links',
      doLabel: 'Does',
      dontLabel: 'Does not',
      more: 'Other work',
      contactHeadline: 'Add me on WeChat. Let’s talk.',
      contactBody: 'About natural-language programming, AI agent workflows, or a problem you’re working on.',
      liveNote: (date) => `GitHub numbers refresh every six hours. Last update: ${date}.`,
    },
  },
};
