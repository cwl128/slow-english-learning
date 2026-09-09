/* =========================================================
   课程数据 —— 银龄英语 · 开口说
   第一课《Greetings in English · 用英语问候》
   内容依据公益课程原版 PPT 整理
   ========================================================= */

/* ---------- 发音练习（跟 PPT 学过的问候语） ---------- */
const LESSONS = [
  {
    id: "greet1",
    title: "第一课 · Greetings in English",
    sub: "用英语问候（跟着 PPT 一句一句练）",
    icon: "👋",
    items: [
      { en: "Hello", zh: "你好 / 您好", hint: "哈喽" },
      { en: "Good morning", zh: "早上好", hint: "古德 · 猫宁" },
      { en: "Good afternoon", zh: "下午好", hint: "古德 · 阿夫特努恩" },
      { en: "Good evening", zh: "晚上好", hint: "古德 · 伊夫宁" },
      { en: "Nice to meet you", zh: "高兴见到你", hint: "奈斯 · 图 · 米特 · 油" },
      { en: "My name is", zh: "我的名字是…", hint: "迈 · 内姆 · 伊兹" },
      { en: "How are you?", zh: "你怎么样？", hint: "好 · 阿 · 油" },
      { en: "I am fine", zh: "我很好", hint: "艾姆 · 范恩" },
      { en: "Long time no see", zh: "好久不见", hint: "朗 · 泰姆 · 诺 · 西" },
      { en: "See you", zh: "再见", hint: "西 · 油" },
      { en: "See you tomorrow", zh: "明天见", hint: "西 · 油 · 特猫柔" },
      { en: "What is new?", zh: "有什么新事吗？", hint: "沃特 · 伊兹 · 牛" },
      { en: "Good night", zh: "晚安", hint: "古德 · 奈特" },
      { en: "Thank you", zh: "谢谢", hint: "三克 · 油" },
      { en: "Bye", zh: "再见", hint: "拜" }
    ]
  }
];

/* ---------- 课程 PPT（网页版课件，共 24 页） ---------- */
const COURSE = {
  title: "Greetings in English",
  titleZh: "用英语问候 · 第一课",
  year: "[2026-2027]",
  support: "本公益项目获得米果教育和Heritage Bridges 协助支持"
};

const PPT_SLIDES = [
  {
    kind: "cover",
    head: { en: "Greetings in English", zh: "用英语问候 · 第一课", py: "Yòng yīngyǔ wènhòu dì yī kè" },
    lines: [],
    note: "2026-2027 · 公益英语小课堂"
  },
  {
    kind: "section",
    head: { en: "INTRODUCTION", zh: "介绍", py: "jièshào" },
    lines: [{ en: "", zh: "这一课，我们学习见面时怎样用英语打招呼。", py: "" }],
    note: ""
  },
  {
    kind: "people",
    head: { en: "我们的老师", zh: "来自 Heritage Bridges 的哥哥姐姐", py: "" },
    lines: [
      { en: "Ronnie", zh: "10th · Tennis, piano", py: "" },
      { en: "Justin", zh: "10th · Viola, Badminton, Debate", py: "" },
      { en: "William", zh: "10th · Watching movies, science fiction", py: "" },
      { en: "Tendy", zh: "11th · guitar, singing, anime", py: "" }
    ],
    note: ""
  },
  {
    kind: "qa",
    head: { en: "What is your name?", zh: "您叫什么名字？", py: "Nín jiào shénme míngzì?" },
    lines: [{ en: "My name is …", zh: "我的名字是…", py: "Wǒ de míngzì shì..." }],
    note: ""
  },
  {
    kind: "speak",
    head: { en: "Everyone say this", zh: "每个人都试着说这句话", py: "Měi gèrén dōu shìzhe shuō zhè jù huà" },
    lines: [{ en: "My name is ...", zh: "我的名字 (Wǒ de míngzì)", py: "" }],
    note: ""
  },
  {
    kind: "word",
    head: { en: "Hello", zh: "你好 / 您好", py: "Nǐ hǎo / Nín hǎo" },
    lines: [{ en: "Hello, everyone!", zh: "大家好", py: "Dàjiā hǎo" }],
    note: ""
  },
  {
    kind: "word",
    head: { en: "Good Morning", zh: "早上好", py: "zǎoshang hǎo" },
    lines: [{ en: "Good morning, everyone!", zh: "大家早上好", py: "Dàjiā zǎoshang hǎo" }],
    note: ""
  },
  {
    kind: "word",
    head: { en: "Good Afternoon", zh: "下午好", py: "xiàwǔ hǎo" },
    lines: [{ en: "Good afternoon, everyone!", zh: "大家下午好", py: "Dàjiā xiàwǔ hǎo" }],
    note: ""
  },
  {
    kind: "word",
    head: { en: "Good Evening", zh: "晚上好", py: "wǎnshàng hǎo" },
    lines: [{ en: "Good evening, ladies and gentlemen!", zh: "女士们先生们，晚上好", py: "Nǚshìmen xiānshēngmen, wǎnshàng hǎo" }],
    note: ""
  },
  {
    kind: "word",
    head: { en: "Nice to meet you", zh: "高兴见到你", py: "gāoxìng jiàn dào nǐ" },
    lines: [{ en: "It's really nice to meet you!", zh: "很高兴见到你", py: "Hěn gāoxìng jiàn dào nǐ" }],
    note: ""
  },
  {
    kind: "word",
    head: { en: "How are you?", zh: "你怎么样？", py: "nǐ zěnmeyàng?" },
    lines: [{ en: "How are you feeling today?", zh: "你今天感觉怎么样？", py: "Nǐ jīntiān gǎnjué zěnmeyàng?" }],
    note: ""
  },
  {
    kind: "word",
    head: { en: "Response · 回复", zh: "我…（选择一个词）", py: "wǒ shì … (xuǎnzé yī gè cí)" },
    lines: [
      { en: "I am fine / great / happy", zh: "我很好 / 我挺好 / 我开心", py: "" },
      { en: "I am tired / not well", zh: "我有点累 / 我不太舒服", py: "" }
    ],
    note: "原 PPT 此处为表情与单词卡片，可跟着老师选一个词回答。"
  },
  {
    kind: "word",
    head: { en: "Long time no see", zh: "好久不见", py: "hǎojiǔ bùjiàn" },
    lines: [{ en: "Long time no see, how are you?", zh: "好久不见，你好吗？", py: "Hǎojiǔ bùjiàn, nǐ hǎo ma?" }],
    note: ""
  },
  {
    kind: "word",
    head: { en: "See you", zh: "再见", py: "zàijiàn" },
    lines: [{ en: "See you soon!", zh: "很快见到你", py: "hěn kuài jiàn dào nǐ" }],
    note: ""
  },
  {
    kind: "word",
    head: { en: "What is new?", zh: "有什么新的吗？", py: "yǒu shéme xīn de ma?" },
    lines: [{ en: "What is new with you guys?", zh: "你们有什么新事吗？", py: "yǒu shéme xīn de ma?" }],
    note: ""
  },
  {
    kind: "word",
    head: { en: "Tomorrow", zh: "明天", py: "míngtiān" },
    lines: [{ en: "See you tomorrow!", zh: "明天见", py: "Míngtiān jiàn" }],
    note: ""
  },
  {
    kind: "word",
    head: { en: "Bye", zh: "再见", py: "zàijiàn" },
    lines: [{ en: "Bye then!", zh: "那再见", py: "nà zàijiàn" }],
    note: ""
  },
  {
    kind: "activity",
    head: { en: "TRANSLATE TO ENGLISH", zh: "翻译成英文", py: "fānyì chéng yīngwén" },
    lines: [],
    note: "看着 PPT 上的中文，试着说出对应的英文。"
  },
  {
    kind: "activity",
    head: { en: "READING", zh: "读一读", py: "dú" },
    lines: [],
    note: "跟着老师大声朗读下面的对话。"
  },
  {
    kind: "dialogue",
    head: { en: "Dialogue · 对话练习（第 1 段）", zh: "晚上好，好久不见！", py: "" },
    lines: [
      { en: "Person 1: Good evening!", zh: "晚上好", py: "wǎnshàng hǎo" },
      { en: "Person 2: Hello! Long time no see!", zh: "你好！好久不见", py: "nǐ hǎo! hǎojiǔ bùjiàn" },
      { en: "Person 1: It's nice to see you again!", zh: "很高兴再次见到你", py: "hěn gāoxìng zàicì jiàn dào nǐ" }
    ],
    note: ""
  },
  {
    kind: "dialogue",
    head: { en: "Dialogue · 对话练习（第 2 段）", zh: "你最近怎么样？", py: "" },
    lines: [
      { en: "Person 2: How are you doing?", zh: "你今天怎么样？", py: "nǐ jīntiān zěnmeyàng" },
      { en: "Person 1: Great. What's new?", zh: "挺好的。你有什么新事？", py: "tǐng hǎo de. nǐ yǒu shéme xīnshì" },
      { en: "Person 2: I'm not feeling so well.", zh: "我感觉不太好", py: "wǒ gǎnjué bù tài hǎo" }
    ],
    note: ""
  },
  {
    kind: "dialogue",
    head: { en: "Dialogue · 对话练习（第 3 段）", zh: "再见，明天见！", py: "" },
    lines: [
      { en: "Person 1: I hope you feel better.", zh: "我希望你好点了", py: "wǒ xīwàng nǐ hǎo diǎn le" },
      { en: "Person 2: Thank you!", zh: "谢谢", py: "xièxiè" },
      { en: "Person 1: See you tomorrow!", zh: "明天见", py: "míngtiān jiàn" },
      { en: "Person 2: Goodnight!", zh: "晚安", py: "wǎn'ān" }
    ],
    note: ""
  },
  {
    kind: "qr",
    head: { en: "WeChat QR Code", zh: "扫描微信加入英语群", py: "sǎomiáo wēixìn jiārù yīngyǔ qún" },
    lines: [],
    note: "二维码图片请查看原版 PPT 第 23 页。"
  },
  {
    kind: "end",
    head: { en: "Thank you, everyone!", zh: "课程到此结束，记得复习一下材料", py: "Kèchéng dào cǐ jiéshù, jìdé fùxí yīxià cái liào" },
    lines: [],
    note: "复习小提示：每天跟着网页里的「发音练习」读一遍，进步最快！"
  }
];
