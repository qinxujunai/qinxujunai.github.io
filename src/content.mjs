// Every word on the home page lives here, in both languages. Project pages live in src/cases.mjs.
// Facts must trace to the owner's own words, his repositories, his resume, or his answers. See CLAUDE.md.
// Lines marked "his words" are verbatim from text he committed himself (ai.vibecoding, May 2026).
// Voice (v5): a person introducing himself to a friend. No interview talk, no slogans. See docs/copy.md.

export const SITE = 'https://qinxujunai.github.io';
export const GITHUB = 'https://github.com/qinxujunai';
// Links go to the project's live site, not its source (his request, 2026-10-20).
export const VIBECODING = 'https://qinxujunai.github.io/qinxujun-ai-vibecoding/';

export const content = {
  zh: {
    lang: 'zh-CN',
    path: '/',
    // What a WeChat chat shows when the link is shared: his name and his headline, then the thesis.
    title: '秦徐俊 · 我用 AI 做东西，也把想法分享出来',
    description: '三个在线上的作品，同一个做法：模型负责快，边界负责准。VoiceFlow、AI Signal、万象成文，和分享做法的 ai.vibecoding。',
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
    // v21: the thesis the three works share. Each one then says, under 「靠得住，是因为」, how it keeps that promise.
    // v23: a headline that states a fact the three stories prove (each starts from his own problem).
    workHeadline: '先解决自己的问题',
    workLine: '三个作品，都在线上，打开就能用',
    // The button names the product, never 「官网」 (v20: readers did not know what 官网 meant here).
    open: (name) => (/^[A-Za-z]/.test(name) ? `打开 ${name}` : `打开${name}`),
    readCase: '怎么做的',
    whyLabel: '为什么做',
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
      // His answer, 2026-10-21: what he thinks matters most now.
      view: 'AI 时代，能提出一个好问题，越来越重要',
      viewNote: '好问题背后是判断力。判断力来自长期做会复利的事：健身、阅读、交朋友。做一天，就有一天的收获；谁想追上，都得从你的第一天开始。',
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
      note: 'Datawhale 开源 · 免费 · 零基础可学',
      link: '开始学习',
      url: 'https://datawhalechina.github.io/easy-vibe/zh-cn/',
      alt: 'easy-vibe 教程网站首页',
    },

    pathTitle: '经历',
    // v21: the path told as one line of growth (his stance: the media degree is what powers the AI work).
    // The clients stay in the sub line; 「让内容被看见」 echoes his degree line at the bottom of the list.
    pathHeadline: '从让内容被看见，到让 AI 落地',
    pathLine: '做内容出身，现在为金融、政企客户做 AI 项目',
    journey: [
      // His answer 2026-10-23: AI 项目经理 since 2026-08, company not named; 比智科技 until 2026-07.
      // Years only: the work runs one line (AI projects for clients), the exact months add nothing.
      { when: '2026 至今', role: 'AI 项目经理', org: '', desc: '' },
      { when: '2025–2026', role: 'AI 解决方案架构', org: '比智科技', desc: '5 家以上客户进入采购评估。做的是让人用一句话查数据的 AI 方案，从需求诊断到回款，也主导招投标。' },
      { when: '2024–2025', role: 'AI 项目负责人', org: '一念智能', desc: '一条脚本从 3 小时缩到 20 分钟：在飞书搭了写脚本的智能体。接手微众银行的 AI 课程项目，48 小时找到问题，客户点名要我继续负责。方正证券活动的开场片，用 AI 做成。' },
      { when: '2023–2024', role: '商业内容项目交付', org: '专致网络', desc: '150 多条信息流广告脚本，支撑每月 10 万以上的投放。抖音文旅号云南妙妙屋，3 个月涨粉 2000 多。负责工商银行宣传片，从策划到交付。' },
      { when: '2022', role: '社区运营（实习）', org: '抖音数字学堂', desc: '', light: true },
      { when: '本科', role: '网络与新媒体', org: '云南民族大学', desc: '学的是怎么做内容，怎么让内容被看见。', light: true },
    ],

    // v23: the film plays in the hero, under his name and headline (his request, 2026-10-23: 「这个片子甚至可以放到我主页头像下面」).
    film: {
      name: '来不及爱你',
      meta: '我导演的 AI 短片 · 57 秒',
      play: '播放《来不及爱你》',
      alt: '《来不及爱你》：她在船舱里望向镜头，眼里含着泪',
      link: '这部片子怎么拍的',
      url: 'https://qinxujunai.github.io/laibuji-aini/',
    },

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
      onPage: '本页',
      // The first line of a case page says what the page is: the making of the product, not the product.
      howMade: (name) => `${name} · 怎么做的`,
      techTitle: '技术细节',
      techWhat: (hs) => hs.join('、'),
      tryIt: (name) => (/^[A-Za-z]/.test(name) ? `试试 ${name}` : `试试${name}`),
      contactHeadline: '欢迎交流',
      contactBody: '',
      liveNote: (date) => `GitHub 数据每 6 小时自动更新，最近一次 ${date}`,
    },
  },

  en: {
    lang: 'en',
    path: '/en/',
    title: 'Qin Xujun · I build things with AI, and share what I think',
    description: 'Three works you can open today, one method: the model makes it fast, the boundaries make it right. VoiceFlow, AI Signal, Wanxiang, and ai.vibecoding, where I share the method.',
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
    workHeadline: 'Start with your own problem',
    workLine: 'Three works, all live, ready to open',
    open: (name) => `Open ${name}`,
    readCase: 'How it was made',
    whyLabel: 'Why I built it',
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
      view: 'In the age of AI, asking a good question matters more and more',
      viewNote: 'Behind a good question is judgement. Judgement comes from doing things that compound over years: exercise, reading, friendship. Every day you put in counts, and anyone who wants to catch up has to start from your first day.',
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
      note: 'Open source by Datawhale · free · no coding background needed',
      link: 'Start learning',
      url: 'https://datawhalechina.github.io/easy-vibe/en/',
      alt: 'The easy-vibe course website',
    },

    pathTitle: 'Path',
    pathHeadline: 'From getting content seen to getting AI shipped',
    pathLine: 'I started in content; now I build AI projects for finance and government clients',
    journey: [
      { when: '2026 to now', role: 'AI Project Manager', org: '', desc: '' },
      { when: '2025–2026', role: 'AI Solution Architect', org: 'Bizhi Technology', desc: '5+ clients reached procurement review. The work: AI that lets people query data in one sentence, from diagnosis to payment, including the bids.' },
      { when: '2024–2025', role: 'AI Project Lead', org: 'Yinian Intelligence', desc: 'One script went from three hours to twenty minutes: I built a script-writing agent in Feishu. Took over a WeBank AI course project, found the problem in 48 hours, and the client asked for me by name. Made the opening film for a Founder Securities event with AI.' },
      { when: '2023–2024', role: 'Branded Content Producer', org: 'Zhuanzhi Network', desc: '150-odd in-feed ad scripts behind more than ¥100k of monthly ad spend. A Douyin travel account grown by 2,000+ followers in three months. Produced ICBC’s brand film from concept to delivery.' },
      { when: '2022', role: 'Community Operations (intern)', org: 'Douyin Digital Academy', desc: '', light: true },
      { when: 'B.A.', role: 'Network and New Media', org: 'Yunnan Minzu University', desc: 'How to make content, and how to get it seen.', light: true },
    ],

    film: {
      name: '来不及爱你',
      meta: 'An AI short film I directed · 57 sec',
      play: 'Play 来不及爱你',
      alt: '来不及爱你: in the ferry cabin she looks into the lens, eyes wet with tears',
      link: 'How it was made',
      url: 'https://qinxujunai.github.io/laibuji-aini/en/',
    },

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
      onPage: 'On this page',
      howMade: (name) => `${name} · How it was made`,
      techTitle: 'The details',
      techWhat: (hs) => hs.join(', '),
      tryIt: (name) => `Try ${name}`,
      contactHeadline: 'Let’s talk',
      contactBody: '',
      liveNote: (date) => `GitHub numbers refresh every six hours, last on ${date}`,
    },
  },
};
