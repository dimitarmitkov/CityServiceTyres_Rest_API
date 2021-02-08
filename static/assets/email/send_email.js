let btn = document.getElementById("send_message").addEventListener("click",sendMail)

function sendMail(e) {
    if (e.target.id ==="send_message"){
    window.location.href = `mailto:office@cityservicetires.com`;
    }
}

sendMail();