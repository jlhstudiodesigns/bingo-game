/* Art Lesson Plans — app logic */
(function () {
  'use strict';

  const SECTIONS = ['agenda','objective','benchmarks','instructions','examples','videos'];

  // State
  let currentIdx   = 0;
  let currentSec   = 'agenda';
  let activeGrade  = 6;
  let stepMode     = false;
  let currentStep  = 0;
  let lesson       = null;

  // Elements
  const prevBtn     = document.getElementById('prevBtn');
  const nextBtn     = document.getElementById('nextBtn');
  const weekLabel   = document.getElementById('week-label');
  const titleEl     = document.getElementById('lesson-title-el');
  const subEl       = document.getElementById('lesson-subtitle-el');
  const gradeTags   = document.getElementById('grade-tags');
  const fsBtn       = document.getElementById('fs-btn');
  const navBtns     = document.querySelectorAll('.nav-btn');
  const slides      = document.querySelectorAll('.slide');
  const modal       = document.getElementById('video-modal');
  const modalClose  = document.getElementById('modal-close');
  const modalBack   = document.getElementById('modal-backdrop');
  const modalIframe = document.getElementById('modal-iframe');
  const modalTitle  = document.getElementById('modal-title');
  const modalChan   = document.getElementById('modal-channel');

  // ── Boot ──────────────────────────────────────

  function init() {
    if (!window.LESSONS || !window.LESSONS.length) {
      document.getElementById('stage').innerHTML =
        '<p style="padding:3rem;color:var(--muted);font-size:1rem">No lessons found — add entries to lessons-data.js</p>';
      return;
    }

    currentIdx = window.LESSONS.length - 1; // start at most recent
    prevBtn.addEventListener('click', () => navigate(-1));
    nextBtn.addEventListener('click', () => navigate(1));
    navBtns.forEach(b => b.addEventListener('click', () => switchSection(b.dataset.section)));
    fsBtn.addEventListener('click', toggleFullscreen);
    modalClose.addEventListener('click', closeModal);
    modalBack.addEventListener('click', closeModal);
    document.addEventListener('keydown', onKey);

    loadLesson(currentIdx);
    switchSection('agenda');
  }

  // ── Lesson loading ────────────────────────────

  function navigate(dir) {
    const next = currentIdx + dir;
    if (next < 0 || next >= window.LESSONS.length) return;
    currentIdx = next;
    loadLesson(currentIdx);
  }

  function loadLesson(idx) {
    lesson = window.LESSONS[idx];
    currentStep = 0;
    stepMode = false;

    weekLabel.textContent = lesson.weekLabel || '';
    titleEl.textContent   = lesson.title     || 'Untitled Lesson';
    subEl.textContent     = lesson.subtitle  || '';

    gradeTags.innerHTML = '';
    (lesson.gradeTargets || [6,7,8]).forEach(g => {
      const p = document.createElement('span');
      p.className = `grade-pill g${g}`;
      p.textContent = g;
      gradeTags.appendChild(p);
    });

    prevBtn.disabled = (idx === 0);
    nextBtn.disabled = (idx === window.LESSONS.length - 1);

    // Set the first available grade tab
    if (lesson.benchmarks) {
      const grades = lesson.gradeTargets || [6,7,8];
      activeGrade = grades[0];
    }

    renderAgenda();
    renderObjective();
    renderBenchmarks();
    renderInstructions();
    renderExamples();
    renderVideos();
  }

  // ── Slide renderers ───────────────────────────

  function renderAgenda() {
    const el = document.getElementById('slide-agenda');
    const items = (lesson.agenda || []).map(a => `
      <li class="agenda-item">
        <span class="agenda-time">${esc(a.time)}</span>
        <span class="agenda-activity">${esc(a.activity)}</span>
      </li>`).join('');
    el.innerHTML = `
      <h2 class="slide-heading">
        <span class="eyebrow">Today's Plan</span>
        Agenda
      </h2>
      <ul class="agenda-list">${items}</ul>`;
  }

  function renderObjective() {
    const el = document.getElementById('slide-objective');
    const tags = (lesson.gradeTargets || []).map(g =>
      `<span class="objective-tag">Grade ${g}</span>`).join('');
    el.innerHTML = `
      <div class="objective-wrap">
        <p class="objective-eyebrow">Learning Objective</p>
        <hr class="objective-rule">
        <p class="objective-text">${esc(lesson.objective || '')}</p>
        <div class="objective-tags">
          ${lesson.medium ? `<span class="objective-tag">${esc(lesson.medium)}</span>` : ''}
          ${tags}
        </div>
      </div>`;
  }

  function renderBenchmarks() {
    const el = document.getElementById('slide-benchmarks');
    const grades = lesson.gradeTargets || [6,7,8];

    const tabs = grades.map(g => `
      <button class="grade-tab tab-${g} ${g === activeGrade ? 'active-tab' : ''}" data-grade="${g}">
        Grade ${g}
      </button>`).join('');

    const panels = grades.map(g => {
      const bmarks = lesson.benchmarks && lesson.benchmarks[g] || [];
      const items = bmarks.length
        ? bmarks.map(b => `
            <li class="benchmark-item">
              <span class="benchmark-code">${esc(b.code)}</span>
              <span class="benchmark-text">${esc(b.text)}</span>
            </li>`).join('')
        : `<li style="padding:0.8rem;color:var(--muted);font-size:0.9rem">No benchmarks listed for Grade ${g}.</li>`;
      return `
        <div class="benchmark-panel ${g === activeGrade ? 'active-panel' : ''}" data-panel="${g}">
          <ul class="benchmark-list">${items}</ul>
        </div>`;
    }).join('');

    el.innerHTML = `
      <h2 class="slide-heading">
        <span class="eyebrow">Florida State Standards · NGSSS</span>
        Benchmarks
      </h2>
      <div class="grade-tabs" id="grade-tab-row">${tabs}</div>
      <div class="benchmarks-panel-wrap">${panels}</div>`;

    el.querySelectorAll('.grade-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        activeGrade = parseInt(tab.dataset.grade, 10);
        el.querySelectorAll('.grade-tab').forEach(t =>
          t.classList.toggle('active-tab', t === tab));
        el.querySelectorAll('.benchmark-panel').forEach(p =>
          p.classList.toggle('active-panel', p.dataset.panel === tab.dataset.grade));
      });
    });
  }

  function renderInstructions() {
    const el = document.getElementById('slide-instructions');
    const steps = lesson.instructions || [];
    el.innerHTML = buildInstrHTML(steps);
    wireInstrButtons(el, steps);
  }

  function buildInstrHTML(steps) {
    const modeLabel = stepMode ? 'Show All Steps' : 'Step by Step';
    const ctrl = `
      <div class="instr-controls">
        <button class="step-mode-btn ${stepMode ? 'on' : ''}" id="stepModeBtn">${modeLabel}</button>
        ${stepMode ? `
          <button class="step-nav-btn" id="stepPrev" ${currentStep === 0 ? 'disabled' : ''}>&#8592;</button>
          <span class="step-counter">${currentStep + 1} of ${steps.length}</span>
          <button class="step-nav-btn" id="stepNext" ${currentStep === steps.length - 1 ? 'disabled' : ''}>&#8594;</button>
        ` : ''}
      </div>`;

    if (stepMode) {
      const s = steps[currentStep] || {};
      return `
        <h2 class="slide-heading">
          <span class="eyebrow">Step by Step</span>
          Instructions
        </h2>
        ${ctrl}
        <div class="step-single-wrap">
          <div class="step-num">${s.step || currentStep + 1}</div>
          <div class="step-title">${esc(s.title || '')}</div>
          <div class="step-detail">${esc(s.detail || '')}</div>
        </div>`;
    }

    const cards = steps.map(s => `
      <div class="step-card">
        <div class="step-num">${s.step}</div>
        <div>
          <div class="step-title">${esc(s.title)}</div>
          <div class="step-detail">${esc(s.detail)}</div>
        </div>
      </div>`).join('');

    return `
      <h2 class="slide-heading">
        <span class="eyebrow">Step by Step</span>
        Instructions
      </h2>
      ${ctrl}
      <div class="steps-all">${cards}</div>`;
  }

  function wireInstrButtons(el, steps) {
    const modeBtn = el.querySelector('#stepModeBtn');
    if (modeBtn) {
      modeBtn.addEventListener('click', () => {
        stepMode = !stepMode;
        currentStep = 0;
        el.innerHTML = buildInstrHTML(steps);
        wireInstrButtons(el, steps);
      });
    }
    const prevS = el.querySelector('#stepPrev');
    const nextS = el.querySelector('#stepNext');
    if (prevS) prevS.addEventListener('click', () => {
      if (currentStep > 0) { currentStep--; el.innerHTML = buildInstrHTML(steps); wireInstrButtons(el, steps); }
    });
    if (nextS) nextS.addEventListener('click', () => {
      if (currentStep < steps.length - 1) { currentStep++; el.innerHTML = buildInstrHTML(steps); wireInstrButtons(el, steps); }
    });
  }

  function renderExamples() {
    const el = document.getElementById('slide-examples');
    const examples = lesson.examples || [];
    const cards = examples.map(ex => {
      const imgContent = ex.imageUrl
        ? `<img src="${esc(ex.imageUrl)}" alt="${esc(ex.title)}" loading="lazy">`
        : `<span class="placeholder-icon">🖼</span>
           <span class="placeholder-hint">Add imageUrl in lessons-data.js to display here</span>`;
      return `
        <div class="example-card">
          <div class="example-img-area">${imgContent}</div>
          <div class="example-info">
            <div class="example-title">${esc(ex.title)}</div>
            <div class="example-desc">${esc(ex.description)}</div>
          </div>
        </div>`;
    }).join('');
    el.innerHTML = `
      <h2 class="slide-heading">
        <span class="eyebrow">Visual Reference</span>
        Examples
      </h2>
      <div class="examples-grid">
        ${cards || '<p style="color:var(--muted)">No examples added yet.</p>'}
      </div>`;
  }

  function renderVideos() {
    const el = document.getElementById('slide-videos');
    const videos = lesson.videos || [];
    const cards = videos.map((v, i) => {
      const pClass = purposeClass(v.purpose);
      return `
        <div class="video-card">
          <div class="video-thumb">&#9654;</div>
          <div class="video-info">
            <div class="video-title">${esc(v.title)}</div>
            <div class="video-meta">
              <span class="video-channel">${esc(v.channel)}</span>
              <span class="video-purpose ${pClass}">${esc(v.purpose || 'Resource')}</span>
              ${v.duration ? `<span class="video-duration">${esc(v.duration)}</span>` : ''}
            </div>
            ${v.description ? `<div class="video-desc">${esc(v.description)}</div>` : ''}
          </div>
          <button class="video-watch-btn" data-vidx="${i}">Watch ▶</button>
        </div>`;
    }).join('');
    el.innerHTML = `
      <h2 class="slide-heading">
        <span class="eyebrow">Video Resources</span>
        Videos
      </h2>
      <div class="videos-list">
        ${cards || '<p style="color:var(--muted)">No videos added yet.</p>'}
      </div>`;
    el.querySelectorAll('.video-watch-btn').forEach(btn =>
      btn.addEventListener('click', () => openModal(videos[parseInt(btn.dataset.vidx, 10)])));
  }

  // ── Section switching ─────────────────────────

  function switchSection(sec) {
    currentSec = sec;
    slides.forEach(s => s.classList.toggle('active', s.dataset.section === sec));
    navBtns.forEach(b => b.classList.toggle('active', b.dataset.section === sec));
  }

  // ── Modal ─────────────────────────────────────

  function openModal(video) {
    if (!video || !video.youtubeId) return;
    modalIframe.src = `https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`;
    modalTitle.textContent = video.title || '';
    modalChan.textContent  = [video.channel, video.duration].filter(Boolean).join(' · ');
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    setTimeout(() => { modalIframe.src = ''; }, 260);
  }

  // ── Fullscreen ────────────────────────────────

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  // ── Keyboard ──────────────────────────────────

  function onKey(e) {
    if (modal.classList.contains('open')) {
      if (e.key === 'Escape') closeModal();
      return;
    }
    const idx = SECTIONS.indexOf(currentSec);
    switch (e.key) {
      case 'ArrowLeft':
        if (idx > 0) switchSection(SECTIONS[idx - 1]);
        break;
      case 'ArrowRight':
        if (idx < SECTIONS.length - 1) switchSection(SECTIONS[idx + 1]);
        break;
      case 'ArrowUp':
        e.preventDefault();
        navigate(-1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        navigate(1);
        break;
      case 'f':
      case 'F':
        toggleFullscreen();
        break;
      case 'Escape':
        // nothing
        break;
    }
  }

  // ── Utilities ─────────────────────────────────

  function purposeClass(purpose) {
    if (!purpose) return 'purpose-reference';
    const p = purpose.toLowerCase();
    if (p.includes('tutorial')) return 'purpose-tutorial';
    if (p.includes('history'))  return 'purpose-art-history';
    return 'purpose-reference';
  }

  function esc(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
