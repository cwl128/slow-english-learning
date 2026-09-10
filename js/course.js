/* =========================================================
   课程版扩展：开始界面 / 主菜单 / 课程PPT 浏览
   本文件在 app.js 之后加载，会覆盖 app.js 的 showScreen，
   并让初始化默认停在“开始界面”。
   ========================================================= */
"use strict";

/* ---------- 课程 PPT 浏览 ---------- */
let pptIndex = 0;

function cleanSpeakText(en) {
  return String(en).replace(/^\s*Person \d+\s*[:：]\s*/i, "").trim();
}
function pptEnglishText(slide) {
  const parts = [];
  if (slide.head && slide.head.en) parts.push(slide.head.en);
  (slide.lines || []).forEach(l => { const t = cleanSpeakText(l.en || ""); if (t) parts.push(t); });
  return parts;
}
function esc(s) { return escapeHtml(s); }

function renderPpt() {
  const stage = $("#ppt-stage");
  if (!stage || !PPT_SLIDES.length) return;
  const slide = PPT_SLIDES[pptIndex] || PPT_SLIDES[0];
  const total = PPT_SLIDES.length;
  const titleEl = $("#ppt-title");
  if (titleEl) titleEl.textContent = "第一课 · 课程PPT（" + (pptIndex + 1) + "/" + total + "）";
  const pageEl = $("#ppt-page");
  if (pageEl) pageEl.textContent = (pptIndex + 1) + " / " + total;

  let html = '<div class="ppt-card ppt-' + esc(slide.kind) + '">';
  const enList = pptEnglishText(slide);
  if (enList.length) {
    html += '<button type="button" class="ppt-speak" id="ppt-speak">🔊 朗读本页英文</button>';
  }
  if (slide.head && (slide.head.en || slide.head.zh)) {
    html += '<div class="ppt-head">';
    if (slide.kind === "cover" || slide.kind === "end") {
      if (slide.head.en) html += '<h3 class="ppt-title-big">' + esc(slide.head.en) + "</h3>";
      if (slide.head.zh) html += '<p class="ppt-zh-big">' + esc(slide.head.zh) + "</p>";
    } else {
      if (slide.head.en) html += '<h3 class="ppt-title">' + esc(slide.head.en) + "</h3>";
      if (slide.head.zh) html += '<p class="ppt-zh">' + esc(slide.head.zh) + "</p>";
    }
    if (slide.head.py) html += '<p class="ppt-py">' + esc(slide.head.py) + "</p>";
    html += "</div>";
  }
  if ((slide.lines || []).length) {
    html += '<div class="ppt-lines">';
    (slide.lines || []).forEach(l => {
      const speakable = cleanSpeakText(l.en || "");
      html += '<div class="ppt-line' + (l.en ? " has-speaker" : "") + '">';
      if (speakable) {
        html += '<button type="button" class="ppt-line-speak" data-read="' + esc(speakable) + '" aria-label="朗读：' + esc(speakable) + '">🔊</button>';
      } else {
        html += '<span class="ppt-line-speak ghost" aria-hidden="true"></span>';
      }
      html += "<div class='ppt-line-body'>";
      if (l.en) html += '<span class="ppt-en">' + esc(l.en) + "</span>";
      if (l.zh) html += '<span class="ppt-zh">' + esc(l.zh) + "</span>";
      if (l.py) html += '<span class="ppt-py">' + esc(l.py) + "</span>";
      html += "</div></div>";
    });
    html += "</div>";
  }
  if (slide.note) {
    html += '<p class="ppt-note-inner">' + esc(slide.note) + "</p>";
  }
  html += "</div>";
  stage.innerHTML = html;

  const dots = $("#ppt-dots");
  dots.innerHTML = "";
  PPT_SLIDES.forEach((_, i) => {
    const d = document.createElement("button");
    d.type = "button";
    d.className = "ppt-dot" + (i === pptIndex ? " is-on" : "");
    d.setAttribute("aria-label", "第 " + (i + 1) + " 页");
    d.addEventListener("click", () => { pptIndex = i; renderPpt(); });
    dots.appendChild(d);
  });
  const prev = $("#ppt-prev"), next = $("#ppt-next");
  if (prev) prev.disabled = pptIndex === 0;
  if (next) next.disabled = pptIndex === total - 1;
}

function speakPptList(list) {
  if (!list.length) return;
  stopSpeaking();
  const btn = $("#ppt-speak");
  if (btn) btn.classList.add("is-speaking");
  (async () => {
    for (const t of list) {
      await speakText(t, { rate: getRate() * 0.96 });
      await sleep(300);
    }
    if (btn) btn.classList.remove("is-speaking");
  })();
}

/* ---------- 覆盖 app.js 的 showScreen：支持 5 个界面 ---------- */
function showScreen(name) {
  screen = name;
  stopSpeaking();
  if (name !== "practice") stopRecSoft();
  ["start", "home", "ppt", "lesson", "practice"].forEach(s => {
    const el = document.getElementById("screen-" + s);
    if (!el) return;
    el.hidden = s !== name;
    el.classList.toggle("is-active", s === name);
  });
  window.scrollTo({ top: 0 });
  if (name === "home") renderHome();
  if (name === "ppt") renderPpt();
  if (name === "lesson") renderLesson();
  if (name === "practice") renderPractice();
}

/* ---------- 绑定新增界面的按钮 ---------- */
function bindCourseEvents() {
  const on = (id, fn) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", fn);
  };
  on("btn-start-enter", () => showScreen("home"));
  on("btn-open-ppt", () => { pptIndex = 0; showScreen("ppt"); });
  on("btn-open-practice", () => {
    currentLesson = LESSONS[0];
    currentIndex = 0;
    sessionResults.length = 0;
    showScreen("lesson");
  });
  on("btn-back-menu-ppt", () => showScreen("home"));
  on("ppt-prev", () => { if (pptIndex > 0) { pptIndex--; renderPpt(); } });
  on("ppt-next", () => { if (pptIndex < PPT_SLIDES.length - 1) { pptIndex++; renderPpt(); } });

  const stage = document.getElementById("ppt-stage");
  if (stage) {
    stage.addEventListener("click", ev => {
      const readBtn = ev.target.closest("[data-read]");
      if (readBtn) {
        stopSpeaking();
        readBtn.classList.add("is-speaking");
        speakText(readBtn.getAttribute("data-read")).finally(() => readBtn.classList.remove("is-speaking"));
        return;
      }
      if (ev.target.closest("#ppt-speak")) {
        speakPptList(pptEnglishText(PPT_SLIDES[pptIndex]));
      }
    });
  }
  document.addEventListener("keydown", e => {
    if (screen !== "ppt") return;
    if (e.key === "ArrowLeft" && pptIndex > 0) { pptIndex--; renderPpt(); }
    if (e.key === "ArrowRight" && pptIndex < PPT_SLIDES.length - 1) { pptIndex++; renderPpt(); }
  });
}

function forceStartScreen() {
  const scr = document.getElementById("screen-start");
  if (!scr) return;
  screen = "start";
  document.querySelectorAll(".screen").forEach(el => {
    el.hidden = el.id !== "screen-start";
    el.classList.toggle("is-active", el.id === "screen-start");
  });
  window.scrollTo({ top: 0 });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    bindCourseEvents();
    setTimeout(forceStartScreen, 60); // 等 app.js 的 init 先跑完
  });
} else {
  bindCourseEvents();
  setTimeout(forceStartScreen, 60);
}

/* =========================================================
   增强补丁（2026-09）：
   1) 声音列表彻底过滤“机器人/搞笑音色”
   2) 发音识别更宽容：多候选 + 连续听 + 自动重试 + 容错匹配
   ========================================================= */

/* ---------- 1. 声音列表：过滤机器人音 ---------- */
const NOVELTY_VOICE_RE = /Albert|Bad News|Bahh|Basso|Bells|Blowfish|Boing|Bubbles|Cellos|Deranged|Fred|Good News|Hysterical|Jester|Junior|Kathy|Organ|Pipe Organ|Ralph|Superstar|Trinoids|Whisper|Wobble|Zarvox/i;

function isGoodEnglishVoice(v) {
  return /^en/i.test(v.lang || "") && !NOVELTY_VOICE_RE.test(v.name || "");
}

function getEnglishVoices() {
  if (!window.speechSynthesis) return [];
  return speechSynthesis.getVoices().filter(isGoodEnglishVoice);
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
    opt.textContent = v.name + "（" + (v.lang || "en") + "）";
    sel.appendChild(opt);
  });
  const saved = settings.voiceURI && voicesCache.some(v => v.voiceURI === settings.voiceURI);
  sel.value = saved ? settings.voiceURI : (bestVoice() ? bestVoice().voiceURI : "");
}

function pickVoice() {
  if (!voicesCache.length) voicesCache = getEnglishVoices();
  if (!voicesCache.length) return null;
  if (settings.voiceURI) {
    const saved = voicesCache.find(v => v.voiceURI === settings.voiceURI);
    if (saved) return saved;
  }
  return bestVoice();
}

/* ---------- 2. 更宽容的逐词匹配 ---------- */
function wordSimilarity(a, b) {
  if (a === b) return 0;
  const la = a.length, lb = b.length;
  if (!la || !lb) return 2;
  const dist = levenshtein(a, b);
  const maxLen = Math.max(la, lb);
  // 短词允许 1 个字母的差异，长词允许 2 个
  const tol = maxLen <= 4 ? 1 : 2;
  if (dist <= tol && dist / maxLen <= 0.4) return 1;
  // 前缀/后缀相同也视为“接近”
  if (Math.min(la, lb) >= 3) {
    if (a.slice(0, 3) === b.slice(0, 3)) return 1;
    if (a.slice(-3) === b.slice(-3)) return 1;
  }
  // 首字母相同且长度接近，也算读得接近
  if (a[0] === b[0] && Math.abs(la - lb) <= 2 && maxLen >= 4) return 1;
  return 2;
}

function evaluatePhrase(targetPhrase, heardText) {
  const t = tokenize(targetPhrase);
  const h = tokenize(heardText);
  const target = t.plain, heard = h.plain;
  const n = target.length, m = heard.length;
  const GAP = 2;
  const cost = (i, j) => wordSimilarity(target[i], heard[j]);
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(Infinity));
  dp[0][0] = 0;
  for (let i = 1; i <= n; i++) dp[i][0] = i * GAP;
  for (let j = 1; j <= m; j++) dp[0][j] = j * GAP;
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + GAP,
        dp[i][j - 1] + GAP,
        dp[i - 1][j - 1] + cost(i - 1, j - 1)
      );
    }
  }
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
  const detail = target.map((w, k) => {
    const hi = map[k];
    if (hi < 0) return { status: "miss", word: t.words[k], heard: "" };
    const d = wordSimilarity(w, heard[hi]);
    if (d === 0) return { status: "good", word: t.words[k], heard: h.words[hi] };
    if (d === 1) return { status: "close", word: t.words[k], heard: h.words[hi] };
    return { status: "miss", word: t.words[k], heard: h.words[hi] };
  });
  const extraList = [];
  heard.forEach((w, k) => { if (!used[k]) extraList.push(h.words[k]); });
  const goodCount = detail.filter(d => d.status === "good").length;
  const closeCount = detail.filter(d => d.status === "close").length;
  const missCount = detail.filter(d => d.status === "miss").length;
  const score = n ? Math.round((goodCount + closeCount * 0.55) / n * 100) : 0;
  const stars = score >= 90 ? 3 : score >= 70 ? 2 : score >= 45 ? 1 : 0;
  return { detail, extraList, goodCount, closeCount, missCount, score, stars };
}

/* ---------- 3. 更强的语音识别 ---------- */
function pickBestCandidate(targetPhrase, candidates) {
  let best = "", bestScore = -1;
  candidates.forEach(c => {
    const text = String(c || "").trim();
    if (!text) return;
    const r = evaluatePhrase(targetPhrase, text);
    // 同样分数时，选择词更多的候选
    const value = r.score * 100 + Math.min(tokenize(text).words.length, 9);
    if (value > bestScore) { bestScore = value; best = text; }
  });
  return best;
}

function ensureLiveTextElement() {
  const box = $("#record-live");
  if (!box || $("#rec-live-text")) return;
  const p = document.createElement("p");
  p.id = "rec-live-text";
  p.className = "rec-live-text";
  box.appendChild(p);
}

function startListening() {
  const SR = getSpeechRecognitionClass();
  if (!SR) { rec.recognition = null; return; }
  const recognition = new SR();
  rec.recognition = recognition;
  recognition.lang = "en-US";
  recognition.continuous = true;       // 中间停顿也不会立刻结束
  recognition.interimResults = true;   // 先把“听个大概”的结果收下来
  recognition.maxAlternatives = 6;     // 多给几个候选，挑最接近的
  recognition.onresult = ev => {
    // 收集“已确定”的结果（每个只收一次，避免重复）
    let i = rec.processedFinals || 0;
    for (; i < ev.results.length; i++) {
      const res = ev.results[i];
      if (!res.isFinal) break;
      const count = (typeof res.length === "number" && res.length > 0) ? res.length : 1;
      for (let j = 0; j < count; j++) {
        const alt = res[j] || res;
        const t = String((alt && alt.transcript) || "").trim();
        if (t) {
          rec.alts.push(t);
          rec.candidates.push({ text: t, confidence: Number((alt && alt.confidence) || 0) });
        }
      }
    }
    rec.processedFinals = i;
    // 重新计算“临时结果”（不要累加，否则会重复）
    let interim = "";
    for (let k = rec.processedFinals; k < ev.results.length; k++) {
      interim += String(ev.results[k][0].transcript || "");
    }
    rec.interim = interim.trim();
    if (rec.alts.length || rec.interim) rec.transcriptReady = true;
    const live = $("#rec-live-text");
    if (live) {
      const shown = (rec.alts.join(" ") + " " + rec.interim).trim();
      live.textContent = shown ? "电脑听到：" + shown : "";
    }
    // 任意新结果都重置收尾计时：安静 1.5 秒才结束
    if (rec.alts.length || rec.interim) scheduleAutoFinish();
  };
  recognition.onerror = ev => {
    const code = ev && ev.error;
    if (code === "not-allowed" || code === "service-not-allowed") rec.micBlocked = true;
  };
  recognition.onend = () => {
    rec.recognition = null;
    if (!rec.active) return;
    const remain = rec.deadline - Date.now();
    const heardSomething = rec.alts.length > 0 || !!rec.interim;
    // 只有“什么都没听到”时才重连继续听；
    // 已经听到内容时，留给安静 1.5 秒的收尾计时，避免无限重连
    if (!heardSomething && remain > 700 && rec.restartCount < 3 && !rec.micBlocked) {
      rec.restartCount++;
      setTimeout(() => { if (rec.active) startListening(); }, 220);
      return;
    }
    if (heardSomething) {
      if (!rec.debounceId) scheduleAutoFinish();
      return;
    }
    if (!rec.debounceId) finishRecording();
  };
  try { recognition.start(); } catch (e) { rec.recognition = null; }
}

function scheduleAutoFinish() {
  if (rec.debounceId) clearTimeout(rec.debounceId);
  rec.debounceId = setTimeout(() => {
    rec.debounceId = 0;
    if (rec.active) finishRecording();
  }, 1200); // 说完后 1.2 秒没有新内容才收尾
}

async function startRecording() {
  if (rec.active) return;
  resetResultState();
  rec.alts = [];
  rec.candidates = [];
  rec.interim = "";
  rec.restartCount = 0;
  rec.micBlocked = false;
  rec.debounceId = 0;
  rec.processedFinals = 0;

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
  ensureLiveTextElement();
  const live = $("#rec-live-text");
  if (live) live.textContent = "";
  rec.active = true;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    rec.stream = stream;

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

    startListening();

    const item = getCurrentItem();
    const wordCount = tokenize(item.en).words.length;
    const maxSec = clamp(7 + wordCount * 2.6, 10, 24); // 给足时间，减少“没读完就停”
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

async function finishRecording() {
  if (!rec.active) return;
  rec.active = false;
  if (rec.timerId) { clearInterval(rec.timerId); rec.timerId = null; }
  if (rec.debounceId) { clearTimeout(rec.debounceId); rec.debounceId = 0; }

  const recog = rec.recognition;
  rec.recognition = null;
  if (recog) {
    await new Promise(resolve => {
      recog.onend = resolve;
      try { recog.stop(); } catch (e) { resolve(); }
      setTimeout(resolve, 900);
    });
  }

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

  $("#record-live").hidden = true;
  $("#record-processing").hidden = false;
  await sleep(350);

  const target = getCurrentItem().en;
  const candidates = rec.alts.concat(rec.interim ? [rec.interim] : []);
  const best = pickBestCandidate(target, candidates);
  if (!rec.srSupported || !best) {
    showNoRecognitionResult();
    return;
  }
  rec.transcript = best;
  // 用“首选词 + 置信度 + 易混音对”做智能判断
  const top = (rec.candidates && rec.candidates.length) ? rec.candidates[0] : { text: best, confidence: 0 };
  const confusion = detectVowelConfusion(target, top.text);
  const topRes = evaluatePhrase(target, top.text);
  const bestRes = evaluatePhrase(target, best);
  ORIGINAL_SHOW_FEEDBACK(confusion ? (top.text || best) : best);
  applySmartAssessment({
    target: target,
    topText: top.text,
    topConf: top.confidence,
    confusion: confusion,
    topScore: topRes.score,
    bestScore: bestRes.score,
    bestText: best
  });
}

function showNoRecognitionResult() {
  $("#record-processing").hidden = true;
  $("#record-result").hidden = false;
  const srMissing = !rec.srSupported;
  $("#recognized-text").textContent = srMissing ? "（无法识别）" : "（这次没听清）";
  $("#score-row").innerHTML = "";
  const fb = $("#feedback-words");
  fb.innerHTML = "";
  if (!srMissing) {
    tokenize(getCurrentItem().en).words.forEach(w => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "fb-word is-close";
      chip.innerHTML = '<span class="fb-mark">点我听</span>' + escapeHtml(w);
      chip.addEventListener("click", () => {
        stopSpeaking();
        chip.classList.add("is-speaking");
        speakText(w).finally(() => chip.classList.remove("is-speaking"));
      });
      fb.appendChild(chip);
    });
  }
  const msg = $("#feedback-msg");
  if (srMissing) {
    msg.innerHTML = "你的录音已经保存，可以点“听我读的”回放对照。<br>要获得电脑发音反馈，请用 <b>Chrome 或 Edge 浏览器</b> 打开本页面。";
  } else if (rec.micBlocked) {
    msg.innerHTML = "浏览器好像没有拿到麦克风声音。<br>请点地址栏左侧的小锁 → 麦克风 → 允许，然后刷新页面再试。";
  } else {
    msg.innerHTML = "这次电脑没听清。可以试试：<br>① 先点上面的小喇叭，听一遍老师怎么读；<br>② 靠近麦克风，慢一点、大声一点，把句子完整读完；<br>③ 再点红色麦克风重新录一次。";
  }
  $("#record-title").textContent = "没关系，再试一次！";
  $("#record-title").style.color = "var(--accent)";
}

/* 实时识别文字的小样式（随脚本注入，无需改样式表） */
(function injectRecognitionStyle() {
  if (document.getElementById("recognition-fix-style")) return;
  const style = document.createElement("style");
  style.id = "recognition-fix-style";
  style.textContent = ".rec-live-text{margin-top:10px;font-size:1.15rem;font-weight:700;color:var(--brand-deep);min-height:1.4em}";
  document.head.appendChild(style);
})();

/* =========================================================
   4. 元音混淆检测（A/E/I 等）
   浏览器的识别只给文字结果，但会给出“首选词 + 置信度”。
   我们用“首选词”和他实际听到的词来判断是否读成了易混音。
   ========================================================= */
const ORIGINAL_SHOW_FEEDBACK = showFeedback;

/* 常见易混音对（针对本课词汇），pairs = 可能被听成的词 */
const VOWEL_TIPS = {
  "see":   { pairs: ["say", "saw", "sea"], tip: "see 读 /siː/，是嘴角拉开、拖长的“衣”；say 读 /seɪ/，结尾有个滑音“诶”。" },
  "meet":  { pairs: ["met", "mitt", "mat"], tip: "meet 读 /miːt/，长音“衣”；met 读 /met/，是短促的“哎”。" },
  "fine":  { pairs: ["fan", "fun", "fen", "fin"], tip: "fine 读 /faɪn/，从“啊”滑到“衣”；fan/fen 是短促的“哎”。" },
  "name":  { pairs: ["nem", "nam", "neem"], tip: "name 读 /neɪm/，中间有“诶”的滑音，最后要闭上嘴唇发 m。" },
  "night": { pairs: ["net", "nut", "not", "neat"], tip: "night 读 /naɪt/，是“啊→衣”的滑音；net 是短促的“哎”。" },
  "nice":  { pairs: ["ness", "nace", "nets"], tip: "nice 读 /naɪs/，是“啊→衣”的滑音。" },
  "bye":   { pairs: ["bay", "boy", "bee"], tip: "bye 读 /baɪ/，“啊→衣”的滑音；bee 是长音“衣”。" },
  "thank": { pairs: ["think", "tank", "thick"], tip: "thank 读 /θæŋk/，嘴张大（“啊”和“哎”之间）；think 读 /θɪŋk/，嘴放松、短促。" },
  "good":  { pairs: ["god", "gut"], tip: "good 读 /ɡʊd/，短音“乌”，嘴唇微圆；god 是张大嘴的“啊”。" },
  "morning": { pairs: ["moaning"], tip: "morning 的 or 读 /ɔː/，嘴唇要圆起来（像“哦”拖长）。" },
  "evening": { pairs: ["even"], tip: "evening 开头是长音 /iː/（“衣”拖长），eve 和 eve-ning 要连起来。" },
  "afternoon": { pairs: ["after", "afternoon"], tip: "afternoon 重音在后面的 noon，oo 是长音 /uː/（“乌”拖长）。" },
  "hello": { pairs: ["hollow", "halo", "yellow"], tip: "hello 的 e 读 /e/，是短促的“哎”，不是“哈”也不是“衣”。" },
  "how":   { pairs: ["who"], tip: "how 读 /haʊ/，从“啊”滑到“乌”；who 读 /huː/ 是长音“乌”。" },
  "you":   { pairs: ["your", "yo"], tip: "you 读 /juː/，长音“乌”拖长；your 末尾有 r 的卷舌。" },
  "what":  { pairs: ["wet", "wit", "white"], tip: "what 读 /wɒt/，嘴张大（像“啊”偏圆）；wet 是短促“哎”。" },
  "fine,": { pairs: [], tip: "" }
};

function detectVowelConfusion(targetPhrase, heardText) {
  const tw = tokenize(targetPhrase).plain;
  const hw = tokenize(heardText || "").plain;
  if (!hw.length) return null;
  for (const w of tw) {
    const entry = VOWEL_TIPS[w];
    if (!entry) continue;
    for (const p of entry.pairs) {
      if (hw.indexOf(p) >= 0 && hw.indexOf(w) < 0) {
        return { target: w, heard: p, tip: entry.tip };
      }
    }
  }
  return null;
}

function applySmartAssessment(info) {
  const { target, topText, topConf, confusion, topScore, bestScore, bestText } = info;
  const row = $("#score-row");
  const msg = $("#feedback-msg");
  const title = $("#record-title");

  // ① 读到别的词（典型 A/E/I 混淆）→ 明确指出，不给“读对了”
  if (confusion) {
    const rt = $("#recognized-text");
    if (rt) rt.textContent = topText || confusion.heard;
    if (row) row.innerHTML = '<span class="score-stars" aria-hidden="true">★☆☆</span><span class="score-text">注意元音</span><span class="score-percent">再练练</span>';
    const targetWords = tokenize(info.target || "").plain;
    $$("#feedback-words .fb-word").forEach((chip, idx) => {
      const hit = (targetWords[idx] === confusion.target) ||
                  (chip.textContent.toLowerCase().indexOf(confusion.target.toLowerCase()) >= 0);
      if (hit) {
        chip.className = "fb-word is-miss";
        chip.innerHTML = '<span class="fb-mark">✗ 再练练</span>' + escapeHtml(confusion.target);
      }
    });
    if (msg) msg.innerHTML =
      "🎯 电脑听到的更像 “<b>" + escapeHtml(confusion.heard) + "</b>”，不是 “<b>" + escapeHtml(confusion.target) + "</b>”。<br>" +
      escapeHtml(confusion.tip) +
      "<br>先点上面的词听老师读一遍，再慢慢读一次。";
    if (title) { title.textContent = "注意这个音！"; title.style.color = "var(--accent)"; }
    return;
  }

  // ② 读对了但识别置信度低 → 提醒读清楚一点，不给三个星
  if (topScore >= 70 && topConf > 0 && topConf < 0.72) {
    if (row) row.innerHTML = '<span class="score-stars" aria-hidden="true">★★☆</span><span class="score-text">读对了</span><span class="score-percent">再清楚一点</span>';
    if (msg) msg.innerHTML = "✅ 读对了！不过电脑听得不太确定（可能是声音小、离麦克风远或读得快）。<br>再大声、清楚一点读一遍，就容易拿到三个星。";
    return;
  }

  // ③ 首选词和整句差得远，但某个候选很接近 → 可能是麦克风/语速问题
  if (topScore + 20 <= bestScore && topScore < 60) {
    if (msg) msg.innerHTML =
      "🤔 电脑第一次听到的是 “<b>" + escapeHtml(topText || "") + "</b>”，和这句话不太一样。<br>" +
      "可能是距离、音量或语速的问题：靠近麦克风、慢一点再读一次试试。";
    if (title) { title.textContent = "再读清楚一点"; title.style.color = "var(--accent)"; }
  }
}
