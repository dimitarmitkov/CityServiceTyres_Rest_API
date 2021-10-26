let dateInput = document.getElementById("date");
let timeInput = document.getElementById("time");
let licenseInput = document.getElementById("license");
let emailInput = document.getElementById("email-select");
let currentDate = new Date();
let alertElement = document.getElementById("alert");
let result = true;
let checkDay = true;
let changedDay = new Date();
let logout = document.getElementById("logoutSelector");

function currentPage() {
    let path = window.location.pathname;
    return path.split("/").pop();
}

console.log(currentPage());

function showDate(date) {
    let startArray = [];
    document.getElementById("today").innerText = date.toString().substring(0, 16);
    let tableData = document.getElementById("tbody");
    tableData.innerHTML = "";
    fetch(`api/v1/calendarGet`, {
        method: "GET"
    })
        .then(res => res.json())
        .then(data => {
            for (let dataKey of data) {
                if (dataKey.date === date.toISOString().substring(0, 10)) {
                    startArray[dataKey.hour] = dataKey.hour ? dataKey : "";
                }
            }
            for (let i = 9; i < 18; i++) {
                tableData.innerHTML += (startArray[i]) ?
                    `<tr>
                    <td class="align-middle">${startArray[i].hour}</td>
                    <td class="align-middle">${startArray[i].licensePlate}</td>
                    <td class="align-middle">${startArray[i].name ? startArray[i].name : 'not logged'}</td>
                    <td class="align-middle">${startArray[i].email}</td>
                    <td class="align-middle">${startArray[i].date}</td>
                    <td class="align-middle">${startArray[i].season}</td>
                    <td class="align-middle">${startArray[i].tires_number}</td>
                    <td class="align-middle">${startArray[i].size}</td>
                    <td class="align-middle"><button id="deleteBtnTable" class="btn btn-danger mt-2 mb-2" type="button" value="${startArray[i].id}" onclick="deleteCalendarEntry(this)">Delete</button></td>
                    </tr>` : `<tr><td class="align-middle">${i}</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                    <td class="align-middle"><button class="btn btn-danger disabled mt-2 mb-2" type="button">Delete</button></td></tr>`;
            }
        })
        .catch(err => {
            console.log("Current error", err);
        });
}

if (`${currentPage()}` === "index.html") {

    fetch("api/v1/login")
        .then(res => res.json())
        .then(auth => {

            document.getElementById("loginSelector").style.display = "none";

            if (auth) {
                if (auth.type === "admin") {
                    document.getElementById("getAllSelector").style.display = "inline";
                    document.getElementById("getCalendar").style.display = "inline";
                }

                logout.style.display = "inline";

                dateInput.addEventListener("change", hoursChange);
                dateInput.addEventListener("click", hoursChange);
                document.getElementById("select-btn").addEventListener("click", hoursChangeRecord);
                document.getElementById("email-select-group").style.display = "none";

                function hoursChange() {
                    let hoursSetup = document.getElementById("time");
                    let currentDateInput = dateInput.value;

                    fetch("api/v1/calendarGet", {
                        method: "POST",
                        headers: {"Content-type": "application/json"},
                        body: JSON.stringify({currentDateInput}),
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
                    console.log(auth);
                    let currentDateInput = dateInput.value;
                    let time = timeInput.value;
                    let license = licenseInput.value;
                    let userEmail = auth ? auth.email : "";
                    let userId = auth ? auth.id : "";
                    let carId = auth ? auth.car : "";

                    fetch("api/v1/calendarAdd", {
                        method: "POST",
                        headers: {"Content-type": "application/json"},
                        body: JSON.stringify({currentDateInput, userId, time, carId, license, userEmail}),
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

                logout.addEventListener("click", (e) => {
                    e.preventDefault();
                    fetch("api/v1/logout")
                        .then(res => res.json())
                        .then(data => {
                            // console.log(data);
                            window.location.href = "/index.html";
                        })
                        .catch(err => console.log(err));
                });
            }
        })
        .catch(err => {
            dateInput.addEventListener("change", hoursChangeGuest);
            dateInput.addEventListener("click", hoursChangeGuest);
            document.getElementById("select-btn").addEventListener("click", hoursChangeRecordGuest);

            // get free hours in calendar for selected date, for not logged user
            function hoursChangeGuest() {
                let currentDateInput = dateInput.value;

                fetch("api/v1/calendarGet", {
                    method: "POST",
                    headers: {"Content-type": "application/json"},
                    body: JSON.stringify({currentDateInput}),
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
            }

            // record date and hour for guest user
            function hoursChangeRecordGuest() {
                let currentDateInput = dateInput.value;
                let time = timeInput.value;
                let license = licenseInput.value;
                let email = emailInput.value;

                let licenseCheck = !!license.match("/(?<=)[A-Z]{2}[0-9]{4}[A-z]{2}?(?=\\s)/gm");
                let mailCheck = !!email.match("/^(([^<>()[\\]\\\\.,;:\\s@\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$/");
                if(licenseCheck && mailCheck){

                fetch("api/v1/calendarAddGuest", {
                    method: "POST",
                    headers: {"Content-type": "application/json"},
                    body: JSON.stringify({currentDateInput, license, time, email}),
                })
                    .then(res => {
                        if (res) {
                        }
                    })
                    .then(data => {
                        dateInput.value = "";
                        timeInput.value = "";
                        licenseInput.value = "";
                        emailInput.value = "";
                        window.location.reload();
                    })
                    .catch(err => {
                    });
            }
                else{
                    licenseCheck ? " " : licenseInput.className += "-red";
                    mailCheck ? " " : emailInput.className += "-red";
                }
            }

        });
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

                content.innerHTML +=
                    `<div class="row">
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
                     </div>`;
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


} else if (`${currentPage()}` === "workCal.html") {
    document.getElementById("today").innerText = changedDay.toString().substring(0, 16);
    let prevDay = document.getElementById("workCal-Previous");
    let nextDay = document.getElementById("workCal-Next");
    let today = document.getElementById("workCal-Today");


    prevDay.addEventListener("click", (e) => {

        changedDay = changedDay === currentDate ? new Date(currentDate.setDate(currentDate.getDate() - 1)) :
            new Date(changedDay.setDate(changedDay.getDate() - 1));
        showDate(changedDay);
        checkDay = false;
    });

    nextDay.addEventListener("click", () => {
        changedDay = changedDay === currentDate ? new Date(currentDate.setDate(currentDate.getDate() + 1)) :
            new Date(changedDay.setDate(changedDay.getDate() + 1));
        showDate(changedDay);
        checkDay = false;
    });

    today.addEventListener("click", () => {
        changedDay = new Date();
        showDate(changedDay);
        checkDay = false;
    })

    checkDay ? showDate(currentDate) : "";

    function deleteCalendarEntry(e) {

        fetch("api/v1/login")
            .then(res => res.json())
            .then(auth => {

                if (auth && auth.type === "admin") {
                    fetch(`api/v1/calendarRemove`, {
                        method: "DELETE",
                        headers: new Headers({"Content-type": "application/json"}),
                        body: JSON.stringify({
                            id: e.value,
                        }),
                    })
                        .then(res => res.json())
                        .then(data => {
                            window.location.reload();
                        })
                        .catch(err => {
                            window.location.reload();
                            // console.log("Current error", err);
                        });
                }

            })
            .catch(err => {
                console.log(err)
            });


    }
}
