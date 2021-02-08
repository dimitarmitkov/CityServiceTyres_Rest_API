// let drop_down = document.getElementById("price_drop_down")
let data= {
    15:{
        "Wheels":" 13",
        "Hotel":true,
        "Price":28,
        "Cleaning": false,
        "Special":false
    },
    20:{
        "Wheels":"до 20",
        "Hotel":true,
        "Price":80,
        "Cleaning": true,
        "Special": true,
    },
    "over20":{
        "Wheels":"над 20",
        "Hotel":true,
        "Price":100,
        "Cleaning": true,
        "Special":true,
    },
    "jeep_bus":{
        "Wheels":"Бус",
        "Hotel":true,
        "Price":40,
        "Cleaning": true,
        "Special":true,
    },
    "over22":{
        "Wheels":"Джип",
        "Hotel":false,
        "Price":52,
        "Cleaning": false,
        "Special":true,
    },
}

function csgPriceBlockDataLoad(array,i) {
    return `<h3> Джанти ${data[array[i]].Wheels}"</h3>
    <h4> <sup> от BGN </sup>${data[array[i]].Price}<span> за комплект 4 гуми</span> </h4>
    <ul>${data[array[i]].Hotel ? "<li>Съхранение на хотел</li>" : "<li class=\"na\">Съхранение на хотел</li>"}
    <li>от BGN ${data[array[i]].Price} за сезон </li>
    ${data[array[i]].Cleaning ? "<li>Почистване на джанти</li>" : "<li class=\"na\">Почистване на джанти</li>"}
    ${data[array[i]].Special ? "<li>Специална обработка</li>" : "<li class=\"na\">Специална обработка</li>"}
    </ul>
    <div class = "btn-wrap">
    <a href = "#tires" class = "btn-buy"> Запазване на час </a>
    </div>`
}

function season() {
    let element = document.getElementById("season");
    let array = [];
    Object.keys(data).map(d=> array.push(d));

    console.log(array);

    for (let i = 0; i < array.length; i++) {
        i % 2 === 0 ?
            element.innerHTML +=
                `<div class="col-lg-4 col-md-6" data-aos="zoom-im" data-aos-delay="100" id="${array[i]}Tires">
                    <div class="box">
                        ${csgPriceBlockDataLoad(array,i)}
                    </div>
                </div>`
            : element.innerHTML +=
                `<div class="col-lg-4 col-md-6 mt-4 mt-md-0" data-aos="zoom-im" data-aos-delay="100" id="${array[i]}Tires">
                    <div class="box featured">
                        ${csgPriceBlockDataLoad(array,i)}
                    </div>
                </div>`
    }
}








season();

