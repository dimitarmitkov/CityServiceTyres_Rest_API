let array = [];

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
    // "over21":{
    //     "Wheels":"над 21",
    //     "Hotel":false,
    //     "Price":100,
    //     "Cleaning": false,
    //     "Special":true,
    // },
    "over22":{
        "Wheels":"Джип",
        "Hotel":false,
        "Price":52,
        "Cleaning": false,
        "Special":true,
    },
    // "over23":{
    //     "Wheels":"Джип",
    //     "Hotel":false,
    //     "Price":52,
    //     "Cleaning": false,
    //     "Special":true,
    // },

}

Object.keys(data).map(d=> array.push(d));

console.log(array);

export {data,array}

