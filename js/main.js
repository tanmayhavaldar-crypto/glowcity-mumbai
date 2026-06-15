/* ============ GlowCity — Homepage Logic ============ */
let ALL_SALONS = [];
let currentFilter = 'all';
let currentSort = 'rating';
let searchTerm = '';
let areaTerm = '';

document.addEventListener('DOMContentLoaded', init);

async function init(){
  setupNav();
  setupBackToTop();
  ALL_SALONS = await loadSalons();
  populateAreas();
  setupControls();
  setupAI();
  render(); // This draws the salons and pushes the layout down

  /* ============ FIX FOR CROSS-PAGE SCROLLING ============ */
  // Check if we came from another page with a #hashtag in the URL
  if (window.location.hash) {
    // Wait just a tiny fraction of a second for the browser to paint the new cards
    setTimeout(() => {
      const targetSection = document.querySelector(window.location.hash);
      if (targetSection) {
        // Smoothly scroll down to the correct section now that it's in its final position
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150); 
  }
}

/* ---- Header / mobile nav ---- */
function setupNav(){
  const toggle = document.getElementById('navToggle');
  const mobile = document.getElementById('mobileNav');
  if(toggle) toggle.addEventListener('click',()=>mobile.classList.toggle('open'));
  document.querySelectorAll('#mobileNav a').forEach(a=>a.addEventListener('click',()=>mobile.classList.remove('open')));
}
function setupBackToTop(){
  const btn = document.getElementById('backToTop');
  if(!btn) return;
  window.addEventListener('scroll',()=>btn.classList.toggle('show',window.scrollY>500));
  btn.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
}

/* ---- Populate area dropdown + stats ---- */
function populateAreas(){
  const sel = document.getElementById('areaFilter');
  const areas = [...new Set(ALL_SALONS.map(s=>s.area))].sort();
  areas.forEach(a=>{
    const o = document.createElement('option'); o.value=a; o.textContent=a; sel.appendChild(o);
  });
  const stat = document.getElementById('statSalons');
  if(stat) stat.textContent = ALL_SALONS.length>=10 ? '500+' : ALL_SALONS.length;
}

/* ---- Controls ---- */
function setupControls(){
  document.getElementById('searchInput').addEventListener('input',e=>{searchTerm=e.target.value.toLowerCase();render();});
  document.getElementById('areaFilter').addEventListener('change',e=>{areaTerm=e.target.value;render();});
  document.getElementById('searchBtn').addEventListener('click',()=>{document.getElementById('salons').scrollIntoView({behavior:'smooth'});render();});
  document.getElementById('sortSelect').addEventListener('change',e=>{currentSort=e.target.value;render();});

  document.querySelectorAll('.chip').forEach(chip=>{
    chip.addEventListener('click',()=>{
      document.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
      chip.classList.add('active');
      currentFilter = chip.dataset.filter;
      render();
    });
  });
  document.querySelectorAll('.category-card').forEach(card=>{
    card.addEventListener('click',()=>{
      currentFilter = card.dataset.cat;
      document.querySelectorAll('.chip').forEach(c=>c.classList.toggle('active',c.dataset.filter===currentFilter));
      document.getElementById('salons').scrollIntoView({behavior:'smooth'});
      render();
    });
  });
}

/* ---- Favorites Helper ---- */
function getFavorites() {
  try { return JSON.parse(localStorage.getItem('glowcity_favs') || '[]'); } 
  catch(e) { return []; }
}

/* ---- Filtering + render ---- */
function getFiltered(){
  let list = [...ALL_SALONS];
  
  if(currentFilter==='featured') list = list.filter(s=>s.featured);
  else if(currentFilter==='favorites') {
    const favs = getFavorites();
    list = list.filter(s=>favs.includes(s.id));
  }
  else if(currentFilter!=='all') list = list.filter(s=>s.category===currentFilter);
  
  if(areaTerm) list = list.filter(s=>s.area===areaTerm);
  if(searchTerm){
    list = list.filter(s=>
      s.name.toLowerCase().includes(searchTerm) ||
      s.area.toLowerCase().includes(searchTerm) ||
      s.category.toLowerCase().includes(searchTerm) ||
      (s.services||[]).some(sv=>sv.toLowerCase().includes(searchTerm))
    );
  }
  if(currentSort==='rating') list.sort((a,b)=>b.rating-a.rating);
  else if(currentSort==='reviews') list.sort((a,b)=>b.reviews_count-a.reviews_count);
  else if(currentSort==='name') list.sort((a,b)=>a.name.localeCompare(b.name));
  return list;
}

function render(){
  const grid = document.getElementById('salonGrid');
  const empty = document.getElementById('emptyState');
  const list = getFiltered();
  grid.innerHTML = '';
  empty.hidden = list.length>0;
  
  if(list.length === 0 && currentFilter === 'favorites') {
    empty.querySelector('p').textContent = "You haven't saved any salons yet. Click the heart icon to save your favorites!";
  } else {
    empty.querySelector('p').textContent = "No salons match your search. Try a different filter.";
  }

  list.forEach(s=>grid.appendChild(salonCard(s)));
}

function salonCard(s){
  const el = document.createElement('article');
  el.className='salon-card';
  const svc = (s.services||[]).slice(0,3).map(x=>`<span>${x}</span>`).join('');
  
  const isFav = getFavorites().includes(s.id);
  const heartClass = isFav ? 'fas' : 'far';

  el.innerHTML = `
    <div class="salon-media">
      <img src="${s.image}" alt="${s.name}" loading="lazy">
      <div class="salon-badges">
        ${s.featured?'<span class="badge badge-featured"><i class="fas fa-star"></i> Featured</span>':''}
        ${s.verified?'<span class="badge badge-verified"><i class="fas fa-circle-check"></i> Verified</span>':''}
      </div>
      <button class="salon-fav" aria-label="Save"><i class="${heartClass} fa-heart"></i></button>
      <span class="salon-cat">${s.category}</span>
    </div>
    <div class="salon-body">
      <h3 class="salon-name">${s.name}</h3>
      <p class="salon-loc"><i class="fas fa-location-dot"></i> ${s.area}</p>
      <div class="salon-meta">
        <span class="salon-rating"><i class="fas fa-star"></i> ${s.rating} <small style="color:var(--muted);font-weight:500">(${s.reviews_count})</small></span>
        <span class="salon-price">${s.price_level}</span>
      </div>
      <div class="salon-services">${svc}</div>
      <div class="salon-foot">
        <a href="salon.html?id=${s.id}" class="btn btn-outline">View Details</a>
        <a href="salon.html?id=${s.id}#book" class="btn btn-primary">Book Now</a>
      </div>
    </div>`;
    
  const favBtn = el.querySelector('.salon-fav');
  favBtn.addEventListener('click', e => {
    e.preventDefault();
    let favs = getFavorites();
    const icon = favBtn.querySelector('i');
    
    if (favs.includes(s.id)) {
      favs = favs.filter(id => id !== s.id);
      icon.className = 'far fa-heart';
    } else {
      favs.push(s.id);
      icon.className = 'fas fa-heart';
    }
    
    localStorage.setItem('glowcity_favs', JSON.stringify(favs));
    if(currentFilter === 'favorites') render();
  });
  
  return el;
}

/* ============ AI Beauty Concierge ============ */
function setupAI(){
  document.querySelectorAll('.ai-chips button').forEach(b=>{
    b.addEventListener('click',()=>{document.getElementById('aiInput').value=b.dataset.q;runAI(b.dataset.q);});
  });
  document.getElementById('aiAsk').addEventListener('click',()=>runAI(document.getElementById('aiInput').value));
  document.getElementById('aiInput').addEventListener('keydown',e=>{if(e.key==='Enter')runAI(e.target.value);});
}

function runAI(query){
  const box = document.getElementById('aiResult');
  if(!query || !query.trim()){box.hidden=true;return;}
  const q = query.toLowerCase();
  let scored = ALL_SALONS.map(s=>{
    let score=0;
    const hay = (s.name+' '+s.category+' '+s.area+' '+(s.services||[]).join(' ')+' '+(s.amenities||[]).join(' ')).toLowerCase();
    
    const intents = {
      'bridal':'Bridal Studio','wedding':'Bridal Studio','makeup':'Bridal Studio',
      'spa':'Luxury Spa','massage':'Luxury Spa','relax':'Luxury Spa','couple':'Luxury Spa',
      'men':"Men's Grooming",'beard':"Men's Grooming",'shave':"Men's Grooming",'barber':"Men's Grooming",
      'home':'Home Service','doorstep':'Home Service',
      'women':"Women's Salon",'ladies':"Women's Salon"
    };
    for(const k in intents){ if(q.includes(k) && s.category===intents[k]) score+=5; }
    
    if(hay.split(' ').some(w=>q.includes(w)&&w.length>3)) score+=2;
    s.area.toLowerCase().split(' ').forEach(w=>{if(q.includes(w)&&w.length>3) score+=4;});
    (s.services||[]).forEach(sv=>{ if(q.includes(sv.toLowerCase())) score+=3; });
    if((q.includes('cheap')||q.includes('affordable')||q.includes('budget')) && (s.price_level==='₹'||s.price_level==='₹₹')) score+=3;
    if((q.includes('luxury')||q.includes('premium')||q.includes('best')) && s.price_level.length>=3) score+=3;
    
    score += s.rating;
    return {s,score};
  }).sort((a,b)=>b.score-a.score).slice(0,3);

  box.hidden=false;
  box.innerHTML = `<h4><i class="fas fa-wand-magic-sparkles"></i> Top picks for you</h4>` +
    scored.map(({s})=>`
      <div class="ai-rec">
        <img src="${s.image}" alt="${s.name}">
        <div class="ai-rec-info">
          <strong>${s.name}</strong>
          <small><i class="fas fa-location-dot"></i> ${s.area} · ⭐ ${s.rating} · ${s.price_level}</small>
        </div>
        <a href="salon.html?id=${s.id}">View →</a>
      </div>`).join('');
}

/* ============ Dark Mode Logic ============ */
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('darkModeToggle');
  const body = document.body;
  
  if(!themeToggle) return;
  const icon = themeToggle.querySelector('i');

  const currentTheme = localStorage.getItem('glowcity_theme');
  if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
    icon.classList.replace('fa-moon', 'fa-sun');
  }

  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
      localStorage.setItem('glowcity_theme', 'dark');
      icon.classList.replace('fa-moon', 'fa-sun');
    } else {
      localStorage.setItem('glowcity_theme', 'light');
      icon.classList.replace('fa-sun', 'fa-moon');
    }
  });
});