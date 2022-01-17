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

// function currentPage() {
//     let path = window.location.pathname;
//     return path.split("/").pop();
// }

// dateInput.placeholder = 'currentDate';

let pickedDate;

$(document).ready(function(){

    $(".datepicker").datepicker({
        placeholder: 'Choose a date',
        format: 'yyyy-mm-dd',
    });
});

// $(".datepicker").on("change", function() {
//     pickedDate = $("input").val();
//     console.log(pickedDate);
// });



dateInput.setAttribute('min',currentDate.toISOString().substring(0, 10));

fetch("api/v1/login")
    .then(res => res.json())
    .then(auth => {

        document.getElementById("loginSelector").style.display = "none";

        if (auth) {
            if (auth.type === "admin") {
                document.getElementById("getAllSelector").style.display = "inline";
            }

            logout.style.display = "inline";

            dateInput.addEventListener("change", hoursChange);
            dateInput.addEventListener("click", hoursChange);
            document.getElementById("select-btn").addEventListener("click", hoursChangeRecord);
            document.getElementById("email-select-group").style.display = "none";
            //
            // $(".datepicker").on("change", function() {
            //     pickedDate = $("input").val();
            //     hoursChange(pickedDate);
            // });

            // get free hours in calendar for selected date, for logged user
            function hoursChange() {
                let currentDateInput = dateInput.value;
                let hoursSetup = document.getElementById("time");

                console.log('current date input: ', currentDateInput);

                if (checkDateCompareToToday(currentDateInput)) {
                    dateInput.className = "group-selection-regular";

                    fetch("api/v1/calendarGet", {
                        method: "POST",
                        headers: {"Content-type": "application/json"},
                        body: JSON.stringify({currentDateInput}),
                    })
                        .then(res => res.json())
                        .then(data => {

                                hoursSetup.innerHTML = "";
                                for (let i = 9; i < 18; i++) {
                                    if (data.indexOf(i.toString()) < 0) {
                                        hoursSetup.innerHTML += `<option>${i}:00</option>`;
                                    }
                                }
                            }
                        )
                        .catch(err => console.log(err));
                } else {
                    dateInput.className = "group-selection-regular-red";
                    hoursSetup.innerText = "";
                }
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
                let currentDateInput = dateInput.value;
                let time = timeInput.value;
                let license = licenseInput.value;
                let userEmail = auth ? auth.email : "";
                let userId = auth ? auth.id : "";
                let carId = auth ? auth.car : "";

                if (currentDateInput && time && license) {

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
                } else {
                    document.getElementById("day-time-record").style.display = "inline";
                }

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

        let currentDateInput;

        $(".datepicker").on("click change", function() {
            let pickedDate = $("input").val();
            currentDateInput = $("input").val();
            console.log(pickedDate);
        });

        // get free hours in calendar for selected date, for not logged user
        function hoursChangeGuest() {
            // let currentDateInput = dateInput.value;
            let hoursSetup = document.getElementById("time");

            console.log('current date input: ', currentDateInput);


            if (checkDateCompareToToday(currentDateInput)) {
                dateInput.className = "group-selection-regular";

                fetch("api/v1/calendarGet", {
                    method: "POST",
                    headers: {"Content-type": "application/json"},
                    body: JSON.stringify({currentDateInput}),
                })
                    .then(res => res.json())
                    .then(data => {
                            hoursSetup.innerHTML = "";
                            for (let i = 9; i < 18; i++) {
                                if (data.indexOf(i.toString()) < 0) {
                                    hoursSetup.innerHTML += `<option>${i}:00</option>`;
                                }
                            }
                        }
                    )
                    .catch(err => {
                        // alert("You are not logged. Please login.")
                    });
            } else {
                hoursSetup.innerHTML = "";
                dateInput.className = checkDateCompareToToday(currentDateInput) ? "group-selection-regular" : "group-selection-regular-red";
            }
        }

        // record date and hour for guest user
        function hoursChangeRecordGuest() {
            let currentDateInput = dateInput.value;
            let time = timeInput.value;
            let license = licenseInput.value;
            let email = emailInput.value;
            let validate = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            let licenseCheck = !!license.match(/[A-Z]{2}[0-9]{4}[A-z]{2}/);
            const mailCheck = !!email.match(validate);


            if (licenseCheck && mailCheck && time && currentDateInput) {

                licenseInput.className = "group-selection-regular";
                emailInput.className = "group-selection-regular";
                dateInput.className = "group-selection-regular";
                // timeInput.className = "group-selection-regular";

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
            } else {
                licenseInput.className = licenseCheck ? "group-selection-regular" : "group-selection-regular-red";
                emailInput.className = mailCheck ? "group-selection-regular" : "group-selection-regular-red";
                dateInput.className = checkDateCompareToToday(currentDateInput) ? "group-selection-regular" : "group-selection-regular-red";
                // timeInput.className = "group-selection-regular-red";
            }
        }

    });


function checkDateCompareToToday(currentDateInput) {

    let today = new Date();
    let compareDate = currentDateInput ? new Date(currentDateInput) : new Date();

    return today.toISOString().substring(0, 10) <= compareDate.toISOString().substring(0, 10);
}