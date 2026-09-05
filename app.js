(function(){
  const BINGO_CARD_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 120" style="height:1.6em;width:auto;vertical-align:middle"><rect x="1" y="1" width="98" height="118" rx="3" fill="white" stroke="#bbb" stroke-width="2"/><text x="50" y="26" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="22" fill="black">BINGO</text><rect x="7" y="32" width="15" height="15" fill="#b0b0b0"/><rect x="25" y="32" width="15" height="15" fill="#b0b0b0"/><rect x="43" y="32" width="15" height="15" fill="#b0b0b0"/><rect x="61" y="32" width="15" height="15" fill="#b0b0b0"/><rect x="79" y="32" width="15" height="15" fill="#b0b0b0"/><rect x="7" y="50" width="15" height="15" fill="#b0b0b0"/><rect x="25" y="50" width="15" height="15" fill="#b0b0b0"/><rect x="43" y="50" width="15" height="15" fill="#b0b0b0"/><rect x="61" y="50" width="15" height="15" fill="#b0b0b0"/><rect x="79" y="50" width="15" height="15" fill="#b0b0b0"/><rect x="7" y="68" width="15" height="15" fill="#b0b0b0"/><rect x="25" y="68" width="15" height="15" fill="#b0b0b0"/><rect x="43" y="68" width="15" height="15" fill="#b0b0b0"/><rect x="61" y="68" width="15" height="15" fill="#b0b0b0"/><rect x="79" y="68" width="15" height="15" fill="#b0b0b0"/><rect x="7" y="86" width="15" height="15" fill="#b0b0b0"/><rect x="25" y="86" width="15" height="15" fill="#b0b0b0"/><rect x="43" y="86" width="15" height="15" fill="#b0b0b0"/><rect x="61" y="86" width="15" height="15" fill="#b0b0b0"/><rect x="79" y="86" width="15" height="15" fill="#b0b0b0"/><rect x="7" y="104" width="15" height="15" fill="#b0b0b0"/><rect x="25" y="104" width="15" height="15" fill="#b0b0b0"/><rect x="43" y="104" width="15" height="15" fill="#b0b0b0"/><rect x="61" y="104" width="15" height="15" fill="#b0b0b0"/><rect x="79" y="104" width="15" height="15" fill="#b0b0b0"/></svg>`;

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
  const leadingBtn = $('#leadingBtn');
  const winnersBtn = $('#winnersBtn');
  const timelineBtn = $('#timelineBtn');
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
      const mediumText = (window.SEED_MEDIUM && window.SEED_MEDIUM[key]) || "";
      return {
        id: uid(), title:t, subtitle:a,
        subtitleBorn: born||"", subtitlePlace: place||"", subtitleDied: died||"", subtitleDiedPlace: diedPlace||"",
        factAuction: fAuction||"", factPeriod: fPeriod||"", factUnique: fUnique||"",
        paintedPlace: "", currentPlace: "",
        column: col||"", hasImage: !!imageUrl, imageUrl, dateText, mediumText
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
      if(!it.mediumText && window.SEED_MEDIUM && window.SEED_MEDIUM[key]){
        it.mediumText = window.SEED_MEDIUM[key];
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
      ? `<div class="placeholder">
           <div class="game-title">
             <div class="game-title-top">ART HISTORY</div>
             <div class="game-title-bingo">
               <span class="gt-b">B</span><span class="gt-i">I</span><span class="gt-n">N</span><span class="gt-g">G</span><span class="gt-o">O</span>
             </div>
           </div>
           <div class="placeholder-hint">Press "Draw" to begin</div>
         </div>`
      : '<div class="placeholder"><div class="placeholder-hint">This topic has no items yet — open Setup to add some.</div></div>';
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

      // leaders = non-winning cards only, so the leading btn never shows winners
      const winningNums = new Set(winners.map(w=>w.cardNum));
      const nonWinners = perCardBest.filter(r=>!winningNums.has(r.cardNum));
      let leaderInfo = { leaders:[], leaderCard:null, leaderLineIdx:null, leaderCount:0 };
      if(nonWinners.length > 0){
        const maxNW = Math.max(...nonWinners.map(r=>r.count));
        const leaders = nonWinners.filter(r=>r.count===maxNW).sort((a,b)=>a.cardNum-b.cardNum);
        leaderInfo = { leaders, leaderCard: leaders[0].cardNum, leaderLineIdx: leaders[0].lineIdx, leaderCount: maxNW };
      }
      return { mode:'winning', winners, ...leaderInfo };
    }

    const maxCount = Math.max(...perCardBest.map(r=>r.count));
    const leaders = perCardBest.filter(r=>r.count===maxCount).sort((a,b)=>a.cardNum-b.cardNum);
    return { mode:'leading', leaders, leaderCard: leaders[0].cardNum, leaderLineIdx: leaders[0].lineIdx, leaderCount: maxCount };
  }

  function spawnWinnerStars(){
    const rect = winnersBtn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const count = 18 + Math.floor(Math.random() * 9);
    for(let i = 0; i < count; i++){
      const star = document.createElement('span');
      star.className = 'winner-star';
      star.textContent = '★';
      const angle = 250 + (Math.random() - 0.5) * 40;
      const rad = angle * Math.PI / 180;
      const dist = 165 + Math.random() * 120;
      const dx = Math.cos(rad) * dist;
      const dy = Math.sin(rad) * dist;
      const perpRad = rad + Math.PI / 2;
      const curve = (Math.random() < 0.5 ? 1 : -1) * (8 + Math.random() * 12);
      const mx = dx * 0.5 + Math.cos(perpRad) * curve;
      const my = dy * 0.5 + Math.sin(perpRad) * curve;
      const spin = (Math.random() < 0.5 ? 1 : -1) * (300 + Math.random() * 300);
      star.style.left = (cx - 5) + 'px';
      star.style.top  = (cy - 5) + 'px';
      star.style.setProperty('--dx', dx + 'px');
      star.style.setProperty('--dy', dy + 'px');
      star.style.setProperty('--mx', mx + 'px');
      star.style.setProperty('--my', my + 'px');
      star.style.setProperty('--spin', spin + 'deg');
      star.style.animationDelay = (i / count * 1000 + Math.random() * 40) + 'ms';
      document.body.appendChild(star);
      star.addEventListener('animationend', ()=> star.remove());
    }
  }

  function renderBingoWinner(){
    const prevWinCount = (lastBingoStatus && lastBingoStatus.winners) ? lastBingoStatus.winners.length : 0;
    const status = computeBingoStatus();
    lastBingoStatus = status;
    leadingBtn.classList.remove('leading');
    winnersBtn.classList.remove('winning');
    leadingBtn.disabled = true;
    winnersBtn.disabled = true;
    leadingBtn.textContent = 'Leading';
    winnersBtn.textContent = '🏆';

    if(status.mode === 'unavailable'){
      leadingBtn.title = winnersBtn.title = 'Only available for the default Famous Artwork set';
      return;
    }
    if(status.mode === 'empty'){
      leadingBtn.title = 'Leading card — no calls yet';
      winnersBtn.title = 'Winner — no calls yet';
      return;
    }

    // Leading btn: always show who's in front once a card has 2+ in its best line
    if(status.leaderCount >= 2){
      const n = status.leaders.length;
      leadingBtn.disabled = false;
      leadingBtn.textContent = `Leading ${n}`;
      leadingBtn.title = n===1
        ? `Card ${status.leaderCard} has ${status.leaderCount}/5 in its best line (${lineLabelFor(status.leaderLineIdx)}). Click to view the card.`
        : `${n} cards are tied for the lead with ${status.leaderCount}/5. Click to browse all ${n}.`;
    } else {
      leadingBtn.title = 'Leading card — not enough calls yet';
    }

    if(status.mode === 'winning'){
      const nums = status.winners.map(w=>w.cardNum);
      if(nums.length > prevWinCount) spawnWinnerStars();
      winnersBtn.disabled = false;
      winnersBtn.classList.add('winning');
      winnersBtn.textContent = `🏆 ${nums.length}`;
      winnersBtn.title = nums.length===1
        ? `BINGO! Click to view card ${nums[0]} and see the winning line.`
        : `BINGO! ${nums.length} cards won at once: ${nums.join(', ')}. Click to browse them.`;
    } else {
      winnersBtn.title = 'Winner — no BINGO yet';
    }
  }

  function openLeaderCardModal(forceMode){
    if(!lastBingoStatus) return;
    const mode = forceMode || lastBingoStatus.mode;
    let candidates, isWin;
    if(mode === 'winning'){
      candidates = lastBingoStatus.winners;
      isWin = true;
    } else if(mode === 'leading'){
      candidates = lastBingoStatus.leaders;
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
        <button class="modal-close" aria-label="Close">×</button>
        <div class="bingo-strip">
          <div class="bingo-strip-letter col-b">B</div>
          <div class="bingo-strip-letter col-i">I</div>
          <div class="bingo-strip-letter col-n">N</div>
          <div class="bingo-strip-letter col-g">G</div>
          <div class="bingo-strip-letter col-o">O</div>
        </div>
        <div class="card-grid" id="cmGrid"></div>
        <div class="card-modal-bottom">
          <button class="cm-nav-btn" id="cmPrevBtn" title="Previous card">‹</button>
          <span class="card-modal-status" id="cmStatus"></span>
          <button class="cm-nav-btn" id="cmNextBtn" title="Next card">›</button>
        </div>
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

      backdrop.querySelector('#cmGrid').innerHTML = cells.map(cellHtml).join('');
      const statusEl = backdrop.querySelector('#cmStatus');
      statusEl.textContent = statusText;
      statusEl.classList.toggle('win', isWin);

      const prevBtn = backdrop.querySelector('#cmPrevBtn');
      const nextBtn = backdrop.querySelector('#cmNextBtn');
      const show = candidates.length > 1;
      prevBtn.style.visibility = show ? '' : 'hidden';
      nextBtn.style.visibility = show ? '' : 'hidden';

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
      const banner = `<div class="win-tile-banner letter-${letter.toLowerCase()}">${letter}</div>`;
      if(c.free){
        return `<div class="win-tile free-tile">${banner}<div class="win-tile-free-label">FREE</div></div>`;
      }
      const thumbAttr = c.item ? ` data-win-thumb="${c.item.id}"` : '';
      return `<div class="win-tile">
        ${banner}
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
  function artistBlockHtml(item, immediateBadge, showBadge, showPaletteIcon){
    const badge = (showBadge === false) ? '' : letterBadgeHtml(item, immediateBadge);
    const icon = showPaletteIcon && item.subtitle ? '<span class="artist-palette-icon">🎨</span>' : '';
    const subtitleHtml = item.subtitle ? `<div class="art-subtitle">${icon}${escapeHtml(item.subtitle)}</div>` : '';
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
    if(item.factPeriod) blocks.push(`<div class="fact-block"><div class="fact-label"><svg class="clock-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="9" stroke="#111" stroke-width="1.4"/><line x1="10" y1="1.5" x2="10" y2="2.9" stroke="#111" stroke-width="1.2" stroke-linecap="round"/><line x1="14.25" y1="2.64" x2="13.6" y2="3.77" stroke="#111" stroke-width="1" stroke-linecap="round"/><line x1="17.36" y1="5.75" x2="16.24" y2="6.4" stroke="#111" stroke-width="1" stroke-linecap="round"/><line x1="18.5" y1="10" x2="17.1" y2="10" stroke="#111" stroke-width="1.2" stroke-linecap="round"/><line x1="17.36" y1="14.25" x2="16.24" y2="13.6" stroke="#111" stroke-width="1" stroke-linecap="round"/><line x1="14.25" y1="17.36" x2="13.6" y2="16.23" stroke="#111" stroke-width="1" stroke-linecap="round"/><line x1="10" y1="18.5" x2="10" y2="17.1" stroke="#111" stroke-width="1.2" stroke-linecap="round"/><line x1="5.75" y1="17.36" x2="6.4" y2="16.23" stroke="#111" stroke-width="1" stroke-linecap="round"/><line x1="2.64" y1="14.25" x2="3.76" y2="13.6" stroke="#111" stroke-width="1" stroke-linecap="round"/><line x1="1.5" y1="10" x2="2.9" y2="10" stroke="#111" stroke-width="1.2" stroke-linecap="round"/><line x1="2.64" y1="5.75" x2="3.76" y2="6.4" stroke="#111" stroke-width="1" stroke-linecap="round"/><line x1="5.75" y1="2.64" x2="6.4" y2="3.77" stroke="#111" stroke-width="1" stroke-linecap="round"/><line x1="10" y1="10" x2="10" y2="4.5" stroke="#111" stroke-width="1.7" stroke-linecap="round"/><line x1="10" y1="10" x2="13.5" y2="12" stroke="#111" stroke-width="1.4" stroke-linecap="round"/></svg> Time Period</div><div class="fact-text">${escapeHtml(item.factPeriod)}</div></div>`);
    if(item.factUnique) blocks.push(`<div class="fact-block"><div class="fact-label"><span style="color:#cc2222">★</span> Something Unique</div><div class="fact-text">${escapeHtml(item.factUnique)}</div></div>`);
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
          ${(()=>{const col=(item.column||'').trim().toUpperCase();return ['B','I','N','G','O'].includes(col)?`<div class="draw-col-banner letter-${col.toLowerCase()}">${col}</div>`:''})()}
          <div class="draw-index">Draw ${drawNum} of ${items.length}</div>
          <div class="art-title">${escapeHtml(item.title)}</div>
          ${(item.dateText || item.mediumText) ? `<div class="art-date">${item.dateText ? escapeHtml(item.dateText) : ''}${item.dateText && item.mediumText ? ' <span class="art-date-dot">·</span> ' : ''}${item.mediumText ? escapeHtml(item.mediumText) : ''}</div>` : ''}
          ${artistBlockHtml(item, false, false, true)}
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
      const medium = item.mediumText ? escapeHtml(item.mediumText) : '';
      const yearPart = year ? `<span class="lightbox-year">${escapeHtml(year)}</span>` : '';
      const dotSep = (artist && year) ? `<span class="lightbox-dot">·</span>` : '';
      const dotTitle = artist ? `<span class="lightbox-dot">·</span>` : '';
      const dotMedium = ((year || artist) && medium) ? `<span class="lightbox-dot">·</span>` : '';
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
              ${dotTitle}
              ${artist ? `<span class="lightbox-artist">${artist}</span>` : ''}
              ${dotSep}${yearPart}
              ${dotMedium}${medium ? `<span class="lightbox-medium">${medium}</span>` : ''}
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
    const colClass = col => col ? `col-${col.toLowerCase()}` : '';
    const buildRow = (it, idx) => {
      const col = (it.column||'').trim().toUpperCase();
      const colBadge = ['B','I','N','G','O'].includes(col)
        ? `<span class="acc-col ${colClass(col)}">${col}</span>` : '';
      return `
      <div class="item-row" data-id="${it.id}">
        <button class="acc-header" data-toggle="${it.id}">
          <span class="acc-num">${idx+1}</span>
          <span class="acc-title" data-acc-title="${it.id}">${escapeHtml(it.title)||'Untitled'}</span>
          <span class="acc-sub" data-acc-sub="${it.id}">${escapeHtml(it.subtitle||'')}</span>
          ${colBadge}
          <span class="acc-arrow">▶</span>
        </button>
        <div class="acc-body" data-body="${it.id}">
          <div class="item-row-top">
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
              <span class="field-label fact-period"><svg class="clock-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="9" stroke="#111" stroke-width="1.4"/><line x1="10" y1="1.5" x2="10" y2="2.9" stroke="#111" stroke-width="1.2" stroke-linecap="round"/><line x1="14.25" y1="2.64" x2="13.6" y2="3.77" stroke="#111" stroke-width="1" stroke-linecap="round"/><line x1="17.36" y1="5.75" x2="16.24" y2="6.4" stroke="#111" stroke-width="1" stroke-linecap="round"/><line x1="18.5" y1="10" x2="17.1" y2="10" stroke="#111" stroke-width="1.2" stroke-linecap="round"/><line x1="17.36" y1="14.25" x2="16.24" y2="13.6" stroke="#111" stroke-width="1" stroke-linecap="round"/><line x1="14.25" y1="17.36" x2="13.6" y2="16.23" stroke="#111" stroke-width="1" stroke-linecap="round"/><line x1="10" y1="18.5" x2="10" y2="17.1" stroke="#111" stroke-width="1.2" stroke-linecap="round"/><line x1="5.75" y1="17.36" x2="6.4" y2="16.23" stroke="#111" stroke-width="1" stroke-linecap="round"/><line x1="2.64" y1="14.25" x2="3.76" y2="13.6" stroke="#111" stroke-width="1" stroke-linecap="round"/><line x1="1.5" y1="10" x2="2.9" y2="10" stroke="#111" stroke-width="1.2" stroke-linecap="round"/><line x1="2.64" y1="5.75" x2="3.76" y2="6.4" stroke="#111" stroke-width="1" stroke-linecap="round"/><line x1="5.75" y1="2.64" x2="6.4" y2="3.77" stroke="#111" stroke-width="1" stroke-linecap="round"/><line x1="10" y1="10" x2="10" y2="4.5" stroke="#111" stroke-width="1.7" stroke-linecap="round"/><line x1="10" y1="10" x2="13.5" y2="12" stroke="#111" stroke-width="1.4" stroke-linecap="round"/></svg> Time Period</span>
              <textarea data-field="factPeriod" data-id="${it.id}" rows="3" placeholder="When was it made?">${escapeHtml(it.factPeriod||'')}</textarea>
            </div>
            <div>
              <span class="field-label fact-unique"><span style="color:#cc2222">★</span> Something Unique</span>
              <textarea data-field="factUnique" data-id="${it.id}" rows="3" placeholder="What's odd or interesting about it?">${escapeHtml(it.factUnique||'')}</textarea>
            </div>
          </div>
        </div>
      </div>`;
    };
    const half = Math.ceil(items.length / 2);
    const leftRows  = items.slice(0, half).map((it, idx) => buildRow(it, idx)).join('');
    const rightRows = items.slice(half).map((it, idx) => buildRow(it, half + idx)).join('');
    itemsTable.innerHTML = `<div class="items-col">${leftRows}</div><div class="items-col">${rightRows}</div>`;

    // Accordion toggle
    itemsTable.querySelectorAll('[data-toggle]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const id = btn.getAttribute('data-toggle');
        const body = itemsTable.querySelector(`[data-body="${id}"]`);
        const arrow = btn.querySelector('.acc-arrow');
        const isOpen = body.classList.contains('open');
        body.classList.toggle('open', !isOpen);
        arrow.classList.toggle('open', !isOpen);
      });
    });

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
        if(field === 'title'){
          const accTitle = itemsTable.querySelector(`[data-acc-title="${id}"]`);
          if(accTitle) accTitle.textContent = el.value || 'Untitled';
        }
        if(field === 'subtitle'){
          const accSub = itemsTable.querySelector(`[data-acc-sub="${id}"]`);
          if(accSub) accSub.textContent = el.value;
        }
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
  // Art History Timeline
  // ============================================================
  // artworks: array of { key: "Title||Artist" (matches SEED_IMAGES), label: "Short display text" }
  const TIMELINE_DATA = [
    {
      date: "c. 40,000 BCE",
      name: "Prehistoric Art",
      desc: "Cave paintings, hand stencils, and carved figurines — the earliest known human art. Found in sites like Lascaux (France) and Altamira (Spain), these images reveal ritual and symbolic thinking.",
      characteristics: "Cave painting, fertility goddesses, megalithic structures",
      chiefArtists: "Lascaux Cave Painting, Woman of Willendorf, Stonehenge",
      historicalEvents: "Ice Age ends (10,000 BCE–8,000 BCE); New Stone Age and first permanent settlements (8000 BCE–2500 BCE)",
      artworks: []
    },
    {
      date: "c. 3100–30 BCE",
      name: "Ancient Egyptian Art",
      desc: "Governed by strict canon laws over nearly three millennia. Figures shown in composite view, hieroglyphic integration, and monumental sculpture served religious and funerary purposes.",
      characteristics: "Art with an afterlife focus: pyramids and tomb painting",
      chiefArtists: "Imhotep, Step Pyramid, Great Pyramids, Bust of Nefertiti",
      historicalEvents: "Narmer unites Upper/Lower Egypt (3100 BCE); Rameses II battles the Hittites (1274 BCE); Cleopatra dies (30 BCE)",
      artworks: []
    },
    {
      date: "c. 800–31 BCE",
      name: "Classical Greek Art",
      desc: "Idealized the human form through sculpture and pottery. Developed contrapposto and principles of harmony and proportion that have defined Western art ever since.",
      characteristics: "Greek idealism: balance, perfect proportions; architectural orders (Doric, Ionic, Corinthian)",
      chiefArtists: "Parthenon, Myron, Phidias, Polykleitos, Praxiteles; statues of Kritios Boy, Discobolus, Laocoön and His Sons, Venus de Milo",
      historicalEvents: "Athens defeats Persia at Marathon (490 BCE); Peloponnesian Wars (431 BCE–404 BCE); Alexander the Great's conquests (336 BCE–323 BCE)",
      artworks: []
    },
    {
      date: "c. 27 BCE–476 CE",
      name: "Roman Art",
      desc: "Absorbed Greek influence and added portraiture, civic propaganda, and narrative relief sculpture. Monumental architecture expressed imperial power.",
      characteristics: "Roman realism: practical and down-to-earth; the arch",
      chiefArtists: "Augustus of Primaporta, Colosseum, Pantheon, Trajan's Column",
      historicalEvents: "Julius Caesar assassinated (44 BCE); Augustus proclaimed Emperor (27 BCE); Diocletian splits Empire (CE 292); Rome falls (CE 476)",
      artworks: []
    },
    {
      date: "c. 330–1453",
      name: "Byzantine Art",
      desc: "Centered in Constantinople. Gold-ground mosaics, elongated holy figures, and rigid iconographic conventions served the Orthodox Church — spiritual rather than naturalistic.",
      characteristics: "Heavenly Byzantine mosaics; Islamic architecture and amazing mazelike design",
      chiefArtists: "Hagia Sophia, Andrei Rublev, Mosque of Cordoba, the Alhambra",
      historicalEvents: "Justinian partly restores Western Roman Empire (CE 533–562); Iconoclasm Controversy (CE 726–843); Birth of Islam (CE 610) and Muslim Conquests (CE 632–732)",
      artworks: []
    },
    {
      date: "c. 1000–1400",
      name: "Romanesque & Gothic",
      desc: "Romanesque heavy stone churches gave way to Gothic soaring cathedrals with pointed arches and flying buttresses. Illuminated manuscripts and stained glass conveyed scripture to largely illiterate congregations.",
      characteristics: "Celtic art, Carolingian Renaissance, Romanesque, Gothic",
      chiefArtists: "St. Sernin, Durham Cathedral, Notre Dame, Chartres; Cimabue, Duccio, Giotto",
      historicalEvents: "Viking raids (793–1066); Battle of Hastings (1066); Crusades I–IV (1095–1204); Black Death (1347–1351); Hundred Years War (1337–1453)",
      artworks: []
    },
    {
      date: "c. 1300–1494",
      name: "Early Renaissance",
      desc: "Florentine artists rediscovered classical antiquity and introduced linear perspective. Giotto, Masaccio, Donatello, and Botticelli transformed painting from devotional symbol to observed reality.",
      characteristics: "Rebirth of classical culture",
      chiefArtists: "Ghiberti's Doors, Brunelleschi, Donatello, Botticelli, da Vinci, Raphael, Michelangelo",
      historicalEvents: "Gutenberg invents movable type (1447); Turks conquer Constantinople (1453); Columbus lands in New World (1492); Martin Luther starts Reformation (1517)",
      artworks: [
        { key: "The Birth of Venus||Sandro Botticelli", label: "The Birth of Venus — Botticelli, c. 1485" }
      ]
    },
    {
      date: "c. 1430–1580",
      name: "Northern Renaissance",
      desc: "Flemish and German painters — Van Eyck, Dürer, Bosch — developed extraordinary detail through oil paint, more interested in everyday life, moralizing allegory, and the strange than their Italian counterparts.",
      characteristics: "The Renaissance spreads northward to France, the Low Countries, Poland, Germany, and England",
      chiefArtists: "Bellini, Giorgione, Titian, Dürer, Bruegel, Bosch, Jan van Eyck, Rogier van der Weyden",
      historicalEvents: "Council of Trent and Counter Reformation (1545–1563); Copernicus proves the earth revolves around the sun (1543)",
      artworks: [
        { key: "The Arnolfini Portrait||Jan van Eyck", label: "The Arnolfini Portrait — Jan van Eyck, 1434" },
        { key: "Young Hare||Albrecht Dürer", label: "Young Hare — Albrecht Dürer, 1502" },
        { key: "The Garden of Earthly Delights||Hieronymus Bosch", label: "The Garden of Earthly Delights — Bosch, c. 1490–1510" }
      ]
    },
    {
      date: "c. 1490–1527",
      name: "High Renaissance",
      desc: "Leonardo, Michelangelo, and Raphael achieved harmony, technical mastery, and monumental grandeur. Centered in Florence, Rome, and the papal court — the peak of Renaissance idealism.",
      characteristics: "Rebirth of classical culture — peak Renaissance achievement: harmony, grandeur, technical mastery",
      chiefArtists: "Leonardo da Vinci, Michelangelo, Raphael; Mona Lisa, Sistine Chapel Ceiling, School of Athens",
      historicalEvents: "Gutenberg invents movable type (1447); Turks conquer Constantinople (1453); Columbus lands in New World (1492); Martin Luther starts Reformation (1517)",
      artworks: [
        { key: "Lady with an Ermine||Leonardo da Vinci", label: "Lady with an Ermine — Leonardo, c. 1489" },
        { key: "The Last Supper||Leonardo da Vinci", label: "The Last Supper — Leonardo, 1495–1498" },
        { key: "Mona Lisa||Leonardo da Vinci", label: "Mona Lisa — Leonardo, 1503–1517" },
        { key: "Salvator Mundi||Leonardo da Vinci", label: "Salvator Mundi — Leonardo, c. 1500" },
        { key: "The Sistine Chapel Ceiling||Michelangelo", label: "Sistine Chapel Ceiling — Michelangelo, 1508–1512" },
        { key: "The Creation of Adam||Michelangelo", label: "The Creation of Adam — Michelangelo, 1512" },
        { key: "The School of Athens||Raphael", label: "The School of Athens — Raphael, 1509–1511" },
        { key: "Madonna della Seggiola||Raphael", label: "Madonna della Seggiola — Raphael, c. 1513" }
      ]
    },
    {
      date: "c. 1520–1600",
      name: "Mannerism",
      desc: "A reaction against High Renaissance harmony. Elongated figures, contorted poses, acidic colors, and compressed pictorial space created a sophisticated, deliberately artificial style. Key figures: Pontormo, Bronzino, El Greco.",
      characteristics: "Art that breaks the rules; artifice over nature",
      chiefArtists: "Tintoretto, El Greco, Pontormo, Bronzino, Sofonisba Anguissola, Lavinia Fontana",
      historicalEvents: "Magellan circumnavigates the globe (1520–1522)",
      artworks: []
    },
    {
      date: "c. 1600–1750",
      name: "Baroque",
      desc: "Drama, movement, and emotional intensity in service of the Counter-Reformation and absolute monarchies. Caravaggio's tenebrism, Rubens's swirling figures, and Velázquez's royal portraits defined the era.",
      characteristics: "Splendor and flourish for God; art as a weapon in the religious wars",
      chiefArtists: "Rubens, Rembrandt, Hals, Caravaggio, Artemisia Gentileschi, Elisabetta Sirani, Judith Leyster, Velázquez, Palace of Versailles",
      historicalEvents: "Thirty Years War between Catholics and Protestants (1618–1648)",
      artworks: [
        { key: "Deposition of Christ||Caravaggio", label: "Deposition of Christ — Caravaggio, 1602–1604" },
        { key: "Las Meninas||Diego Velázquez", label: "Las Meninas — Velázquez, 1656" },
        { key: "The Night Watch||Rembrandt", label: "The Night Watch — Rembrandt, 1642" }
      ]
    },
    {
      date: "c. 1650–1680",
      name: "Dutch Golden Age",
      desc: "Merchant-class patrons funded portraiture, still life, landscape, and genre scenes. Vermeer, Rembrandt, and Hals brought intimate realism and psychological depth to everyday subjects.",
      characteristics: "Intimate realism, domestic genre scenes, still life, precise rendering of light and shadow, bourgeois subjects",
      chiefArtists: "Vermeer, Rembrandt, Frans Hals; Girl with a Pearl Earring, The Milkmaid, The Night Watch",
      historicalEvents: "Dutch Republic at height of global trade; founding of Dutch East India Company (1602); Tulip Mania (1630s)",
      artworks: [
        { key: "Girl with a Pearl Earring||Johannes Vermeer", label: "Girl with a Pearl Earring — Vermeer, c. 1665" },
        { key: "The Milkmaid||Johannes Vermeer", label: "The Milkmaid — Vermeer, c. 1657" }
      ]
    },
    {
      date: "c. 1700–1780",
      name: "Rococo",
      desc: "Playful, ornate, and pastel-toned — a shift from Baroque grandeur to intimate decoration. Fragonard, Watteau, and Boucher painted aristocratic leisure for France's pre-Revolutionary elite.",
      characteristics: "Pastel colors, ornate decoration, playful scenes, intimate scale, feathery brushwork, curved forms",
      chiefArtists: "Watteau, Fragonard, Boucher, Tiepolo; The Swing, Pilgrimage to Cythera, Madame de Pompadour",
      historicalEvents: "French Enlightenment and salon culture; American Revolution (1775–1783); Seven Years War (1756–1763)",
      artworks: []
    },
    {
      date: "c. 1750–1850",
      name: "Neoclassicism",
      desc: "A sober return to Greco-Roman ideals, spurred by Enlightenment rationalism and the discovery of Pompeii. David's heroic history paintings championed civic virtue over Rococo frivolity.",
      characteristics: "Art that recaptures Greco-Roman grace and grandeur",
      chiefArtists: "David, Ingres, Joshua Reynolds, Angelica Kaufmann, Élisabeth Vigée Le Brun, Labille-Guiard, Canova, Houdon",
      historicalEvents: "Enlightenment (18th century); Industrial Revolution (1760–1850)",
      artworks: [
        { key: "Napoleon Crossing the Alps||Jacques-Louis David", label: "Napoleon Crossing the Alps — David, c. 1801" }
      ]
    },
    {
      date: "c. 1780–1850",
      name: "Romanticism",
      desc: "Emotion, nature, and the sublime over reason. Delacroix, Géricault, Turner, and Caspar David Friedrich explored crisis, catastrophe, nationalism, and the overwhelming power of the natural world.",
      characteristics: "The triumph of imagination and individuality",
      chiefArtists: "Caspar Friedrich, Géricault, Delacroix, Turner, William Blake, Henry Fuseli, Goya",
      historicalEvents: "American Revolution (1775–1783); French Revolution (1789–1799); Napoleon crowned emperor of France (1803)",
      artworks: [
        { key: "The Ancient of Days||William Blake", label: "The Ancient of Days — William Blake, 1794" },
        { key: "The Raft of the Medusa||Théodore Géricault", label: "The Raft of the Medusa — Géricault, 1818–1819" },
        { key: "Liberty Leading the People||Eugène Delacroix", label: "Liberty Leading the People — Delacroix, 1830" },
        { key: "Looking Down Yosemite Valley||Albert Bierstadt", label: "Looking Down Yosemite Valley — Bierstadt, 1865" }
      ]
    },
    {
      date: "c. 1840–1880",
      name: "Realism",
      desc: "Rejected idealization in favor of honest depiction of ordinary working people. Courbet, Millet, Homer, and Whistler insisted art address the present, not mythologized antiquity.",
      characteristics: "Celebrating working class and peasants; en plein air rustic painting",
      chiefArtists: "Corot, Courbet, Daumier, Bonheur, Millet, Cole, Durand, Bierstadt, Catlin, Homer, Eakins, Rossetti, Millais, Dewing, Tarbell, Benson, Sloan, Luks",
      historicalEvents: "European democratic revolutions of 1848; Westward expansion of the United States, California Gold Rush of 1849",
      artworks: [
        { key: "The Gleaners||Jean-François Millet", label: "The Gleaners — Millet, 1857" },
        { key: "The Angelus||Jean-François Millet", label: "The Angelus — Millet, 1857–1859" },
        { key: "Breezing Up||Winslow Homer", label: "Breezing Up — Winslow Homer, 1876" },
        { key: "Whistler's Mother||James McNeill Whistler", label: "Whistler's Mother — Whistler, 1871" },
        { key: "Birds of America||John James Audubon", label: "Birds of America — Audubon, 1827–1838" }
      ]
    },
    {
      date: "c. 1603–1868",
      name: "Ukiyo-e",
      desc: "Japanese woodblock prints from the Edo period captured the \"floating world\" of urban pleasure and nature. Hokusai and Hiroshige profoundly influenced Impressionism and Art Nouveau.",
      characteristics: "Woodblock prints, bold outlines, flat color, scenes of kabuki, landscapes, and courtesans in the floating world",
      chiefArtists: "Hokusai, Hiroshige, Utamaro; The Great Wave, Thirty-Six Views of Mount Fuji, One Hundred Famous Views of Edo",
      historicalEvents: "Edo period isolation policy (sakoku); Meiji Restoration (1868) opens Japan to the West",
      artworks: [
        { key: "The Great Wave off Kanagawa||Katsushika Hokusai", label: "The Great Wave off Kanagawa — Hokusai, c. 1831" }
      ]
    },
    {
      date: "c. 1860–1900",
      name: "Impressionism",
      desc: "Parisian painters captured fleeting light and atmosphere through loose, rapid brushwork. Working outdoors and rejecting academic finish, Monet, Renoir, Degas, and Cassatt shook the French Salon establishment.",
      characteristics: "Capturing fleeting effects of natural light",
      chiefArtists: "Monet, Manet, Renoir, Pissarro, Cassatt, Morisot, Degas, Chase, Hassam, Frieseke, Peterson",
      historicalEvents: "Franco-Prussian War (1870–1871); Unification of Germany (1871)",
      artworks: [
        { key: "Impression, Sunrise||Claude Monet", label: "Impression, Sunrise — Monet, 1872" },
        { key: "Bal du Moulin de la Galette||Pierre-Auguste Renoir", label: "Bal du Moulin de la Galette — Renoir, 1876" },
        { key: "The Skiff||Pierre-Auguste Renoir", label: "The Skiff — Renoir, 1875" },
        { key: "The Dance Class||Edgar Degas", label: "The Dance Class — Degas, 1874" },
        { key: "Luncheon of the Boating Party||Pierre-Auguste Renoir", label: "Luncheon of the Boating Party — Renoir, 1880–1881" },
        { key: "Woman with a Parasol — Madame Monet and Her Son||Claude Monet", label: "Woman with a Parasol — Monet, 1875" },
        { key: "Mother and Child||Mary Cassatt", label: "Mother and Child — Mary Cassatt, c. 1900" },
        { key: "Flowers in a Crystal Vase||Édouard Manet", label: "Flowers in a Crystal Vase — Manet, 1882" },
        { key: "Water Lilies, Giverny #4||Claude Monet", label: "Water Lilies — Monet, c. 1904–1907" }
      ]
    },
    {
      date: "c. 1880–1910",
      name: "Symbolism",
      desc: "Reacted against Realism by turning inward — toward dreams, myth, and the unconscious. Moreau, Redon, and Munch used symbolic imagery to express psychological and metaphysical states.",
      characteristics: "Dream imagery, psychological states, myth and allegory, rich decorative surfaces, spiritual and occult themes",
      chiefArtists: "Gustave Moreau, Odilon Redon, Edvard Munch, Henri Rousseau; The Scream, The Sleeping Gypsy",
      historicalEvents: "Rise of psychoanalysis (Freud's Interpretation of Dreams, 1899); Decadent literary movement in France and England",
      artworks: [
        { key: "The Sleeping Gypsy||Henri Rousseau", label: "The Sleeping Gypsy — Henri Rousseau, 1897" },
        { key: "The Scream||Edvard Munch", label: "The Scream — Edvard Munch, 1895" }
      ]
    },
    {
      date: "c. 1886–1910",
      name: "Post-Impressionism",
      desc: "Diverse responses to Impressionism — Cézanne's geometric structure, Seurat's pointillism, Gauguin's primitivism, and Van Gogh's swirling emotional intensity each pushed painting in a new direction.",
      characteristics: "A soft revolt against Impressionism",
      chiefArtists: "Van Gogh, Gauguin, Cézanne, Seurat, Ensor, Toulouse-Lautrec, Rodin",
      historicalEvents: "Belle Époque (late 19th-century Golden Age); Japan defeats Russia (1905)",
      artworks: [
        { key: "Still Life with Skull||Paul Cézanne", label: "Still Life with Skull — Cézanne, c. 1896" },
        { key: "Card Players||Paul Cézanne", label: "Card Players — Cézanne, 1891–1892" },
        { key: "A Sunday Afternoon on the Island of La Grande Jatte||Georges Seurat", label: "A Sunday Afternoon — Seurat, 1884–1886" },
        { key: "The Painter of Sunflowers||Paul Gauguin", label: "The Painter of Sunflowers — Gauguin, 1888" },
        { key: "Nafeaffaa Ipolpo (When Will You Marry)||Paul Gauguin", label: "When Will You Marry — Gauguin, 1892" },
        { key: "Café Terrace at Night||Vincent Van Gogh", label: "Café Terrace at Night — Van Gogh, 1888" },
        { key: "Vase with Twelve Sunflowers||Vincent Van Gogh", label: "Sunflowers — Van Gogh, 1888" },
        { key: "Irises||Vincent Van Gogh", label: "Irises — Van Gogh, 1889" },
        { key: "The Starry Night||Vincent Van Gogh", label: "The Starry Night — Van Gogh, 1889" },
        { key: "Almond Blossom||Vincent Van Gogh", label: "Almond Blossom — Van Gogh, 1890" },
        { key: "Self-Portrait||Vincent Van Gogh", label: "Self-Portrait — Van Gogh, 1887" }
      ]
    },
    {
      date: "c. 1890–1914",
      name: "Art Nouveau & Vienna Secession",
      desc: "Organic, curving forms derived from nature transformed architecture, illustration, and decorative arts across Europe. Klimt merged fine and applied arts in a sensuous, gold-laden style.",
      characteristics: "Organic curving lines, floral motifs, gold leaf, decorative unity of fine and applied arts, sinuous female forms",
      chiefArtists: "Gustav Klimt, Alphonse Mucha, Antoni Gaudí, Charles Rennie Mackintosh; The Kiss, Judith, Sagrada Família",
      historicalEvents: "Belle Époque in Europe; Vienna Secession founded (1897); Art Nouveau showcased at Paris Exposition (1900)",
      artworks: [
        { key: "The Kiss||Gustav Klimt", label: "The Kiss — Gustav Klimt, 1907–1908" }
      ]
    },
    {
      date: "c. 1905–1910",
      name: "Fauvism",
      desc: "Matisse, Derain, and Vlaminck shocked Paris with pure, non-naturalistic color used for expressive ends. The name means \"wild beasts\" — a critic's insult that stuck.",
      characteristics: "Harsh colors and flat surfaces",
      chiefArtists: "Matisse, Derain, Kirchner, Kandinsky, Gabriel Münter, Franz Marc, Käthe Kollwitz, Gustav Klimt, Egon Schiele",
      historicalEvents: "Boxer Rebellion in China (1900); World War I (1914–1918)",
      artworks: []
    },
    {
      date: "c. 1905–1930",
      name: "Expressionism",
      desc: "German and Austrian artists — Kirchner, Kandinsky, Schiele — distorted form and color to externalize inner emotional states. The two main groups were Die Brücke and Der Blaue Reiter.",
      characteristics: "Emotion distorting form",
      chiefArtists: "Kirchner, Kandinsky, Gabriel Münter, Franz Marc, Käthe Kollwitz, Egon Schiele",
      historicalEvents: "World War I (1914–1918)",
      artworks: [
        { key: "Composition VII||Wassily Kandinsky", label: "Composition VII — Kandinsky, 1913" },
        { key: "Composition 8||Wassily Kandinsky", label: "Composition 8 — Kandinsky, 1923" }
      ]
    },
    {
      date: "c. 1907–1925",
      name: "Cubism",
      desc: "Picasso and Braque shattered the single viewpoint, presenting multiple perspectives simultaneously. Analytic Cubism broke objects into facets; Synthetic Cubism introduced collage. It changed the course of modern art.",
      characteristics: "Pre- and Post-World War I art experiments: new forms to express modern life",
      chiefArtists: "Picasso, Braque, Leger, Boccioni, Severini, Malevich, Tatlin, Gabo, Mondrian, O'Keeffe, Demuth, Sheeler, Douglas, Johnson, Savage",
      historicalEvents: "Russian Revolution (1917); American women franchised (1920)",
      artworks: [
        { key: "Les Demoiselles d'Avignon||Pablo Picasso", label: "Les Demoiselles d'Avignon — Picasso, 1907" },
        { key: "Violin and Candlestick||Georges Braque", label: "Violin and Candlestick — Braque, 1910" },
        { key: "Three Musicians||Pablo Picasso", label: "Three Musicians — Picasso, 1921" },
        { key: "Portrait of Dora Maar||Pablo Picasso", label: "Portrait of Dora Maar — Picasso, 1937" }
      ]
    },
    {
      date: "c. 1909–1944",
      name: "Futurism",
      desc: "Italian movement celebrating speed, technology, and industry. Boccioni, Balla, and Severini used fractured form and dynamic lines to render motion — embracing modernity and rejecting the weight of history.",
      characteristics: "Pre- and Post-World War I art experiments: dynamic forms expressing speed and modern life",
      chiefArtists: "Boccioni, Severini, Malevich, Tatlin, Gabo; Dynamism of a Soccer Player, Abstract Speed + Sound",
      historicalEvents: "Russian Revolution (1917); American women franchised (1920)",
      artworks: []
    },
    {
      date: "c. 1916–1924",
      name: "Dada",
      desc: "Born in wartime Zurich, Dada rejected reason and convention in deliberate nonsense, collage, and readymades. Duchamp's urinal as sculpture challenged the very definition of art.",
      characteristics: "Mock art; painting dreams and exploring the unconscious",
      chiefArtists: "Duchamp, Dalí, Ernst, Magritte, Miro, Kahlo, Frank Lloyd Wright, Le Corbusier",
      historicalEvents: "Disillusionment after World War I; Great Depression (1929–1938); World War II (1939–1945) and Nazi horrors; atomic bombs dropped on Japan (1945)",
      artworks: []
    },
    {
      date: "c. 1917–1944",
      name: "De Stijl / Art Deco",
      desc: "Mondrian reduced painting to pure primary colors and right-angle grids. Simultaneously, Art Deco blended modernist geometry with luxury and glamour across architecture, fashion, and the decorative arts.",
      characteristics: "Primary colors and right-angle grids (De Stijl); geometric luxury, glamour, and streamlined forms (Art Deco)",
      chiefArtists: "Piet Mondrian, Theo van Doesburg, Tamara de Lempicka; Broadway Boogie Woogie, Tableau I",
      historicalEvents: "Bauhaus school founded (1919); Roaring Twenties prosperity; Russian Constructivism; Wall Street Crash (1929)",
      artworks: [
        { key: "Tableau I||Piet Mondrian", label: "Tableau I — Mondrian, c. 1921" },
        { key: "Broadway Boogie Woogie||Piet Mondrian", label: "Broadway Boogie Woogie — Mondrian, 1942–1943" },
        { key: "Self-Portrait in the Green Bugatti||Tamara de Lempicka", label: "Self-Portrait in Green Bugatti — de Lempicka, 1929" }
      ]
    },
    {
      date: "c. 1920–1960s",
      name: "Surrealism",
      desc: "André Breton's movement harnessed Freudian dream imagery and the unconscious. Dalí, Magritte, Kahlo, and Ernst created disquieting juxtapositions that bypassed rational thought.",
      characteristics: "Mock art; painting dreams and exploring the unconscious",
      chiefArtists: "Duchamp, Dalí, Ernst, Magritte, Miro, Kahlo, Frank Lloyd Wright, Le Corbusier",
      historicalEvents: "Disillusionment after World War I; Great Depression (1929–1938); World War II (1939–1945) and Nazi horrors; atomic bombs dropped on Japan (1945)",
      artworks: [
        { key: "The Persistence of Memory||Salvador Dalí", label: "The Persistence of Memory — Dalí, 1931" },
        { key: "The Son of Man||René Magritte", label: "The Son of Man — Magritte, 1964" },
        { key: "Self-Portrait with Thorn Necklace and Hummingbird||Frida Kahlo", label: "Self-Portrait with Thorn Necklace — Kahlo, 1940" },
        { key: "Guernica||Pablo Picasso", label: "Guernica — Picasso, 1937" },
        { key: "The Flower Carrier||Diego Rivera", label: "The Flower Carrier — Rivera, 1935" }
      ]
    },
    {
      date: "c. 1930–1950",
      name: "American Regionalism & Social Realism",
      desc: "During the Depression, Grant Wood, Edward Hopper, and Andrew Wyeth depicted rural and urban American life with unsentimental realism — a deliberate turn from European abstraction.",
      characteristics: "Rural and urban American scenes, unsentimental realism, narrative clarity, social critique and documentary impulse",
      chiefArtists: "Grant Wood, Edward Hopper, Andrew Wyeth; American Gothic, Nighthawks, Christina's World",
      historicalEvents: "Great Depression (1929–1939); WPA Federal Art Project employs thousands of artists; World War II (1939–1945)",
      artworks: [
        { key: "American Gothic||Grant Wood", label: "American Gothic — Grant Wood, 1930" },
        { key: "Nighthawks||Edward Hopper", label: "Nighthawks — Edward Hopper, 1942" },
        { key: "Christina's World||Andrew Wyeth", label: "Christina's World — Andrew Wyeth, 1948" }
      ]
    },
    {
      date: "c. 1943–1965",
      name: "Abstract Expressionism",
      desc: "New York became the new center of Western art. Pollock's drip paintings, Rothko's luminous color fields, and de Kooning's gestural brushwork foregrounded the act of painting itself as subject matter.",
      characteristics: "Post-World War II: pure abstraction and expression without form",
      chiefArtists: "Gorky, Pollock, Krasner, de Kooning, Rothko, Warhol, Close, Lichtenstein, Joseph Beuys, Yoko Ono, Carolee Schneemann",
      historicalEvents: "Cold War and Vietnam War (U.S. enters 1965); U.S.S.R. suppresses Hungarian revolt (1956) and Czechoslovakian revolt (1968)",
      artworks: [
        { key: "Convergence||Jackson Pollock", label: "Convergence — Jackson Pollock, 1952" },
        { key: "Interchange||Willem de Kooning", label: "Interchange — de Kooning, 1955" }
      ]
    },
    {
      date: "c. 1950s–1970s",
      name: "Pop Art",
      desc: "Warhol, Lichtenstein, and Hockney drew on commercial imagery — advertising, comics, consumer goods — to celebrate and critique mass culture. Blurred the line between fine art and popular media.",
      characteristics: "Popular art absorbs consumerism",
      chiefArtists: "Warhol, Close, Lichtenstein, Joseph Beuys, Yoko Ono, Carolee Schneemann",
      historicalEvents: "Cold War and Vietnam War (U.S. enters 1965); U.S.S.R. suppresses Hungarian revolt (1956) and Czechoslovakian revolt (1968)",
      artworks: [
        { key: "Shot Sage Blue Marilyn||Andy Warhol", label: "Shot Sage Blue Marilyn — Warhol, 1964" }
      ]
    },
    {
      date: "c. 1960s–1970s",
      name: "Minimalism & Conceptualism",
      desc: "Minimalism stripped art to geometric form and industrial material. Conceptualism argued the idea itself was the artwork — documentation, performance, and language replaced traditional media.",
      characteristics: "Art without a center and reworking and mixing past styles",
      chiefArtists: "Gerhard Richter, Cindy Sherman, Anselm Kiefer, Frank Gehry, Zaha Hadid, Judy Chicago, Smithson, Christo and Jeanne-Claude, ORLAN, James Turrell, Anish Kapoor, Olafur Eliasson",
      historicalEvents: "Nuclear freeze movement; Cold War fizzles; Communism collapses in Eastern Europe and U.S.S.R. (1989–1991)",
      artworks: []
    },
    {
      date: "c. 1980s–present",
      name: "Contemporary & Street Art",
      desc: "Art today is radically pluralistic — digital media, installation, performance, and global perspectives. Street art brought visual culture off gallery walls and into public space.",
      characteristics: "Art without a center and reworking and mixing past styles",
      chiefArtists: "Gerhard Richter, Cindy Sherman, Anselm Kiefer, Frank Gehry, Zaha Hadid, Judy Chicago, Smithson, Christo and Jeanne-Claude, James Turrell, Anish Kapoor, Olafur Eliasson",
      historicalEvents: "Iraq wars, climate change, rise of populism and autocracies",
      artworks: [
        { key: "Untitled, 1982||Jean-Michel Basquiat", label: "Untitled, 1982 — Jean-Michel Basquiat" },
        { key: "The Girl with a Balloon||Banksy", label: "Girl with a Balloon — Banksy, 2006" }
      ]
    }
  ];

  function findEraByPeriodText(periodText){
    if(!periodText) return -1;
    const lower = periodText.toLowerCase();
    let bestIdx = -1, bestLen = 0;
    TIMELINE_DATA.forEach((era, i) => {
      // Match the primary part of the era name (before " & " or " / ")
      const coreName = era.name.split(/\s+[&\/]\s+/)[0].toLowerCase();
      if(coreName.length > 3 && lower.includes(coreName) && coreName.length > bestLen){
        bestLen = coreName.length;
        bestIdx = i;
      }
    });
    return bestIdx;
  }

  const ERA_COLORS = ['#2d4a7a','#6b7c35','#8b3a22','#c4892a','#4a6a8a','#5a6535'];

  function openTimeline(){
    const currentItem = viewIndex >= 0 ? called[viewIndex] : null;
    const currentKey = currentItem ? (currentItem.title + '||' + currentItem.subtitle) : null;
    let matchIdx = currentKey
      ? TIMELINE_DATA.findIndex(era => era.artworks.some(a => a.key === currentKey))
      : -1;
    if(matchIdx < 0 && currentItem && currentItem.factPeriod){
      matchIdx = findEraByPeriodText(currentItem.factPeriod);
    }

    const backdrop = document.createElement('div');
    backdrop.className = 'timeline-backdrop';

    const cardsHtml = TIMELINE_DATA.map((era, i) => {
      const color = ERA_COLORS[i % ERA_COLORS.length];
      const char = era.characteristics || era.desc || '';
      const artists = era.chiefArtists || '';
      const events = era.historicalEvents || '';
      return `<div class="tl-card" data-card-idx="${i}" style="--era-color:${color}">
        <div class="tl-card-banner">
          <div class="tl-card-label">ART PERIOD / MOVEMENT</div>
          <div class="tl-card-name">${escapeHtml(era.name)}</div>
          <div class="tl-card-date">${escapeHtml(era.date)}</div>
        </div>
        <div class="tl-card-body">
          ${char ? `<div class="tl-card-section">
            <div class="tl-card-section-label">CHARACTERISTICS</div>
            <div class="tl-card-section-text">${escapeHtml(char)}</div>
          </div>` : ''}
          ${artists ? `<div class="tl-card-section">
            <div class="tl-card-section-label">CHIEF ARTISTS AND MAJOR WORKS</div>
            <div class="tl-card-section-text">${escapeHtml(artists)}</div>
          </div>` : ''}
          ${events ? `<div class="tl-card-section">
            <div class="tl-card-section-label">HISTORICAL EVENTS</div>
            <div class="tl-card-section-text">${escapeHtml(events)}</div>
          </div>` : ''}
        </div>
      </div>`;
    }).join('');

    backdrop.innerHTML = `
      <div class="timeline-modal">
        <div class="timeline-header">
          <div style="width:32px;flex-shrink:0;"></div>
          <div class="timeline-header-text">
            <div class="timeline-header-title">Art History Timeline</div>
            <div class="timeline-header-sub">Prehistoric to Contemporary</div>
          </div>
          <button class="tl-toggle-btn" id="tlToggleBtn" title="Focus on active card">Focus Mode</button>
          <button class="timeline-close" aria-label="Close">×</button>
        </div>
        <div class="tl-cards-container">${cardsHtml}</div>
      </div>`;

    backdrop.addEventListener('click', e=>{ if(e.target===backdrop) backdrop.remove(); });
    backdrop.querySelector('.timeline-close').addEventListener('click', ()=>backdrop.remove());

    const toggleBtn = backdrop.querySelector('#tlToggleBtn');
    toggleBtn.addEventListener('click', ()=>{
      const isFocus = container.classList.toggle('tl-focus-mode');
      toggleBtn.textContent = isFocus ? 'Show All' : 'Focus Mode';
      toggleBtn.classList.toggle('tl-toggle-btn--active', isFocus);
    });
    document.addEventListener('keydown', function escTimeline(e){
      if(e.code==='Escape'){ backdrop.remove(); document.removeEventListener('keydown', escTimeline); }
    });
    document.body.appendChild(backdrop);

    const container = backdrop.querySelector('.tl-cards-container');

    function updateActiveCard(){
      const cRect = container.getBoundingClientRect();
      const centerX = cRect.left + cRect.width / 2;
      let bestCard = null, bestDist = Infinity;
      container.querySelectorAll('.tl-card').forEach(card => {
        const r = card.getBoundingClientRect();
        const dist = Math.abs((r.left + r.width / 2) - centerX);
        if(dist < bestDist){ bestDist = dist; bestCard = card; }
      });
      container.querySelectorAll('.tl-card').forEach(card => {
        card.classList.toggle('tl-card--active', card === bestCard);
      });
    }

    function slowScrollTo(targetLeft, durationMs, onDone){
      const startLeft = container.scrollLeft;
      const dist = targetLeft - startLeft;
      if(Math.abs(dist) < 2){ if(onDone) onDone(); return; }
      const start = performance.now();
      function step(now){
        if(!backdrop.isConnected) return;
        const t = Math.min(1, (now - start) / durationMs);
        // 3-phase: 4s ease-in → 4s fast travel → 4s ease-out (12s total)
        // T1=1/3, T2=2/3; position pivots at 0.25 and 0.75
        let ease;
        if(t <= 1/3){
          const u = t * 3;
          ease = 0.25 * u * u;
        } else if(t <= 2/3){
          ease = 0.25 + 0.5 * (t - 1/3) * 3;
        } else {
          const u = (t - 2/3) * 3;
          ease = 0.75 + 0.25 * (2*u - u*u);
        }
        container.scrollLeft = startLeft + dist * ease;
        if(t < 1) requestAnimationFrame(step);
        else { container.scrollLeft = targetLeft; if(onDone) onDone(); }
      }
      requestAnimationFrame(step);
    }

    function cardCenter(card){
      return card.offsetLeft + card.offsetWidth / 2 - container.offsetWidth / 2;
    }

    // click a faded card to slow-scroll it into center
    container.addEventListener('click', e => {
      const card = e.target.closest('.tl-card');
      if(card && !card.classList.contains('tl-card--active')){
        slowScrollTo(Math.max(0, cardCenter(card)), 1440);
      }
    });

    container.addEventListener('scroll', updateActiveCard, {passive:true});
    updateActiveCard();

    // on open: slow cinematic pan from start to matched era (or first card)
    const targetIdx = matchIdx >= 0 ? matchIdx : 0;
    const targetCard = container.children[targetIdx];
    if(targetCard){
      container.scrollLeft = 0;
      updateActiveCard();
      // duration scales with distance: ~600ms per card traversed, minimum 3s
      const panDuration = 12000;
      setTimeout(()=>{
        if(!backdrop.isConnected) return;
        slowScrollTo(Math.max(0, cardCenter(targetCard)), panDuration, ()=>{
          container.classList.add('tl-focus-mode');
          const tb = backdrop.querySelector('#tlToggleBtn');
          if(tb){ tb.textContent = 'Show All'; tb.classList.add('tl-toggle-btn--active'); }
        });
      }, 600); // wait for modal entrance animation to settle
    }
  }

  // ============================================================
  // Wire up events
  // ============================================================
  drawBtn.addEventListener('click', draw);
  backBtn.addEventListener('click', goBack);
  forwardBtn.addEventListener('click', goForward);
  resetBtn.addEventListener('click', ()=>resetGame(true));
  leadingBtn.addEventListener('click', ()=>openLeaderCardModal('leading'));
  winnersBtn.addEventListener('click', ()=>openLeaderCardModal('winning'));
  timelineBtn.addEventListener('click', openTimeline);
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
