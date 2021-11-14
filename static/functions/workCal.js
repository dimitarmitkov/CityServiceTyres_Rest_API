export function deleteCalendarEntry(e) {

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
            });
    }
}