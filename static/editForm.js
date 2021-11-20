document.addEventListener('click', clickEventHandler);

function clickEventHandler(e) {
    if (e.target.innerHTML === "Edit") {

        let currentUserId = (e.target.id).replace(/\D/g, "");
        let getAllList = document.getElementById("getAllList");
        let formEditUser = document.getElementById("formEditUser");
        let submitButton = document.getElementById("formEditUserSubmitButton");

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
