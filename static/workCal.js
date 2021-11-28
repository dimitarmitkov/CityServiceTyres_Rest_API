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
        // here
        .catch(err => {
            console.log(err)
        });
}