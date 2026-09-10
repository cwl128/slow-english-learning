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
    head: { en: "Our teachers", zh: "来自 米果教育（Miguo Education）的老师", py: "" },
    lines: [
      { en: "Ronnie", zh: "10th · Tennis, piano", py: "" },
      { en: "Justin", zh: "10th · Viola, Badminton, Debate", py: "" },
      { en: "William", zh: "10th · Watching movies, science fiction", py: "" },
      { en: "Tendy", zh: "11th · guitar, singing, anime", py: "" }
    ],
    note: "教学团队由米果教育（Miguo Education）的老师和同学组成。"
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
/* =========================================================
   5. 辨音练习（A/E/I 等易混元音专项）
   玩法：① 听音选词（练耳朵）② 跟读自检（录音回放/电脑猜一个）
   ========================================================= */
const SOUND_GROUPS = [
  {
    name: "长“衣” /iː/ ↔ 短“衣” /ɪ/",
    tip: "长音 /iː/ 嘴角拉开、声音拖长；短音 /ɪ/ 短促、放松。",
    pairs: [
      { a: "seat", b: "sit", az: "座位", bz: "坐", ah: "西ː特", bh: "西特（短）" },
      { a: "sheep", b: "ship", az: "绵羊", bz: "船", ah: "西ː普", bh: "西普（短）" },
      { a: "eat", b: "it", az: "吃", bz: "它", ah: "衣ː特", bh: "伊特（短）" },
      { a: "leave", b: "live", az: "离开", bz: "住、生活", ah: "利ː夫", bh: "利夫（短）" }
    ]
  },
  {
    name: "小嘴“哎” /e/ ↔ 大嘴“哎” /æ/",
    tip: "/e/ 嘴张小一点（像说“哎”）；/æ/ 嘴要张大，下巴放低。",
    pairs: [
      { a: "bed", b: "bad", az: "床", bz: "坏的", ah: "拜德（小嘴）", bh: "拜德（大嘴）" },
      { a: "pen", b: "pan", az: "钢笔", bz: "平底锅", ah: "喷（小嘴）", bh: "潘（大嘴）" },
      { a: "men", b: "man", az: "男人们", bz: "男人", ah: "门（小嘴）", bh: "曼（大嘴）" },
      { a: "said", b: "sad", az: "说（过去式）", bz: "难过", ah: "赛德（小嘴）", bh: "赛德（大嘴）" }
    ]
  },
  {
    name: "长“衣” /iː/ ↔ “诶” /eɪ/",
    tip: "/iː/ 是拖长的“衣”；/eɪ/ 是“诶”，结尾嘴形会滑动。",
    pairs: [
      { a: "see", b: "say", az: "看见", bz: "说", ah: "西ː", bh: "塞伊" },
      { a: "meet", b: "mate", az: "见面", bz: "伙伴", ah: "米ː特", bh: "梅特" },
      { a: "feet", b: "fate", az: "脚（复数）", bz: "命运", ah: "菲ː特", bh: "费特" },
      { a: "tea", b: "day", az: "茶", bz: "天", ah: "提ː", bh: "得伊" }
    ]
  },
  {
    name: "“啊/呃” /ʌ/ ↔ 大嘴“哎” /æ/",
    tip: "/ʌ/ 嘴放松（“啊”偏“呃”）；/æ/ 嘴张大、下巴放低。",
    pairs: [
      { a: "cut", b: "cat", az: "切", bz: "猫", ah: "卡特（放松）", bh: "凯特（大嘴）" },
      { a: "cup", b: "cap", az: "杯子", bz: "帽子", ah: "卡普（放松）", bh: "凯普（大嘴）" },
      { a: "run", b: "ran", az: "跑", bz: "跑了", ah: "软（放松）", bh: "软（大嘴）" },
      { a: "but", b: "bat", az: "但是", bz: "蝙蝠/球棒", ah: "巴特（放松）", bh: "拜特（大嘴）" }
    ]
  },
  {
    name: "短“乌” /ʊ/ ↔ 长“乌” /uː/",
    tip: "短音 /ʊ/ 短促、嘴唇微圆；长音 /uː/ 嘴唇收紧、声音拖长。",
    pairs: [
      { a: "full", b: "fool", az: "满的", bz: "傻瓜", ah: "夫尔（短）", bh: "夫ː尔（长）" },
      { a: "pull", b: "pool", az: "拉", bz: "游泳池", ah: "普尔（短）", bh: "普ː尔（长）" },
      { a: "look", b: "Luke", az: "看", bz: "卢克（人名）", ah: "鲁克（短）", bh: "鲁ː克（长）" },
      { a: "good", b: "food", az: "好的", bz: "食物", ah: "古德（短）", bh: "夫ː德（长）" }
    ]
  }
];

const soundState = { group: 0, round: 1, total: 8, score: 0, current: null, answered: false, playing: false };

function soundPair() { return SOUND_GROUPS[soundState.group].pairs[(soundState.round - 1) % 4]; }
function soundAnswerKey() { return soundState.current || "a"; }
function soundAnswerWord() { const p = soundPair(); return soundAnswerKey() === "a" ? p.a : p.b; }

function injectSoundStyles() {
  if (document.getElementById("sound-practice-style")) return;
  const style = document.createElement("style");
  style.id = "sound-practice-style";
  style.textContent = `
  .sound-groups{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-bottom:18px}
  .sound-group-btn{border:2px solid var(--line);background:#fff;color:var(--ink-soft);font:inherit;font-weight:700;font-size:1rem;padding:10px 16px;border-radius:999px;cursor:pointer}
  .sound-group-btn.is-on{background:var(--brand);border-color:var(--brand);color:#fff}
  .sound-card{background:#fff;border-radius:26px;box-shadow:var(--shadow);padding:24px;max-width:780px;margin:0 auto 18px}
  .sound-top{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:14px;color:var(--muted);font-weight:700}
  .sound-play{display:block;margin:8px auto 18px;border:0;cursor:pointer;font:inherit;font-weight:800;font-size:1.35rem;color:#fff;background:linear-gradient(145deg,var(--brand),var(--brand-deep));border-radius:22px;padding:20px 34px;box-shadow:0 10px 24px rgba(15,118,110,.35)}
  .sound-play.is-speaking{animation:pulse .8s infinite}
  .sound-q{text-align:center;font-size:1.15rem;color:var(--ink-soft);margin-bottom:14px}
  .sound-options{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .sound-opt{border:3px solid var(--line);background:#FBF7EE;border-radius:22px;padding:18px 14px;cursor:pointer;font:inherit;text-align:center;transition:transform .12s ease}
  .sound-opt:hover{transform:translateY(-3px)}
  .sound-opt .w{display:block;font-size:2rem;font-weight:800;color:var(--ink);font-family:Georgia,serif}
  .sound-opt .z{display:block;color:var(--muted);margin-top:4px}
  .sound-opt .h{display:block;color:#A26A2A;font-size:.95rem;margin-top:2px}
  .sound-opt.is-right{border-color:var(--good);background:var(--good-soft)}
  .sound-opt.is-wrong{border-color:var(--bad);background:var(--bad-soft)}
  .sound-feedback{text-align:center;font-size:1.15rem;font-weight:800;margin:16px 0 8px;min-height:1.5em}
  .sound-actions{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-top:8px}
  .sound-pair{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:12px 0}
  .sound-pair button{border:0;background:var(--brand-soft);color:var(--brand-deep);border-radius:18px;padding:16px;font:inherit;font-weight:800;font-size:1.2rem;cursor:pointer}
  .sound-rec{margin:6px auto 0;border:0;cursor:pointer;font:inherit;font-weight:800;font-size:1.15rem;color:#fff;background:linear-gradient(145deg,#F05A4A,#D92C1F);border-radius:999px;padding:16px 30px;display:block;box-shadow:0 10px 22px rgba(217,44,31,.35)}
  .sound-rec.is-live{animation:breathe 1.3s infinite}
  .sound-read-result{text-align:center;font-weight:800;color:var(--brand-deep);margin-top:14px;min-height:1.6em}
  @media(max-width:560px){.sound-options,.sound-pair{grid-template-columns:1fr}.sound-opt .w{font-size:1.7rem}}
  `;
  document.head.appendChild(style);
}

function buildSoundScreen() {
  if (document.getElementById("screen-sound")) return;
  injectSoundStyles();
  const sec = document.createElement("section");
  sec.className = "screen";
  sec.id = "screen-sound";
  sec.hidden = true;
  sec.setAttribute("aria-label", "辨音练习");
  sec.innerHTML = `
    <header class="topbar">
      <button class="back-btn" id="btn-back-menu-sound" aria-label="返回主菜单">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
        <span>返回</span>
      </button>
      <div class="lesson-heading"><span class="lesson-heading-icon">👂</span><h2>辨音练习</h2></div>
      <div class="topbar-spacer"></div>
    </header>
    <div class="container">
      <p class="lesson-sub">专门练 A / E / I 容易混的音：先练耳朵，再练嘴</p>
      <div class="sound-groups" id="sound-groups"></div>
      <div class="sound-card">
        <div class="sound-top"><span id="sound-progress"></span><span id="sound-score"></span></div>
        <button type="button" class="sound-play" id="sound-play">🔊 听一听</button>
        <p class="sound-q">你听到的是哪一个词？</p>
        <div class="sound-options" id="sound-options"></div>
        <p class="sound-feedback" id="sound-feedback"></p>
        <div class="sound-actions">
          <button type="button" class="btn btn-soft" id="sound-replay">🔁 再听一遍</button>
          <button type="button" class="btn btn-primary" id="sound-next">下一题 →</button>
        </div>
      </div>
      <div class="sound-card">
        <h3 style="text-align:center;font-size:1.35rem">跟我读一读</h3>
        <p class="sound-q" id="sound-tip"></p>
        <div class="sound-pair" id="sound-pair"></div>
        <button type="button" class="sound-rec" id="sound-rec">🎤 点我录音（读完会自动停）</button>
        <p class="sound-read-result" id="sound-read-result"></p>
      </div>
    </div>`;
  document.body.appendChild(sec);
  document.getElementById("btn-back-menu-sound").addEventListener("click", () => showScreen("home"));
  document.getElementById("sound-play").addEventListener("click", () => playSoundModel());
  document.getElementById("sound-replay").addEventListener("click", () => playSoundModel());
  document.getElementById("sound-next").addEventListener("click", () => { soundState.round = soundState.round % soundState.total + 1; newSoundQuestion(); });
  document.getElementById("sound-rec").addEventListener("click", soundToggleRecord);

  const menu = document.querySelector(".menu-cards");
  if (menu && !document.getElementById("btn-open-sound")) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "menu-card";
    b.id = "btn-open-sound";
    b.style.borderBottomColor = "#7C3AED";
    b.innerHTML = '<span class="menu-icon" style="background:#EDE3FE">👂</span><span class="menu-main"><b>辨音练习</b><small>练 A / E / I 易混音 · 听音选词 + 跟读自检</small></span><span class="menu-arrow" style="color:#7C3AED" aria-hidden="true">→</span>';
    b.addEventListener("click", () => { soundState.group = 0; startSoundGroup(0); showScreen("sound"); });
    menu.appendChild(b);
  }
}

function startSoundGroup(i) {
  soundState.group = i;
  soundState.round = 1;
  soundState.score = 0;
  newSoundQuestion();
}

function newSoundQuestion() {
  soundState.answered = false;
  soundState.current = Math.random() < 0.5 ? "a" : "b";
  const p = soundPair();
  const box = document.getElementById("sound-options");
  box.innerHTML = "";
  ["a", "b"].forEach(k => {
    const w = k === "a" ? p.a : p.b;
    const z = k === "a" ? p.az : p.bz;
    const h = k === "a" ? p.ah : p.bh;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "sound-opt";
    btn.dataset.key = k;
    btn.innerHTML = '<span class="w">' + escapeHtml(w) + '</span><span class="z">' + escapeHtml(z) + '</span><span class="h">' + escapeHtml(h) + "</span>";
    btn.addEventListener("click", () => answerSound(k));
    box.appendChild(btn);
  });
  document.getElementById("sound-feedback").textContent = "";
  document.getElementById("sound-progress").textContent = "第 " + soundState.round + " / " + soundState.total + " 题";
  document.getElementById("sound-score").textContent = "答对 " + soundState.score + " 题";
  document.getElementById("sound-options").dataset.answer = soundState.current;
  renderSoundPair();
  setTimeout(() => playSoundModel(), 350);
}

function playSoundModel() {
  const p = soundPair();
  const word = soundAnswerWord();
  const btn = document.getElementById("sound-play");
  if (btn) { btn.classList.add("is-speaking"); setTimeout(() => btn.classList.remove("is-speaking"), 1200); }
  stopSpeaking();
  speakText(word, { rate: Math.max(0.62, getRate() * 0.9) });
}

function answerSound(key) {
  if (soundState.answered) return;
  soundState.answered = true;
  const right = key === soundAnswerKey();
  if (right) soundState.score++;
  document.getElementById("sound-score").textContent = "答对 " + soundState.score + " 题";
  const opts = document.querySelectorAll("#sound-options .sound-opt");
  opts.forEach(o => {
    if (o.dataset.key === soundAnswerKey()) o.classList.add("is-right");
    else if (o.dataset.key === key) o.classList.add("is-wrong");
  });
  const p = soundPair();
  const heard = soundAnswerKey() === "a" ? p.a : p.b;
  const fb = document.getElementById("sound-feedback");
  if (right) {
    fb.style.color = "var(--good)";
    fb.textContent = "✓ 对啦！你听到的是 " + heard;
  } else {
    fb.style.color = "var(--bad)";
    fb.textContent = "✗ 再听一遍：正确答案是 " + heard + "（" + SOUND_GROUPS[soundState.group].tip + "）";
  }
}

function renderSoundPair() {
  const p = soundPair();
  const pairBox = document.getElementById("sound-pair");
  pairBox.innerHTML = "";
  [{ w: p.a, z: p.az }, { w: p.b, z: p.bz }].forEach(item => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.innerHTML = "🔊 " + escapeHtml(item.w) + " <small style='font-weight:600'>" + escapeHtml(item.z) + "</small>";
    btn.addEventListener("click", () => { stopSpeaking(); speakText(item.w, { rate: Math.max(0.62, getRate() * 0.9) }); });
    pairBox.appendChild(btn);
  });
  document.getElementById("sound-tip").textContent = SOUND_GROUPS[soundState.group].tip;
  const groups = document.getElementById("sound-groups");
  if (!groups.dataset.built) {
    groups.dataset.built = "1";
    SOUND_GROUPS.forEach((g, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "sound-group-btn";
      b.textContent = g.name;
      b.addEventListener("click", () => startSoundGroup(i));
      groups.appendChild(b);
    });
  }
  [...groups.children].forEach((b, i) => b.classList.toggle("is-on", i === soundState.group));
}

function renderSound() {
  buildSoundScreen();
  renderSoundPair();
  if (document.getElementById("sound-options").children.length === 0) newSoundQuestion();
}

/* ---------- 跟读自检：录音回放 + 电脑猜一个（仅供参考） ---------- */
const soundRec = { active: false, stream: null, recorder: null, chunks: [], recognition: null, alts: [], timer: null };

async function soundToggleRecord() {
  const btn = document.getElementById("sound-rec");
  const out = document.getElementById("sound-read-result");
  if (soundRec.active) { soundStopRecord(); return; }
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { out.textContent = "这个浏览器不能录音，请用 Chrome 或 Edge。"; return; }
  soundRec.alts = [];
  soundRec.chunks = [];
  soundRec.active = true;
  btn.classList.add("is-live");
  btn.textContent = "🔴 正在录…读完点我结束";
  out.textContent = "请大声读上面两个词中的一个…";
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    soundRec.stream = stream;
    try {
      const rec = new MediaRecorder(stream);
      soundRec.recorder = rec;
      rec.ondataavailable = e => { if (e.data && e.data.size) soundRec.chunks.push(e.data); };
      rec.start();
    } catch (e) { soundRec.recorder = null; }
    const SR = getSpeechRecognitionClass();
    if (SR) {
      const r = new SR();
      soundRec.recognition = r;
      r.lang = "en-US";
      r.continuous = true;
      r.interimResults = true;
      r.maxAlternatives = 4;
      r.onresult = ev => {
        for (let i = 0; i < ev.results.length; i++) {
          const res = ev.results[i];
          if (!res.isFinal) continue;
          const n = (typeof res.length === "number" && res.length > 0) ? res.length : 1;
          for (let j = 0; j < n; j++) {
            const alt = res[j] || res;
            if (alt && alt.transcript) soundRec.alts.push(String(alt.transcript).trim());
          }
        }
      };
      try { r.start(); } catch (e) {}
    }
    soundRec.timer = setTimeout(soundStopRecord, 5000); // 最多录 5 秒
  } catch (e) {
    soundRec.active = false;
    btn.classList.remove("is-live");
    btn.textContent = "🎤 点我录音（读完会自动停）";
    out.textContent = "没有拿到麦克风权限，请点地址栏小锁 → 麦克风 → 允许。";
  }
}

function soundStopRecord() {
  if (!soundRec.active) return;
  soundRec.active = false;
  if (soundRec.timer) { clearTimeout(soundRec.timer); soundRec.timer = null; }
  const btn = document.getElementById("sound-rec");
  const out = document.getElementById("sound-read-result");
  if (btn) { btn.classList.remove("is-live"); btn.textContent = "🎤 点我录音（读完会自动停）"; }
  const r = soundRec.recognition; soundRec.recognition = null;
  if (r) { try { r.stop(); } catch (e) {} }
  const rec = soundRec.recorder; soundRec.recorder = null;
  const finish = () => {
    if (soundRec.stream) { soundRec.stream.getTracks().forEach(t => t.stop()); soundRec.stream = null; }
    setTimeout(() => {
      const p = soundPair();
      const cands = soundRec.alts.filter(Boolean);
      if (!soundRec.chunks.length) { if (out) out.textContent = "没有录到声音，请再试一次。"; return; }
      try {
        const url = URL.createObjectURL(new Blob(soundRec.chunks, { type: "audio/webm" }));
        const audio = new Audio(url);
        audio.play().catch(() => {});
        audio.onended = () => URL.revokeObjectURL(url);
      } catch (e) {}
      if (!cands.length) {
        if (out) out.textContent = "已录好，可以听到自己的声音（电脑这次没听清，可再用大一点声音读一次）。";
        return;
      }
      let best = "", bestScore = -1;
      cands.forEach(c => {
        [p.a, p.b].forEach(w => {
          const s = evaluatePhrase(w, c).score;
          if (s > bestScore) { bestScore = s; best = w; }
        });
      });
      if (out) out.textContent = "电脑听到的更接近：“" + best + "” （仅供参考，多听多读就更准）";
    }, 500);
  };
  if (rec && rec.state !== "inactive") { rec.onstop = finish; try { rec.stop(); } catch (e) { finish(); } }
  else finish();
}

/* =========================================================
   辨音练习的挂载：在页面加载完成后自动加入菜单和界面
   （本文件在 app.js / course.js 之前加载，所以此时再取 showScreen）
   ========================================================= */
function initSoundPractice() {
  buildSoundScreen();
  const prevShow = showScreen;
  showScreen = function(name) {
    prevShow(name);
    if (name === "sound") {
      screen = "sound";
      document.querySelectorAll(".screen").forEach(el => {
        el.hidden = el.id !== "screen-sound";
        el.classList.toggle("is-active", el.id === "screen-sound");
      });
      renderSound();
      window.scrollTo({ top: 0 });
    }
  };
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSoundPractice);
} else {
  initSoundPractice();
}
