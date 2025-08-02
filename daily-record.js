// =========================
// UI操作系（トグル・タスク追加）
// =========================
function toggle(el) {
  el.classList.toggle('checked');
  el.classList.toggle('unchecked');
}

function addLaundryTask() {
  const container = document.getElementById('laundry-tasks');
  const row = document.createElement('div');
  row.className = 'task-row';

  row.innerHTML = `
    <span class="step checked" onclick="toggle(this)" title="洗濯">🧺</span>
    <span class="step unchecked" onclick="toggle(this)" title="回収">📥</span>
    <span class="step unchecked" onclick="toggle(this)" title="干す">🌞</span>
    <span class="step unchecked" onclick="toggle(this)" title="しまう">📦</span>
    <button onclick="this.parentElement.remove()">削除</button>
  `;

  container.appendChild(row);
}

function addCleanupTask() {
  const container = document.getElementById('cleanup-tasks');
  const row = document.createElement('div');
  row.className = 'task-row';

  row.innerHTML = `
    <input type="text" placeholder="掃除した場所や内容を入力" style="flex:1;">
    <button onclick="this.parentElement.remove()">削除</button>
  `;

  container.appendChild(row);
}

// =========================
// ローカルストレージ + 記録管理
// =========================
document.addEventListener('DOMContentLoaded', () => {
  function getJstTime() {
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  }

  function setupRecords(storageKey, btnId, listId, label) {
    const btn = document.getElementById(btnId);
    const listEl = document.getElementById(listId);
    if (!btn || !listEl) return;

    let records = JSON.parse(localStorage.getItem(storageKey) || '[]');

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

  function setupFreeSection(storageKey, btnId, inputId, listId, label) {
    const btn = document.getElementById(btnId);
    const input = document.getElementById(inputId);
    const listEl = document.getElementById(listId);
    if (!btn || !input || !listEl) return;

    let records = JSON.parse(localStorage.getItem(storageKey) || '[]');

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

  function setupExpenseSection(storageKey, amountInputId, descInputId, btnId, listId, label) {
    const amountInput = document.getElementById(amountInputId);
    const descInput = document.getElementById(descInputId);
    const btn = document.getElementById(btnId);
    const listEl = document.getElementById(listId);
    if (!amountInput || !descInput || !btn || !listEl) return;

    let records = JSON.parse(localStorage.getItem(storageKey) || '[]');

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
      const desc = descInput.value.trim();
      if (!amount || !desc) return;
      const ts = getJstTime();
      records.push({ time: ts, amount, desc });
      localStorage.setItem(storageKey, JSON.stringify(records));
      amountInput.value = '';
      descInput.value = '';
      render();
    });

    render();
  }

  const pageKey = document.title.replace(/\s+/g, '_');

  setupRecords(`dailyLaundry_${pageKey}`, 'laundry-btn', 'laundry-list', '洗濯を行う');
  setupRecords(`dailyLaundryCollect_${pageKey}`, 'collect-btn', 'collect-list', '洗濯物を回収する');
  setupFreeSection(`diary_${pageKey}`, 'diary-btn', 'diary-input', 'diary-list', '日記');
  setupExpenseSection(`expense_${pageKey}`, 'expense-amount', 'expense-desc', 'expense-btn', 'expense-list', '支出');
  setupFreeSection(`study_${pageKey}`, 'study-btn', 'study-input', 'study-list', '算数の勉強');
  setupRecords(`video1_${pageKey}_BUYUN3gXtd8`, 'play-btn-1', 'records1', '動画1を行う');
  setupRecords(`video2_${pageKey}_nbm-G5i-NJk`, 'play-btn-2', 'records2', '動画2を行う');

  const exportBtn = document.getElementById('export-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
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

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `storage_${pageKey}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }
});
