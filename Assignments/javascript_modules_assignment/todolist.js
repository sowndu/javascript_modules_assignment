document.addEventListener('DOMContentLoaded', loadTasks);

const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const createBtn = document.getElementById('createBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const refreshBtn = document.getElementById('refreshBtn');

createBtn.addEventListener('click', addTask);
clearAllBtn.addEventListener('click', clearAllTasks);
refreshBtn.addEventListener('click', loadTasks);

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') {
        alert('Please enter a task.');
        return;
    }

    const tasks = getTasksFromLocalStorage();
    tasks.push(taskText);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    addTaskToDOM(taskText);
    taskInput.value = '';
}

function addTaskToDOM(taskText) {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.innerHTML = `
        ${taskText}
        <span>
            <button class="btn btn-success completeBtn">  <img role="img" style="width:16px;" src="checkbox.svg"  /></button>
            <button class="btn btn-primary editBtn"><img role="img" style="width:16px;" src="edit.svg" /></button>
            <button class="btn btn-danger deleteBtn"><img role="img" style="width:16px;" src="trash.svg" /></button>
        </span>
    `;

    taskList.appendChild(li);

    li.querySelector('.completeBtn').addEventListener('click', () => {
        li.style.textDecoration = 'line-through';
    });

    li.querySelector('.editBtn').addEventListener('click', () => {
        const newTaskText = prompt('Edit task:', taskText);
        if (newTaskText) {
            li.firstChild.textContent = newTaskText.trim();
            updateTaskInLocalStorage(taskText, newTaskText);
        }
    });

    li.querySelector('.deleteBtn').addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this task?')) {
            li.remove();
            deleteTaskFromLocalStorage(taskText);
        }
    });
}

function loadTasks() {
    taskList.innerHTML = '';
    const tasks = getTasksFromLocalStorage();
    tasks.forEach(taskText => addTaskToDOM(taskText));
}

function clearAllTasks() {
    if (confirm('Are you sure you want to clear all tasks?')) {
        localStorage.removeItem('tasks');
        taskList.innerHTML = '';
    }
}

function getTasksFromLocalStorage() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

function updateTaskInLocalStorage(oldTask, newTask) {
    let tasks = getTasksFromLocalStorage();
    tasks = tasks.map(task => task === oldTask ? newTask : task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function deleteTaskFromLocalStorage(taskText) {
    let tasks = getTasksFromLocalStorage();
    tasks = tasks.filter(task => task !== taskText);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
