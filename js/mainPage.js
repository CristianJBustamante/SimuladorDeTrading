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

let initialGreeting = document.getElementById('initial-greeting');
let closeSessionButton = document.getElementById('close-sesion-button');


let btnReceive = document.getElementById('receive-button');
let btnSent = document.getElementById('sent-button');
let btnChange = document.getElementById('change-button');

let divReceive = document.getElementById('receive-container');
let divSent = document.getElementById('sent-container');
let divChange = document.getElementById('change-container');

function initPage(){
    let currentUser = getUser(parseInt(localStorage.getItem('currentUserId')));
    if(currentUser == null) window.location.href = '../index.html';
    initialGreeting.textContent = `¡Bienvenido ${currentUser != null? currentUser.userNick.toUpperCase() : ""}!`;
}

initPage();

closeSessionButton.addEventListener('click', function () {
    closeSesion();
});

function closeSesion(){
    Swal.fire({
        background: '#333',
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
    if(!btnReceive.classList.contains("btn-primary")){
        setNoOptionSelected();
        btnReceive.classList.remove("btn-secondary");
        btnReceive.classList.add("btn-primary");
        divReceive.classList.remove("hide");
    }else setNoOptionSelected();
});

btnSent.addEventListener('click', function () {
    if(!btnSent.classList.contains("btn-primary")){
        setNoOptionSelected();
        btnSent.classList.remove("btn-secondary");
        btnSent.classList.add("btn-primary");
        divSent.classList.remove("hide");
    }else setNoOptionSelected();
});

btnChange.addEventListener('click', function () {
    if(!btnChange.classList.contains("btn-primary")){
        setNoOptionSelected();
        btnChange.classList.remove("btn-secondary");
        btnChange.classList.add("btn-primary");
        divChange.classList.remove("hide");
    }else setNoOptionSelected();
});

function setNoOptionSelected(){
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


// Utilities --------------------------------------------------------

function getUser(id){

    let usersJson = localStorage.getItem('users');

    if (usersJson === null) return null;
    else {
        let users = JSON.parse(usersJson);
        for (let i = 0; i < users.length; i++) if (id == users[i].userId) return users[i];
        return null;
    }
}





