/* ============================================================
   SS FASHION POINT — App Logic
   ============================================================ */
(function(){
  'use strict';

  /* ============================================================
     SHOPIFY HEADLESS — edit these 2 values to connect a store.
     To hand off to a client later, just replace these two lines.
     Leave them as the YOUR-... placeholders to keep demo products.
     ============================================================ */
  const SHOPIFY = {
    domain : "qg006p-r6.myshopify.com",          // e.g. ss-fashion-point.myshopify.com
    token  : "8011497f71c190bf47d8607789fa4df0", // Storefront API *public* access token
    version: "2024-10"
  };

  const $ = (s,c=document) => c.querySelector(s);
  const $$ = (s,c=document) => [...c.querySelectorAll(s)];
  const INR = n => '₹'+n.toLocaleString('en-IN');

  /* ---------- catalogue ---------- */
  const SZ_TOP=['S','M','L','XL'], SZ_JEAN=['30','32','34','36'], SZ_SHOE=['7','8','9','10'];
  let PRODUCTS = [
    {id:'p1',cat:'tshirts',brand:'Polo Ralph Lauren',name:'Classic Pony Tee',price:999,mrp:1499,img:'assets/p_tee1.jpg',tag:'HOT',rating:4.9,reviews:136,
      desc:'A premium cotton tee with the signature embroidered pony. Soft, breathable and built to keep its shape wash after wash.',
      colors:[{n:'Navy',h:'#1b2a4a'},{n:'White',h:'#f1efe6'},{n:'Sky',h:'#9db9d6'}],sizes:SZ_TOP,fits:['Regular','Oversized']},
    {id:'p2',cat:'shirts',brand:'Tommy Hilfiger',name:'Oxford Casual Shirt',price:1299,mrp:1899,img:'assets/p_shirt1.jpg',tag:'NEW',rating:4.7,reviews:59,
      desc:'A crisp oxford-weave shirt that moves from desk to dinner. Mother-of-pearl buttons and a tailored-but-easy cut.',
      colors:[{n:'Sky',h:'#aac4dd'},{n:'White',h:'#f1efe6'},{n:'Stone',h:'#d8cdb8'}],sizes:SZ_TOP,fits:['Slim','Regular']},
    {id:'p3',cat:'jeans',brand:"Levi's",name:'511 Slim Denim',price:1799,mrp:2499,img:'assets/p_jeans1.jpg',tag:'NEW',rating:4.8,reviews:212,
      desc:'The 511 — a modern slim that sits below the waist with a little stretch. An everyday denim that just works.',
      colors:[{n:'Indigo',h:'#2f3b55'},{n:'Mid Blue',h:'#5d7290'},{n:'Black',h:'#20232a'}],sizes:SZ_JEAN,fits:['Slim','Tapered']},
    {id:'p4',cat:'shoes',brand:'Puma',name:'Street Runner',price:2299,mrp:3299,img:'assets/p_shoe1.jpg',tag:'HOT',rating:5.0,reviews:29,
      desc:'A lightweight runner with a cushioned ride and a clean street silhouette. Goes with everything in the rack.',
      colors:[{n:'Black',h:'#1d1d1f'},{n:'Grey',h:'#9a9a9c'},{n:'Flame',h:'#c5552a'}],sizes:SZ_SHOE,fits:['True to size']},
    {id:'p5',cat:'shirts',brand:'GAP',name:'Checked Flannel',price:1149,mrp:1699,img:'assets/p_shirt2.jpg',tag:'',rating:4.6,reviews:88,
      desc:'Brushed cotton flannel in a soft check. Layer it open or button it up — the cooler-evening essential.',
      colors:[{n:'Rust',h:'#8c3a32'},{n:'Forest',h:'#3a5a44'},{n:'Slate',h:'#3f5168'}],sizes:SZ_TOP,fits:['Regular']},
    {id:'p6',cat:'shoes',brand:'Adidas',name:'Retro Trainer',price:2499,mrp:3499,img:'assets/p_shoe2.jpg',tag:'NEW',rating:4.8,reviews:163,
      desc:'A heritage trainer reissued in premium suede and mesh. Vintage lines, modern comfort underfoot.',
      colors:[{n:'Bone',h:'#efece3'},{n:'Grey',h:'#b8b8ba'}],sizes:SZ_SHOE,fits:['True to size']},
    {id:'p7',cat:'jeans',brand:'H&M',name:'Tapered Wash Jean',price:1399,mrp:1999,img:'assets/p_jeans2.jpg',tag:'',rating:4.5,reviews:74,
      desc:'A relaxed-to-tapered leg in an authentic mid wash. Comfortable through the seat and thigh.',
      colors:[{n:'Light',h:'#8aa0bd'},{n:'Dark',h:'#2c3242'}],sizes:SZ_JEAN,fits:['Tapered','Relaxed']},
    {id:'p8',cat:'tshirts',brand:'SS Basics',name:'Heavyweight Tee',price:699,mrp:999,img:'assets/p_tee2.jpg',tag:'HOT',rating:4.9,reviews:241,
      desc:'Our own heavyweight 240gsm tee with a boxy drop-shoulder. The blank canvas every fit starts from.',
      colors:[{n:'Black',h:'#1d1d1f'},{n:'White',h:'#f1efe6'},{n:'Sand',h:'#c9bda6'}],sizes:SZ_TOP,fits:['Boxy','Regular']},
  ];

  const find = id => PRODUCTS.find(p=>p.id===id);
  const isLight = h => {const c=h.replace('#','');const r=parseInt(c.substr(0,2),16),g=parseInt(c.substr(2,2),16),b=parseInt(c.substr(4,2),16);return (r*0.299+g*0.587+b*0.114)>200;};

  /* ---------- category taxonomy (Max-style nested menu) ---------- */
  const MENU = [
    {key:'all', label:'Shop everything'},
    {key:'topwear', label:'Topwear', subs:[
      {key:'topwear', label:'All Topwear'},
      {key:'tshirts', label:'T-Shirts'},
      {key:'polos', label:'Polos'},
      {key:'casual-shirts', label:'Casual Shirts'},
      {key:'formal-shirts', label:'Formal Shirts'}
    ]},
    {key:'bottomwear', label:'Bottomwear', subs:[
      {key:'bottomwear', label:'All Bottomwear'},
      {key:'jeans', label:'Jeans'},
      {key:'trousers', label:'Trousers'},
      {key:'shorts', label:'Shorts & 3/4ths'}
    ]},
    {key:'footwear', label:'Footwear', subs:[
      {key:'footwear', label:'All Footwear'},
      {key:'sneakers', label:'Sneakers'},
      {key:'sports', label:'Sports Shoes'},
      {key:'formal-shoes', label:'Formal Shoes'}
    ]},
    {key:'accessories', label:'Accessories', subs:[
      {key:'accessories', label:'All Accessories'},
      {key:'belts', label:'Belts'},
      {key:'caps', label:'Caps'},
      {key:'wallets', label:'Wallets'},
      {key:'socks', label:'Socks'}
    ]}
  ];
  // keyword sets so filtering works on demo data AND whatever Shopify product types/tags you use
  const FILTER_MAP = {
    topwear:['tshirt','t-shirt','tee','shirt','polo','top','henley'],
    tshirts:['tshirt','t-shirt','tee'], polos:['polo'],
    'casual-shirts':['casual','check','flannel','oxford','shirt'], 'formal-shirts':['formal','shirt'],
    shirts:['shirt','oxford','flannel','check','polo','tee','tshirt','t-shirt'],
    bottomwear:['jean','denim','trouser','pant','chino','short','bottom','jogger'],
    jeans:['jean','denim'], trousers:['trouser','pant','chino'], shorts:['short','3/4'],
    footwear:['shoe','sneaker','runner','trainer','footwear','loafer','derby'],
    shoes:['shoe','sneaker','runner','trainer','footwear','loafer','derby'],
    sneakers:['sneaker','trainer','street'], sports:['sport','runner','running','train'],
    'formal-shoes':['formal','derby','loafer','oxford'],
    accessories:['accessor','belt','cap','wallet','sock','bag','watch','hat'],
    belts:['belt'], caps:['cap','hat'], wallets:['wallet'], socks:['sock']
  };
  function labelFor(key){
    for(const m of MENU){ if(m.key===key) return m.label; if(m.subs){ const s=m.subs.find(x=>x.key===key); if(s) return s.label; } }
    return key;
  }
  function matchFilter(p,key){
    if(!key||key==='all') return true;
    const keys=FILTER_MAP[key];
    const hay=[p.cat,p.name,p.brand,(p.tags||[]).join(' ')].join(' ').toLowerCase();
    if(!keys) return hay.includes(key.toLowerCase());
    return keys.some(k=>hay.includes(k));
  }
  let CURRENT_FILTER='all';

  /* ---------- state ---------- */
  let cart={}, WISH=new Set();
  try{ cart=JSON.parse(localStorage.getItem('ssfp_cart')||'{}'); }catch(e){ cart={}; }
  try{ WISH=new Set(JSON.parse(localStorage.getItem('ssfp_wish')||'[]')); }catch(e){ WISH=new Set(); }
  const saveCart=()=>localStorage.setItem('ssfp_cart',JSON.stringify(cart));
  const saveWish=()=>localStorage.setItem('ssfp_wish',JSON.stringify([...WISH]));
  const items=()=>Object.values(cart);
  const count=()=>items().reduce((s,i)=>s+i.qty,0);
  const subtotal=()=>items().reduce((s,i)=>s+i.price*i.qty,0);
  let detail=null;

  /* ---------- cart ops ---------- */
  function keyOf(id,color,size){ return id+'::'+color+'::'+size; }
  function addToCart(id,opts={}){
    const p=find(id);
    const color=opts.color!=null?opts.color:0;
    const size=opts.size!=null?opts.size:0;
    const qty=opts.qty||1;
    const fit=opts.fit!=null?opts.fit:0;
    const k=keyOf(id,color,size);
    if(cart[k]) cart[k].qty+=qty;
    else cart[k]={key:k,id,name:p.name,brand:p.brand,price:p.price,img:p.img,qty,
      color:p.colors[color].n,size:p.sizes[size],fit:p.fits[fit]};
    saveCart(); renderCart(); if(!opts.silent) bump(p);
  }
  function setQty(k,d){ if(!cart[k])return; cart[k].qty+=d; if(cart[k].qty<=0) delete cart[k]; saveCart(); renderCart(); }
  function removeItem(k){ delete cart[k]; saveCart(); renderCart(); }

  /* ---------- wishlist ---------- */
  function toggleWish(id){ WISH.has(id)?WISH.delete(id):WISH.add(id); saveWish(); reflectWish(); }
  function reflectWish(){
    $$('.product').forEach(c=>{ const w=c.querySelector('.wish'); if(w) w.classList.toggle('on',WISH.has(c.dataset.id)); });
    const dh=$('#detail .di-heart'); if(dh&&detail) dh.classList.toggle('on',WISH.has(detail.id));
    updateWishCount();
    if($('#wishDrawer').classList.contains('open')) renderWishDrawer();
    if($('#acctDrawer').classList.contains('open')&&USER) renderAcct();
  }
  function updateWishCount(){ const b=$('#wishCount'); if(b){ const n=WISH.size; b.textContent=n; b.classList.toggle('show',n>0); } }

  /* ---------- product cards ---------- */
  function stars(p){ /* fake reviews removed — plug in a real reviews app (Judge.me / Shopify Reviews) here */ return ''; }
  function card(p){
    const off=Math.round((1-p.price/p.mrp)*100);
    return `<article class="product rv" data-id="${p.id}" data-cat="${p.cat}">
      <div class="pimg">
        ${p.tag?`<span class="tag ${p.tag==='HOT'?'hot':''}">${p.tag}</span>`:''}
        <button class="wish ${WISH.has(p.id)?'on':''}" data-wish="${p.id}" aria-label="Save ${p.name}">
          <svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>
        </button>
        <img src="${p.img}" alt="${p.name}" loading="lazy">
      </div>
      <div class="pbody">
        <div class="pbrand">${p.brand}</div>
        <h4 class="pname">${p.name}</h4>
        ${stars(p)}
        <div class="prow">
          <div class="price"><s>${INR(p.mrp)}</s>${INR(p.price)} <span class="mono" style="color:var(--accent);font-size:10px">-${off}%</span></div>
          <button class="add" data-add="${p.id}" aria-label="Quick add ${p.name}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
          </button>
        </div>
      </div>
    </article>`;
  }
  function renderProducts(filter='all'){
    CURRENT_FILTER=filter;
    const grid=$('#productGrid');
    const list=PRODUCTS.filter(p=>matchFilter(p,filter));
    grid.innerHTML = list.length
      ? list.map(card).join('')
      : `<div class="grid-empty"><div class="ge-ic">🧺</div><p>Nothing in <b>${labelFor(filter)}</b> just yet.<br>Fresh stock shows up here the moment it's added in store.</p><button class="btn btn-ink btn-sm" data-filter-all>Browse everything <span class="ar">→</span></button></div>`;
    observeReveal(grid); reflectWish();
  }

  /* ---------- detail panel ---------- */
  const detailEl=$('#detail'), detailBody=$('#detailBody');
  function openDetail(id){
    const p=find(id); if(!p) return;
    detail={id,color:0,size:0,fit:0,qty:1};
    renderDetail();
    detailEl.classList.add('open'); document.body.classList.add('lock');
  }
  function closeDetail(){ detailEl.classList.remove('open'); if(!$('#checkout').classList.contains('open')&&!$('#cartDrawer').classList.contains('open')) document.body.classList.remove('lock'); detail=null; }
  function renderDetail(){
    const p=find(detail.id), off=Math.round((1-p.price/p.mrp)*100), wished=WISH.has(p.id);
    const sw=p.colors.map((c,i)=>`<button class="swatch ${i===detail.color?'on':''}" data-color="${i}" title="${c.n}" style="background:${c.h}${isLight(c.h)?';border-color:#d9d1c0':''}"></button>`).join('');
    const sz=p.sizes.map((s,i)=>`<button class="size ${i===detail.size?'on':''}" data-size="${i}">${s}</button>`).join('');
    const ft=p.fits.length>1?p.fits.map((f,i)=>`<button class="fit ${i===detail.fit?'on':''}" data-fit="${i}">${f}</button>`).join(''):'';
    detailBody.innerHTML=`
      <div class="detail-grid">
        <div class="detail-media">
          ${p.tag?`<span class="dm-tag">${p.tag}</span>`:'<span class="dm-tag">New</span>'}
          <img src="${p.img}" alt="${p.name}">
        </div>
        <div class="detail-info">
          <div class="di-top">
            <div>
              <div class="di-brand">${p.brand}</div>
            </div>
            <button class="di-heart ${wished?'on':''}" data-wish="${p.id}" aria-label="Save">
              <svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>
            </button>
          </div>
          <h2>${p.name}</h2>
          <div class="di-price"><span class="now">${INR(p.price)}</span><s>${INR(p.mrp)}</s><span class="off">-${off}%</span></div>
          <p class="di-desc">${p.desc}</p>
          <div class="di-opt">
            <div class="ol"><span class="k">Colour</span><span class="sel">${p.colors[detail.color].n}</span></div>
            <div class="swatches">${sw}</div>
          </div>
          <div class="di-opt">
            <div class="ol"><span class="k">Size</span><span class="sel">Size guide ↗</span></div>
            <div class="sizes">${sz}</div>
          </div>
          ${ft?`<div class="di-opt"><div class="ol"><span class="k">Fit</span><span class="sel">${p.fits[detail.fit]}</span></div><div class="fits">${ft}</div></div>`:''}
          <div class="di-actions">
            <button class="btn btn-ink" data-detadd>Add to bag <span class="ar">→</span></button>
            <button class="btn btn-accent" data-detbuy>Buy now</button>
          </div>
          <div class="di-meta">
            <span>✓ In store now</span><span>✓ Free fit exchange</span><span>✓ ${p.cat==='shoes'?'Box included':'Premium cotton'}</span>
          </div>
        </div>
      </div>`;
  }

  /* ---------- render cart ---------- */
  function renderCart(){
    const body=$('#cartBody'), foot=$('#cartFoot'), list=items(), c=count();
    $$('.cart-count').forEach(b=>{ b.textContent=c; b.classList.toggle('show',c>0); });
    const mob=$('#mobCart');
    if(c>0){ mob.classList.add('show'); $('#mobCartCount').textContent=c+(c===1?' item':' items'); $('#mobCartTotal').textContent=INR(subtotal()); }
    else mob.classList.remove('show');
    if(list.length===0){ body.innerHTML=`<div class="empty"><div class="em-ic">🛍️</div><p>Your bag is empty.<br>Add some fresh fits.</p></div>`; foot.innerHTML=''; return; }
    body.innerHTML=list.map(i=>{
      const variant=[i.size?'Size '+i.size:'',i.color].filter(Boolean).join(' · ');
      return `<div class="citem">
        <img src="${i.img}" alt="${i.name}">
        <div class="ci-info">
          <div class="ci-brand">${i.brand}</div>
          <div class="ci-name">${i.name}</div>
          ${variant?`<div class="ci-variant mono" style="font-size:9px;color:var(--ink-3);letter-spacing:.06em;margin-top:4px">${variant}</div>`:''}
          <div class="qty">
            <button data-q="-1" data-key="${i.key}" aria-label="decrease">–</button>
            <span>${i.qty}</span>
            <button data-q="1" data-key="${i.key}" aria-label="increase">+</button>
          </div>
        </div>
        <div style="text-align:right">
          <div class="ci-price">${INR(i.price*i.qty)}</div>
          <button class="ci-remove" data-rm="${i.key}">Remove</button>
        </div>
      </div>`;
    }).join('');
    const sub=subtotal();
    foot.innerHTML=`
      <div class="sumrow total"><span>Subtotal</span><span>${INR(sub)}</span></div>
      <button class="btn btn-ink" id="goCheckout" style="width:100%;justify-content:center">Checkout <span class="ar">→</span></button>
      <div class="freeship">Taxes &amp; delivery calculated at checkout</div>`;
  }

  /* ---------- drawers ---------- */
  const scrim=$('#scrim'), drawer=$('#cartDrawer');
  function closeSideDrawers(){
    ['#cartDrawer','#wishDrawer','#acctDrawer'].forEach(s=>$(s).classList.remove('open'));
    ['#scrim','#wishScrim','#acctScrim'].forEach(s=>$(s).classList.remove('open'));
  }
  const openCart=()=>{ closeSideDrawers(); scrim.classList.add('open'); drawer.classList.add('open'); document.body.classList.add('lock'); };
  const closeCart=()=>{ scrim.classList.remove('open'); drawer.classList.remove('open'); if(!detailEl.classList.contains('open')) document.body.classList.remove('lock'); };

  function bump(p){ $$('.cart-count').forEach(b=>{ b.style.animation='none'; void b.offsetWidth; b.style.animation='pop .4s'; }); showAddToast(p); }
  let toastTimer=null;
  function showAddToast(p,label){
    if(!p) return; const t=$('#toast'); if(!t) return;
    $('#toastImg').src=p.img; $('#toastName').textContent=p.name; $('#toastLabel').textContent=label||'Added to bag';
    t.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.remove('show'),3600);
  }

  /* ---------- checkout ---------- */
  const co=$('#checkout');
  function openCheckout(){
    const sub=subtotal(); if(sub===0) return;
    $('#coSummary').innerHTML=items().map(i=>`<div class="sl"><span>${i.qty}× ${i.name}${i.size?' ('+i.size+')':''}</span><span>${INR(i.price*i.qty)}</span></div>`).join('')
      +`<div class="sl tot"><span>Subtotal</span><span>${INR(sub)}</span></div>`
      +`<div class="sl" style="font-size:12px;color:var(--ink-3)"><span>Taxes &amp; delivery</span><span>At checkout</span></div>`;
    co.classList.add('open'); document.body.classList.add('lock');
    $('#coForm').style.display=''; $('#coSuccess').style.display='none';
  }
  const closeCheckout=()=>{ co.classList.remove('open'); document.body.classList.remove('lock'); };
  function placeOrder(e){
    e.preventDefault(); const f=e.target;
    const name=f.name.value.trim(), phone=f.phone.value.trim(), addr=f.address.value.trim(), method=f.method.value;
    const sub=subtotal(), tot=sub;
    let msg=`*New order — SS Fashion Point*%0A%0A`;
    items().forEach(i=>{ msg+=`• ${i.qty}× ${i.name}${i.size?' / '+i.size:''}${i.color?' / '+i.color:''} — ${INR(i.price*i.qty)}%0A`; });
    msg+=`%0A*Subtotal: ${INR(tot)}* (delivery & taxes as per store)%0A%0A`;
    msg+=`Name: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0A${method==='delivery'?'Deliver to: '+encodeURIComponent(addr):'Pickup at store'}`;
    $('#waLink').href=`https://wa.me/919967747796?text=${msg}`;
    $('#coForm').style.display='none'; $('#coSuccess').style.display='block';
    cart={}; saveCart(); renderCart();
  }

  /* ---------- nav menu (nested, Max-style) ---------- */
  const mm=$('#mobMenu');
  function renderMenuList(node){
    const list=$('#mmList'), title=$('#mmTitle'), back=$('#mmBack');
    if(!list) return;
    const arr = node ? node.subs : MENU;
    title.textContent = node ? node.label : 'Shop';
    if(back) back.hidden = !node;
    list.innerHTML = arr.map(it=>{
      if(it.subs){
        return `<button class="mm-row" data-cat="${it.key}"><span class="mm-row-l">${it.label}</span><span class="mm-row-ch"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg></span></button>`;
      }
      return `<button class="mm-row leaf" data-filter="${it.key}"><span class="mm-row-l">${it.label}</span><span class="mm-row-ch"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M9 7h8v8"/></svg></span></button>`;
    }).join('');
  }
  function openMenu(){ renderMenuList(null); mm.classList.add('open'); document.body.classList.add('lock'); }
  function closeMenu(){ mm.classList.remove('open'); if(!anySideOpen()) document.body.classList.remove('lock'); }
  function menuDrillTo(key){ const node=MENU.find(m=>m.key===key&&m.subs); if(node) renderMenuList(node); }
  function menuBack(){ renderMenuList(null); }
  function menuPickFilter(key){ closeMenu(); applyFilter(key); }

  /* ---------- reveal ---------- */
  let io;
  function observeReveal(scope=document){
    if(!io) io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }),{threshold:.12,rootMargin:'0px 0px -8% 0px'});
    $$('.rv',scope).forEach(el=>{ if(!el.classList.contains('in')) io.observe(el); });
  }

  /* ---------- bar state ---------- */
  function onScroll(){ const bar=$('#bar'); const past=window.scrollY>window.innerHeight*0.72;
    bar.classList.toggle('solid',window.scrollY>40); bar.classList.toggle('hero-mode',!past); }

  /* ---------- filters ---------- */
  function applyFilter(key){
    $$('.catchip').forEach(x=>x.classList.toggle('active',x.dataset.filter===key));
    renderProducts(key);
    const shop=$('#shop'); if(shop){ const y=shop.getBoundingClientRect().top+window.scrollY-78; window.scrollTo({top:Math.max(0,y),behavior:'smooth'}); }
  }
  function initFilters(){
    $$('.catchip').forEach(chip=>chip.addEventListener('click',()=>applyFilter(chip.dataset.filter)));
    $$('.cat[data-filter]').forEach(c=>c.addEventListener('click',e=>{ e.preventDefault(); applyFilter(c.dataset.filter); }));
  }

  /* ---------- countdown ---------- */
  function initCountdown(){
    const end=Date.now()+(2*24*3600+8*3600)*1000;
    const set=(id,v)=>{const e=$(id);if(e)e.textContent=String(v).padStart(2,'0');};
    function tick(){ let s=Math.max(0,Math.floor((end-Date.now())/1000));
      const d=Math.floor(s/86400);s%=86400;const h=Math.floor(s/3600);s%=3600;const m=Math.floor(s/60);s%=60;
      set('#cdD',d);set('#cdH',h);set('#cdM',m);set('#cdS',s); }
    tick(); setInterval(tick,1000);
  }

  /* ---------- hero intro ---------- */
  function heroIntro(){
    $$('.hero h1 .ln span').forEach((s,i)=>s.animate(
      [{transform:'translateY(110%)'},{transform:'translateY(0)'}],
      {duration:900,delay:200+i*120,easing:'cubic-bezier(.2,.9,.2,1)',fill:'forwards'}));
  }

  /* ===================== ACCOUNT + WISHLIST ===================== */
  const PERSON_SVG='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M5.5 21a6.5 6.5 0 0 1 13 0"/></svg>';
  const GOOGLE_SVG='<svg viewBox="0 0 48 48"><path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8c-.5 2.7-2 5-4.4 6.6v5.5h7.1c4.1-3.8 6.6-9.4 6.6-16.1Z"/><path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-7.1-5.5c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.5-3.8-12.2-9H4.5v5.7C8.1 41.1 15.4 46 24 46Z"/><path fill="#FBBC05" d="M11.8 28.3c-.4-1.3-.7-2.7-.7-4.3s.3-3 .7-4.3v-5.7H4.5C3 17 2 20.4 2 24s1 7 2.5 10l7.3-5.7Z"/><path fill="#EA4335" d="M24 11.4c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 4.8 29.9 2.7 24 2.7 15.4 2.7 8.1 7.6 4.5 14.7l7.3 5.7c1.7-5.2 6.5-9 12.2-9Z"/></svg>';
  const APPLE_SVG='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 12.04c-.03-2.6 2.12-3.85 2.22-3.91-1.21-1.77-3.1-2.01-3.77-2.04-1.6-.16-3.13.94-3.94.94-.81 0-2.07-.92-3.41-.9-1.75.03-3.37 1.02-4.27 2.59-1.82 3.16-.47 7.84 1.31 10.41.87 1.26 1.9 2.67 3.25 2.62 1.31-.05 1.8-.84 3.38-.84 1.58 0 2.02.84 3.4.81 1.41-.02 2.3-1.28 3.16-2.55 1-1.46 1.41-2.88 1.43-2.95-.03-.01-2.74-1.05-2.77-4.18Z M14.74 4.54c.72-.87 1.2-2.08 1.07-3.29-1.03.04-2.28.69-3.02 1.56-.66.77-1.24 2-1.08 3.18 1.15.09 2.32-.58 3.03-1.45Z"/></svg>';
  const ICN={
    heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>',
    bag:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
    info:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5h.01"/></svg>',
    map:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    chev:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
    lock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>'
  };

  let USER=null;
  try{ USER=JSON.parse(localStorage.getItem('ssfp_user')||'null'); }catch(e){ USER=null; }
  const loadCustomers=()=>{ try{ return JSON.parse(localStorage.getItem('ssfp_customers')||'[]'); }catch(e){ return []; } };
  const saveUser=()=>{ if(USER) localStorage.setItem('ssfp_user',JSON.stringify(USER)); else localStorage.removeItem('ssfp_user'); };
  function recordCustomer(u){
    const all=loadCustomers();
    const m=all.find(c=>(u.mobile&&c.mobile===u.mobile)||(u.email&&c.email&&c.email===u.email));
    if(m) Object.assign(m,u); else all.push(u);
    localStorage.setItem('ssfp_customers',JSON.stringify(all));
  }
  const initialsOf=n=>(n||'?').trim().split(/\s+/).slice(0,2).map(w=>w[0]||'').join('').toUpperCase()||'?';
  const methodLabel=m=>({google:'Google',apple:'Apple',mobile:'Mobile OTP'})[m]||'Account';
  const fmtMonth=ts=>new Date(ts).toLocaleDateString('en-IN',{month:'short',year:'numeric'});
  const SAMPLE={
    google:[{name:'Rohan Mehta',email:'rohan.mehta@gmail.com',c:'#db4437'},{name:'Aarav Sharma',email:'aarav.sharma21@gmail.com',c:'#0f9d58'}],
    apple:[{name:'Aditya Singh',email:'a.singh@icloud.com',c:'#111'},{name:'Kabir Jain',email:'hidden@privaterelay.appleid.com',c:'#444'}]
  };

  function updateAuthIcon(){
    const b=$('#accountOpen'); if(!b) return;
    if(USER){ b.innerHTML=`<span class="acct-ava-mini">${initialsOf(USER.name)}</span>`; b.classList.add('is-auth'); b.setAttribute('aria-label','My account'); }
    else { b.innerHTML=PERSON_SVG; b.classList.remove('is-auth'); b.setAttribute('aria-label','Account'); }
  }

  function anySideOpen(){ return ['#cartDrawer','#wishDrawer','#acctDrawer','#detail','#checkout'].some(s=>$(s)&&$(s).classList.contains('open')); }
  function maybeUnlock(){ if(!anySideOpen()) document.body.classList.remove('lock'); }

  let acct={view:'choose',mobile:'',name:'',email:'',sentOtp:''};
  function openAcct(){ closeSideDrawers(); acct.view=USER?'home':'choose'; renderAcct(); $('#acctScrim').classList.add('open'); $('#acctDrawer').classList.add('open'); document.body.classList.add('lock'); }
  function closeAcct(){ $('#acctScrim').classList.remove('open'); $('#acctDrawer').classList.remove('open'); maybeUnlock(); }

  function renderAcct(){
    const body=$('#acctBody'), foot=$('#acctFoot'), title=$('#acctTitle');
    foot.innerHTML='';
    if(USER){
      title.textContent='My account';
      const contact=USER.mobile?('+91 '+USER.mobile):(USER.email||'—');
      body.innerHTML=`
        <div class="prof-card">
          <div class="prof-ava">${initialsOf(USER.name)}</div>
          <div class="prof-meta">
            <b>${USER.name||'Member'}</b>
            <span>${contact}</span>
            <div class="mtag"><i></i>${methodLabel(USER.method)} · member since ${fmtMonth(USER.createdAt)}</div>
          </div>
        </div>
        <div class="acct-rows">
          <button class="acct-row" data-act="goWish"><span class="ar-ic">${ICN.heart}</span><span class="ar-t">Wishlist</span><span class="ar-v">${WISH.size} saved</span><span class="ar-ch">${ICN.chev}</span></button>
          <button class="acct-row" data-act="goCart"><span class="ar-ic">${ICN.bag}</span><span class="ar-t">Your bag</span><span class="ar-v">${count()} item${count()===1?'':'s'}</span><span class="ar-ch">${ICN.chev}</span></button>
          <div class="acct-row"><span class="ar-ic">${ICN.info}</span><span class="ar-t">Email</span><span class="ar-v">${USER.email||'Not added'}</span></div>
          <div class="acct-row"><span class="ar-ic">${ICN.map}</span><span class="ar-t">Saved address</span><span class="ar-v">Add at checkout</span></div>
        </div>
        <div class="data-note"><span class="dn-ic">${ICN.lock}</span><div>Your details are saved to your SS Fashion Point account so your wishlist, bag and checkout stay ready next time.</div></div>`;
      foot.innerHTML=`<button class="btn btn-line" data-act="logout" style="width:100%;justify-content:center">Log out</button>`;
      return;
    }
    title.textContent='Account';
    const base='https://'+SHOPIFY.domain;
    body.innerHTML=`
      <p class="auth-lead">Sign in to your <b>SS Fashion Point</b> account to track orders, save your wishlist across devices and check out faster.</p>
      <div class="social">
        <a class="btn btn-ink" href="${base}/account/login" target="_blank" rel="noopener" style="width:100%;justify-content:center">Sign in <span class="ar">→</span></a>
        <a class="btn btn-line" href="${base}/account/register" target="_blank" rel="noopener" style="width:100%;justify-content:center">Create an account</a>
      </div>
      <div class="acct-rows" style="margin-top:20px">
        <button class="acct-row" data-act="goWish"><span class="ar-ic">${ICN.heart}</span><span class="ar-t">Wishlist</span><span class="ar-v">${WISH.size} saved</span><span class="ar-ch">${ICN.chev}</span></button>
        <button class="acct-row" data-act="goCart"><span class="ar-ic">${ICN.bag}</span><span class="ar-t">Your bag</span><span class="ar-v">${count()} item${count()===1?'':'s'}</span><span class="ar-ch">${ICN.chev}</span></button>
      </div>
      <div class="data-note"><span class="dn-ic">${ICN.lock}</span><div>Secure sign-in &amp; checkout are handled by Shopify — we never see your password, and your orders land straight in the store dashboard.</div></div>`;
  }

  function createAccount(p){
    USER={id:USER&&USER.id?USER.id:('u'+Date.now().toString(36)),name:p.name||'Member',email:p.email||'',mobile:p.mobile||'',method:p.method,createdAt:(USER&&USER.createdAt)||Date.now()};
    saveUser(); recordCustomer(USER); updateAuthIcon();
    acct.view='home'; renderAcct();
  }
  function logout(){ USER=null; saveUser(); updateAuthIcon(); acct.view='choose'; renderAcct(); }

  function openWish(){ closeSideDrawers(); renderWishDrawer(); $('#wishScrim').classList.add('open'); $('#wishDrawer').classList.add('open'); document.body.classList.add('lock'); }
  function closeWish(){ $('#wishScrim').classList.remove('open'); $('#wishDrawer').classList.remove('open'); maybeUnlock(); }
  function renderWishDrawer(){
    const body=$('#wishBody'), foot=$('#wishFoot');
    const list=[...WISH].map(find).filter(Boolean);
    if(!list.length){ body.innerHTML=`<div class="empty"><div class="em-ic">🤍</div><p>Your wishlist is empty.<br>Tap the heart on any product to save it here.</p></div>`; foot.innerHTML=''; return; }
    body.innerHTML=list.map(p=>{
      const off=Math.round((1-p.price/p.mrp)*100);
      return `<div class="citem" data-id="${p.id}">
        <img src="${p.img}" alt="${p.name}" data-open="${p.id}">
        <div class="ci-info">
          <div class="ci-brand">${p.brand}</div>
          <div class="ci-name" data-open="${p.id}">${p.name}</div>
          <div class="ci-price">${INR(p.price)} <s style="color:var(--ink-3);font-weight:400;font-size:12px;margin-left:4px">${INR(p.mrp)}</s> <span class="mono" style="color:var(--accent);font-size:10px">-${off}%</span></div>
          <div class="wl-actions">
            <button class="btn btn-ink btn-sm" data-wlmove="${p.id}">Move to bag</button>
            <button class="ci-remove" data-wlremove="${p.id}">Remove</button>
          </div>
        </div>
      </div>`;
    }).join('');
    foot.innerHTML=`<div class="sumrow"><span>${list.length} item${list.length>1?'s':''} saved</span><span></span></div><button class="btn btn-accent" data-act="addAll" style="width:100%;justify-content:center">Add all to bag</button>`;
  }

  function bindAccountWishlist(){
    const accBtn=$('#accountOpen'); if(accBtn) accBtn.addEventListener('click',openAcct);
    $('#acctClose').addEventListener('click',closeAcct);
    $('#acctScrim').addEventListener('click',closeAcct);
    $('#wishOpen').addEventListener('click',openWish);
    $('#wishClose').addEventListener('click',closeWish);
    $('#wishScrim').addEventListener('click',closeWish);
    $('#acctBody').addEventListener('input',e=>{
      const o=e.target.closest('[data-otp]');
      if(o){ o.value=o.value.replace(/\D/g,'').slice(0,1); const nx=o.parentElement.querySelector(`[data-otp="${+o.dataset.otp+1}"]`); if(o.value&&nx) nx.focus(); return; }
      const m=e.target.closest('#acctMobile'); if(m){ m.value=m.value.replace(/\D/g,'').slice(0,10); acct.mobile=m.value; }
    });
    $('#acctBody').addEventListener('keydown',e=>{
      const o=e.target.closest('[data-otp]'); if(o&&e.key==='Backspace'&&!o.value){ const pv=o.parentElement.querySelector(`[data-otp="${+o.dataset.otp-1}"]`); if(pv){ pv.focus(); pv.value=''; } }
    });
    document.addEventListener('click',e=>{
      const oauth=e.target.closest('[data-oauth]'); if(oauth){ acct.view=oauth.dataset.oauth; renderAcct(); return; }
      const go=e.target.closest('[data-go]'); if(go){ acct.view=go.dataset.go; renderAcct(); return; }
      const pick=e.target.closest('[data-pick]'); if(pick){ const [pv,i]=pick.dataset.pick.split(':'); const s=SAMPLE[pv][+i]; createAccount({name:s.name,email:s.email.includes('privaterelay')?'':s.email,method:pv}); return; }
      const act=e.target.closest('[data-act]'); if(act){ handleAcctAct(act.dataset.act); return; }
      const mv=e.target.closest('[data-wlmove]'); if(mv){ const id=mv.dataset.wlmove; addToCart(id,{silent:true}); toggleWish(id); showAddToast(find(id),'Moved to bag'); return; }
      const rm=e.target.closest('[data-wlremove]'); if(rm){ toggleWish(rm.dataset.wlremove); return; }
      const op=e.target.closest('#wishBody [data-open]'); if(op){ closeWish(); openDetail(op.dataset.open); return; }
    });
  }

  function handleAcctAct(a){
    if(a==='sendOtp'){
      const v=($('#acctMobile').value||'').replace(/\D/g,'');
      if(v.length!==10){ const f=$('#acctMobile'); f.style.borderColor='var(--accent)'; f.focus(); return; }
      acct.mobile=v; acct.sentOtp=String(Math.floor(1000+Math.random()*9000)); acct.view='otp'; renderAcct();
    } else if(a==='resend'){ acct.sentOtp=String(Math.floor(1000+Math.random()*9000)); renderAcct(); }
    else if(a==='verifyOtp'){
      const code=$$('#acctBody [data-otp]').map(i=>i.value).join('');
      if(code!==acct.sentOtp){ $$('#acctBody [data-otp]').forEach(i=>i.style.borderColor='var(--accent)'); return; }
      const existing=loadCustomers().find(c=>c.mobile===acct.mobile);
      if(existing){ createAccount(existing); } else { acct.name=''; acct.email=''; acct.view='profile'; renderAcct(); }
    } else if(a==='createAcct'){
      const name=($('#acctName').value||'').trim();
      if(!name){ const f=$('#acctName'); f.style.borderColor='var(--accent)'; f.focus(); return; }
      createAccount({name,email:($('#acctEmail').value||'').trim(),mobile:acct.mobile,method:'mobile'});
    } else if(a==='logout'){ logout(); }
    else if(a==='goWish'){ openWish(); }
    else if(a==='goCart'){ openCart(); }
    else if(a==='addAll'){ [...WISH].forEach(id=>addToCart(id,{silent:true})); openCart(); }
  }

  /* ---------- events ---------- */
  function bind(){
    document.addEventListener('click',e=>{
      const wish=e.target.closest('[data-wish]'); if(wish){ e.stopPropagation(); toggleWish(wish.dataset.wish); return; }
      const add=e.target.closest('[data-add]'); if(add){ e.stopPropagation(); addToCart(add.dataset.add); return; }
      const q=e.target.closest('[data-q]'); if(q){ setQty(q.dataset.key,+q.dataset.q); return; }
      const rm=e.target.closest('[data-rm]'); if(rm){ removeItem(rm.dataset.rm); return; }
      if(e.target.closest('#goCheckout')){ closeCart(); setTimeout(startCheckout,250); return; }
      const sw=e.target.closest('[data-color]'); if(sw){ detail.color=+sw.dataset.color; renderDetail(); return; }
      const sz=e.target.closest('[data-size]'); if(sz&&!sz.classList.contains('oos')){ detail.size=+sz.dataset.size; renderDetail(); return; }
      const ft=e.target.closest('[data-fit]'); if(ft){ detail.fit=+ft.dataset.fit; renderDetail(); return; }
      if(e.target.closest('[data-detadd]')){ addToCart(detail.id,detail); return; }
      if(e.target.closest('[data-detbuy]')){ addToCart(detail.id,detail); closeDetail(); closeCart(); setTimeout(startCheckout,260); return; }
      if(e.target.closest('[data-detclose]')){ closeDetail(); return; }
      if(e.target.closest('[data-filter-all]')){ applyFilter('all'); return; }
      const prod=e.target.closest('.product'); if(prod){ openDetail(prod.dataset.id); return; }
    });
    $('#cartOpen').addEventListener('click',openCart);
    $('#toastView').addEventListener('click',()=>{ $('#toast').classList.remove('show'); openCart(); });
    $('#scrim').addEventListener('click',closeCart);
    $('#cartClose').addEventListener('click',closeCart);
    $('#mobCart').addEventListener('click',openCart);
    $('#coClose').addEventListener('click',closeCheckout);
    $('#coForm').addEventListener('submit',placeOrder);
    $('#menuOpen').addEventListener('click',openMenu);
    $('#menuClose').addEventListener('click',closeMenu);
    const mmBack=$('#mmBack'); if(mmBack) mmBack.addEventListener('click',menuBack);
    const mmList=$('#mmList'); if(mmList) mmList.addEventListener('click',e=>{
      const cat=e.target.closest('[data-cat]'); if(cat){ menuDrillTo(cat.dataset.cat); return; }
      const lf=e.target.closest('[data-filter]'); if(lf){ menuPickFilter(lf.dataset.filter); return; }
    });
    $$('#mobMenu [data-mmclose]').forEach(a=>a.addEventListener('click',closeMenu));
    const mmAcc=$('#mmAccount'); if(mmAcc) mmAcc.addEventListener('click',()=>{ closeMenu(); setTimeout(openAcct,260); });
    document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ closeDetail(); closeCart(); closeCheckout(); closeMenu(); } });
    window.addEventListener('scroll',onScroll,{passive:true});
  }

  /* ===================== SHOPIFY PRODUCT LOADER ===================== */
  const COLOR_HEX = {black:'#1d1d1f',white:'#f1efe6',navy:'#1b2a4a',blue:'#3a5a8c',sky:'#9db9d6','light blue':'#aac4dd','mid blue':'#5d7290',red:'#b23b3b',green:'#3a5a44',forest:'#3a5a44',grey:'#9a9a9c',gray:'#9a9a9c',beige:'#d8cdb8',brown:'#6b4f3a',tan:'#c9a87a',sand:'#c9bda6',stone:'#d8cdb8',bone:'#efece3',cream:'#efece3',indigo:'#2f3b55',rust:'#8c3a32',olive:'#6b6b3a',maroon:'#5c2a2a',pink:'#d99aa6',yellow:'#d9c24a',orange:'#c5552a',purple:'#5a3a6b',slate:'#3f5168',charcoal:'#2c2c2e',khaki:'#b3a06a'};
  const hexFor = n => COLOR_HEX[(n||'').toLowerCase().trim()] || '#9a9a9c';

  const SHOP_QUERY = `{
    products(first: 100) {
      edges { node {
        handle title description vendor productType tags
        featuredImage { url }
        priceRange { minVariantPrice { amount } }
        compareAtPriceRange { maxVariantPrice { amount } }
        options { name values }
        variants(first: 100) { edges { node { id title availableForSale selectedOptions { name value } } } }
      } }
    }
  }`;

  function mapShopifyProduct(n){
    const optBy = name => { const o = (n.options||[]).find(o => o.name.toLowerCase() === name); return o ? o.values : []; };
    const colorsRaw = optBy('color'), sizes = optBy('size'), fits = optBy('fit');
    const price = Math.round(parseFloat((n.priceRange && n.priceRange.minVariantPrice.amount) || '0'));
    const mrpRaw = parseFloat((n.compareAtPriceRange && n.compareAtPriceRange.maxVariantPrice.amount) || '0');
    const tagsU = (n.tags || []).map(t => t.toUpperCase());
    return {
      id: n.handle,
      cat: (n.productType || '').toLowerCase(),
      brand: n.vendor || '',
      name: n.title,
      price,
      mrp: mrpRaw > price ? Math.round(mrpRaw) : price,
      img: (n.featuredImage && n.featuredImage.url) || '',
      tag: tagsU.includes('HOT') ? 'HOT' : (tagsU.includes('NEW') ? 'NEW' : ''),
      rating: 4.8, reviews: 0,
      tags: (n.tags || []),
      desc: n.description || '',
      colors: (colorsRaw.length ? colorsRaw : ['Default']).map(c => ({ n: c, h: hexFor(c) })),
      sizes: sizes.length ? sizes : ['One size'],
      fits: fits.length ? fits : ['Regular'],
      _variants: (n.variants && n.variants.edges || []).map(e => e.node)
    };
  }

  async function loadShopify(){
    // Not configured yet → keep the demo products.
    if(!SHOPIFY.token || SHOPIFY.token.indexOf('YOUR_') === 0 || SHOPIFY.domain.indexOf('YOUR-') === 0) return;
    try{
      const res = await fetch(`https://${SHOPIFY.domain}/api/${SHOPIFY.version}/graphql.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': SHOPIFY.token },
        body: JSON.stringify({ query: SHOP_QUERY })
      });
      const json = await res.json();
      const edges = json && json.data && json.data.products && json.data.products.edges;
      if(!edges || !edges.length){ console.warn('Shopify returned no products', json && json.errors); return; }
      PRODUCTS = edges.map(e => mapShopifyProduct(e.node));
      SHOPIFY_ACTIVE = true;
      renderProducts('all'); renderCart();
    }catch(err){ console.warn('Shopify load failed — using demo products:', err); }
  }

  /* ===================== SHOPIFY CHECKOUT ===================== */
  let SHOPIFY_ACTIVE = false;
  function variantIdFor(p, colorName, sizeValue){
    if(!p || !p._variants || !p._variants.length) return null;
    const match = p._variants.find(v => {
      const o = {}; (v.selectedOptions || []).forEach(x => o[x.name.toLowerCase()] = x.value);
      return (!('size' in o) || o.size === sizeValue) && (!('color' in o) || o.color === colorName);
    });
    return (match || p._variants[0]).id;
  }
  async function shopifyCheckout(){
    const lines = [];
    items().forEach(i => { const p = find(i.id); const id = variantIdFor(p, i.color, i.size); if(id) lines.push({ merchandiseId: id, quantity: i.qty }); });
    if(!lines.length){ openCheckout(); return; }
    try{
      const res = await fetch(`https://${SHOPIFY.domain}/api/${SHOPIFY.version}/graphql.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': SHOPIFY.token },
        body: JSON.stringify({ query: `mutation($lines:[CartLineInput!]!){ cartCreate(input:{lines:$lines}){ cart{ checkoutUrl } userErrors{ message } } }`, variables: { lines } })
      });
      const json = await res.json();
      const url = json && json.data && json.data.cartCreate && json.data.cartCreate.cart && json.data.cartCreate.cart.checkoutUrl;
      if(url){ window.location.href = url; return; }
      console.warn('Shopify checkout failed:', json && (json.errors || (json.data && json.data.cartCreate && json.data.cartCreate.userErrors)));
    }catch(err){ console.warn('Shopify checkout error:', err); }
    openCheckout(); // fallback to the WhatsApp order form
  }
  function startCheckout(){ if(SHOPIFY_ACTIVE) shopifyCheckout(); else openCheckout(); }

  /* ---------- hero slideshow (photo mode) ---------- */
  function heroSlideshow(){
    const imgs=$$('#heroMedia img'); if(imgs.length<2) return;
    let i=0; setInterval(()=>{
      if(document.body.dataset.hero!=='photo') return;
      imgs[i].classList.remove('on'); i=(i+1)%imgs.length; imgs[i].classList.add('on');
    },4800);
  }

  /* ---------- hero film (video) + scroll choreography ---------- */
  function heroFilm(){
    const hero=$('.hero'), vid=$('#heroVid'), inner=$('.hero-inner');
    if(!hero||!vid) return;
    const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
    let dur=vid.duration||5.8, ready=false, primed=false, lastT=-1;
    const T0=0.10, TEND=0.08; // trim a hair off head/tail

    const isFilm=()=>document.body.dataset.hero==='film';

    /* Prime the decoder once on first gesture (play→pause) so scroll-driven
       currentTime seeks actually paint. We never leave it playing — it scrubs. */
    function prime(){
      if(primed||!vid.src) return; primed=true;
      try{
        const p=vid.play&&vid.play();
        if(p&&p.then) p.then(()=>{ try{vid.pause();}catch(e){} render(true); }).catch(()=>{});
        else { try{vid.pause();}catch(e){} }
      }catch(e){}
    }

    // Load the clip as a blob (reliable cross-device seeking; silent fallback to poster)
    fetch('assets/hero-model.mp4').then(r=>{ if(!r.ok) throw 0; return r.blob(); })
      .then(b=>{ vid.src=URL.createObjectURL(b); })
      .catch(()=>{ vid.classList.add('hf-fail'); });

    vid.addEventListener('loadedmetadata',()=>{ dur=vid.duration||dur; });
    vid.addEventListener('loadeddata',()=>{ ready=true; render(true); });
    vid.addEventListener('canplay',()=>{ ready=true; });
    ['touchstart','pointerdown','scroll','wheel','keydown','click'].forEach(ev=>
      addEventListener(ev,prime,{once:true,passive:true}));

    function progress(){
      const track=hero.offsetHeight - innerHeight;       // scrollable distance while pinned
      if(track<=0) return 0;
      return Math.min(1,Math.max(0,(window.scrollY||0)/track));
    }

    function render(force){
      if(!isFilm()) return;
      const p=progress();
      hero.style.setProperty('--hp',p.toFixed(3));
      vid.style.setProperty('--hf-scale',(1+0.10*p).toFixed(3));
      if(inner){
        inner.style.transform='translateY('+(p*-18).toFixed(1)+'px)';
        inner.style.opacity='1';   // keep the headline present through the scrub (no empty cream)
      }
      if(ready && !reduce){
        if(!vid.paused){ try{vid.pause();}catch(e){} }
        const t=T0 + p*Math.max(0.05,(dur-T0-TEND));
        if(force || Math.abs(t-lastT)>0.018){ lastT=t; try{ vid.currentTime=t; }catch(e){} }
      }
    }

    let ticking=false;
    function req(){ if(!ticking){ ticking=true; requestAnimationFrame(()=>{ ticking=false; render(false); }); } }
    addEventListener('scroll',req,{passive:true});
    addEventListener('resize',req,{passive:true});
    render(true);

    // expose for the Tweaks hero toggle: re-sync when switching modes
    window.__ssfpHeroSync=function(){
      try{ vid.pause(); }catch(e){}
      lastT=-1;
      if(isFilm()){ render(true); }
      else if(inner){ inner.style.transform=''; inner.style.opacity=''; }
    };
  }

  function init(){
    renderProducts('all'); renderCart(); initFilters(); initCountdown(); observeReveal(); bind(); bindAccountWishlist(); updateAuthIcon(); updateWishCount(); onScroll(); heroIntro(); heroFilm(); heroSlideshow();
    loadShopify();
  }
  if(document.readyState!=='loading') init(); else document.addEventListener('DOMContentLoaded',init);
})();
