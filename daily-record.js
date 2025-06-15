// daily-record.js

(function() {
  /**
   * JST の現在時刻を HH:MM 形式で返す
   */
  function getJstTime() {
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  }

  /**
   * 汎用：ボタン＋リストを紐付けて「時刻だけ」を保存・レンダリング
   * @param {string} storageKey localStorage のキー
   * @param {string} btnId      ボタンの ID
   * @param {string} listId     UL 要素の ID
   * @param {string} label      リストに表示するラベル
   */
  function setupRecords(storageKey, btnId, listId, label) {
    const btn    = document.getElementById(btnId);
    const listEl = document.getElementById(listId);
    let records  = JSON.parse(localStorage.getItem(storageKey) || '[]');

    function render() {
      listEl.innerHTML = '';
      records.forEach((time, idx) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <span>【${time}】 ${label}</span>
          <button class="del-btn" data-idx="${idx}">削除</button>
        `;
        listEl.appendChild(li);
      });
      listEl.querySelectorAll('.del-btn').forEach(b => {
        b.addEventListener('click', e => {
          const i = parseInt(e.currentTarget.dataset.idx, 10);
          records.splice(i, 1);
          localStorage.setItem(storageKey, JSON.stringify(records));
          render();
        });
      });
    }

    btn.addEventListener('click', () => {
      const ts = getJstTime();
      records.push(ts);
      localStorage.setItem(storageKey, JSON.stringify(records));
      render();
    });

    render();
  }

  /**
   * 汎用：自由テキスト＋時刻の組み合わせを保存・レンダリング
   * @param {string} storageKey localStorage のキー
   * @param {string} btnId      ボタンの ID
   * @param {string} inputId    テキストエリア／入力欄の ID
   * @param {string} listId     UL 要素の ID
   * @param {string} label      リストに表示するラベル
   */
  function setupFreeSection(storageKey, btnId, inputId, listId, label) {
    const btn    = document.getElementById(btnId);
    const input  = document.getElementById(inputId);
    const listEl = document.getElementById(listId);
    let records  = JSON.parse(localStorage.getItem(storageKey) || '[]');

    function render() {
      listEl.innerHTML = '';
      records.forEach((rec, idx) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <span>【${rec.time}】 ${rec.text}</span>
          <button class="del-btn" data-idx="${idx}">削除</button>
        `;
        listEl.appendChild(li);
      });
      listEl.querySelectorAll('.del-btn').forEach(b => {
        b.addEventListener('click', e => {
          const i = parseInt(e.currentTarget.dataset.idx, 10);
          records.splice(i, 1);
          localStorage.setItem(storageKey, JSON.stringify(records));
          render();
        });
      });
    }

    btn.addEventListener('click', () => {
      const text = input.value.trim();
      if (!text) return;
      const ts = getJstTime();
      records.push({ time: ts, text });
      localStorage.setItem(storageKey, JSON.stringify(records));
      input.value = '';
      render();
    });

    render();
  }

  /**
   * 支出記録セクション用：金額＋内容＋時刻を保存・レンダリング
   * @param {string} storageKey     localStorage のキー
   * @param {string} amountInputId  金額入力欄の ID
   * @param {string} descInputId    内容入力欄の ID
   * @param {string} btnId          ボタンの ID
   * @param {string} listId         UL 要素の ID
   * @param {string} label          リストに表示するラベル
   */
  function setupExpenseSection(storageKey, amountInputId, descInputId, btnId, listId, label) {
    const amountInput = document.getElementById(amountInputId);
    const descInput   = document.getElementById(descInputId);
    const btn         = document.getElementById(btnId);
    const listEl      = document.getElementById(listId);
    let records       = JSON.parse(localStorage.getItem(storageKey) || '[]');

    function render() {
      listEl.innerHTML = '';
      records.forEach((rec, idx) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <span>【${rec.time}】 ${label} ${rec.amount}円：${rec.desc}</span>
          <button class="del-btn" data-idx="${idx}">削除</button>
        `;
        listEl.appendChild(li);
      });
      listEl.querySelectorAll('.del-btn').forEach(b => {
        b.addEventListener('click', e => {
          const i = parseInt(e.currentTarget.dataset.idx, 10);
          records.splice(i, 1);
          localStorage.setItem(storageKey, JSON.stringify(records));
          render();
        });
      });
    }

    btn.addEventListener('click', () => {
      const amount = amountInput.value.trim();
      const desc   = descInput.value.trim();
      if (!amount || !desc) return;
      const ts = getJstTime();
      records.push({ time: ts, amount, desc });
      localStorage.setItem(storageKey, JSON.stringify(records));
      amountInput.value = '';
      descInput.value   = '';
      render();
    });

    render();
  }

  // ページタイトル（日付＋曜日）が document.title に入っている想定
  const pageKey = document.title;

  // 各セクションのセットアップ
  setupRecords(
    `dailyLaundry_${pageKey}`,
    'laundry-btn',
    'laundry-list',
    '洗濯を行う'
  );

  setupRecords(
    `dailyLaundryCollect_${pageKey}`,
    'collect-btn',
    'collect-list',
    '洗濯物を回収する'
  );

  setupFreeSection(
    `diary_${pageKey}`,
    'diary-btn',
    'diary-input',
    'diary-list',
    '日記'
  );

  setupExpenseSection(
    `expense_${pageKey}`,
    'expense-amount',
    'expense-desc',
    'expense-btn',
    'expense-list',
    '支出'
  );

  setupFreeSection(
    `study_${pageKey}`,
    'study-btn',
    'study-input',
    'study-list',
    '算数の勉強'
  );

  setupRecords(
    `video1_${pageKey}_BUYUN3gXtd8`,
    'play-btn-1',
    'records1',
    '動画1を行う'
  );

  setupRecords(
    `video2_${pageKey}_nbm-G5i-NJk`,
    'play-btn-2',
    'records2',
    '動画2を行う'
  );
})();
// ページごとのキー接頭辞
const pageKey = document.title.replace(/\s+/g, '_');

// エクスポートボタンの処理
const exportBtn = document.getElementById('export-btn');
exportBtn.addEventListener('click', () => {
  // localStorage の中から当ページ向けのキーだけ抜き出す
  const data = {};
  Object.keys(localStorage).forEach(key => {
    if (key.includes(pageKey)) {
      try {
        data[key] = JSON.parse(localStorage.getItem(key));
      } catch {
        data[key] = localStorage.getItem(key);
      }
    }
  });

  // JSON にして Blob を作成
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);

  // ダウンロード用リンクを作って自動クリック
  const a = document.createElement('a');
  a.href        = url;
  a.download    = `storage_${pageKey}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});
