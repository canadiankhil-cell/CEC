function toggleNav() {
    document.getElementById('hamburgerBtn').classList.toggle('open');
    document.getElementById('navDrawer').classList.toggle('open');
    document.getElementById('navOverlay').classList.toggle('open');
  }
  function closeNav() {
    document.getElementById('hamburgerBtn').classList.remove('open');
    document.getElementById('navDrawer').classList.remove('open');
    document.getElementById('navOverlay').classList.remove('open');
  }
  function swapImg(imgId, src) {
    document.getElementById(imgId).src = src;
  }

  // ── LIGHTBOX ──
  // Build project data from cards at runtime
  let lbProjects = [];
  let lbCurrent = 0;
  let lbImageIndex = 0;

  function buildProjectData() {
    lbProjects = [];
    document.querySelectorAll('.project-card').forEach(card => {
      const mainImg = card.querySelector('img.main-img');
      const thumbImgs = card.querySelectorAll('.thumb-strip img');
      const title = card.querySelector('.card-body h3').textContent;
      const tag = card.querySelector('.card-tag').textContent;
      const images = [];
      if (thumbImgs.length > 0) {
        thumbImgs.forEach(t => images.push(t.src));
      } else {
        images.push(mainImg.src);
      }
      lbProjects.push({ title, tag, images });

      // Click on image wrap opens lightbox
      const wrap = card.querySelector('.card-image-wrap');
      const idx = lbProjects.length - 1;
      wrap.addEventListener('click', (e) => {
        if (e.target.closest('.thumb-strip')) return; // don't open if clicking thumb strip
        openLightbox(idx, 0);
      });
    });
  }

  function openLightbox(projectIdx, imgIdx) {
    lbCurrent = projectIdx;
    lbImageIndex = imgIdx;
    renderLightbox();
    document.getElementById('lightbox').classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function renderLightbox() {
    const proj = lbProjects[lbCurrent];
    const lb = document.getElementById('lbImg');
    lb.src = proj.images[lbImageIndex];
    document.getElementById('lbCaption').textContent = proj.title;
    document.getElementById('lbTag').textContent = proj.tag;

    // Render thumbs only if multiple images
    const thumbsEl = document.getElementById('lbThumbs');
    thumbsEl.innerHTML = '';
    if (proj.images.length > 1) {
      proj.images.forEach((src, i) => {
        const img = document.createElement('img');
        img.src = src;
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
    document.body.style.overflow = '';
  }

  function lbClickOutside(e) {
    if (e.target === document.getElementById('lightbox')) closeLightbox();
  }

  function lbNav(dir) {
    lbCurrent = (lbCurrent + dir + lbProjects.length) % lbProjects.length;
    lbImageIndex = 0;
    renderLightbox();
  }

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    const lb = document.getElementById('lightbox');
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') lbNav(1);
    if (e.key === 'ArrowLeft') lbNav(-1);
  });

  document.addEventListener('DOMContentLoaded', buildProjectData);