export function loginHandler(customerEmail) {
    const insertEmail = customerEmail.value;
    // const insertPassword = customerPassword.value;
    const insertPassword = 1;

    fetch("api/v1/login", {
        method: "POST",
        headers: new Headers({"Content-type": "application/json"}),
        body: JSON.stringify({
            insertEmail,
            insertPassword,
        }),
    })
        .then(res => res.json())
        .then(data => {
            if (data.message) {
                window.location.href = "/index.html";
            } else {

                alert(Object.entries(data)[0]);
            }
        })
        .catch(err => {
            console.log("Current error", err);
        });
    customerEmail.value = "";
    customerPassword.value = "";
}