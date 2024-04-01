// Declaración de Clases y variables globales

class User{
    constructor(userId, userEmail, userNick, userPassword, money) {
        this.userId = userId;
        this.userEmail = userEmail;
        this.userNick = userNick;
        this.userPassword = userPassword;
        this.money = money;
    }
}

let Users =[];

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

class Currency{
    constructor(currencyId, currencyName, value) {
        this.currencyId = currencyId;
        this.currencyName = currencyName;
        this.value = value;
    }
}

const Currencys = [];
const Currency1 = new Currency(0,"Bitcoin", 57930616.65);
const Currency2 = new Currency(1,"ETH", 3087399.47);
const Currency3 = new Currency(2,"USDT", 980.00);
const Currency4 = new Currency(3,"NEAR", 512.00);

Currencys.push(Currency1);
Currencys.push(Currency2);
Currencys.push(Currency3);
Currencys.push(Currency4);


const investments = [];
const movements = [];
let selectedCurrency;



const initApplication = () => {
    alert("¡Bienvenido a InversorOnline!");
    login();
}

// Login  ------------------------------------------------------------------

function login() {
    const loginMenu = `Ingresa a tu cuenta:
    1. Ingresar
    2. Registrarse
    `;

    let selectedOption = prompt(loginMenu);
    switch(parseFloat(selectedOption)){
        case 1:
            enterUser();
            break;
        case 2:
            registerUserNickname();
            break;
        default:
            alert("Ingrese una opción válida.");
            login();
            break;
    }
}

function enterUser() {
    const loginMenu = `Ingresa tu usuario o email:
    `;

    let nickOrEmail = prompt(loginMenu);
    if(checkIfUserExist(nickOrEmail)) enterPassword();
    else{
        alert("Usuario inexistente. Intente nuevamente");
        login();
    }
}

function enterPassword() {
    const loginMenu = `Ingresá tu contraseña:
    `;

    let password = prompt(loginMenu);
    if(validatePassword(password)){
        alert(`¡Bienvenido  ${currentUser.userNick} !`);
        showInitialMenu();
    }else{
        alert(`Usuario o Contraseña incorrectos.`);
        login();
    }
}

function registerUserNickname() {
    const loginMenu = `Ingresá tu nombre de usuario:
    `;

    let nickname = prompt(loginMenu);
    if(nickname.length >= 8 && nickname.length < 20){
        if(!checkIfUserExist(nickname)){
            tempUserNickname = nickname;
            registerUserEmail();
        }else{
            alert(`Ya existe un usuario con ese nombre. Intente nuevamente.`);
            registerUserNickname();
        }
    }else{
        alert(`Nombre de usuario muy corto o muy largo. Intente nuevamente.`);
        registerUserNickname();
    }
}

function registerUserEmail() {
    const loginMenu = `Ingresá tu email:
    `;

    let email = prompt(loginMenu);

    if(email.length >= 8 && email.length < 20 && email.includes('@')){
        if(!checkIfUserExist(email)){
            tempUserEmail = email;
            registerUserPassword();
        }else{
            alert(`Ya existe un usuario asociado con ese correo. Intente nuevamente.`);
            registerUserEmail();
        }
    }else{
        alert(`Correo inválido. Intente nuevamente.`);
        registerUserEmail();
    }
}

function registerUserPassword() {
    const loginMenu = `Ingresá tu contraseña:
    `;

    let password = prompt(loginMenu);

    if(password.length >= 8 && password.length < 20){
        tempUserPassword = password;

        // Registrar usuario

        let lastUserId = Users.length;

        let user = new User(lastUserId, tempUserEmail, tempUserNickname, tempUserPassword, 100000);
        Users.push(user);
        currentUser = Users[lastUserId];
        alert(`
        ¡Bienvenido ${currentUser.userNick} !
        ¡Has recibido $100000 de bienvenida!.
        `);
        showInitialMenu();

    }else{
        alert(`Contraseña débil. Intente nuevamente (entre 8 y 20 caracteres).`);
        registerUserPassword();
    }
}

function checkIfUserExist(user){
    for (let i = 0; i < Users.length; i++) {
        if(user == Users[i].userNick || user == Users[i].userEmail){
            currentUser = Users[i];
            return true;
        } 
    }
    return false;
}

function validatePassword(password){
    if(password == currentUser.userPassword) return true;
    else return false;
}


// Gestor de Menues  ------------------------------------------------------------------

const selectOption = (menu, selectedOption) => {
    if (menu == "Initial") {
        switch (selectedOption) {
            case 1:
                showMyInvestment();
                break;
            case 2:
                showMyMovements();
                break;
            case 3:
                showInvestMenu();
                break;
            case 4:
                showMarket();
                break;
            case 5:
                exitApplication();
                break;
            default:
                alert("Ingrese una opción válida.");
                showInitialMenu();
                break;
        }
    }

    if (menu == "Invest") {
        selectedCurrency = selectedOption;
        let so = selectedOption;
        if (so == 0 || so == 1 || so == 2 || so == 3 || so == 4) {
            if(so == 4) showInitialMenu(); 
            else showBuySellMenu();
        }
        else {
            alert("Ingrese una opción válida.");
            showInvestMenu();
        }
    }

    if (menu == "BuySell") {
        switch (selectedOption) {
            case 1:
                buyCurrency();
                break;
            case 2:
                sellCurrency();
                break;
            case 3:
                showInvestMenu();
                break;
            default:
                alert("Ingrese una opción válida.");
                showBuySellMenu();
                break;
        }
    }

}


initApplication();

function showInitialMenu() {
    const initialMenu = `En que podemos ayudarte?:
    1. Ver mis inversiones
    2. Ver mis movimientos
    3. Invertir
    4. Analizar Mercado
    ----------------------
    5. Cerrar sesión
    `;


    let selectedOption = prompt(initialMenu);
    selectOption("Initial", parseFloat(selectedOption));

}

// OPC 1 - Ver Inversiones  ------------------------------------------------------------------

function showMyInvestment() {
    if (!userHasInvestments()) {
        let message = `Aún no tienes inversiones realizadas
        Saldo: $` + currentUser.money;
        alert(message);
        showInitialMenu();
    } else {
        let message = `
        Moneda | Cantidad | Valor en pesos`;
        for (let i = 0; i < investments.length; i++) {
            const element = investments[i];
            if(element.userId == currentUser.userId){
                message += `
                `+  Currencys[element.currencyId].currencyName + ` | ` + element.quantity + ` | $` + (Currencys[element.currencyId].value * element.quantity).toFixed(2);
            }
        }

        message +=  `
        Saldo: $` + currentUser.money.toFixed(2);

        alert(message);
        showInitialMenu();
    }
}

// OPC 2 - Ver Moviemientos  ------------------------------------------------------------------

function showMyMovements() {
    if (!userHasInvestments()) {
        alert("Aún no tienes movimientos realizados.");
        showInitialMenu();
    } else {
        let message= ``;
        for (let i = 0; i < movements.length; i++) {
            if(movements[i].userId == currentUser.userId){
                if(movements[i].quantity > 0){
                    message += `
                    * Compraste ` + movements[i].quantity + ` ` + Currencys[movements[i].currencyId].currencyName + `.`;
                }
                else{
                    message += `
                    * Vendiste ` + (movements[i].quantity * -1) + ` ` + Currencys[movements[i].currencyId].currencyName + `.`;
                }
            }
        }

        alert(message);
        showInitialMenu();
    }
}

// OPC 3 - Invertir  ------------------------------------------------------------------

function showInvestMenu() {
    const investMenu = `Que moneda quiere operar?:
    1. Bitcoin
    2. ETH
    3. USDT
    4. NEAR
    -----------
    5. Volver
    `;

    let selectedOption = prompt(investMenu);
    selectOption("Invest", parseFloat(selectedOption) - 1);
}

function showBuySellMenu() {
    const bsMenu = `Comprar o Vender?:
    1. Comprar
    2. Vender
    -----------
    3. Volver
    `;

    let selectedOption = prompt(bsMenu);
    selectOption("BuySell", parseFloat(selectedOption));
}

function buyCurrency() {
    const buy = `Cuanto desea Comprar? Saldo: $` + currentUser.money.toFixed(2) + `:
    Valor: 1 ` + Currencys[selectedCurrency].currencyName +` = $` + Currencys[selectedCurrency].value;

    let buyQuantity = prompt(buy);

    if(checkCanBuyQuantity(parseFloat(buyQuantity))){
        alert("Operación realizada con éxito");
        showInvestMenu();
    }
    else{
        alert("Dinero en cuenta insuficiente.");
        showBuySellMenu();
    }

}

function sellCurrency() {

    if(checkHaveCurrency(selectedCurrency)){
        const sell = `Cuanto desea Vender?: MAX (` + quantityOfCurrency(selectedCurrency) + ` unidades)
        `;
        let sellQuantity = prompt(sell);

        if(checkCanSellCurrency(parseFloat(sellQuantity))){
            alert("Operación realizada con éxito");
            showInvestMenu();
        }else{
            alert("No dispone de esa cantidad.");
            showBuySellMenu();
        }   
        
    }else{
        alert("No tiene fondos invertidos para vender.");
        showInvestMenu();
    }
}

// OPC 4 - Ver Mercado  ------------------------------------------------------------------

function showMarket() {
    const marketStatus =
        `Bitcoin                ETH

    |   /'|                           |   /'|
    |  /   |  /'''|                   |  /   |  /'| 
    | /     |/     |                  | /     |/   |  /
    |/              |                 |/            |/
    |                |                 |               
    |____________________   |____________________  

         USDT                   NEAR

    |                                 |   /'|
    |                                 |  /   |  /'| 
    |                                 | /     |/   |  /
    |__________________      |/            |/
    |                                 |               
    |____________________   |____________________  
    `;

    alert(marketStatus);
    showInitialMenu();
}

// OPC 5 - Salir de la aplicación  ------------------------------------------------------------------

function exitApplication() {

    let selectedOption = "";
    const exitQuestion = `Seguro que deseas salir? SI|NO`;

    do {
        selectedOption = prompt(exitQuestion);
    } while (selectedOption.toUpperCase() != "SI" && selectedOption.toUpperCase() != "NO")

    if (selectedOption == "SI"){
        alert("Hasta la próxima!");
        login();
    } 
    else showInitialMenu();
    
}


// UTILITIES ------------------------------------------------------

function getCurrencyName(){
    let nameCurrency;
    switch (selectedCurrency) {
        case "1":
            nameCurrency = "Bitcoin";
            break;
        case "2":
            nameCurrency = "ETH";
            break;
        case "3":
            nameCurrency = "USDT";
            break;
        case "4":
            nameCurrency = "NEAR";
            break;
    }
    return nameCurrency;
}

function checkCanBuyQuantity(quantity){
    const totalImport = quantity * Currencys[selectedCurrency].value;
    if(currentUser.money >= totalImport){
        currentUser.money -= totalImport;
        if(checkHaveCurrency(selectedCurrency)){
            for (let i = 0; i < investments.length; i++) {
                if(investments[i].userId == currentUser.userId)
                if(investments[i].currencyId == selectedCurrency){
                    investments[i].quantity += quantity;
                }
            }
        }
        else{
            let investment = new Investment(currentUser.userId, selectedCurrency, quantity, Currencys[selectedCurrency].value);
            investments.push(investment);
        }
        let movement = new Movement(currentUser.userId, selectedCurrency, quantity);
        movements.push(movement);
        return true;
    } else{
        return false;
    }
}

function checkHaveCurrency(currencyId) {
    if (investments.length == 0) return false;
    for (let i = 0; i < investments.length; i++) {
        if(investments[i].userId == currentUser.userId)
        if(investments[i].currencyId == currencyId) return true;
    }
    return false;
}

function quantityOfCurrency(currencyId){
    for (let i = 0; i < investments.length; i++) if(investments[i].userId == currentUser.userId) if (investments[i].currencyId == currencyId) return investments[i].quantity;
}

function checkCanSellCurrency(quantity){
    for (let i = 0; i < investments.length; i++) {
        if(investments[i].userId == currentUser.userId)
        if (investments[i].currencyId == selectedCurrency){
            if(quantity <= investments[i].quantity){
                investments[i].quantity -= quantity;
                if(investments[i].quantity == 0) investments.splice(i,1);
                currentUser.money += Currencys[selectedCurrency].value * quantity;
                
                let movement = new Movement(currentUser.userId ,selectedCurrency , -quantity);
                movements.push(movement);

                return true;
            }else{
                return false;
            }
        } 
    }
}

function userHasInvestments(){
    if (investments.length == 0) return false;
    for (let i = 0; i < investments.length; i++) {
        if(investments[i].userId == currentUser.userId) return true;
    }
}

function userHasMovements(){
    if (movements.length == 0) return false;
    for (let i = 0; i < movements.length; i++) {
        if(movements[i].userId == currentUser.userId) return true;
    }
}


