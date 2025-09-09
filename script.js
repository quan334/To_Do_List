// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // DOM Elements
    const taskInput = document.getElementById('taskInput');
    const addBtn = document.getElementById('addBtn');
    const tasksContainer = document.querySelector('.tasks-container');
    const tasksCount = document.getElementById('tasks-count');
    const filterBtns = document.querySelectorAll('.filter-btn');

    let tasks = [];

    // Add new task
    addBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            addTask(taskText);
            taskInput.value = '';
        }
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const taskText = taskInput.value.trim();
            if (taskText) {
                addTask(taskText);
                taskInput.value = '';
            }
        }
    });

    function addTask(text) {
        const task = {
            id: Date.now(),
            text,
            completed: false
        };
        tasks.push(task);
        renderTask(task);
        updateTasksCount();
    }

    function renderTask(task) {
        const taskElement = document.createElement('div');
        taskElement.className = `card task-card ${task.completed ? 'completed' : ''}`;
        taskElement.dataset.id = task.id;
        
        taskElement.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${task.text}</span>
            <button class="delete-btn">
                <i data-lucide="trash-2"></i>
            </button>
        `;

        tasksContainer.appendChild(taskElement);
        lucide.createIcons();

        // Add event listeners
        const checkbox = taskElement.querySelector('input');
        checkbox.addEventListener('change', () => toggleTask(task.id));

        const deleteBtn = taskElement.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
    }

    function toggleTask(id) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            const taskElement = document.querySelector(`[data-id="${id}"]`);
            taskElement.classList.toggle('completed');
            updateTasksCount();
        }
    }

    function deleteTask(id) {
        const taskElement = document.querySelector(`[data-id="${id}"]`);
        taskElement.style.opacity = '0';
        setTimeout(() => {
            tasks = tasks.filter(t => t.id !== id);
            taskElement.remove();
            updateTasksCount();
        }, 300);
    }

    function updateTasksCount() {
        const remainingTasks = tasks.filter(t => !t.completed).length;
        tasksCount.textContent = remainingTasks;
    }

    // Filter tasks
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            const taskElements = document.querySelectorAll('.task-card');
            
            taskElements.forEach(el => {
                const task = tasks.find(t => t.id === parseInt(el.dataset.id));
                if (filter === 'all' || 
                    (filter === 'active' && !task.completed) || 
                    (filter === 'completed' && task.completed)) {
                    el.style.display = 'flex';
                } else {
                    el.style.display = 'none';
                }
            });
        });
    });
});