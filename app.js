let tasks = JSON.parse(localStorage.getItem('doable-tasks')) || [];
let currentFilter = 'all';

function saveTasks() {
  localStorage.setItem('doable-tasks', JSON.stringify(tasks));
}

function addTask() {
  const input = document.getElementById('task-input');
  const text = input.value.trim();
  if (!text) {
    input.style.borderColor = '#ff4545';
    setTimeout(() => input.style.borderColor = '', 600);
    return;
  }
  tasks.unshift({ id: Date.now(), text, done: false });
  saveTasks();
  input.value = '';
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  const li = document.querySelector(`[data-id="${id}"]`);
  if (li) {
    li.style.transition = 'opacity 0.2s, transform 0.2s';
    li.style.opacity = '0';
    li.style.transform = 'translateX(20px)';
    setTimeout(() => {
      tasks = tasks.filter(t => t.id !== id);
      saveTasks();
      renderTasks();
    }, 200);
  }
}

function clearDone() {
  tasks = tasks.filter(t => !t.done);
  saveTasks();
  renderTasks();
}

function renderTasks() {
  const list = document.getElementById('task-list');
  const empty = document.getElementById('empty-state');

  const filtered = tasks.filter(t => {
    if (currentFilter === 'active') return !t.done;
    if (currentFilter === 'done') return t.done;
    return true;
  });

  list.innerHTML = '';

  if (filtered.length === 0) {
    empty.classList.add('visible');
  } else {
    empty.classList.remove('visible');
  }

  filtered.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item ${task.done ? 'done' : ''}`;
    li.dataset.id = task.id;

    li.innerHTML = `
      <div class="task-check" onclick="toggleTask(${task.id})">
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#0e0e0e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="2,6 5,9 10,3"/>
        </svg>
      </div>
      <span class="task-text">${escapeHTML(task.text)}</span>
      <button class="delete-btn" onclick="deleteTask(${task.id})" title="Delete">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    `;
    list.appendChild(li);
  });

  // Update stats
  document.getElementById('total-count').textContent = tasks.length;
  document.getElementById('done-count').textContent = tasks.filter(t => t.done).length;
}

function escapeHTML(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

// Enter key to add task
document.getElementById('task-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask();
});

// Initial render
renderTasks();