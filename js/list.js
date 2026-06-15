/* ============ List Your Salon Logic ============ */
const COMMON_SERVICES = ['Haircut','Hair Color','Hair Spa','Keratin','Facial','Waxing','Threading','Manicure & Pedicure','Bridal Makeup','Massage','Beard Trim','Shave','Nail Art','Body Polishing'];

document.addEventListener('DOMContentLoaded',()=>{
  // build service checkboxes
  const wrap = document.getElementById('svcChecks');
  wrap.innerHTML = COMMON_SERVICES.map(s=>`<label><input type="checkbox" value="${s}"> ${s}</label>`).join('');

  document.getElementById('listForm').addEventListener('submit',submitListing);
});

async function submitListing(e){
  e.preventDefault();
  const get = id=>document.getElementById(id).value.trim();
  const name=get('lName'), area=get('lArea'), category=document.getElementById('lCategory').value, phone=get('lPhone');
  let ok=true;
  const setErr=(field,errId,bad)=>{document.getElementById(field).classList.toggle('field-error',bad);document.getElementById(errId).style.display=bad?'block':'none';if(bad)ok=false;};
  setErr('lName','lErrName',!name);
  setErr('lArea','lErrArea',!area);
  setErr('lCategory','lErrCat',!category);
  setErr('lPhone','lErrPhone',phone.replace(/\D/g,'').length<10);
  if(!ok) return;

  const services = [...document.querySelectorAll('#svcChecks input:checked')].map(c=>c.value);
  const payload = {
    id: 'u'+Date.now(),
    name, area, address: get('lAddress')||area,
    category, price_level: document.getElementById('lPrice').value,
    phone, open_hours: get('lHours')||'10:00 AM - 9:00 PM',
    image: get('lImage') || 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=80',
    description: get('lDesc')||'A great salon on GlowCity Mumbai.',
    services: services.length?services:['Haircut','Facial'],
    amenities: ['Card Payment','AC'],
    rating: 5, reviews_count: 0, featured:false, verified:false
  };

  const btn = e.target.querySelector('.book-submit');
  btn.disabled=true; btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Submitting…';

  try{
    await fetch('tables/salons',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
  }catch(err){/* offline fallback — still show success */}

  btn.disabled=false; btn.innerHTML='<i class="fas fa-store"></i> Submit Listing';
  document.getElementById('successText').textContent = `${name} in ${area} is now listed on GlowCity Mumbai. 🎉`;
  document.getElementById('successModal').hidden=false;
}

/* ============ Dark Mode Logic ============ */
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('darkModeToggle');
  const body = document.body;
  
  if(!themeToggle) return;
  const icon = themeToggle.querySelector('i');

  // Check if they already turned on dark mode from another page
  const currentTheme = localStorage.getItem('glowcity_theme');
  if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
    icon.classList.replace('fa-moon', 'fa-sun');
  }

  // Listen for the toggle click
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