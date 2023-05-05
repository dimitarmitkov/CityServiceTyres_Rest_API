let dateInput = document.getElementById("date");
let timeInput = document.getElementById("time");
let licenseInput = document.getElementById("license");
let emailInput = document.getElementById("email-select");
let phoneInput = document.getElementById("phone-select");
let currentDate = new Date();
let alertElement = document.getElementById("alert");
let result = true;
let logout = document.getElementById("logoutSelector");

$(document).ready(function () {

    $(".datepicker").datepicker({
        placeholder: 'Choose a date',
        dateFormat: "yy-mm-dd",
    });
});

$("#date").datepicker({
    firstDay: 1,
    placeholder: 'Choose a date',
    dateFormat: "yy-mm-dd",
    beforeShowDay: (date) => {
        if (date.getDay() === 0) {
            return [true, 'unavailable'];
        }
        return [true, ''];


        // this makes sunday forbidden for selection
        // return [date.getDay() !== 0, date.getDay() === 0 ? 'unavailable' : ''];
    },
});


dateInput.value = "";

dateInput.setAttribute('min', currentDate.toISOString().substring(0, 10));

fetch("api/v1/login")
    .then(res => res.json())
    .then(auth => {

        document.getElementById("loginSelector").style.display = "none";

        if (auth) {
            if (auth.type === "admin") {
                document.getElementById("getAllSelector").style.display = "inline";
            }

            logout.style.display = "inline";

            document.getElementById("select-btn").addEventListener("click", hoursChangeRecord);
            document.getElementById("email-select-group").style.display = "none";
            document.getElementById("phone-select-group").style.display = "none";
            let dateData = {};

            // get free hours in calendar for selected date, for logged user
            $("#date").on("click change", () => {
                let currentDateInput = $("input").val();
                let hoursSetup = document.getElementById("time");
                const getDayValue = $("#date").datepicker("getDate");

                if (getDayValue) {
                    dateData["dayOfWeek"] = getDayValue.getDay();
                    dateData["currentMonth"] = getDayValue.getMonth();
                }

                if (checkDateCompareToToday(currentDateInput)) {
                    dateInput.className = "group-selection-regular";

                    fetch("api/v1/calendarGet", {
                        method: "POST",
                        headers: {"Content-type": "application/json"},
                        body: JSON.stringify({currentDateInput}),
                    })
                        .then(res => res.json())
                        .then(data => {
                                hoursSetupFunc(hoursSetup, data, dateData);
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
            });

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
                                alert("Успешна регистрация!")
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
                        window.location.href = "/index.html";
                    })
                    .catch(err => console.log(err));
            });
        }
    })
    .catch(err => {
        document.getElementById("select-btn").addEventListener("click", hoursChangeRecordGuest);
        let dateData = {};

        // get free hours in calendar for selected date, for not logged user
        $("#date").on("click change", () => {
            let currentDateInput = $("input").val();
            let hoursSetup = document.getElementById("time");
            const getDayValue = $("#date").datepicker("getDate");

            if (getDayValue) {
                dateData["dayOfWeek"] = getDayValue.getDay();
                dateData["currentMonth"] = getDayValue.getMonth();
            }


            if (checkDateCompareToToday(currentDateInput)) {
                dateInput.className = "group-selection-regular";

                fetch("api/v1/calendarGet", {
                    method: "POST",
                    headers: {"Content-type": "application/json"},
                    body: JSON.stringify({currentDateInput}),
                })
                    .then(res => res.json())
                    .then(data => {
                            hoursSetupFunc(hoursSetup, data, dateData)
                        }
                    )
                    .catch(err => {
                        // alert("You are not logged. Please login.")
                    });
            } else {
                hoursSetup.innerHTML = "";
                dateInput.className = checkDateCompareToToday(currentDateInput) ? "group-selection-regular" : "group-selection-regular-red";
            }
        });

        // record date and hour for guest user
        function hoursChangeRecordGuest() {
            let currentDateInput = dateInput.value;
            let time = timeInput.value;
            let license = licenseInput.value;
            let email = emailInput.value;
            let phone = phoneInput.value;
            let validate = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            let licenseCheck = !!license.match(/[A-Z]{1,2}[0-9]{4}[A-z]{2}/);
            const mailCheck = !!email.match(validate);
            const phoneCheck = phone.length === 17;

            if (licenseCheck && mailCheck && time && currentDateInput && phoneCheck) {

                licenseInput.className = "group-selection-regular";
                emailInput.className = "group-selection-regular";
                dateInput.className = "group-selection-regular";
                phoneInput.className = "group-selection-regular";

                fetch("api/v1/calendarAddGuest", {
                    method: "POST",
                    headers: {"Content-type": "application/json"},
                    body: JSON.stringify({currentDateInput, license, time, email, phone}),
                })
                    .then(res => {
                        if (res) {
                            alert("Успешна регистрация!");
                        }
                    })
                    .then(data => {
                        dateInput.value = "";
                        timeInput.value = "";
                        licenseInput.value = "";
                        emailInput.value = "";
                        phoneInput.value = "";
                        window.location.reload();
                    })
                    .catch(err => {
                    });
            } else {
                licenseInput.className = licenseCheck ? "group-selection-regular" : "group-selection-regular-red";
                emailInput.className = mailCheck ? "group-selection-regular" : "group-selection-regular-red";
                dateInput.className = checkDateCompareToToday(currentDateInput) ? "group-selection-regular" : "group-selection-regular-red";
                phoneInput.className = phoneCheck ? "group-selection-regular" : "group-selection-regular-red";
            }
        }
    });

function checkDateCompareToToday(currentDateInput) {
    let today = new Date();
    let compareDate = currentDateInput ? new Date(currentDateInput) : new Date();

    return today.toISOString().substring(0, 10) <= compareDate.toISOString().substring(0, 10);
}

function hoursSetupFunc(hoursSetup, data, dateData) {
    const maxHour = dateData.dayOfWeek > 0 && dateData.dayOfWeek < 6 ? 18 : 13;

    hoursSetup.innerHTML = "";

    let noFreeHoursOption = '<option>Няма свободни часове</option>';

    let isMonthOneOf = (months, currentMonth) => months.includes(currentMonth);
    let isDayOfWeekOneOf = (daysOfWeek, dayOfWeek) => daysOfWeek.includes(dayOfWeek);

    let hoursHTML = '';
    if (isMonthOneOf([2, 3, 8, 9], dateData.currentMonth) && dateData.dayOfWeek !== 0 ||
        isMonthOneOf([0, 1, 4, 5, 6, 7, 10, 11], dateData.currentMonth) && !isDayOfWeekOneOf([0, 6], dateData.dayOfWeek)) {
        for (let i = 9; i < maxHour; i++) {
            if (data.indexOf(i.toString()) < 0) {
                hoursHTML += `<option>${i}:00</option>`;
            }
        }
    } else {
        hoursHTML = noFreeHoursOption;
    }

    hoursSetup.innerHTML = hoursHTML;
}


phoneInput.oninput = (e) => {
    e.target.value = autoFormatPhoneNumber(e.target.value);
};

function autoFormatPhoneNumber(phoneNumberString) {
    try {
        let cleaned = ("" + phoneNumberString).replace(/\D/g, "");
        let match = cleaned.match(/^(359|)?(\d{0,2})?(\d{0,7})?$/);
        let intlCode = "+359 "
        return [
            intlCode,
            match[2] ? "(" : "",
            match[2],
            match[3] ? ") " : "",
            match[3],
            match[4] ? "-" : "",
            match[4],
        ].join("");
    } catch (err) {
        return phoneNumberString.substring(0, 17);
    }
}


licenseInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;

    const cyrillicText = replaceEnglishWithCyrillic(inputValue);

    let uppercaseValue = cyrillicText.toUpperCase();

    event.target.value = uppercaseValue;
});


function replaceEnglishWithCyrillic(text) {
    // Define the mapping of English letters to Cyrillic letters
    const cyrillicToEnglishMap = {
        'а': 'a',
        'б': 'b',
        'в': 'b',
        'г': 'g',
        'д': 'd',
        'е': 'e',
        'ж': 'j',
        'з': 'z',
        'и': 'i',
        'й': 'j',
        'к': 'k',
        'л': 'l',
        'м': 'm',
        'н': 'h',
        'о': 'o',
        'п': 'p',
        'р': 'p',
        'с': 'c',
        'т': 't',
        'у': 'y',
        'ф': 'f',
        'х': 'x',
        'ц': 'c',
        'ъ': 'y',
        'А': 'A',
        'Б': 'B',
        'В': 'B',
        'Г': 'G',
        'Д': 'D',
        'Е': 'E',
        'Ж': 'Z',
        'З': 'Z',
        'И': 'I',
        'Й': 'Y',
        'К': 'K',
        'Л': 'L',
        'М': 'M',
        'Н': 'H',
        'О': 'O',
        'П': 'P',
        'Р': 'P',
        'С': 'C',
        'Т': 'T',
        'У': 'Y',
        'Ф': 'F',
        'Х': 'H',
        'Ц': 'C',
        'Ъ': 'Y'
    };

    return text.replace(/[а-яА-Я]/g, match => cyrillicToEnglishMap  [match] || match);
}


