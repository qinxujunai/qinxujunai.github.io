import fs from 'node:fs';
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
    description: '我导演的 AI 短片《来不及爱你》，三个打开就能用的作品，还有我推荐的六本书、AI 教程和健身计划。',
    skip: '跳到正文',
    switchLabel: 'English',
    switchLang: 'en',
    themeLabel: '切换深色或浅色',
    name: '秦徐俊',
    // The name card's two lines under the name. He presents himself, not an employer or a job title.
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
    nav: { work: '作品', share: '做法', three: '三件事', contact: '联系' },
    home: '首页',

    workTitle: '作品',
    // v21: the thesis the three works share. Each one then says, under 「靠得住，是因为」, how it keeps that promise.
    // v23: a headline that states a fact the three stories prove (each starts from his own problem).
    workHeadline: '三个作品，都从我自己的问题开始',
    workLine: '都在线上，打开就能用',
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
      view: '每天做的事，都是在为想成为的自己投票',
      viewNote: '',
      principles: [
        ['行动', '想法要做出来，才有价值', '2026 年 3 月的时候，我对代码一无所知。但慢慢地，我可以用它来解决工作日常遇到的问题，可以搭建自己的网站，实现自己想呈现的东西。'],
        ['复利', '每天进步 1%，一年是 37 倍', '看书，阅读，健身这些长期主义的事情……不是那种正反馈来得非常快的，但是做一天有一天的收获。'],
        ['过程', '过程本身就是奖励', '如果做一件事情需要靠自律跟意志力，那大概率是做不下去的。……不让自己连续两天不去做一件事情。'],
      ],
    },

    // v26: six books that changed him (his list and his words, 2026-10-24). 「书里说」 is checked against the books
    // and published notes (认知觉醒's order is 改变量 > 行动量 > 思考量 > 学习量; 小狗钱钱's 金鹅账户 and the 50% rule).
    // Covers (v26.2, 2026-10-24, his request: 「真正用这本书最权威的封面」): the mainland edition most rated on Douban
    // (book.douban.com subject 3608208, 26369699, 35193035). v26.3: 人性的弱点, 小狗钱钱, 非暴力沟通 are the editions
    // he read, from his photos (subject 27048361, 35295592, 35519608): he only recommends what he has read. Shown for identification, as any bookshop or review does; files in assets/media/book-1…6.webp.
    books: {
      title: '阅读',
      // v27.4: no 「改变人生」 (his words: 「我没有说『改变我人生的六本书』，真的不要夸张。就是推荐六本我看过的好书」).
      // 「从头读完」 is his: 「我推荐的每一本书，都是我真正意义上从头到尾看完过的，我才会去推荐」.
      headline: '六本书，每一本都从头读完过',
      line: '点开一本，看看书里讲什么、我读到了什么',
      mine: '我的体会',
      // v27.5: each book opens on WeChat Read (his choice A, 2026-10-24). URLs from WeChat Read bookIds, encoded as in
      // malinkang/weread2notion (MIT): 749907, 522205 (陶曚 译; his 亦言 edition is not on WeChat Read), 798755 (王钟欣 余茜 译;
      // his 文燚 edition is not there), 3300060305, 25615385, 33628204. Each page checked in a browser on 2026-10-24.
      read: '在微信读书打开',
      core: '书里说',
      list: [
        { t: '牧羊少年奇幻之旅', wr: 'https://weread.qq.com/web/bookDetail/7c932dd05b71537c9f3404d', wrNote: '', a: '保罗·柯艾略', ed: '南海出版公司 · 丁文林 译', mine: '真心想要一件事时，整个宇宙都会来帮忙。每当恐惧、不知道该往哪里走，我都会想起这本书。', core: '牧羊少年圣地亚哥为了一个反复出现的梦，卖掉羊群，穿过沙漠去找宝藏。书里最有名的一句：当你真心渴望某样东西，整个宇宙都会联合起来帮你。' },
        { t: '人性的弱点', wr: 'https://weread.qq.com/web/bookDetail/a233272057f7dda23713095', wrNote: '微信读书上是陶曚译本', a: '戴尔·卡耐基', ed: '中国友谊出版公司 · 亦言 译（全集，完整全译本）', mine: '发自内心地关心别人，真正地换位思考。说到底，真诚永远是最重要的。', core: '真诚地关心别人，从对方的角度看事情，真心让对方觉得自己重要。卡耐基讲的都是这几件事，前提是真诚，不是技巧。' },
        { t: '小狗钱钱', wr: 'https://weread.qq.com/web/bookDetail/ea232e205c3023ea2c96525', wrNote: '微信读书上是王钟欣、余茜译本', a: '博多·舍费尔', ed: '中信出版集团 · 文燚 译', mine: '想走向财务自由，这是我会推荐的第一本理财书。', core: '一只会说话的狗教女孩吉娅理财：帮人照顾狗挣到第一笔钱，因为她喜欢狗，别人才愿意付钱；收入的一半存进「金鹅账户」，只存不花，让它慢慢生出收入。' },
        { t: '非暴力沟通', wr: 'https://weread.qq.com/web/bookDetail/b7d32470813ab7e0eg015e3f', wrNote: '', a: '马歇尔·卢森堡', ed: '华夏出版社 · 刘轶 译（修订版）', mine: '我们常常担心，说出自己的需要会被攻击、显得软弱。其实真诚地说出内心的诉求，不用暴力去沟通，才最重要。', core: '说话时把四件事分开：观察到了什么（不加评判）、我的感受、我的需要、我的请求。' },
        { t: '被讨厌的勇气', wr: 'https://weread.qq.com/web/bookDetail/8b9329607186dc198b9bdab', wrNote: '', a: '岸见一郎　古贺史健', ed: '机械工业出版社 · 渠海霞 译', mine: '怎么做是自己的事，谁承担结果，谁就负责；别人怎么想，是别人的课题。', core: '阿德勒心理学的「课题分离」：一件事最后由谁承担结果，就是谁的课题。不去干涉别人的课题，也不让别人干涉自己的。' },
        { t: '认知觉醒', wr: 'https://weread.qq.com/web/bookDetail/6a732ce07201202c6a7b30a', wrNote: '', a: '周岭', ed: '人民邮电出版社', mine: '读完一本书，思考或行动真的有所改变，这本书才算读进去了。', core: '人有本能脑、情绪脑、理智脑，前两个更快、更有力。衡量成长的顺序是：改变量 > 行动量 > 思考量 > 学习量。' },
      ],
    },

    // A recommendation, not his work: Datawhale's open course easy-vibe. Facts from its README
    // (github.com/datawhalechina/easy-vibe, docs-readme/zh-CN, "你的学习路径"), checked 2026-10-21.
    // v26.5 (2026-10-24): three Douyin creators he recommends. His reasons are his words (docs/his-words-2026-10-24.md).
    // Who they are: from each profile's own bio, read 2026-10-24. Avatars: their public profile pictures.
    // Links: the profile without his share tracking (his share link carried his own user id).
    // v27.1: the three stay together as one row of cards (his words: 「为什么要把三个人分开来呢」). Links are the share
    // links he sent (「我不是发过链接给你，点击就能跳出来吗」), shown everywhere, WeChat included.
    follow: {
      // v27.2: inside 阅读, under the books. His words: 「推荐的人是获取知识的一种，所以三个人放在一块就行」.
      headline: '我常看的三位抖音博主',
      // His words: 「去听那些你想成为的人的建议，他们的思想还有书籍里的思想会反过来塑造你自己」 (「你」 dropped, v26.11).
      line: '上下班的路上，我常看他们的视频',
      why: '我为什么推荐',
      go: '去抖音看看',
      list: [
        { name: 'Jack 叔叔', value: '讲迷茫、焦虑的时候该做什么', handle: '抖音「Jack要加油」', url: 'https://v.douyin.com/JxIstHXwiBU/', who: '主页简介：「每天高价值更新……每日解读 + 每周总结」', why: '他有很多切片，是我……刚毕业的时候刷到的。那句话改变了我很多：迷茫、焦虑、痛苦，不知道做什么的时候，就去健身、阅读、交朋友。我自己也加了学技能这一项。' },
        { name: '鲁大魔', value: '讲他自己的创业经历和商业方法论', handle: '抖音「鲁大魔」', url: 'https://v.douyin.com/iGU5ccOAeWU/', who: '主页简介：「2003 年自学编程做网站……现在是一名 AI 从业者」', why: '我看了他很多视频，他的经历，还有很多商业方法论，我觉得非常棒。' },
        { name: '童年终结者', value: '讲知行合一，讲职场里的人性', handle: '抖音「童年终结者」', url: 'https://v.douyin.com/NVPxJZpySqY/', who: '主页简介：「是个普通人，有缺点，不完美……和大家相遇已经第六年啦」', why: '我觉得无论是知行合一，还是职场人性的很多东西，他的很多视频都非常好。' },
      ],
    },

    // v27 (2026-10-24): 「三件事」. His words: 「每天当你迷茫不知道做什么，就做三件事情：健身、阅读、交朋友。挑一件事情，再学技能」
    // and 「这三块的最佳时间，我已经放给大家了」 (docs/his-words-2026-10-24.md). The line came to him from 杰克叔叔 (his reason
    // for recommending Jack), so Jack's card opens the section. Order is his: books, then AI, then fitness.
    three: {
      title: '三件事',
      headline: '迷茫的时候，我会做三件事',
      // v27.1: the three things right under the headline (his words: 「那哪三件事情呢？直接放出来啊」).
      items: [
        { id: 'books', icon: 'book', name: '阅读', line: '六本书 · 三位博主' },
        { id: 'skill', icon: 'spark', name: '学技能', line: '学 AI' },
        { id: 'fitness', icon: 'weight', name: '健身', line: '三分化训练' },
      ],
      skill: {
        title: '学技能',
        headline: '学 AI，我推荐 easy-vibe',
        vibecoding: '我也写了一份：用 AI 做产品的方法',
        vibeNote: '6 章 · 约 10 分钟',
        vibeLink: '开始阅读',
      },
      // Facts from Douyin, read 2026-10-24: 凯圣王's bio 「健身基础知识连续分享六年」; the collection 「凯圣王-谭成义三分化」 (mix 7623788294471419945):
      // 6 episodes, 38,183,663 plays, 891,227 saves; episode 1 「训练计划」 21:29 (aweme 7623732958012198179); its description:
      // 「新手和训练发烧友都可以用」, 动作选择、周期计划、设计思路; episodes 2, 4, 5 跟练 with 第三视角 on 常见错误; episode 3 名词释义.
      // 谭成义 is 「谭指导」 in their descriptions. His own reason: 「这个就是我这个网站可以带给所有人的价值」; he asked me to research why.
      fitness: {
        title: '健身',
        headline: '我推荐这套三分化',
        line: '凯圣王和谭成义一起做的三分化训练，新手和练过一段时间的人都能用',
        coach: '凯圣王',
        handle: '抖音「凯圣王」',
        who: '健身基础知识连续分享六年',
        course: '凯圣王-谭成义三分化',
        meta: '抖音合集 · 6 集',
        ep: '第 1 集 · 训练计划 · 21 分钟',
        desc: '先讲动作怎么选、周期怎么排、为什么这样设计，再一天一天带着练，用第三视角指出常见的错误。',
        whyLabel: '为什么是这一套',
        why: '计划、跟练、名词，一套里都讲到了，新手不用再东拼西凑。截至 2026 年 10 月，合集在抖音有 3800 多万次播放、近 90 万次收藏。',
        go: '从第 1 集看起',
        url: 'https://www.iesdouyin.com/share/video/7623732958012198179/',
      },
    },

    recommend: {
      title: '推荐',
      headline: '想系统学用 AI 做产品，我推荐 easy-vibe',
      line: '从找到一个好想法，讲到把产品上线',
      note: 'Datawhale 开源教程 · 免费 · 零基础可学',
      link: '开始学习',
      url: 'https://datawhalechina.github.io/easy-vibe/zh-cn/',
      alt: 'easy-vibe 教程网站首页',
    },


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
    contactLead: '聊 AI，聊产品，聊正在做的事',
    // v27 (2026-10-24): the ending, written from his words (docs/his-words-2026-10-24.md 「结尾想说的话」), at his request
    // (「用顶级文笔……不要生搬硬套」). No graduation year (privacy), no employer names for the teaching years (his choice:
    // 「按你的想法」), no 「你」 at the reader (v26.11). It replaces the ai.vibecoding manifesto under the card (his choice).
    letter: {
      title: '天行健，君子以自强不息',
      body: [
        '刚毕业的时候，我还没有接触过 AI。大学那几年常常迷茫，也曾向当时觉得最权威的人求教，却没有等到回音。后来，我做过老师，做过内容运营，尝试过许多事，才渐渐明白：答案不在别人那里，而在每一天所做的事情里。',
        '所以每当迷茫，我便去做三件事：阅读，学一门技能，锻炼身体。上班路上听一段长视频，下班路上听一期播客；想不通的事，就和 Claude、ChatGPT 慢慢聊。读过的书、听过的话，终会一点点沉淀为自己的经验。',
        '我始终相信真诚，守住自己的能量边界，也相信时间的复利。日拱一卒无有尽，功不唐捐终入海。人生没有白走的路，每一步都算数。',
      ],
    },
    cardLabel: '秦徐俊的名片',
    qrAlt: '秦徐俊的微信二维码',
    hint: {
      default: '用微信扫一扫，或在微信里长按二维码',
      wechat: '长按二维码添加我',
      phone: '', // v27.12: the button says it; the hint only shows the result after a tap
      desktop: '用手机微信扫一扫',
    },
    save: '保存名片',
    // His WeChat ID (他提供后填入). When set, phones outside WeChat get 「添加微信」 (copies the ID, then opens WeChat).
    wechatId: 'praxiscore', // his WeChat ID, given by him for this site (2026-10-20)
    wechatLabel: '微信',
    scanLabel: '微信扫一扫',
    copyWechat: '添加微信',
    copyOnly: '复制微信号',
    copied: '已复制 praxiscore 去微信搜索里粘贴',
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
    description: 'An AI short film I directed, three works ready to open, and the books, AI course and training plan I recommend.',
    skip: 'Skip to content',
    switchLabel: '中文',
    switchLang: 'zh-CN',
    themeLabel: 'Switch between dark and light',
    name: 'Qin Xujun',
    org: 'qinxujunai.github.io',
    portraitAlt: 'Photo of Qin Xujun',
    lede: 'I build things with AI, and share how I do it',
    now: 'Let AI decompose, generate, and verify, while people keep the goal, the boundaries, and the taste', // his words, adapted
    addWechat: 'Add me on WeChat',
    navWechat: 'WeChat',
    seeWork: 'See what I’ve made',
    navLabel: 'Sections',
    nav: { work: 'Work', share: 'Practice', three: 'Three things', contact: 'Contact' },
    home: 'Home',

    workTitle: 'Work',
    workHeadline: 'Three works, each started with a problem of my own',
    workLine: 'All live, ready to open',
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
      view: 'What I do each day is a vote for who I want to become',
      viewNote: '',
      principles: [
        ['Action', 'An idea is worth something once it is made', 'In March 2026 I knew nothing about code. Little by little I used it to solve problems at work, then to build my own website and make what I wanted to show.'],
        ['Compounding', '1% a day is 37 times in a year', 'Reading, exercise, the long-haul things … the reward doesn’t come quickly, but every day put in is a day gained.'],
        ['Process', 'The process itself is the reward', 'If something takes self-discipline and willpower, it probably won’t last. … Just never skip it two days in a row.'],
      ],
    },

    books: {
      title: 'Reading',
      headline: 'Six books, each read cover to cover',
      line: 'Open one to see what it says and what I took from it',
      mine: 'What I took from it',
      read: 'Open in WeChat Read',
      core: 'What the book says',
      list: [
        { t: 'The Alchemist', wr: 'https://weread.qq.com/web/bookDetail/7c932dd05b71537c9f3404d', wrNote: '', a: 'Paulo Coelho', ed: 'Chinese edition: Nanhai, tr. Ding Wenlin', mine: 'When you truly want something, the whole universe comes to help. Whenever I am afraid or unsure of the way, I think of this book.', core: 'Santiago, a shepherd, sells his flock to chase a recurring dream of treasure across the desert. Its best-known line: when you want something, all the universe conspires in helping you to achieve it.' },
        { t: 'How to Win Friends and Influence People', wr: 'https://weread.qq.com/web/bookDetail/a233272057f7dda23713095', wrNote: 'On WeChat Read: the Tao Meng translation', a: 'Dale Carnegie', ed: 'Chinese edition: China Friendship, tr. Yi Yan (complete)', mine: 'Care about people from the heart, and truly see things from their side. In the end, sincerity matters most.', core: 'Be genuinely interested in other people, see things from their point of view, and make them feel important, sincerely. Sincerity first, technique second.' },
        { t: 'A Dog Named Money', wr: 'https://weread.qq.com/web/bookDetail/ea232e205c3023ea2c96525', wrNote: 'On WeChat Read: the Wang Zhongxin and Yu Qian translation', a: 'Bodo Schäfer', ed: 'Chinese edition: CITIC, tr. Wen Yi', mine: 'For the road to financial freedom, this is the first money book I would recommend.', core: 'A talking dog teaches a girl named Kira about money: she earns her first income looking after a dog, because she loves dogs; half of what she earns goes into a “goose” account that is never spent, so it can lay eggs.' },
        { t: 'Nonviolent Communication', wr: 'https://weread.qq.com/web/bookDetail/b7d32470813ab7e0eg015e3f', wrNote: '', a: 'Marshall Rosenberg', ed: 'Chinese edition: Huaxia, tr. Liu Yi (revised)', mine: 'We often fear that saying what we need will get us attacked or make us look weak. Saying it honestly, without violence, is what matters most.', core: 'Keep four things apart when you speak: what you observed (without judging), what you feel, what you need, and what you ask for.' },
        { t: 'The Courage to Be Disliked', wr: 'https://weread.qq.com/web/bookDetail/8b9329607186dc198b9bdab', wrNote: '', a: 'Ichiro Kishimi, Fumitake Koga', ed: 'Chinese edition: China Machine Press, tr. Qu Haixia', mine: 'What I do is my task; whoever bears the result is responsible for it. What others think is their task.', core: 'Adler’s “separation of tasks”: whoever ultimately bears the consequence owns the task. Don’t intrude on other people’s tasks, and don’t let them intrude on yours.' },
        { t: 'Cognitive Awakening (认知觉醒)', wr: 'https://weread.qq.com/web/bookDetail/6a732ce07201202c6a7b30a', wrNote: '', a: 'Zhou Ling', ed: 'Posts & Telecom Press', mine: 'A book is truly read only when it changes how I think or act.', core: 'We have an instinctive brain, an emotional brain and a rational brain, and the first two are faster and stronger. Growth ranks: change > action > thinking > learning.' },
      ],
    },

    follow: {
      headline: 'Three Douyin creators I watch',
      line: 'On my way to and from work',
      why: 'Why I recommend them',
      go: 'Watch on Douyin',
      list: [
        { name: 'Jack', value: 'On what to do when you feel lost or anxious', handle: 'Douyin: Jack要加油', url: 'https://v.douyin.com/JxIstHXwiBU/', who: 'From his profile: “High-value updates every day … a daily read and a weekly roundup”', why: 'I came across his clips just after graduating. One line changed me a lot: when lost, anxious or in pain, not knowing what to do, go to the gym, read, make friends. I added one more: learn a skill.' },
        { name: 'Lu Damo', value: 'His own story as a founder, and how business works', handle: 'Douyin: 鲁大魔', url: 'https://v.douyin.com/iGU5ccOAeWU/', who: 'From his profile: “Taught myself to code and build websites in 2003 … now I work in AI”', why: 'I have watched a lot of his videos: his story, and a lot of business thinking. I think they are excellent.' },
        { name: 'Tongnian Zhongjiezhe', value: 'Doing what you know, and how people really work at work', handle: 'Douyin: 童年终结者', url: 'https://v.douyin.com/NVPxJZpySqY/', who: 'From his profile: “Just an ordinary person, with flaws, not perfect … our sixth year together”', why: 'On putting what you know into practice, and on how people work at work, so many of his videos are really good.' },
      ],
    },

    three: {
      title: 'Three things',
      headline: 'When I feel lost, I do three things',
      items: [
        { id: 'books', icon: 'book', name: 'Reading', line: 'Six books · three creators' },
        { id: 'skill', icon: 'spark', name: 'A skill', line: 'Learn AI' },
        { id: 'fitness', icon: 'weight', name: 'Fitness', line: 'A training plan' },
      ],
      skill: {
        title: 'Learning a skill',
        headline: 'To learn AI, I recommend easy-vibe',
        vibecoding: 'I wrote one too: how I build products with AI',
        vibeNote: '6 chapters · about 10 minutes · in Chinese',
        vibeLink: 'Start reading',
      },
      fitness: {
        title: 'Fitness',
        headline: 'I recommend this three-day split',
        line: 'A three-day split by Kai Shengwang and Tan Chengyi, for beginners and for people who already train',
        coach: 'Kai Shengwang',
        handle: 'Douyin: 凯圣王',
        who: 'Six years of sharing the basics of training',
        course: '凯圣王-谭成义三分化 (three-day split)',
        meta: 'Douyin series · 6 episodes · in Chinese',
        ep: 'Episode 1 · The plan · 21 min',
        desc: 'First how to choose the lifts, how to plan the cycle and why it is designed this way; then a full day at a time, with common mistakes shown from a third camera.',
        whyLabel: 'Why this one',
        why: 'The plan, the follow-along sessions and the vocabulary are all in one series, so a beginner doesn’t have to piece things together. As of October 2026 it has more than 38 million plays and nearly 900,000 saves on Douyin.',
        go: 'Start with episode 1',
        url: 'https://www.iesdouyin.com/share/video/7623732958012198179/',
      },
    },

    recommend: {
      title: 'Recommended',
      headline: 'Want to learn to build with AI properly? I recommend easy-vibe',
      line: 'From finding a good idea to shipping the product',
      note: 'An open course by Datawhale · free · no coding background needed',
      link: 'Start learning',
      url: 'https://datawhalechina.github.io/easy-vibe/en/',
      alt: 'The easy-vibe course website',
    },


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
    letter: {
      title: 'As heaven moves on, ceaselessly, so the noble keep striving',
      body: [
        'When I graduated, I had not yet touched AI. My university years were often uncertain; I asked the people I thought had the answers, and no reply came. Since then I have taught, run content, and tried many things, and slowly I understood: the answer is not with anyone else. It is in what we do each day.',
        'So whenever I feel lost, I do three things: read, learn a skill, and train. A long video on the way to work, a podcast on the way home; whatever I cannot work out, I talk through slowly with Claude or ChatGPT. The books read and the words heard settle, little by little, into experience of my own.',
        'I still believe in sincerity, in guarding my own energy, and in the compounding of time. Small steps, taken every day, are never wasted. No road walked is a wasted road; every step counts.',
      ],
    },
    cardLabel: 'Qin Xujun’s card',
    qrAlt: 'Qin Xujun’s WeChat QR code',
    hint: {
      default: 'Scan with WeChat, or long-press the code inside WeChat',
      wechat: 'Long-press the code to add me',
      phone: '',
      desktop: 'Scan with WeChat on your phone',
    },
    save: 'Save the card',
    wechatId: 'praxiscore',
    wechatLabel: 'WeChat',
    scanLabel: 'Scan with WeChat',
    copyWechat: 'Add on WeChat',
    copyOnly: 'Copy my WeChat ID',
    copied: 'Copied praxiscore · paste it into WeChat search',
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

// His film, playable right in the first screen (v23). Nothing downloads until Play. One file, his 4K web version
// (never transcoded), on two hosts. Which one plays is decided in one place for both sites: the film repository's
// src/hosts.json, copied here as src/film-hosts.json by scripts/film-hosts.mjs (never edit the copy; switch with
// npm run host -- tencent | cloudflare in the film repository). The other host is used only when the active one cannot
// be reached at all. These two addresses are the only resources the site loads from another origin.
const filmHosts = JSON.parse(fs.readFileSync(new URL('./film-hosts.json', import.meta.url), 'utf8'));
export const FILM = {
  active: filmHosts.active,
  play: filmHosts.hosts[filmHosts.active].play,
  backup: Object.entries(filmHosts.hosts).find(([k]) => k !== filmHosts.active)[1].play,
  hosts: filmHosts.hosts,
};
