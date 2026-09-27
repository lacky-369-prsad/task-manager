const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const filterButtons =document.querySelectorAll('.filter-btn');
const themeToggle = document.getElementById('themeToggle');
const taskDate = document.getElementById('taskDate');

if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
  themeToggle. textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
  document. body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
})

function timeAgo(timestamp) {
  const diff = Math.floor((Date.now() - timestamp) / 1000);
  if (diff <60) return 'jist now';
  if (diff<3600) return Math.floor(diff / 60) + ' minutes ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'hr ago';
  return Math.floor(diff / 86400) + ' day(s) ago';
}

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
function updateTaskCount() {
   const remaining = tasks.filter(t => !t.completed).length;
      taskCount.textContent = `${remaining} task${remaining !== 1 ? 's' : ''} left`;
   }

function renderTasks() {
  taskList.innerHTML = '';
  const filtered = tasks.filter(task=> {
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return true;
  });
  if (filtered.length === 0) {
    taskList.innerHTML = '<li class="empty-msg">No tasks here</li>';
  }

filtered.forEach(task => {
  const li = document. createElement('li')
  li.className = 'task-item' + (task.completed ? ' completed' : '');

  li.innerHTML = `
    <input type="checkbox" ${task.completed ? 'checked' : ''}>
    <span class="task-text">
      ${task.text}
      ${task.dueDate ? `<span class="task-due">Due: ${task.dueDate}</span>` : ''}
      <span class="task-time">${timeAgo(task.createdAt)}</span>
    </span>
    <button class="delete-btn">Delete</button>
  `;

  const checkbox = li.querySelector('input');
  checkbox.addEventListener('change', () => {
    task.completed = checkbox.checked;
    saveTasks();
    renderTasks();
    updateTaskCount();
  });

  const deleteBtn = li.querySelector('.delete-btn');
  deleteBtn.addEventListener('click', () => {
    tasks = tasks.filter(t => t.id !== task.id);
    saveTasks();
    renderTasks();
    updateTaskCount();
  });

  taskList.appendChild(li);
});
}

taskForm.addEventListener('submit',(e) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;
  
  tasks.push({ id: Date.now(), text, completed: false, dueDate: taskDate.value, createdAt: Date.now() });
  taskDate.value = '';
  saveTasks();
  taskInput.value = '';
  renderTasks();
  updateTaskCount();
});

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
   filterButtons.forEach(b => b.classList.remove('active'));
   btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

renderTasks();
updateTaskCount();