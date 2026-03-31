// logic.js

// Инициализация "Базы данных" при запуске
function getDB() {
    const db = localStorage.getItem('usersDB');
    return db ? JSON.parse(db) : [];
}

function saveDB(users) {
    localStorage.setItem('usersDB', JSON.stringify(users));
}

// Переключение форм
function toggleForms() {
    const loginForm = document.getElementById('login-form');
    const regForm = document.getElementById('register-form');

    if (loginForm.classList.contains('hidden')) {
        loginForm.classList.remove('hidden');
        regForm.classList.add('hidden');
    } else {
        loginForm.classList.add('hidden');
        regForm.classList.remove('hidden');
    }
    // Очистка ошибок при переключении
    document.querySelectorAll('.error-msg').forEach(el => el.innerText = '');
}

// --- ЛОГИКА РЕГИСТРАЦИИ ---
const regForm = document.getElementById('regForm');
if (regForm) {
    regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const errorEl = document.getElementById('reg-error');

        const username = sanitizeInput(document.getElementById('reg-username').value);
        const email = sanitizeInput(document.getElementById('reg-email').value);
        const password = document.getElementById('reg-password').value;
        const confirm = document.getElementById('reg-confirm-password').value;

        // Проверки безопасности
        if (checkSQLInjection(username) || checkSQLInjection(email)) {
            errorEl.innerText = "Обнаружена попытка инъекции!";
            return;
        }

        if (isEmpty(username) || isEmpty(email) || isEmpty(password)) {
            errorEl.innerText = "Все поля обязательны";
            return;
        }

        const passCheck = validatePassword(password);
        if (!passCheck.valid) {
            errorEl.innerText = passCheck.message;
            return;
        }

        if (password !== confirm) {
            errorEl.innerText = "Пароли не совпадают";
            return;
        }

        // Проверка на существующего пользователя
        const db = getDB();
        if (db.find(u => u.email === email)) {
            errorEl.innerText = "Пользователь с таким email уже существует";
            return;
        }

        // Сохранение
        const newUser = {
            username: username,
            email: email,
            passwordHash: hashPassword(password) // ХЕШИРУЕМ!
        };

        db.push(newUser);
        saveDB(db);

        alert("Регистрация успешна! Теперь войдите.");
        toggleForms();
    });
}

// --- ЛОГИКА АВТОРИЗАЦИИ ---
const authForm = document.getElementById('authForm');
if (authForm) {
    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const errorEl = document.getElementById('login-error');

        const email = sanitizeInput(document.getElementById('login-email').value);
        const password = document.getElementById('login-password').value;

        // Проверка на инъекции
        if (checkSQLInjection(email)) {
            errorEl.innerText = "Подозрительный ввод";
            return;
        }

        // Проверка лимита попыток
        const attempts = JSON.parse(localStorage.getItem('loginAttempts') || '{"count": 0, "lockUntil": 0}');
        const now = Date.now();

        if (attempts.lockUntil > now) {
            const waitTime = Math.ceil((attempts.lockUntil - now) / 1000);
            errorEl.innerText = `Слишком много попыток. Подождите ${waitTime} сек.`;
            return;
        }

        const db = getDB();
        const user = db.find(u => u.email === email);

        if (!user) {
            handleError(attempts);
            errorEl.innerText = "Неверный логин или пароль";
            return;
        }

        // Сверка хешей
        const inputHash = hashPassword(password);
        if (inputHash !== user.passwordHash) {
            handleError(attempts);
            errorEl.innerText = "Неверный логин или пароль";
            return;
        }

        // Успех
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('loginAttempts', JSON.stringify({ count: 0, lockUntil: 0 })); // Сброс попыток
        window.location.href = 'profile.html';
    });
}

function handleError(attemptsObj) {
    const newCount = attemptsObj.count + 1;
    let newLockUntil = 0;

    if (newCount >= 3) {
        newLockUntil = Date.now() + 10000; // Блокировка на 10 секунд
        newCount = 0; // Сбрасываем счетчик после блокировки, но ставим таймер
        alert("Превышено количество попыток! Блокировка на 10 секунд.");
    }

    localStorage.setItem('loginAttempts', JSON.stringify({
        count: newCount,
        lockUntil: newLockUntil
    }));
}