function test(name, fn) {
    try {
        fn();
        console.log(`${name}`);
        return { name, passed: true };
    } catch (error) {
        console.log(`${name}`);
        console.log(`   Ошибка: ${error.message}`);
        return { name, passed: false, error: error.message };
    }
}

function assertEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(`${message} (ожидалось: ${expected}, получено: ${actual})`);
    }
}

function assertThrows(fn, expectedMessage, message) {
    let thrown = false;
    try {
        fn();
    } catch (error) {
        thrown = true;
        if (expectedMessage && !error.message.includes(expectedMessage)) {
            throw new Error(`${message} (неверное сообщение ошибки: ${error.message})`);
        }
    }
    if (!thrown) {
        throw new Error(`${message} (ошибка не была выброшена)`);
    }
}

function RunAllTests() {
    const results = [];
    let passed = 0;
    let failed = 0;

    // === Тесты для сложения ===
    results.push(test("2 + 2 = 4", function() {
        assertEqual(add(2, 2), 4, "2 + 2");
    }));

    results.push(test("-5 + 3 = -2", function() {
        assertEqual(add(-5, 3), -2, "-5 + 3");
    }));

    results.push(test("0 + 0 = 0", function() {
        assertEqual(add(0, 0), 0, "0 + 0");
    }));

    // === Тесты для вычитания ===
    results.push(test("10 - 3 = 7", function() {
        assertEqual(substract(10, 3), 7, "10 - 3");
    }));

    results.push(test("5 - 10 = -5", function() {
        assertEqual(substract(5, 10), -5, "5 - 10");
    }));

    // === Тесты для умножения ===
    results.push(test("5 * 6 = 30", function() {
        assertEqual(multiply(5, 6), 30, "5 * 6");
    }));

    results.push(test("-3 * 4 = -12", function() {
        assertEqual(multiply(-3, 4), -12, "-3 * 4");
    }));

    results.push(test("0 * 100 = 0", function() {
        assertEqual(multiply(0, 100), 0, "0 * 100");
    }));

    // === Тесты для деления ===
    results.push(test("10 / 2 = 5", function() {
        assertEqual(divide(10, 2), 5, "10 / 2");
    }));

    results.push(test("7 / 2 = 3.5", function() {
        assertEqual(divide(7, 2), 3.5, "7 / 2");
    }));

    results.push(test("-10 / 2 = -5", function() {
        assertEqual(divide(-10, 2), -5, "-10 / 2");
    }));

    results.push(test("Деление на 0 вызывает ошибку", function() {
        assertThrows(() => divide(10, 0), "Деление на 0 запрещено", "Деление на 0");
    }));

    // === Подсчёт результатов ===
    results.forEach(r => r.passed ? passed++ : failed++);

    // === Вывод результатов в DOM ===
    const output = document.getElementById('tests-output');
    if (output) {
        let details = results.map(r =>
                `<p style="color: ${r.passed ? 'green' : 'red'}">
                ${r.passed ? '+ //' : '- //'} ${r.name}
                ${r.error ? `<br><small>${r.error}</small>` : ''}
            </p>`
        ).join('');

        output.innerHTML = `
            <h3>Результаты тестирования:</h3>
            <p style="color: green">Успешно: ${passed}</p>
            <p style="color: red">Ошибок: ${failed}</p>
            <p><strong>Итого: ${passed + failed} тестов</strong></p>
            <hr>
            <h4>Детали:</h4>
            ${details}
        `;
        output.style.display = 'block';
    }

    // === Вывод в консоль ===
    console.log("\n" + "=".repeat(50));
    console.log("ИТОГИ ТЕСТИРОВАНИЯ");
    console.log("=".repeat(50));
    console.log(`Успешно: ${passed}`);
    console.log(`Ошибок: ${failed}`);
    console.log(`Всего: ${passed + failed} тестов`);
    console.log(`Процент успеха: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
    console.log("=".repeat(50));
}