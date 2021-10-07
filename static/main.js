let calendarSetup = document.getElementById("date");
let selectBtn = document.getElementById("select-btn");
let dateInput = document.getElementById("date");
let timeInput = document.getElementById("time");
let licenseInput = document.getElementById("license");
let emailInput = document.getElementById("email-select");
let currentDate = new Date();
let currentMonth = (new Date()).getMonth();
let currentYear = currentDate.getFullYear();
let alertElement = document.getElementById("alert");
let result = true;
let firstDay;
let lastDay;

function currentPage() {
    let path = window.location.pathname;
    return path.split("/").pop();
}

console.log(currentPage());

if (`${currentPage()}` === "index.html") {

    fetch("api/v1/login")
        .then(res => res.json())
        .then(auth => {

console.log(auth);
            if (auth) {
                if (auth.type === "admin") {
                    document.getElementById("getAllSelector").style.display = "inline";
                }

                dateInput.addEventListener("change", hoursChange);
                dateInput.addEventListener("click", hoursChange);
                document.getElementById("select-btn").addEventListener("click", hoursChangeRecord);
                document.getElementById("email-select-group").style.display = "none";


                function hoursChange() {
                    let hoursSetup = document.getElementById("time");
                    let currentDate = dateInput.value;

                    fetch("api/v1/calendarGet", {
                        method: "POST",
                        headers: {"Content-type": "application/json"},
                        body: JSON.stringify({currentDate}),
                    })
                        .then(res => res.json())
                        .then(data => {
                                let hoursSetup = document.getElementById("time");
                                hoursSetup.innerHTML = "";
                                for (let i = 9; i < 18; i++) {
                                    if (data.indexOf(i.toString()) < 0) {
                                        hoursSetup.innerHTML += `<option>${i}:00</option>`;
                                    }
                                }
                            }
                        )
                        .catch(err => console.log(err));

                    let carId = auth.car;
                    fetch("api/v1/car", {
                        method: "POST",
                        headers: {"Content-type": "application/json"},
                        body: JSON.stringify({carId}),
                    })
                        .then(res => res.json())
                        .then(data => {
                            licenseInput.value = data;
                            }
                        )
                        .catch(err => console.log(err));
                }

                function hoursChangeRecord() {
                    let currentDate = dateInput.value;
                    let time = timeInput.value;
                    let license = licenseInput.value;
                    let email = emailInput.value;

                    if(auth) {
                        let userId = auth.id;
                        let carId = auth.car;


                        fetch("api/v1/calendarAdd", {
                            method: "POST",
                            headers: {"Content-type": "application/json"},
                            body: JSON.stringify({currentDate, userId, time, carId}),
                        })
                            .then(res => {
                                if (res) {

                                }
                            })
                            .then(data => {
                                dateInput.value = "";
                                timeInput.value = "";
                                licenseInput.value = ""
                                window.location.reload();
                            })
                            .catch(err => {

                            });
                    }
                }
            }


        })
        .catch(err => console.log(err));


    // function hoursChange() {
    //     let hoursSetup = document.getElementById("time");
    //
    //     let hours = [];
    //     hoursSetup.innerHTML = "";
    //     fetch("api/v1/users")
    //         .then(res => res.json())
    //         .then(customers => {
    //             for (let i = 0; i < customers.length; i++) {
    //                 if (customers[i].date === dateInput.value) {
    //                     hours[i] = (+customers[i].time.split(":")[0]);
    //                 }
    //             }
    //
    //             for (let i = 9; i < 18; i++) {
    //                 if (hours.indexOf(i) < 0) {
    //                     hoursSetup.innerHTML += `<option>${i}:00</option>`;
    //                 }
    //             }
    //         })
    //         .catch(err => err);
    // }
    //
    // if (dateInput) {
    //     dateInput.value = currentDate.toISOString().substring(0, 10) < `${currentYear}-03-01` ?
    //         `${currentYear}-03-01` : `${currentDate.toISOString().substring(0, 10)}`;
    //
    //     if (currentMonth <= 5) {
    //         firstDay = `${currentYear}-03-01`;
    //         lastDay = `${currentYear}-05-31`;
    //         calendarSetup.setAttribute("min", `${currentYear}-03-01`);
    //         calendarSetup.setAttribute("max", `${currentYear}-05-31`);
    //         dateInput.value = currentDate.toISOString().substring(0, 10);
    //     } else {
    //         firstDay = `${currentYear}-09-01`;
    //         lastDay = `${currentYear}-10-31`;
    //         calendarSetup.setAttribute("min", `${currentYear}-09-01`);
    //         calendarSetup.setAttribute("max", `${currentYear}-10-31`);
    //         dateInput.value = currentDate.toISOString().substring(0, 10);
    //     }
    //
    //     dateInput.addEventListener("change", hoursChange);
    //     dateInput.addEventListener("click", hoursChange);
    //
    //     selectBtn.addEventListener("click", function () {
    //         const email = emailInput.value;
    //         const date = dateInput.value;
    //         const time = timeInput.value;
    //         const license = licenseInput.value;
    //
    //         let emails = [];
    //         let licenses = [];
    //         fetch("api/v1/users")
    //             .then(res => res.json())
    //             .then(customers => {
    //                 for (let i = 0; i < customers.length; i++) {
    //                     emails.push(customers[i].email);
    //                     licenses.push(customers[i].license);
    //                 }
    //                 if (emails.indexOf(email) > 0 || licenses.indexOf(license) > 0) {
    //                     alertShow(email);
    //                     result = false;
    //                 }
    //             })
    //             .catch(err => err);
    //
    //         if (!license.match(/[A-Z]{2}[0-9]{4}[A-Z]{2}/gm)) {
    //             licenseCheckMessage(license);
    //             return;
    //         }
    //
    //         if (!email || !date || !time || !license) {
    //             fillInAllFields();
    //             return;
    //         }
    //
    //         let today = currentDate.toISOString().substring(0, 10);
    //
    //         if (date < today || date < firstDay || date > lastDay) {
    //             dateCheckMessage(firstDay, lastDay);
    //             return;
    //         }
    //
    //         fetch("api/v1/users", {
    //             method: "POST",
    //             headers: {"Content-type": "application/json"},
    //             body: JSON.stringify({date, time, email, license}),
    //         })
    //             .then(res => res.json())
    //             .then(customer => {
    //                 confirmInsert(email, date, time, license);
    //             })
    //             .catch(err => {
    //
    //             });
    //
    //         function confirmInsert(email, date, time) {
    //             alertElement.innerHTML = `<div class="alert alert-warning alert-dismissible" role="alert">
    //     <strong>Успено запачен час за ${email}.</strong> Избрахте дата: ${date}, час: ${time}.
    //     <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    //         <span aria-hidden="true">&times;</span>
    //     </button>
    // </div>`;
    //         }
    //
    //         function alertShow(email) {
    //             alertElement.innerHTML = `<div class="alert alert-danger">
    //         <button type="button" class="close" data-dismiss="alert">&times;</button>
    //         <strong>${email} или ${license} има вече запазен час</strong>! Заявката Ви не е изпълнена.
    //     </div>`;
    //         }
    //
    //         function fillInAllFields() {
    //             alertElement.innerHTML = `<div class="alert alert-danger">
    //         <button type="button" class="close" data-dismiss="alert">&times;</button>
    //         <strong>Моля попълнете всички полета</strong>! Заявката Ви не е изпълнена.
    //     </div>`;
    //         }
    //
    //         function dateCheckMessage(firstDay, lastDay) {
    //             alertElement.innerHTML = `<div class="alert alert-danger">
    //         <button type="button" class="close" data-dismiss="alert">&times;</button>
    //         <strong>Моля въведете коректна дата</strong>! Моля да изберете днешна дата или следваща дата в периода:
    //         ${firstDay} - ${lastDay}.
    //     </div>`;
    //         }
    //
    //         function licenseCheckMessage(license) {
    //             alertElement.innerHTML = `<div class="alert alert-danger">
    //         <button type="button" class="close" data-dismiss="alert">&times;</button>
    //         <strong>Моля въведете коректен регистрационен номер.</div>`;
    //         }
    //
    //         emailInput.value = "";
    //         timeInput.value = "";
    //         dateInput.value = `${currentDate.toISOString().substring(0, 10)}`;
    //         licenseInput.value = "";
    //
    //     });
    //
    // } else {
    //     // doItAll();
    // }


    // function doItAll() {
    //
    //     let inputDate = new Date();
    //     document.addEventListener("click", eventHandler);
    //     let table = document.getElementById("tbody");
    //     let today = document.getElementById("today");
    //     var trDates = document.getElementById("dates");
    //     var trWeekDays = document.getElementById("dayOfWeek");
    //     today.innerHTML = `Today: ${inputDate.toISOString().slice(0, 10)}`;
    //
    //
    //     let currentDate = new Date();
    //     let counter = 0;
    //
    //     function eventHandler(e) {
    //         let pressedId = e.target.id;
    //
    //         if (pressedId === "previousWeek") {
    //             --counter;
    //             table.innerHTML = "";
    //             trDates.innerHTML = "<th scope=\"row\"></th>";
    //             trWeekDays.innerHTML = "<th scope=\"col\">hour</th>";
    //             worker(addDays(currentDate, counter * 7));
    //
    //         } else if (pressedId === "nextWeek") {
    //             ++counter;
    //             table.innerHTML = "";
    //             trDates.innerHTML = "<th scope=\"row\"></th>";
    //             trWeekDays.innerHTML = "<th scope=\"col\">hour</th>";
    //             worker(addDays(currentDate, counter * 7));
    //         }
    //     }
    //
    //     // worker(inputDate);
    //
    //     // function worker(inputDate) {
    //     //     let dateNow = new Date(`${inputDate.toISOString().slice(0, 10)}`);
    //     //     let day = dateNow.getDay();
    //     //     let datesArray = [];
    //     //
    //     //     let weekday = new Array(7);
    //     //     weekday[0] = "Sunday";
    //     //     weekday[1] = "Monday";
    //     //     weekday[2] = "Tuesday";
    //     //     weekday[3] = "Wednesday";
    //     //     weekday[4] = "Thursday";
    //     //     weekday[5] = "Friday";
    //     //     weekday[6] = "Saturday";
    //     //
    //     //     for (let i = 0; i < 7; i++) {
    //     //         let dateInForLoop = new Date(`${addDays(new Date(dateNow), (i))}`);
    //     //         let obj = {date: dateInForLoop.toISOString().slice(0, 10), day: i};
    //     //         datesArray.push(obj);
    //     //         trDates.innerHTML += `<td >${dateInForLoop.toISOString().slice(0, 10)}</td>`;
    //     //         let d = dateInForLoop.toISOString().slice(0, 10)
    //     //         let dd = new Date(`${d}`);
    //     //
    //     //         trWeekDays.innerHTML += `<td >${weekday[dd.getDay()]}</td>`;
    //     //     }
    //     //
    //     //     for (let i = 9; i < 18; i++) {
    //     //         table.innerHTML += `<tr id="rowId${i}"><th scope="row">${i}:00</th></tr>`;
    //     //         let rowData = document.getElementById(`rowId${i}`);
    //     //         for (let j = 1; j <= 7; j++) {
    //     //             rowData.innerHTML += `<td id="${i}${j}"></td>`
    //     //         }
    //     //     }
    //     //
    //     //     fetch("api/v1/users")
    //     //         .then(res => res.json())
    //     //         .then(customers => {
    //     //             for (let i = 0; i < customers.length; i++) {
    //     //                 let dayId = datesArray.filter(x => x.date === `${customers[i].date}`);
    //     //                 let timeId = `${customers[i].time}`.slice(0, -3);
    //     //                 if (dayId.length !== 0) {
    //     //                     let id = `${timeId}`.concat(`${Object.values(dayId[0])[1] + 1}`);
    //     //                     document.getElementById(`${id}`).innerText =
    //     //                         `${customers[i].email} ${(customers[i].license) ? customers[i].license : ""}`;
    //     //                 }
    //     //             }
    //     //         })
    //     //         .catch(err => err);
    //     //
    //     // }
    // }

    // function addDays(date, days) {
    //     const copy = new Date(Number(date));
    //     copy.setDate(date.getDate() + days);
    //     return copy;
    // }
} else if (`${currentPage()}` === "register.html") {
    let customerName = document.getElementById("customerName");
    let customerEmail = document.getElementById("customerEmail");
    let customerCarModel = document.getElementById("customerCarModel");
    let customerCarMake = document.getElementById("customerCarMake");
    let customerCarLicensePlate = document.getElementById("customerCarLicensePlate");
    let customerPhone = document.getElementById("customerPhone");
    let customerPassword = document.getElementById("customerPassword");
    let registerBtn = document.getElementById("registerBtn");

    registerBtn.addEventListener("click", registerHandler);

    function registerHandler() {
        const name = customerName.value;
        const email = customerEmail.value;
        const model = customerCarModel.value;
        const make = customerCarMake.value;
        const plate = customerCarLicensePlate.value;
        const phone = customerPhone.value;
        const insertPassword = customerPassword.value;


        fetch("api/v1/users", {
            method: "POST",
            headers: new Headers({"Content-type": "application/json"}),
            body: JSON.stringify({
                name,
                email,
                phone,
                make,
                model,
                plate,
                insertPassword,
            }),
        })
            .then(res => res.json())
            .then(data => {
                window.location.href = "/login.html";
            })
            .catch(err => {
                console.log("Current error", err);
            });

        customerName.value = "";
        customerEmail.value = "";
        customerPhone.value = "";
        customerPassword.value = "";
        customerCarMake.value = "";
        customerCarModel.value = "";
        customerCarLicensePlate.value = "";
    }


} else if (`${currentPage()}` === "getAll.html") {
    let content = document.getElementById("content");


    fetch("api/v1/users", {
        method: "GET",
    })
        .then(res => res.json())
        .then(data => {
            for (let i = 0; i < Object.entries(data).length; i++) {
                let [currentObjectData] = (Object.entries(data)[i]).slice(-1);

                content.innerHTML += `
                     <div class="row">
                        <div class="col-24 col-md-1 align-baseline text-center text-nowrap text-truncate border">${currentObjectData.id}</div>
                        <div class="col-24 col-md-2 align-middle text-left text-nowrap text-truncate border">${currentObjectData.name}</div>
                        <div class="col-24 col-md-2 align-middle text-left text-nowrap text-truncate border">${currentObjectData.email}</div>
                        <div class="col-24 col-md-2 align-middle text-left text-nowrap text-truncate border">${currentObjectData.phone}</div>
                        <div class="col-24 col-md-1 align-middle text-center text-truncate border">${currentObjectData.CarMake}</div>
                        <div class="col-24 col-md-1 align-middle text-center border">${currentObjectData.carModel}</div>
                        <div class="col-24 col-md-2 align-middle text-center text-nowrap text-truncate border">
                            <button id="deleteBtn_${currentObjectData.id}" class="btn btn-danger mt-2 mb-2" type="button">Delete</button>
                            <button id="editBtn_${currentObjectData.id}" class="btn btn-info mt-2 mb-2" type="button">Edit</button>
                        </div>
                     </div>
                    `;

            }

            document.addEventListener("click", currentEventHandler);

            function currentEventHandler(e) {
                let currentId = e.target.localName === "button" ? (e.target.attributes.id.nodeValue).replace(/\D/g, "") : "";

                if (e.target.localName === "button" && (e.target.attributes.id.nodeValue).includes("editBtn")) {

                } else if (e.target.localName === "button" && (e.target.attributes.id.nodeValue).includes("deleteBtn")) {

                    fetch(`api/v1/users/${currentId}`, {
                        method: "DELETE",
                        headers: new Headers({"Content-type": "application/json"}),
                        body: JSON.stringify({
                            id: currentId,
                        }),
                    })
                        .then(res => res.json())
                        .then(data => {
                            window.location.reload();
                        })
                        .catch(err => {
                            console.log("Current error", err);
                        });
                }

            }

        })
        .catch(err => {
            console.log("Current error", err);
        });

} else if (`${currentPage()}` === "login.html") {

    let login = document.getElementById("loginSubmitBtn");
    let customerEmail = document.getElementById("customerEmail");
    let customerPassword = document.getElementById("customerPassword");

    login.addEventListener("click", loginHandler);

    function loginHandler() {
        const insertEmail = customerEmail.value;
        const insertPassword = customerPassword.value;


        fetch("api/v1/login", {
            method: "POST",
            headers: new Headers({"Content-type": "application/json"}),
            body: JSON.stringify({
                insertEmail,
                insertPassword,
            }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.message) {
                    window.location.href = "/index.html";
                } else {

                    alert(Object.entries(data)[0]);
                }
            })
            .catch(err => {
                console.log("Current error", err);
            });

        customerEmail.value = "";
        customerPassword.value = "";

    }


}
