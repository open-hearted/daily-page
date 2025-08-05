document.addEventListener('DOMContentLoaded', () => {
  const pageKey = document.title;
  const getTime = () => new Date().toISOString();
  const getKey = type => `${type}_${pageKey}`;

  // ===== Laundry =====
  const laundryContainer = document.getElementById('laundry-tasks');
  const addLaundryBtn = document.getElementById('add-laundry');
  let laundryData = JSON.parse(localStorage.getItem(getKey('laundryStatus')) || '[]');

  function renderLaundry() {
    laundryContainer.innerHTML = '';
    laundryData.forEach((task, i) => {
      const row = document.createElement('div');
      row.className = 'task-row';
      ['🧺','📥','🌞','📦'].forEach((icon, j) => {
        const step = task.steps[j];
        const span = document.createElement('span');
        span.className = `step ${step.state}`;
        span.textContent = icon;
        span.title = `${step.state} @ ${step.time || '未記録'}`;
        span.onclick = () => {
          const newState = step.state === 'checked' ? 'unchecked' : 'checked';
          const newTime = getTime();
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
    const newTask = {
      steps: ['unchecked','unchecked','unchecked','unchecked'].map(state => ({ state, time: null }))
    };
    laundryData.push(newTask);
    localStorage.setItem(getKey('laundryStatus'), JSON.stringify(laundryData));
    renderLaundry();
  };

  renderLaundry();

  // ===== Shared Render with Edit/Delete =====
  function renderEditableList(data, container, key, fields) {
    container.innerHTML = '';
    data.forEach((item, i) => {
      const row = document.createElement('div');
      row.className = 'task-row';
      row.textContent = fields.map(f => `${item[f]} (${item.time})`).join(' | ');

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
      cleanupData.push({ text, time: getTime() });
      localStorage.setItem(getKey('cleanup'), JSON.stringify(cleanupData));
      renderCleanup();
    }
  };

  // ===== Diary =====
  const diaryBtn = document.getElementById('diary-btn');
  const diaryInput = document.getElementById('diary-input');
  const diaryList = document.getElementById('diary-list');
  let diaryData = JSON.parse(localStorage.getItem(getKey('diary')) || '[]');
  function renderDiary() {
    renderEditableList(diaryData, diaryList, 'diary', ['text']);
  }
  diaryBtn.onclick = () => {
    const text = diaryInput.value.trim();
    if (text) {
      diaryData.push({ text, time: getTime() });
      localStorage.setItem(getKey('diary'), JSON.stringify(diaryData));
      diaryInput.value = '';
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
      expenseData.push({ amount, desc, time: getTime() });
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
      studyData.push({ text, time: getTime() });
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
