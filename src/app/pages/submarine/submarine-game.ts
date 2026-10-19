// Game rules and SVG artwork adapted from demo/submarine.html.
export function mountSubmarine(root:ShadowRoot): () => void {
  const controller = new AbortController();
  function listen(target:HTMLElement, event:string, handler:(event:Event)=>void):void {
    target.addEventListener(event, handler, {signal:controller.signal});
  }

  const N = 10;
  type Ship = {type:string; cells:number[]; hits:Set<number>; r0:number; c0:number; h:number; w:number};
  type Report = {round:number; shots:number[]; hits:Record<string,number>; miss:number; sunkNow:string[]};
  const COLS = "ABCDEFGHIJ";
  const TYPES = [
    {id:"plus", name:"十字潜艇", count:1, shapes:[[[0,1],[1,0],[1,1],[1,2],[2,1]]]},
    {id:"sq",   name:"2×2 潜艇", count:1, shapes:[[[0,0],[0,1],[1,0],[1,1]]]},
    {id:"l3",   name:"1×3 潜艇", count:2, shapes:[[[0,0],[0,1],[0,2]]]},
    {id:"l2",   name:"1×2 潜艇", count:3, shapes:[[[0,0],[0,1]]]},
    {id:"l1",   name:"1×1 潜艇", count:5, shapes:[[[0,0]]]}
  ];
  const DISPLAY = ["l1","l2","l3","sq","plus"];

  /* ---------- Cute submarine pictograms (SVG) ---------- */
  const COLORS = {l1:"#f7c948", l2:"#ff8a6b", l3:"#55c9a6", sq:"#7f9cf5", plus:"#c38df5"};
  const INK = "#1d3340";
  const ST  = `stroke="${INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"`;
  const ST3 = `stroke="${INK}" stroke-width="3" stroke-linecap="round"`;
  const GLASS = "#e9f8ff", BLUSH = "#ff7aa2";

  function hsub(L:number, col:string){
    const W = 100*L, tx = 14 + (W-24)*0.3;
    let s = `<svg viewBox="0 0 ${W} 100" xmlns="http://www.w3.org/2000/svg">`;
    s += `<path d="M${tx+16} 22 V9 H${tx+29}" fill="none" ${ST}/>`;
    s += `<rect x="${tx}" y="22" width="24" height="24" rx="7" fill="${col}" ${ST}/>`;
    s += `<ellipse cx="10" cy="61" rx="5" ry="13" fill="${col}" ${ST}/>`;
    s += `<rect x="14" y="38" width="${W-24}" height="46" rx="23" fill="${col}" ${ST}/>`;
    if(L > 1){
      const a = 36, b = W-64;
      for(let i=0; i<L; i++){ const x = a + (b-a)*i/(L-1); s += `<circle cx="${x}" cy="60" r="8" fill="${GLASS}" ${ST}/>`; }
    }
    s += `<ellipse cx="${W-42}" cy="69" rx="6" ry="3.5" fill="${BLUSH}" opacity=".6"/>`;
    s += `<circle cx="${W-28}" cy="55" r="4.5" fill="${INK}"/><circle cx="${W-26.5}" cy="53.5" r="1.4" fill="#fff"/>`;
    s += `<path d="M${W-35} 66 q6 6 12 0" fill="none" ${ST3}/>`;
    s += `<circle cx="${W-16}" cy="26" r="4" fill="none" ${ST3} opacity=".7"/><circle cx="${W-8}" cy="13" r="3" fill="none" ${ST3} opacity=".5"/>`;
    return s + "</svg>";
  }

  function sqsub(col:string){
    let s = `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">`;
    s += `<path d="M108 42 V22 H130" fill="none" ${ST}/>`;
    s += `<rect x="72" y="42" width="50" height="40" rx="13" fill="${col}" ${ST}/>`;
    s += `<ellipse cx="18" cy="120" rx="9" ry="24" fill="${col}" ${ST}/>`;
    s += `<ellipse cx="104" cy="122" rx="80" ry="58" fill="${col}" ${ST}/>`;
    s += `<circle cx="82" cy="112" r="17" fill="${GLASS}" ${ST}/><circle cx="132" cy="112" r="17" fill="${GLASS}" ${ST}/>`;
    s += `<circle cx="86" cy="114" r="7" fill="${INK}"/><circle cx="136" cy="114" r="7" fill="${INK}"/>`;
    s += `<circle cx="88.5" cy="111" r="2.2" fill="#fff"/><circle cx="138.5" cy="111" r="2.2" fill="#fff"/>`;
    s += `<ellipse cx="60" cy="142" rx="10" ry="6" fill="${BLUSH}" opacity=".6"/><ellipse cx="156" cy="142" rx="10" ry="6" fill="${BLUSH}" opacity=".6"/>`;
    s += `<path d="M94 144 q13 12 26 0" fill="none" ${ST}/>`;
    s += `<circle cx="170" cy="52" r="7" fill="none" ${ST3} opacity=".7"/><circle cx="186" cy="30" r="5" fill="none" ${ST3} opacity=".5"/>`;
    return s + "</svg>";
  }

  function plussub(col:string){
    let s = `<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">`;
    s += `<path d="M162 42 V20 H186" fill="none" ${ST}/>`;
    s += `<rect x="122" y="42" width="56" height="72" rx="18" fill="${col}" ${ST}/>`;
    s += `<circle cx="150" cy="72" r="9" fill="${GLASS}" ${ST3}/>`;
    s += `<rect x="120" y="186" width="60" height="72" rx="20" fill="${col}" ${ST}/>`;
    s += `<path d="M132 238 H168" ${ST}/>`;
    s += `<ellipse cx="36" cy="150" rx="10" ry="30" fill="${col}" ${ST}/>`;
    s += `<rect x="44" y="124" width="72" height="52" rx="20" fill="${col}" ${ST}/>`;
    s += `<rect x="184" y="124" width="80" height="52" rx="26" fill="${col}" ${ST}/>`;
    s += `<circle cx="244" cy="150" r="10" fill="#fff6bf" ${ST3}/>`;
    s += `<circle cx="150" cy="150" r="62" fill="${col}" ${ST}/>`;
    s += `<circle cx="128" cy="140" r="8" fill="${INK}"/><circle cx="172" cy="140" r="8" fill="${INK}"/>`;
    s += `<circle cx="131" cy="137" r="2.6" fill="#fff"/><circle cx="175" cy="137" r="2.6" fill="#fff"/>`;
    s += `<ellipse cx="112" cy="164" rx="10" ry="6" fill="${BLUSH}" opacity=".6"/><ellipse cx="188" cy="164" rx="10" ry="6" fill="${BLUSH}" opacity=".6"/>`;
    s += `<path d="M136 166 q14 13 28 0" fill="none" ${ST}/>`;
    s += `<circle cx="236" cy="74" r="8" fill="none" ${ST3} opacity=".7"/><circle cx="258" cy="46" r="5" fill="none" ${ST3} opacity=".5"/>`;
    return s + "</svg>";
  }

  const SVG: Record<string,string> = {
    l1: hsub(1, COLORS.l1), l2: hsub(2, COLORS.l2), l3: hsub(3, COLORS.l3),
    sq: sqsub(COLORS.sq), plus: plussub(COLORS.plus)
  };
  const TYPE = Object.fromEntries(TYPES.map(t=>[t.id,t]));

  let occ:number[][], ships:Ship[], fired:Map<number,number>, selected:Set<number>, marks:Map<number,string>, round:number, log:Report[], lastRound:Record<string,number>, over:boolean, mode:string, reveal:boolean;

  const $ = (id:string) => root.querySelector<HTMLElement>(`#${id}`)!;
  const button = (id:string) => $(id) as HTMLButtonElement;
  const boardEl = $("board");
  const cells:HTMLButtonElement[] = [];
  const rand = (n:number) => Math.floor(Math.random()*n);
  const keyName = (k:number) => COLS[k % N] + (Math.floor(k / N) + 1);

  function freeAround(o:number[][], r:number, c:number){
    for(let dr=-1; dr<=1; dr++) for(let dc=-1; dc<=1; dc++){
      const rr=r+dr, cc=c+dc;
      if(rr>=0 && rr<N && cc>=0 && cc<N && o[rr][cc] !== -1) return false;
    }
    return true;
  }

  function placeFleet(){
    for(let attempt=0; attempt<2000; attempt++){
      const o = Array.from({length:N}, ()=>Array(N).fill(-1));
      const list:Ship[] = [];
      let ok = true;
      for(const t of TYPES){
        for(let k=0; k<t.count && ok; k++){
          let placed = false;
          for(let tr=0; tr<400 && !placed; tr++){
            const sh = t.shapes[rand(t.shapes.length)];
            const h = Math.max(...sh.map(p=>p[0]))+1, w = Math.max(...sh.map(p=>p[1]))+1;
            const r0 = rand(N-h+1), c0 = rand(N-w+1);
            const cs = sh.map(([r,c])=>[r0+r, c0+c]);
            if(cs.every(([r,c])=>freeAround(o,r,c))){
              const idx = list.length;
              list.push({type:t.id, cells:cs.map(([r,c])=>r*N+c), hits:new Set(), r0, c0, h, w});
              cs.forEach(([r,c])=>{ o[r][c] = idx; });
              placed = true;
            }
          }
          if(!placed) ok = false;
        }
        if(!ok) break;
      }
      if(ok) return {o, list};
    }
    throw new Error("placement failed");
  }

  function shipAt(k:number){ return occ[Math.floor(k/N)][k%N]; }
  function isSunk(s:Ship){ return s.hits.size === s.cells.length; }
  function need(){ return Math.min(3, N*N - fired.size); }

  function buildBoard(){
    boardEl.innerHTML = "";
    boardEl.appendChild(document.createElement("div"));
    for(let c=0; c<N; c++){
      const l = document.createElement("div"); l.className="lbl"; l.textContent = COLS[c];
      boardEl.appendChild(l);
    }
    for(let r=0; r<N; r++){
      const l = document.createElement("div"); l.className="lbl"; l.textContent = String(r+1);
      boardEl.appendChild(l);
      for(let c=0; c<N; c++){
        const k = r*N+c;
        const b = document.createElement("button");
        b.className = "cell"; b.type = "button";
        b.setAttribute("aria-label", keyName(k));
        const rn = document.createElement("span"); rn.className="rn"; b.appendChild(rn);
        listen(b, "click", ()=>onCell(k, false));
        listen(b, "contextmenu", e=>{ e.preventDefault(); onCell(k, true); });
        boardEl.appendChild(b);
        cells[k] = b;
      }
    }
  }

  function cycleMark(k:number){
    const m = marks.get(k);
    if(!m) marks.set(k,"x");
    else if(m === "x") marks.set(k,"o");
    else marks.delete(k);
  }

  function onCell(k:number, forceMark:boolean){
    if(forceMark || mode === "mark"){ cycleMark(k); render(); return; }
    if(over || fired.has(k)) return;
    if(selected.has(k)) selected.delete(k);
    else if(selected.size < need()) selected.add(k);
    render();
  }

  function fire(){
    if(over || selected.size !== need() || selected.size === 0) return;
    round++;
    const hits:Record<string,number> = {}; let miss = 0; const sunkNow:string[] = [];
    const shots = [...selected].sort((a,b)=>a-b);
    for(const k of shots){
      fired.set(k, round);
      const idx = shipAt(k);
      if(idx >= 0){
        const s = ships[idx];
        s.hits.add(k);
        hits[s.type] = (hits[s.type]||0) + 1;
        if(isSunk(s)) sunkNow.push(s.type);
      } else miss++;
    }
    selected.clear();
    lastRound = hits;
    log.unshift({round, shots, hits, miss, sunkNow});
    if(ships.every(isSunk)) finish(true);
    render();
  }

  function finish(won:boolean){
    over = true;
    const shots = fired.size;
    const hitCount = ships.reduce((a,s)=>a+s.hits.size,0);
    const b = $("banner");
    const closeBtn = `<button class="close" type="button" aria-label="关闭提示">✕</button>`;
    b.innerHTML = closeBtn + (won
      ? `<strong>全部潜艇已击沉</strong>共 ${round} 轮、${shots} 枚炸弹，命中率 ${Math.round(hitCount/shots*100)}%。`
      : `<strong>答案已揭晓</strong>半透明的是没被击沉的潜艇。点「新游戏」再来一局。`);
    b.classList.add("show");
  }

  function shapeIcon(id:string){
    return `<span class="ico" aria-hidden="true">${SVG[id]}</span>`;
  }

  function drawSubs(){
    boardEl.querySelectorAll(".subpic").forEach(e=>e.remove());
    ships.forEach(s=>{
      const sunk = isSunk(s);
      if(!(over || (reveal && sunk))) return;
      const d = document.createElement("div");
      d.className = "subpic" + (over && !sunk ? " ghost" : "");
      d.style.gridRow = `${s.r0+2} / span ${s.h}`;
      d.style.gridColumn = `${s.c0+2} / span ${s.w}`;
      d.innerHTML = SVG[s.type];
      boardEl.appendChild(d);
    });
  }

  function render(){
    const n = need();
    cells.forEach((el,k)=>{
      const idx = shipAt(k);
      const f = fired.has(k);
      let cls = "cell";
      if(selected.has(k)) cls += " sel";
      if(f){
        cls += " fired";
        if(reveal || over){
          cls += idx >= 0 ? " hit" : " miss";
          if(idx >= 0 && isSunk(ships[idx])) cls += " sunk";
        }
      } else if(over && idx >= 0) cls += " ship";
      el.className = cls;
      const m = marks.get(k);
      if(m) el.dataset["mark"] = m; else delete el.dataset["mark"];
      el.firstChild!.textContent = f ? String(fired.get(k)) : "";
    });
    drawSubs();

    $("roundLbl").textContent = over ? "已结束" : `第 ${round+1} 轮`;
    $("pickedLbl").textContent = String(selected.size);
    $("needLbl").textContent = String(n);
    button("fireBtn").disabled = over || selected.size !== n || n === 0;
    button("giveUpBtn").disabled = over;
    $("curRoundLbl").textContent = round ? `第 ${round} 轮` : "尚未投弹";

    const tb = $("statBody"); tb.innerHTML = "";
    for(const id of DISPLAY){
      const t = TYPE[id];
      const mine = ships.filter(s=>s.type===id);
      const total = mine.reduce((a,s)=>a+s.cells.length,0);
      const got = mine.reduce((a,s)=>a+s.hits.size,0);
      const sunk = mine.filter(isSunk).length;
      const now = lastRound[id] || 0;
      const tr = document.createElement("tr");
      tr.innerHTML = `<td><span class="tname">${shapeIcon(id)}${t.name} ×${t.count}</span></td>
        <td class="${now?"now":""}">${now || "–"}</td>
        <td>${got} / ${total}</td>
        <td>${sunk} / ${t.count}</td>`;
      tb.appendChild(tr);
    }
    const allCells = ships.reduce((a,s)=>a+s.cells.length,0);
    const hitCells = ships.reduce((a,s)=>a+s.hits.size,0);
    $("totals").textContent = `已投 ${fired.size} 枚，命中 ${hitCells} 次；潜艇共 ${allCells} 格，还剩 ${allCells-hitCells} 格。`;

    $("histCount").textContent = log.length ? `共 ${log.length} 轮` : "";
    const ul = $("log"); ul.innerHTML = "";
    if(!log.length){
      ul.innerHTML = '<li class="empty">还没有投弹。在海域里选 3 个格子，然后点「投弹」。</li>';
    }
    for(const e of log){
      const parts = DISPLAY.filter(id=>e.hits[id]).map(id=>`${TYPE[id].name} ×${e.hits[id]}`);
      if(e.miss) parts.push(`落空 ×${e.miss}`);
      const li = document.createElement("li");
      let html = `<span class="head"><span class="rnd">第 ${e.round} 轮</span><span class="coords">${e.shots.map(keyName).join("  ")}</span></span><span class="res">${parts.join("，")}</span>`;
      if(e.sunkNow.length) html += `<span class="res sunkmsg">击沉：${e.sunkNow.map(id=>TYPE[id].name).join("、")}</span>`;
      li.innerHTML = html;
      ul.appendChild(li);
    }
  }

  function newGame(){
    const p = placeFleet();
    occ = p.o; ships = p.list;
    fired = new Map(); selected = new Set(); marks = new Map();
    round = 0; log = []; lastRound = {}; over = false;
    $("banner").classList.remove("show");
    resetGiveUp();
    render();
  }

  function setMode(m:string){
    mode = m;
    $("modeFire").setAttribute("aria-pressed", String(m==="fire"));
    $("modeMark").setAttribute("aria-pressed", String(m==="mark"));
  }

  let giveUpTimer:ReturnType<typeof setTimeout> | undefined;
  function resetGiveUp(){
    clearTimeout(giveUpTimer);
    $("giveUpBtn").textContent = "揭晓答案";
    $("giveUpBtn").dataset["armed"] = "";
  }

  listen($("banner"), "click", e=>{
    if((e.target as HTMLElement).closest(".close")) $("banner").classList.remove("show");
  });
  listen($("fireBtn"), "click", fire);
  listen($("clearSelBtn"), "click", ()=>{ selected.clear(); render(); });
  listen($("clearMarkBtn"), "click", ()=>{ marks.clear(); render(); });
  listen($("newBtn"), "click", newGame);
  listen($("modeFire"), "click", ()=>setMode("fire"));
  listen($("modeMark"), "click", ()=>setMode("mark"));
  listen($("revealChk"), "change", e=>{ reveal = (e.target as HTMLInputElement).checked; render(); });
  listen($("giveUpBtn"), "click", ()=>{
    const b = $("giveUpBtn");
    if(b.dataset["armed"]){ resetGiveUp(); selected.clear(); finish(false); render(); return; }
    b.dataset["armed"] = "1"; b.textContent = "再点一次确认";
    giveUpTimer = setTimeout(resetGiveUp, 3000);
  });

  reveal = false;
  setMode("fire");
  buildBoard();
  newGame();

  return () => { controller.abort(); clearTimeout(giveUpTimer); };
}
