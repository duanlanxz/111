const input = document.getElementById('todoInput');
const list = document.getElementById('todoList');
const statusBar = document.getElementById('statusBar');

let todos = JSON.parse(localStorage.getItem('todos') || '[]');
let filter = 'all';

input.addEventListener('keydown', e => {
    if (e.key === 'Enter') addTodo();
});

function save() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function addTodo() {
    const text = input.value.trim();
    if (!text) return;
    todos.unshift({ id: Date.now(), text, done: false });
    input.value = '';
    save();
    render();
}

function toggleTodo(id) {
    const t = todos.find(t => t.id === id);
    if (t) t.done = !t.done;
    save();
    render();
}

function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    save();
    render();
}

function setFilter(f, btn) {
    filter = f;
    document.querySelectorAll('.filters button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    render();
}

function escapeHtml(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
}

function render() {
    const filtered = todos.filter(t => {
        if (filter === 'active') return !t.done;
        if (filter === 'done') return t.done;
        return true;
    });

    if (filtered.length === 0) {
        list.innerHTML = '<li class="empty">暂无待办事项</li>';
    } else {
        list.innerHTML = filtered.map(t => `
            <li class="todo-item ${t.done ? 'done' : ''}">
                <input type="checkbox" ${t.done ? 'checked' : ''} onchange="toggleTodo(${t.id})">
                <span>${escapeHtml(t.text)}</span>
                <button class="delete-btn" onclick="deleteTodo(${t.id})">&times;</button>
            </li>
        `).join('');
    }

    const total = todos.length;
    const doneCount = todos.filter(t => t.done).length;
    statusBar.textContent = total ? `共 ${total} 项，已完成 ${doneCount} 项` : '';
}

render();
