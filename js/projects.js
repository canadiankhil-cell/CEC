/* ============================================================
   js/projects.js — projects.html
   ============================================================ */

// ── Sidebar (unified pattern) ─────────────────────────────────
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const btn     = document.getElementById('menuBtn');
  const isOpen  = sidebar.classList.toggle('open');
  overlay.classList.toggle('open', isOpen);
  btn.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
  document.getElementById('menuBtn').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeSidebar();
});

// ── Nav scroll effect ──────────────────────────────────────────
const navEl = document.querySelector('nav');
window.addEventListener('scroll', () => {
  if (navEl) navEl.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Image swap (thumbnail click) ──────────────────────────────
function swapImg(imgId, src) {
  document.getElementById(imgId).src = src;
}

// ── LIGHTBOX ──────────────────────────────────────────────────
let lbProjects = [];
let lbCurrent = 0;
let lbImageIndex = 0;

function buildProjectData() {
  lbProjects = [];
  document.querySelectorAll('.project-card').forEach(card => {
    const mainImg   = card.querySelector('img.main-img');
    const thumbImgs = card.querySelectorAll('.thumb-strip img');
    const title     = card.querySelector('.card-body h3').textContent;
    const tag       = card.querySelector('.card-tag').textContent;
    const images    = [];
    if (thumbImgs.length > 0) {
      thumbImgs.forEach(t => images.push(t.src));
    } else {
      images.push(mainImg.src);
    }
    lbProjects.push({ title, tag, images });

    const wrap = card.querySelector('.card-image-wrap');
    const idx  = lbProjects.length - 1;
    wrap.addEventListener('click', (e) => {
      if (e.target.closest('.thumb-strip')) return;
      openLightbox(idx, 0);
    });
  });
}

function openLightbox(projectIdx, imgIdx) {
  lbCurrent    = projectIdx;
  lbImageIndex = imgIdx;
  renderLightbox();
  document.getElementById('lightbox').style.display = 'flex';
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function renderLightbox() {
  const proj    = lbProjects[lbCurrent];
  const lb      = document.getElementById('lbImg');
  lb.src        = proj.images[lbImageIndex];
  document.getElementById('lbCaption').textContent = proj.title;
  document.getElementById('lbTag').textContent     = proj.tag;

  const thumbsEl = document.getElementById('lbThumbs');
  thumbsEl.innerHTML = '';
  if (proj.images.length > 1) {
    proj.images.forEach((src, i) => {
      const img = document.createElement('img');
      img.src   = src;
      if (i === lbImageIndex) img.classList.add('active');
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        lbImageIndex = i;
        renderLightbox();
      });
      thumbsEl.appendChild(img);
    });
  }
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
  document.getElementById('lightbox').style.display = 'none';
  document.body.style.overflow = '';
}

function lbClickOutside(e) {
  if (e.target === document.getElementById('lightbox')) closeLightbox();
}

function lbNav(dir) {
  const proj = lbProjects[lbCurrent];
  lbImageIndex = (lbImageIndex + dir + proj.images.length) % proj.images.length;
  renderLightbox();
}

document.addEventListener('keydown', e => {
  if (!document.getElementById('lightbox').classList.contains('active')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowRight') lbNav(1);
  if (e.key === 'ArrowLeft')  lbNav(-1);
});

// Init on load
window.addEventListener('DOMContentLoaded', buildProjectData);
