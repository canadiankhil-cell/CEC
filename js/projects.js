/* =============================================================
   projects.js — projects.html
   Handles: nav drawer, image swap, lightbox, search, scroll reveal
   ============================================================= */

// ── Nav Drawer ───────────────────────────────────────────────
function toggleNav() {
  const drawer  = document.getElementById('navDrawer');
  const overlay = document.getElementById('navOverlay');
  const btn     = document.getElementById('hamburgerBtn');
  const isOpen  = drawer.classList.toggle('open');
  overlay.classList.toggle('active', isOpen);
  btn.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeNav() {
  document.getElementById('navDrawer').classList.remove('open');
  document.getElementById('navOverlay').classList.remove('active');
  document.getElementById('hamburgerBtn').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeNav(); closeLightbox(); }
});

// ── Image Swap (thumbnail strip) ──────────────────────────────
function swapImg(mainId, src) {
  const mainImg = document.getElementById(mainId);
  if (!mainImg) return;
  mainImg.src = src;

  // Highlight the active thumb
  const card = mainImg.closest('.project-card');
  if (card) {
    card.querySelectorAll('.thumb-strip img').forEach(thumb => {
      thumb.classList.toggle('active', thumb.src === src || thumb.getAttribute('src') === src);
    });
  }

  // If lightbox is open on this card, sync it too
  if (_lbCard === card) {
    const idx = _lbImages.indexOf(src);
    if (idx !== -1) { _lbIndex = idx; _lbRender(); }
  }
}

// ── Lightbox ─────────────────────────────────────────────────
let _lbImages = [];
let _lbIndex  = 0;
let _lbCard   = null;
let _lbTitle  = '';
let _lbTag    = '';

function _collectImages(card) {
  const thumbs = card.querySelectorAll('.thumb-strip img');
  if (thumbs.length) {
    return Array.from(thumbs).map(t => t.getAttribute('src'));
  }
  // Fallback: just the main image
  const main = card.querySelector('.main-img');
  return main ? [main.getAttribute('src')] : [];
}

function _openLightbox(card) {
  _lbCard   = card;
  _lbTitle  = card.querySelector('h3')?.textContent.trim() || '';
  _lbTag    = card.querySelector('.card-tag')?.textContent.trim() || '';
  _lbImages = _collectImages(card);

  // Start on whatever image is currently shown as main
  const current = card.querySelector('.main-img')?.getAttribute('src') || '';
  _lbIndex = _lbImages.indexOf(current);
  if (_lbIndex < 0) _lbIndex = 0;

  _lbRender();
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function _lbRender() {
  document.getElementById('lbImg').src       = _lbImages[_lbIndex];
  document.getElementById('lbCaption').textContent = _lbTitle;
  document.getElementById('lbTag').textContent     = _lbTag;

  const thumbsEl = document.getElementById('lbThumbs');
  thumbsEl.innerHTML = '';
  _lbImages.forEach((src, i) => {
    const img   = document.createElement('img');
    img.src     = src;
    img.alt     = '';
    img.className = i === _lbIndex ? 'active' : '';
    img.addEventListener('click', () => { _lbIndex = i; _lbRender(); });
    thumbsEl.appendChild(img);
  });

  // Show/hide nav arrows
  const prev = document.querySelector('.lightbox-prev');
  const next = document.querySelector('.lightbox-next');
  if (prev) prev.style.display = _lbImages.length > 1 ? '' : 'none';
  if (next) next.style.display = _lbImages.length > 1 ? '' : 'none';
}

function lbNav(dir) {
  _lbIndex = (_lbIndex + dir + _lbImages.length) % _lbImages.length;
  _lbRender();
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.body.style.overflow = '';
  _lbCard = null;
}

function lbClickOutside(e) {
  if (e.target === document.getElementById('lightbox')) closeLightbox();
}

// Keyboard navigation inside lightbox
document.addEventListener('keydown', (e) => {
  const lb = document.getElementById('lightbox');
  if (!lb?.classList.contains('active')) return;
  if (e.key === 'ArrowRight') lbNav(1);
  if (e.key === 'ArrowLeft')  lbNav(-1);
});

// Wire up card click → open lightbox
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.project-card .card-image-wrap').forEach(wrap => {
    wrap.addEventListener('click', () => {
      _openLightbox(wrap.closest('.project-card'));
    });
  });
});

// ── Search / Filter ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const input = document.querySelector('.search-wrap input, .nav-search input');
  if (!input) return;

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    document.querySelectorAll('.project-card').forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = (!q || text.includes(q)) ? '' : 'none';
    });
  });
});

// ── Scroll Reveal ─────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
