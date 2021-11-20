export function deleteCalendarEntry(e) {

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