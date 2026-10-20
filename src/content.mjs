// Every word on the home page lives here, in both languages. Project pages live in src/cases.mjs.
// Facts must trace to the owner's own words, his repositories, his resume, or his answers. See CLAUDE.md.
// Lines marked "his words" are verbatim from text he committed himself (ai.vibecoding, May 2026).
// Voice (v5): a person introducing himself to a friend. No interview talk, no slogans. See docs/copy.md.

export const SITE = 'https://qinxujunai.github.io';
export const GITHUB = 'https://github.com/qinxujunai';
// Links go to the project's live site, not its source (his request, 2026-10-20).
export const VIBECODING = 'https://qinxujunai.github.io/qinxujun-ai-vibecoding/';

// Visual work. First his AI-generated work, from the portfolio linked on his resume (AI faces are not real
// people; no brand logos or licensed characters). Then four of his photographs: landscapes and buildings only.
// The alt lists keep all eight originals so indexes stay stable.
const aiWork = (t) => [
  { key: 'ai-hat', alt: t[0], caption: t[1] },
  { key: 'ai-vest', alt: t[2], caption: t[3], tall: true },
  { key: 'ai-shirt', alt: t[4], caption: t[5], tall: true },
  { key: 'ai-cup', alt: t[6], caption: t[7] },
  { key: 'ai-tin', alt: t[8], caption: t[9], tall: true },
  { key: 'ai-bag', alt: t[10], caption: t[11], tall: true },
  { key: 'ai-portrait', alt: t[12], caption: t[13], tall: true },
  { key: 'ai-lips', alt: t[14], caption: t[13], tall: true },
  { key: 'ai-leaves', alt: t[15], caption: t[13], tall: true },
  { key: 'ai-studio', alt: t[16], caption: t[17] },
];
const photos = (alt, ai) => [
  ...aiWork(ai),
  { key: 'photo-aerial', alt: alt[0] },
  { key: 'photo-pagoda', alt: alt[1] },
  { key: 'photo-dusk', alt: alt[5] },
  { key: 'photo-sky', alt: alt[6] },
];

export const content = {
  zh: {
    lang: 'zh-CN',
    path: '/',
    title: '秦徐俊',
    description: '我是秦徐俊，做 AI 产品：VoiceFlow、AI Signal、万象成文，还有我用 AI 做事的方法 ai.vibecoding。',
    skip: '跳到正文',
    switchLabel: 'English',
    switchLang: 'en',
    themeLabel: '切换深色或浅色',
    name: '秦徐俊',
    // The name card's two lines under the name. He presents himself, not an employer or a job title.
    role: '做 AI 产品',
    org: 'qinxujunai.github.io',
    portraitAlt: '秦徐俊的照片',
    // Plain self-introduction, as the best personal sites open (rauno.me, karpathy.ai, paco.me).
    lede: '我是秦徐俊，做 AI 产品。',
    now: '做过几年内容和运营，所以做任何东西，我都先想：人为什么会用它。下面是我做的三个产品，还有我用 AI 做事的方法。',
    hook: '我把这套做法写成了 ai.vibecoding，约 18 分钟读完，读完就能动手',
    addWechat: '加我微信',
    navWechat: '加微信',
    seeWork: '看看作品',
    navLabel: '章节',
    nav: { work: '作品', share: '分享', path: '经历', photos: '影像', contact: '联系' },
    home: '首页',

    workTitle: '作品',
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
    pathHeadline: '做 AI，也懂人。',
    journey: [
      { when: '2025.11', role: 'AI 解决方案架构', org: '比智科技', desc: '给金融、政企客户做 AI 问数，从需求诊断到回款；主导通信、政企客户的招投标，5 家以上客户进入采购评估。' },
      { when: '2024.08', role: 'AI 项目负责人', org: '一念智能', desc: '拆了 50 多个爆款案例，在飞书搭了写脚本的智能体，一条脚本从 3 小时变成 20 分钟；用 AI 做了方正证券活动的开场片；接手微众银行的 AI 课程项目，48 小时找到问题，客户点名要我继续负责。' },
      { when: '2023.04', role: '商业内容项目交付', org: '专致网络', desc: '运营抖音文旅号「云南妙妙屋」，3 个月涨粉 2000 多；写了 150 多条信息流广告脚本，撑起每月 10 万以上的投放；拍工商银行宣传片那次，演员没来，我自己上了。' },
      { when: '2022.06', role: '社区运营（实习）', org: '抖音数字学堂', desc: '', light: true },
      { when: '本科', role: '网络与新媒体', org: '云南民族大学', desc: '学的是内容怎么被看见、被记住。', light: true },
    ],

    photosTitle: '影像',
    photosHeadline: '一张人台照，变成一组模特图。',
    photosIntro: '做内容练出来的眼光，现在交给 Midjourney 和 AI 视频工具。拍摄、剪辑、航拍，我也都自己来。',
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
    ], [
      '左边是人台戴着草编帽，右边是 AI 生成的模特戴着同一顶帽子', '人台照 → AI 模特图',
      '一件刺绣马甲，生成多位模特的上身图', '一件衣服，生成一组上身图',
      '一件蓝色刺绣上衣，生成不同模特和场景的上身图', '同一件衣服，换模特、换场景',
      '印着猫头形象的咖啡杯', '一个形象，延展成杯套',
      '印着同一猫头形象的茶罐', '……茶罐',
      '印着同一猫头形象的红白手提袋', '……和手提袋',
      'AI 生成的人像：白衣女子，光影落在脸上', 'AI 人像',
      'AI 生成的人像：红唇特写',
      'AI 生成的人像：树叶下仰头的女孩',
      'AI 生成的场景：洒满阳光的工作室', 'AI 场景',
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
    colophon: '纯 HTML 和 CSS，系统字体，不发任何外部请求，在微信里也打开得很快。',
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
    description: 'I’m Qin Xujun. I build AI products: VoiceFlow, AI Signal, Wanxiang, and ai.vibecoding, the way I build with AI.',
    skip: 'Skip to content',
    switchLabel: '中文',
    switchLang: 'zh-CN',
    themeLabel: 'Switch between dark and light',
    name: 'Qin Xujun',
    role: 'I build AI products.',
    org: 'qinxujunai.github.io',
    portraitAlt: 'Photo of Qin Xujun',
    lede: 'I’m Qin Xujun. I build AI products.',
    now: 'Years in content and growth taught me to start with one question: why would anyone use this? Below are three products I made, and the way I build with AI.',
    hook: 'I wrote the method down as ai.vibecoding. About 18 minutes, and you can start right after',
    addWechat: 'Add me on WeChat',
    navWechat: 'WeChat',
    seeWork: 'See what I’ve made',
    navLabel: 'Sections',
    nav: { work: 'Work', share: 'Sharing', path: 'Path', photos: 'Visuals', contact: 'Contact' },
    home: 'Home',

    workTitle: 'Work',
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
    pathHeadline: 'I build AI, with a feel for people.',
    journey: [
      { when: '2025.11', role: 'AI Solution Architect', org: 'Bizhi Technology', desc: 'Natural-language data queries for finance and government clients, from diagnosis to payment; led bids for telecom and government clients, with 5+ clients reaching procurement review.' },
      { when: '2024.08', role: 'AI Project Lead', org: 'Yinian Intelligence', desc: 'Broke down 50+ hit scripts and built a script-writing agent in Feishu: one script went from three hours to twenty minutes. Made the AI opening film for a Founder Securities event. Took over a WeBank AI course project, found the problem in 48 hours, and the client asked for me by name.' },
      { when: '2023.04', role: 'Branded Content Producer', org: 'Zhuanzhi Network', desc: 'Ran a Douyin travel account, “Yunnan Miaomiao House”, and grew it by 2,000+ followers in three months; wrote 150-odd in-feed ad scripts behind more than ¥100k of monthly ad spend. On an ICBC film, the actor didn’t show up, so I stepped in.' },
      { when: '2022.06', role: 'Community Operations (intern)', org: 'Douyin Digital Academy', desc: '', light: true },
      { when: 'B.A.', role: 'Network and New Media', org: 'Yunnan Minzu University', desc: 'How content gets seen, and remembered.', light: true },
    ],

    photosTitle: 'Visuals',
    photosHeadline: 'One mannequin shot, a full set of on-model images.',
    photosIntro: 'An eye trained by years of content, now working through Midjourney and AI video tools. I still shoot, edit and fly the drone myself.',
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
    ], [
      'Left, a straw visor on a mannequin; right, an AI-generated model wearing the same visor', 'Mannequin shot → AI model',
      'An embroidered vest, generated on several models', 'One garment, a full set of on-model shots',
      'A blue embroidered top, generated on different models and settings', 'Same top, new models and settings',
      'A coffee cup printed with a cat mascot', 'One mascot, a cup sleeve…',
      'A tea tin printed with the same cat mascot', '…a tea tin…',
      'Red and white shopping bags with the same cat mascot', '…and shopping bags',
      'AI-generated portrait: a woman in white, light across her face', 'AI portrait',
      'AI-generated portrait: a close-up of red lips',
      'AI-generated portrait: a girl looking up under leaves',
      'AI-generated scene: a sunlit studio', 'AI scene',
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
    colophon: 'Plain HTML and CSS, system fonts, no outside requests. Opens fast, even inside WeChat.',
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
