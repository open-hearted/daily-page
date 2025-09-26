document.addEventListener('DOMContentLoaded', () => {
  // 日本時間（JST）を常に返す関数（ファイル内で統一）
  function getJSTTime() {
    return new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' });
  }
  const pageKey = document.title;
  const getTime = () => new Date().toISOString();
  const getKey = type => `${type}_${pageKey}`;

    // ===== Shower =====
    const showerContainer = document.getElementById('shower-tasks');
    const addShowerBtn = document.getElementById('add-shower');
    let showerData = JSON.parse(localStorage.getItem(getKey('shower')) || '[]');

    function renderShower() {
      showerContainer.innerHTML = '';
      showerData.forEach((item, i) => {
        const row = document.createElement('div');
        row.className = 'task-row';
        let dateTime = item.time || '';
        const pageDate = pageKey.match(/(\d{4}-\d{2}-\d{2})-\d{2}-\d{2}/)?.[1];
        const recordDateRaw = dateTime.match(/\d{4}\/\d{1,2}\/\d{1,2}/)?.[0];
        let recordDate = '';
        if (recordDateRaw) {
          const parts = recordDateRaw.split('/');
          recordDate = `${parts[0]}-${parts[1].padStart(2,'0')}-${parts[2].padStart(2,'0')}`;
        }
        if (pageDate && recordDate && pageDate === recordDate) {
          // HH:mmのみ抽出（例: '2025/8/31 0:07:00' や '2025/08/31 00:07:00' → '00:07'）
          const timeMatch = dateTime.match(/(\d{1,2}):(\d{2}):\d{2}/);
          if (timeMatch) {
            const hour = timeMatch[1].padStart(2, '0');
            const minute = timeMatch[2];
            dateTime = `${hour}:${minute}`;
          }
        }
        row.textContent = `${item.text ?? ''} (${dateTime})`;

        const editBtn = document.createElement('button');
        editBtn.textContent = '編集';
        editBtn.onclick = () => {
          const newText = prompt('シャワー内容を編集', item.text ?? '');
          if (newText !== null) {
            showerData[i].text = newText;
            localStorage.setItem(getKey('shower'), JSON.stringify(showerData));
            renderShower();
          }
        };
        row.appendChild(editBtn);

        const delBtn = document.createElement('button');
        delBtn.textContent = '削除';
        delBtn.onclick = () => {
          showerData.splice(i, 1);
          localStorage.setItem(getKey('shower'), JSON.stringify(showerData));
          renderShower();
        };
        row.appendChild(delBtn);
        showerContainer.appendChild(row);
      });
    }

    addShowerBtn.onclick = () => {
      const text = prompt('シャワー内容を入力してください（空欄可）');
      // 空欄でも記録可能
      if (text !== null) {
        showerData.push({ text: text, time: getJSTTime() });
        localStorage.setItem(getKey('shower'), JSON.stringify(showerData));
        renderShower();
      }
    };

    renderShower();

  // ===== Laundry =====
  const laundryContainer = document.getElementById('laundry-tasks');
  const addLaundryBtn = document.getElementById('add-laundry');
  // 入力欄（テキストボックス）は削除。プロンプト入力のみ。

  let laundryData = JSON.parse(localStorage.getItem(getKey('laundryStatus')) || '[]');

  function renderLaundry() {
    laundryContainer.innerHTML = '';
    laundryData.forEach((task, i) => {
      const row = document.createElement('div');
      row.className = 'task-row';
      // 洗濯内容表示（時刻は日本時間の時刻のみ）
      if (task.text) {
        let dateTime = task.time || '';
  // ページ名から日付部分（YYYY-MM-DD）を抽出
  const pageDate = pageKey.match(/(\d{4}-\d{2}-\d{2})-\d{2}-\d{2}/)?.[1];
        // 記録の日時から日付部分を抽出（YYYY-MM-DD形式に変換）
        const recordDateRaw = dateTime.match(/\d{4}\/\d{1,2}\/\d{1,2}/)?.[0];
        let recordDate = '';
        if (recordDateRaw) {
          const parts = recordDateRaw.split('/');
          recordDate = `${parts[0]}-${parts[1].padStart(2,'0')}-${parts[2].padStart(2,'0')}`;
        }
        // 日付が一致していたら時刻のみ表示
        if (pageDate && recordDate && pageDate === recordDate) {
          // HH:mmのみ抽出（例: '2025/8/31 0:07:00' や '2025/08/31 00:07:00' → '00:07'）
          const timeMatch = dateTime.match(/(\d{1,2}):(\d{2}):\d{2}/);
          if (timeMatch) {
            const hour = timeMatch[1].padStart(2, '0');
            const minute = timeMatch[2];
            dateTime = `${hour}:${minute}`;
          }
        }
        const textSpan = document.createElement('span');
        textSpan.textContent = `${task.text} (${dateTime})`;
        row.appendChild(textSpan);
      }
      // 編集ボタン
      const editBtn = document.createElement('button');
      editBtn.textContent = '編集';
      editBtn.onclick = () => {
        const newText = prompt('洗濯内容を編集', task.text);
        if (newText !== null) {
          laundryData[i].text = newText;
          localStorage.setItem(getKey('laundryStatus'), JSON.stringify(laundryData));
          renderLaundry();
        }
      };
      row.appendChild(editBtn);

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
    // プロンプトで内容を入力
    const text = prompt('洗濯内容を入力してください');
    if (text && text.trim()) {
      const newTask = {
        text: text.trim(),
        time: getJSTTime(),
        steps: ['unchecked','unchecked','unchecked','unchecked'].map(state => ({ state, time: null }))
      };
      laundryData.push(newTask);
      localStorage.setItem(getKey('laundryStatus'), JSON.stringify(laundryData));
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
      // 年月日＋時刻（日本時間）表示
      let dateTime = item.time || '';
  const pageDate = pageKey.match(/(\d{4}-\d{2}-\d{2})-\d{2}-\d{2}/)?.[1];
      const recordDateRaw = dateTime.match(/\d{4}\/\d{1,2}\/\d{1,2}/)?.[0];
      let recordDate = '';
      if (recordDateRaw) {
        const parts = recordDateRaw.split('/');
        recordDate = `${parts[0]}-${parts[1].padStart(2,'0')}-${parts[2].padStart(2,'0')}`;
      }
      if (pageDate && recordDate && pageDate === recordDate) {
        // HH:mmのみ抽出（例: '2025/8/31 0:07:00' や '2025/08/31 00:07:00' → '00:07'）
        const timeMatch = dateTime.match(/(\d{1,2}):(\d{2}):\d{2}/);
        if (timeMatch) {
          const hour = timeMatch[1].padStart(2, '0');
          const minute = timeMatch[2];
          dateTime = `${hour}:${minute}`;
        }
      }
      row.textContent = fields.map(f => `${item[f]} (${dateTime})`).join(' | ');

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

  function renderDiary() {
    diaryList.innerHTML = '';
    diaryData.forEach((item, i) => {
      const row = document.createElement('div');
      row.className = 'task-row';
      let dateTime = item.time || '';
      // ページ名から日付部分（YYYY-MM-DD）を抽出
      const pageDate = pageKey.match(/(\d{4}-\d{2}-\d{2})-\d{2}-\d{2}/)?.[1];
      // 記録の日時から日付部分を抽出（YYYY-MM-DD形式に変換）
      const recordDateRaw = dateTime.match(/(\d{4})\/(\d{1,2})\/(\d{1,2})/);
      let recordDate = '';
      if (recordDateRaw) {
        recordDate = `${recordDateRaw[1]}-${recordDateRaw[2].padStart(2,'0')}-${recordDateRaw[3].padStart(2,'0')}`;
      }
      if (pageDate && recordDate && pageDate === recordDate) {
        // HH:mmのみ抽出（例: '2025/8/31 0:07:00' や '2025/08/31 00:07:00' → '00:07'）
        const timeMatch = dateTime.match(/(\d{1,2}):(\d{2}):\d{2}/);
        if (timeMatch) {
          const hour = timeMatch[1].padStart(2, '0');
          const minute = timeMatch[2];
          dateTime = `${hour}:${minute}`;
        }
      }
      row.textContent = `${item.text} (${dateTime})`;

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
    expenseList.innerHTML = '';
    expenseData.forEach((item, i) => {
      const row = document.createElement('div');
      row.className = 'task-row';
      let dateTime = item.time || '';
      // ページ名から日付部分（YYYY-MM-DD）を抽出
      const pageDate = pageKey.match(/(\d{4}-\d{2}-\d{2})-\d{2}-\d{2}/)?.[1];
      // 記録の日時から日付部分を抽出（YYYY-MM-DD形式に変換）
      const recordDateRaw = dateTime.match(/(\d{4})\/(\d{1,2})\/(\d{1,2})/);
      let recordDate = '';
      if (recordDateRaw) {
        recordDate = `${recordDateRaw[1]}-${recordDateRaw[2].padStart(2,'0')}-${recordDateRaw[3].padStart(2,'0')}`;
      }
      if (pageDate && recordDate && pageDate === recordDate) {
        // HH:mmのみ抽出（例: '2025/8/31 0:07:00' や '2025/08/31 00:07:00' → '00:07'）
        const timeMatch = dateTime.match(/(\d{1,2}):(\d{2}):\d{2}/);
        if (timeMatch) {
          const hour = timeMatch[1].padStart(2, '0');
          const minute = timeMatch[2];
          dateTime = `${hour}:${minute}`;
        }
      }
      row.textContent = `${item.amount} ${item.desc} (${dateTime})`;

      const editBtn = document.createElement('button');
      editBtn.textContent = '編集';
      editBtn.onclick = () => {
        const newAmount = prompt('金額を編集', item.amount);
        if (newAmount !== null) item.amount = newAmount;
        const newDesc = prompt('内容を編集', item.desc);
        if (newDesc !== null) item.desc = newDesc;
        localStorage.setItem(getKey('expenses'), JSON.stringify(expenseData));
        renderExpenses();
      };

      const delBtn = document.createElement('button');
      delBtn.textContent = '削除';
      delBtn.onclick = () => {
        expenseData.splice(i, 1);
        localStorage.setItem(getKey('expenses'), JSON.stringify(expenseData));
        renderExpenses();
      };

      row.appendChild(editBtn);
      row.appendChild(delBtn);
      expenseList.appendChild(row);
    });
  }
  expenseBtn.onclick = () => {
    const amount = String(expenseAmount.value).trim();
    const desc = String(expenseDesc.value).trim();
    if (amount !== '' && desc !== '') {
      expenseData.push({ amount, desc, time: getJSTTime() });
      localStorage.setItem(getKey('expenses'), JSON.stringify(expenseData));
      expenseAmount.value = '';
      expenseDesc.value = '';
      renderExpenses();
    } else {
      alert('金額と内容の両方を入力してください');
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
    study: renderStudy,
    shower: renderShower
  };

  // ===== Initial Renders =====
  renderCleanup();
  renderDiary();
  renderExpenses();
  renderStudy();
  renderShower();

// 料理カテゴリ（掃除と同じロジックで登録）
const COOKING_STEPS = ['献立', '買い出し', '下準備', '調理', '配膳', '片付け'];
// registerTaskButton(ボタンID, コンテナID, ステップ配列, ストレージキー/カテゴリ名)
registerTaskButton('add-cooking', 'cooking-tasks', COOKING_STEPS, 'cooking');
});
