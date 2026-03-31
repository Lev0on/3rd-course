const form = document.getElementById("myForm");
const yearSelect = form.querySelector("#year");
const requiredFieldsMessage = form.querySelector('#requiredFieldsMessage');
const successMessage = form.querySelector('#successMessage')
let validatePassword = false;
let passwordEqual = false;
const currentYear = new Date().getFullYear();
for (let year = currentYear; year > currentYear - 40; year--) {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearSelect.append(option);
}

// Перемещение по полям формы с помощью Enter
const dataInputs = form.querySelectorAll("input, select");
dataInputs.forEach((dataInput, index) => {
    dataInput.addEventListener("keydown", (event) => {
        if (event.key == "Enter") {
            event.preventDefault();
            const nextIndex = (index + 1) % dataInputs.length;
            dataInputs[nextIndex].focus();
        }
    });
});

// Валидация пароля
const passwordInput = form.querySelector("#password");
const passwordErrorMessage = form.querySelector("#passwordError");
passwordInput.addEventListener("input", checkPasswordValidity);

function checkPasswordValidity() {
    checkPasswordMatch()
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(passwordInput.value)) {
        passwordErrorMessage.style.display = "block";
        validatePassword = false;
    } else {
        passwordErrorMessage.style.display = "none";
        validatePassword = true;
    }
}

// Проверка совпадения паролей
const repeatPasswordInput = form.querySelector("#repeatPassword");
const confirmErrorMessage = form.querySelector("#confirm-password");
repeatPasswordInput.addEventListener("input", checkPasswordMatch);

function checkPasswordMatch() {
    if (passwordInput.value !== repeatPasswordInput.value) {
        confirmErrorMessage.style.display = "block";
        repeatPasswordInput.style.color = "red";
        passwordEqual = false;
    } else {
        confirmErrorMessage.style.display = "none";
        repeatPasswordInput.style.color = "green";
        passwordEqual = true;
    }
}

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const allFieldsFilled = Array.from(dataInputs).every((dataInput) => dataInput.value.trim());
    if (!allFieldsFilled || !passwordEqual || !validatePassword) {
        requiredFieldsMessage.style.display = "block";
        return;
    } else {
        requiredFieldsMessage.style.display = "none";

        const formData = new FormData(form);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });

        //Очистка формы
        form.reset();
        passwordErrorMessage.style.display = "none";
        confirmErrorMessage.style.display = "none";
        repeatPasswordInput.style.color = "";
        setTimeout(() => {
            successMessage.style.display = "none";
        }, 2000);
        console.log(JSON.stringify(formObject, null, 2));

        successMessage.style.display = "block";
    }

});