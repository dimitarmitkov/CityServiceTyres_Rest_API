export function calendarExport (dateInput,auth,licenseInput,timeInput){
    return logout.style.display = "inline";

    dateInput.addEventListener("change", hoursChange);
    dateInput.addEventListener("click", hoursChange);
    document.getElementById("select-btn").addEventListener("click", hoursChangeRecord);
    document.getElementById("email-select-group").style.display = "none";

    // get free hours in calendar for selected date, for logged user
    function hoursChange() {
        let currentDateInput = dateInput.value;
        let hoursSetup = document.getElementById("time");

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
            // dateInput.className =  today>compareDate ? "group-selection-regular" : "group-selection-regular-red";
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