let habits = [];
let history = {};

/**
 * 1. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ И ОШИБКИ
 */

// Показ красивого баннера с ошибкой
function showError(message) {
    console.error(`[QuestLog Error]: ${message}`);
    const banner = document.createElement('div');
    banner.style = `
        position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
        background: #ef4444; color: white; padding: 12px 25px;
        border-radius: 8px; z-index: 1000; box-shadow: 0 4px 15px rgba(0,0,0,0.4);
        font-weight: bold; font-family: sans-serif;
    `;
    banner.textContent = message;
    document.body.appendChild(banner);
    setTimeout(() => banner.remove(), 3000);
}

// Получение текущей даты в формате YYYY-MM-DD
function getTodayString() {
    return new Date().toISOString().split('T')[0];
}

// Расчет текущей серии (Streak)
function calculateStreak() {
    const dates = Object.keys(history).sort().reverse();
    if (dates.length === 0) return 0;

    let streak = 0;
    let checkDate = new Date();
    
    // Если за сегодня нет записей, проверяем, была ли запись вчера
    let dateStr = checkDate.toISOString().split('T')[0];
    if (!history[dateStr]) {
        checkDate.setDate(checkDate.getDate() - 1);
        dateStr = checkDate.toISOString().split('T')[0];
    }

    while (history[dateStr]) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
        dateStr = checkDate.toISOString().split('T')[0];
    }
    return streak;
}

/**
 * 2. РАБОТА С ДАННЫМИ (LOAD/SAVE)
 */

function loadData() {
    try {
        const savedHabits = localStorage.getItem('habits');
        const savedHistory = localStorage.getItem('history');
        if (savedHabits) habits = JSON.parse(savedHabits);
        if (savedHistory) history = JSON.parse(savedHistory);
    } catch (e) {
        showError("Ошибка чтения данных из браузера");
    }
    renderAll();
}

function saveData() {
    try {
        localStorage.setItem('habits', JSON.stringify(habits));
        localStorage.setItem('history', JSON.stringify(history));
    } catch (e) {
        showError("Не удалось сохранить прогресс");
    }
}

/**
 * 3. ЛОГИКА ПРИЛОЖЕНИЯ
 */

// Добавление квеста
document.getElementById('add-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const nameInput = document.getElementById('name');
    const descInput = document.getElementById('description');
    const typeInput = document.getElementById('type');

    const name = nameInput.value.trim();
    const description = descInput.value.trim();

    // Валидация
    if (name.length < 3) return showError("Название слишком короткое (мин. 3 симв.)");
    if (!description) return showError("Добавьте описание задания");

    const newHabit = {
        id: Date.now(),
        name,
        description,
        type: typeInput.value,
        completions: []
    };

    habits.push(newHabit);
    saveData();
    renderAll();
    this.reset();
});

// Выполнение квеста
window.completeHabit = function(id) {
    const habit = habits.find(h => h.id === id);
    const today = getTodayString();

    if (habit.completions.includes(today)) {
        return showError("Этот квест уже выполнен сегодня!");
    }

    habit.completions.push(today);
    history[today] = (history[today] || 0) + 1;

    saveData();
    renderAll();
};

// Удаление квеста
window.deleteHabit = function(id) {
    if (confirm("Удалить квест и весь его прогресс?")) {
        habits = habits.filter(h => h.id !== id);
        saveData();
        renderAll();
    }
};

/**
 * 4. ОТРИСОВКА ИНТЕРФЕЙСА (RENDER)
 */

function renderAll() {
    renderHabitsList();
    renderStats();
    renderHistory();
}
function renderHabitsList() {
    const container = document.getElementById('habits-list');
    container.innerHTML = '';
    
    if (habits.length === 0) {
        container.innerHTML = '<p style="opacity:0.5; text-align:center;">Список квестов пуст...</p>';
        return;
    }

    const today = getTodayString(); // Получаем текущую дату

    habits.forEach(h => {
        const isDone = h.completions.includes(today);
        
        const div = document.createElement('div');
        div.className = 'habit-item';
        
        // Добавляем класс 'completed' в innerHTML, если задача выполнена
        const textClass = isDone ? 'completed' : '';
        const btnText = isDone ? '✔' : '✔'; // Меняем иконку кнопки
        const btnStyle = isDone ? 'background: #10b981;' : ''; // Зеленая кнопка, если готово

        div.innerHTML = `
            <div class="${textClass}">
                <strong>${h.name}</strong><br>
                <small style="color: #94a3b8;">${h.description}</small>
            </div>
            <div style="display: flex; gap: 8px;">
                <button onclick="completeHabit(${h.id})" style="width: 40px; padding: 5px; ${btnStyle}">${btnText}</button>
                <button onclick="deleteHabit(${h.id})" style="background: #ef4444; width: 40px; padding: 5px;">✖</button>
            </div>
        `;
        container.appendChild(div);
    });
}
// function renderHabitsList() {
//     const container = document.getElementById('habits-list');
//     container.innerHTML = '';

//     if (habits.length === 0) {
//         container.innerHTML = '<p style="opacity:0.5; text-align:center;">Список квестов пуст...</p>';
//         return;
//     }

//     habits.forEach(h => {
//         const div = document.createElement('div');
//         div.className = 'habit-item';
//         div.innerHTML = `
//             <div>
//                 <strong>${h.name}</strong><br>
//                 <small style="color: #94a3b8;">${h.description}</small>
//             </div>
//             <div style="display: flex; gap: 8px;">
//                 <button onclick="completeHabit(${h.id})" style="width: 40px; padding: 5px;">✔</button>
//                 <button onclick="deleteHabit(${h.id})" style="background: #ef4444; width: 40px; padding: 5px;">✖</button>
//             </div>
//         `;
//         container.appendChild(div);
//     });
// }

function renderStats() {
    const container = document.getElementById('stats');
    let total = 0;
    habits.forEach(h => total += h.completions.length);

    const streak = calculateStreak();

    container.innerHTML = `
        <p>Активных квестов: <strong>${habits.length}</strong></p>
        <p>Всего выполнено: <strong>${total}</strong></p>
        <p>Ваша серия: <strong>🔥 ${streak} дн.</strong></p>
    `;
}

function renderHistory() {
    const tbody = document.querySelector('#history-table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const dates = Object.keys(history).sort().slice(-7);
    dates.reverse().forEach(date => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${date}</td><td style="text-align:center;">${history[date]}</td>`;
        tbody.appendChild(row);
    });
}

// Мотивация
document.getElementById('motivation-btn').addEventListener('click', () => {
    const quotes = [
        "Твой меч — это твоя дисциплина!",
        "Маленькие шаги ведут к большим победам.",
        "Герои не рождаются, они делают ежедневные квесты!",
        "Твой меч — это твоя дисциплина!",
        "Маленькие шаги ведут к большим победам.",
        "Герои не рождаются, они делают ежедневные квесты!",
        "Даже 🦖 Ти-Рекс начинал с малого!",
        "Не останавливайся, когда устал. Останавливайся, когда закончил."
    ];
    alert(quotes[Math.floor(Math.random() * quotes.length)]);
});

// Старт
loadData();
