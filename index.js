const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const progressText = document.getElementById('progress-text');
const progressBar = document.querySelector('.progress');
const modeToggle = document.getElementById('mode-toggle');
const pract=document.querySelector('.btn')

const ispractise=false
if(ispractise){
  pract.style.display='block'
}else{
  pract.style.display='none'
}

document.addEventListener('DOMContentLoaded', () => {
  loadTasks();
  updateProgress();
});



// Light/Dark Mode
modeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  document.body.classList.contains('dark')
    ? modeToggle.textContent = '☀️'
    : modeToggle.textContent = '🌙';
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
  modeToggle.textContent = '☀️';
}

// Handle form submission
taskForm.addEventListener('submit', e => {
  e.preventDefault();
  const taskText = taskInput.value.trim();
  if (taskText !== '') {
    addTask(taskText);
    taskInput.value = '';
  }
});

// Add a task
function addTask(text, completed = false) {
  const li = document.createElement('li');
  if (completed) li.classList.add('completed');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = completed;
  checkbox.addEventListener('change', () => {
    li.classList.toggle('completed');
    sortTasks();
    saveTasks();
    updateProgress();
  });

  const span = document.createElement('span');
  span.textContent = text;

  const actions = document.createElement('div');
  actions.className = 'actions';

  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.onclick = () => {
    const newText = prompt('Edit task:', span.textContent);
    if (newText !== null && newText.trim()) {
      span.textContent = newText.trim();
      saveTasks();
    }
  };

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.onclick = () => {
    taskList.removeChild(li);
    saveTasks();
    updateProgress();
  };

  actions.appendChild(editBtn);
  actions.appendChild(deleteBtn);

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(actions);

  taskList.appendChild(li);
  sortTasks();
  saveTasks();
  updateProgress();
}

// Save tasks to localStorage
function saveTasks() {
  const tasks = [];
  taskList.querySelectorAll('li').forEach(li => {
    const text = li.querySelector('span').textContent;
    const completed = li.classList.contains('completed');
    tasks.unshift({ text, completed });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(task => addTask(task.text, task.completed));
}

// Update progress and count
function updateProgress() {
  const tasks = taskList.querySelectorAll('li');
  const completedTasks = taskList.querySelectorAll('li.completed');
  const total = tasks.length;
  const completed = completedTasks.length;

  progressText.textContent = `${completed} / ${total} Completed`;
  progressBar.style.width = total > 0 ? `${(completed / total) * 100}%` : '0%';
}

// Move completed tasks to bottom
function sortTasks() {
  const tasks = [...taskList.children];
  tasks.sort((a, b) => {
    return a.classList.contains('completed') - b.classList.contains('completed');
  });
  tasks.forEach(task => taskList.appendChild(task));
}
