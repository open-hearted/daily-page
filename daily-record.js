document.addEventListener('DOMContentLoaded', () => {
  // 日本時間で24時間表示の時刻取得関数（全体で使う）
  function getJSTTime() {
    const now = new Date();
    const jst = new Date(now.getTime() + (9 * 60 * 60 * 1000 - now.getTimezoneOffset() * 60 * 1000));
    const yyyy = jst.getFullYear();
    const mm = String(jst.getMonth() + 1).padStart(2, '0');
    const dd = String(jst.getDate()).padStart(2, '0');
    const hh = String(jst.getHours()).padStart(2, '0');
    const min = String(jst.getMinutes()).padStart(2, '0');
    const ss = String(jst.getSeconds()).padStart(2, '0');
    return `${yyyy}/${mm}/${dd} ${hh}:${min}:${ss}`;
  }
  const pageKey = document.title;
  const getTime = () => new Date().toISOString();
  const getKey = type => `${type}_${pageKey}`;

  // ===== Laundry =====
  const laundryContainer = document.getElementById('laundry-tasks');
  const addLaundryBtn = document.getElementById('add-laundry');
  // 入力欄を追加
  const laundryInput = document.createElement('input');
  laundryInput.type = 'text';
  laundryInput.placeholder = '洗濯内容を入力';
  laundryInput.style = 'margin-right:8px; width:60%';
  laundryContainer.parentNode.insertBefore(laundryInput, laundryContainer);

  let laundryData = JSON.parse(localStorage.getItem(getKey('laundryStatus')) || '[]');

  function renderLaundry() {
    laundryContainer.innerHTML = '';
    laundryData.forEach((task, i) => {
      const row = document.createElement('div');
      row.className = 'task-row';
      // 洗濯内容表示（時刻は日本時間の時刻のみ）
      if (task.text) {
        const timeOnly = task.time ? task.time.slice(11, 19) : '';
        const textSpan = document.createElement('span');
        textSpan.textContent = `${task.text} (${timeOnly})`;
        row.appendChild(textSpan);
      }
      ['🧺','📥','🌞','📦'].forEach((icon, j) => {
        const step = task.steps[j];
        const span = document.createElement('span');
        span.className = `step ${step.state}`;
        span.textContent = icon;
        // step.timeはJSTで保存
        const stepTimeOnly = step.time ? step.time.slice(11, 19) : '未記録';
        span.title = `${step.state} @ ${stepTimeOnly}`;
        span.onclick = () => {
          const newState = step.state === 'checked' ? 'unchecked' : 'checked';
          const newTime = getJSTTime();
          laundryData[i].steps[j] = { state: newState, time: newTime };
          localStorage.setItem(getKey('laundryStatus'), JSON.stringify(laundryData));
          renderLaundry();
        };
        row.appendChild(span);
      });
      const del = document.createElement('button');
      del.textContent = '削除';
      del.onclick = () => {
        laundryData.splice(i, 1);
        localStorage.setItem(getKey('laundryStatus'), JSON.stringify(laundryData));
        renderLaundry();
      };
      row.appendChild(del);
      laundryContainer.appendChild(row);
    });
  }

  addLaundryBtn.onclick = () => {
    // prompt風に入力欄を使う
    const text = laundryInput.value.trim() || prompt('洗濯内容を入力してください');
    if (text) {
      const newTask = {
        text,
        time: getJSTTime(),
        steps: ['unchecked','unchecked','unchecked','unchecked'].map(state => ({ state, time: null }))
      };
      laundryData.push(newTask);
      localStorage.setItem(getKey('laundryStatus'), JSON.stringify(laundryData));
      laundryInput.value = '';
      renderLaundry();
    }
  };

  renderLaundry();

  // ===== Shared Render with Edit/Delete =====
  function renderEditableList(data, container, key, fields) {
    container.innerHTML = '';
    data.forEach((item, i) => {
      const row = document.createElement('div');
      row.className = 'task-row';
      // 時刻は日本時間の時刻のみ表示
      const timeOnly = item.time ? item.time.slice(11, 19) : '';
      row.textContent = fields.map(f => `${item[f]} (${timeOnly})`).join(' | ');

      const editBtn = document.createElement('button');
      editBtn.textContent = '編集';
      editBtn.onclick = () => {
        fields.forEach(f => {
          const newVal = prompt(`${f}を編集`, item[f]);
          if (newVal !== null) item[f] = newVal;
        });
        localStorage.setItem(getKey(key), JSON.stringify(data));
        renderers[key]();
      };

      const delBtn = document.createElement('button');
      delBtn.textContent = '削除';
      delBtn.onclick = () => {
        data.splice(i, 1);
        localStorage.setItem(getKey(key), JSON.stringify(data));
        renderers[key]();
      };

      row.appendChild(editBtn);
      row.appendChild(delBtn);
      container.appendChild(row);
    });
  }

  // ===== Cleanup =====
  const cleanupContainer = document.getElementById('cleanup-tasks');
  const addCleanupBtn = document.getElementById('add-cleanup');
  let cleanupData = JSON.parse(localStorage.getItem(getKey('cleanup')) || '[]');
  function renderCleanup() {
    renderEditableList(cleanupData, cleanupContainer, 'cleanup', ['text']);
  }
  addCleanupBtn.onclick = () => {
    const text = prompt('掃除内容を入力してください');
    if (text) {
      cleanupData.push({ text, time: getJSTTime() });
      localStorage.setItem(getKey('cleanup'), JSON.stringify(cleanupData));
      renderCleanup();
    }
  };

  // ===== Diary =====
  const diaryBtn = document.getElementById('diary-btn');
  // 入力欄を削除
  const diaryInput = document.getElementById('diary-input');
  if (diaryInput) diaryInput.remove();
  let diaryData = JSON.parse(localStorage.getItem(getKey('diary')) || '[]');
  const diaryList = document.getElementById('diary-list');

  // 日本時間で24時間表示の時刻取得関数
  function getJSTTime() {
    const now = new Date();
    // JSTに変換
    const jst = new Date(now.getTime() + (9 * 60 * 60 * 1000 - now.getTimezoneOffset() * 60 * 1000));
    const yyyy = jst.getFullYear();
    const mm = String(jst.getMonth() + 1).padStart(2, '0');
    const dd = String(jst.getDate()).padStart(2, '0');
    const hh = String(jst.getHours()).padStart(2, '0');
    const min = String(jst.getMinutes()).padStart(2, '0');
    const ss = String(jst.getSeconds()).padStart(2, '0');
    return `${yyyy}/${mm}/${dd} ${hh}:${min}:${ss}`;
  }

  function renderDiary() {
    diaryList.innerHTML = '';
    diaryData.forEach((item, i) => {
      const row = document.createElement('div');
      row.className = 'task-row';
      // 内容と時刻のみ表示
      const timeOnly = item.time ? item.time.slice(11, 19) : '';
      row.textContent = `${item.text} (${timeOnly})`;

      const editBtn = document.createElement('button');
      editBtn.textContent = '編集';
      editBtn.onclick = () => {
        const newText = prompt('日記を編集', item.text);
        if (newText !== null) item.text = newText;
        localStorage.setItem(getKey('diary'), JSON.stringify(diaryData));
        renderDiary();
      };

      const delBtn = document.createElement('button');
      delBtn.textContent = '削除';
      delBtn.onclick = () => {
        diaryData.splice(i, 1);
        localStorage.setItem(getKey('diary'), JSON.stringify(diaryData));
        renderDiary();
      };

      row.appendChild(editBtn);
      row.appendChild(delBtn);
      diaryList.appendChild(row);
    });
  }

  diaryBtn.onclick = () => {
    // 5行分のprompt入力欄
    const text = prompt('日記を記入（5行まで）', '').replace(/\r?\n/g, '\n');
    if (text && text.trim()) {
      diaryData.push({ text, time: getJSTTime() });
      localStorage.setItem(getKey('diary'), JSON.stringify(diaryData));
      renderDiary();
    }
  };

  // ===== Expenses =====
  const expenseBtn = document.getElementById('expense-btn');
  const expenseAmount = document.getElementById('expense-amount');
  const expenseDesc = document.getElementById('expense-desc');
  const expenseList = document.getElementById('expense-list');
  let expenseData = JSON.parse(localStorage.getItem(getKey('expenses')) || '[]');
  function renderExpenses() {
    renderEditableList(expenseData, expenseList, 'expenses', ['desc', 'amount']);
  }
  expenseBtn.onclick = () => {
    const amount = expenseAmount.value.trim();
    const desc = expenseDesc.value.trim();
    if (amount && desc) {
      expenseData.push({ amount, desc, time: getJSTTime() });
      localStorage.setItem(getKey('expenses'), JSON.stringify(expenseData));
      expenseAmount.value = '';
      expenseDesc.value = '';
      renderExpenses();
    }
  };

  // ===== Study =====
  const studyBtn = document.getElementById('study-btn');
  const studyInput = document.getElementById('study-input');
  const studyList = document.getElementById('study-list');
  let studyData = JSON.parse(localStorage.getItem(getKey('study')) || '[]');
  function renderStudy() {
    renderEditableList(studyData, studyList, 'study', ['text']);
  }
  studyBtn.onclick = () => {
    const text = studyInput.value.trim();
    if (text) {
      studyData.push({ text, time: getJSTTime() });
      localStorage.setItem(getKey('study'), JSON.stringify(studyData));
      studyInput.value = '';
      renderStudy();
    }
  };

  // ===== Export =====
  const exportBtn = document.getElementById('export-btn');
  exportBtn.onclick = () => {
    const data = {
      date: pageKey,
      laundry: laundryData,
      cleanup: cleanupData,
      diary: diaryData,
      expenses: expenseData,
      study: studyData
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${pageKey}_records.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ===== Renderer Map =====
  const renderers = {
    cleanup: renderCleanup,
    diary: renderDiary,
    expenses: renderExpenses,
    study: renderStudy
  };

  // ===== Initial Renders =====
  renderCleanup();
  renderDiary();
  renderExpenses();
  renderStudy();
});
