// Declaración de Clases y variables globales

class Investment {
    constructor(currencyId, quantity) {
        this.currencyId = currencyId;
        this.quantity = quantity;
    }
}

class Movement {
    constructor(currencyId, quantity) {
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

console.log(Currencys);


let money = 100000;
const myInvestments = [];
const myMovements = [];
let selectedCurrency;



const initApplication = () => {
    alert("¡Bienvenido a InversorOnline!");
    showInitialMenu();
}

// Gestor de Menues

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
    5. Salir
    `;


    let selectedOption = prompt(initialMenu);
    selectOption("Initial", parseFloat(selectedOption));

}

// OPC 1 - Ver Inversiones

function showMyInvestment() {
    if (myInvestments.length == 0) {
        let message = `Aún no tienes inversiones realizadas
        Saldo: $` + money;
        alert(message);
        showInitialMenu();
    } else {
        let message = `
        Moneda | Cantidad | Valor en pesos`;
        for (let i = 0; i < myInvestments.length; i++) {
            const element = myInvestments[i];
            message += `
            `+  Currencys[element.currencyId].currencyName + ` | ` + element.quantity + ` | $` + (Currencys[element.currencyId].value * element.quantity).toFixed(2);
        }

        message +=  `
        Saldo: $` + money.toFixed(2);

        alert(message);
        showInitialMenu();
    }
}

// OPC 2 - Ver Moviemientos

function showMyMovements() {
    if (myMovements.length == 0) {
        alert("Aún no tienes movimientos realizados.");
        showInitialMenu();
    } else {
        let message= ``;
        for (let i = 0; i < myMovements.length; i++) {
            if(myMovements[i].quantity > 0){
                message += `
                * Compraste ` + myMovements[i].quantity + ` ` + Currencys[myMovements[i].currencyId].currencyName + `.`;
            }
            else{
                message += `
                * Vendiste ` + (myMovements[i].quantity * -1) + ` ` + Currencys[myMovements[i].currencyId].currencyName + `.`;
            }
        }

        alert(message);
        showInitialMenu();
    }
}

// OPC 3 - Invertir

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
    const buy = `Cuanto desea Comprar? Saldo: $` + money.toFixed(2) + `:
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

// OPC 4 - Ver Mercado

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

// OPC 5 - Salir de la aplicación

function exitApplication() {

    let selectedOption = "";
    const exitQuestion = `Seguro que deseas salir? SI|NO`;

    do {
        selectedOption = prompt(exitQuestion);
    } while (selectedOption.toUpperCase() != "SI" && selectedOption.toUpperCase() != "NO")

    if (selectedOption == "SI") {
        alert("Hasta la próxima!")
    }
    else {
        showInitialMenu();
    }
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
    if(money >= totalImport){
        money -= totalImport;
        if(checkHaveCurrency(selectedCurrency)){
            for (let i = 0; i < myInvestments.length; i++) {
                if(myInvestments[i].currencyId == selectedCurrency){
                    myInvestments[i].quantity += quantity;
                }
            }
        }
        else{
            let investment = new Investment(selectedCurrency,quantity,Currencys[selectedCurrency].value);
            myInvestments.push(investment);
        }
        let movement = new Movement(selectedCurrency,quantity);
        myMovements.push(movement);
        return true;
    } else{
        return false;
    }
}

function checkHaveCurrency(currencyId) {
    if (myInvestments.length == 0) return false;
    for (let i = 0; i < myInvestments.length; i++) {
        if (myInvestments[i].currencyId == currencyId) return true;
    }
    return false;
}

function quantityOfCurrency(currencyId){
    for (let i = 0; i < myInvestments.length; i++) if (myInvestments[i].currencyId == currencyId) return myInvestments[i].quantity;
}

function checkCanSellCurrency(quantity){
    for (let i = 0; i < myInvestments.length; i++) {
        if (myInvestments[i].currencyId == selectedCurrency){
            if(quantity <= myInvestments[i].quantity){
                myInvestments[i].quantity -= quantity;
                if(myInvestments[i].quantity == 0) myInvestments.splice(i,1);
                money += Currencys[selectedCurrency].value * quantity;
                
                let movement = new Movement(selectedCurrency,-quantity);
                myMovements.push(movement);

                return true;
            }else{
                return false;
            }
        } 
    }
}


