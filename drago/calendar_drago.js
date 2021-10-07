// let dateNow = new Date("2021-03-17");
// let day = dateNow.getDay();
// let today = document.getElementById("today");
// let trDates = document.getElementById("dates");
// today.innerHTML = `Today: ${dateNow.toISOString().slice(0, 10)}, ${day} - today`;
// let table = document.getElementById("tbody");
// let datesArray = [];
//
// let startDay = (7 - day) - day;
// let endDay = (7 - day) + day;
// let td = document.createElement("td");
// for (let i = 1; i <= 7; i++) {
//     let dateInForLoop = new Date(`${dateNow.getFullYear()}-${dateNow.getMonth() + 1}-${dateNow.getDate() - day + i}`);
//     let obj = {date: dateInForLoop.toISOString().slice(0,10), day: i};
//     datesArray.push(obj);
//     trDates.innerHTML += `<td >${dateInForLoop.toISOString().slice(0, 10)}</td>`;
// }
//
// // console.log(datesArray);
//
// let th = document.createElement("th");
// let tr = document.createElement("tr");
// let firstRow;
// let nextRows;
//
// for (let i = 9; i < 18; i++) {
//     table.innerHTML += `<tr id="rowId${i}"><th scope="row">${i}:00</th></tr>`;
//     let rowData = document.getElementById(`rowId${i}`);
//     for (let j = 1; j <= 7; j++) {
//         rowData.innerHTML += `<td id="${i}${j}"></td>`
//     }
// }
//
// fetch("../drago/database.json")
//     .then(res => res.json())
//     .then(customers => {
//         for (let i = 0; i < customers.entities.length; i++) {
//
//             let dayId = datesArray.filter(x=>x.date===`${customers.entities[i].date}`);
//             let timeId = `${customers.entities[i].time}`.slice(0,-3);
//
//             if(dayId.length!==0){
//                 let id = `${timeId}`.concat(`${Object.values(dayId[0])[1]}`);
//             document.getElementById(`${id}`).innerText = customers.entities[i].email;
//             }
//         }
//     })
//     .catch(err => err);
