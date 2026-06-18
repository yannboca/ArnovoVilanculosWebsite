/* D'LURDES — main.js */

// ── Cursor glow ───────────────────────────
const glow = document.getElementById('cursorGlow');
if (glow) {
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
  document.addEventListener('mouseleave', () => glow.style.opacity = '0');
  document.addEventListener('mouseenter', () => glow.style.opacity = '1');
}

// ── Header scroll effect ──────────────────
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

// ── Mobile nav toggle ─────────────────────
const navToggle = document.getElementById('navToggle');
const nav       = document.querySelector('nav');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });
}

// ── Scroll reveal ─────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      // stagger cards
      const delay = el.classList.contains('reveal-card')
        ? Array.from(el.parentElement.children).indexOf(el) * 120
        : 0;
      setTimeout(() => el.classList.add('visible'), delay);
      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal-section, .reveal-card').forEach(el => {
  revealObserver.observe(el);
});

// ── Form handlers ─────────────────────────
function showMsg(id, text, type) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.className = 'form-msg ' + type;
  setTimeout(() => { el.textContent = ''; el.className = 'form-msg'; }, 5000);
}

function handleAccount(e) {
  e.preventDefault();
  const val = document.getElementById('username')?.value.trim();
  if (!val || val.length < 3) {
    showMsg('accountMsg', 'Username must be at least 3 characters.', 'error');
    return;
  }
  showMsg('accountMsg', `Welcome, ${val}. Your LURDES identity has been created.`, 'success');
  document.getElementById('accountForm').reset();
}

function handleNewsletter(e) {
  e.preventDefault();
  showMsg('newsletterMsg', 'You have been added to our editorial list.', 'success');
  document.getElementById('newsletterForm').reset();
}

function handleBooking(e) {
  e.preventDefault();
  const name = document.getElementById('bookName')?.value.trim();
  const date = document.getElementById('bookDate')?.value;
  if (!name || !date) {
    showMsg('bookingMsg', 'Please complete all fields.', 'error');
    return;
  }
  const formatted = new Date(date).toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  showMsg('bookingMsg', `Thank you, ${name}. We will confirm your appointment for ${formatted}.`, 'success');
  document.getElementById('bookingForm').reset();
}

// ── Garment authentication ────────────────
const garments = {
  'LURDES-001': { owner: 'Xavier',   collection: 'Capsule 01', year: '2026' },
  'LURDES-002': { owner: 'Amélie',   collection: 'Capsule 02', year: '2026' },
  'LURDES-003': { owner: 'Sebastião',collection: 'Capsule 03', year: '2026' },
};

function verifyCode() {
  const code   = document.getElementById('code')?.value.trim().toUpperCase();
  const result = document.getElementById('result');
  if (!result) return;

  if (!code) {
    result.innerHTML = 'Please enter a garment code.';
    result.className = 'auth-result error';
    return;
  }

  const data = garments[code];
  if (data) {
    result.innerHTML = `
      ✓ Authentication Successful<br>
      <br>
      Owner &nbsp;&nbsp;&nbsp;&nbsp; — ${data.owner}<br>
      Collection — ${data.collection}<br>
      Year &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; — ${data.year}
    `;
    result.className = 'auth-result success';
  } else {
    result.innerHTML = `Code "${code}" was not found in our registry.`;
    result.className = 'auth-result error';
  }
}

// Allow Enter key on auth input
document.getElementById('code')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') verifyCode();
});