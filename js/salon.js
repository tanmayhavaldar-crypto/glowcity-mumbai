/* ============ Salon Detail + Booking Logic ============ */
let SALON = null;
let selectedSlot = '';

const SAMPLE_REVIEWS = [
  {name:"Priya S.",stars:5,text:"Absolutely loved my experience! The staff was professional and the ambience was so relaxing. Will definitely come back."},
  {name:"Rahul M.",stars:5,text:"Best in the area, hands down. Booking through GlowCity was super smooth and they were ready right on time."},
  {name:"Ananya K.",stars:4,text:"Great service and very hygienic. Slightly busy on weekends so book in advance, but worth it!"}
];

document.addEventListener('DOMContentLoaded', start);

async function start(){
  const id = new URLSearchParams(location.search).get('id');
  SALON = await loadSalon(id);
  if(!SALON){ document.getElementById('salonMain').innerHTML = errorBlock(); return; }
  renderDetail();
  setupBooking();
  if(location.hash==='#book'){ setTimeout(()=>document.getElementById('bookCard')?.scrollIntoView({behavior:'smooth'}),200); }
}

function errorBlock(){
  return `<div class="loading"><p>Sorry, we couldn't find that salon.</p><a href="index.html" class="btn btn-primary" style="margin-top:1rem">← Back to Home</a></div>`;
}

function starsHtml(r){let h='';for(let i=0;i<Math.round(r);i++)h+='<i class="fas fa-star"></i>';return h;}

function renderDetail(){
  const s = SALON;
  const main = document.getElementById('salonMain');
  const services = (s.services||[]).map(sv=>`<div class="svc-item" data-svc="${sv}"><i class="fas fa-check-circle"></i> ${sv}</div>`).join('');
  const amenities = (s.amenities||[]).map(a=>`<span><i class="fas fa-check"></i> ${a}</span>`).join('');
  const svcOptions = (s.services||[]).map(sv=>`<option value="${sv}">${sv}</option>`).join('');
  const reviews = SAMPLE_REVIEWS.map(r=>`
    <div class="review">
      <div class="review-head">
        <span class="review-av">${r.name[0]}</span>
        <div><div class="review-name">${r.name}</div><div class="review-stars">${starsHtml(r.stars)}</div></div>
      </div>
      <p>${r.text}</p>
    </div>`).join('');

  main.innerHTML = `
    <section class="detail-hero">
      <img src="${s.image}" alt="${s.name}">
      <div class="detail-hero-content">
        <div class="container detail-hero-inner">
          <nav class="breadcrumb"><a href="index.html">Home</a> / <a href="index.html#salons">Salons</a> / ${s.name}</nav>
          <div class="detail-title-row">
            <div>
              <h1 class="detail-title">${s.name}</h1>
              <div class="detail-tags">
                <span class="rt"><i class="fas fa-star"></i> ${s.rating} (${s.reviews_count} reviews)</span>
                <span><i class="fas fa-location-dot"></i> ${s.area}</span>
                <span>${s.category}</span>
                <span>${s.price_level}</span>
                ${s.verified?'<span><i class="fas fa-circle-check"></i> Verified</span>':''}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="container detail-layout">
      <div class="detail-content">
        <div class="detail-card">
          <h2>About</h2>
          <p>${s.description||''}</p>
          <div class="about-meta">
            <div><i class="fas fa-location-dot"></i> ${s.address||s.area}</div>
            <div><i class="fas fa-clock"></i> ${s.open_hours||'10 AM - 9 PM'}</div>
            <div><i class="fas fa-phone"></i> ${s.phone||'+91 98200 00000'}</div>
          </div>
        </div>

        <div class="detail-card">
          <h2>Services Offered</h2>
          <div class="svc-list">${services}</div>
        </div>

        <div class="detail-card">
          <h2>Amenities</h2>
          <div class="amenity-list">${amenities}</div>
        </div>

        <div class="detail-card reviews">
          <h2>What Customers Say</h2>
          ${reviews}
        </div>
      </div>

      <aside class="booking-widget">
        <div class="booking-card" id="bookCard">
          <h3>Book Appointment</h3>
          <p class="sub">Secure your slot in seconds — pay at the salon.</p>
          <form id="bookingForm" novalidate onsubmit="return false;">
            <div class="form-group">
              <label for="bName">Your Name *</label>
              <input type="text" id="bName" placeholder="e.g. Aisha Khan">
              <div class="err-msg" id="errName">Please enter your name.</div>
            </div>
            <div class="form-group">
              <label for="bPhone">Phone Number *</label>
              <input type="tel" id="bPhone" placeholder="10-digit mobile number">
              <div class="err-msg" id="errPhone">Enter a valid 10-digit number.</div>
            </div>
            <div class="form-group">
              <label for="bService">Service *</label>
              <select id="bService"><option value="">Select a service</option>${svcOptions}</select>
              <div class="err-msg" id="errService">Please choose a service.</div>
            </div>
            <div class="form-group">
              <label for="bDate">Date *</label>
              <input type="date" id="bDate">
              <div class="err-msg" id="errDate">Please pick a date.</div>
            </div>
            <div class="form-group">
              <label>Time Slot *</label>
              <div class="time-slots" id="timeSlots">
                ${['10:00 AM','11:30 AM','01:00 PM','02:30 PM','04:00 PM','05:30 PM','07:00 PM'].map(t=>`<span class="slot" data-t="${t}">${t}</span>`).join('')}
              </div>
              <div class="err-msg" id="errSlot">Please select a time slot.</div>
            </div>
            <div class="form-group">
              <label for="bNotes">Special Requests (optional)</label>
              <textarea id="bNotes" placeholder="Any preferences or requests…"></textarea>
            </div>
            <button type="button" onclick="submitBooking(event)" class="btn btn-primary book-submit"><i class="fas fa-calendar-check"></i> Confirm Booking</button>
          </form>
        </div>
      </aside>
    </div>`;

  const dt = document.getElementById('bDate');
  dt.min = new Date().toISOString().split('T')[0];

  main.querySelectorAll('.svc-item').forEach(item=>{
    item.addEventListener('click',()=>{
      document.getElementById('bService').value = item.dataset.svc;
      document.getElementById('bookCard').scrollIntoView({behavior:'smooth'});
    });
  });
}

function setupBooking(){
  document.querySelectorAll('.slot').forEach(s=>{
    s.addEventListener('click',()=>{
      document.querySelectorAll('.slot').forEach(x=>x.classList.remove('active'));
      s.classList.add('active'); selectedSlot=s.dataset.t;
      document.getElementById('errSlot').style.display='none';
    });
  });

  document.getElementById('closeModal').addEventListener('click',()=>{
    document.getElementById('successModal').style.display = 'none';
    document.getElementById('bookingForm').reset();
    document.querySelectorAll('.slot').forEach(x=>x.classList.remove('active'));
    selectedSlot='';
  });
  // Move to next field on Enter
document.getElementById('bookingForm').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    const focusable = Array.from(this.querySelectorAll(
      'input, select, textarea, button'
    )).filter(el => !el.disabled);
    const currentIndex = focusable.indexOf(document.activeElement);
    if (currentIndex < focusable.length - 1) {
      focusable[currentIndex + 1].focus();
    }
  }
});
}

async function submitBooking(e){
  e.preventDefault();
  const name = document.getElementById('bName').value.trim();
  const phone = document.getElementById('bPhone').value.trim();
  const service = document.getElementById('bService').value;
  const date = document.getElementById('bDate').value;
  const notes = document.getElementById('bNotes').value.trim();
  let ok = true;

  const setErr = (field,errId,bad)=>{
    document.getElementById(field).classList.toggle('field-error',bad);
    document.getElementById(errId).style.display = bad?'block':'none';
    if(bad) ok=false;
  };
  setErr('bName','errName',!name);
  setErr('bPhone','errPhone',!/^\d{10}$/.test(phone.replace(/\D/g,'').slice(-10)) || phone.replace(/\D/g,'').length<10);
  setErr('bService','errService',!service);
  setErr('bDate','errDate',!date);
  if(!selectedSlot){document.getElementById('errSlot').style.display='block';ok=false;}

  if(!ok) return;

  const btn = document.querySelector('.book-submit');
  btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking…';

  try {
    await createBooking({
      salon_id: SALON.id, salon_name: SALON.name,
      customer_name: name, customer_phone: phone,
      service, date, time: selectedSlot, notes, status:'Pending'
    });
  } catch(err) {
    // createBooking failed but we still confirm locally
  }

  btn.disabled = false; 
  btn.innerHTML = '<i class="fas fa-calendar-check"></i> Confirm Booking';
  
  // Save booking locally regardless
  const newBooking = {
    id: Date.now(),
    salonName: SALON.name,
    service, date,
    time: selectedSlot,
    name, status: 'Confirmed'
  };
  let saved = JSON.parse(localStorage.getItem('glowcity_bookings') || '[]');
  saved.push(newBooking);
  localStorage.setItem('glowcity_bookings', JSON.stringify(saved));

  document.getElementById('successText').textContent =
    `Your ${service} appointment at ${SALON.name} on ${date} at ${selectedSlot} is requested. The salon will confirm shortly.`;
    
  document.getElementById('successModal').style.display = 'grid';
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