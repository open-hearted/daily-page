// daily-logger.js

(() => {
  const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbyZwJD3RULWbmDX3uMC_RogVqMOOlEOhU1bjFvawx73KCFGJh3sdMU5HJU3zQad76HT/exec';
  const btn  = document.getElementById('log-button');
  const last = document.getElementById('last-click');

  if (!btn || !last) return;

  btn.addEventListener('click', () => {
    const now  = new Date();
    const iso  = now.toISOString();
    const disp = now.toLocaleString();

    // 画面に表示
    last.textContent = disp;

    // no-cors モードで fire-and-forget
    fetch(WEBHOOK_URL, {
      method: 'POST',
      mode:   'no-cors',
      body:   JSON.stringify({
        serial:     'daily-page',
        timestamp:  iso,
        message:    '',
        chat_title: document.title,
        client:     'webpage'
      })
    });
  });
})();
