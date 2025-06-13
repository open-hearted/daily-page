// daily-record.js
(() => {
  // ストレージキーを「ページタイトル」で区別
  const STORAGE_KEY = 'records_' + document.title;
  // 既存の記録を読み込む（なければ空配列）
  let records = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

  // 要素を取得
  const btn    = document.getElementById('log-button') || document.getElementById('play-button') || document.getElementById('laundry-btn');
  const listEl = document.getElementById('records') || document.getElementById('records1') || document.getElementById('records2') || document.getElementById('laundry-list');
  const last   = document.getElementById('last-click') || document.getElementById('last-time');

  if (!btn || !listEl) return;

  // JST形式の時刻を「HH:MM」形式で返す
  const getJstTime = () => {
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  };

  // UIに反映するレンダリング関数
  function render() {
    listEl.innerHTML = '';
    records.forEach((time, idx) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${time}</span>
        <button class="del-btn" data-idx="${idx}">削除</button>
      `;
      listEl.appendChild(li);
    });
    // 削除ボタン
    listEl.querySelectorAll('.del-btn').forEach(b => {
      b.addEventListener('click', e => {
        records.splice(e.currentTarget.dataset.idx, 1);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
        render();
      });
    });
  }

  // ボタンを押したときの処理
  btn.addEventListener('click', () => {
    const ts = getJstTime();
    records.push(ts);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    if (last) last.textContent = ts;
    render();
  });

  // 初回レンダリング
  render();
})();
