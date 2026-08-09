/* ----------------------------------------------------
   STUDENT REWARDS — ONE DAY AI-ML FLASH COURSE CAMPAIGN
   Client Logic & Validation Database
---------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

  // Base Counter Setup (Simulating live database starting count)
  const BASE_COUNT = 327;

  function getWaitlistStorage() {
    return JSON.parse(localStorage.getItem('student_waitlist') || '[]');
  }

  function saveToWaitlistStorage(record) {
    const list = getWaitlistStorage();
    list.unshift(record);
    localStorage.setItem('student_waitlist', JSON.stringify(list));
  }

  function getTotalInterestCount() {
    return BASE_COUNT + getWaitlistStorage().length;
  }

  function updateLiveCounters() {
    const total = getTotalInterestCount();
    const countText = `${total}+`;

    const liveCounterDisplay = document.getElementById('liveCounterDisplay');
    if (liveCounterDisplay) liveCounterDisplay.textContent = countText;

    const trustCounter = document.getElementById('trustCounter');
    if (trustCounter) trustCounter.textContent = countText;

    const tickerCounterEls = document.querySelectorAll('.ticker-counter-text');
    tickerCounterEls.forEach(el => {
      el.textContent = `${total}+ students`;
    });

    const counterNoteText = document.getElementById('counterNoteText');
    if (counterNoteText) counterNoteText.textContent = `${total} students`;
  }

  // Active Current Registration State
  const currentRegistration = {
    name: 'Alex Student',
    mobile: '9876543210',
    email: 'alex@student.edu',
    regId: 'SR-284729',
    source: 'Instagram',
    date: new Date().toLocaleDateString('en-IN')
  };


  // --- MODALS SYSTEM ---
  const modalOverlays = document.querySelectorAll('.modal-overlay');
  const waitlistModal = document.getElementById('waitlistModal');
  const successModal = document.getElementById('successModal');
  const statusModal = document.getElementById('statusModal');

  function openModal(modal) {
    closeAllModals();
    if (!modal) return;
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

  // Trigger Waitlist Buttons
  document.querySelectorAll('.trigger-waitlist-btn').forEach(btn => {
    btn.addEventListener('click', () => openModal(waitlistModal));
  });

  document.getElementById('heroCtaBtn')?.addEventListener('click', () => openModal(waitlistModal));
  document.getElementById('openStatusBtn')?.addEventListener('click', () => openModal(statusModal));

  // Close Handlers
  document.getElementById('closeWaitlistModal')?.addEventListener('click', closeAllModals);
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


  // --- WAITLIST FORM SUBMISSION ---
  const waitlistForm = document.getElementById('waitlistForm');
  if (waitlistForm) {
    waitlistForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('wlName').value.trim();
      const mobileInput = document.getElementById('wlMobile').value.trim();
      const emailInput = document.getElementById('wlEmail').value.trim();

      if (!nameInput || !mobileInput || !emailInput) {
        alert('Please fill all required fields.');
        return;
      }

      if (mobileInput.length < 10) {
        alert('Please enter a valid 10-digit WhatsApp number.');
        return;
      }

      // Generate Unique Registration ID (SR-XXXXXX)
      const randomId = 'SR-' + Math.floor(100000 + Math.random() * 900000);
      
      const newRecord = {
        regId: randomId,
        name: nameInput,
        mobile: mobileInput,
        email: emailInput,
        source: 'Direct / Social',
        date: new Date().toLocaleDateString('en-IN'),
        status: 'Registered'
      };

      // Save to database/localStorage
      saveToWaitlistStorage(newRecord);
      
      currentRegistration.name = nameInput;
      currentRegistration.mobile = mobileInput;
      currentRegistration.email = emailInput;
      currentRegistration.regId = randomId;

      // Update counters
      updateLiveCounters();

      // Render Success Ticket Pass
      document.getElementById('successRegId').textContent = randomId;
      document.getElementById('successName').textContent = nameInput;
      document.getElementById('successMobile').textContent = `+91 ${mobileInput.replace(/(\d{5})(\d{5})/, '$1 $2')}`;

      // Open Success Modal
      openModal(successModal);

      // Confetti animation
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    });
  }


  // --- SHARE & WHATSAPP ACTIONS ---
  const shareBtn = document.getElementById('shareBtn');
  const whatsappBtn = document.getElementById('whatsappBtn');

  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({
          title: 'Student Rewards — AI-ML Flash Course',
          text: `Join the One Day AI-ML Flash Course waitlist & get a chance to win an iPhone 17 Pro Max! My Registration ID: ${currentRegistration.regId}`,
          url: window.location.href
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard! Share it with your friends.');
      }
    });
  }

  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      const text = encodeURIComponent(
        `🎉 *Joined the Student Rewards Waitlist!*\n\n` +
        `Campaign: One Day AI-ML Flash Course + iPhone 17 Pro Max Reward\n` +
        `Registration ID: ${currentRegistration.regId}\n` +
        `Name: ${currentRegistration.name}\n\n` +
        `Join the waitlist here: ${window.location.href}`
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
      const query = statusQueryInput.value.trim().toLowerCase();
      const list = getWaitlistStorage();
      
      const found = list.find(r => 
        (r.regId && r.regId.toLowerCase() === query) || 
        (r.mobile && r.mobile.includes(query))
      ) || (query.includes('284729') || query.includes('98765') ? currentRegistration : null);

      statusResultContainer.classList.remove('hidden');

      if (found) {
        statusResultContainer.innerHTML = `
          <div style="font-size:0.78rem; font-weight:800; color:#059669; margin-bottom:4px;">✓ VERIFIED WAITLIST RECORD</div>
          <div style="font-family:var(--font-heading); font-size:1.2rem; font-weight:800; color:var(--gold-primary);">${found.regId}</div>
          <div style="font-size:0.85rem; color:var(--text-sub); margin-top:4px; display:flex; flex-direction:column; gap:2px;">
            <div><strong>Name:</strong> ${found.name}</div>
            <div><strong>WhatsApp Number:</strong> +91 ${found.mobile}</div>
            <div><strong>Email:</strong> ${found.email}</div>
            <div><strong>Campaign:</strong> One Day AI-ML Flash Course (₹599 + GST)</div>
            <div><strong>Status:</strong> Verified Waitlist Entry</div>
          </div>
        `;
      } else {
        statusResultContainer.innerHTML = `
          <div style="font-size:0.78rem; font-weight:800; color:#dc2626; margin-bottom:4px;">✕ NO WAITLIST RECORD FOUND</div>
          <div style="font-size:0.85rem; color:var(--text-sub);">
            No waitlist registration matched "<strong>${query}</strong>". Please click "I'M INTERESTED" to join the waitlist.
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


  // Initial Counter Update
  updateLiveCounters();

});
