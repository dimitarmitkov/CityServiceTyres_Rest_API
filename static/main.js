let calendarSetup = document.getElementById("date");
let selectBtn = document.getElementById("select-btn");
let dateInput = document.getElementById("date");
let timeInput = document.getElementById("time");
let emailInput = document.getElementById("email-select");
let currentDate = new Date();
let currentMonth = (new Date()).getMonth();
let currentYear = currentDate.getFullYear();
let alertElement = document.getElementById("alert");
let result = true;
let firstDay;
let lastDay;

dateInput.value = currentDate.toISOString().substring(0, 10) < `${currentYear}-03-01` ?
    `${currentYear}-03-01` : `${currentDate.toISOString().substring(0, 10)}`;

if (currentMonth <= 5) {
    firstDay = `${currentYear}-03-01`;
    lastDay = `${currentYear}-04-30`;
    calendarSetup.setAttribute("min", `${currentYear}-03-01`);
    calendarSetup.setAttribute("max", `${currentYear}-04-30`);
    dateInput.value = currentDate.toISOString().substring(0, 10) < `${currentYear}-03-01` ?
        `${currentYear}-03-01` : `${currentDate.toISOString().substring(0, 10)}`;
} else {
    firstDay = `${currentYear}-09-01`;
    lastDay = `${currentYear}-10-31`;
    calendarSetup.setAttribute("min", `${currentYear}-09-01`);
    calendarSetup.setAttribute("max", `${currentYear}-10-31`);
    dateInput.value = currentDate.toISOString().substring(0, 10) < `${currentYear}-09-01` ?
        `${currentYear}-09-01` : `${currentDate.toISOString().substring(0, 10)}`;
}


let hoursSetup = document.getElementById("time");


function hoursChange() {
    let hours = [];
    hoursSetup.innerHTML = "";
    fetch("api/v1/users")
        .then(res => res.json())
        .then(customers => {
            for (let i = 0; i < customers.length; i++) {
                if (customers[i].date === dateInput.value) {
                    hours[i] = (+customers[i].time.split(":")[0]);
                }
            }
            for (let i = 9; i < 18; i++) {
                if (hours.indexOf(i) < 0) {
                    hoursSetup.innerHTML += `<option>${i}:00</option>`;
                }
            }
        })
        .catch(err => err);
}


dateInput.addEventListener("change", hoursChange);

selectBtn.addEventListener("click", function () {
    const email = emailInput.value;
    const date = dateInput.value;
    const time = timeInput.value;

    let emails = [];
    fetch("api/v1/users")
        .then(res => res.json())
        .then(customers => {
            for (let i = 0; i < customers.length; i++) {
                emails.push(customers[i].email);
            }
            if (emails.indexOf(email) > 0) {
                alertShow(email);
                result = false;
            }
        })
        .catch(err => err);


    if (!email || !date || !time) {
        fillInAllFields();
        return;
    }

    let today = currentDate.toISOString().substring(0, 10);

    if (date < today || date < firstDay || date > lastDay) {
        dateCheckMessage(firstDay, lastDay);
        return;
    }

    fetch("api/v1/users", {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify({date, time, email}),
    })
        .then(res => res.json())
        .then(customer => {
            confirmInsert(email, date, time);
        })
        .catch(err => {
            console.log("Some error detected.");
        });

    function confirmInsert(email, date, time) {
        alertElement.innerHTML = `<div class="alert alert-warning alert-dismissible" role="alert">
        <strong>Успено запачен час за ${email}.</strong> Избрахте дата: ${date}, час: ${time}.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>`
    }

    function alertShow(email) {
        alertElement.innerHTML = `<div class="alert alert-danger">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            <strong>${email} има вече запазен час</strong>! Заявката Ви не е изпълнена.
        </div>`
    }

    function fillInAllFields() {
        alertElement.innerHTML = `<div class="alert alert-danger">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            <strong>Моля попълнете всички полета</strong>! Заявката Ви не е изпълнена.
        </div>`
    }

    function dateCheckMessage(firstDay, lastDay) {
        alertElement.innerHTML = `<div class="alert alert-danger">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            <strong>Моля въведете коректна дата</strong>! Моля да изберете днешна дата или следваща дата в периода: 
            ${firstDay} - ${lastDay}.
        </div>`
    }

    emailInput.value = "";
    timeInput.value = "";
    dateInput.value = currentMonth <= 5? `${currentYear}-03-01`:`${currentYear}-09-01`;
});


