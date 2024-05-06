// Declaración de Clases y variables globales

class User {
    constructor(userId, userEmail, userNick, userPassword, money) {
        this.userId = userId;
        this.userEmail = userEmail;
        this.userNick = userNick;
        this.userPassword = userPassword;
        this.money = money;
    }
}

let Users = [];

let currentUser;

let tempUserId;
let tempUserEmail;
let tempUserNickname;
let tempUserPassword;

class Investment {
    constructor(userId, currencyId, quantity) {
        this.userId = userId;
        this.currencyId = currencyId;
        this.quantity = quantity;
    }
}

class Movement {
    constructor(userId, currencyId, quantity) {
        this.userId = userId;
        this.currencyId = currencyId;
        this.quantity = quantity;
    }
}

class Currency {
    constructor(currencyId, currencyName, value) {
        this.currencyId = currencyId;
        this.currencyName = currencyName;
        this.value = value;
    }
}

const Currencys = [];
const Currency1 = new Currency(0, "Bitcoin", 57930616.65);
const Currency2 = new Currency(1, "ETH", 3087399.47);
const Currency3 = new Currency(2, "USDT", 980.00);
const Currency4 = new Currency(3, "NEAR", 512.00);

Currencys.push(Currency1);
Currencys.push(Currency2);
Currencys.push(Currency3);
Currencys.push(Currency4);


const investments = [];
const movements = [];
let selectedCurrency;



const initApplication = () => {
    // alert("¡Bienvenido a InversorOnline!");
    // login();
}

// Login  ------------------------------------------------------------------

let loginButton = document.getElementById('login-button');
let loginContainer = document.getElementById('login-container');
let registerScreenButton = document.getElementById('register-screen-button');
let registerContainer = document.getElementById('register-container');

let inputUser = document.getElementById('inputUser');
let inputPassword = document.getElementById('inputPassword');

inputPassword.addEventListener('keydown', function(event) {
    if (event.keyCode === 32) event.preventDefault();
});

registerScreenButton.addEventListener('click', function () {
    loginContainer.classList.add('hide-container');
    registerContainer.classList.remove('hide-container');
});

loginButton.addEventListener('click', function () {

    let user = inputUser.value;
    let password = inputPassword.value;

    // Validate Exist

    let usersJson = localStorage.getItem('users');

    if (usersJson === null) {
        console.log("1");
        loginFail();
    }
    else {
        let users = JSON.parse(usersJson);

        for (let i = 0; i < users.length; i++) {
            if (user == users[i].userNick || user == users[i].userEmail) {
                if (password == users[i].userPassword) {
                    let miString = `${users[i].userId}`;

                    localStorage.setItem('currentUserId', miString);
                    return loginSuccess();
                }
            }
        }
        loginFail();
    }
});

function loginFail() {

    clearAlerts();

    // Clear fields
    inputUser.value = "";
    inputPassword.value = "";

    let alert = document.createElement('h5');
    alert.textContent = 'Usuario o contraseña incorrectos';
    alert.classList.add('alert');
    inputPassword.parentNode.insertBefore(alert, inputPassword.nextSibling);
}

function loginSuccess() {

    clearAlerts();

    // Clear fields
    inputUser.value = "";
    inputPassword.value = "";
    
    window.location.href = './pages/main.html'
}

// Create new Account

let createAccountButton = document.getElementById('create-account-button');
let loginScreenButton = document.getElementById('login-screen-button');

let inputUserRegister = document.getElementById('inputUserRegister');
let inputEmailRegister = document.getElementById('inputEmailRegister');
let inputPasswordRegister = document.getElementById('inputPasswordRegister');
let inputPasswordAgainRegister = document.getElementById('inputPasswordAgainRegister');

inputPasswordRegister.addEventListener('keydown', function(event) {
    if (event.keyCode === 32) event.preventDefault();
});

inputPasswordAgainRegister.addEventListener('keydown', function(event) {
    if (event.keyCode === 32) event.preventDefault();
});

loginScreenButton.addEventListener('click', function () {
    loginContainer.classList.remove('hide-container');
    registerContainer.classList.add('hide-container');
    clearAlerts();
    clearRegisterInputs();
});

createAccountButton.addEventListener('click', function () {

    clearAlerts();

    let resultCheckUser = checkUser();
    let resultCheckEmail = checkEmail();
    let resultCheckPassword = checkPassword();

    if (resultCheckUser && resultCheckEmail && resultCheckPassword) {

        let users = JSON.parse(localStorage.getItem('users')) || null;
        let lastUserId = users === null? 0: users.length;

        let user = inputUserRegister.value;
        let email = inputEmailRegister.value;
        let password = inputPasswordRegister.value;

        let newUser = new User(lastUserId, email, user, password, 100000);

        // Save new user

        if (users === null) {
            let userArray = [];
            userArray.push(newUser);
            usersJson = JSON.stringify(userArray);
            localStorage.setItem("users", usersJson);
        } else {
            users.push(newUser);
            usersJson = JSON.stringify(users);
            localStorage.setItem("users", usersJson);
        }

        Swal.fire({
            background: '#333',
            color: '#fff',
            title: "Usuario creado con éxito!",
            icon: "success",
            confirmButtonText: `<h3 class="font">ok</h3>`,
            customClass: {
                title: 'font',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                loginContainer.classList.remove('hide-container');
                registerContainer.classList.add('hide-container');

                // Clear input fields
                clearRegisterInputs();
            }
        });

    }
});

function checkUser() {

    let user = inputUserRegister.value;

    // Validate Format
    if (!(user.length >= 8 && user.length < 30)) {
        showAlert(inputUserRegister, `Nombre de usuario no válido`);
        return false;
    }

    // Validate Exist
    let usersJson = localStorage.getItem('users');

    if (usersJson === null) return true;
    else {
        let users = JSON.parse(usersJson);
        for (let i = 0; i < users.length; i++) {
            if (user == users[i].userNick) {
                showAlert(inputUserRegister, `${user} ya se encuentra en uso.`);
                return false;
            }
        }
        return true;
    }
}

function checkEmail() {

    let email = inputEmailRegister.value;

    // Validate Format
    if (!(email.length >= 8 && email.length < 30 && email.includes('@'))) {
        showAlert(inputEmailRegister, `Ingrese un correo válido`);
        return false;
    }

    // Validate Exist
    let usersJson = localStorage.getItem('users');

    if (usersJson === null) return true;
    else {
        let users = JSON.parse(usersJson);
        for (let i = 0; i < users.length; i++) {
            if (email == users[i].userEmail) {
                showAlert(inputEmailRegister, `${email} ya tiene un usuario asociado.`);
                return false;
            }
        }
        return true;
    }
}

function checkPassword() {

    let password = inputPasswordRegister.value;
    let passwordAgain = inputPasswordAgainRegister.value;

    // Validate Format
    let regexLength = /^.{8,20}$/; // 8 to 20 characters
    let regexLowercase = /[a-z]/; // at least one lowercase letter
    let regexUppercase = /[A-Z]/; // at least one uppercase letter
    let regexNumber = /[0-9]/; // at least one digit
    let regexSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/; // at least one special character

    if (!regexLength.test(password) ||
        !regexLowercase.test(password) ||
        !regexUppercase.test(password) ||
        !regexNumber.test(password) ||
        !regexSpecial.test(password)) {

        console.log(`${password} no cumple con los requisitos:
        * 8 a 20 caracteres
        * Al menos 1 letra minúscula
        * Al menis 1 letra mayúscula
        * Al menos 1 número
        * Al menos un caracter especial`);

        showAlert(inputPasswordRegister, `Contraseña debe tener mayúscula, minúscula, numero y caracter especial`);
        return false;
    }

    if (!(password == passwordAgain)) {
        showAlert(inputPasswordAgainRegister, `Las contraseñas deben ser iguales.`);
        return false;
    }
    else return true;
}

function showAlert(input, message) {
    let divChildren = input.parentNode.children;
    let lastIndex = divChildren.length - 1;

    if (divChildren[lastIndex] === input) {
        let alert = document.createElement('h5');
        alert.textContent = message;
        alert.classList.add('alert');
        input.parentNode.insertBefore(alert, input.nextSibling);
    } else {
        let alert = input.nextElementSibling;
        alert.textContent = message;
    }

    input.classList.add('input-alert');
}

function clearAlerts() {

    let alerts = document.querySelectorAll('.alert');
    alerts.forEach(element => { element.parentNode.removeChild(element);});

    let inputAlerts = document.querySelectorAll('.input-alert');
    inputAlerts.forEach(element => { element.classList.remove('input-alert'); });
}

function clearRegisterInputs() {
    inputUserRegister.value = "";
    inputEmailRegister.value = "";
    inputPasswordRegister.value = "";
    inputPasswordAgainRegister.value = "";
}

