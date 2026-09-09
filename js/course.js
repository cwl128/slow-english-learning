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
