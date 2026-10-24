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
    title: '秦徐俊 · 我用 AI 做东西，也把做法分享出来',
    description: '一部我导演的 AI 短片《来不及爱你》，三个在线上、打开就能用的作品，和一套能照着做的方法 ai.vibecoding。',
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
    // v24 (2026-10-23): he chose 「做法」 over 「想法」: a method others can follow is worth more than an opinion.
    lede: '我用 AI 做东西，也把做法分享出来',
    // his words (ai.vibecoding hero.subtitle, May 2026), with 让你 → 让人 at his request: the home page speaks to everyone.
    now: '让 AI 负责拆解、生成与验证，让人守住目标、边界与品味',
    addWechat: '加我微信',
    navWechat: '加微信',
    seeWork: '看看作品',
    navLabel: '章节',
    nav: { work: '作品', share: '做法', books: '书架', contact: '联系' },
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
      title: '做法',
      // v26 (2026-10-24): his own words, docs/his-words-2026-10-24.md. Quoted verbatim; 「……」 marks a cut.
      view: '我们每天都在用行动，为自己要成为什么样的人在投票',
      viewNote: '你想要什么并不重要，重要的是你为了想要的东西做了些什么事情。',
      principles: [
        ['行动', '想法本身没有任何价值', '今年 3 月份的时候，我对代码一无所知。但慢慢地，我可以用它来解决工作日常遇到的问题，可以搭建自己的网站，实现自己想呈现的东西。'],
        ['复利', '每天比昨天进步 1%，一年就是 37 倍', '看书，阅读，健身这些长期主义的事情……不是那种正反馈来得非常快的，但是你做一天有一天的收获。'],
        ['过程', '让过程本身就是奖励', '如果做一件事情需要靠自律跟意志力，那大概率是做不下去的。……不让自己连续两天不去做一件事情。'],
      ],
      name: 'ai.vibecoding',
      // his words: the hero title of ai.vibecoding (May 2026)
      quote: '用自然语言，创造可运行的作品',
      intro: '我把用 AI 做产品的方法写成了一个网站，零基础也能读',
      note: '10 章 · 约 18 分钟',
      link: '开始阅读',
    },

    // v26: six books that changed him (his list and his words, 2026-10-24). 「书里说」 is checked against the books
    // and published notes (认知觉醒's order is 改变量 > 行动量 > 思考量 > 学习量; 小狗钱钱's 金鹅账户 and the 50% rule).
    // Covers (v26.2, 2026-10-24, his request: 「真正用这本书最权威的封面」): the mainland edition most rated on Douban
    // (book.douban.com subject 3608208, 26369699, 35193035). v26.3: 人性的弱点, 小狗钱钱, 非暴力沟通 are the editions
    // he read, from his photos (subject 27048361, 35295592, 35519608): he only recommends what he has read. Shown for identification, as any bookshop or review does; files in assets/media/book-1…6.webp.
    books: {
      title: '书架',
      headline: '改变过我的六本书',
      line: '看书并不会改变人生，但它会潜移默化地影响怎么去思考、怎么去行动',
      mine: '它改变了我',
      core: '书里说',
      list: [
        { t: '牧羊少年奇幻之旅', a: '保罗·柯艾略', ed: '南海出版公司 · 丁文林 译', mine: '如果你真的很想要一个事情，宇宙都会合力来帮你解决。……当你恐惧、不知道怎么走的时候，我都推荐看这本书。', core: '牧羊少年圣地亚哥为了一个反复出现的梦，卖掉羊群，穿过沙漠去找宝藏。书里最有名的一句：当你真心渴望某样东西，整个宇宙都会联合起来帮你。' },
        { t: '人性的弱点', a: '戴尔·卡耐基', ed: '中国友谊出版公司 · 亦言 译（全集，完整全译本）', mine: '要发自内心地去关心、在乎别人，去真正地换位思考……真诚永远都是最重要的东西。', core: '真诚地关心别人，从对方的角度看事情，真心让对方觉得自己重要。卡耐基讲的都是这几件事，前提是真诚，不是技巧。' },
        { t: '小狗钱钱', a: '博多·舍费尔', ed: '中信出版集团 · 文燚 译', mine: '我觉得这是任何一个想要财富自由的人，必须看的第一本理财书。', core: '一只会说话的狗教女孩吉娅理财：帮人照顾狗挣到第一笔钱，因为她喜欢狗，别人才愿意付钱；收入的一半存进「金鹅账户」，只存不花，让它慢慢生出收入。' },
        { t: '非暴力沟通', a: '马歇尔·卢森堡', ed: '华夏出版社 · 刘轶 译（修订版）', mine: '很多时候我们担心表达自己会被别人攻击、显得软弱，但其实真诚地去表达自己内心的诉求，不要用暴力去沟通，这真的很重要。', core: '说话时把四件事分开：观察到了什么（不加评判）、我的感受、我的需要、我的请求。' },
        { t: '被讨厌的勇气', a: '岸见一郎　古贺史健', ed: '机械工业出版社 · 渠海霞 译', mine: '你怎么做那是自己的事情，谁为结果买单谁就来负责；至于别人怎么想，那是别人的课题。', core: '阿德勒心理学的「课题分离」：一件事最后由谁承担结果，就是谁的课题。不去干涉别人的课题，也不让别人干涉自己的。' },
        { t: '认知觉醒', a: '周岭', ed: '人民邮电出版社', mine: '只有实实在在的改变——比如看完一本书，改变了一个人的思考、行动或者任何东西，它才是有价值的。', core: '人有本能脑、情绪脑、理智脑，前两个更快、更有力。衡量成长的顺序是：改变量 > 行动量 > 思考量 > 学习量。' },
      ],
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
    pathLine: '做内容出身，做过乙方交付，也在甲方把 AI 用进真实业务',
    journey: [
      // v26 (2026-10-24): four lines, not a résumé (his words: a résumé on the home page has 「没有必要」).
      // 奥普: his correction 2026-10-24: write it up to the signing; it did not fully land. Not 「至今」.
      { when: '2026', role: 'AI 项目经理', org: '奥普智能科技', desc: '推动一家上市公司把协同办公从钉钉迁到飞书，从调研立项做到签约；内部的 AI 需求也由我来接，电商评论打标从一个人每天四五个小时缩到 10 分钟。' },
      { when: '2024–2026', role: 'AI 方案与项目', org: '比智科技 · 一念智能', desc: '为金融、政企客户做 AI 项目：5 家以上客户进入采购评估；接手微众银行的 AI 课程项目，客户点名要我继续负责。' },
      { when: '2023–2024', role: '商业内容交付', org: '专致网络', desc: '写了 150 多条信息流广告脚本，负责工商银行宣传片，从策划到交付。' },
      { when: '本科', role: '网络与新媒体', org: '云南民族大学', desc: '学的是怎么做内容，怎么让内容被看见。', light: true },
    ],

    // v23: the film plays in the hero, under his name and headline (his request, 2026-10-23: 「这个片子甚至可以放到我主页头像下面」).
    film: {
      name: '来不及爱你',
      meta: '我导演的 AI 短片 · 57 秒',
      play: '播放《来不及爱你》',
      alt: '《来不及爱你》：她在船舱里望向镜头，眼里含着泪',
      link: '这部片子怎么拍的',
      url: 'https://qinxujunai.github.io/too-late-to-love-you/',
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
    title: 'Qin Xujun · I build things with AI, and share how I do it',
    description: 'An AI short film I directed, three works you can open today, and ai.vibecoding, a method you can follow.',
    skip: 'Skip to content',
    switchLabel: '中文',
    switchLang: 'zh-CN',
    themeLabel: 'Switch between dark and light',
    name: 'Qin Xujun',
    role: 'I build AI products.',
    org: 'qinxujunai.github.io',
    portraitAlt: 'Photo of Qin Xujun',
    lede: 'I build things with AI, and share how I do it',
    now: 'Let AI decompose, generate, and verify, while people keep the goal, the boundaries, and the taste', // his words, adapted
    addWechat: 'Add me on WeChat',
    navWechat: 'WeChat',
    seeWork: 'See what I’ve made',
    navLabel: 'Sections',
    nav: { work: 'Work', share: 'Practice', books: 'Books', contact: 'Contact' },
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
      title: 'Practice',
      // His words (2026-10-24), translated.
      view: 'Every day, with what we do, we vote for who we are becoming',
      viewNote: 'What you want doesn’t matter. What matters is what you have done for it.',
      principles: [
        ['Action', 'An idea on its own is worth nothing', 'In March this year I knew nothing about code. Little by little I used it to solve problems at work, then to build my own website and make what I wanted to show.'],
        ['Compounding', '1% better than yesterday, every day, is 37 times in a year', 'Reading, exercise, the long-haul things … the reward doesn’t come quickly, but every day you put in, you gain something.'],
        ['Process', 'Make the process itself the reward', 'If something takes self-discipline and willpower, you probably won’t keep it up. … Just never skip it two days in a row.'],
      ],
      name: 'ai.vibecoding',
      quote: 'Use natural language to create working products', // his words
      intro: 'I wrote down how I build products with AI, as a website anyone can read',
      note: '10 chapters · about 18 minutes',
      link: 'Start reading',
    },

    books: {
      title: 'Books',
      headline: 'Six books that changed me',
      line: 'Reading won’t change your life, but it quietly shapes how you think and how you act',
      mine: 'What it changed for me',
      core: 'What the book says',
      list: [
        { t: 'The Alchemist', a: 'Paulo Coelho', ed: 'Chinese edition: Nanhai, tr. Ding Wenlin', mine: 'If you truly want something, the whole universe works together to help you get it. … Whenever you are afraid and don’t know which way to go, read this book.', core: 'Santiago, a shepherd, sells his flock to chase a recurring dream of treasure across the desert. Its best-known line: when you want something, all the universe conspires in helping you to achieve it.' },
        { t: 'How to Win Friends and Influence People', a: 'Dale Carnegie', ed: 'Chinese edition: China Friendship, tr. Yi Yan (complete)', mine: 'Care about people from the heart, truly see things from their side … sincerity is always what matters most.', core: 'Be genuinely interested in other people, see things from their point of view, and make them feel important, sincerely. Sincerity first, technique second.' },
        { t: 'A Dog Named Money', a: 'Bodo Schäfer', ed: 'Chinese edition: CITIC, tr. Wen Yi', mine: 'For anyone who wants financial freedom, this is the first money book to read.', core: 'A talking dog teaches a girl named Kira about money: she earns her first income looking after a dog, because she loves dogs; half of what she earns goes into a “goose” account that is never spent, so it can lay eggs.' },
        { t: 'Nonviolent Communication', a: 'Marshall Rosenberg', ed: 'Chinese edition: Huaxia, tr. Liu Yi (revised)', mine: 'We often fear that saying what we need will get us attacked or make us look weak. Saying it honestly, without violence, really matters.', core: 'Keep four things apart when you speak: what you observed (without judging), what you feel, what you need, and what you ask for.' },
        { t: 'The Courage to Be Disliked', a: 'Ichiro Kishimi, Fumitake Koga', ed: 'Chinese edition: China Machine Press, tr. Qu Haixia', mine: 'What you do is your task; whoever bears the result is responsible for it. What others think is their task.', core: 'Adler’s “separation of tasks”: whoever ultimately bears the consequence owns the task. Don’t intrude on other people’s tasks, and don’t let them intrude on yours.' },
        { t: 'Cognitive Awakening (认知觉醒)', a: 'Zhou Ling', ed: 'Posts & Telecom Press', mine: 'Only real change counts: when a book changes how someone thinks, what they do, anything at all.', core: 'We have an instinctive brain, an emotional brain and a rational brain, and the first two are faster and stronger. Growth ranks: change > action > thinking > learning.' },
      ],
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
    pathLine: 'Started in content, delivered AI for clients, and now put it to work in-house',
    journey: [
      { when: '2026', role: 'AI Project Manager', org: 'Aupu Smart Technology', desc: 'Led a listed company’s move from DingTalk to Feishu from research to a signed contract; took the in-house AI work too: tagging e-commerce reviews went from 4–5 hours a person a day to 10 minutes.' },
      { when: '2024–2026', role: 'AI Solutions & Projects', org: 'Bizhi Technology · Yinian Intelligence', desc: 'AI projects for finance and public-sector clients: 5+ reached procurement review; took over a WeBank AI course project, and the client asked for me by name.' },
      { when: '2023–2024', role: 'Branded Content Producer', org: 'Zhuanzhi Network', desc: 'Wrote 150-odd in-feed ad scripts and produced ICBC’s brand film from concept to delivery.' },
      { when: 'B.A.', role: 'Network and New Media', org: 'Yunnan Minzu University', desc: 'How to make content, and how to get it seen.', light: true },
    ],

    film: {
      name: '来不及爱你',
      meta: 'An AI short film I directed · 57 sec',
      play: 'Play 来不及爱你',
      alt: '来不及爱你: in the ferry cabin she looks into the lens, eyes wet with tears',
      link: 'How it was made',
      url: 'https://qinxujunai.github.io/too-late-to-love-you/en/',
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
