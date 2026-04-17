/* =============================================================
   about-us.js — about-us.html
   Handles: sidebar, timeline tabs, scroll reveal
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

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeSidebar();
});

// ── Timeline Tabs ─────────────────────────────────────────────
function switchTab(index) {
  const tabs   = document.querySelectorAll('.tl-tab');
  const panels = document.querySelectorAll('.tl-panel');

  tabs.forEach((tab, i) => tab.classList.toggle('active', i === index));
  panels.forEach((panel, i) => {
    panel.classList.toggle('active', i === index);
  });
}

// Auto-initialise: make sure first tab & panel are active on load
document.addEventListener('DOMContentLoaded', () => {
  const tabs   = document.querySelectorAll('.tl-tab');
  const panels = document.querySelectorAll('.tl-panel');
  if (tabs.length && !document.querySelector('.tl-tab.active')) {
    tabs[0].classList.add('active');
    if (panels[0]) panels[0].classList.add('active');
  }
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

// ── Nav scroll background ─────────────────────────────────────
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });
