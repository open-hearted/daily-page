// daily-record.js
(() => {
  /**
   * JST の現在時刻を HH:MM 形式で返す
   */
  function getJstTime() {
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  }

  /**
   * ボタンとリストを紐付けて、localStorage に配列で保存・レンダリングする
   * @param {string} storageKey localStorage のキー
   * @param {string} btnId      ボタンの ID
   * @param {string} listId     UL 要素の ID
   * @param {string} label      リストに表示するラベル
   */
  function setupRecords(storageKey, btnId, listId, label) {
    const btn    = document.getElementById(btnId);
    const listEl = document.getElementById(listId);
    // 既存データを読み込む（なければ空配列）
    let records  = JSON.parse(localStorage.getItem(storageKey) || '[]');

    // 配列を画面に出力する関数
    function render() {
      listEl.innerHTML = '';
      records.forEach((time, idx) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <span>${label}：${time}</span>
          <button class="del-btn" data-idx="${idx}">削除</button>
        `;
        listEl.appendChild(li);
      });
      // 削除ボタンのイベント
      listEl.querySelectorAll('.del-btn').forEach(button => {
        button.addEventListener('click', e => {
          const i = parseInt(e.currentTarget.dataset.idx, 10);
          records.splice(i, 1);
          localStorage.setItem(storageKey, JSON.stringify(records));
          render();
        });
      });
    }

    // ボタン押下時の処理
    btn.addEventListener('click', () => {
      const ts = getJstTime();
      records.push(ts);
      localStorage.setItem(storageKey, JSON.stringify(records));
      render();
    });

    // 初期レンダリング
    render();
  }

  // ページタイトルに日付が入っている想定（例: "2025-06-13 金"）
  const pageDate = document.title;

  // 各セットアップ呼び出し
  setupRecords(
    `dailyLaundry_${pageDate}`,  // localStorageキー
    'laundry-btn',               // ボタンID
    'laundry-list',              // リストULのID
    '洗濯'                       // ラベル
  );

  // --- 追加したい回収用セットアップ ---
  setupRecords(
    `dailyLaundryCollect_${document.title}`,
    'collect-btn',
    'collect-list',
    '洗濯物を回収する'
  );

  setupRecords(
    `video1_${pageDate}_BUYUN3gXtd8`,
    'play-btn-1',
    'records1',
    '動画1を行う'
  );

  setupRecords(
    `video2_${pageDate}_nbm-G5i-NJk`,
    'play-btn-2',
    'records2',
    '動画2を行う'
  );
})();
