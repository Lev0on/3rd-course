let habits = [];
let history = {};

// Сохранение
function saveData() {
    localStorage.setItem('habits', JSON.stringify(habits));
    localStorage.setItem('history', JSON.stringify(history));
}

// 2. Добавление нового квеста
document.getElementById('add-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const description = document.getElementById('description').value.trim();
    const type = document.getElementById('type').value;

    const newHabit = {
        id: Date.now(),             // уникальный id
        name: name,
        description: description,
        type: type,
        completions: []             // массив дат, когда выполнен
    };

    habits.push(newHabit);
    saveData();
    renderAll();

    // очистка формы
    this.reset();
});
// 3. Отображение всего
function renderAll() {
    renderHabitsList();
    renderStats();
    renderHistory();
}

function renderHabitsList() {
    const container = document.getElementById('habits-list');
    container.innerHTML = '';

    habits.forEach(h => {
        const div = document.createElement('div');
        div.className = 'habit-item';
        div.innerHTML = `
            <div>
                <strong>${h.name}</strong><br>
                <small>${h.description}</small>
            </div>
            <button onclick="completeHabit(${h.id})">Выполнить сегодня</button>
        `;
        container.appendChild(div);
    });
}
// 4. Выполнение квеста
window.completeHabit = function(id) {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    const today = new Date().toISOString().split('T')[0]; // "2025-04-17"
    if (!habit.completions.includes(today)) {
        habit.completions.push(today);
        // обновляем историю
        if (!history[today]) history[today] = 0;
        history[today]++;

        saveData();
        renderAll();
    } else {
        alert('Сегодня уже выполнен!');
    }
};
// 5. Статистика и мотивация
function renderStats() {
    const container = document.getElementById('stats');
    if (habits.length === 0) {
        container.innerHTML = '<p>Пока нет квестов</p>';
        return;
    }

    let totalCompletions = 0;
    habits.forEach(h => totalCompletions += h.completions.length);

    const html = `
        <p>Всего квестов: <strong>${habits.length}</strong></p>
        <p>Всего выполнено: <strong>${totalCompletions}</strong></p>
        <p>Текущая серия (streak): <strong>5 дней</strong> (пока заглушка)</p>
    `;
    container.innerHTML = html;
}

document.getElementById('motivation-btn').addEventListener('click', () => {
    const quotes = [
        "Каждый выполненный квест — это +1 к твоему легендарному уровню!",
        "Маленькие ежедневные действия создают большие результаты.",
        "Ты уже на шаг ближе к эпической концовке!"
    ];
    alert(quotes[Math.floor(Math.random() * quotes.length)]);
});
// 6. История за 7 дней
function renderHistory() {
    const tbody = document.querySelector('#history-table tbody');
    tbody.innerHTML = '';

    const dates = Object.keys(history).sort().slice(-7);
    dates.forEach(date => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${date}</td><td>${history[date]}</td>`;
        tbody.appendChild(row);
    });
}

// Запуск при загрузке страницы
loadData();

