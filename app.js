/* ----------------------------------------------------
   STUDENT iPHONE 17 PRO MAX REWARDS — APP LOGIC
---------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

  // --- STATE ---
  const currentRegistration = {
    name: 'Chakradhar',
    mobile: '9876543210',
    city: 'Mumbai',
    regId: 'STU-284729',
    timestamp: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  };

  function saveRegistrationToStorage(reg) {
    const existing = JSON.parse(localStorage.getItem('student_registrations') || '[]');
    existing.unshift(reg);
    localStorage.setItem('student_registrations', JSON.stringify(existing));
  }

  function findRegistrationInStorage(query) {
    const cleanQuery = query.trim().toLowerCase();
    const existing = JSON.parse(localStorage.getItem('student_registrations') || '[]');
    
    const found = existing.find(r => 
      r.regId.toLowerCase() === cleanQuery || 
      r.mobile.includes(cleanQuery)
    );

    if (found) return found;

    if (cleanQuery.includes('284729') || cleanQuery.includes('98765')) {
      return currentRegistration;
    }

    return null;
  }


  // --- MODALS ---
  const modalOverlays = document.querySelectorAll('.modal-overlay');
  const regModal = document.getElementById('registrationModal');
  const payModal = document.getElementById('paymentModal');
  const successModal = document.getElementById('successModal');
  const statusModal = document.getElementById('statusModal');

  function openModal(modal) {
    closeAllModals();
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeAllModals() {
    modalOverlays.forEach(modal => {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    });
    document.body.style.overflow = '';
  }

  // Open Handlers
  document.getElementById('heroCtaBtn')?.addEventListener('click', () => openModal(regModal));
  document.getElementById('mobileCtaBtn')?.addEventListener('click', () => openModal(regModal));
  document.getElementById('openStatusBtn')?.addEventListener('click', () => openModal(statusModal));

  // Close Handlers
  document.getElementById('closeRegModal')?.addEventListener('click', closeAllModals);
  document.getElementById('closePayModal')?.addEventListener('click', closeAllModals);
  document.getElementById('closeSuccessBtn')?.addEventListener('click', closeAllModals);
  document.getElementById('closeStatusModal')?.addEventListener('click', closeAllModals);

  modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeAllModals();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });


  // --- STEP 1: REGISTRATION FORM ---
  const registrationForm = document.getElementById('registrationForm');
  if (registrationForm) {
    registrationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('regName').value.trim();
      const mobileInput = document.getElementById('regMobile').value.trim();
      const citySelect = document.getElementById('regCity').value;

      if (!nameInput || !mobileInput || !citySelect) {
        alert('Please complete all registration fields.');
        return;
      }

      if (mobileInput.length < 10) {
        alert('Please enter a valid 10-digit Indian mobile number.');
        return;
      }

      // Save user details
      currentRegistration.name = nameInput;
      currentRegistration.mobile = mobileInput;
      currentRegistration.city = citySelect;

      // Update payment screen details
      document.getElementById('paySummaryName').textContent = currentRegistration.name;
      document.getElementById('paySummaryMobile').textContent = `+91 ${currentRegistration.mobile.replace(/(\d{5})(\d{5})/, '$1 $2')}`;

      // IMMEDIATELY OPEN PAYMENT SECTION AFTER REGISTRATION
      openModal(payModal);
    });
  }


  // --- PAYMENT TABS ---
  const payTabs = document.querySelectorAll('.pay-tab');
  const tabContents = document.querySelectorAll('.tab-content');

  payTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');

      payTabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const targetEl = document.getElementById(`tab${targetTab.charAt(0).toUpperCase() + targetTab.slice(1)}`);
      if (targetEl) targetEl.classList.add('active');
    });
  });

  const upiCards = document.querySelectorAll('.upi-card');
  upiCards.forEach(card => {
    card.addEventListener('click', () => {
      upiCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    });
  });


  // --- STEP 2 & 3: PAYMENT PROCESSOR & UNIQUE ID CREATION ---
  const paySubmitBtn = document.getElementById('paySubmitBtn');
  const payBtnText = document.getElementById('payBtnText');
  const payLoader = document.getElementById('payLoader');

  if (paySubmitBtn) {
    paySubmitBtn.addEventListener('click', () => {
      paySubmitBtn.disabled = true;
      payBtnText.classList.add('hidden');
      payLoader.classList.remove('hidden');

      setTimeout(() => {
        // CREATE UNIQUE REGISTRATION ID
        const randomId = 'STU-' + Math.floor(100000 + Math.random() * 900000);
        currentRegistration.regId = randomId;
        currentRegistration.timestamp = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

        // Save complete record
        saveRegistrationToStorage(currentRegistration);

        paySubmitBtn.disabled = false;
        payBtnText.classList.remove('hidden');
        payLoader.classList.add('hidden');

        // Render Success Digital Ticket
        document.getElementById('successRegId').textContent = currentRegistration.regId;
        document.getElementById('successName').textContent = currentRegistration.name;
        document.getElementById('successMobile').textContent = `+91 ${currentRegistration.mobile.replace(/(\d{5})(\d{5})/, '$1 $2')}`;

        // Show Success Modal
        openModal(successModal);

        // Confetti animation
        if (typeof confetti === 'function') {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      }, 1200);
    });
  }


  // --- SUCCESS ACTIONS ---
  const viewRegistrationBtn = document.getElementById('viewRegistrationBtn');
  const whatsappBtn = document.getElementById('whatsappBtn');

  if (viewRegistrationBtn) {
    viewRegistrationBtn.addEventListener('click', () => {
      const ticket = document.querySelector('.digital-ticket');
      if (ticket) {
        ticket.style.transform = 'scale(1.04)';
        ticket.style.transition = 'all 0.3s ease';
        setTimeout(() => ticket.style.transform = 'scale(1)', 350);
      }
    });
  }

  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      const text = encodeURIComponent(
        `🎉 *Registration Confirmed!*\n\n` +
        `Campaign: iPhone 17 Pro Max Student Reward\n` +
        `Registration ID: ${currentRegistration.regId}\n` +
        `Name: ${currentRegistration.name}\n` +
        `Amount Paid: ₹599 (Confirmed)\n\n` +
        `Verified Pass: https://studentrewards.in/status?id=${currentRegistration.regId}`
      );
      window.open(`https://wa.me/?text=${text}`, '_blank');
    });
  }


  // --- STATUS LOOKUP ---
  const statusSearchForm = document.getElementById('statusSearchForm');
  const statusQueryInput = document.getElementById('statusQueryInput');
  const statusResultContainer = document.getElementById('statusResultContainer');

  if (statusSearchForm) {
    statusSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = statusQueryInput.value;
      const result = findRegistrationInStorage(query);

      statusResultContainer.classList.remove('hidden');

      if (result) {
        statusResultContainer.innerHTML = `
          <div style="font-size:0.78rem; font-weight:800; color:#059669; margin-bottom:4px;">✓ VERIFIED REGISTRATION RECORD</div>
          <div style="font-family:var(--font-heading); font-size:1.2rem; font-weight:800; color:var(--gold-primary);">${result.regId}</div>
          <div style="font-size:0.85rem; color:var(--text-sub); margin-top:4px; display:flex; flex-direction:column; gap:2px;">
            <div><strong>Name:</strong> ${result.name}</div>
            <div><strong>Mobile:</strong> +91 ${result.mobile}</div>
            <div><strong>Campaign:</strong> iPhone 17 Pro Max (₹599)</div>
            <div><strong>Status:</strong> Verified • Insured Allocation Queue</div>
          </div>
        `;
      } else {
        statusResultContainer.innerHTML = `
          <div style="font-size:0.78rem; font-weight:800; color:#dc2626; margin-bottom:4px;">✕ NO RECORD MATCHED</div>
          <div style="font-size:0.85rem; color:var(--text-sub);">
            No active registration matched "<strong>${query}</strong>". Please click "I'M INTERESTED" on the main page to register.
          </div>
        `;
      }
    });
  }


  // --- FAQ ACCORDION ---
  const faqQuestions = document.querySelectorAll('.faq-q');
  faqQuestions.forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const isActive = item.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

      if (!isActive) item.classList.add('active');
    });
  });


  // --- LIVE PROOF TICKER ---
  const tickerText = document.getElementById('tickerText');
  const sampleClaims = [
    { name: 'Rohan V.', city: 'Bengaluru', id: 'STU-892401', count: '178/200' },
    { name: 'Aarav M.', city: 'Mumbai', id: 'STU-512039', count: '181/200' },
    { name: 'Diya K.', city: 'Delhi NCR', id: 'STU-940218', count: '184/200' },
    { name: 'Karan P.', city: 'Hyderabad', id: 'STU-631044', count: '187/200' },
    { name: 'Tanvi S.', city: 'Pune', id: 'STU-772910', count: '191/200' }
  ];

  let claimIndex = 0;
  setInterval(() => {
    claimIndex = (claimIndex + 1) % sampleClaims.length;
    const c = sampleClaims[claimIndex];
    if (tickerText) {
      tickerText.style.opacity = '0';
      setTimeout(() => {
        tickerText.textContent = `🔥 ${c.name} from ${c.city} claimed Sunset Gold iPhone 17 Pro Max (${c.id}) • ${c.count} claimed today`;
        tickerText.style.opacity = '1';
      }, 300);
    }
  }, 7000);

});
