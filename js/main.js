/* =============================================================
   main.js — index.html
   Handles: sidebar, search overlay, scroll reveal, stat counters
   ============================================================= */

// ── Sidebar ──────────────────────────────────────────────────
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const btn     = document.getElementById('menuBtn');
  const isOpen  = sidebar.classList.toggle('open');
  overlay.classList.toggle('active', isOpen);
  btn.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('active');
  document.getElementById('menuBtn').classList.remove('open');
  document.body.style.overflow = '';
}

// ── Search Overlay ────────────────────────────────────────────
function openSearch() {
  document.getElementById('searchOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('searchInput')?.focus(), 80);
}

function closeSearch() {
  document.getElementById('searchOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

// ── Keyboard shortcuts ────────────────────────────────────────
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeSidebar(); closeSearch(); }
});

// ── Scroll Reveal ─────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Stat Counter Animation ────────────────────────────────────
function animateCount(el, target, duration) {
  let start;
  const step = (ts) => {
    if (!start) start = ts;
    const pct = Math.min((ts - start) / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - pct, 3);
    el.textContent = Math.round(eased * target);
    if (pct < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const container = entry.target;
    const target    = parseInt(container.dataset.target, 10);
    const countEl   = container.querySelector('.count');
    if (countEl && !isNaN(target)) animateCount(countEl, target, 1800);
    counterObserver.unobserve(container);
  });
}, { threshold: 0.4 });

document.querySelectorAll('.stat-number[data-target]').forEach(el => counterObserver.observe(el));

// ── Nav background on scroll ──────────────────────────────────
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });
