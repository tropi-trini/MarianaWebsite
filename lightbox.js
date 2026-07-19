/* lightbox.js — click any gallery image to view it enlarged.
   Self-contained: injects its own overlay + styles. */
(function () {
  var style = document.createElement('style');
  style.textContent =
    '.lb-overlay{position:fixed;inset:0;z-index:200;background:rgba(8,10,12,0.92);' +
    'backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;' +
    'opacity:0;pointer-events:none;transition:opacity .25s ease;cursor:zoom-out;padding:3vw;}' +
    '.lb-overlay.open{opacity:1;pointer-events:auto;}' +
    '.lb-overlay img{max-width:94vw;max-height:92vh;width:auto;height:auto;' +
    'border:1px solid rgba(181,229,80,0.35);border-radius:2px;box-shadow:0 20px 60px rgba(0,0,0,0.6);' +
    'transform:scale(.97);transition:transform .25s ease;}' +
    '.lb-overlay.open img{transform:scale(1);}' +
    '.lb-close{position:fixed;top:1.1rem;right:1.4rem;z-index:201;font-family:Jost,sans-serif;' +
    'font-size:.78rem;letter-spacing:.16em;text-transform:uppercase;color:#aeb6bd;' +
    'background:none;border:1px solid #2b323a;border-radius:2px;padding:.5rem .9rem;cursor:pointer;transition:color .2s,border-color .2s;}' +
    '.lb-close:hover{color:#b5e550;border-color:#b5e550;}' +
    '@media (prefers-reduced-motion: reduce){.lb-overlay,.lb-overlay img{transition:none;}}' +
    'main img{cursor:zoom-in;}';
  document.head.appendChild(style);

  var overlay = document.createElement('div');
  overlay.className = 'lb-overlay';
  overlay.innerHTML = '<button class="lb-close" aria-label="Close">Close ✕</button><img alt="">';
  document.body.appendChild(overlay);
  var big = overlay.querySelector('img');

  function open(src, alt) {
    big.src = src; big.alt = alt || '';
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(function () { if (!overlay.classList.contains('open')) big.src = ''; }, 300);
  }

  // Delegate: any <img> inside <main> that isn't a thumbnail link opens the lightbox.
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (t.tagName === 'IMG' && t.closest('main') && !t.closest('a')) {
      open(t.currentSrc || t.src, t.alt);
    }
  });
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
})();
