document.addEventListener('DOMContentLoaded', () => {
  const pageKey = document.title;
  const getKey = type => `${type}_${pageKey}`;
  const getTime = () => {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  };

  // ================= 🧺 Laundry =================
  const laundryContainer = document.getElementById('laundry-tasks');
  const addLaundryBtn = document.getElementById('add-laundry');
  let laundryData = JSON.parse(localStorage.getItem(getKey('laundryStatus')) || '[]');

  const renderLaundry = () => {
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
  };

  addLaundryBtn.onclick = () => {
    laundryData.push({
      steps: ['unchecked','unchecked','unchecked','unchecked'].map(state => ({ state, time: null }))
    });
    localStorage.setItem(getKey('laundryStatus'), JSON.stringify(laundryData));
    renderLaundry();
  };

  renderLaundry();

  // ================= 🧹 Cleanup =================
  const cleanupContainer = document.getElementById('cleanup-tasks');
  const addCleanupBtn = document.getElementById('add-cleanup');
  let cleanupData = JSON.parse(localStorage.getItem(getKey('cleanup')) || '[]');

  addCleanupBtn.onclick = () => {
    const text = prompt('掃除内容を入力してください');
    if (text) {
      const item = { text, time: getTime() };
      cleanupData.push(item);
      localStorage.setItem(getKey('cleanup'), JSON.stringify(cleanupData));
      renderCleanup();
    }
  };

  const renderCleanup = () => {
    cleanupContainer.innerHTML = '';
    cleanupData.forEach((item, i) => {
      const div = document.createElement('div');
      div.textContent = `${item.text} (${item.time})`;
      cleanupContainer.appendChild(div);
    });
  };

  renderCleanup();

  // ================= 📔 Diary =================
  const diaryBtn = document.getElementById('diary-btn');
  const diaryInput = document.getElementById('diary-input');
  const diaryList = document.getElementById('diary-list');
  let diaryData = JSON.parse(localStorage.getItem(getKey('diary')) || '[]');

  diaryBtn.onclick = () => {
    const text = diaryInput.value.trim();
    if (text) {
      diaryData.push({ text, time: getTime() });
      localStorage.setItem(getKey('diary'), JSON.stringify(diaryData));
      renderDiary();
      diaryInput.value = '';
    }
  };

  const renderDiary = () => {
    diaryList.innerHTML = '';
    diaryData.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.text} (${item.time})`;
      diaryList.appendChild(li);
    });
  };

  renderDiary();

  // ================= 💰 Expense =================
  const expenseBtn = document.getElementById('expense-btn');
  const expenseList = document.getElementById('expense-list');
  const expenseAmount = document.getElementById('expense-amount');
  const expenseDesc = document.getElementById('expense-desc');
  let expenseData = JSON.parse(localStorage.getItem(getKey('expenses')) || '[]');

  expenseBtn.onclick = () => {
    const amount = expenseAmount.value;
    const desc = expenseDesc.value.trim();
    if (amount && desc) {
      expenseData.push({ amount, desc, time: getTime() });
      localStorage.setItem(getKey('expenses'), JSON.stringify(expenseData));
      renderExpenses();
      expenseAmount.value = '';
      expenseDesc.value = '';
    }
  };

  const renderExpenses = () => {
    expenseList.innerHTML = '';
    expenseData.forEach(e => {
      const li = document.createElement('li');
      li.textContent = `${e.desc}: ¥${e.amount} (${e.time})`;
      expenseList.appendChild(li);
    });
  };

  renderExpenses();

  // ================= 📈 Study =================
  const studyBtn = document.getElementById('study-btn');
  const studyInput = document.getElementById('study-input');
  const studyList = document.getElementById('study-list');
  let studyData = JSON.parse(localStorage.getItem(getKey('study')) || '[]');

  studyBtn.onclick = () => {
    const text = studyInput.value
