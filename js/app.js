/* =========================================================
   银龄英语 · 开口说 —— 主逻辑
   功能：
   1) 显示单词 / 短句 + 中文意思
   2) 语音朗读：整句慢读、一个词一个词读（带高亮）
   3) 麦克风录音（MediaRecorder，可回放）
   4) 语音识别（Web Speech API）→ 逐词比对 → 发音反馈
   ========================================================= */

"use strict";

/* ---------- 小工具 ---------- */
const $ = (sel, root) => (root || document).querySelector(sel);
const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* 把一句话拆成单词：words=原样，plain=小写无标点 */
function tokenize(phrase) {
  const words = phrase.match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g) || [];
  return { words, plain: words.map(w => w.toLowerCase().replace(/[^a-z']/g, "")) };
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

/* ---------- 设置 ---------- */
const DEFAULT_SETTINGS = {
  speed: "0.8",       // 朗读速度（0.8 ≈ 慢速自然）
  hint: true,         // 显示中文谐音
  autoSpeak: true,    // 翻页自动朗读
  fontScale: "1",     // 文字大小
  voiceURI: ""        // 选择的声音（空 = 自动选最自然的声音）
};
let settings = Object.assign({}, DEFAULT_SETTINGS, loadSettings());

function loadSettings() {
  try {
    const raw = localStorage.getItem("yl-en-settings");
    return raw ? JSON.parse(raw) : {};
  } catch (e) { return {}; }
}
function saveSettings() {
  try { localStorage.setItem("yl-en-settings", JSON.stringify(settings)); } catch (e) {}
}

/* ---------- 状态 ---------- */
let screen = "home";          // home | lesson | practice
let currentLesson = null;
let currentIndex = 0;
const sessionResults = [];    // 本次练习成绩 {index, score, stars}
let voicesCache = [];
let speakToken = 0;           // 朗读中断令牌：每次 stopSpeaking +1

/* 录音 / 识别运行时 */
const rec = {
  active: false,
  stream: null,
  recorder: null,
  chunks: [],
  blob: null,
  recognition: null,
  transcript: "",
  transcriptReady: false,
  timerId: null,
  deadline: 0,
  srSupported: false,
  recSupported: true
};

/* ---------- 语音 TTS ---------- */
function getEnglishVoices() {
  if (!window.speechSynthesis) return [];
  return speechSynthesis.getVoices().filter(v => /^en/i.test(v.lang));
}

/* macOS / 系统里有些是“机器人/搞笑音色”，听起来很奇怪，尽量避开 */
const NOVELTY_HINT = /Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Deranged|Fred|Good News|Hysterical|Junior|Jester|Kathy|Organ|Ralph|Superstar|Trinoids|Whisper|Zarvox|Pipe Organ/i;
/* 自然、清晰音色的优先级（越靠前越好） */
const VOICE_PRIORITY = [
  /Google US English/i,
  /Google UK English Female/i,
  /Aria Online \(Natural\)/i,
  /Jenny Online \(Natural\)/i,
  /Sonia Online \(Natural\)/i,
  /Ryan Online \(Natural\)/i,
  /(Neural|Online|Natural|Enhanced|Premium)/i,
  /Samantha/i, /Daniel/i, /Karen/i, /Moira/i, /Tessa/i,
  /Victoria/i, /Alex/i, /Zira/i, /David/i, /Mark/i,
  /Allison/i, /Ava/i, /Susan/i, /Google UK English Male/i
];

function voiceRank(v) {
  if (NOVELTY_HINT.test(v.name)) return 9999;
  for (let i = 0; i < VOICE_PRIORITY.length; i++) {
    if (VOICE_PRIORITY[i].test(v.name)) return i;
  }
  return 500;
}
function sortVoicesByQuality(list) {
  return list.slice().sort((a, b) => voiceRank(a) - voiceRank(b) || a.name.localeCompare(b.name));
}
function bestVoice() {
  if (!voicesCache.length) voicesCache = getEnglishVoices();
  if (!voicesCache.length) return null;
  const sorted = sortVoicesByQuality(voicesCache);
  return sorted[0];
}

function voiceDisplayName(v) {
  let name = v.name + "（" + (v.lang || "en") + "）";
  if (NOVELTY_HINT.test(v.name)) name += " · 机器人音，不推荐";
  return name;
}

function refreshVoices() {
  voicesCache = sortVoicesByQuality(getEnglishVoices());
  const sel = $("#sel-voice");
  if (!sel) return;
  sel.innerHTML = "";
  if (!voicesCache.length) {
    const opt = document.createElement("option");
    opt.value = ""; opt.textContent = "系统默认英语声音";
    sel.appendChild(opt);
    return;
  }
  voicesCache.forEach(v => {
    const opt = document.createElement("option");
    opt.value = v.voiceURI;
    opt.textContent = voiceDisplayName(v);
    sel.appendChild(opt);
  });
  // 用户已选过 → 保持选择；没选过 → 默认显示推荐音色（但不强制写入设置）
  const effective = settings.voiceURI && voicesCache.some(v => v.voiceURI === settings.voiceURI)
    ? settings.voiceURI
    : (bestVoice() ? bestVoice().voiceURI : "");
  sel.value = effective;
}

function pickVoice() {
  if (!voicesCache.length) voicesCache = getEnglishVoices();
  if (!voicesCache.length) return null;
  // 用户明确在设置里选过的声音优先（尊重选择）
  if (settings.voiceURI) {
    const saved = voicesCache.find(v => v.voiceURI === settings.voiceURI);
    if (saved) return saved;
  }
  return bestVoice();
}

function getRate() { return parseFloat(settings.speed) || 0.8; }

/* 停止朗读：令牌 +1 并取消所有正在读的 */
function stopSpeaking() {
  speakToken++;
  if (window.speechSynthesis) {
    try { speechSynthesis.cancel(); } catch (e) {}
  }
  $$(".is-speaking").forEach(el => el.classList.remove("is-speaking"));
}

/* 朗读一段文本。结束返回 true/false（false=被新的朗读打断） */
function speakText(text, { rate } = {}) {
  return new Promise(resolve => {
    if (!window.speechSynthesis) { resolve(false); return; }
    const my = speakToken;             // 说话开始时的令牌
    try { speechSynthesis.cancel(); } catch (e) {}
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = rate || getRate();
    u.pitch = 1;
    u.volume = 1;
    const voice = pickVoice();
    if (voice) u.voice = voice;
    u.onend = () => resolve(my === speakToken);
    u.onerror = () => resolve(my === speakToken);
    try { speechSynthesis.speak(u); } catch (e) { resolve(false); }
  });
}

/* 整句慢读 */
async function speakWholePhrase(item, { keepButton = false } = {}) {
  stopSpeaking();
  const my = speakToken;
  const btn = $("#btn-say-phrase");
  if (btn && !keepButton) btn.classList.add("is-speaking");
  const ok = await speakText(item.en, { rate: getRate() * 0.98 });
  if (my === speakToken && btn && !keepButton) btn.classList.remove("is-speaking");
  return ok;
}

/* 一个词一个词读：每个词读完后稍作停顿，并高亮对应的词片 */
async function speakWordByWord(item) {
  stopSpeaking();
  const my = speakToken;
  const { words } = tokenize(item.en);
  const rate = getRate() * 0.96;
  const chips = $$(".word-chip");
  for (let i = 0; i < words.length; i++) {
    if (my !== speakToken) break;
    if (chips[i]) chips[i].classList.add("is-speaking");
    await speakText(words[i], { rate });
    if (my !== speakToken) break;
    await sleep(180);
    if (chips[i]) chips[i].classList.remove("is-speaking");
    await sleep(260); // 词间停顿
  }
  if (my === speakToken) $$(".is-speaking").forEach(el => el.classList.remove("is-speaking"));
}

/* ---------- 屏幕切换 ---------- */
function showScreen(name) {
  screen = name;
  stopSpeaking();
  // 离开练习页时，如果有录音/识别正在进行，立即安全停止
  if (name !== "practice") stopRecSoft();
  ["home", "lesson", "practice"].forEach(s => {
    const el = $("#screen-" + s);
    if (!el) return;
    el.hidden = s !== name;
    el.classList.toggle("is-active", s === name);
  });
  window.scrollTo({ top: 0 });
  if (name === "home") renderHome();
  if (name === "lesson") renderLesson();
  if (name === "practice") renderPractice();
}

/* ---------- 首页 ---------- */
const CARD_COLORS = [
  { color: "#0F766E", soft: "#D9F1EC", deep: "#0B5F58" },
  { color: "#C05621", soft: "#FCE8D9", deep: "#9A4315" },
  { color: "#4F5BD5", soft: "#E3E5FB", deep: "#3C47B4" },
  { color: "#B34180", soft: "#F8E0EE", deep: "#932A67" },
  { color: "#2F7D32", soft: "#E0F2E1", deep: "#1F5E23" }
];

function renderHome() {
  const grid = $("#lesson-grid");
  if (!grid || grid.dataset.built) return;
  grid.dataset.built = "1";
  LESSONS.forEach((lesson, i) => {
    const c = CARD_COLORS[i % CARD_COLORS.length];
    const first = lesson.items[0] ? lesson.items[0].en : "";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "lesson-card";
    btn.style.setProperty("--card-color", c.color);
    btn.style.setProperty("--card-soft", c.soft);
    btn.style.setProperty("--card-deep", c.deep);
    btn.setAttribute("aria-label", "学习 " + lesson.title);
    btn.innerHTML =
      '<span class="card-top"><span class="card-icon">' + lesson.icon + "</span>" +
      '<span class="card-arrow" aria-hidden="true">→</span></span>' +
      "<h3>" + lesson.title + "</h3>" +
      '<p class="card-count">共 ' + lesson.items.length + " 句</p>" +
      '<p class="card-sample"><span>' + escapeHtml(first) + "</span><small>点我开课</small></p>";
    btn.addEventListener("click", () => {
      currentLesson = lesson;
      currentIndex = 0;
      sessionResults.length = 0;
      showScreen("lesson");
    });
    grid.appendChild(btn);
  });
}

/* ---------- 课程单词列表 ---------- */
function renderLesson() {
  if (!currentLesson) return;
  $("#lesson-heading-icon").textContent = currentLesson.icon;
  $("#lesson-title").textContent = currentLesson.title;
  $("#lesson-sub").textContent = currentLesson.sub;
  $("#chk-auto-speak").checked = settings.autoSpeak;

  const list = $("#word-list");
  list.innerHTML = "";
  currentLesson.items.forEach((item, i) => {
    const li = document.createElement("li");
    li.className = "word-item";

    const row = document.createElement("button");
    row.type = "button";
    row.className = "word-main word-open";
    row.setAttribute("aria-label", "练习第 " + (i + 1) + " 句 " + item.en);
    row.innerHTML = '<p class="word-en">' + escapeHtml(item.en) + "</p>" +
      '<p class="word-zh">' + escapeHtml(item.zh) + "</p>";
    row.addEventListener("click", () => {
      currentIndex = i;
      showScreen("practice");
      if (settings.autoSpeak) setTimeout(() => speakWholePhrase(getCurrentItem()), 400);
    });

    const speakBtn = document.createElement("button");
    speakBtn.type = "button";
    speakBtn.className = "speaker-btn";
    speakBtn.setAttribute("aria-label", "朗读 " + item.en);
    speakBtn.innerHTML = '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>';
    speakBtn.addEventListener("click", ev => {
      ev.stopPropagation();
      stopSpeaking();
      speakBtn.classList.add("is-speaking");
      speakText(item.en).finally(() => speakBtn.classList.remove("is-speaking"));
    });

    li.appendChild(row);
    li.appendChild(speakBtn);
    list.appendChild(li);
  });
}

/* ---------- 跟读练习 ---------- */
function getCurrentItem() { return currentLesson.items[currentIndex]; }

function renderPractice() {
  if (!currentLesson) return;
  const item = getCurrentItem();
  const total = currentLesson.items.length;
  $("#practice-progress").textContent = "第 " + (currentIndex + 1) + " / " + total + " 句";

  $("#phrase-en").textContent = item.en;
  $("#phrase-zh").textContent = item.zh;
  const hintEl = $("#phrase-hint");
  if (item.hint && settings.hint) {
    hintEl.hidden = false;
    hintEl.textContent = "谐音记一记：" + item.hint;
  } else {
    hintEl.hidden = true;
  }

  // 单词小片：可单独点读
  const { words } = tokenize(item.en);
  const chips = $("#word-chips");
  chips.innerHTML = "";
  words.forEach((w, i) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "word-chip";
    chip.setAttribute("aria-label", "听第 " + (i + 1) + " 个词 " + w);
    chip.innerHTML = '<span class="word-chip-label">第 ' + (i + 1) + " 个词</span>" + escapeHtml(w);
    chip.addEventListener("click", () => {
      stopSpeaking();
      chip.classList.add("is-speaking");
      speakText(w).finally(() => chip.classList.remove("is-speaking"));
    });
    chips.appendChild(chip);
  });

  resetRecordUI();
}

function resetRecordUI() {
  stopRecSoft();
  resetResultState();
  $("#record-idle").hidden = false;
  $("#record-live").hidden = true;
  $("#record-processing").hidden = true;
  $("#record-result").hidden = true;
  $("#record-title").textContent = "轮到你了，大声读出来！";
  $("#record-title").style.color = "";
  setSupportNote();
}

function resetResultState() {
  rec.transcript = "";
  rec.transcriptReady = false;
  rec.blob = null;
  rec.chunks = [];
}

function setSupportNote() {
  const note = $("#support-note");
  if (!note) return;
  if (rec.srSupported) {
    note.className = "support-note ok";
    note.textContent = "✓ 本浏览器支持“电脑听读音”。点麦克风后会请求使用麦克风，请点“允许”。";
  } else if (rec.recSupported) {
    note.className = "support-note";
    note.textContent = "本浏览器不支持语音识别：可以录音并回放自己的声音，但没有电脑发音反馈。建议用 Chrome 或 Edge 浏览器打开本页面。";
  } else {
    note.className = "support-note";
    note.textContent = "本浏览器不支持麦克风录音，请用电脑上的 Chrome 或 Edge 浏览器打开本页面。";
  }
}

/* ---------- 设置面板 ---------- */
function updateSettingsUI() {
  const h = $("#chk-hint"), a = $("#chk-autospeak"), s = $("#sel-speed"), f = $("#sel-fontsize");
  if (h) h.checked = settings.hint;
  if (a) a.checked = settings.autoSpeak;
  if (s) s.value = settings.speed;
  if (f) f.value = settings.fontScale;
  document.documentElement.style.fontSize = (18 * parseFloat(settings.fontScale || 1)).toFixed(2) + "px";
}

function openSettings() {
  refreshVoices();
  updateSettingsUI();
  $("#overlay-settings").hidden = false;
}
function closeSettings() { $("#overlay-settings").hidden = true; }

/* ---------- 录音 + 识别 ---------- */
function getSpeechRecognitionClass() {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function stopRecSoft() {
  if (rec.timerId) { clearInterval(rec.timerId); rec.timerId = null; }
  if (rec.recognition) {
    try { rec.recognition.abort(); } catch (e) {}
    rec.recognition = null;
  }
  if (rec.recorder && rec.recorder.state !== "inactive") {
    try { rec.recorder.stop(); } catch (e) {}
  }
  rec.recorder = null;
  if (rec.stream) {
    rec.stream.getTracks().forEach(t => t.stop());
    rec.stream = null;
  }
  rec.active = false;
}

async function startRecording() {
  if (rec.active) return;
  resetResultState();

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    rec.recSupported = false;
    showBrowserOverlay("你的浏览器不支持麦克风录音。<br>请用电脑上的 <b>Chrome</b> 或 <b>Edge</b> 浏览器打开本页面，才能录音并获得发音反馈。");
    setSupportNote();
    return;
  }

  $("#record-idle").hidden = true;
  $("#record-processing").hidden = true;
  $("#record-result").hidden = true;
  $("#record-live").hidden = false;
  $("#record-title").textContent = "🎤 正在录音…";
  $("#record-title").style.color = "var(--bad)";
  rec.active = true;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    rec.stream = stream;

    // 录音器（用于回放“我读的”）
    try {
      const MediaRec = window.MediaRecorder;
      if (MediaRec && stream.getAudioTracks().length) {
        const recorder = new MediaRec(stream);
        rec.recorder = recorder;
        rec.chunks = [];
        recorder.ondataavailable = e => { if (e.data && e.data.size) rec.chunks.push(e.data); };
        recorder.onstop = () => {
          try { rec.blob = new Blob(rec.chunks, { type: recorder.mimeType || "audio/webm" }); } catch (e) { rec.blob = null; }
        };
        recorder.start();
      }
    } catch (e) { rec.recorder = null; }

    // 语音识别（电脑听读音）
    const SR = getSpeechRecognitionClass();
    if (SR) {
      const recognition = new SR();
      rec.recognition = recognition;
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.onresult = ev => {
        let text = "";
        for (let i = 0; i < ev.results.length; i++) {
          if (ev.results[i].isFinal) text += ev.results[i][0].transcript;
        }
        rec.transcript = (rec.transcript + " " + text).trim();
        rec.transcriptReady = true;
      };
      recognition.onerror = () => { /* no-speech / not-allowed 等由 onend 统一收尾 */ };
      recognition.onend = () => {
        rec.recognition = null;
        if (rec.active) finishRecording(); // 读完了，自动结束并给反馈
      };
      try { recognition.start(); } catch (e) { rec.recognition = null; }
    }

    // 倒计时：读得太久也会自动结束
    const item = getCurrentItem();
    const wordCount = tokenize(item.en).words.length;
    const maxSec = clamp(3 + wordCount * 2.4, 6, 14);
    rec.deadline = Date.now() + maxSec * 1000;
    rec.timerId = setInterval(tickTimer, 250);
    updateTimerText(Math.ceil(maxSec));
  } catch (err) {
    rec.active = false;
    $("#record-live").hidden = true;
    $("#record-idle").hidden = false;
    $("#record-title").textContent = "需要麦克风权限";
    $("#record-title").style.color = "var(--bad)";
    const note = $("#support-note");
    if (note) {
      note.className = "support-note";
      note.textContent = "浏览器没有允许使用麦克风，所以无法录音。请点地址栏左侧的小锁图标 → 麦克风 → 允许，然后刷新页面再试一次。";
    }
  }
}

function tickTimer() {
  const remain = Math.max(0, Math.ceil((rec.deadline - Date.now()) / 1000));
  updateTimerText(remain);
  if (remain <= 0) finishRecording();
}
function updateTimerText(sec) {
  const el = $("#rec-timer");
  if (el) el.textContent = "还剩 " + sec + " 秒";
}
function stopRecordingByUser() {
  if (!rec.active) return;
  finishRecording();
}

async function finishRecording() {
  if (!rec.active) return;
  rec.active = false;
  if (rec.timerId) { clearInterval(rec.timerId); rec.timerId = null; }

  // 1) 停识别，等它把结果交出来
  const recog = rec.recognition;
  rec.recognition = null;
  if (recog) {
    await new Promise(resolve => {
      recog.onend = resolve;
      try { recog.stop(); } catch (e) { resolve(); }
      setTimeout(resolve, 1500);
    });
  }

  // 2) 停录音器，收声音数据
  const recorder = rec.recorder;
  rec.recorder = null;
  if (recorder && recorder.state !== "inactive") {
    await new Promise(resolve => {
      recorder.onstop = () => {
        try { rec.blob = new Blob(rec.chunks, { type: recorder.mimeType || "audio/webm" }); } catch (e) { rec.blob = null; }
        resolve();
      };
      try { recorder.stop(); } catch (e) { resolve(); }
    });
  }
  if (rec.stream) {
    rec.stream.getTracks().forEach(t => t.stop());
    rec.stream = null;
  }

  // 3) 识别动画
  $("#record-live").hidden = true;
  $("#record-processing").hidden = false;
  await sleep(500);

  const recognized = rec.transcript.trim();
  if (!rec.srSupported || (!recognized && !rec.transcriptReady)) {
    showNoRecognitionResult();
  } else {
    showFeedback(recognized);
  }
}

function showNoRecognitionResult() {
  $("#record-processing").hidden = true;
  $("#record-result").hidden = false;
  const srMissing = !rec.srSupported;
  $("#recognized-text").textContent = srMissing ? "（无法识别）" : "（没有听清）";
  $("#feedback-words").innerHTML = "";
  $("#score-row").innerHTML = "";
  const msg = $("#feedback-msg");
  if (srMissing) {
    msg.innerHTML = "你的录音已经保存，可以点“听我读的”回放对照。<br>要获得电脑发音反馈，请用 <b>Chrome 或 Edge 浏览器</b> 打开本页面。";
  } else {
    msg.innerHTML = "这次没有听清你说的内容，可能是声音太小、离麦克风太远，或浏览器还没拿到声音。<br>别灰心，再大声试一次！";
  }
  $("#record-title").textContent = "再试一次就好！";
  $("#record-title").style.color = "var(--accent)";
}

/* ---------- 发音反馈引擎 ---------- */
function levenshtein(a, b) {
  a = a.toLowerCase(); b = b.toLowerCase();
  if (a === b) return 0;
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
  }
  return dp[m][n];
}

function wordDistance(a, b) {
  if (a === b) return 0;                       // 完全相同
  if (levenshtein(a, b) <= 1) return 1;        // 很接近（少/多/换一个字母）
  const la = a.length, lb = b.length;
  if (Math.min(la, lb) >= 4 && (a.startsWith(b) || b.startsWith(a))) return 1; // 前缀一致（mornin'≈morning）
  return 2;                                    // 差别大
}

/* 把“电脑听到的词”对齐到“目标词”，逐词打分 */
function alignWords(target, heard) {
  const n = target.length, m = heard.length;
  const GAP = 2;
  const cost = (i, j) => wordDistance(target[i], heard[j]); // 0/1/2
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(Infinity));
  dp[0][0] = 0;
  for (let i = 1; i <= n; i++) dp[i][0] = i * GAP;
  for (let j = 1; j <= m; j++) dp[0][j] = j * GAP;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + GAP,                    // 目标词没读到
        dp[i][j - 1] + GAP,                    // 多读了
        dp[i - 1][j - 1] + cost(i - 1, j - 1)  // 对齐
      );
    }
  }
  // 回溯找最优对齐
  const map = new Array(n).fill(-1);
  const used = new Array(m).fill(false);
  let i = n, j = m;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + cost(i - 1, j - 1)) {
      map[i - 1] = j - 1; used[j - 1] = true; i--; j--;
    } else if (i > 0 && dp[i][j] === dp[i - 1][j] + GAP) {
      i--;
    } else {
      j--;
    }
  }
  return { map, used };
}

function evaluatePhrase(targetPhrase, heardText) {
  const t = tokenize(targetPhrase);
  const h = tokenize(heardText);
  const { map, used } = alignWords(t.plain, h.plain);

  const detail = t.plain.map((w, i) => {
    const hi = map[i];
    if (hi < 0) return { status: "miss", word: t.words[i], heard: "" };
    const d = wordDistance(w, h.plain[hi]);
    if (d === 0) return { status: "good", word: t.words[i], heard: h.words[hi] };
    if (d === 1) return { status: "close", word: t.words[i], heard: h.words[hi] };
    return { status: "miss", word: t.words[i], heard: h.words[hi] };
  });

  const extraList = [];
  h.plain.forEach((w, j) => { if (!used[j]) extraList.push(h.words[j]); });

  const goodCount = detail.filter(d => d.status === "good").length;
  const closeCount = detail.filter(d => d.status === "close").length;
  const missCount = detail.filter(d => d.status === "miss").length;
  const score = t.plain.length ? Math.round((goodCount + closeCount * 0.5) / t.plain.length * 100) : 0;
  const stars = score >= 90 ? 3 : score >= 70 ? 2 : score >= 50 ? 1 : 0;
  return { detail, extraList, goodCount, closeCount, missCount, score, stars };
}

function showFeedback(recognized) {
  const item = getCurrentItem();
  const result = evaluatePhrase(item.en, recognized);
  sessionResults.push({ index: currentIndex, score: result.score, stars: result.stars });

  $("#record-processing").hidden = true;
  $("#record-result").hidden = false;

  // 得分与星星
  const starText = "★".repeat(result.stars) + "☆".repeat(3 - result.stars);
  $("#score-row").innerHTML =
    '<span class="score-stars" aria-hidden="true">' + starText + "</span>" +
    '<span class="score-text">' + praiseText(result.stars) + "</span>" +
    '<span class="score-percent">' + result.score + " 分</span>";

  $("#recognized-text").textContent = recognized;

  // 逐词反馈（点词可听老师读）
  const fb = $("#feedback-words");
  fb.innerHTML = "";
  result.detail.forEach(d => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "fb-word is-" + d.status;
    const mark = d.status === "good" ? "✓ 读得好" : d.status === "close" ? "≈ 接近了" : "✗ 再练练";
    chip.innerHTML = '<span class="fb-mark">' + mark + "</span>" + escapeHtml(d.word);
    chip.setAttribute("aria-label", d.word + "，" + mark + "，点击听老师读");
    chip.addEventListener("click", () => {
      stopSpeaking();
      chip.classList.add("is-speaking");
      speakText(d.word).finally(() => chip.classList.remove("is-speaking"));
    });
    fb.appendChild(chip);
  });
  if (result.extraList.length) {
    const extra = document.createElement("span");
    extra.className = "fb-word is-extra";
    extra.innerHTML = '<span class="fb-mark">多读了</span>' + escapeHtml(result.extraList.join(" "));
    extra.title = "电脑还听到你多说了这些词";
    fb.appendChild(extra);
  }

  $("#feedback-msg").innerHTML = makeFeedbackMessage(result);

  $("#record-title").textContent =
    result.stars >= 2 ? "👏 真棒！" : result.stars === 1 ? "🌱 有进步！" : "💪 多练几次会更好！";
  $("#record-title").style.color = result.stars >= 2 ? "var(--good)" : "var(--accent)";
}

function praiseText(stars) {
  return stars === 3 ? "非常标准！" : stars === 2 ? "很不错！" : stars === 1 ? "有进步！" : "继续加油！";
}

function makeFeedbackMessage(r) {
  const total = r.detail.length;
  if (!total) return "";
  if (r.score >= 90) {
    return "🎉 太棒了！这句话你读得很标准，可以点“下一句”继续，也可以“再练一次”争取三个星！";
  }
  const parts = [];
  if (r.missCount) parts.push("漏读或没读准的词：" + r.detail.filter(d => d.status === "miss").map(d => "“" + d.word + "”").join("、"));
  if (r.closeCount) parts.push("还差一点点的词：" + r.detail.filter(d => d.status === "close").map(d => "“" + d.word + "”").join("、"));
  if (r.extraList.length) parts.push("电脑还听到你多说了“" + r.extraList.join("、") + "”");
  let tip = "点上面的彩色词，可以再听老师怎么读这个单词。";
  if (r.score >= 70) tip = "已经很接近啦！再听一听这些词，多读两遍就会更准。";
  return "📖 反馈：" + (parts.length ? parts.join("；") + "。" : "") + "<br>" + tip;
}

/* 听自己的录音 */
function playMyRecording() {
  if (!rec.blob) {
    alert("这次没有录到声音，请再录一次。");
    return;
  }
  const url = URL.createObjectURL(rec.blob);
  const audio = new Audio(url);
  audio.play();
  audio.onended = () => URL.revokeObjectURL(url);
}

/* ---------- 弹层 ---------- */
function showBrowserOverlay(html) {
  $("#browser-msg").innerHTML = html;
  $("#overlay-browser").hidden = false;
}
function showDoneOverlay() {
  $("#overlay-done").hidden = false;
}

/* ---------- 翻下一句 / 学完一课 ---------- */
function goNext() {
  const total = currentLesson.items.length;
  if (currentIndex + 1 < total) {
    currentIndex++;
    showScreen("practice");
    if (settings.autoSpeak) setTimeout(() => speakWholePhrase(getCurrentItem()), 400);
  } else {
    showLessonComplete();
  }
}

function showLessonComplete() {
  const done = sessionResults.slice();
  const avg = done.length ? Math.round(done.reduce((s, r) => s + r.score, 0) / done.length) : 0;
  const avgStars = done.length ? Math.round(done.reduce((s, r) => s + r.stars, 0) / done.length) : 0;
  const starText = "★".repeat(avgStars) + "☆".repeat(3 - avgStars);
  const head = $("#done-heading");
  const body = $("#done-body");
  if (done.length) {
    head.textContent = "🎉 学完一课啦！";
    body.innerHTML =
      '<p class="done-title">恭喜你学完了「' + currentLesson.title + '」！</p>' +
      '<p class="done-stars">' + starText + "</p>" +
      '<p class="done-meta">平均 ' + avg + " 分 · 共练习 " + done.length + " 句</p>" +
      '<p class="done-note">每天读一读，进步看得见。休息一下，明天再学新的一课！</p>';
  } else {
    head.textContent = "🎓 你已经把这一课都看完了";
    body.innerHTML =
      '<p class="done-title">别忘了大声读出来哦</p>' +
      '<p class="done-note">只看不读，英语可不会开口。先点“再学一遍”，用麦克风把每句话读一读，电脑会告诉你读得好不好！</p>';
  }
  showDoneOverlay();
}

function closeDoneAndGo(where) {
  $("#overlay-done").hidden = true;
  if (where === "practice") {
    currentIndex = 0;
    sessionResults.length = 0;
    showScreen("practice");
  } else {
    showScreen("lesson");
  }
}

/* ---------- 事件绑定 ---------- */
function bindEvents() {
  // 顶部 / 弹层
  $("#btn-open-settings").addEventListener("click", openSettings);
  $("#btn-close-settings").addEventListener("click", closeSettings);
  $("#overlay-settings").addEventListener("click", e => { if (e.target.id === "overlay-settings") closeSettings(); });
  $("#btn-close-help").addEventListener("click", () => { $("#overlay-help").hidden = true; });
  $("#overlay-help").addEventListener("click", e => { if (e.target.id === "overlay-help") $("#overlay-help").hidden = true; });
  $("#btn-close-browser").addEventListener("click", () => { $("#overlay-browser").hidden = true; });
  $("#overlay-browser").addEventListener("click", e => { if (e.target.id === "overlay-browser") $("#overlay-browser").hidden = true; });
  $("#btn-close-done").addEventListener("click", () => closeDoneAndGo("lesson"));
  $("#btn-done-again").addEventListener("click", () => closeDoneAndGo("practice"));
  $("#btn-done-list").addEventListener("click", () => closeDoneAndGo("lesson"));
  $("#btn-help").addEventListener("click", () => { $("#overlay-help").hidden = false; });

  // 设置项
  $("#sel-voice").addEventListener("change", e => { settings.voiceURI = e.target.value; saveSettings(); });
  $("#sel-speed").addEventListener("change", e => { settings.speed = e.target.value; saveSettings(); });
  $("#chk-hint").addEventListener("change", e => {
    settings.hint = e.target.checked; saveSettings();
    const hintEl = $("#phrase-hint");
    const item = currentLesson ? getCurrentItem() : null;
    if (item && hintEl) {
      if (settings.hint && item.hint) { hintEl.hidden = false; hintEl.textContent = "谐音记一记：" + item.hint; }
      else hintEl.hidden = true;
    }
  });
  $("#chk-autospeak").addEventListener("change", e => { settings.autoSpeak = e.target.checked; saveSettings(); });
  $("#sel-fontsize").addEventListener("change", e => { settings.fontScale = e.target.value; saveSettings(); updateSettingsUI(); });
  $("#btn-test-voice").addEventListener("click", () => {
    stopSpeaking();
    speakText("Hello! Nice to meet you. Let's practice English together.");
  });

  // 课程列表
  $("#btn-back-home").addEventListener("click", () => showScreen("home"));
  $("#chk-auto-speak").addEventListener("change", e => { settings.autoSpeak = e.target.checked; saveSettings(); });
  $("#btn-play-all").addEventListener("click", async () => {
    if (!currentLesson) return;
    stopSpeaking();
    const btn = $("#btn-play-all");
    btn.disabled = true;
    for (let i = 0; i < currentLesson.items.length; i++) {
      const rows = $$(".word-item");
      const sb = rows[i] ? $(".speaker-btn", rows[i]) : null;
      if (sb) sb.classList.add("is-speaking");
      await speakText(currentLesson.items[i].en);
      if (sb) sb.classList.remove("is-speaking");
      await sleep(280);
    }
    btn.disabled = false;
  });
  $("#btn-start-practice").addEventListener("click", () => {
    currentIndex = 0;
    sessionResults.length = 0;
    showScreen("practice");
    if (settings.autoSpeak) setTimeout(() => speakWholePhrase(getCurrentItem()), 400);
  });
  // 练习页点开某个单词片/返回后回到列表等已有逻辑保持不变

  // 练习页
  $("#btn-back-lesson").addEventListener("click", () => showScreen("lesson"));
  $("#btn-say-phrase").addEventListener("click", () => speakWholePhrase(getCurrentItem()));
  $("#btn-say-slow").addEventListener("click", async () => {
    const btn = $("#btn-say-slow");
    btn.disabled = true;
    await speakWholePhrase(getCurrentItem());
    btn.disabled = false;
  });
  $("#btn-say-words").addEventListener("click", async () => {
    const btn = $("#btn-say-words");
    btn.disabled = true;
    await speakWordByWord(getCurrentItem());
    btn.disabled = false;
  });
  $("#btn-record").addEventListener("click", startRecording);
  $("#btn-stop").addEventListener("click", stopRecordingByUser);
  $("#btn-retry").addEventListener("click", resetRecordUI);
  $("#btn-play-mine").addEventListener("click", playMyRecording);
  $("#btn-next").addEventListener("click", goNext);

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") { closeSettings(); $("#overlay-help").hidden = true; }
  });
}

/* ---------- 初始化 ---------- */
function detectSupport() {
  rec.srSupported = !!getSpeechRecognitionClass();
  rec.recSupported = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
}

function init() {
  detectSupport();
  if (window.speechSynthesis) {
    refreshVoices();
    speechSynthesis.onvoiceschanged = () => refreshVoices();
    // 某些浏览器朗读会被系统误暂停，这里每隔几秒自动恢复
    setInterval(() => {
      try { if (speechSynthesis.paused) speechSynthesis.resume(); } catch (e) {}
    }, 4000);
  }
  bindEvents();
  window.addEventListener("pagehide", () => { stopRecSoft(); stopSpeaking(); });
  updateSettingsUI();
  renderHome();
  showScreen("home");
  if (!rec.srSupported) {
    setTimeout(() => {
      showBrowserOverlay(
        (rec.recSupported ? "你正在用的浏览器不支持“电脑听读音”。听和录音回放仍可使用。" : "你正在用的浏览器不支持录音和语音识别。") +
        "<br>想要获得发音反馈，请用电脑上的 <b>Chrome</b> 或 <b>Edge</b> 浏览器打开本页面。"
      );
    }, 400);
  }
}

document.addEventListener("DOMContentLoaded", init);
