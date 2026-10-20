// Every word on the home page lives here, in both languages. Project pages live in src/cases.mjs.
// Facts must trace to the owner's own words, his repositories, his resume, or his answers. See CLAUDE.md.
// Lines marked "his words" are verbatim from text he committed himself (ai.vibecoding, May 2026).
// Voice (v5): a person introducing himself to a friend. No interview talk, no slogans. See docs/copy.md.

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
    description: '秦徐俊。我用 AI 做东西，也把做法分享出来：VoiceFlow、AI Signal、万象成文，还有 ai.vibecoding。',
    skip: '跳到正文',
    switchLabel: 'English',
    switchLang: 'en',
    themeLabel: '切换深色或浅色',
    name: '秦徐俊',
    // The name card's two lines under the name. He presents himself, not an employer or a job title.
    role: '用 AI 做东西',
    org: 'qinxujunai.github.io',
    portraitAlt: '秦徐俊的照片',
    lede: '我用 AI 做东西，也把做法分享出来。',
    now: '以前拍片，现在做 AI。这里有一个离线的语音输入法、一封每天早上的 AI 简报、一个把视频变成文字的工具，还有我做这些东西的方法。',
    addWechat: '加我微信',
    navWechat: '加微信',
    seeWork: '看看作品',
    navLabel: '章节',
    nav: { work: '作品', share: '分享', path: '经历', photos: '照片', contact: '联系' },
    home: '首页',

    workTitle: '作品',
    workHeadline: '我做的东西，点开就能看。',
    visit: '访问网站',
    readCase: '怎么做的',
    openSite: (name) => `打开 ${name} 的网站`,
    flagship: {
      key: 'F2',
      hint: '按一下开始，再按一下完成',
      lines: ['请比较这两份方案的成本与风险，再给出你的建议。', '明早十点，把方案同步给团队。', '这周的方案已经整理好了，明天一起看看。'],
      facts: { stars: 'GitHub Star', downloads: '次下载', forks: 'Fork', version: '最新版本' },
      factsNote: (date) => `数据每 6 小时从 GitHub 自动更新，最近一次：${date}。`,
    },

    share: {
      title: '分享',
      name: 'ai.vibecoding',
      // his words: the subtitle of ai.vibecoding (May 2026)
      quote: '让 AI 负责拆解、生成与验证，让你守住目标、边界与品味。',
      intro: '如果你也想用 AI 做出自己的东西，可以从这里开始。我把做法整理成了一个网站：10 章，约 18 分钟；零基础、产品经理、工程师各有一条路线，每条读完都有一件马上能做的事。',
      note: '10 章 · 约 18 分钟 · 三条路线',
      link: '去读 ai.vibecoding',
      principles: [ // his words
        { title: '提出问题', body: '自然语言编程的起点不是“写个页面”，而是把模糊想法采访成目标、用户、边界与验收标准。' },
        { title: '组织上下文', body: 'README、AGENTS.md、Skills、MCP、截图、日志和历史决策都不是附件，它们是模型的工作记忆。' },
        { title: '交付确定性', body: '模型负责执行，人负责边界。' },
      ],
    },

    pathTitle: '经历',
    pathHeadline: '先拍片，后来做 AI。',
    journey: [
      { when: '2025.11', role: 'AI 解决方案架构', org: '比智科技', desc: '给金融、政企客户做 AI 问数，从第一次聊需求到上线。' },
      { when: '2024.08', role: 'AI 项目负责人', org: '一念智能', desc: '在飞书搭了写脚本的智能体，一条脚本从 3 小时变成 20 分钟；也接手做完了微众银行的 AI 课程。' },
      { when: '2023.04', role: '商业内容项目交付', org: '专致网络', desc: '拍商业片，写了 150 多条广告脚本；拍工商银行宣传片那次，演员没来，我自己上了。' },
      { when: '2022.06', role: '社区运营（实习）', org: '抖音数字学堂', desc: '做公益项目的社群和宣传，出镜、拍摄、剪辑都自己来。' },
      { when: '本科', role: '网络与新媒体', org: '云南民族大学', desc: '' },
    ],

    photosTitle: '照片',
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
    contactHeadline: '谢谢你看到这里。',
    contactLead: '加个微信，交个朋友。',
    cardLabel: '秦徐俊的名片',
    qrAlt: '秦徐俊的微信二维码',
    hint: {
      default: '用微信扫一扫；在微信里打开时，长按二维码即可识别。',
      wechat: '长按二维码，选择「识别图中的二维码」即可添加。',
      phone: '先保存名片或截图，再在微信「扫一扫」里从相册选这张图。',
      desktop: '打开手机微信，用「扫一扫」扫这张二维码。',
    },
    save: '保存名片',
    // his words: the manifesto of ai.vibecoding (May 2026)
    closing: ['AI 进化得越快，我们越需要慢下来。', '沉下心去阅读真正好的书，去安静地体察生活，去想清楚自己为什么创造，又想把世界带向哪里。'],
    notFound: { title: '这一页不存在', body: '链接可能写错了，或者页面已经搬走。', back: '回到首页' },

    // Project page chrome
    caseLabels: {
      crumb: '作品',
      facts: '项目信息',
      results: '关键结果',
      links: '链接',
      doLabel: '做',
      dontLabel: '不做',
      more: '其他作品',
      contactHeadline: '加个微信，交个朋友。',
      contactBody: '',
      liveNote: (date) => `GitHub 数据每 6 小时自动更新，最近一次：${date}。`,
    },
  },

  en: {
    lang: 'en',
    path: '/en/',
    title: 'Qin Xujun',
    description: 'Qin Xujun. I build things with AI, and share how I do it: VoiceFlow, AI Signal, Wanxiang and ai.vibecoding.',
    skip: 'Skip to content',
    switchLabel: '中文',
    switchLang: 'zh-CN',
    themeLabel: 'Switch between dark and light',
    name: 'Qin Xujun',
    role: 'I build things with AI.',
    org: 'qinxujunai.github.io',
    portraitAlt: 'Photo of Qin Xujun',
    lede: 'I build things with AI, and share how I do it.',
    now: 'I used to make films; now I build with AI. Here you’ll find an offline voice keyboard, a morning AI briefing, a tool that turns videos into text, and the way I make all of them.',
    addWechat: 'Add me on WeChat',
    navWechat: 'WeChat',
    seeWork: 'See what I’ve made',
    navLabel: 'Sections',
    nav: { work: 'Work', share: 'Sharing', path: 'Path', photos: 'Photos', contact: 'Contact' },
    home: 'Home',

    workTitle: 'Work',
    workHeadline: 'Things I’ve made. Open any of them.',
    visit: 'Visit the site',
    readCase: 'How it works',
    openSite: (name) => `Open the ${name} website`,
    flagship: {
      key: 'F2',
      hint: 'Press to start, press again to finish',
      lines: ['Compare the costs and risks of these two proposals, then recommend an approach.', 'Share the plan with the team at ten.', 'The proposal is ready. Let’s go over it tomorrow.'],
      facts: { stars: 'GitHub stars', downloads: 'Downloads', forks: 'Forks', version: 'Latest release' },
      factsNote: (date) => `Pulled from GitHub every six hours. Last update: ${date}.`,
    },

    share: {
      title: 'Sharing',
      name: 'ai.vibecoding',
      quote: 'Let AI decompose, generate, and verify, while you protect the goal, boundaries, and taste.', // his words
      intro: 'If you want to make something of your own with AI, start here. I put the way I work into a website: ten chapters, about eighteen minutes, with one track each for beginners, product managers and engineers. Every track ends with one thing you can do right away.',
      note: '10 chapters · about 18 minutes · three tracks',
      link: 'Read ai.vibecoding',
      principles: [ // his words
        { title: 'Asking better questions', body: 'Natural-language programming does not begin with “build a page.” It begins by interviewing a vague idea into goals, users, boundaries, and acceptance criteria.' },
        { title: 'Organizing context', body: 'README, AGENTS.md, Skills, MCP, screenshots, logs, and decisions are not attachments. They are the model’s working memory.' },
        { title: 'Delivering certainty', body: 'The model executes; the human guards the boundary.' },
      ],
    },

    pathTitle: 'Path',
    pathHeadline: 'Film first, then AI.',
    journey: [
      { when: '2025.11', role: 'AI Solution Architect', org: 'Bizhi Technology', desc: 'Natural-language data queries for finance and government clients, from the first conversation to launch.' },
      { when: '2024.08', role: 'AI Project Lead', org: 'Yinian Intelligence', desc: 'Built a script-writing agent in Feishu that took one script from three hours to twenty minutes, and took over and finished an AI course for WeBank.' },
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
    contactHeadline: 'Thanks for reading this far.',
    contactLead: 'Say hi on WeChat.',
    cardLabel: 'Qin Xujun’s card',
    qrAlt: 'Qin Xujun’s WeChat QR code',
    hint: {
      default: 'Scan with WeChat. Inside WeChat, long-press the code to add me.',
      wechat: 'Long-press the code and choose “Scan QR code in image”.',
      phone: 'Save the card or take a screenshot, then open WeChat’s Scan and pick it from your album.',
      desktop: 'Open WeChat on your phone and use Scan on this code.',
    },
    save: 'Save the card',
    closing: ['The faster AI evolves, the more we need to slow down.', 'Read the books that actually change you. Observe life quietly. Ask why you create, and where you want to move the world.'], // his words
    notFound: { title: 'This page doesn’t exist', body: 'The link may be mistyped, or the page has moved.', back: 'Back to home' },

    caseLabels: {
      crumb: 'Work',
      facts: 'At a glance',
      results: 'Key results',
      links: 'Links',
      doLabel: 'Does',
      dontLabel: 'Does not',
      more: 'Other work',
      contactHeadline: 'Say hi on WeChat.',
      contactBody: '',
      liveNote: (date) => `GitHub numbers refresh every six hours. Last update: ${date}.`,
    },
  },
};
