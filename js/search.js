/* ============================================================
   js/search.js — site-wide search (all pages)
   - Home: search button opens the full-screen overlay
   - Projects: the nav search box filters the project cards live
   - About / Contact: the nav search box shows a results dropdown
   ============================================================ */
(function () {
  var PAGES = [
    { title: 'Home', sub: 'Page', href: 'index.html', kw: 'home main designed with integrity' },
    { title: 'About Us', sub: 'Page', href: 'about-us.html', kw: 'about company history timeline ceo chairman emad 1996 team' },
    { title: 'Projects', sub: 'Page', href: 'projects.html', kw: 'projects portfolio featured works' },
    { title: 'Services', sub: 'Page · canadian-consultants.com', href: 'https://www.canadian-consultants.com/services', ext: true, kw: 'services architecture structural mep project management supervision feasibility' },
    { title: 'Contact Us', sub: 'Page', href: 'contact.html', kw: 'contact offices phone email address location map dubai ajman sharjah riyadh cairo saudi egypt uae' }
  ];
  var PROJECTS = [
    ['Aspirz By Danube', 'Residential Tower · Dubai'],
    ['Tycoon Tower', 'Mixed-Use Tower · Cairo'],
    ['Oceanz By Danube', 'Luxury Waterfront Residential · Dubai'],
    ['Sharjah Mall', 'Commercial / Retail · Sharjah'],
    ['Ajman Creek Towers', 'Waterfront Residential · Ajman'],
    ['Gevora Hotel', 'Hospitality'],
    ['Sky Spiral Towers', 'Luxury Residential · Dubai'],
    ['Oasis Towers', 'Residential · Ajman'],
    ['Sky Gardens Tower', 'Sustainable Design · Ajman'],
    ['Infinity Tower', 'Luxury High-Rise · Sharjah'],
    ['Crowne Plaza Hotel', 'Hospitality · Georgia'],
    ['City Premier Marina Hotel Apartments', 'Hospitality · Dubai Marina']
  ];

  function slug(t) { return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

  var INDEX = PAGES.map(function (p) {
    return { title: p.title, sub: p.sub, href: p.href, ext: p.ext, text: (p.title + ' ' + p.kw).toLowerCase() };
  }).concat(PROJECTS.map(function (p) {
    return { title: p[0], sub: 'Project · ' + p[1], href: 'projects.html#' + slug(p[0]), text: (p[0] + ' ' + p[1]).toLowerCase() };
  }));

  function match(q) {
    var tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!tokens.length) return [];
    return INDEX.filter(function (it) {
      return tokens.every(function (t) { return it.text.indexOf(t) !== -1; });
    }).slice(0, 8);
  }

  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function render(list, box, q) {
    if (!q.trim()) { box.innerHTML = ''; box.classList.remove('show'); return; }
    box.innerHTML = list.length
      ? list.map(function (it) {
          return '<a href="' + it.href + '"' + (it.ext ? ' target="_blank" rel="noopener"' : '') + '><strong>' + esc(it.title) + '</strong><span>' + esc(it.sub) + '</span></a>';
        }).join('')
      : '<div class="sr-empty">No results for “' + esc(q.trim()) + '”</div>';
    box.classList.add('show');
  }

  function goFirst(q) {
    var r = match(q);
    if (!r.length) return;
    if (r[0].ext) window.open(r[0].href, '_blank', 'noopener');
    else window.location.href = r[0].href;
  }

  var onProjects = !!document.querySelector('.projects-grid');

  /* ── Home: full-screen overlay ── */
  var ovInput = document.getElementById('searchInput');
  var ovBox = document.getElementById('overlayResults');
  if (ovInput && ovBox) {
    ovInput.addEventListener('input', function () { render(match(ovInput.value), ovBox, ovInput.value); });
    ovInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') goFirst(ovInput.value); });
  }

  /* ── Inner pages: nav search box ── */
  var wrap = document.querySelector('.nav-search');
  var input = wrap && wrap.querySelector('input');
  if (input) {
    wrap.addEventListener('click', function () { input.focus(); });

    if (onProjects) {
      var cards = Array.prototype.slice.call(document.querySelectorAll('.project-card'));
      cards.forEach(function (c) { c.setAttribute('data-slug', slug(c.querySelector('h3').textContent)); });
      var grid = document.querySelector('.projects-grid');
      var empty = document.createElement('p');
      empty.className = 'search-empty';
      empty.hidden = true;
      grid.parentNode.insertBefore(empty, grid.nextSibling);

      input.addEventListener('input', function () {
        var tokens = input.value.toLowerCase().split(/\s+/).filter(Boolean);
        var shown = 0;
        cards.forEach(function (c) {
          var txt = (c.querySelector('h3').textContent + ' ' + c.querySelector('.card-tag').textContent + ' ' + c.querySelector('.card-body p').textContent).toLowerCase();
          var ok = tokens.every(function (t) { return txt.indexOf(t) !== -1; });
          c.style.display = ok ? '' : 'none';
          if (ok) shown++;
        });
        empty.hidden = shown !== 0;
        empty.textContent = 'No projects match “' + input.value.trim() + '”.';
      });
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { input.value = ''; input.dispatchEvent(new Event('input')); input.blur(); }
      });

      /* jump to a project from a #hash (used by search on other pages) */
      var jump = function () {
        var id = location.hash.replace('#', '');
        var card = id && document.querySelector('.project-card[data-slug="' + id + '"]');
        if (!card) return;
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.classList.add('search-flash');
        setTimeout(function () { card.classList.remove('search-flash'); }, 2600);
      };
      window.addEventListener('load', function () { setTimeout(jump, 250); });
      window.addEventListener('hashchange', jump);
    } else {
      var box = document.createElement('div');
      box.className = 'nav-results';
      document.body.appendChild(box);
      input.addEventListener('input', function () { render(match(input.value), box, input.value); });
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') goFirst(input.value);
        if (e.key === 'Escape') { input.value = ''; render([], box, ''); input.blur(); }
      });
      document.addEventListener('click', function (e) {
        if (!box.contains(e.target) && !wrap.contains(e.target)) box.classList.remove('show');
      });
      input.addEventListener('focus', function () { if (input.value.trim()) render(match(input.value), box, input.value); });
    }
  }
})();
