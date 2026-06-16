/* ============ List Your Salon Logic ============ */
const COMMON_SERVICES = ['Haircut','Hair Color','Hair Spa','Keratin','Facial','Waxing','Threading','Manicure & Pedicure','Bridal Makeup','Massage','Beard Trim','Shave','Nail Art','Body Polishing'];

document.addEventListener('DOMContentLoaded', () => {
  // Build service checkboxes
  const wrap = document.getElementById('svcChecks');
  if (wrap) {
    wrap.innerHTML = COMMON_SERVICES.map(s => `<label><input type="checkbox" value="${s}"> ${s}</label>`).join('');
  }

  // Look for our NEW secure form ID
  const secureForm = document.getElementById('secureListForm');
  if (secureForm) {
    secureForm.addEventListener('submit', submitListing);
  }
});

async function submitListing(e) {
  e.preventDefault(); // Stop page reload
  
  // 👉 THE NUCLEAR OPTION: This stops any other global scripts from seeing this form submission!
  e.stopPropagation(); 

  const get = id => document.getElementById(id).value.trim();
  const name = get('lName'), area = get('lArea'), category = document.getElementById('lCategory').value, phone = get('lPhone');
  
  let ok = true;
  const setErr = (field, errId, bad) => {
    document.getElementById(field).classList.toggle('field-error', bad);
    document.getElementById(errId).style.display = bad ? 'block' : 'none';
    if (bad) ok = false;
  };

  // Force check the inputs (Fallback just in case HTML validation fails)
  setErr('lName', 'lErrName', !name);
  setErr('lArea', 'lErrArea', !area);
  setErr('lCategory', 'lErrCat', !category);
  setErr('lPhone', 'lErrPhone', phone.replace(/\D/g, '').length < 10);
  
  // If anything is empty, STOP HERE. Do not show success modal!
  if (!ok) return;

  const services = [...document.querySelectorAll('#svcChecks input:checked')].map(c => c.value);
  const payload = {
    id: 'u' + Date.now(),
    name, area, address: get('lAddress') || area,
    category, price_level: document.getElementById('lPrice').value,
    phone, open_hours: get('lHours') || '10:00 AM - 9:00 PM',
    image: get('lImage') || 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=80',
    description: get('lDesc') || 'A great salon on GlowCity Mumbai.',
    services: services.length ? services : ['Haircut', 'Facial'],
    amenities: ['Card Payment', 'AC']
  };

  const btn = e.target.querySelector('button[type="submit"]');
  if (btn) {
    btn.disabled = true; 
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting…';
  }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  if (btn) {
    btn.disabled = false; 
    btn.innerHTML = '<i class="fas fa-store"></i> Submit Listing';
  }
  
  // ONLY show success modal if we made it this far
  document.getElementById('successText').textContent = `${name} in ${area} is now listed on GlowCity Mumbai. 🎉`;
  document.getElementById('successModal').hidden = false;
}

/* ============ Dark Mode Logic ============ */
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('darkModeToggle');
  const body = document.body;
  if(!themeToggle) return;
  const icon = themeToggle.querySelector('i');

  if (localStorage.getItem('glowcity_theme') === 'dark') {
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