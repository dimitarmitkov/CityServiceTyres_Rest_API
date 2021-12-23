let customerName = document.getElementById("customerName");
let customerEmail = document.getElementById("customerEmail");
let customerCarModel = document.getElementById("customerCarModel");
let customerCarMake = document.getElementById("customerCarMake");
let customerCarLicensePlate = document.getElementById("customerCarLicensePlate");
let customerPhone = document.getElementById("customerPhone");
let customerPassword = document.getElementById("customerPassword");
let registerBtn = document.getElementById("registerBtn");

registerBtn.addEventListener("click", registerHandler);

function registerHandler() {
    const name = customerName.value;
    const email = customerEmail.value;
    const model = customerCarModel.value;
    const make = customerCarMake.value;
    const plate = customerCarLicensePlate.value;
    const phone = customerPhone.value;
    const insertPassword = customerPassword.value;

    fetch("api/v1/users", {
        method: "POST",
        headers: new Headers({"Content-type": "application/json"}),
        body: JSON.stringify({
            name,
            email,
            phone,
            make,
            model,
            plate,
            insertPassword,
        }),
    })
        .then(res => res.json())
        .then(data => {
            window.location.href = "/login.html";
        })
        .catch(err => {
            console.log("Current error", err);
        });

    customerName.value = "";
    customerEmail.value = "";
    customerPhone.value = "";
    customerPassword.value = "";
    customerCarMake.value = "";
    customerCarModel.value = "";
    customerCarLicensePlate.value = "";
}