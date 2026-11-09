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
    description: '我导演的 AI 短片《来不及爱你》，三个作品，还有我推荐的书、AI 教程和健身计划。',
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
    workLine: '作品网站和使用方式，都在这里',
    // The button names the product, never 「官网」 (v20: readers did not know what 官网 meant here).
    open: (name) => (/^[A-Za-z]/.test(name) ? `打开 ${name}` : `打开${name}`),
    readCase: '怎么做的',
    whyLabel: '为什么做',
    openSite: (name) => `打开 ${name} 的网站`,
    flagship: {
      key: 'F2',
      hint: '按住说话，松开就输入',
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

    // 阅读: ten books at most, his rule (2026-11-09): 「我只保留 10 本，我后面如果加一本，我就必须把里面的一本给踢出去」.
    // The order is his, left to right by priority. `mine` is his words, lightly edited with his consent; `core` is the
    // book's central idea. Every cover is the edition he read (his WeChat Read shelf, screenshots 2026-11-09, or his photos
    // on 2026-10-24); files are assets/media/book-1…10.webp in list order, heights in BOOK_H (scripts/build.mjs).
    // Links are WeChat Read pages, the URL derived from the bookId as in malinkang/weread2notion (MIT), each opened and
    // checked: 微小的优势 → Amazon (no Chinese edition; ISBN 9781626340466) · 被讨厌的勇气 25615385 · 这世界既残酷也温柔
    // 3300192100 · 牧羊少年 749907 · 穷查理宝典 837932 · 纳瓦尔宝典 44026191 · 人性的弱点 522205 (陶曚 tr.; his 亦言
    // edition is not there) · 小狗钱钱 798755 (王钟欣、余茜 tr.; his 文燚 edition is not there) · 非暴力沟通 3300060305 ·
    // 思考致富 629424. Sources for 「书里说」: the books themselves where he sent them (微小的优势 epub), WeChat Read's
    // own introductions, Douban (这世界既残酷也温柔, subject 26984629 and its reviews). His words: docs/his-words-2026-10-24.md
    // and docs/his-words-2026-11-09.md. Taken off the shelf, his call: 认知觉醒, 高效能人士的七个习惯 (2026-11-09).
    books: {
      title: '阅读',
      headline: '我只推荐十本书',
      line: '想加一本，就得先撤下一本',
      mine: '我的体会',
      read: '在微信读书打开',
      core: '书里说',
      list: [
        { t: '微小的优势', wr: 'https://www.amazon.com/dp/1626340463', go: '在亚马逊看英文原书', wrNote: '', a: '杰夫·奥尔森', ed: '英文原书 The Slight Edge', mine: '以前有人问我，哪一本书能改变一个人的一生，我总是答不上来。这本书才读了一小部分，我已经有答案了。微小的事，短期看不出任何区别；时间拉长，却会成为极厚的护城河，因为谁来，都得花一样的时间。', core: '成功和失败之间没有决定性的跳跃，只有每天简单到容易被忽略的小事：存一点钱、锻炼几分钟、读十页书。做起来容易，不做也一样容易；时间会把它们复利成两种人生。' },
        { t: '被讨厌的勇气', wr: 'https://weread.qq.com/web/bookDetail/8b9329607186dc198b9bdab', wrNote: '', a: '岸见一郎　古贺史健', ed: '机械工业出版社 · 渠海霞 译', mine: '怎么做是自己的事，谁承担结果，谁就负责；别人怎么想，是别人的课题。', core: '阿德勒说，人的烦恼都来自人际关系。解法是「课题分离」：不干涉别人的课题，也不让别人干涉自己的。所以书里说，自由就是被别人讨厌。' },
        { t: '这世界既残酷也温柔', wr: 'https://weread.qq.com/web/bookDetail/c7f32200813abb18ag0101be', wrNote: '', a: '孙宇晨', ed: '九州出版社', mine: '最大的收获是换个角度看问题。不是每句话都认同，但它让我意识到，很多以前觉得理所当然的事，其实可以重新想一想。', core: '「这世界比你想象的残酷，也比你想象的温柔。」孙宇晨写他二十多岁时对财富、工作和生活的看法：年轻时先争取独立，拥抱不确定性，不急着把人生过成一种固定的样子。' },
        { t: '牧羊少年奇幻之旅', wr: 'https://weread.qq.com/web/bookDetail/7c932dd05b71537c9f3404d', wrNote: '', a: '保罗·柯艾略', ed: '南海出版公司 · 丁文林 译', mine: '真心想要一件事时，整个宇宙都会来帮忙。每当恐惧、不知道该往哪里走，我都会想起这本书。', core: '牧羊少年圣地亚哥为了一个反复出现的梦，卖掉羊群，穿过沙漠去追寻自己的「天命」。走到金字塔下才知道，宝藏就埋在他出发的地方；真正让他成为自己的，是这一路。' },
        { t: '穷查理宝典', wr: 'https://weread.qq.com/web/bookDetail/2e0320e05cc92c2e0796c5a', wrNote: '', a: '彼得·考夫曼 编', ed: '中信出版集团 · 李继宏 等译（全新增订本）', mine: '我第一次意识到跨学科思维有多重要：心理学、博弈论，这里懂一点、那里懂一点，慢慢就连成了网。印象最深的一句：我这辈子遇到的聪明人，没有一个不阅读。', core: '芒格主张用多个学科的模型一起思考。他常用逆向思维：生活变好，往往不是因为做对了什么，而是避开了会毁掉人的错事。如果知道会死在哪里，就永远不去那里。' },
        { t: '纳瓦尔宝典', wr: 'https://weread.qq.com/web/bookDetail/e1e32b00729fc94fe1e824d', wrNote: '', a: '埃里克·乔根森 编', ed: '中信出版集团 · 赵灿 译', mine: '前半本讲财富，后半本讲幸福。印象最深的是杠杆：代码和媒体谁都能用。代码一次写好就能一直跑，正是 AI 时代的机会，就像我做的这些网站；表达传播一次，成本几乎为零。', core: '不出卖时间，而是拥有资产：靠专长、责任和杠杆致富。幸福也是一种可以练习的技能，平静的心是它的底色。' },
        { t: '人性的弱点', wr: 'https://weread.qq.com/web/bookDetail/a233272057f7dda23713095', wrNote: '微信读书上是陶曚译本', a: '戴尔·卡耐基', ed: '中国友谊出版公司 · 亦言 译（全集，完整全译本）', mine: '发自内心地关心别人，真正地换位思考。说到底，所有方法的前提都是真诚。', core: '卡耐基的第一条原则是不批评、不指责、不抱怨。人最深的渴望是被重视，所以要真心对别人感兴趣，从对方的角度看事情。' },
        { t: '小狗钱钱', wr: 'https://weread.qq.com/web/bookDetail/ea232e205c3023ea2c96525', wrNote: '微信读书上是王钟欣、余茜译本', a: '博多·舍费尔', ed: '中信出版集团 · 文燚 译', mine: '我第一次意识到，理财就在生活的点点滴滴里：做自己热爱的事，帮别人解决问题，就能创造价值。一个想买电脑的小女孩，一步步真的赚到了钱，每一步都很真实。', core: '一只会说话的狗教女孩吉娅理财：把想要的写下来；决定的事，72 小时内动手；收入的一半存进「金鹅账户」，只存不花，让它生出收入。' },
        { t: '非暴力沟通', wr: 'https://weread.qq.com/web/bookDetail/b7d32470813ab7e0eg015e3f', wrNote: '', a: '马歇尔·卢森堡', ed: '华夏出版社 · 刘轶 译（修订版）', mine: '我们常常担心，说出自己的需要会被攻击、显得软弱。其实敢于真诚地说出内心的诉求，不用暴力去沟通，才是一种力量。', core: '说话时把四件事分开：观察到了什么（不加评判）、我的感受、我的需要、我的请求。卢森堡认为，指责和评判，往往是没被满足的需要换了一种说法。' },
        { t: '思考致富', wr: 'https://weread.qq.com/web/bookDetail/0cc32c40599ab00cc3b986f', wrNote: '', a: '拿破仑·希尔', ed: '天津社会科学院出版社 · 洪友 译（21 世纪修订版）', mine: '它问的是：到底有多想要，又是否真的相信自己能得到。连自己都不相信，就像习得性无助，还没开始就已经放弃了。', core: '致富的 13 个步骤里，第一步是强烈的渴望，第二步是信念：人心能构想并相信的，就能实现。' },
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
        { name: '鲁大魔', value: '讲他自己的创业经历和商业方法论', handle: '抖音「鲁大魔」', url: 'https://v.douyin.com/iGU5ccOAeWU/', who: '主页简介：「2003 年自学编程做网站……现在是一名 AI 从业者」', why: '我看了他很多视频。从自学编程做网站一路走到现在，他把自己的经历和商业方法论都讲得很实在，我觉得非常棒。' },
        { name: '童年终结者', value: '讲知行合一，讲职场里的人性', handle: '抖音「童年终结者」', url: 'https://v.douyin.com/NVPxJZpySqY/', who: '主页简介：「是个普通人，有缺点，不完美……和大家相遇已经第六年啦」', why: '知道和做到之间，往往隔着很远。无论是知行合一，还是职场里的人性，他的很多视频都讲得非常好。' },
      ],
    },

    // 2026-11-09: in 阅读, under the creators: one interview and one podcast he picked (his links). His story: he came across this
    // interview (邵艾伦's official Bilibili account 邵艾伦Alan, published 2026-10-09, 「聊了四个多小时」 per its description), got to
    // know 邵艾伦, heard him recommend The Slight Edge in a livestream with Jack 叔叔, and found the book (now first on the shelf).
    // Then he looked up 孙宇晨 and his podcast. He does not want to look like he takes sides on 孙宇晨, so the cards carry ideas,
    // not verdicts. The three keywords are the ones on the video's own cover (孙学 薄肌 黄毛); their one-line meanings follow the
    // published digests (panewslab.com/zh/articles/01a12034-cb1d-7627-8e1f-52e048809ac1, me.news/contents/319519, read
    // 2026-11-09): 「先自由，后财富」, 「肌肉是你身体的银行账户」, 「别人说什么不重要，自己认定对的就充分执行」. The podcast is the
    // ximalaya album he chose (98108036, uploaded by 野马书馆; its intro is 「一个90后如何实现财富自由。」), share tracking removed.
    // The podcast reason's middle line sums up public descriptions of the show (「先自由，后财富」, 「财富是对价值观的不妥协」), not a
    // full listen. 「身体有一票否决权」 and 「不知道自己不知道」 are his own words (WeChat Moments, docs/his-words-2026-11-09.md).
    // Covers saved locally (assets/media/talk-1.webp from Bilibili, talk-2.webp from ximalaya), so the page makes no outside request.
    // 2026-11-09 (later): his story rewritten in his words (stereotypes first, then the book and the podcast), and his request
    // to add 孙宇晨's book as the shelf's second.
    talks: {
      headline: '一期访谈，一个播客',
      line: '书架上有两本书，就是从这期访谈找到的',
      why: '我为什么推荐',
      keys: '里面讲了',
      list: [
        { t: '对话孙宇晨：年轻人如何抓住 AI 时代的机会？', meta: '邵艾伦 × 孙宇晨 · 四个多小时 · 2026 年 10 月', ratio: 'wide', why: '以前提到孙宇晨，我先想到的是那些刻板印象。无意中刷到这期访谈，听他讲了四个多小时，大受震撼。因为它，我认识了邵艾伦，在他和 Jack 叔叔的直播里，听他推荐改变他人生的《微小的优势》；也重新认识了孙宇晨，读了他的书，听了他的播客。四个小时，换来了两本书和一个播客。很多事本不会发生，最可怕的，是不知道自己不知道。', keys: [['孙学', '先自由，后财富：像给操作系统升级一样，升级对财富和自己的认知'], ['薄肌', '抗阻训练、吃对、管好健康：肌肉是身体的银行账户'], ['黄毛', '自己认定对的事，就充分执行，不被外面的声音带走']], url: 'https://www.bilibili.com/video/BV1fcHD6cEw3/', go: '去 B 站看' },
        { t: '财富自由革命之路', meta: '孙宇晨主讲 · 喜马拉雅', ratio: 'square', why: '读完他的书，又找来他的播客。他把财富自由讲成了一套价值观：先想清楚要什么，再谈怎么赚。越听越觉得有意思。', about: '节目简介：「一个 90 后如何实现财富自由。」', url: 'https://www.ximalaya.com/album/98108036', go: '去喜马拉雅听' },
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
        { id: 'books', icon: 'book', name: '阅读', line: '书 · 博主 · 播客' },
        { id: 'skill', icon: 'spark', name: '学技能', line: '学 AI' },
        { id: 'fitness', icon: 'weight', name: '健身', line: '三分化训练' },
      ],
      skill: {
        title: '学技能',
        headline: '学 AI 编程，我推荐 easy-vibe',
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
        why: '身体有一票否决权，所以要练对。计划、跟练、名词，一套里都讲到了，新手不用再东拼西凑。截至 2026 年 10 月，合集在抖音有 3800 多万次播放、近 90 万次收藏。',
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
    // (「用顶级文笔……不要生搬硬套」). No career history or graduation year; no 「你」 at the reader.
    letter: {
      title: '天行健，君子以自强不息',
      body: [
        '大学时，我也曾迷茫，向自己觉得有答案的人求教，却没有等到回音。后来尝试过许多事，慢慢明白：有些答案要在行动中寻找。',
        '迷茫的时候，我会读书、学一门技能、锻炼身体。路上听视频和播客，想不通的事，就和 Claude、ChatGPT 慢慢聊。读过的书、听过的话、做过的事，一点点成为自己的经验。',
        '我相信真诚，也珍惜自己的能量。比起急着给自己一个定义，我更想把时间花在想做的事情上。日拱一卒，无有尽；功不唐捐，终入海。',
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
    description: 'An AI short film I directed, three projects, and the books, AI course and training plan I recommend.',
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
    workLine: 'Explore each project and how to use it',
    open: (name) => `Open ${name}`,
    readCase: 'How it was made',
    whyLabel: 'Why I built it',
    openSite: (name) => `Open the ${name} website`,
    flagship: {
      key: 'F2',
      hint: 'Hold to speak, release to insert',
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
      headline: 'I recommend only ten books',
      line: 'To add one, I first take one out',
      mine: 'What I took from it',
      read: 'Open in WeChat Read',
      core: 'What the book says',
      list: [
        { t: 'The Slight Edge', wr: 'https://www.amazon.com/dp/1626340463', go: 'See it on Amazon', wrNote: '', a: 'Jeff Olson', ed: 'Turning Simple Disciplines into Massive Success & Happiness', mine: 'When people asked me which one book could change a life, I never had an answer. I have read only a small part of this one, and now I do. Small things make no visible difference in the short run; over time they become a very deep moat, because anyone who comes after has to spend the same time.', core: 'There is no decisive leap between success and failure, only simple, easy-to-overlook things done every day: saving a little, exercising a few minutes, reading ten pages. Easy to do, and just as easy not to; time compounds them into two different lives.' },
        { t: 'The Courage to Be Disliked', wr: 'https://weread.qq.com/web/bookDetail/8b9329607186dc198b9bdab', wrNote: '', a: 'Ichiro Kishimi, Fumitake Koga', ed: 'Chinese edition: China Machine Press, tr. Qu Haixia', mine: 'What I do is my task; whoever bears the result is responsible for it. What others think is their task.', core: 'Adler says all our problems are problems of relationships. The way out is the “separation of tasks”: don’t intrude on others’ tasks or let them intrude on yours. Hence the book’s claim: freedom is being disliked.' },
        { t: 'This World Is Both Cruel and Gentle (这世界既残酷也温柔)', wr: 'https://weread.qq.com/web/bookDetail/c7f32200813abb18ag0101be', wrNote: '', a: 'Sun Yuchen (Justin Sun)', ed: 'Chinese edition: Jiuzhou Press', mine: 'The biggest gain was seeing things from another angle. I don’t agree with every line, but it made me realise that much of what I took for granted is worth thinking through again.', core: '“The world is crueller than you think, and gentler than you think.” Sun writes about how he saw money, work and life in his twenties: become independent while young, embrace uncertainty, and don’t hurry to settle life into a fixed shape.' },
        { t: 'The Alchemist', wr: 'https://weread.qq.com/web/bookDetail/7c932dd05b71537c9f3404d', wrNote: '', a: 'Paulo Coelho', ed: 'Chinese edition: Nanhai, tr. Ding Wenlin', mine: 'When you truly want something, the whole universe comes to help. Whenever I am afraid or unsure of the way, I think of this book.', core: 'Santiago, a shepherd, sells his flock and crosses the desert after a recurring dream, in search of his Personal Legend. Only at the pyramids does he learn the treasure was buried where he set out; what made him who he is was the journey.' },
        { t: 'Poor Charlie’s Almanack', wr: 'https://weread.qq.com/web/bookDetail/2e0320e05cc92c2e0796c5a', wrNote: '', a: 'Peter D. Kaufman, ed.', ed: 'Chinese edition: CITIC, tr. Li Jihong et al. (expanded)', mine: 'It was the first time I saw how much thinking across disciplines matters: psychology, game theory, a little here and a little there, until it all connects. The line that stayed with me: in my whole life, I have known no wise people who didn’t read all the time.', core: 'Munger thinks with the key models of many disciplines at once. His favourite tool is inversion: life gets better less from doing things right than from avoiding the mistakes that ruin you. All I want to know is where I’m going to die, so I’ll never go there.' },
        { t: 'The Almanack of Naval Ravikant', wr: 'https://weread.qq.com/web/bookDetail/e1e32b00729fc94fe1e824d', wrNote: '', a: 'Eric Jorgenson, ed.', ed: 'Chinese edition: CITIC, tr. Zhao Can', mine: 'The first half is about wealth, the second about happiness. What stayed with me is leverage: anyone can use code and media. Code written once keeps running, the opportunity of the AI era, like the sites I build; and spreading what you say costs almost nothing.', core: 'Don’t rent out your time, own assets: get rich with specific knowledge, accountability and leverage. Happiness is a skill you can practise too, and a calm mind is its ground.' },
        { t: 'How to Win Friends and Influence People', wr: 'https://weread.qq.com/web/bookDetail/a233272057f7dda23713095', wrNote: 'On WeChat Read: the Tao Meng translation', a: 'Dale Carnegie', ed: 'Chinese edition: China Friendship, tr. Yi Yan (complete)', mine: 'Care about people from the heart, and truly see things from their side. In the end, every method rests on sincerity.', core: 'Carnegie’s first principle: don’t criticise, condemn or complain. The deepest human urge is to feel important, so be genuinely interested in others and see things from their point of view.' },
        { t: 'A Dog Named Money', wr: 'https://weread.qq.com/web/bookDetail/ea232e205c3023ea2c96525', wrNote: 'On WeChat Read: the Wang Zhongxin and Yu Qian translation', a: 'Bodo Schäfer', ed: 'Chinese edition: CITIC, tr. Wen Yi', mine: 'It was the first time I saw that money is in the small things of everyday life: do what you love, solve someone’s problem, and you create value. A girl who wants a computer really does earn the money, step by step, and every step feels real.', core: 'A talking dog teaches a girl named Kira about money: write down what you want; act on a decision within 72 hours; put half of what you earn into a “goose” account that is never spent, so it can lay eggs.' },
        { t: 'Nonviolent Communication', wr: 'https://weread.qq.com/web/bookDetail/b7d32470813ab7e0eg015e3f', wrNote: '', a: 'Marshall Rosenberg', ed: 'Chinese edition: Huaxia, tr. Liu Yi (revised)', mine: 'We often fear that saying what we need will get us attacked or make us look weak. Daring to say it honestly, without violence, is a kind of strength.', core: 'Keep four things apart when you speak: what you observed (without judging), what you feel, what you need, and what you ask for. Rosenberg holds that blame and judgement are often unmet needs in another form.' },
        { t: 'Think and Grow Rich', wr: 'https://weread.qq.com/web/bookDetail/0cc32c40599ab00cc3b986f', wrNote: '', a: 'Napoleon Hill', ed: 'Chinese edition: Tianjin Academy of Social Sciences Press, tr. Hong You (21st-century edition)', mine: 'It asks how badly you really want something, and whether you truly believe you can have it. Without that belief it is like learned helplessness: giving up before starting.', core: 'Hill studied hundreds of successful people and set out thirteen steps to riches: the first is burning desire, the second is faith. Its best-known line: whatever the mind can conceive and believe, it can achieve. Every achievement begins as a thought.' },
      ],
    },

    follow: {
      headline: 'Three Douyin creators I watch',
      line: 'On my way to and from work',
      why: 'Why I recommend them',
      go: 'Watch on Douyin',
      list: [
        { name: 'Jack', value: 'On what to do when you feel lost or anxious', handle: 'Douyin: Jack要加油', url: 'https://v.douyin.com/JxIstHXwiBU/', who: 'From his profile: “High-value updates every day … a daily read and a weekly roundup”', why: 'I came across his clips just after graduating. One line changed me a lot: when lost, anxious or in pain, not knowing what to do, go to the gym, read, make friends. I added one more: learn a skill.' },
        { name: 'Lu Damo', value: 'His own story as a founder, and how business works', handle: 'Douyin: 鲁大魔', url: 'https://v.douyin.com/iGU5ccOAeWU/', who: 'From his profile: “Taught myself to code and build websites in 2003 … now I work in AI”', why: 'I have watched a lot of his videos. From teaching himself to build websites to where he is now, he talks about his story and his business thinking plainly. I think they are excellent.' },
        { name: 'Tongnian Zhongjiezhe', value: 'Doing what you know, and how people really work at work', handle: 'Douyin: 童年终结者', url: 'https://v.douyin.com/NVPxJZpySqY/', who: 'From his profile: “Just an ordinary person, with flaws, not perfect … our sixth year together”', why: 'Knowing and doing are often far apart. On putting what you know into practice, and on how people behave at work, so many of his videos are really good.' },
      ],
    },

    talks: {
      headline: 'One interview, one podcast',
      line: 'Two of the books on my shelf came from this interview',
      why: 'Why I recommend it',
      keys: 'What it covers',
      list: [
        { t: 'Sun Yuchen on how young people can seize the AI era (in Chinese)', meta: 'Alan Shao × Sun Yuchen · over four hours · Oct 2026', ratio: 'wide', why: 'His name used to bring stereotypes to mind. Then I came across this interview by chance, four hours of him talking, and it stayed with me. Through it I found Alan Shao, and in his livestream with Jack I heard him recommend the book that changed his life: The Slight Edge. I also saw Sun Yuchen anew, read his book and listened to his podcast. Four hours gave me two books and a podcast. So much would never have happened, and the scariest part is not knowing what you don’t know.', keys: [['Sun-ology', 'freedom first, wealth after: upgrade how you think about money and yourself, like upgrading an operating system'], ['Lean muscle', 'resistance training, eating right, managing your health: muscle is the body’s bank account'], ['Bleached hair', 'once you are sure something is right, carry it out fully and tune out the noise']], url: 'https://www.bilibili.com/video/BV1fcHD6cEw3/', go: 'Watch on Bilibili' },
        { t: 'The Revolution to Financial Freedom (in Chinese)', meta: 'Hosted by Sun Yuchen · Ximalaya', ratio: 'square', why: 'After his book I found his podcast. He treats financial freedom as a set of values: first be clear about what you want, then talk about how to earn. The more I listened, the more interesting it got.', about: 'Its own description: “How someone born in the 90s reached financial freedom.”', url: 'https://www.ximalaya.com/album/98108036', go: 'Listen on Ximalaya' },
      ],
    },

    three: {
      title: 'Three things',
      headline: 'When I feel lost, I do three things',
      items: [
        { id: 'books', icon: 'book', name: 'Reading', line: 'Books · creators · podcasts' },
        { id: 'skill', icon: 'spark', name: 'A skill', line: 'Learn AI' },
        { id: 'fitness', icon: 'weight', name: 'Fitness', line: 'A training plan' },
      ],
      skill: {
        title: 'Learning a skill',
        headline: 'To learn AI coding, I recommend easy-vibe',
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
        why: 'The body has a veto over everything else, so train it right. The plan, the follow-along sessions and the vocabulary are all in one series, so a beginner doesn’t have to piece things together. As of October 2026 it has more than 38 million plays and nearly 900,000 saves on Douyin.',
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
        'At university, I often felt lost. I asked people I thought had the answers, but heard nothing back. After trying many things, I slowly understood that some answers are found by doing.',
        'When I feel lost, I read, learn a skill and exercise. I listen to videos and podcasts on the way, and talk through difficult questions with Claude and ChatGPT. What I read, hear and do gradually becomes my own experience.',
        'I believe in sincerity and in protecting my energy. Rather than rushing to define myself, I would rather spend my time on the things I want to do. One small step each day, without end; no effort is made in vain.',
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
