/* =========================================================
   课程数据 —— 银龄英语 · 开口说
   面向零基础老年人的高频生活单词 / 短句
   en   : 英语（要学习的内容）
   zh   : 中文意思
   hint : 中文谐音（记忆小帮手，跟着音频读才最标准）
   ========================================================= */
const LESSONS = [
  {
    id: "greet",
    title: "见面问候",
    sub: "每天见到人都用得上的问候语",
    icon: "👋",
    items: [
      { en: "Hello", zh: "你好", hint: "哈喽" },
      { en: "Good morning", zh: "早上好", hint: "古德 · 猫宁" },
      { en: "Good afternoon", zh: "下午好", hint: "古德 · 阿夫特努恩" },
      { en: "Good evening", zh: "晚上好", hint: "古德 · 伊夫宁" },
      { en: "Good night", zh: "晚安", hint: "古德 · 奈特" },
      { en: "How are you?", zh: "你好吗？", hint: "好 · 阿 · 油" },
      { en: "I'm fine", zh: "我很好", hint: "艾姆 · 范恩" },
      { en: "Nice to meet you", zh: "很高兴认识你", hint: "奈斯 · 图 · 米特 · 油" }
    ]
  },
  {
    id: "polite",
    title: "礼貌用语",
    sub: "客气话，人人都喜欢听",
    icon: "🙏",
    items: [
      { en: "Thank you", zh: "谢谢", hint: "三克 · 油" },
      { en: "Please", zh: "请", hint: "普利兹" },
      { en: "Sorry", zh: "对不起", hint: "索瑞" },
      { en: "Excuse me", zh: "打扰一下", hint: "伊克思Q斯 · 米" },
      { en: "You're welcome", zh: "不客气", hint: "油儿 · 威尔卡姆" },
      { en: "Welcome", zh: "欢迎", hint: "威尔卡姆" },
      { en: "Goodbye", zh: "再见", hint: "古德拜" },
      { en: "See you later", zh: "回头见", hint: "西 · 油 · 雷特儿" }
    ]
  },
  {
    id: "numbers",
    title: "数字认一认",
    sub: "从 1 数到 10，买东西看时间都用得上",
    icon: "🔢",
    items: [
      { en: "One", zh: "一", hint: "万" },
      { en: "Two", zh: "二", hint: "兔" },
      { en: "Three", zh: "三", hint: "斯瑞" },
      { en: "Four", zh: "四", hint: "佛" },
      { en: "Five", zh: "五", hint: "法五" },
      { en: "Six", zh: "六", hint: "西克斯" },
      { en: "Seven", zh: "七", hint: "赛文" },
      { en: "Eight", zh: "八", hint: "诶特" },
      { en: "Nine", zh: "九", hint: "奈" },
      { en: "Ten", zh: "十", hint: "探" }
    ]
  },
  {
    id: "family",
    title: "我的家人",
    sub: "叫家人、说我爱你",
    icon: "👨‍👩‍👧‍👦",
    items: [
      { en: "Father", zh: "爸爸", hint: "发泽" },
      { en: "Mother", zh: "妈妈", hint: "妈泽" },
      { en: "Brother", zh: "兄弟", hint: "布拉泽" },
      { en: "Sister", zh: "姐妹", hint: "西斯特" },
      { en: "Grandpa", zh: "爷爷 / 外公", hint: "格软帕" },
      { en: "Grandma", zh: "奶奶 / 外婆", hint: "格软妈" },
      { en: "Family", zh: "家庭", hint: "范米莉" },
      { en: "I love you", zh: "我爱你", hint: "艾 · 拉夫 · 油" }
    ]
  },
  {
    id: "daily",
    title: "日常常用",
    sub: "回答是 / 不是，请人帮忙",
    icon: "💬",
    items: [
      { en: "Yes", zh: "是", hint: "耶斯" },
      { en: "No", zh: "不是", hint: "诺" },
      { en: "Okay", zh: "好的", hint: "欧K" },
      { en: "Thank you very much", zh: "非常感谢", hint: "三克油 · 歪瑞 · 马奇" },
      { en: "Help me", zh: "帮帮我", hint: "嗨普 · 米" },
      { en: "I don't know", zh: "我不知道", hint: "艾 · 东特 · 诺" },
      { en: "Come here", zh: "过来一下", hint: "卡姆 · 黑尔" },
      { en: "Have a nice day", zh: "祝你愉快", hint: "哈夫 · 阿 · 奈斯 · 得" }
    ]
  }
];
