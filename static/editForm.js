document.addEventListener('click', clickEventHandler);

let content = document.getElementById("content");
let cpGetAll = document.getElementById("cpGetAll");
cpGetAll.innerText = 'Control Panel';
cpGetAll.href = "controlPanel.html";


fetch("api/v1/users", {
    method: "GET",
})
    .then(res => res.json())
    .then(data => {

        for (let i = 0; i < Object.entries(data).length; i++) {
            let [currentObjectData] = (Object.entries(data)[i]).slice(-1);

            content.innerHTML +=
                `       <td>${currentObjectData.id}</td>
                        <td>${currentObjectData.name}</td>
                        <td>${currentObjectData.email}</td>
                        <td>${currentObjectData.phone}</td>
                        <td>${currentObjectData.CarMake}</td>
                        <td>${currentObjectData.carModel}</td>
                        <td>
                            <button id="deleteBtn_${currentObjectData.id}" class="btn btn-danger mt-2 mb-2" type="button">Delete</button>
                            <button id="editBtn_${currentObjectData.id}" class="btn btn-info mt-2 mb-2" type="button">Edit</button>
                        </td>`;
        }

        $(document).ready(function() {
            $('#dataTable').DataTable();
        });

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

function clickEventHandler(e) {
    if (e.target.innerHTML === "Edit") {

        let currentUserId = (e.target.id).replace(/\D/g, "");
        let getAllList = document.getElementById("getAllList");
        let formEditUser = document.getElementById("formEditUser");
        let submitButton = document.getElementById("formEditUserSubmitButton");
        let cpGetAll = document.getElementById("cpGetAll");

        cpGetAll.innerText = 'Get All';
        cpGetAll.href = "getAll.html";

        getAllList.classList.replace("get-all-show", "get-all-hidden");
        formEditUser.classList.replace("get-all-hidden", "get-all-show");

        submitButton.addEventListener("click", () => {
            formEditUser.classList.replace("get-all-show", "get-all-hidden");
            getAllList.classList.replace("get-all-hidden", "get-all-show");
        })

        fetch("api/v1/login")
            .then(res => res.json())
            .then(auth => {
                if (auth) {
                    fetch(`api/v1/users/${currentUserId}`, {
                        method: "POST",
                        headers: new Headers({"Content-type": "application/json"}),
                        body: JSON.stringify({
                            id: currentUserId,
                        }),
                    })
                        .then(res => res.json())
                        .then(data => {

                            let firstName = Object.entries(data).shift().slice(-1).shift().name;
                            let email = Object.entries(data).shift().slice(-1).shift().email;
                            let carMake = Object.entries(data).shift().slice(-1).shift().CarMake;
                            let carModel = Object.entries(data).shift().slice(-1).shift().carModel;
                            let phone = Object.entries(data).shift().slice(-1).shift().phone;
                            let season = Object.entries(data).shift().slice(-1).shift().season;
                            let size = Object.entries(data).shift().slice(-1).shift().size;
                            let tiresNumber = Object.entries(data).shift().slice(-1).shift().tires_number;
                            let tiresProducer = Object.entries(data).shift().slice(-1).shift().tires_producer;

                            document.getElementById("dataName").innerText = "user name: " + firstName;
                            document.getElementById("dataEmail").innerText = "user emil: " + email;
                            document.getElementById("dataCarMake").innerText = "user car: " + carMake;
                            document.getElementById("dataCarModel").innerText = "user model: " + carModel;
                            document.getElementById("dataPhone").innerText = "user phone: " + phone;
                            document.getElementById("dataSeason").innerText = "user season: " + season;
                            document.getElementById("dataSize").innerText = "user size: " + size;
                            document.getElementById("dataTiresNumber").innerText = "user tires number: " + tiresNumber;
                            document.getElementById("dataProducer").innerText = "user producer: " + tiresProducer;

                        })
                        .catch(err => {
                            console.log("Current error", err);
                        });
                }
            })
            .catch(err => {
                console.log('Not logged')
            });


    }


}
