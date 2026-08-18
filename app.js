(function(){
  // ============================================================
  // Seed data: the 75 pieces from the original art binder.
  // Used only to create the default set the first time the app runs.
  // ============================================================
  const SEED_ART = window.SEED_ART;

  // ============================================================
  // The 32 printed "Art History BINGO" cards, transcribed cell-by-cell
  // (row-major, 25 cells each, center = FREE = 0). Each number is a
  // 1-based index into SEED_ART above, so it always resolves to the
  // exact same title+subtitle pair regardless of item order elsewhere.
  // Used only to predict/detect a winner among the physical cards —
  // has no effect on gameplay itself.
  // ============================================================
  const CARD_GRIDS = [
    [14,30,41,53,74, 4,28,35,57,68, 10,23,0,46,75, 8,16,43,48,70, 12,27,39,56,66],
    [15,26,38,59,68, 13,20,42,53,62, 8,19,0,60,71, 1,28,33,55,70, 12,24,41,51,65],
    [11,23,44,53,69, 5,27,38,47,65, 4,16,0,56,63, 13,18,40,55,61, 9,26,36,50,74],
    [8,29,38,54,74, 12,23,32,50,70, 1,30,0,48,68, 3,25,40,46,72, 11,21,35,59,67],
    [14,23,39,59,63, 8,17,35,55,61, 15,26,0,53,71, 10,25,31,57,64, 6,20,44,52,68],
    [8,24,44,48,75, 2,20,40,46,69, 15,18,0,56,66, 10,16,42,49,71, 6,29,37,53,65],
    [9,29,33,60,70, 5,25,31,54,71, 3,23,0,51,67, 1,27,34,56,65, 14,22,38,50,61],
    [14,18,45,55,65, 10,16,39,56,69, 8,26,0,52,64, 12,19,41,50,61, 7,23,35,46,73],
    [3,30,40,50,73, 1,24,41,54,72, 11,21,0,49,71, 4,26,35,46,63, 8,20,31,58,62],
    [15,25,35,58,69, 9,26,39,57,68, 6,22,0,56,63, 11,20,31,48,66, 5,16,43,47,62],
    [10,20,43,54,72, 11,24,42,53,70, 7,19,0,48,64, 5,16,33,51,61, 1,28,32,47,67],
    [5,28,39,57,66, 9,27,38,55,64, 4,26,0,49,68, 1,18,36,46,63, 13,17,32,52,65],
    [13,24,42,51,67, 12,23,40,49,62, 11,18,0,53,64, 3,21,31,48,72, 2,17,37,50,74],
    [9,27,36,52,62, 8,25,34,47,64, 3,19,0,49,68, 6,16,33,57,66, 2,22,35,59,67],
    [12,21,37,47,63, 10,19,32,49,75, 4,23,0,53,73, 1,18,42,51,61, 7,20,44,52,68],
    [6,22,32,48,70, 4,17,34,60,65, 8,19,0,58,66, 3,27,36,46,62, 5,29,37,53,64],
    [7,17,33,55,69, 2,19,45,50,71, 4,28,0,51,74, 12,21,31,47,72, 14,22,38,49,67],
    [2,18,40,54,67, 4,30,35,56,75, 8,28,0,59,68, 6,16,32,57,66, 7,23,34,52,74],
    [3,25,39,52,73, 15,20,41,60,63, 13,21,0,53,62, 1,17,42,51,66, 8,19,37,59,75],
    [10,24,37,58,62, 5,26,45,48,70, 6,29,0,47,66, 2,27,36,51,64, 4,22,44,60,61],
    [9,22,43,47,67, 11,30,33,55,62, 14,23,0,51,73, 12,21,36,49,68, 7,29,45,46,66],
    [7,28,32,52,66, 15,18,40,47,69, 8,17,0,58,63, 6,21,34,53,75, 14,30,31,51,74],
    [13,17,37,51,67, 3,25,32,54,66, 2,21,0,48,63, 6,19,38,60,71, 15,16,36,59,70],
    [2,22,36,52,73, 10,17,39,51,72, 6,28,0,48,62, 4,23,45,56,74, 1,21,44,55,68],
    [7,21,37,58,73, 2,24,36,57,70, 13,18,0,47,66, 8,30,41,59,67, 6,29,40,53,75],
    [6,22,43,58,69, 9,21,42,55,61, 3,18,0,51,70, 15,26,44,52,64, 14,25,38,60,72],
    [7,28,43,54,69, 6,27,40,46,67, 3,17,0,55,65, 11,29,37,49,73, 10,23,45,57,75],
    [13,28,39,54,65, 12,25,31,52,72, 2,21,0,50,70, 14,22,34,58,71, 8,30,32,60,69],
    [13,24,39,50,73, 10,16,37,57,69, 6,25,0,55,61, 7,19,43,56,68, 15,27,45,54,74],
    [9,24,35,58,67, 1,22,42,54,72, 10,20,0,46,66, 4,28,41,53,62, 12,30,39,59,70],
    [9,20,43,52,69, 7,27,39,57,67, 5,25,0,51,63, 13,26,38,47,75, 15,24,44,55,70],
    [5,28,37,54,73, 12,24,42,52,64, 10,16,0,48,67, 11,23,32,60,75, 9,29,40,55,65]
  ];
  const BINGO_LINES = [
    [0,1,2,3,4],[5,6,7,8,9],[10,11,12,13,14],[15,16,17,18,19],[20,21,22,23,24],
    [0,5,10,15,20],[1,6,11,16,21],[2,7,12,17,22],[3,8,13,18,23],[4,9,14,19,24],
    [0,6,12,18,24],[4,8,12,16,20]
  ];

  const WASHES = [
    ["#ffffff","#f0f0ec"], ["#faf9f6","#eae8e2"], ["#f7f7f5","#e6e6e2"],
    ["#f5f6f4","#e2e5e0"], ["#faf8f5","#e8e2d8"], ["#f6f7f8","#dfe3e6"],
    ["#f7f5f5","#e6dfdf"], ["#f5f7f5","#dee5de"]
  ];

  const META_KEY = "bingo-sets-meta";
  const ACTIVE_KEY = "bingo-active-set";
  const itemsKey = id => `bingo-set-items:${id}`;
  const progressKey = id => `bingo-progress:${id}`;
  const imgKey = (setId,itemId) => `bingo-img:${setId}:${itemId}`;

  let storageOk = true;              // whether persistence is available
  let sets = [];                     // [{id,name}]
  let activeSetId = null;
  let items = [];                    // current set's items [{id,title,subtitle,fact,hasImage}]
  let deck = [];                     // remaining ids to draw
  let called = [];                   // called items in order (full objects)
  let revealedIds = new Set();       // ids that have been revealed (shown in the columns board)
  let viewIndex = -1;                 // index into `called` currently shown on the plaque (Back/Forward navigate this)
  let lastBingoStatus = null;         // result of the last computeBingoStatus() call, used by the winner button's click handler
  const imgCache = new Map();        // itemId -> dataURL, session cache

  // ---------- DOM ----------
  const $ = sel => document.querySelector(sel);
  const setTitle = $('#setTitle');
  const setSwitcher = $('#setSwitcher');
  const editorSetSwitcher = $('#editorSetSwitcher');
  const drawnCount = $('#drawnCount');
  const totalCount = $('#totalCount');
  const drawBtn = $('#drawBtn');
  const backBtn = $('#backBtn');
  const forwardBtn = $('#forwardBtn');
  const resetBtn = $('#resetBtn');
  const winnerBtn = $('#winnerBtn');
  const plaque = $('#plaque');
  const plaqueInner = $('#plaqueInner');
  const columnsWrap = $('#columnsWrap');
  const mainView = $('#mainView');
  const editorView = $('#editorView');
  const setupBtn = $('#setupBtn');
  const backToGameBtn = $('#backToGameBtn');
  const backToGameBtn2 = $('#backToGameBtn2');
  const fsBtn = $('#fsBtn');
  const setNameInput = $('#setNameInput');
  const newSetBtn = $('#newSetBtn');
  const duplicateSetBtn = $('#duplicateSetBtn');
  const deleteSetBtn = $('#deleteSetBtn');
  const addItemBtn = $('#addItemBtn');
  const itemsTable = $('#itemsTable');
  const bulkToggleBtn = $('#bulkToggleBtn');
  const bulkPanel = $('#bulkPanel');
  const bulkTextarea = $('#bulkTextarea');
  const bulkApplyBtn = $('#bulkApplyBtn');
  const bulkCancelBtn = $('#bulkCancelBtn');
  const bulkImgBtn = $('#bulkImgBtn');
  const bulkImgInput = $('#bulkImgInput');
  const toastEl = $('#toast');

  function toast(msg, ms){
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(()=>toastEl.classList.remove('show'), ms||2200);
  }

  function escapeHtml(s){
    return String(s==null?'':s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }
  function uid(){ return Math.random().toString(36).slice(2,9) + Date.now().toString(36).slice(-4); }
  function washFor(id){
    let h=0; for(let i=0;i<id.length;i++) h = (h*31 + id.charCodeAt(i)) >>> 0;
    return WASHES[h % WASHES.length];
  }
  function imageLinkFor(item){
    const q = encodeURIComponent(`${item.title} ${item.subtitle||''} artwork`.trim());
    return `https://www.google.com/search?tbm=isch&q=${q}`;
  }

  // ============================================================
  // Storage helpers.
  // Prefers window.storage (the claude.ai artifact persistence API).
  // When that's not present at all — e.g. this file was downloaded and
  // opened directly in a browser — falls back to the browser's own
  // localStorage, so work still survives a refresh. Only if neither is
  // available (rare: e.g. some private-browsing modes) does it fall
  // back to in-memory-only for that session.
  // ============================================================
  const LS_PREFIX = "bingo-app::";
  let lsChecked = false, lsOk = false;
  function checkLocalStorage(){
    if(lsChecked) return lsOk;
    lsChecked = true;
    try{
      if(typeof window === 'undefined' || !window.localStorage) return (lsOk = false);
      const k = '__bingo_ls_test__';
      window.localStorage.setItem(k, '1');
      window.localStorage.removeItem(k);
      lsOk = true;
    }catch(e){ lsOk = false; }
    return lsOk;
  }

  async function storeGet(key){
    if(window.storage){
      try{
        const res = await window.storage.get(key);
        return res ? res.value : null;
      }catch(e){ return null; }
    }
    if(checkLocalStorage()){
      try{ return window.localStorage.getItem(LS_PREFIX + key); }
      catch(e){ storageOk = false; return null; }
    }
    storageOk = false;
    return null;
  }
  async function storeSet(key,value){
    if(window.storage){
      try{
        const res = await window.storage.set(key, value, false);
        return !!res;
      }catch(e){ return false; }
    }
    if(checkLocalStorage()){
      try{ window.localStorage.setItem(LS_PREFIX + key, value); return true; }
      catch(e){ storageOk = false; return false; } // e.g. storage quota exceeded
    }
    storageOk = false;
    return false;
  }
  async function storeDelete(key){
    if(window.storage){
      try{ await window.storage.delete(key, false); return true; }
      catch(e){ return false; }
    }
    if(checkLocalStorage()){
      try{ window.localStorage.removeItem(LS_PREFIX + key); return true; }
      catch(e){ return false; }
    }
    return false;
  }

  // ============================================================
  // Sets management
  // ============================================================
  function defaultArtItems(){
    return SEED_ART.map(([t,a,fAuction,fPeriod,fUnique,born,place,died,diedPlace,col]) => {
      const key = t + '||' + a;
      const imageUrl = (window.SEED_IMAGES && window.SEED_IMAGES[key]) || "";
      const dateText = (window.SEED_DATES && window.SEED_DATES[key]) || "";
      return {
        id: uid(), title:t, subtitle:a,
        subtitleBorn: born||"", subtitlePlace: place||"", subtitleDied: died||"", subtitleDiedPlace: diedPlace||"",
        factAuction: fAuction||"", factPeriod: fPeriod||"", factUnique: fUnique||"",
        paintedPlace: "", currentPlace: "",
        column: col||"", hasImage: !!imageUrl, imageUrl, dateText
      };
    });
  }

  const DEFAULT_SET_ID = 'default-art';
  let defaultItemsFallback = null; // used when persistent storage isn't available at all

  async function loadOrInitSets(){
    const rawMeta = await storeGet(META_KEY);
    if(rawMeta){
      try{ sets = JSON.parse(rawMeta); }catch(e){ sets = []; }
    }
    if(!sets || sets.length===0){
      const id = DEFAULT_SET_ID;
      sets = [{ id, name:"Famous Artwork" }];
      defaultItemsFallback = defaultArtItems();
      await storeSet(META_KEY, JSON.stringify(sets));
      await storeSet(itemsKey(id), JSON.stringify(defaultItemsFallback));
    }
    const rawActive = await storeGet(ACTIVE_KEY);
    activeSetId = (rawActive && sets.find(s=>s.id===rawActive)) ? rawActive : sets[0].id;
  }

  function backfillDefaultImages(list){
    let changed = false;
    list.forEach(it=>{
      const key = it.title + '||' + (it.subtitle||'');
      if(!it.hasImage && window.SEED_IMAGES && window.SEED_IMAGES[key]){
        it.imageUrl = window.SEED_IMAGES[key];
        it.hasImage = true;
        changed = true;
      }
      if(!it.dateText && window.SEED_DATES && window.SEED_DATES[key]){
        it.dateText = window.SEED_DATES[key];
        changed = true;
      }
    });
    return changed;
  }

  async function loadItemsFor(setId){
    const raw = await storeGet(itemsKey(setId));
    if(raw){
      try{
        const parsed = JSON.parse(raw);
        if(Array.isArray(parsed)){
          if(setId === DEFAULT_SET_ID && backfillDefaultImages(parsed)){
            await storeSet(itemsKey(setId), JSON.stringify(parsed));
          }
          return parsed;
        }
      }catch(e){}
    }
    // Storage unavailable or empty (e.g. the file was downloaded and opened
    // directly, with no persistence backend) — still seed the default topic
    // with all 75 titles so it's never blank. It can be cleared from Setup.
    if(setId === DEFAULT_SET_ID){
      if(!defaultItemsFallback) defaultItemsFallback = defaultArtItems();
      return defaultItemsFallback;
    }
    return [];
  }

  async function saveItems(){
    if(activeSetId === DEFAULT_SET_ID){
      defaultItemsFallback = items;
    }
    await storeSet(itemsKey(activeSetId), JSON.stringify(items));
  }

  async function loadProgressFor(setId){
    const raw = await storeGet(progressKey(setId));
    if(raw){
      try{ return JSON.parse(raw); }catch(e){}
    }
    return null;
  }
  async function saveProgress(){
    await storeSet(progressKey(activeSetId), JSON.stringify({
      deck, called: called.map(c=>c.id), revealed: Array.from(revealedIds)
    }));
  }

  function shuffledIds(list){
    const ids = list.map(it=>it.id);
    for(let i=ids.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [ids[i],ids[j]]=[ids[j],ids[i]]; }
    return ids;
  }

  function populateSetSwitchers(){
    [setSwitcher, editorSetSwitcher].forEach(sel=>{
      sel.innerHTML = sets.map(s=>`<option value="${s.id}" ${s.id===activeSetId?'selected':''}>${escapeHtml(s.name)}</option>`).join('');
    });
  }

  async function switchToSet(setId, skipConfirmSave){
    activeSetId = setId;
    await storeSet(ACTIVE_KEY, activeSetId);
    items = await loadItemsFor(activeSetId);
    const set = sets.find(s=>s.id===activeSetId);
    setTitle.textContent = set ? set.name : "Untitled Set";
    setNameInput.value = set ? set.name : "";
    populateSetSwitchers();

    const prog = await loadProgressFor(activeSetId);
    const validIds = new Set(items.map(i=>i.id));
    if(prog && Array.isArray(prog.deck) && Array.isArray(prog.called)){
      deck = prog.deck.filter(id=>validIds.has(id));
      called = prog.called.filter(id=>validIds.has(id)).map(id=>items.find(i=>i.id===id)).filter(Boolean);
      const revealedArr = Array.isArray(prog.revealed) ? prog.revealed : [];
      revealedIds = new Set(revealedArr.filter(id=>validIds.has(id)));
    } else {
      deck = shuffledIds(items);
      called = [];
      revealedIds = new Set();
    }
    viewIndex = called.length - 1;
    totalCount.textContent = items.length;
    if(viewIndex >= 0){
      await revealItem(called[viewIndex], viewIndex + 1, true);
    } else {
      resetPlaqueToIdle();
    }
    renderColumns();
    renderBingoWinner();
    renderControls();
    renderItemsTable();
  }

  function resetPlaqueToIdle(){
    plaque.classList.remove('show','revealed');
    void plaque.offsetWidth;
    plaqueInner.innerHTML = items.length
      ? '<div class="placeholder">Press "Draw" to begin</div>'
      : '<div class="placeholder">This topic has no items yet — open Setup to add some.</div>';
    plaque.classList.add('show');
  }

  // ============================================================
  // Game logic
  // ============================================================
  function renderControls(){
    drawnCount.textContent = called.length;
    drawBtn.disabled = deck.length === 0;
    backBtn.disabled = viewIndex <= 0;
    forwardBtn.disabled = viewIndex < 0 || viewIndex >= called.length - 1;
    drawBtn.textContent = (deck.length===0 && items.length>0 && called.length===items.length) ? "All Called" : "Draw";
  }

  const BINGO_LETTERS = ['B','I','N','G','O'];

  function bcardHtml(item, drawNum){
    const thumbInner = item.hasImage ? '' : `<span>🖼️</span>`;
    return `<div class="bcard" data-id="${item.id}" title="Click to view">
      <div class="bcard-num">#${drawNum}</div>
      <div class="bcard-thumb" data-bcard-thumb="${item.id}">${thumbInner}</div>
      <div class="bcard-title">${escapeHtml(item.title)}</div>
      ${item.subtitle ? `<div class="bcard-artist">${escapeHtml(item.subtitle)}</div>` : ''}
    </div>`;
  }

  function renderColumns(){
    const orderMap = new Map();
    called.forEach((c,i)=> orderMap.set(c.id, i+1));

    BINGO_LETTERS.forEach(letter=>{
      const listEl = document.getElementById('bcol-list-' + letter);
      if(!listEl) return;
      const entries = called.filter(c => revealedIds.has(c.id) && (c.column||'').trim().toUpperCase() === letter);
      if(entries.length === 0){
        listEl.innerHTML = '<div class="bcol-empty">—</div>';
        return;
      }
      listEl.innerHTML = entries.map(c => bcardHtml(c, orderMap.get(c.id))).join('');
      listEl.querySelectorAll('.bcard').forEach(card=>{
        card.addEventListener('click', ()=> openRecap(card.getAttribute('data-id')));
      });
      entries.forEach(async c=>{
        if(!c.hasImage) return;
        const dataUrl = await getImageDataUrl(c);
        if(!dataUrl) return;
        const box = listEl.querySelector(`[data-bcard-thumb="${c.id}"]`);
        if(box) box.innerHTML = `<img src="${dataUrl}" alt="">`;
      });
    });
  }

  // ============================================================
  // Predicting/detecting a winner among the 32 printed cards.
  // Only meaningful for the default "Famous Artwork" set, since the
  // printed cards' layouts are specific to those 75 pieces.
  // ============================================================
  function lineLabelFor(lineIdx){
    if(lineIdx < 5) return `Row ${lineIdx+1}`;
    if(lineIdx < 10) return `Column ${['B','I','N','G','O'][lineIdx-5]}`;
    return lineIdx===10 ? 'Diagonal ↘' : 'Diagonal ↙';
  }

  function winTypeLabel(lineIdx){
    if(lineIdx < 5) return 'Horizontal Win!';
    if(lineIdx < 10) return 'Vertical Win!';
    return 'Diagonal Win!';
  }

  function buildItemKeyMap(){
    const map = new Map();
    items.forEach(it => map.set(it.title.trim() + '||' + (it.subtitle||'').trim(), it));
    return map;
  }

  function computeBingoStatus(){
    if(activeSetId !== DEFAULT_SET_ID) return { mode:'unavailable' };
    if(revealedIds.size === 0) return { mode:'empty' };

    const itemByKey = buildItemKeyMap();
    function isRevealed(masterIdx){
      if(masterIdx === 0) return true; // FREE
      const [title, subtitle] = SEED_ART[masterIdx-1];
      const it = itemByKey.get(title.trim() + '||' + subtitle.trim());
      return it ? revealedIds.has(it.id) : false;
    }

    const winnersRaw = [];
    const perCardBest = []; // { cardNum, lineIdx, count }

    CARD_GRIDS.forEach((grid, ci)=>{
      let bestCount = -1, bestLineIdx = 0;
      BINGO_LINES.forEach((line, li)=>{
        const count = line.filter(pos => isRevealed(grid[pos])).length;
        if(count > bestCount){ bestCount = count; bestLineIdx = li; }
        if(count === 5) winnersRaw.push({ cardNum: ci+1, lineIdx: li });
      });
      perCardBest.push({ cardNum: ci+1, lineIdx: bestLineIdx, count: bestCount });
    });

    if(winnersRaw.length > 0){
      // one entry per card (first winning line found), sorted by card number
      const seen = new Set();
      const winners = [];
      winnersRaw.forEach(w=>{
        if(!seen.has(w.cardNum)){ seen.add(w.cardNum); winners.push(w); }
      });
      winners.sort((a,b)=>a.cardNum-b.cardNum);
      return { mode:'winning', winners };
    }

    const maxCount = Math.max(...perCardBest.map(r=>r.count));
    const leaders = perCardBest.filter(r=>r.count===maxCount).sort((a,b)=>a.cardNum-b.cardNum);
    return {
      mode:'leading', leaders,
      leaderCard: leaders[0].cardNum, leaderLineIdx: leaders[0].lineIdx, leaderCount: maxCount
    };
  }

  function renderBingoWinner(){
    const status = computeBingoStatus();
    lastBingoStatus = status;
    winnerBtn.classList.remove('leading','winning');

    if(status.mode === 'unavailable'){
      winnerBtn.disabled = true;
      winnerBtn.textContent = 'N/A';
      winnerBtn.title = 'Only available for the default Famous Artwork set';
      return;
    }
    if(status.mode === 'empty'){
      winnerBtn.disabled = true;
      winnerBtn.textContent = 'No calls yet';
      winnerBtn.title = 'Predicted winner among the 32 printed cards';
      return;
    }
    winnerBtn.disabled = false;
    if(status.mode === 'winning'){
      const nums = status.winners.map(w=>w.cardNum);
      winnerBtn.textContent = nums.length===1 ? `🏆 Card ${nums[0]}` : `🏆 Cards ${nums.join(', ')}`;
      winnerBtn.classList.add('winning');
      winnerBtn.title = nums.length===1
        ? `BINGO! Click to view card ${nums[0]} and see the winning line.`
        : `BINGO! ${nums.length} cards won at once: ${nums.join(', ')}. Click to browse them.`;
    } else {
      const n = status.leaders.length;
      winnerBtn.textContent = `Leading: Card ${status.leaderCard}`;
      winnerBtn.classList.add('leading');
      winnerBtn.title = n===1
        ? `Card ${status.leaderCard} has ${status.leaderCount}/5 in its best line (${lineLabelFor(status.leaderLineIdx)}). Click to view the card.`
        : `${n} cards are tied for the lead with ${status.leaderCount}/5. Click to browse all ${n}.`;
    }
  }

  function openLeaderCardModal(){
    if(!lastBingoStatus) return;
    let candidates, isWin;
    if(lastBingoStatus.mode === 'winning'){
      candidates = lastBingoStatus.winners;   // [{cardNum, lineIdx}]
      isWin = true;
    } else if(lastBingoStatus.mode === 'leading'){
      candidates = lastBingoStatus.leaders;   // [{cardNum, lineIdx, count}]
      isWin = false;
    } else {
      return;
    }
    if(!candidates || candidates.length === 0) return;

    let idx = 0;
    const itemByKey = buildItemKeyMap();

    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `
      <div class="card-modal">
        <div class="card-modal-nav">
          <button class="cm-nav-btn" id="cmPrevBtn" title="Previous card">‹</button>
          <span class="cm-nav-count" id="cmNavCount"></span>
          <button class="cm-nav-btn" id="cmNextBtn" title="Next card">›</button>
          <button class="modal-close" aria-label="Close">×</button>
        </div>
        <div class="card-modal-title">Art History BINGO</div>
        <div class="card-modal-subtitle" id="cmSubtitle"></div>
        <div class="bingo-strip">
          <div class="bingo-strip-letter col-b">B</div>
          <div class="bingo-strip-letter col-i">I</div>
          <div class="bingo-strip-letter col-n">N</div>
          <div class="bingo-strip-letter col-g">G</div>
          <div class="bingo-strip-letter col-o">O</div>
        </div>
        <div class="card-grid" id="cmGrid"></div>
        <div class="card-modal-status" id="cmStatus"></div>
      </div>
    `;

    function cellHtml(c){
      const classes = ['cm-cell'];
      if(c.free) classes.push('free');
      if(c.called && !c.free) classes.push('called');
      if(c.onLine) classes.push('online');
      if(c.free) return `<div class="${classes.join(' ')}">FREE</div>`;
      if(c.called){
        const hasImg = c.item && c.item.hasImage;
        const thumbAttr = c.item ? ` data-cm-thumb="${c.item.id}"` : '';
        return `<div class="${classes.join(' ')}">
          <div class="cm-thumb"${thumbAttr}>${hasImg ? '' : '🖼️'}</div>
          <div class="cm-title">${escapeHtml(c.title)}</div>
        </div>`;
      }
      return `<div class="${classes.join(' ')}"></div>`;
    }

    function renderCandidate(){
      const cand = candidates[idx];
      const grid = CARD_GRIDS[cand.cardNum-1];
      const linePositions = new Set(BINGO_LINES[cand.lineIdx]);

      const cells = grid.map((masterIdx, pos)=>{
        if(masterIdx === 0){
          return { pos, free:true, called:true, onLine: linePositions.has(pos) };
        }
        const [title, subtitle] = SEED_ART[masterIdx-1];
        const it = itemByKey.get(title.trim() + '||' + subtitle.trim());
        const called = it ? revealedIds.has(it.id) : false;
        return { pos, free:false, called, onLine: linePositions.has(pos), title, subtitle, item: it };
      });

      const calledOnLine = BINGO_LINES[cand.lineIdx].filter(p => cells[p].called).length;
      const lineLabel = lineLabelFor(cand.lineIdx);
      const statusText = isWin
        ? `🏆 BINGO! Card ${cand.cardNum} completed ${lineLabel}.`
        : `Card ${cand.cardNum} is leading — ${calledOnLine}/5 called on ${lineLabel}.`;

      backdrop.querySelector('#cmSubtitle').textContent = `Card ${cand.cardNum}`;
      backdrop.querySelector('#cmGrid').innerHTML = cells.map(cellHtml).join('');
      const statusEl = backdrop.querySelector('#cmStatus');
      statusEl.textContent = statusText;
      statusEl.classList.toggle('win', isWin);

      const countEl = backdrop.querySelector('#cmNavCount');
      const prevBtn = backdrop.querySelector('#cmPrevBtn');
      const nextBtn = backdrop.querySelector('#cmNextBtn');
      if(candidates.length > 1){
        countEl.textContent = `${idx+1} / ${candidates.length}`;
        countEl.style.display = '';
        prevBtn.style.display = '';
        nextBtn.style.display = '';
      } else {
        countEl.style.display = 'none';
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
      }

      cells.forEach(async c=>{
        if(c.free || !c.called || !c.item || !c.item.hasImage) return;
        const dataUrl = await getImageDataUrl(c.item);
        if(!dataUrl) return;
        const box = backdrop.querySelector(`[data-cm-thumb="${c.item.id}"]`);
        if(box) box.innerHTML = `<img src="${dataUrl}" alt="">`;
      });

      if(isWin){
        backdrop.querySelectorAll('#cmGrid .cm-cell.online').forEach(el=>{
          el.style.cursor = 'pointer';
          el.addEventListener('click', ()=> openWinningLineModal(cand, cells));
        });
      }
    }

    backdrop.querySelector('#cmPrevBtn').addEventListener('click', ()=>{
      idx = (idx - 1 + candidates.length) % candidates.length;
      renderCandidate();
    });
    backdrop.querySelector('#cmNextBtn').addEventListener('click', ()=>{
      idx = (idx + 1) % candidates.length;
      renderCandidate();
    });
    backdrop.addEventListener('click', e=>{ if(e.target===backdrop) backdrop.remove(); });
    backdrop.querySelector('.modal-close').addEventListener('click', ()=>backdrop.remove());
    document.body.appendChild(backdrop);
    renderCandidate();
  }

  function openWinningLineModal(cand, cells){
    const lineCells = BINGO_LINES[cand.lineIdx].map(pos => cells[pos]);
    const typeLabel = winTypeLabel(cand.lineIdx);

    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `
      <div class="win-modal">
        <button class="modal-close" aria-label="Close">×</button>
        <div class="win-modal-title">🏆 ${escapeHtml(typeLabel)} <span class="win-modal-card">Card ${cand.cardNum}</span></div>
        <div class="win-modal-row" id="winModalRow"></div>
      </div>
    `;

    const rowEl = backdrop.querySelector('#winModalRow');
    rowEl.innerHTML = lineCells.map(c=>{
      const letter = ['B','I','N','G','O'][c.pos % 5];
      const badge = `<div class="letter-badge letter-${letter.toLowerCase()}">${letter}</div>`;
      if(c.free){
        return `<div class="win-tile free-tile">${badge}<div class="win-tile-free-label">FREE</div></div>`;
      }
      const thumbAttr = c.item ? ` data-win-thumb="${c.item.id}"` : '';
      return `<div class="win-tile">
        ${badge}
        <div class="win-tile-img-wrap"${thumbAttr}></div>
        <div class="win-tile-title">${escapeHtml(c.title)}</div>
        ${c.subtitle ? `<div class="win-tile-artist">${escapeHtml(c.subtitle)}</div>` : ''}
      </div>`;
    }).join('');

    backdrop.addEventListener('click', e=>{ if(e.target===backdrop) backdrop.remove(); });
    backdrop.querySelector('.modal-close').addEventListener('click', ()=>backdrop.remove());
    document.body.appendChild(backdrop);

    lineCells.forEach(async c=>{
      if(c.free || !c.item) return;
      const box = backdrop.querySelector(`[data-win-thumb="${c.item.id}"]`);
      if(!box) return;
      if(!c.item.hasImage){ box.innerHTML = `<span class="win-tile-noimg">🖼️</span>`; return; }
      const dataUrl = await getImageDataUrl(c.item);
      if(dataUrl) box.innerHTML = `<img src="${dataUrl}" alt="${escapeHtml(c.title||'')}">`;
      else box.innerHTML = `<span class="win-tile-noimg">🖼️</span>`;
    });
  }

  async function getImageDataUrl(item){
    if(item.imageUrl) return item.imageUrl;
    if(!item.hasImage) return null;
    if(imgCache.has(item.id)) return imgCache.get(item.id);
    const raw = await storeGet(imgKey(activeSetId, item.id));
    if(raw) imgCache.set(item.id, raw);
    return raw;
  }

  function subtitleMetaHtml(item){
    const lines = [];
    const bornParts = [item.subtitleBorn, item.subtitlePlace].filter(Boolean);
    if(bornParts.length) lines.push('Born ' + bornParts.join(' · '));
    const diedParts = [item.subtitleDied, item.subtitleDiedPlace].filter(Boolean);
    if(diedParts.length) lines.push('Died ' + diedParts.join(' · '));
    if(lines.length === 0) return '';
    return `<div class="art-subtitle-meta">${lines.map(escapeHtml).join('<br>')}</div>`;
  }

  function letterBadgeHtml(item, immediate){
    const col = (item.column || '').trim().toUpperCase();
    if(!['B','I','N','G','O'].includes(col)) return '';
    const style = immediate ? ' style="opacity:1; transform:none;"' : '';
    return `<div class="letter-badge letter-${col.toLowerCase()}"${style}>${col}</div>`;
  }

  // Puts the B/I/N/G/O badge to the left of the artist's name, birth, and death info.
  function artistBlockHtml(item, immediateBadge, showBadge){
    const badge = (showBadge === false) ? '' : letterBadgeHtml(item, immediateBadge);
    const subtitleHtml = item.subtitle ? `<div class="art-subtitle">${escapeHtml(item.subtitle)}</div>` : '';
    const metaHtml = subtitleMetaHtml(item);
    const textInner = subtitleHtml + metaHtml;
    if(!badge && !textInner) return '';
    return `<div class="artist-block">${badge}${textInner ? `<div class="artist-text">${textInner}</div>` : ''}</div>`;
  }

  function hasAnyFact(item){
    return !!(item.factAuction || item.factPeriod || item.factUnique);
  }
  function factsBlocksHtml(item){
    const blocks = [];
    if(item.factAuction) blocks.push(`<div class="fact-block"><div class="fact-label">💰 Auction &amp; Value</div><div class="fact-text">${escapeHtml(item.factAuction)}</div></div>`);
    if(item.factPeriod) blocks.push(`<div class="fact-block"><div class="fact-label">🕰️ Time Period</div><div class="fact-text">${escapeHtml(item.factPeriod)}</div></div>`);
    if(item.factUnique) blocks.push(`<div class="fact-block"><div class="fact-label">✨ Something Unique</div><div class="fact-text">${escapeHtml(item.factUnique)}</div></div>`);
    return blocks.join('');
  }

  async function revealItem(item, drawNum, instant){
    const dataUrl = await getImageDataUrl(item);
    const [c1,c2] = washFor(item.id);
    plaque.style.setProperty('--plaque-a', c1);
    plaque.style.setProperty('--plaque-b', c2);
    plaque.classList.remove('show');
    void plaque.offsetWidth;
    plaque.classList.add('show','revealed');

    const backContent = dataUrl
      ? `<img class="reveal-img" src="${dataUrl}" alt="${escapeHtml(item.title)}">`
      : `<div class="placeholder-icon">🖼️</div>
         <div class="placeholder-text">No image uploaded</div>
         <a class="view-link secondary" href="${imageLinkFor(item)}" target="_blank" rel="noopener">View Image ↗</a>`;

    plaqueInner.innerHTML = `
      <div class="reveal-split">
        <div class="reveal-media">
          <div class="flip-inner${instant ? ' flipped no-anim' : ''}" id="flipInner">
            <div class="flip-face flip-front">
              <div class="card-back-glyph">🎨</div>
              <div class="card-back-text">Revealing…</div>
            </div>
            <div class="flip-face flip-back${dataUrl ? '' : ' placeholder-media'}">
              ${backContent}
            </div>
          </div>
        </div>
        <div class="reveal-info">
          <div class="draw-index">Draw ${drawNum} of ${items.length}</div>
          <div class="art-title">${escapeHtml(item.title)}</div>
          ${item.dateText ? `<div class="art-date">${escapeHtml(item.dateText)}</div>` : ''}
          ${artistBlockHtml(item)}
          ${hasAnyFact(item) ? `<div class="fact-panel">${factsBlocksHtml(item)}</div>` : ''}
        </div>
      </div>
    `;
    revealedIds.add(item.id);
    renderColumns();
    renderBingoWinner();
    await saveProgress();

    if(!instant){
      const flipInner = document.getElementById('flipInner');
      setTimeout(()=>{
        if(flipInner) flipInner.classList.add('flipped');
      }, 1100);
    }
  }

  function openRecap(itemId){
    const item = called.find(c=>c.id===itemId);
    if(!item) return;
    getImageDataUrl(item).then(dataUrl=>{
      const backdrop = document.createElement('div');
      backdrop.className = 'lightbox-backdrop';
      const imgHtml = dataUrl
        ? `<img class="lightbox-img" src="${dataUrl}" alt="${escapeHtml(item.title)}">`
        : `<div class="lightbox-no-img">🖼️</div>`;
      const year = item.dateText ? item.dateText : '';
      const artist = item.subtitle ? escapeHtml(item.subtitle) : '';
      const yearPart = year ? `<span class="lightbox-year">${escapeHtml(year)}</span>` : '';
      const dotSep = (artist && year) ? `<span class="lightbox-dot">·</span>` : '';
      const col = (item.column || '').trim().toUpperCase();
      const badgeHtml = ['B','I','N','G','O'].includes(col)
        ? `<div class="lightbox-badge letter-${col.toLowerCase()}">${col}</div>` : '';
      backdrop.innerHTML = `
        <div class="lightbox-box">
          <button class="lightbox-close" aria-label="Close">×</button>
          <div class="lightbox-frame">${imgHtml}</div>
          <div class="lightbox-caption">
            ${badgeHtml}
            <div class="lightbox-text">
              <span class="lightbox-title">${escapeHtml(item.title)}</span>
              ${artist ? `<span class="lightbox-artist">${artist}</span>` : ''}
              ${dotSep}${yearPart}
            </div>
          </div>
        </div>`;
      backdrop.addEventListener('click', e=>{ if(e.target===backdrop) backdrop.remove(); });
      backdrop.querySelector('.lightbox-close').addEventListener('click', ()=>backdrop.remove());
      document.addEventListener('keydown', function escLightbox(e){
        if(e.code==='Escape'){ backdrop.remove(); document.removeEventListener('keydown', escLightbox); }
      });
      document.body.appendChild(backdrop);
    });
  }

  async function draw(){
    if(deck.length === 0) return;
    const id = deck.pop();
    const item = items.find(i=>i.id===id);
    if(!item) { renderControls(); return; }
    called.push(item);
    viewIndex = called.length - 1;
    renderControls();
    await revealItem(item, called.length);
  }

  // Back/Forward only change what's displayed on the plaque — they never
  // alter the deck, the called list, or which cards count as revealed.
  async function goBack(){
    if(viewIndex <= 0) return;
    viewIndex--;
    await revealItem(called[viewIndex], viewIndex + 1, true);
    renderControls();
  }

  async function goForward(){
    if(viewIndex < 0 || viewIndex >= called.length - 1) return;
    viewIndex++;
    await revealItem(called[viewIndex], viewIndex + 1, true);
    renderControls();
  }

  async function resetGame(ask){
    if(ask && called.length > 0){
      if(!confirm('Reset this game? This clears everything already called.')) return;
    }
    deck = shuffledIds(items);
    called = [];
    revealedIds = new Set();
    viewIndex = -1;
    resetPlaqueToIdle();
    renderControls();
    renderColumns();
    renderBingoWinner();
    await saveProgress();
  }

  // ============================================================
  // Editor
  // ============================================================
  function renderItemsTable(){
    if(items.length === 0){
      itemsTable.innerHTML = '<div class="hint" style="text-align:left; color:var(--stone-dim);">No items yet. Use "Add Item" or "Bulk Paste List" above.</div>';
      return;
    }
    itemsTable.innerHTML = items.map((it,idx)=>`
      <div class="item-row" data-id="${it.id}">
        <div class="item-row-top">
          <div class="idx">${idx+1}</div>
          <div class="thumb-wrap">
            <div class="thumb" data-thumb="${it.id}">${it.hasImage ? '' : 'No image'}</div>
            <input type="file" accept="image/*" style="display:none" data-upload="${it.id}">
            <button class="thumb-btn" data-pick="${it.id}">${it.hasImage?'Replace':'Upload'}</button>
            ${it.hasImage ? `<button class="thumb-btn" data-remove="${it.id}" style="color:#c98a7a;">Remove</button>` : ''}
            <a class="thumb-link" href="${imageLinkFor(it)}" target="_blank" rel="noopener">Preview on Google ↗</a>
          </div>
          <div>
            <span class="field-label">Title</span>
            <input type="text" data-field="title" data-id="${it.id}" value="${escapeHtml(it.title)}">
            <span class="field-label" style="margin-top:6px;">Column</span>
            <select data-field="column" data-id="${it.id}" style="width:100%;">
              <option value="" ${!it.column?'selected':''}>— none —</option>
              <option value="B" ${it.column==='B'?'selected':''}>B</option>
              <option value="I" ${it.column==='I'?'selected':''}>I</option>
              <option value="N" ${it.column==='N'?'selected':''}>N</option>
              <option value="G" ${it.column==='G'?'selected':''}>G</option>
              <option value="O" ${it.column==='O'?'selected':''}>O</option>
            </select>
          </div>
          <div>
            <span class="field-label">Subtitle (optional)</span>
            <input type="text" data-field="subtitle" data-id="${it.id}" value="${escapeHtml(it.subtitle||'')}">
            <span class="field-label" style="margin-top:6px;">Born (optional)</span>
            <input type="text" data-field="subtitleBorn" data-id="${it.id}" value="${escapeHtml(it.subtitleBorn||'')}" placeholder="e.g. April 15, 1452">
            <span class="field-label" style="margin-top:6px;">Birthplace (optional)</span>
            <input type="text" data-field="subtitlePlace" data-id="${it.id}" value="${escapeHtml(it.subtitlePlace||'')}" placeholder="e.g. Vinci, Italy">
            <span class="field-label" style="margin-top:6px;">Died (optional)</span>
            <input type="text" data-field="subtitleDied" data-id="${it.id}" value="${escapeHtml(it.subtitleDied||'')}" placeholder="e.g. May 2, 1519">
            <span class="field-label" style="margin-top:6px;">Death Place (optional)</span>
            <input type="text" data-field="subtitleDiedPlace" data-id="${it.id}" value="${escapeHtml(it.subtitleDiedPlace||'')}" placeholder="e.g. Amboise, France">
            <span class="field-label" style="margin-top:6px;">Painted In (optional)</span>
            <input type="text" data-field="paintedPlace" data-id="${it.id}" value="${escapeHtml(it.paintedPlace||'')}" placeholder="e.g. Florence, Italy">
            <span class="field-label" style="margin-top:6px;">Currently Located (optional)</span>
            <input type="text" data-field="currentPlace" data-id="${it.id}" value="${escapeHtml(it.currentPlace||'')}" placeholder="e.g. Louvre, Paris, France">
          </div>
          <div class="row-actions">
            <button class="row-del" data-del="${it.id}">Delete</button>
          </div>
        </div>
        <div class="item-row-facts">
          <div>
            <span class="field-label fact-auction">💰 Auction &amp; Value</span>
            <textarea data-field="factAuction" data-id="${it.id}" rows="3" placeholder="Ever sold? For how much?">${escapeHtml(it.factAuction||'')}</textarea>
          </div>
          <div>
            <span class="field-label fact-period">🕰️ Time Period</span>
            <textarea data-field="factPeriod" data-id="${it.id}" rows="3" placeholder="When was it made?">${escapeHtml(it.factPeriod||'')}</textarea>
          </div>
          <div>
            <span class="field-label fact-unique">✨ Something Unique</span>
            <textarea data-field="factUnique" data-id="${it.id}" rows="3" placeholder="What's odd or interesting about it?">${escapeHtml(it.factUnique||'')}</textarea>
          </div>
        </div>
      </div>
    `).join('');

    // load thumbnails lazily
    items.forEach(async it=>{
      if(it.hasImage){
        const dataUrl = await getImageDataUrl(it);
        const box = itemsTable.querySelector(`[data-thumb="${it.id}"]`);
        if(box && dataUrl) box.innerHTML = `<img src="${dataUrl}" alt="">`;
      }
    });

    // wire field edits (debounced save)
    itemsTable.querySelectorAll('[data-field]').forEach(el=>{
      const handler = ()=>{
        const id = el.getAttribute('data-id');
        const field = el.getAttribute('data-field');
        const item = items.find(i=>i.id===id);
        if(!item) return;
        item[field] = el.value;
        clearTimeout(renderItemsTable._t);
        renderItemsTable._t = setTimeout(async ()=>{
          await saveItems();
          totalCount.textContent = items.length;
        }, 400);
      };
      el.addEventListener('input', handler);
      if(el.tagName === 'SELECT') el.addEventListener('change', handler);
    });

    itemsTable.querySelectorAll('[data-del]').forEach(btn=>{
      btn.addEventListener('click', async ()=>{
        const id = btn.getAttribute('data-del');
        if(!confirm('Delete this item?')) return;
        items = items.filter(i=>i.id!==id);
        await storeDelete(imgKey(activeSetId, id));
        imgCache.delete(id);
        await saveItems();
        renderItemsTable();
        totalCount.textContent = items.length;
        toast('Item deleted');
      });
    });

    itemsTable.querySelectorAll('[data-pick]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const id = btn.getAttribute('data-pick');
        itemsTable.querySelector(`[data-upload="${id}"]`).click();
      });
    });
    itemsTable.querySelectorAll('[data-upload]').forEach(input=>{
      input.addEventListener('change', async (e)=>{
        const id = input.getAttribute('data-upload');
        const file = e.target.files[0];
        if(!file) return;
        toast('Saving image…');
        try{
          const dataUrl = await resizeImageFile(file);
          const ok = await storeSet(imgKey(activeSetId, id), dataUrl);
          if(!ok){
            toast('Storage is full — could not save that image. Try removing some other images first.', 4500);
            return;
          }
          imgCache.set(id, dataUrl);
          const item = items.find(i=>i.id===id);
          if(item){ item.hasImage = true; item.imageUrl = ""; }
          await saveItems();
          renderItemsTable();
          toast('Image saved');
        }catch(err){ toast('Could not read that image file'); }
      });
    });
    itemsTable.querySelectorAll('[data-remove]').forEach(btn=>{
      btn.addEventListener('click', async ()=>{
        const id = btn.getAttribute('data-remove');
        await storeDelete(imgKey(activeSetId, id));
        imgCache.delete(id);
        const item = items.find(i=>i.id===id);
        if(item){ item.hasImage = false; item.imageUrl = ""; }
        await saveItems();
        renderItemsTable();
      });
    });
  }

  function resizeImageFile(file, maxDim, quality){
    maxDim = maxDim || 1000; quality = quality || 0.82;
    const hasAlpha = file.type === 'image/png' || file.type === 'image/webp';
    return new Promise((resolve,reject)=>{
      const reader = new FileReader();
      reader.onload = e=>{
        const img = new Image();
        img.onload = ()=>{
          let w=img.width, h=img.height;
          if(w>h && w>maxDim){ h=Math.round(h*maxDim/w); w=maxDim; }
          else if(h>=w && h>maxDim){ w=Math.round(w*maxDim/h); h=maxDim; }
          const canvas = document.createElement('canvas');
          canvas.width=w; canvas.height=h;
          canvas.getContext('2d').drawImage(img,0,0,w,h);
          resolve(hasAlpha ? canvas.toDataURL('image/png') : canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = ()=>reject(new Error('bad image'));
        img.src = e.target.result;
      };
      reader.onerror = ()=>reject(new Error('read failed'));
      reader.readAsDataURL(file);
    });
  }

  async function addItem(){
    items.push({ id: uid(), title:"New Item", subtitle:"", subtitleBorn:"", subtitlePlace:"", subtitleDied:"", subtitleDiedPlace:"", factAuction:"", factPeriod:"", factUnique:"", paintedPlace:"", currentPlace:"", column:"", hasImage:false });
    await saveItems();
    renderItemsTable();
    totalCount.textContent = items.length;
  }

  async function applyBulkPaste(){
    const lines = bulkTextarea.value.split('\n').map(l=>l.trim()).filter(Boolean);
    if(lines.length === 0){ toast('Paste at least one line first'); return; }
    if(items.length > 0 && !confirm(`This replaces all ${items.length} current item(s) in this topic with ${lines.length} new one(s). Continue?`)) return;
    items = lines.map(line=>{
      const parts = line.split('|').map(p=>p.trim());
      const colRaw = (parts[11]||'').toUpperCase();
      const column = ['B','I','N','G','O'].includes(colRaw) ? colRaw : '';
      return {
        id: uid(), title: parts[0]||'Untitled', subtitle: parts[1]||'',
        factAuction: parts[2]||'', factPeriod: parts[3]||'', factUnique: parts[4]||'',
        subtitleBorn: parts[5]||'', subtitlePlace: parts[6]||'', subtitleDied: parts[7]||'', subtitleDiedPlace: parts[8]||'',
        paintedPlace: parts[9]||'', currentPlace: parts[10]||'',
        column, hasImage:false
      };
    });
    await saveItems();
    renderItemsTable();
    totalCount.textContent = items.length;
    bulkPanel.classList.remove('show');
    bulkTextarea.value = '';
    toast(`Loaded ${items.length} items`);
  }

  async function applyBulkImages(fileList){
    const targets = items.filter(i=>!i.hasImage);
    if(targets.length === 0){ toast('Every item already has an image'); return; }
    const files = Array.from(fileList);
    const n = Math.min(files.length, targets.length);
    let savedCount = 0, failedCount = 0;
    for(let i=0;i<n;i++){
      toast(`Saving image ${i+1} of ${n}…`, 60000);
      try{
        const dataUrl = await resizeImageFile(files[i]);
        const ok = await storeSet(imgKey(activeSetId, targets[i].id), dataUrl);
        if(!ok){ failedCount++; continue; }
        imgCache.set(targets[i].id, dataUrl);
        targets[i].hasImage = true;
        savedCount++;
      }catch(e){ failedCount++; }
    }
    await saveItems();
    renderItemsTable();
    const extra = files.length>n ? `, ${files.length-n} file(s) unused` : '';
    const failedMsg = failedCount>0 ? ` — ${failedCount} failed to save (storage may be full)` : '';
    toast(`Added images to ${savedCount} item(s)${extra}${failedMsg}`, 4200);
  }

  async function createNewSet(){
    const name = prompt('Name this new topic (e.g. "Ocean Animals", "Vocabulary Unit 3"):');
    if(!name) return;
    const id = uid();
    sets.push({ id, name: name.trim() });
    await storeSet(META_KEY, JSON.stringify(sets));
    await storeSet(itemsKey(id), JSON.stringify([]));
    await switchToSet(id);
    toast('New topic created — add items below');
  }

  async function duplicateSet(){
    const src = sets.find(s=>s.id===activeSetId);
    if(!src) return;
    const id = uid();
    const newItems = items.map(it=>({ ...it, id: uid() }));
    sets.push({ id, name: src.name + ' (copy)' });
    await storeSet(META_KEY, JSON.stringify(sets));
    await storeSet(itemsKey(id), JSON.stringify(newItems));
    // copy images
    for(const oldIt of items){
      if(oldIt.hasImage){
        const dataUrl = await getImageDataUrl(oldIt);
        const newIt = newItems[items.indexOf(oldIt)];
        if(dataUrl && newIt) await storeSet(imgKey(id, newIt.id), dataUrl);
      }
    }
    await switchToSet(id);
    toast('Topic duplicated');
  }

  async function deleteSet(){
    if(sets.length <= 1){ toast("You need at least one topic set — can't delete the last one"); return; }
    const set = sets.find(s=>s.id===activeSetId);
    if(!confirm(`Delete "${set.name}" and all its items? This can't be undone.`)) return;
    for(const it of items){
      if(it.hasImage) await storeDelete(imgKey(activeSetId, it.id));
    }
    await storeDelete(itemsKey(activeSetId));
    await storeDelete(progressKey(activeSetId));
    sets = sets.filter(s=>s.id!==activeSetId);
    await storeSet(META_KEY, JSON.stringify(sets));
    await switchToSet(sets[0].id);
    toast('Topic deleted');
  }

  function openEditor(){
    editorView.classList.add('show');
    mainView.classList.add('hide');
    columnsWrap.classList.add('hide');
    renderItemsTable();
  }
  function closeEditor(){
    editorView.classList.remove('show');
    mainView.classList.remove('hide');
    columnsWrap.classList.remove('hide');
  }

  // ============================================================
  // Wire up events
  // ============================================================
  drawBtn.addEventListener('click', draw);
  backBtn.addEventListener('click', goBack);
  forwardBtn.addEventListener('click', goForward);
  resetBtn.addEventListener('click', ()=>resetGame(true));
  winnerBtn.addEventListener('click', openLeaderCardModal);
  document.addEventListener('keydown', (e)=>{
    if(editorView.classList.contains('show')){
      if(e.code === 'Escape'){ closeEditor(); }
      return;
    }
    if(e.code === 'Space' || e.code === 'Enter'){
      const active = document.activeElement;
      if(active && (active.tagName==='INPUT'||active.tagName==='TEXTAREA'||active.tagName==='BUTTON')) return;
      e.preventDefault(); draw();
    }
  });
  fsBtn.addEventListener('click', ()=>{
    if(!document.fullscreenElement) document.documentElement.requestFullscreen().catch(()=>{});
    else document.exitFullscreen().catch(()=>{});
  });

  setSwitcher.addEventListener('change', ()=>switchToSet(setSwitcher.value));
  editorSetSwitcher.addEventListener('change', ()=>switchToSet(editorSetSwitcher.value).then(renderItemsTable));

  setupBtn.addEventListener('click', openEditor);
  backToGameBtn.addEventListener('click', closeEditor);
  backToGameBtn2.addEventListener('click', closeEditor);

  setNameInput.addEventListener('input', ()=>{
    clearTimeout(setNameInput._t);
    setNameInput._t = setTimeout(async ()=>{
      const set = sets.find(s=>s.id===activeSetId);
      if(!set) return;
      set.name = setNameInput.value.trim() || 'Untitled Topic';
      await storeSet(META_KEY, JSON.stringify(sets));
      setTitle.textContent = set.name;
      populateSetSwitchers();
    }, 400);
  });

  newSetBtn.addEventListener('click', createNewSet);
  duplicateSetBtn.addEventListener('click', duplicateSet);
  deleteSetBtn.addEventListener('click', deleteSet);
  addItemBtn.addEventListener('click', addItem);

  bulkToggleBtn.addEventListener('click', ()=>bulkPanel.classList.toggle('show'));
  bulkCancelBtn.addEventListener('click', ()=>{ bulkPanel.classList.remove('show'); bulkTextarea.value=''; });
  bulkApplyBtn.addEventListener('click', applyBulkPaste);

  bulkImgBtn.addEventListener('click', ()=>bulkImgInput.click());
  bulkImgInput.addEventListener('change', (e)=>{
    if(e.target.files && e.target.files.length) applyBulkImages(e.target.files);
    bulkImgInput.value = '';
  });

  // ============================================================
  // Init
  // ============================================================
  (async function init(){
    await loadOrInitSets();
    populateSetSwitchers();
    await switchToSet(activeSetId);
    if(!storageOk){
      toast('Heads up: this browser is blocking saved storage, so work here will reset if you reload.', 5500);
    }
  })();
})();
