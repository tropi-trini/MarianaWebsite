/* lightbox.js — click any gallery image to view it enlarged,
   then navigate the whole gallery with arrows / swipe / keyboard.
   Self-contained: injects its own overlay + styles. */
(function () {
  var style = document.createElement('style');
  style.textContent =
    '.lb-overlay{position:fixed;inset:0;z-index:200;background:rgba(8,10,12,0.92);' +
    'backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;' +
    'opacity:0;pointer-events:none;transition:opacity .25s ease;padding:3vw;}' +
    '.lb-overlay.open{opacity:1;pointer-events:auto;}' +
    '.lb-overlay img{max-width:90vw;max-height:90vh;width:auto;height:auto;' +
    'border-radius:2px;box-shadow:0 20px 60px rgba(0,0,0,0.6);' +
    'transform:scale(.97);transition:transform .25s ease;cursor:zoom-out;}' +
    '.lb-overlay.open img{transform:scale(1);}' +
    '.lb-btn{position:fixed;z-index:201;font-family:Jost,sans-serif;color:#aeb6bd;' +
    'background:rgba(20,24,29,0.6);border:1px solid #2b323a;border-radius:2px;cursor:pointer;' +
    'transition:color .2s,border-color .2s,background .2s;-webkit-tap-highlight-color:transparent;}' +
    '.lb-btn:hover{color:#b5e550;border-color:#b5e550;background:rgba(20,24,29,0.9);}' +
    '.lb-close{top:1.1rem;right:1.4rem;font-size:.78rem;letter-spacing:.16em;text-transform:uppercase;padding:.5rem .9rem;}' +
    '.lb-nav{top:50%;transform:translateY(-50%);width:3rem;height:3.4rem;font-size:1.4rem;line-height:1;' +
    'display:flex;align-items:center;justify-content:center;}' +
    '.lb-prev{left:1.1rem;}.lb-next{right:1.1rem;}' +
    '.lb-count{position:fixed;bottom:1.2rem;left:50%;transform:translateX(-50%);z-index:201;' +
    'font-family:Jost,sans-serif;font-size:.72rem;letter-spacing:.14em;color:#6f7981;}' +
    '.lb-nav[disabled]{opacity:.25;pointer-events:none;}' +
    '@media (max-width:600px){.lb-nav{width:2.4rem;height:2.8rem;font-size:1.1rem;}.lb-prev{left:.4rem;}.lb-next{right:.4rem;}}' +
    '@media (prefers-reduced-motion: reduce){.lb-overlay,.lb-overlay img{transition:none;}}' +
    'main img{cursor:zoom-in;}';
  document.head.appendChild(style);

  var overlay = document.createElement('div');
  overlay.className = 'lb-overlay';
  overlay.innerHTML =
    '<button class="lb-btn lb-close" aria-label="Close">Close \u2715</button>' +
    '<button class="lb-btn lb-nav lb-prev" aria-label="Previous">\u2039</button>' +
    '<button class="lb-btn lb-nav lb-next" aria-label="Next">\u203a</button>' +
    '<img alt="">' +
    '<span class="lb-count"></span>';
  document.body.appendChild(overlay);
  var big = overlay.querySelector('img');
  var prevBtn = overlay.querySelector('.lb-prev');
  var nextBtn = overlay.querySelector('.lb-next');
  var count = overlay.querySelector('.lb-count');

  var items = [];
  var idx = 0;

  function collectGallery() {
    var imgs = Array.prototype.slice.call(document.querySelectorAll('main img'));
    return imgs.filter(function (im) { return !im.closest('a'); });
  }

  function show(i) {
    if (i < 0 || i >= items.length) return;
    idx = i;
    var im = items[idx];
    big.src = im.currentSrc || im.src;
    big.alt = im.alt || '';
    var multi = items.length > 1;
    prevBtn.style.display = multi ? '' : 'none';
    nextBtn.style.display = multi ? '' : 'none';
    prevBtn.disabled = idx === 0;
    nextBtn.disabled = idx === items.length - 1;
    count.textContent = multi ? (idx + 1) + ' / ' + items.length : '';
  }

  function open(imgEl) {
    items = collectGallery();
    var start = items.indexOf(imgEl);
    if (start < 0) { items = [imgEl]; start = 0; }
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    show(start);
  }
  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(function () { if (!overlay.classList.contains('open')) big.src = ''; }, 300);
  }
  function step(d) { show(Math.min(Math.max(idx + d, 0), items.length - 1)); }

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (t.tagName === 'IMG' && t.closest('main') && !t.closest('a')) open(t);
  });

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay || e.target === big) { close(); return; }
  });
  overlay.querySelector('.lb-close').addEventListener('click', function (e) { e.stopPropagation(); close(); });
  prevBtn.addEventListener('click', function (e) { e.stopPropagation(); step(-1); });
  nextBtn.addEventListener('click', function (e) { e.stopPropagation(); step(1); });

  document.addEventListener('keydown', function (e) {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'ArrowRight') step(1);
  });

  var x0 = null;
  overlay.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  overlay.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
    x0 = null;
  }, { passive: true });
})();
