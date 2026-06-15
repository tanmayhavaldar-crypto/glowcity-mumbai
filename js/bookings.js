/* ============ Force Dark Mode on Load ============ */
if (localStorage.getItem('glowcity_theme') === 'dark') {
  document.documentElement.classList.add('dark-mode');
  document.body.classList.add('dark-mode');
}

let ALL_SALONS = [];
let pendingCancelId = null; // Remembers which booking we are trying to cancel

document.addEventListener('DOMContentLoaded', async () => {
  setupDarkMode();
  setupModalListeners(); // Set up our custom popup buttons
  
  if (typeof loadSalons === 'function') {
    try {
      ALL_SALONS = await loadSalons();
    } catch(e) {
      console.log("Could not load salon database.");
    }
  }
  
  loadAndRenderBookings();
});

/* ---- Render Bookings from Local Storage ---- */
function loadAndRenderBookings() {
  const listContainer = document.getElementById('bookingsList');
  const emptyState = document.getElementById('emptyBookings');
  const clearBtn = document.getElementById('clearHistoryBtn');
  
  let bookings = [];
  try {
    bookings = JSON.parse(localStorage.getItem('glowcity_bookings') || '[]');
  } catch(e) {
    console.error("Error loading bookings", e);
  }

  // Update Stats at the top
  document.getElementById('statTotal').textContent = bookings.length;
  document.getElementById('statPending').textContent = bookings.filter(b => b.status === 'Pending').length;
  document.getElementById('statConfirmed').textContent = bookings.filter(b => b.status === 'Confirmed' || !b.status).length;
  document.getElementById('statCompleted').textContent = bookings.filter(b => b.status === 'Completed').length;

  listContainer.innerHTML = '';

  // Show empty state and HIDE clear button if no bookings
  if (bookings.length === 0) {
    emptyState.hidden = false;
    if(clearBtn) clearBtn.style.display = 'none';
    return;
  }
  
  emptyState.hidden = true;
  if(clearBtn) clearBtn.style.display = 'inline-flex';

  const reversedBookings = [...bookings].reverse();
  
  reversedBookings.forEach(b => {
    const el = document.createElement('div');
    el.className = 'booking-item';

    const statusText = b.status || 'Confirmed';
    
    let finalSalonName = b.salonName || b.salon || b.shopName;
    if (!finalSalonName && b.salonId && ALL_SALONS.length > 0) {
        const foundSalon = ALL_SALONS.find(s => String(s.id) === String(b.salonId));
        if (foundSalon) finalSalonName = foundSalon.name;
    }
    finalSalonName = finalSalonName || 'Salon Appointment';

    let actionHtml = '';
    if (statusText !== 'Cancelled' && statusText !== 'Completed') {
      actionHtml = `<button class="btn btn-outline btn-cancel" onclick="requestCancelBooking('${b.id}')" style="margin-top: 1rem; padding: 0.4rem 1.2rem; font-size: 0.85rem; border-color: #ff477e; color: #ff477e; background:transparent;">Cancel Appointment</button>`;
    }

    el.innerHTML = `
      <div class="booking-icon">
        <i class="fas fa-scissors"></i>
      </div>
      <div class="booking-info">
        <h3>${finalSalonName}</h3>
        <div class="booking-meta">
          <span><i class="fas fa-spa"></i> ${b.service || 'General Service'}</span>
          <span><i class="far fa-calendar-alt"></i> ${b.date || 'Date TBD'}</span>
          <span><i class="far fa-clock"></i> ${b.time || 'Time TBD'}</span>
          <span><i class="far fa-user"></i> ${b.name || 'Guest'}</span>
        </div>
        ${actionHtml}
      </div>
      <div class="badge-status" style="${statusText === 'Cancelled' ? 'background: rgba(255,0,0,0.1); color: #ff3333;' : ''}">${statusText}</div>
    `;
    
    listContainer.appendChild(el);
  });
}

/* ==============================================
   CUSTOM IN-PAGE MODAL LOGIC
   ============================================== */

// 1. Trigger the Cancel Modal
window.requestCancelBooking = function(id) {
  pendingCancelId = id; // Remember the ID
  document.getElementById('cancelModal').style.display = 'flex';
};

// 2. Trigger the Clear History Modal
window.requestClearHistory = function() {
  document.getElementById('clearModal').style.display = 'flex';
};

// 3. Close Modal Helper
window.closeModal = function(modalId) {
  document.getElementById(modalId).style.display = 'none';
  if(modalId === 'cancelModal') pendingCancelId = null;
};

// 4. Listeners for the "Yes" buttons inside the modals
function setupModalListeners() {
  
  // Actually Cancel the Booking
  document.getElementById('confirmCancelBtn').addEventListener('click', () => {
    if (pendingCancelId) {
      let bookings = JSON.parse(localStorage.getItem('glowcity_bookings') || '[]');
      const bookingIndex = bookings.findIndex(b => String(b.id) === String(pendingCancelId));
      
      if (bookingIndex > -1) {
        bookings[bookingIndex].status = 'Cancelled';
        localStorage.setItem('glowcity_bookings', JSON.stringify(bookings));
        loadAndRenderBookings(); 
      }
    }
    closeModal('cancelModal');
  });

  // Actually Clear the History
  document.getElementById('confirmClearBtn').addEventListener('click', () => {
    localStorage.removeItem('glowcity_bookings');
    loadAndRenderBookings();
    closeModal('clearModal');
  });
}

/* ---- Dark Mode Logic ---- */
function setupDarkMode() {
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
}