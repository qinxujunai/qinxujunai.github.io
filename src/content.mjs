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
  { key: 'ai-lips', alt: t[14], caption: t[18], tall: true },
  { key: 'ai-leaves', alt: t[15], caption: t[19], tall: true },
  { key: 'ai-studio', alt: t[16], caption: t[17] },
];
const photos = (alt, ai, shot) => [
  ...aiWork(ai),
  { key: 'photo-aerial', alt: alt[0], caption: shot[0] },
  { key: 'photo-pagoda', alt: alt[1], caption: shot[1] },
  { key: 'photo-dusk', alt: alt[5], caption: shot[2] },
  { key: 'photo-sky', alt: alt[6], caption: shot[3] },
];

export const content = {
  zh: {
    lang: 'zh-CN',
    path: '/',
    title: '秦徐俊',
    description: '秦徐俊。我用 AI 做东西，也把想法分享出来：VoiceFlow、AI Signal、万象成文，和 ai.vibecoding。',
    skip: '跳到正文',
    switchLabel: 'English',
    switchLang: 'en',
    themeLabel: '切换深色或浅色',
    name: '秦徐俊',
    // The name card's two lines under the name. He presents himself, not an employer or a job title.
    role: '做 AI 产品',
    org: 'qinxujunai.github.io',
    portraitAlt: '秦徐俊的照片',
    // First screen (his choice, 2026-10-20): avatar, signature, this headline, the product list, two actions.
    lede: '我用 AI 做东西，也把想法分享出来',
    // his words (ai.vibecoding hero.subtitle, May 2026), with 让你 → 让人 at his request: the home page speaks to everyone.
    now: '让 AI 负责拆解、生成与验证，让人守住目标、边界与品味',
    addWechat: '加我微信',
    navWechat: '加微信',
    seeWork: '看看作品',
    navLabel: '章节',
    nav: { work: '作品', share: '想法', path: '经历', contact: '联系' },
    home: '首页',

    workTitle: '作品',
    visit: '访问网站',
    readCase: '进一步了解',
    openSite: (name) => `打开 ${name} 的网站`,
    flagship: {
      key: 'F2',
      hint: '按一下开始，再按一下完成',
      lines: ['请比较这两份方案的成本与风险，再给出你的建议。', '明早十点，把方案同步给团队。', '这周的方案已经整理好了，明天一起看看。'],
      facts: { stars: 'GitHub Star', downloads: '次下载', forks: 'Fork', version: '最新版本' },
      factsNote: (date) => `数据每 6 小时从 GitHub 自动更新，最近一次 ${date}`,
    },

    share: {
      title: '想法',
      name: 'ai.vibecoding',
      // his words: the hero title of ai.vibecoding (May 2026)
      quote: '用自然语言，创造可运行的作品',
      intro: '我把用 AI 做产品的方法写成了一个网站，零基础也能读',
      note: '10 章 · 约 18 分钟',
      link: '开始阅读',
    },

    // A recommendation, not his work: Datawhale's open course easy-vibe. Facts from its README
    // (github.com/datawhalechina/easy-vibe, docs-readme/zh-CN, "你的学习路径"), checked 2026-10-21.
    recommend: {
      title: '推荐',
      headline: '想系统学用 AI 做产品，我推荐 easy-vibe',
      line: 'Datawhale 的开源教程，从找到一个好想法，讲到把产品上线',
      routes: [
        { who: '先试试', get: '5 分钟，做出第一个 AI 小应用' },
        { who: '有个想法', get: '做出一个能演示的产品原型' },
        { who: '想做完整的产品', get: '独立做出一个能上线的全栈 AI 应用' },
      ],
      note: 'Datawhale 开源 · 免费 · 零基础可学',
      link: '开始学习',
      url: 'https://datawhalechina.github.io/easy-vibe/zh-cn/',
      alt: 'easy-vibe 教程网站首页',
    },

    pathTitle: '经历',
    pathHeadline: '为金融、政企客户做 AI 项目',
    journey: [
      { when: '2025.11', role: 'AI 解决方案架构', org: '比智科技', desc: '5 家以上客户进入采购评估。做的是让人用一句话查数据的 AI 方案，从需求诊断到回款，也主导招投标。' },
      { when: '2024.08', role: 'AI 项目负责人', org: '一念智能', desc: '一条脚本从 3 小时缩到 20 分钟：在飞书搭了写脚本的智能体。接手微众银行的 AI 课程项目，48 小时找到问题，客户点名要我继续负责。方正证券活动的开场片，用 AI 做成。' },
      { when: '2023.04', role: '商业内容项目交付', org: '专致网络', desc: '150 多条信息流广告脚本，支撑每月 10 万以上的投放。抖音文旅号云南妙妙屋，3 个月涨粉 2000 多。负责工商银行宣传片，从策划到交付。' },
      { when: '2022.06', role: '社区运营（实习）', org: '抖音数字学堂', desc: '', light: true },
      { when: '本科', role: '网络与新媒体', org: '云南民族大学', desc: '学的是怎么做内容，怎么让内容被看见。', light: true },
    ],

    visual: {
      name: 'AI 视觉',
      line: '商品图、人像、包装，用 AI 做出来',
      swipe: '左右滑动',
      note: 'Midjourney 和 AI 视频工具 · 最后 4 张是实拍',
    },
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
      '一件刺绣马甲，生成多位模特的上身图', '一件马甲，一组上身图',
      '一件蓝色刺绣上衣，生成不同模特和场景的上身图', '一件上衣，换模特、换场景',
      '印着猫头形象的咖啡杯', '猫头形象：杯套',
      '印着同一猫头形象的茶罐', '茶罐',
      '印着同一猫头形象的红白手提袋', '手提袋',
      'AI 生成的人像：白衣女子，光影落在脸上', 'AI 人像',
      'AI 生成的人像：红唇特写',
      'AI 生成的人像：树叶下仰头的女孩',
      'AI 生成的场景：洒满阳光的工作室', 'AI 场景',
      '红唇特写', '树叶下仰头',
    ], ['实拍：山脚下的城区', '湖上游船，山顶有塔', '黄昏的湖边', '日落时的云']),

    contactTitle: '联系',
    contactHeadline: '欢迎交流',
    contactLead: '聊 AI，聊产品，聊你正在做的事',
    // his words: the manifesto of ai.vibecoding (May 2026)
    closing: ['AI 进化得越快，我们越需要慢下来。', '沉下心去阅读真正好的书，去安静地体察生活，去想清楚自己为什么创造，又想把世界带向哪里。'],
    cardLabel: '秦徐俊的名片',
    qrAlt: '秦徐俊的微信二维码',
    hint: {
      default: '用微信扫一扫，或在微信里长按二维码',
      wechat: '长按二维码，直接加我',
      phone: '复制微信号去微信里搜索，或保存名片扫一扫',
      desktop: '用手机微信扫一扫',
    },
    save: '保存名片',
    // His WeChat ID (他提供后填入). When set, phones outside WeChat get 「复制微信号，打开微信」.
    wechatId: 'praxiscore', // his WeChat ID, given by him for this site (2026-10-20)
    wechatLabel: '微信',
    scanLabel: '微信扫一扫',
    copyWechat: '复制微信号，打开微信',
    copyOnly: '复制微信号',
    copied: '已复制 praxiscore，去微信搜索里粘贴',
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
      contactHeadline: '欢迎交流',
      contactBody: '',
      liveNote: (date) => `GitHub 数据每 6 小时自动更新，最近一次 ${date}`,
    },
  },

  en: {
    lang: 'en',
    path: '/en/',
    title: 'Qin Xujun',
    description: 'Qin Xujun. I build things with AI, and share what I think: VoiceFlow, AI Signal, Wanxiang and ai.vibecoding.',
    skip: 'Skip to content',
    switchLabel: '中文',
    switchLang: 'zh-CN',
    themeLabel: 'Switch between dark and light',
    name: 'Qin Xujun',
    role: 'I build AI products.',
    org: 'qinxujunai.github.io',
    portraitAlt: 'Photo of Qin Xujun',
    lede: 'I build things with AI, and share what I think',
    now: 'Let AI decompose, generate, and verify, while people keep the goal, the boundaries, and the taste', // his words, adapted
    addWechat: 'Add me on WeChat',
    navWechat: 'WeChat',
    seeWork: 'See what I’ve made',
    navLabel: 'Sections',
    nav: { work: 'Work', share: 'Ideas', path: 'Path', contact: 'Contact' },
    home: 'Home',

    workTitle: 'Work',
    visit: 'Visit the site',
    readCase: 'Learn more',
    openSite: (name) => `Open the ${name} website`,
    flagship: {
      key: 'F2',
      hint: 'Press to start, press again to finish',
      lines: ['Compare the costs and risks of these two proposals, then recommend an approach.', 'Share the plan with the team at ten.', 'The proposal is ready. Let’s go over it tomorrow.'],
      facts: { stars: 'GitHub stars', downloads: 'Downloads', forks: 'Forks', version: 'Latest release' },
      factsNote: (date) => `Pulled from GitHub every six hours, last on ${date}`,
    },

    share: {
      title: 'Ideas',
      name: 'ai.vibecoding',
      quote: 'Use natural language to create working products', // his words
      intro: 'I wrote down how I build products with AI, as a website anyone can read',
      note: '10 chapters · about 18 minutes',
      link: 'Start reading',
    },

    recommend: {
      title: 'Recommended',
      headline: 'Want to learn to build with AI properly? I recommend easy-vibe',
      line: 'An open course by Datawhale, from finding a good idea to shipping the product',
      routes: [
        { who: 'Just trying', get: 'Build your first small AI app in 5 minutes' },
        { who: 'Have an idea', get: 'Make a prototype you can demo' },
        { who: 'Want the full path', get: 'Ship a full-stack AI app on your own' },
      ],
      note: 'Open source by Datawhale · free · no coding background needed',
      link: 'Start learning',
      url: 'https://datawhalechina.github.io/easy-vibe/en/',
      alt: 'The easy-vibe course website',
    },

    pathTitle: 'Path',
    pathHeadline: 'AI projects for finance and government clients',
    journey: [
      { when: '2025.11', role: 'AI Solution Architect', org: 'Bizhi Technology', desc: '5+ clients reached procurement review. The work: AI that lets people query data in one sentence, from diagnosis to payment, including the bids.' },
      { when: '2024.08', role: 'AI Project Lead', org: 'Yinian Intelligence', desc: 'One script went from three hours to twenty minutes: I built a script-writing agent in Feishu. Took over a WeBank AI course project, found the problem in 48 hours, and the client asked for me by name. Made the opening film for a Founder Securities event with AI.' },
      { when: '2023.04', role: 'Branded Content Producer', org: 'Zhuanzhi Network', desc: '150-odd in-feed ad scripts behind more than ¥100k of monthly ad spend. A Douyin travel account grown by 2,000+ followers in three months. Produced ICBC’s brand film from concept to delivery.' },
      { when: '2022.06', role: 'Community Operations (intern)', org: 'Douyin Digital Academy', desc: '', light: true },
      { when: 'B.A.', role: 'Network and New Media', org: 'Yunnan Minzu University', desc: 'How to make content, and how to get it seen.', light: true },
    ],

    visual: {
      name: 'AI visuals',
      line: 'Product shots, portraits and packaging, made with AI',
      swipe: 'Swipe',
      note: 'Midjourney and AI video tools · the last four are my own photographs',
    },
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
      'An embroidered vest, generated on several models', 'One vest, a set of on-model shots',
      'A blue embroidered top, generated on different models and settings', 'One top, new models and settings',
      'A coffee cup printed with a cat mascot', 'Cat mascot: cup sleeve',
      'A tea tin printed with the same cat mascot', 'Tea tin',
      'Red and white shopping bags with the same cat mascot', 'Shopping bags',
      'AI-generated portrait: a woman in white, light across her face', 'AI portrait',
      'AI-generated portrait: a close-up of red lips',
      'AI-generated portrait: a girl looking up under leaves',
      'AI-generated scene: a sunlit studio', 'AI scene',
      'Red lips, close up', 'Looking up under leaves',
    ], ['Photo: a town below the mountains', 'A boat, a pagoda on the hill', 'A lakeside at dusk', 'Clouds at sunset']),

    contactTitle: 'Contact',
    contactHeadline: 'Let’s talk',
    contactLead: 'AI, products, whatever you’re building',
    closing: ['The faster AI evolves, the more we need to slow down.', 'Read the books that actually change you. Observe life quietly. Ask why you create, and where you want to move the world.'], // his words
    cardLabel: 'Qin Xujun’s card',
    qrAlt: 'Qin Xujun’s WeChat QR code',
    hint: {
      default: 'Scan with WeChat, or long-press the code inside WeChat',
      wechat: 'Long-press the code to add me',
      phone: 'Copy my ID and search it in WeChat, or save the card and scan it',
      desktop: 'Scan with WeChat on your phone',
    },
    save: 'Save the card',
    wechatId: 'praxiscore',
    wechatLabel: 'WeChat',
    scanLabel: 'Scan with WeChat',
    copyWechat: 'Copy my WeChat ID and open WeChat',
    copyOnly: 'Copy my WeChat ID',
    copied: 'Copied praxiscore. Paste it into WeChat search',
    notFound: { title: 'This page doesn’t exist', body: 'The link may be mistyped, or the page has moved.', back: 'Back to home' },

    caseLabels: {
      crumb: 'Work',
      facts: 'At a glance',
      results: 'Key results',
      links: 'Links',
      doLabel: 'Does',
      dontLabel: 'Does not',
      more: 'Other work',
      contactHeadline: 'Let’s talk',
      contactBody: '',
      liveNote: (date) => `GitHub numbers refresh every six hours, last on ${date}`,
    },
  },
};
