
let title = document.getElementById("headTitle");

title.innerHTML=`This the title for date ${(new Date()).toISOString().slice(0,10)}.`


