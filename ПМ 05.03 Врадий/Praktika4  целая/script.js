function add(a, b) {
    return a + b;
}

function substract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b == 0) {
        throw new Error("Деление на 0 запрещено!");
    }
    return a / b;
}

function calculate() {
    const num1 = parseFloat(document.getElementById('num1').value);
    const num2 = parseFloat(document.getElementById('num2').value);
    const operation = document.getElementById('operation').value;

    if (isNaN(num1) || isNaN(num2)) {
        alert("Введите оба числа!")
        return;
    }

    let result;
    try {
        switch (operation) {
            case '+':
                result = add(num1, num2);
                break;
            case '-':
                result = substract(num1, num2);
                break;
            case '*':
                result = multiply(num1, num2);
                break;
            case '/':
                result = divide(num1, num2);
                break;

        }
        document.getElementById('result').textContent = result;
    } catch (error) {
        document.getElementById('result').textContent = "Ошибка: " + error.message;
    }

}