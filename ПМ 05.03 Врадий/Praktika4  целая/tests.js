function test(name, fn) {
    try {
        fn();
        console.log(`${name}`);
        return { name, passed: true };
    } catch (error) {
        console.log(`${name}`);
        console.log(`  Ошибка: ${error.message}`);
        return { name, passed: false, error: error.message };
    }
}

function RunAllTests() {
    const results = [];
    let passed = 0;
    let failed = 0;

    results.push(test("2 + 2 = 4", function() {
        if (add(2, 2) !== 4) {
            throw new Error("2+2 должно быть 4, получено: " + add(2, 2));
        }
    }));

    results.push(test("10 - 3 = 7", function() {
        if (substract(10, 3) !== 7) {
            throw new Error("10-3 должно быть 7, получено: " + substract(2, 2));
        }
    }));

    results.push(test("5 * 6 = 30", function() {
        if (multiply(5, 6) !== 30) {
            throw new Error("5 * 6 должно быть 30, получено: " + multiply(5, 6));
        }
    }));

    results.push(test("10 / 2 = 5", function() {
        if (divide(10, 2) !== 5) {
            throw new Error("10 / 2 должно быть 5, получено: " + divide(2, 2));
        }
    }));

    results.push(test("Деление на 0 вызывает ошибку", function() {
        try {
            divide(10, 0);
            throw new Error("Должна быть ошиюка при делении на 0");
        } catch (error) {}
    }));

    results.push(test("-5 + 3 = -2", function() {
        if (add(-5, 3) !== -2) {
            throw new Error("-5 + 3 должно быть -2, получено: " + add(-5, 3));
        }
    }));

    results.forEach(r => r.passed ? passed++ : failed++)

    const output = document.getElementById('tests-output');
    output.innerHTML = `
                        <h3>Результаты тестирования: </h3>
                        <p>Успешно: ${passed}</p>
                        <p>Ошибок: ${failed}</p>
                        <p><strong> Итого: ${passed + failed} тестов </strong></p>
                        `;
    output.style.display = 'block';

    console.log("\n Итого ");
    console.log(`Успешно: ${passed} `);
    console.log(`Ошибок: ${failed} `);
    console.log(`Всего: ${passed + failed} `);
}