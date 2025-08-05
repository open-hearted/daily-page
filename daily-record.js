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
    <span class="step unchecked" onclick="toggle(this)" title="洗濯">🧺</span>
    <span class="step unchecked" onclick="toggle(this)" title="回収">📥</span>
    <span class="step unchecked" onclick="toggle(this)" title="干す">🌞</span>
    <span class="step unchecked" onclick="toggle(this)" title="しまう">📦</span>
    <button onclick="this.parentElement.remove()">削除</button>
  `;

  container.appendChild(row);

  // Save the task with timestamp
  saveTaskWithTimestamp('laundry-tasks');
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

  // Save the task with timestamp
  saveTaskWithTimestamp('cleanup-tasks');
}

// Save task with timestamp
function saveTaskWithTimestamp(taskId) {
  const now = new Date();
  const timestamp = `${now.getHours()}:${now.getMinutes()}`;
  let tasks = JSON.parse(localStorage.getItem(taskId) || '[]');
  tasks.push({ time: timestamp, task: taskId });
  localStorage.setItem(taskId, JSON.stringify(tasks));
}

// =========================
// ローカルストレージ + 記録管理
// =========================
document.addEventListener('DOMContentLoaded', () => {
  loadTasksFromStorage();
  function loadTasksFromStorage() {
    // Load laundry tasks from localStorage
    const laundryTasks = JSON.parse(localStorage.getItem('laundry-tasks') || '[]');
    const collectTasks = JSON.parse(localStorage.getItem('collect-tasks') || '[]');
    const cleanupTasks = JSON.parse(localStorage.getItem('cleanup-tasks') || '[]');

    // Render each task with its state (checked or unchecked)
    renderTaskList('laundry-tasks', laundryTasks);
    renderTaskList('collect-tasks', collectTasks);
    renderCleanupTasks(cleanupTasks);
  }

  function renderTaskList(taskId, tasks) {
    const container = document.getElementById(taskId);
    container.innerHTML = '';
    tasks.forEach((task) => {
      const row = document.createElement('div');
      row.className = 'task-row';
      row.innerHTML = `
        <span class="step ${task.state}" onclick="toggle(this)" title="${task.title}">${task.icon}</span>
        <button onclick="this.parentElement.remove()">削除</button>
      `;
      container.appendChild(row);
    });
  }

  function renderCleanupTasks(tasks) {
    const container = document.getElementById('cleanup-tasks');
    container.innerHTML = '';
    tasks.forEach((task) => {
      const row = document.createElement('div');
      row.className = 'task-row';
      row.innerHTML = `
        <input type="text" value="${task.text}" placeholder="掃除した場所や内容を入力" style="flex:1;">
        <button onclick="this.parentElement.remove()">削除</button>
      `;
      container.appendChild(row);
    });
  }

  const exportBtn = document.getElementById('export-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const data = {};
      // Collect all task data and other localStorage items
      Object.keys(localStorage).forEach(key => {
        try {
          data[key] = JSON.parse(localStorage.getItem(key));
        } catch {
          data[key] = localStorage.getItem(key);
        }
      });

      // Generate filename based on the HTML file's title
      const title = document.title.replace(/\s+/g, '_') + '.json';
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = title; // Use the HTML file's title for the JSON filename
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }
});
