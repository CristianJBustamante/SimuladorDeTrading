let DateTime = luxon.DateTime;
let Duration = luxon.Duration;
let Interval = luxon.Interval;

class Investment {
    constructor(userId, currencyName, quantity) {
        this.userId = userId;
        this.currencyName = currencyName;
        this.quantity = quantity;
    }
}

class Movement {
    constructor(movementId, userId, currencyName, quantity, date) {
        this.movementId = movementId;
        this.userId = userId;
        this.currencyName = currencyName;
        this.quantity = quantity;
        this.date = date;
    }
}


let initialGreeting = document.getElementById('initial-greeting');
let closeSessionButton = document.getElementById('close-sesion-button');


let btnReceive = document.getElementById('receive-button');
let btnSent = document.getElementById('sent-button');
let btnChange = document.getElementById('change-button');

let divReceive = document.getElementById('receive-container');
let divSent = document.getElementById('sent-container');
let divChange = document.getElementById('change-container');

let currentUser = getUser(parseInt(localStorage.getItem('currentUserId')));

let moneyBalance = document.getElementById('money-balance');



function initPage() {
    if (currentUser == null) window.location.href = '../index.html';
    initialGreeting.textContent = `¡Bienvenido ${currentUser != null ? currentUser.userNick.toUpperCase() : ""}!`;

    updateChangeInfo('ADA');
    updateInformation();
}

closeSessionButton.addEventListener('click', function () {
    closeSesion();
});

function closeSesion() {
    Swal.fire({
        background: '#444',
        color: '#fff',
        title: "Seguro desea cerrar sesión?",
        icon: "question",
        confirmButtonText: `<h3 class="font">Si</h3>`,
        showCancelButton: true,
        cancelButtonText: `<h3 class="font">No</h3>`,
        customClass: {
            title: 'font',
        }
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.setItem('currentUserId', null);
            window.location.href = '../index.html';
        }
    });
}


// Balance Options

btnReceive.addEventListener('click', function () {
    if (!btnReceive.classList.contains("btn-primary")) {
        setNoOptionSelected();
        btnReceive.classList.remove("btn-secondary");
        btnReceive.classList.add("btn-primary");
        divReceive.classList.remove("hide");
    } else setNoOptionSelected();
});

btnSent.addEventListener('click', function () {
    if (!btnSent.classList.contains("btn-primary")) {
        setNoOptionSelected();
        btnSent.classList.remove("btn-secondary");
        btnSent.classList.add("btn-primary");
        divSent.classList.remove("hide");
    } else setNoOptionSelected();
});

btnChange.addEventListener('click', function () {
    if (!btnChange.classList.contains("btn-primary")) {
        setNoOptionSelected();
        btnChange.classList.remove("btn-secondary");
        btnChange.classList.add("btn-primary");
        divChange.classList.remove("hide");
    } else setNoOptionSelected();
});

function setNoOptionSelected() {
    btnReceive.classList.remove("btn-primary");
    btnSent.classList.remove("btn-primary");
    btnChange.classList.remove("btn-primary");

    btnReceive.classList.add("btn-secondary");
    btnSent.classList.add("btn-secondary");
    btnChange.classList.add("btn-secondary");

    divReceive.classList.add("hide");
    divSent.classList.add("hide");
    divChange.classList.add("hide");
}


// Change Currencys

let selectedCurrency = 'ADA';
let moneyQuantity = 0;
let currencyQuantity = 0;
let exchangeRate = 0;
let buyFee = 0.01;
let sellFee = 0.005;
let buyOperation = true;

let inputChangeArs = document.getElementById('input-change-from');
let inputChangeCripto = document.getElementById('input-change-to');
let continueChangeButton = document.getElementById('continue-change-button');
let changeArsBalance = document.getElementById('change-from-balance');
let changeCriptoBalance = document.getElementById('change-to-balance');
let changeCriptoSelector = document.getElementById('change-to-selector');
let changeArsPrice = document.getElementById('change-from-price');
let changeCriptoPrice = document.getElementById('change-to-price');
let changeOperationOrder = document.getElementById("change-operation-order");
let divARS = document.getElementById("ars-change-part");
let divCripto = document.getElementById("cripto-change-part");
let continueContainer = document.getElementById("continue-container");
let changeTitle1 = document.getElementById("change-title1");
let changeTitle2 = document.getElementById("change-title2");



inputChangeArs.addEventListener('keydown', function (event) {
    if (event.keyCode === 109 || event.keyCode === 107) event.preventDefault();
});
inputChangeCripto.addEventListener('keydown', function (event) {
    if (event.keyCode === 109 || event.keyCode === 107) event.preventDefault();
});

inputChangeArs.addEventListener('input', function (event) {
    let convertValue = 0;
    getApiInfo(selectedCurrency).then(datos => {

        if (buyOperation) {
            convertValue = Math.ceil(parseFloat((1e6 * event.target.value * (1 - buyFee)) / (datos.ask)).toFixed(6)) / 1e6;
            inputChangeCripto.value = convertValue;
            moneyQuantity = parseFloat(event.target.value).toFixed(2);
            currencyQuantity = convertValue;

            // Check can continue
            if (event.target.value >= 500 && event.target.value <= currentUser.money) continueChangeButton.disabled = false;
            else continueChangeButton.disabled = true;
        } else {
            convertValue = Math.ceil(parseFloat((1e6 * event.target.value * (1 - sellFee)) / (datos.bid)).toFixed(6)) / 1e6;
            inputChangeCripto.value = convertValue;
            moneyQuantity = parseFloat(event.target.value).toFixed(2);
            currencyQuantity = convertValue;

            // Check can continue
            let criptoBalance = getCriptoBalance(selectedCurrency);
            if (currencyQuantity != 0 && criptoBalance != undefined && currencyQuantity <= criptoBalance.quantity) continueChangeButton.disabled = false;
            else continueChangeButton.disabled = true;
        }

    });
});


inputChangeCripto.addEventListener('input', function (event) {
    let convertValue = 0;
    getApiInfo(selectedCurrency).then(datos => {

        if (buyOperation) {
            convertValue = Math.ceil(parseFloat(1e2 * event.target.value * (datos.ask) * (1 + buyFee)).toFixed(2)) / 1e2;
            inputChangeArs.value = convertValue;
            currencyQuantity = event.target.value;
            moneyQuantity = convertValue.toFixed(2);

            // Check can continue
            if (convertValue >= 500 && convertValue <= currentUser.money) continueChangeButton.disabled = false;
            else continueChangeButton.disabled = true;

        } else {
            convertValue = Math.ceil(parseFloat(1e2 * event.target.value * (datos.bid) * (1 + sellFee)).toFixed(2)) / 1e2;
            inputChangeArs.value = convertValue;
            currencyQuantity = event.target.value;
            moneyQuantity = convertValue.toFixed(2);

            // Check can continue
            let criptoBalance = getCriptoBalance(selectedCurrency);
            if (currencyQuantity != '' && criptoBalance != undefined && currencyQuantity <= criptoBalance.quantity) continueChangeButton.disabled = false;
            else continueChangeButton.disabled = true;
        }
    });
});

changeOperationOrder.addEventListener('click', function (event) {
    buyOperation = !buyOperation;

    divChange.removeChild(changeTitle1);
    divChange.removeChild(changeTitle2);
    divChange.removeChild(divARS);
    divChange.removeChild(divCripto);
    divChange.removeChild(changeOperationOrder);
    divChange.removeChild(continueContainer);

    if (!buyOperation) {
        divChange.appendChild(changeTitle1);
        divChange.appendChild(divCripto);
        divChange.appendChild(changeOperationOrder);
        divChange.appendChild(changeTitle2);
        divChange.appendChild(divARS);
        divChange.appendChild(continueContainer);
    }
    else {
        divChange.appendChild(changeTitle1);
        divChange.appendChild(divARS);
        divChange.appendChild(changeOperationOrder);
        divChange.appendChild(changeTitle2);
        divChange.appendChild(divCripto);
        divChange.appendChild(continueContainer);
    }

    cleanChangeInputs();
})


changeCriptoSelector.addEventListener('change', function (event) {
    updateChangeInfo(event.target.value);
});

continueChangeButton.addEventListener('click', function (event) {

    if (buyOperation) {
        Swal.fire({
            background: '#444',
            color: '#fff',
            title: `<h2 class="font">Confirma tu intercambio</h2><hr>
            <h3 class="font">Recibiras ${currencyQuantity} ${selectedCurrency}</h3><h6 class="font">(aproximado)</h6>
            <h4 class="font">A cambio de ${moneyQuantity} ARS</h4>
            <h5 class="font">Tasa de intercambio: 1 ${selectedCurrency} = ${exchangeRate} ARS</h5><h5 class="font">Comisión: ${buyFee * 100}% (${moneyQuantity * buyFee} ARS)</h5>`,
            showCancelButton: true,
            confirmButtonText: `<h3 class="font">Confirmar</h3>`,
            cancelButtonText: `<h3 class="font">Cancelar</h3>`,
            customClass: {
                title: 'font',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                // Calculate transaction again
                getApiInfo(selectedCurrency).then(datos => {
                    convertValue = Math.ceil(parseFloat((1e6 * moneyQuantity * (1 - buyFee)) / (datos.bid)).toFixed(6)) / 1e6;
                    currencyQuantity = convertValue;

                    // Discont money
                    setMoney(currentUser.userId, -moneyQuantity);
                    // Add coins
                    setCoins(currencyQuantity, -moneyQuantity);

                    Swal.fire({
                        background: '#444',
                        color: '#fff',
                        title: "Operación realizada con éxito!",
                        icon: "success",
                        confirmButtonText: `<h3 class="font">ok</h3>`,
                        customClass: {
                            title: 'font',
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            updateInformation();
                            cleanChangeInputs();
                        }
                    });

                });
            }
        });
    }
    else {
        Swal.fire({
            background: '#444',
            color: '#fff',
            title: `<h2 class="font">Confirma tu intercambio</h2><hr>
            <h3 class="font">Recibiras ${moneyQuantity} ARS</h3><h6 class="font">(aproximado)</h6>
            <h4 class="font">A cambio de ${currencyQuantity} ${selectedCurrency}</h4>
            <h5 class="font">Tasa de intercambio: 1 ${selectedCurrency} = ${exchangeRate} ARS</h5><h5 class="font">Comisión: ${sellFee * 100}% (${moneyQuantity * sellFee} ARS)</h5>`,
            showCancelButton: true,
            confirmButtonText: `<h3 class="font">Confirmar</h3>`,
            cancelButtonText: `<h3 class="font">Cancelar</h3>`,
            customClass: {
                title: 'font',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                // Calculate transaction again
                getApiInfo(selectedCurrency).then(datos => {

                    convertValue = Math.ceil(parseFloat((currencyQuantity * datos.bid * (1 - sellFee))).toFixed(2));
                    moneyQuantity = convertValue;

                    // Add money
                    setMoney(currentUser.userId, moneyQuantity);
                    // Discount coins
                    setCoins(-currencyQuantity, moneyQuantity);

                    Swal.fire({
                        background: '#444',
                        color: '#fff',
                        title: "Operación realizada con éxito!",
                        icon: "success",
                        confirmButtonText: `<h3 class="font">ok</h3>`,
                        customClass: {
                            title: 'font',
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            updateInformation();
                            cleanChangeInputs();
                        }
                    });

                });
            }
        });
    }
});

// Send Money

let cbu = document.getElementById('cbu-to-send');
let moneyToSend = document.getElementById('money-to-send');
let btnContinueSend = document.getElementById('continue-send-money');

cbu.addEventListener('keydown', function (event) {
    if (event.keyCode === 109 || event.keyCode === 107) event.preventDefault();
});
moneyToSend.addEventListener('keydown', function (event) {
    if (event.keyCode === 109 || event.keyCode === 107) event.preventDefault();
});

cbu.addEventListener('input', function (event) {
    console.log(event.target.value.toLocaleString().length);
    if (event.target.value.toLocaleString().length == 22 && moneyToSend.value != '' && moneyToSend.value <= currentUser.money) btnContinueSend.disabled = false;
    else btnContinueSend.disabled = true;
});

moneyToSend.addEventListener('input', function (event) {
    if (cbu.value.toLocaleString().length == 22 && moneyToSend.value != '' && moneyToSend.value <= currentUser.money) btnContinueSend.disabled = false;
    else btnContinueSend.disabled = true;
});

btnContinueSend.addEventListener('click', function (event) {
    Swal.fire({
        background: '#444',
        color: '#fff',
        title: `<h2 class="font">Confirma la transferencia</h2><hr>
        <h4 class="font">Desea transferir a cbu: ${cbu.value}</h4><h4 class="font">$${moneyToSend.value} ARS?</h4>`,
        showCancelButton: true,
        confirmButtonText: `<h3 class="font">Confirmar</h3>`,
        cancelButtonText: `<h3 class="font">Cancelar</h3>`,
        customClass: {
            title: 'font',
        }
    }).then((result) => {
        if (result.isConfirmed) {
            sendMoney();
            Swal.fire({
                background: '#444',
                color: '#fff',
                title: "Transferencia realizada con éxito!",
                icon: "success",
                confirmButtonText: `<h3 class="font">ok</h3>`,
                customClass: {
                    title: 'font',
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    updateInformation();
                    cleanChangeInputs();
                }
            });

        }
    });
})

function sendMoney(){
    setMoney(currentUser.userId, -moneyToSend.value);
    cbu.value = '';
    moneyToSend.value = '';
    btnContinueSend.disabled = true;
}



// Wallet

let walletTable = document.getElementById('wallet-table');

function updateWalletInfo() {
    walletTable.innerHTML = '';
    let investments = JSON.parse(localStorage.getItem('investments')) || [];
    let myInvestemnts = investments.filter(investment => investment.userId === currentUser.userId);
    if (myInvestemnts.length == 0) {
        let cellText = document.createElement('h5');
        cellText.textContent = 'No tiene monedas en tu billetera';
        walletTable.appendChild(cellText);
    } else {
        let row = document.createElement('tr');
        let cellImage = document.createElement('td');
        let cellName = document.createElement('td');
        let cellQuantity = document.createElement('td');
        let cellPrice = document.createElement('td');
        let cellProfit = document.createElement('td');

        row.classList.add("bk-grey");
        cellImage.classList.add("bk-grey");
        cellName.classList.add("bk-grey");
        cellQuantity.classList.add("bk-grey");
        cellPrice.classList.add("bk-grey");
        cellProfit.classList.add("bk-grey");

        cellName.textContent = 'Crypto';
        cellQuantity.textContent = 'Cantidad';
        cellPrice.textContent = 'Valor';
        cellProfit.textContent = 'Rendimiento';

        row.appendChild(cellImage);
        row.appendChild(cellName);
        row.appendChild(cellQuantity);
        row.appendChild(cellPrice);
        row.appendChild(cellProfit);

        walletTable.appendChild(row);
    }
    myInvestemnts.forEach(element => {

        getApiInfo(element.currencyName).then(datos => {
            let row = document.createElement('tr');
            let cellImage = document.createElement('td');
            let imageIcon = document.createElement('img');
            let cellName = document.createElement('td');
            let cellQuantity = document.createElement('td');
            let cellPrice = document.createElement('td');
            let cellProfit = document.createElement('td');

            row.classList.add("bk-grey");
            cellImage.classList.add("bk-grey");
            cellName.classList.add("bk-grey");
            cellQuantity.classList.add("bk-grey");
            cellPrice.classList.add("bk-grey");
            cellProfit.classList.add("bk-grey");
            imageIcon.src = `../img/cripto-icons/${element.currencyName}.png`;
            imageIcon.alt = 'currency icon';


            cellImage.appendChild(imageIcon);
            cellName.textContent = element.currencyName;
            cellQuantity.textContent = element.quantity;
            cellPrice.textContent = `${(datos.bid * element.quantity).toFixed(2)} ARS`;
            let spendOnCripto = parseFloat(getMoneySpendOnCripto(element.currencyName));
            let profitMount = (parseFloat((datos.bid * element.quantity)) + spendOnCripto).toFixed(2);
            let profitPercentage = ((profitMount / -spendOnCripto) * 100).toFixed(2);
            cellProfit.textContent = `${profitPercentage}% | ${profitMount} ARS`;


            row.appendChild(cellImage);
            row.appendChild(cellName);
            row.appendChild(cellQuantity);
            row.appendChild(cellPrice);
            row.appendChild(cellProfit);

            walletTable.appendChild(row);
        });
    });
}

// Movenets

let movementTable = document.getElementById('movements-table');

function updateMovementInfo() {
    movementTable.innerHTML = '';
    let movements = JSON.parse(localStorage.getItem('movements')) || [];
    let myMovements = movements.filter(investment => investment.userId === currentUser.userId).reverse();
    if (myMovements.length == 0) {
        let cellText = document.createElement('h5');
        cellText.textContent = 'Aún no tienes movimientos en tu cuenta';
        movementTable.appendChild(cellText);
    } else {
        myMovements.forEach(element => {

            let row = document.createElement('tr');
            let cellImage = document.createElement('td');
            let imageIcon = document.createElement('img');
            let cellOperation = document.createElement('td');
            let textOperation = document.createElement('h3');
            let dateOperation = document.createElement('h6');
            let cellQuantity = document.createElement('td');

            row.classList.add("bk-grey");
            cellImage.classList.add("bk-grey");
            cellOperation.classList.add("bk-grey");
            cellQuantity.classList.add("bk-grey");
            imageIcon.src = `../img/cripto-icons/${element.currencyName}.png`;
            imageIcon.alt = 'currency icon';
            if (element.currencyName != 'ARS') textOperation.textContent = element.quantity > 0 ? 'Compra Cripto' : 'Venta Cripto';
            else textOperation.textContent = element.quantity < 0 ? 'Compra Cripto' : 'Venta Cripto';
            dateOperation.textContent = element.date;


            cellImage.appendChild(imageIcon);
            cellOperation.appendChild(textOperation);
            cellOperation.appendChild(dateOperation);
            cellQuantity.textContent = `${element.quantity} ${element.currencyName}`;


            row.appendChild(cellImage);
            row.appendChild(cellOperation);
            row.appendChild(cellQuantity);

            movementTable.appendChild(row);
        });
    }

}


// Utilities --------------------------------------------------------

initPage();

function getUser(id) {

    let usersJson = localStorage.getItem('users');

    if (usersJson === null) return null;
    else {
        let users = JSON.parse(usersJson);
        for (let i = 0; i < users.length; i++) if (id == users[i].userId) return users[i];
        return null;
    }
}

function updateInformation() {
    moneyBalance.textContent = `$ ${currentUser.money} ARS`;
    changeArsBalance.textContent = `Saldo: $ ${currentUser.money} ARS`;
    updateChangeInfo(selectedCurrency);
    // Wallet
    updateWalletInfo();
    // Movements
    updateMovementInfo();
}

function cleanChangeInputs() {
    inputChangeArs.value = '';
    inputChangeCripto.value = '';
    continueChangeButton.disabled = true;
}

function setMoney(userId, money) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let user = users.find(user => user.userId === userId);
    if (user) {
        let temp = parseFloat(user.money);
        temp += money;
        user.money = temp;
        localStorage.setItem('users', JSON.stringify(users));
        currentUser = getUser(parseInt(localStorage.getItem('currentUserId')));
    } else console.log('User no found.');
}

function setCoins(quantity, money) {
    let investments = JSON.parse(localStorage.getItem('investments')) || [];
    let previousInvestment = investments.find(investment => investment.userId == currentUser.userId && investment.currencyName == selectedCurrency);
    if (previousInvestment) {
        previousInvestment.quantity += quantity;
        localStorage.setItem('investments', JSON.stringify(investments));
    } else {
        let newInvestment = new Investment(currentUser.userId, selectedCurrency, quantity);
        investments.push(newInvestment);
        localStorage.setItem("investments", JSON.stringify(investments));
    }

    // Movement

    let now = DateTime.now();
    let movements = JSON.parse(localStorage.getItem('movements')) || [];
    let newMovement = new Movement(movements.length, currentUser.userId, selectedCurrency, quantity, now.toLocaleString(DateTime.DATE_FULL));
    movements.push(newMovement);
    newMovement = new Movement(movements.length, currentUser.userId, 'ARS', money, now.toLocaleString(DateTime.DATE_FULL));
    movements.push(newMovement);
    localStorage.setItem("movements", JSON.stringify(movements));

}

function updateChangeInfo(currency) {
    getApiInfo(currency).then(datos => {
        selectedCurrency = currency;
        changeArsPrice.textContent = `1 ARS = ${Math.ceil(parseFloat(1e6 / (datos.ask)).toFixed(6)) / 1e6} ${currency}`;
        exchangeRate = datos.ask;
        changeCriptoPrice.textContent = `1 ${currency} = $ ${exchangeRate} ARS`;
        inputChangeCripto.value = Math.ceil(parseFloat(1e6 * inputChangeArs.value * (1 - buyFee) / (datos.ask)).toFixed(6)) / 1e6;

        // Currency balance
        let previousInvestment = getCriptoBalance(selectedCurrency);
        changeCriptoBalance.textContent = previousInvestment == undefined ? `Saldo: 0` : `Saldo: ${previousInvestment.quantity}`;
    });
}

function getCriptoBalance(currency) {
    let investments = JSON.parse(localStorage.getItem('investments')) || [];
    let previousInvestment = investments.find(investment => investment.userId == currentUser.userId && investment.currencyName == currency);
    return previousInvestment;
}

function getApiInfo(currency) {

    let endpoint = `https://criptoya.com/api/binancep2p/${currency}/ars/0.1`;

    return fetch(endpoint)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Error al obtener los datos de la API');
            }
        })
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error('Error:', error);
        });

}

function getMoneySpendOnCripto(cripto) {
    let movements = JSON.parse(localStorage.getItem('movements')) || [];
    let previousMovements = movements.filter(movement => movement.userId == currentUser.userId && movement.currencyName == cripto);
    let moneySpend = 0;

    previousMovements.forEach(element => {
        moneySpend += movements[element.movementId + 1].quantity;
    });

    return moneySpend;
}





