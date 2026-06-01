/* ============================================================
   SS FASHION POINT — Tweaks panel
   ============================================================ */
(function(){
  'use strict';
  const root = document.documentElement;

  const PALETTES = {
    leather:{label:'Leather',swatch:['#8a5a34','#f2eee5','#16130f'],vars:{'--accent':'#8a5a34','--accent-2':'#6b4527','--accent-soft':'#ece0d2'}},
    espresso:{label:'Espresso',swatch:['#6e4830','#f2eee5','#16130f'],vars:{'--accent':'#6e4830','--accent-2':'#523323','--accent-soft':'#e8ddcf'}},
    cocoa:{label:'Cocoa',swatch:['#835a3c','#f2eee5','#16130f'],vars:{'--accent':'#835a3c','--accent-2':'#623f28','--accent-soft':'#ecddca'}},
    chestnut:{label:'Chestnut',swatch:['#9a5230','#f2eee5','#16130f'],vars:{'--accent':'#9a5230','--accent-2':'#763c20','--accent-soft':'#f0ddcd'}},
    mocha:{label:'Mocha',swatch:['#6d5a48','#f2eee5','#16130f'],vars:{'--accent':'#6d5a48','--accent-2':'#503f2f','--accent-soft':'#e6ddce'}},
    walnut:{label:'Walnut',swatch:['#4f3826','#f2eee5','#16130f'],vars:{'--accent':'#4f3826','--accent-2':'#38271a','--accent-soft':'#e3d5c4'}}
  };

  let state = {mood:'leather',energy:50,edge:'soft'};
  try{ const s=JSON.parse(localStorage.getItem('ssfp-tweaks')||'null'); if(s) Object.assign(state,s); }catch(e){}

  function save(){ try{ localStorage.setItem('ssfp-tweaks',JSON.stringify(state)); }catch(e){} }

  function applyMood(id){
    const p=PALETTES[id]||PALETTES.leather;
    for(const k in p.vars) root.style.setProperty(k,p.vars[k]);
  }
  function applyEnergy(e){
    e=Math.max(0,Math.min(100,+e));
    root.style.setProperty('--motion',(1.8-1.35*(e/100)).toFixed(3));
    root.style.setProperty('--grain-op',(0.03+0.06*(e/100)).toFixed(3));
  }
  function applyEdge(v){ document.body.dataset.edge=v; }
  function applyAll(){ applyMood(state.mood); applyEnergy(state.energy); applyEdge(state.edge); }

  /* build panel */
  const panel=document.createElement('div');
  panel.className='twk-panel';
  panel.innerHTML=`
    <div class="twk-hd" id="twkDrag"><b><i></i>Tweaks</b><button class="twk-x" id="twkClose" aria-label="Close">✕</button></div>
    <div class="twk-body">
      <div class="twk-sect">Mood<span class="hint">Swap the whole colour identity</span></div>
      <div class="twk-chips" id="twkMood"></div>
      <div class="twk-sect">Energy<span class="hint">Pace of the marquees &amp; motion</span></div>
      <input type="range" class="twk-slider" id="twkEnergy" min="0" max="100" step="1">
      <div class="twk-scale"><span>Calm · premium</span><span>Hyped · street</span></div>
      <div class="twk-sect">Edge<span class="hint">Corner language across the store</span></div>
      <div class="twk-seg" id="twkEdge">
        <button data-v="sharp">Sharp</button>
        <button data-v="soft">Soft</button>
        <button data-v="round">Round</button>
      </div>
    </div>`;
  document.body.appendChild(panel);

  /* open button */
  const openBtn=document.createElement('button');
  openBtn.className='twk-open';
  openBtn.title='Tweaks';
  openBtn.setAttribute('aria-label','Open tweaks panel');
  openBtn.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>`;
  document.body.appendChild(openBtn);
  openBtn.addEventListener('click',()=>{ panel.classList.toggle('open'); });
  panel.querySelector('#twkClose').addEventListener('click',()=>panel.classList.remove('open'));

  /* mood chips */
  const moodWrap=panel.querySelector('#twkMood');
  Object.keys(PALETTES).forEach(id=>{
    const p=PALETTES[id];
    const b=document.createElement('button');
    b.className='twk-chip'; b.dataset.v=id; b.title=p.label;
    b.style.background=p.swatch[0];
    b.innerHTML=`<span><i style="background:${p.swatch[1]}"></i><i style="background:${p.swatch[2]}"></i></span><em class="nm">${p.label}</em>`;
    b.addEventListener('click',()=>{ state.mood=id; applyMood(id); save(); syncUI(); });
    moodWrap.appendChild(b);
  });

  const energyEl=panel.querySelector('#twkEnergy');
  energyEl.addEventListener('input',()=>{ const v=+energyEl.value; state.energy=v; applyEnergy(v); save(); energyEl.style.setProperty('--fill',v+'%'); });

  panel.querySelector('#twkEdge').addEventListener('click',e=>{
    const b=e.target.closest('button[data-v]'); if(!b) return;
    state.edge=b.dataset.v; applyEdge(b.dataset.v); save(); syncUI();
  });

  function syncUI(){
    moodWrap.querySelectorAll('.twk-chip').forEach(c=>c.dataset.on=(c.dataset.v===state.mood)?'1':'0');
    energyEl.value=state.energy; energyEl.style.setProperty('--fill',state.energy+'%');
    panel.querySelectorAll('#twkEdge button').forEach(b=>b.dataset.on=(b.dataset.v===state.edge)?'1':'0');
  }

  /* drag */
  (function(){
    const hd=panel.querySelector('#twkDrag'); let off={x:16,y:16};
    function clamp(){ const w=panel.offsetWidth,h=panel.offsetHeight;
      off.x=Math.min(Math.max(16,off.x),Math.max(16,innerWidth-w-16));
      off.y=Math.min(Math.max(16,off.y),Math.max(16,innerHeight-h-16));
      panel.style.right=off.x+'px'; panel.style.bottom=off.y+'px'; }
    hd.addEventListener('mousedown',e=>{
      if(e.target.closest('#twkClose')) return;
      const r=panel.getBoundingClientRect(),sx=e.clientX,sy=e.clientY;
      const sr=innerWidth-r.right,sb=innerHeight-r.bottom;
      const mv=ev=>{ off.x=sr-(ev.clientX-sx); off.y=sb-(ev.clientY-sy); clamp(); };
      const up=()=>{ removeEventListener('mousemove',mv); removeEventListener('mouseup',up); };
      addEventListener('mousemove',mv); addEventListener('mouseup',up);
    });
  })();

  applyAll(); syncUI();
})();
