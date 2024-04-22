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


    window.location.href = '../pages/main.html'
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

        // Generate user 
        let users;
        let lastUserId;

        let usersJson = localStorage.getItem('users');
        if (usersJson === null) {
            users = null;
            lastUserId = 0;
        } else {
            users = JSON.parse(usersJson);
            lastUserId = users.length;
        }

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
            confirmButtonText: `<i class="fa fa-thumbs-up"><h3 class="font">ok</h3></i> `,
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

// OLD CODE -----------------------------------------------------------------

// function login() {
//     const loginMenu = `Ingresa a tu cuenta:
//     1. Ingresar
//     2. Registrarse
//     `;

//     let selectedOption = prompt(loginMenu);
//     switch (parseFloat(selectedOption)) {
//         case 1:
//             enterUser();
//             break;
//         case 2:
//             registerUserNickname();
//             break;
//         default:
//             alert("Ingrese una opción válida.");
//             login();
//             break;
//     }
// }

// function enterUser() {
//     const loginMenu = `Ingresa tu usuario o email:
//     `;

//     let nickOrEmail = prompt(loginMenu);
//     if (checkIfUserExist(nickOrEmail)) enterPassword();
//     else {
//         alert("Usuario inexistente. Intente nuevamente");
//         login();
//     }
// }

// function enterPassword() {
//     const loginMenu = `Ingresá tu contraseña:
//     `;

//     let password = prompt(loginMenu);
//     if (validatePassword(password)) {
//         alert(`¡Bienvenido  ${currentUser.userNick} !`);
//         showInitialMenu();
//     } else {
//         alert(`Usuario o Contraseña incorrectos.`);
//         login();
//     }
// }

// function registerUserNickname() {
//     const loginMenu = `Ingresá tu nombre de usuario:
//     `;

//     let nickname = prompt(loginMenu);
//     if (nickname.length >= 8 && nickname.length < 20) {
//         if (!checkIfUserExist(nickname)) {
//             tempUserNickname = nickname;
//             registerUserEmail();
//         } else {
//             alert(`Ya existe un usuario con ese nombre. Intente nuevamente.`);
//             registerUserNickname();
//         }
//     } else {
//         alert(`Nombre de usuario muy corto o muy largo. Intente nuevamente.`);
//         registerUserNickname();
//     }
// }

// function registerUserEmail() {
//     const loginMenu = `Ingresá tu email:
//     `;

//     let email = prompt(loginMenu);

//     if (email.length >= 8 && email.length < 20 && email.includes('@')) {
//         if (!checkIfUserExist(email)) {
//             tempUserEmail = email;
//             registerUserPassword();
//         } else {
//             alert(`Ya existe un usuario asociado con ese correo. Intente nuevamente.`);
//             registerUserEmail();
//         }
//     } else {
//         alert(`Correo inválido. Intente nuevamente.`);
//         registerUserEmail();
//     }
// }

// function registerUserPassword() {
//     const loginMenu = `Ingresá tu contraseña:
//     `;

//     let password = prompt(loginMenu);

//     if (password.length >= 8 && password.length < 20) {
//         tempUserPassword = password;

//         // Registrar usuario

//         let lastUserId = Users.length;

//         let user = new User(lastUserId, tempUserEmail, tempUserNickname, tempUserPassword, 100000);
//         Users.push(user);
//         currentUser = Users[lastUserId];
//         alert(`
//         ¡Bienvenido ${currentUser.userNick} !
//         ¡Has recibido $100000 de bienvenida!.
//         `);
//         showInitialMenu();

//     } else {
//         alert(`Contraseña débil. Intente nuevamente (entre 8 y 20 caracteres).`);
//         registerUserPassword();
//     }
// }

// function checkIfUserExist(user) {
//     for (let i = 0; i < Users.length; i++) {
//         if (user == Users[i].userNick || user == Users[i].userEmail) {
//             currentUser = Users[i];
//             return true;
//         }
//     }
//     return false;
// }

// function validatePassword(password) {
//     if (password == currentUser.userPassword) return true;
//     else return false;
// }


// // Gestor de Menues  ------------------------------------------------------------------

// const selectOption = (menu, selectedOption) => {
//     if (menu == "Initial") {
//         switch (selectedOption) {
//             case 1:
//                 showMyInvestment();
//                 break;
//             case 2:
//                 showMyMovements();
//                 break;
//             case 3:
//                 showInvestMenu();
//                 break;
//             case 4:
//                 showMarket();
//                 break;
//             case 5:
//                 exitApplication();
//                 break;
//             default:
//                 alert("Ingrese una opción válida.");
//                 showInitialMenu();
//                 break;
//         }
//     }

//     if (menu == "Invest") {
//         selectedCurrency = selectedOption;
//         let so = selectedOption;
//         if (so == 0 || so == 1 || so == 2 || so == 3 || so == 4) {
//             if (so == 4) showInitialMenu();
//             else showBuySellMenu();
//         }
//         else {
//             alert("Ingrese una opción válida.");
//             showInvestMenu();
//         }
//     }

//     if (menu == "BuySell") {
//         switch (selectedOption) {
//             case 1:
//                 buyCurrency();
//                 break;
//             case 2:
//                 sellCurrency();
//                 break;
//             case 3:
//                 showInvestMenu();
//                 break;
//             default:
//                 alert("Ingrese una opción válida.");
//                 showBuySellMenu();
//                 break;
//         }
//     }

// }


// initApplication();

// function showInitialMenu() {
//     const initialMenu = `En que podemos ayudarte?:
//     1. Ver mis inversiones
//     2. Ver mis movimientos
//     3. Invertir
//     4. Analizar Mercado
//     ----------------------
//     5. Cerrar sesión
//     `;


//     let selectedOption = prompt(initialMenu);
//     selectOption("Initial", parseFloat(selectedOption));

// }

// // OPC 1 - Ver Inversiones  ------------------------------------------------------------------

// function showMyInvestment() {
//     if (!userHasInvestments()) {
//         let message = `Aún no tienes inversiones realizadas
//         Saldo: $` + currentUser.money;
//         alert(message);
//         showInitialMenu();
//     } else {
//         let message = `
//         Moneda | Cantidad | Valor en pesos`;
//         for (let i = 0; i < investments.length; i++) {
//             const element = investments[i];
//             if (element.userId == currentUser.userId) {
//                 message += `
//                 `+ Currencys[element.currencyId].currencyName + ` | ` + element.quantity + ` | $` + (Currencys[element.currencyId].value * element.quantity).toFixed(2);
//             }
//         }

//         message += `
//         Saldo: $` + currentUser.money.toFixed(2);

//         alert(message);
//         showInitialMenu();
//     }
// }

// // OPC 2 - Ver Moviemientos  ------------------------------------------------------------------

// function showMyMovements() {
//     if (!userHasInvestments()) {
//         alert("Aún no tienes movimientos realizados.");
//         showInitialMenu();
//     } else {
//         let message = ``;
//         for (let i = 0; i < movements.length; i++) {
//             if (movements[i].userId == currentUser.userId) {
//                 if (movements[i].quantity > 0) {
//                     message += `
//                     * Compraste ` + movements[i].quantity + ` ` + Currencys[movements[i].currencyId].currencyName + `.`;
//                 }
//                 else {
//                     message += `
//                     * Vendiste ` + (movements[i].quantity * -1) + ` ` + Currencys[movements[i].currencyId].currencyName + `.`;
//                 }
//             }
//         }

//         alert(message);
//         showInitialMenu();
//     }
// }

// // OPC 3 - Invertir  ------------------------------------------------------------------

// function showInvestMenu() {
//     const investMenu = `Que moneda quiere operar?:
//     1. Bitcoin
//     2. ETH
//     3. USDT
//     4. NEAR
//     -----------
//     5. Volver
//     `;

//     let selectedOption = prompt(investMenu);
//     selectOption("Invest", parseFloat(selectedOption) - 1);
// }

// function showBuySellMenu() {
//     const bsMenu = `Comprar o Vender?:
//     1. Comprar
//     2. Vender
//     -----------
//     3. Volver
//     `;

//     let selectedOption = prompt(bsMenu);
//     selectOption("BuySell", parseFloat(selectedOption));
// }

// function buyCurrency() {
//     const buy = `Cuanto desea Comprar? Saldo: $` + currentUser.money.toFixed(2) + `:
//     Valor: 1 ` + Currencys[selectedCurrency].currencyName + ` = $` + Currencys[selectedCurrency].value;

//     let buyQuantity = prompt(buy);

//     if (checkCanBuyQuantity(parseFloat(buyQuantity))) {
//         alert("Operación realizada con éxito");
//         showInvestMenu();
//     }
//     else {
//         alert("Dinero en cuenta insuficiente.");
//         showBuySellMenu();
//     }

// }

// function sellCurrency() {

//     if (checkHaveCurrency(selectedCurrency)) {
//         const sell = `Cuanto desea Vender?: MAX (` + quantityOfCurrency(selectedCurrency) + ` unidades)
//         `;
//         let sellQuantity = prompt(sell);

//         if (checkCanSellCurrency(parseFloat(sellQuantity))) {
//             alert("Operación realizada con éxito");
//             showInvestMenu();
//         } else {
//             alert("No dispone de esa cantidad.");
//             showBuySellMenu();
//         }

//     } else {
//         alert("No tiene fondos invertidos para vender.");
//         showInvestMenu();
//     }
// }

// // OPC 4 - Ver Mercado  ------------------------------------------------------------------

// function showMarket() {
//     const marketStatus =
//         `Bitcoin                ETH

//     |   /'|                           |   /'|
//     |  /   |  /'''|                   |  /   |  /'| 
//     | /     |/     |                  | /     |/   |  /
//     |/              |                 |/            |/
//     |                |                 |               
//     |____________________   |____________________  

//          USDT                   NEAR

//     |                                 |   /'|
//     |                                 |  /   |  /'| 
//     |                                 | /     |/   |  /
//     |__________________      |/            |/
//     |                                 |               
//     |____________________   |____________________  
//     `;

//     alert(marketStatus);
//     showInitialMenu();
// }

// // OPC 5 - Salir de la aplicación  ------------------------------------------------------------------

// function exitApplication() {

//     let selectedOption = "";
//     const exitQuestion = `Seguro que deseas salir? SI|NO`;

//     do {
//         selectedOption = prompt(exitQuestion);
//     } while (selectedOption.toUpperCase() != "SI" && selectedOption.toUpperCase() != "NO")

//     if (selectedOption == "SI") {
//         alert("Hasta la próxima!");
//         login();
//     }
//     else showInitialMenu();

// }


// // UTILITIES ------------------------------------------------------

// function getCurrencyName() {
//     let nameCurrency;
//     switch (selectedCurrency) {
//         case "1":
//             nameCurrency = "Bitcoin";
//             break;
//         case "2":
//             nameCurrency = "ETH";
//             break;
//         case "3":
//             nameCurrency = "USDT";
//             break;
//         case "4":
//             nameCurrency = "NEAR";
//             break;
//     }
//     return nameCurrency;
// }

// function checkCanBuyQuantity(quantity) {
//     const totalImport = quantity * Currencys[selectedCurrency].value;
//     if (currentUser.money >= totalImport) {
//         currentUser.money -= totalImport;
//         if (checkHaveCurrency(selectedCurrency)) {
//             for (let i = 0; i < investments.length; i++) {
//                 if (investments[i].userId == currentUser.userId)
//                     if (investments[i].currencyId == selectedCurrency) {
//                         investments[i].quantity += quantity;
//                     }
//             }
//         }
//         else {
//             let investment = new Investment(currentUser.userId, selectedCurrency, quantity, Currencys[selectedCurrency].value);
//             investments.push(investment);
//         }
//         let movement = new Movement(currentUser.userId, selectedCurrency, quantity);
//         movements.push(movement);
//         return true;
//     } else {
//         return false;
//     }
// }

// function checkHaveCurrency(currencyId) {
//     if (investments.length == 0) return false;
//     for (let i = 0; i < investments.length; i++) {
//         if (investments[i].userId == currentUser.userId)
//             if (investments[i].currencyId == currencyId) return true;
//     }
//     return false;
// }

// function quantityOfCurrency(currencyId) {
//     for (let i = 0; i < investments.length; i++) if (investments[i].userId == currentUser.userId) if (investments[i].currencyId == currencyId) return investments[i].quantity;
// }

// function checkCanSellCurrency(quantity) {
//     for (let i = 0; i < investments.length; i++) {
//         if (investments[i].userId == currentUser.userId)
//             if (investments[i].currencyId == selectedCurrency) {
//                 if (quantity <= investments[i].quantity) {
//                     investments[i].quantity -= quantity;
//                     if (investments[i].quantity == 0) investments.splice(i, 1);
//                     currentUser.money += Currencys[selectedCurrency].value * quantity;

//                     let movement = new Movement(currentUser.userId, selectedCurrency, -quantity);
//                     movements.push(movement);

//                     return true;
//                 } else {
//                     return false;
//                 }
//             }
//     }
// }

// function userHasInvestments() {
//     if (investments.length == 0) return false;
//     for (let i = 0; i < investments.length; i++) {
//         if (investments[i].userId == currentUser.userId) return true;
//     }
// }

// function userHasMovements() {
//     if (movements.length == 0) return false;
//     for (let i = 0; i < movements.length; i++) {
//         if (movements[i].userId == currentUser.userId) return true;
//     }
// }


