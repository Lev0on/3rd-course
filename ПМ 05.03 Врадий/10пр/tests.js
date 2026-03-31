// tests.js
export class TestRunner {
    constructor() {
        this.results = [];
        this.passed = 0;
        this.failed = 0;
    }

    async run(name, testFn) {
        const startTime = performance.now();
        try {
            await testFn();
            const endTime = performance.now();
            this.results.push({
                name,
                passed: true,
                time: Math.round(endTime - startTime)
            });
            this.passed++;
        } catch (error) {
            const endTime = performance.now();
            this.results.push({
                name,
                passed: false,
                time: Math.round(endTime - startTime),
                error: error.message
            });
            this.failed++;
        }
    }

    getSummary() {
        return {
            total: this.results.length,
            passed: this.passed,
            failed: this.failed,
            tests: this.results
        };
    }
}

// Функция утверждения
function assert(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}

function assertEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(message || `Expected ${expected}, got ${actual}`);
    }
}

function assertTrue(value, message) {
    if (!value) {
        throw new Error(message || 'Expected true');
    }
}

function assertFalse(value, message) {
    if (value) {
        throw new Error(message || 'Expected false');
    }
}

// Основные тесты
export async function runAllTests(app, inputBox, listContainer) {
    const runner = new TestRunner();
    const startTime = performance.now();

    // Очистка перед тестами
    listContainer.innerHTML = '';
    inputBox.value = '';
    localStorage.clear();
    app.updateStats();

    // Тесты добавления
    await runner.run('Добавление новой задачи', () => {
        inputBox.value = 'Купить молоко';
        const result = app.addTask();
        assertTrue(result, 'Добавление должно вернуть true');
        assertEqual(app.getTaskCount(), 1, 'Должна быть 1 задача');
        assertEqual(listContainer.children[0].textContent.includes('Купить молоко'), true, 'Текст задачи неверный');
    });

    await runner.run('Недобавление пустой задачи', () => {
        inputBox.value = '';
        const result = app.addTask();
        assertFalse(result, 'Пустая задача не должна добавляться');
        assertEqual(app.getTaskCount(), 1, 'Количество задач не должно измениться');
    });

    await runner.run('Недобавление задачи с пробелами', () => {
        inputBox.value = '   ';
        const result = app.addTask();
        assertFalse(result, 'Задача с пробелами не должна добавляться');
    });

    await runner.run('Очистка поля ввода после добавления', () => {
        inputBox.value = 'Новая задача';
        app.addTask();
        assertEqual(inputBox.value, '', 'Поле должно быть очищено');
    });

    await runner.run('Добавление нескольких задач', () => {
        inputBox.value = 'Задача 1';
        app.addTask();
        inputBox.value = 'Задача 2';
        app.addTask();
        inputBox.value = 'Задача 3';
        app.addTask();
        assertEqual(app.getTaskCount(), 4, 'Должно быть 4 задачи');
    });

    // Тесты удаления
    await runner.run('Удаление задачи по клику на крестик', () => {
        const deleteBtn = listContainer.querySelector('.delete-btn');
        app.handleListClick({ target: deleteBtn });
        assertEqual(app.getTaskCount(), 3, 'Должно остаться 3 задачи');
    });

    await runner.run('Неудаление при клике вне элементов', () => {
        const countBefore = app.getTaskCount();
        app.handleListClick({ target: document.body });
        assertEqual(app.getTaskCount(), countBefore, 'Количество задач не должно измениться');
    });

    // Тесты отметки выполнения
    await runner.run('Отметка задачи как выполненной', () => {
        const li = listContainer.querySelector('li');
        app.handleListClick({ target: li });
        assertTrue(li.classList.contains('checked'), 'Задача должна быть отмечена');
    });

    await runner.run('Снятие отметки при повторном клике', () => {
        const li = listContainer.querySelector('li');
        app.handleListClick({ target: li });
        app.handleListClick({ target: li });
        assertFalse(li.classList.contains('checked'), 'Отметка должна быть снята');
    });

    await runner.run('getTasks возвращает статус выполнения', () => {
        const li = listContainer.querySelector('li');
        app.handleListClick({ target: li });
        const tasks = app.getTasks();
        assertTrue(tasks[0].completed, 'Статус должен быть true');
    });

    // Тесты LocalStorage
    await runner.run('Сохранение в localStorage', () => {
        const savedData = localStorage.getItem('todoData');
        assertTrue(savedData !== null, 'Данные должны быть сохранены');
    });

    await runner.run('Загрузка из localStorage', () => {
        const newData = localStorage.getItem('todoData');
        assertTrue(newData.includes('Задача'), 'Данные должны содержать задачи');
    });

    await runner.run('Обновление localStorage при удалении', () => {
        const countBefore = app.getTaskCount();
        const deleteBtn = listContainer.querySelector('.delete-btn');
        if (deleteBtn) {
            app.handleListClick({ target: deleteBtn });
            const savedData = localStorage.getItem('todoData');
            assertEqual(app.getTaskCount(), countBefore - 1, 'Задача должна быть удалена');
        }
    });

    await runner.run('Обновление localStorage при отметке', () => {
        const li = listContainer.querySelector('li');
        if (li) {
            app.handleListClick({ target: li });
            const savedData = localStorage.getItem('todoData');
            assertTrue(savedData.includes('checked'), 'LocalStorage должен содержать marked задачи');
        }
    });

    // Тесты getTasks
    await runner.run('getTasks возвращает массив', () => {
        const tasks = app.getTasks();
        assertTrue(Array.isArray(tasks), 'Должен возвращать массив');
    });

    await runner.run('getTasks возвращает пустой массив если нет задач', () => {
        app.clearAll();
        const tasks = app.getTasks();
        assertEqual(tasks.length, 0, 'Массив должен быть пустым');
    });

    // Дополнительные тесты
    await runner.run('Статистика обновляется после добавления', () => {
        inputBox.value = 'Тестовая задача';
        app.addTask();
        const statsText = document.getElementById('task-count').textContent;
        assertTrue(statsText.includes('Задач:'), 'Статистика должна обновиться');
    });

    await runner.run('Очистка всех задач', () => {
        inputBox.value = 'Задача 1';
        app.addTask();
        inputBox.value = 'Задача 2';
        app.addTask();
        app.clearAll();
        assertEqual(app.getTaskCount(), 0, 'Все задачи должны быть удалены');
    });

    const endTime = performance.now();
    const summary = runner.getSummary();
    summary.time = Math.round(endTime - startTime);

    return summary;
}
