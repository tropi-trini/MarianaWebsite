/* copy-mail.js — click the email button to copy it to the clipboard */
(function () {
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-copy]');
    if (!btn) return;
    var text = btn.getAttribute('data-copy');
    var done = function () {
      var original = btn.textContent;
      btn.classList.add('copied');
      btn.textContent = 'Copied ✓';
      setTimeout(function () {
        btn.classList.remove('copied');
        btn.textContent = original;
      }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(function () { fallback(text, done); });
    } else {
      fallback(text, done);
    }
  });
  function fallback(text, done) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); done(); } catch (e) {}
    document.body.removeChild(ta);
  }
})();
