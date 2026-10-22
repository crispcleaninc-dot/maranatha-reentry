(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // year
  var yr = document.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();

  // mobile menu
  var mb = document.querySelector('.menu-btn'), nl = document.getElementById('navlinks');
  if (mb && nl) {
    mb.addEventListener('click', function () {
      var open = nl.classList.toggle('open'); mb.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nl.addEventListener('click', function (e) { if (e.target.tagName === 'A') { nl.classList.remove('open'); mb.setAttribute('aria-expanded', 'false'); } });
  }

  // copy email
  var b = document.getElementById('copyEmail');
  if (b) b.addEventListener('click', function () {
    var el = document.getElementById('email'), t = el.textContent;
    function sel() { var r = document.createRange(); r.selectNodeContents(el); var s = getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = 'Selected'; }
    try { navigator.clipboard.writeText(t).then(function () { b.textContent = 'Copied'; }, sel); } catch (e) { sel(); }
  });

  // fade-in + count-up on scroll
  function countUp(el) {
    var end = +el.getAttribute('data-count'), suf = el.getAttribute('data-suffix') || '', t0 = null;
    if (reduce) { el.textContent = end + suf; return; }
    function step(t) { if (!t0) t0 = t; var k = Math.min(1, (t - t0) / 1200); el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))) + suf; if (k < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  var items = document.querySelectorAll('.fade');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        e.target.querySelectorAll('[data-count]').forEach(countUp);
        io.unobserve(e.target);
      });
    }, { threshold: 0.15 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // dawn canvas: the night sky warms as the sun rises over a Detroit skyline, once, on load
  var c = document.getElementById('dawn'); if (!c) return;
  var x = c.getContext('2d');
  var stars = []; for (var i = 0; i < 90; i++) stars.push({ x: Math.random(), y: Math.random() * 0.7, r: Math.random() * 1.3 + 0.3, p: Math.random() * 6 });
  var start = null, dur = 4200;
  function size() { var d = window.devicePixelRatio || 1; c.width = c.offsetWidth * d; c.height = c.offsetHeight * d; x.setTransform(d, 0, 0, d, 0, 0); }
  function draw(t) {
    var w = c.offsetWidth, h = c.offsetHeight;
    var k = reduce ? 1 : Math.min(1, (t - start) / dur), e = 1 - Math.pow(1 - k, 3);
    var g = x.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#16203a'); g.addColorStop(0.55, 'rgba(40,46,84,1)');
    g.addColorStop(1, 'rgb(' + Math.round(60 + 150 * e) + ',' + Math.round(52 + 70 * e) + ',70)');
    x.fillStyle = g; x.fillRect(0, 0, w, h);
    stars.forEach(function (s) { x.globalAlpha = (1 - e * 0.7) * (0.5 + 0.5 * Math.sin(t / 900 + s.p)); x.fillStyle = '#eef1f7'; x.beginPath(); x.arc(s.x * w, s.y * h, s.r, 0, 7); x.fill(); });
    x.globalAlpha = 1;
    var hz = h - 40, sx = w * 0.78, sy = hz + 60 - 110 * e, sr = Math.min(90, w * 0.12);
    var glow = x.createRadialGradient(sx, sy, 0, sx, sy, sr * 4);
    glow.addColorStop(0, 'rgba(240,164,58,' + (0.55 * e) + ')'); glow.addColorStop(1, 'rgba(240,164,58,0)');
    x.fillStyle = glow; x.fillRect(0, 0, w, h);
    x.fillStyle = '#d98a1c'; x.beginPath(); x.arc(sx, sy, sr, 0, 7); x.fill();
    x.fillStyle = '#0f1528'; x.fillRect(0, hz, w, h - hz);
    var bx = 0, seed = 7; function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
    x.beginPath(); x.moveTo(0, hz);
    while (bx < w) { var bw = 20 + rnd() * 40, bh = 10 + rnd() * 45; x.lineTo(bx, hz - bh); x.lineTo(bx + bw, hz - bh); bx += bw; }
    x.lineTo(w, hz); x.closePath(); x.fill();
    var hx = w * 0.18, hy = hz;
    x.beginPath(); x.moveTo(hx - 34, hy); x.lineTo(hx - 34, hy - 40); x.lineTo(hx, hy - 68); x.lineTo(hx + 34, hy - 40); x.lineTo(hx + 34, hy); x.closePath(); x.fill();
    x.fillStyle = 'rgba(246,217,166,' + (0.35 + 0.65 * e) + ')'; x.fillRect(hx - 10, hy - 32, 20, 16);
    if (k < 1) requestAnimationFrame(draw);
  }
  addEventListener('resize', function () { size(); if (start) draw(start + dur); });
  size(); start = performance.now(); requestAnimationFrame(draw);
})();
