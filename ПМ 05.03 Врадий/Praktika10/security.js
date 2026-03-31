// security.js

// 1. Хеширование пароля (используем SHA-256 из подключенной библиотеки)
function hashPassword(password) {
    return CryptoJS.SHA256(password).toString();
}

// 2. Защита от XSS (очистка от опасных символов)
function sanitizeInput(str) {
    if (!str) return "";
    // Заменяем опасные символы на пустоту или экранируем их
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
    };
    const reg = /[&<>"'/]/ig;
    return str.replace(reg, (match) => (map[match]));
}

// 3. Проверка на SQL-инъекции (базовая эвристика)
function checkSQLInjection(str) {
    const sqlPatterns = /(\b(SELECT|INSERT|DELETE|UPDATE|DROP|UNION|ALTER|CREATE)\b)|(--)|(\/\*)/i;
    return sqlPatterns.test(str);
}

// 4. Валидация пароля
function validatePassword(password) {
    const minLength = 5;
    const hasNumber = /\d/;

    if (password.length < minLength) {
        return { valid: false, message: "Пароль должен быть не менее 5 символов" };
    }
    if (!hasNumber.test(password)) {
        return { valid: false, message: "Пароль должен содержать хотя бы одну цифру" };
    }
    return { valid: true };
}

// 5. Проверка на пустоту
function isEmpty(str) {
    return !str || str.trim().length === 0;
}