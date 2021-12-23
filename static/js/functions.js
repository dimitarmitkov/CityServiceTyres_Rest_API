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
                    <td class="align-middle"><button id="deleteBtnTable" 
                    class="btn btn-danger mt-2 mb-2" type="button" 
                    value="${startArray[i].id}" 
                    onclick="deleteCalendarEntry(this)">Delete</button></td>
                    </tr>` : `<tr><td class="align-middle">${i}</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                    <td class="align-middle"><button class="btn btn-danger disabled mt-2 mb-2" type="button">Delete</button></td></tr>`;
            }
        })
        .catch(err => {
            console.log("Current error", err);
        });
}

export {showDate};