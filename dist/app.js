const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const money=n=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n);

const products={
 ultra:{name:'Azure Ultra',short:'Ultra',category:'phone',tag:'THE PINNACLE OF TITANIUM',badge:'Ultra Flagship',base:89999,image:'assets/azure-ultra.jpg',finish:'Midnight Azure',color:'#1c2d4a',description:'Titanium aerospace frame, 100x Space Periscope, and A19 Pro neural silicon.',storage:['512 GB','1 TB'],display:'6.9″ 120Hz ProMotion LTPO OLED (3000 nits)',camera:'200MP Quad-Optics Ceramic Island',personality:'Beyond human limits. The absolute apex.',highlights:['Aerospace Grade-5 Titanium chassis','Quad-periscope sapphire crystal lenses','Industry-first 3000 nits peak outdoor brightness','A19 Pro Neural Silicon with 48 TOPS AI'],specs:{display:'6.9" 3120x1440 LTPO OLED 1-120Hz',chip:'TSMC 3nm A19 Pro Bionic',battery:'5400 mAh · 100W HyperCharge',weight:'218 grams · IP68 Submersion'}},
 pro:{name:'Azure One Pro',short:'One Pro',category:'phone',tag:'THE ULTIMATE AZURE',badge:'Flagship',base:69999,image:'assets/azure-pro.png',finish:'Cosmic Violet',color:'#a69bc4',description:'For everything you want to do. And then some.',storage:['256 GB','512 GB'],display:'6.7″ OLED concept',camera:'Triple-lens concept',personality:'Create without holding back',highlights:['Sculpted triple-camera surround','Larger edge-to-edge display concept','A distinctive Cosmic Violet finish'],specs:{display:'6.7" 2796x1290 OLED 120Hz',chip:'TSMC 3nm A19 Silicon',battery:'4800 mAh · 65W Fast Charge',weight:'198 grams · IP68'}},
 air:{name:'Azure One Air',short:'One Air',category:'phone',tag:'LIGHTNESS, REIMAGINED',badge:'New concept',base:59999,image:'assets/one-air.jpg',finish:'Pearl Silver',color:'#d2d4d8',description:'A lighter presence. A lasting impression.',storage:['256 GB','512 GB'],display:'6.5″ OLED concept',camera:'Dual-lens concept',personality:'Less to carry. More to explore.',highlights:['A slim, softly sculpted profile','A refined vertical dual-camera design','A luminous Pearl Silver finish'],specs:{display:'6.5" 2532x1170 OLED 90Hz',chip:'A19 Dynamic Core',battery:'4200 mAh · 45W Fast Charge',weight:'165 grams · Ultralight'}},
 one:{name:'Azure One',short:'One',category:'phone',tag:'THE EVERYDAY ORIGINAL',badge:'Essential',base:44999,image:'assets/one.jpg',finish:'Sage',color:'#8f9f8d',description:'Everything that matters. Beautifully balanced.',storage:['128 GB','256 GB'],display:'6.1″ OLED concept',camera:'Dual-lens concept',personality:'Everyday, elevated',highlights:['A compact everyday design','A distinctive horizontal camera island','A quiet, nature-inspired Sage finish'],specs:{display:'6.1" 2532x1170 OLED 60Hz',chip:'A18 Silicon Core',battery:'3900 mAh · 30W Fast Charge',weight:'172 grams · Compact'}},
 watch:{name:'Azure Watch',short:'Watch',category:'wearable',tag:'TIME, RE-ENGINEERED',badge:'New Release',base:29999,image:'assets/watch.jpg',finish:'Midnight Graphite',color:'#212738',description:'Aerospace titanium chassis, sapphire crystal display, and clinical health bio-telemetry.',storage:['64 GB'],display:'1.9″ Micro-OLED 2000 nits',camera:'Dual PPG Bio-Sensors',personality:'Precision at your wrist',highlights:['Forged Titanium and ceramic back','Continuous ECG & SpO2 biometric telemetry','Titanium link & woven graphite strap','Up to 72 hours extended battery life'],specs:{display:'1.9" Always-On Micro-OLED',sensors:'Optical HR, ECG, Temp, Depth',battery:'72 hours Active Stamina',water:'100m Dive Grade Titanium'}},
 power:{name:'Azure Power Kit',short:'Power Kit',category:'charging',tag:'PLUG INTO POSSIBILITY',base:2499,image:'assets/power.jpg',finish:'Graphite',description:'A compact charger. A beautifully braided cable.',highlights:['USB-C wall charger and cable concept','Fine graphite finish and violet port detail','Plug type, output and compatibility to be confirmed'],specs:{output:'65W GaN Dual USB-C',cable:'2m Kevlar Braided 240W'}},
 buds:{name:'Azure Buds',short:'Buds',category:'audio',tag:'YOUR WORLD. YOUR SOUND.',base:6999,image:'assets/buds.jpg',finish:'Graphite',description:'Your everyday soundtrack, thoughtfully considered.',highlights:['Two sculpted earbuds with charging case','Pebble-shaped graphite case concept','Active Noise Cancelling with Spatial Audio'],specs:{drivers:'11mm Custom Carbon Driver',battery:'36 hours with Case',anc:'48dB Hybrid ANC'}},
 stand:{name:'Azure Stand',short:'Stand',category:'charging',tag:'A PLACE TO RECHARGE',base:3999,image:'assets/stand.jpg',finish:'Graphite / Silver',description:'A considered home for your everyday companion.',highlights:['Circular wireless charging stand concept','Metal stem and weighted base design','Qi2 15W Magnetic Fast Wireless'],specs:{materials:'Machined Aluminum & Silicone',power:'15W Qi2 Certified'}},
 case:{name:'Azure Soft Case',short:'Soft Case',category:'protection',tag:'A PERSONAL TOUCH',base:1999,image:'assets/case.jpg',finish:'Cosmic Violet',description:'A softer side to your signature style.',highlights:['A matte violet protective case concept','Sculpted button covers and raised edge design','Drop tested to 3 meters military standard'],specs:{protection:'3m Drop Armor Glass',lining:'Microfiber Interior Cushion'}}
};

const phones=['ultra','pro','air','one'], accessories=['watch','power','buds','stand','case'];

// ── Render Products ──────────────────────────────────────────────────────────
$('#phone-grid').innerHTML=phones.map(id=>{
  const p=products[id];
  return `<article class="phone-card" data-model="${id}" data-tilt>
    <div class="card-top"><span>${p.tag}</span><span class="card-badge">${p.badge}</span></div>
    <button class="phone-image-button" data-product="${id}" aria-label="View ${p.name}">
      <img src="${p.image}" alt="${p.name} in ${p.finish}" loading="lazy" width="1086" height="1448">
    </button>
    <div class="phone-info">
      <h3 class="product-title-glimmer">${p.name}</h3>
      <p>${p.description}</p>
      ${p.specs ? `<div class="specs-pill-row">
        <span>${p.specs.display.split(' ')[0]}</span>
        <span>${p.specs.chip}</span>
      </div>` : ''}
      <div class="finish-line" style="--finish:${p.color}"><i aria-hidden="true"></i>${p.finish}</div>
      <div class="product-bottom">
        <div><strong>${money(p.base)}</strong><small>Illustrative starting price</small></div>
        <button class="mini-button" data-product="${id}" aria-label="Explore ${p.name}">Explore <span>↗</span></button>
      </div>
    </div>
  </article>`;
}).join('');

$('#accessory-grid').innerHTML=accessories.map(id=>{
  const p=products[id];
  return `<article class="accessory-card" data-category="${p.category}" data-tilt>
    <button class="accessory-img" data-product="${id}" aria-label="View ${p.name}">
      <img src="${p.image}" alt="${p.name} concept in ${p.finish}" width="1254" height="1254" loading="lazy">
    </button>
    <div class="accessory-info">
      <p class="eyebrow">${p.category.toUpperCase()}</p>
      <h3>${p.short}</h3>
      <p>${p.description}</p>
      ${p.specs ? `<div class="specs-pill-row accessory-specs"><span>${Object.values(p.specs)[0]}</span></div>` : ''}
      <div class="product-bottom">
        <div><strong>${money(p.base)}</strong><small>Illustrative price</small></div>
        <button class="mini-button" data-product="${id}" aria-label="Explore ${p.name}">↗</button>
      </div>
    </div>
  </article>`;
}).join('');

let bag=[],current='ultra',toastTimer,returnFocus;
try{
  const saved=JSON.parse(localStorage.getItem('azure-preview-bag')||'[]');
  if(Array.isArray(saved))bag=saved.filter(i=>i&&Object.hasOwn(products,i.model)&&typeof i.finish==='string'&&(!products[i.model].storage||products[i.model].storage.includes(i.storage))).slice(0,20).map(i=>({model:i.model,finish:products[i.model].finish,storage:products[i.model].storage?i.storage:null}));
}catch{}

const price=i=>products[i.model].base+(products[i.model].storage?.indexOf(i.storage)>0?10000:0);

function persist(){
  try{localStorage.setItem('azure-preview-bag',JSON.stringify(bag));}catch{}
  $('#bag-count').textContent=bag.length;
}

function toast(message){
  $('#toast').textContent=message;
  $('#toast').classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),3500);
}

function openDialog(id){
  returnFocus=document.activeElement;
  $(id).showModal();
  document.body.style.overflow='hidden';
}

$$('dialog').forEach(d=>{
  d.querySelector('.close-dialog').onclick=()=>d.close();
  d.addEventListener('close',()=>{document.body.style.overflow='';returnFocus?.focus({preventScroll:true});});
  d.addEventListener('click',e=>{
    if(e.target===d){
      const r=d.getBoundingClientRect();
      if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();
    }
  });
});

function updatePrice(){
  $('#config-price').textContent=money(products[current].base+(products[current].storage&&$('#storage').selectedIndex>0?10000:0));
}

function openProduct(id){
  const p=products[id];
  if(!p)return;
  current=id;
  $('#product-title').textContent=p.name;
  $('#product-category').textContent=p.category==='phone'?'THE AZURE PHONE LINEUP':'THE AZURE ESSENTIALS';
  $('#product-image').src=p.image;
  $('#product-image').alt=p.name+' in '+p.finish;
  $('#product-description').textContent=p.description;
  
  // Render highlights & technical specs
  const items = p.highlights.map(text=>{
    const li=document.createElement('li');
    li.textContent=text;
    return li;
  });
  if(p.specs){
    const specHeader=document.createElement('li');
    specHeader.className='spec-group-title';
    specHeader.innerHTML='<strong>TECHNICAL ARCHITECTURE:</strong>';
    items.push(specHeader);
    for(const [k,v] of Object.entries(p.specs)){
      const li=document.createElement('li');
      li.className='spec-item';
      li.innerHTML=`<span class="spec-k">${k.toUpperCase()}:</span> <span class="spec-v">${v}</span>`;
      items.push(li);
    }
  }
  $('#product-highlights').replaceChildren(...items);
  
  $('#finish').replaceChildren(new Option(p.finish,p.finish));
  $('#storage-field').hidden=!p.storage;
  $('#storage').replaceChildren(...(p.storage||[]).map(x=>new Option(x,x)));
  updatePrice();
  openDialog('#product-dialog');
}

document.addEventListener('click',e=>{
  const b=e.target.closest('[data-product]');
  if(b)openProduct(b.dataset.product);
});

$('#storage').onchange=updatePrice;
$('#configuration-form').onsubmit=e=>{
  e.preventDefault();
  if(bag.length>=20){
    toast('Your preview bag holds up to 20 items. Remove an item to add another.');
    return;
  }
  const p=products[current];
  bag.push({model:current,finish:p.finish,storage:p.storage?$('#storage').value:null});
  persist();
  $('#product-dialog').close();
  toast(p.name+' added to your preview bag');
};

function renderBag(){
  const root=$('#bag-items');
  root.replaceChildren();
  $('#bag-summary').replaceChildren();
  if(!bag.length){
    const text=document.createElement('p');
    text.className='empty-bag';
    text.textContent='Make room for something extraordinary. Explore the collection and save your favorite concepts here.';
    const btn=document.createElement('button');
    btn.className='button light';
    btn.textContent='Explore the collection ↗';
    btn.onclick=()=>{$('#bag-dialog').close();$('#collection').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});};
    root.append(text,btn);
    return;
  }
  bag.forEach((item,index)=>{
    const p=products[item.model],row=document.createElement('div');
    row.className='bag-item';
    const img=document.createElement('img');
    img.src=p.image;
    img.alt=p.name;
    const info=document.createElement('div'),h=document.createElement('h3'),desc=document.createElement('p'),amount=document.createElement('strong');
    h.textContent=p.name;
    desc.textContent=item.finish+(item.storage?' · '+item.storage:'');
    amount.textContent=money(price(item));
    info.append(h,desc,amount);
    const remove=document.createElement('button');
    remove.className='remove-item';
    remove.textContent='Remove';
    remove.setAttribute('aria-label','Remove '+p.name);
    remove.onclick=()=>{bag.splice(index,1);persist();renderBag();};
    row.append(img,info,remove);
    root.append(row);
  });
  const total=document.createElement('div');
  total.className='bag-total';
  const label=document.createElement('span'),amount=document.createElement('strong');
  label.textContent='Preview total';
  amount.textContent=money(bag.reduce((sum,i)=>sum+price(i),0));
  total.append(label,amount);
  const note=document.createElement('p');
  note.className='disclosure';
  note.textContent='Illustrative selection only. Checkout, taxes, delivery and payments are not connected.';
  $('#bag-summary').append(total,note);
}

$('.bag-button').onclick=()=>{renderBag();openDialog('#bag-dialog');};
$('.menu-button').onclick=()=>{
  const open=$('nav').classList.toggle('open');
  $('.menu-button').setAttribute('aria-expanded',String(open));
  $('.menu-button').setAttribute('aria-label',open?'Close menu':'Open menu');
};
function closeMenu(){
  $('nav').classList.remove('open');
  $('.menu-button').setAttribute('aria-expanded','false');
  $('.menu-button').setAttribute('aria-label','Open menu');
}
$$('nav a').forEach(a=>a.onclick=closeMenu);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});

$$('[data-filter]').forEach(b=>b.onclick=()=>{
  const filter=b.dataset.filter;
  $$('[data-filter]').forEach(x=>{
    x.classList.toggle('active',x===b);
    x.setAttribute('aria-pressed',String(x===b));
  });
  let n=0;
  $$('.accessory-card').forEach(card=>{
    card.hidden=filter!=='all'&&card.dataset.category!==filter;
    if(!card.hidden)n++;
  });
  $('#accessory-count').textContent=n+' essential'+(n===1?'':'s');
});

const scenes=[
  {image:'assets/gallery-night.jpg',alt:'Starry sky reflected in a mountain lake in Jasper, Canada',kicker:'01 / AFTER HOURS',title:'Chase a different light.',credit:'Priscilla Du Preez',url:'https://unsplash.com/photos/XY9tbPYhR34'},
  {image:'assets/gallery-city.jpg',alt:'City lights across a misty mountain waterfront at blue hour',kicker:'02 / THE BLUE HOUR',title:'Find beauty in between.',credit:'Saad Chaudhry',url:'https://unsplash.com/photos/G25LeMV7fAw'},
  {image:'assets/gallery-landscape.jpg',alt:'Warm evening light over a lake and mountains',kicker:'03 / OPEN HORIZONS',title:'Take the long way home.',credit:'Jakob Rosen',url:'https://unsplash.com/photos/Ohzg_QsDpIo'}
];
let scene=0;

function renderScene(){
  const s=scenes[scene];
  $('#gallery-image').src=s.image;
  $('#gallery-image').alt=s.alt;
  $('#gallery-kicker').textContent=s.kicker;
  $('#gallery-title').textContent=s.title;
  $('#photo-credit').textContent='Photography by '+s.credit+' ↗';
  $('#photo-credit').href=s.url;
  $$('[data-scene]').forEach(b=>{
    const active=Number(b.dataset.scene)===scene;
    b.classList.toggle('active',active);
    b.setAttribute('aria-pressed',String(active));
  });
}
$('#gallery-prev').onclick=()=>{scene=(scene+scenes.length-1)%scenes.length;renderScene();};
$('#gallery-next').onclick=()=>{scene=(scene+1)%scenes.length;renderScene();};
$$('[data-scene]').forEach(b=>b.onclick=()=>{scene=Number(b.dataset.scene);renderScene();});

$('#expand-photo').onclick=()=>{
  const s=scenes[scene];
  $('#large-photo').src=s.image;
  $('#large-photo').alt=s.alt;
  $('#large-photo-caption').textContent=s.title+' · Photography by '+s.credit+' / Unsplash. Inspiration photography, not captured on AZURE.';
  openDialog('#photo-dialog');
};

// ── Handset Comparison ───────────────────────────────────────────────────────
const compareOptions = ['ultra','pro','air','one'];
function populateComparePickers(){
  const leftSelect = $('#compare-left'), rightSelect = $('#compare-right');
  const makeOptions = (selected) => compareOptions.map(id=>`<option value="${id}" ${id===selected?'selected':''}>${products[id].name}</option>`).join('');
  leftSelect.innerHTML = makeOptions('ultra');
  rightSelect.innerHTML = makeOptions('pro');
}
populateComparePickers();

function renderCompare(){
  const left=$('#compare-left').value,right=$('#compare-right').value,a=products[left],b=products[right];
  $('#compare-head').innerHTML='<tr><th scope="col">THE DETAILS</th><th scope="col">'+a.name+'</th><th scope="col">'+b.name+'</th></tr>';
  const rows=[
    ['Target Design',a.personality,b.personality],
    ['Display Spec',a.display,b.display],
    ['Optics Array',a.camera,b.camera],
    ['Signature Finish',a.finish,b.finish],
    ['Storage Tiers',a.storage.join(' / '),b.storage.join(' / ')],
    ['Compute Silicon',a.specs?.chip||'A-Series',b.specs?.chip||'A-Series'],
    ['Battery Capacity',a.specs?.battery||'High Endurance',b.specs?.battery||'High Endurance'],
    ['Starting Investment',money(a.base),money(b.base)]
  ];
  $('#compare-body').innerHTML=rows.map(r=>`<tr><th scope="row">${r[0]}</th><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')+`<tr><th scope="row">Personalize</th><td><button class="mini-button" data-product="${left}">Configure ${a.short} ↗</button></td><td><button class="mini-button" data-product="${right}">Configure ${b.short} ↗</button></td></tr>`;
}

$('#compare-left').onchange=()=>{
  if($('#compare-left').value===$('#compare-right').value)$('#compare-right').value=compareOptions.find(x=>x!==$('#compare-left').value);
  renderCompare();
};
$('#compare-right').onchange=()=>{
  if($('#compare-left').value===$('#compare-right').value)$('#compare-left').value=compareOptions.find(x=>x!==$('#compare-right').value);
  renderCompare();
};
renderCompare();

$('#privacy-button').onclick=()=>openDialog('#privacy-dialog');
$('#year').textContent=new Date().getFullYear();
persist();

// ── Smooth Scroll-Based Parallax, Reveal & Tilt ──────────────────────────────
const sectionObserver=new IntersectionObserver(entries=>{
  for(const entry of entries) {
    if(entry.isIntersecting) {
      entry.target.classList.add('in-view');
      $$('nav a').forEach(a=>{
        const active=a.hash==='#'+entry.target.id;
        a.classList.toggle('current',active);
        if(active)a.setAttribute('aria-current','location');
        else a.removeAttribute('aria-current');
      });
    }
  }
},{rootMargin:'-10% 0px -40% 0px'});
$$('section[id]').forEach(section=>sectionObserver.observe(section));

// Parallax movement on scroll for images and background arcs
let lastScrollY = window.scrollY;
window.addEventListener('scroll', ()=>{
  const sc = window.scrollY;
  const heroVisual = $('.hero-visual img');
  const heroArc = $('.hero-arc');
  if(heroVisual && sc < 1200){
    heroVisual.style.transform = `translateY(${sc * 0.12}px) scale(${1 + sc * 0.00015})`;
  }
  if(heroArc && sc < 1200){
    heroArc.style.transform = `rotate(-34deg) translateY(${sc * 0.18}px)`;
  }
  
  // Interactive 3D Card Tilting & Floating on Scroll
  $$('.phone-card, .accessory-card').forEach(card=>{
    const rect = card.getBoundingClientRect();
    if(rect.top < window.innerHeight && rect.bottom > 0){
      const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const shift = (progress - 0.5) * 14;
      const img = card.querySelector('img');
      if(img) img.style.transform = `translateY(${-shift}px) scale(1.02)`;
    }
  });
  lastScrollY = sc;
}, {passive:true});

// Interactive Mouse 3D Tilt for Products
$$('[data-tilt]').forEach(el => {
  el.addEventListener('mousemove', e => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = (-y / (rect.height / 2)) * 6;
    const rotateY = (x / (rect.width / 2)) * 6;
    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  });
});

// ── Luxury Page Loader Lifecycle ─────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', ()=>{
  const loader = document.getElementById('azure-loader');
  if(!loader) return;
  // Progress bar timeline
  const fill = loader.querySelector('.loader-progress-fill');
  const percent = loader.querySelector('.loader-percent');
  let p = 0;
  const interval = setInterval(()=>{
    p += Math.floor(Math.random() * 18) + 12;
    if(p >= 100){
      p = 100;
      clearInterval(interval);
      fill.style.width = '100%';
      if(percent) percent.textContent = '100%';
      setTimeout(()=>{
        loader.classList.add('loader-done');
        document.body.classList.add('page-revealed');
      }, 400);
    } else {
      fill.style.width = p + '%';
      if(percent) percent.textContent = p + '%';
    }
  }, 45);
});
