const initialData = require("./initialFileStructure")
const fs = require("fs");
const path = require("path");

function startTime() {
    let today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();

    m = checkTime(m);
    s = checkTime(s);
    let t = setTimeout(startTime, 500);

    if (+h === 0 && +m===10) {
        stat();
    }


}

function checkTime(i) {
    if (i < 10) {
        i = "0" + i
    }
    // add zero in front of numbers < 10
    return i;
}

startTime();



function stat() {
    let currentMonth = (new Date()).getMonth();
    let currentYear = (new Date()).getFullYear() + 20;
    let fileName = currentMonth < 5 ? `database_Mar_${currentYear}.json` : `database_Sep_${currentYear}.json`;

    fs.stat(path.resolve("data", `${fileName}`), function (exists) {
        if (exists && exists.code === "ENOENT") {
            fs.writeFile(path.resolve("data", `${fileName}`),
                JSON.stringify(initialData, null, 2),
                function (err) {
                    if (err) throw err;
                    console.log('File is created successfully.');
                });
        }
    });
}




class CustomerModel {
    constructor() {
        // this.data = require(`../../data/${fileName}`);
        this.data = require(`../../data/database.json`);
    }

    _write(newData, resolveData) {
        return new Promise((resolve, reject) => {
            fs.writeFile(path.resolve("data", `database.json`), JSON.stringify(newData, null, 2), (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                this.data = newData;
                resolve(resolveData);
            });
        });
    }


    insert(newCustomer) {
        const newIndex = ++this.data.lastIndex;
        newCustomer = {id: newIndex, ...newCustomer};

        let customers = this.data.entities;

        for (let customer of customers) {
            if (newCustomer.email === customer.email) {
                return;
            }
        }

        const newData = {
            lastIndex: newIndex,
            entities: this.data.entities.concat(newCustomer)
        };
        return this._write(newData, newCustomer);
    }

    update(customerId, updates) {
        const entityIndex = this.data.entities.findIndex(({id}) => id === customerId);
        const entity = this.data.entities[entityIndex];
        const updatedEntity = {...entity, ...updates};
        const newData = {
            lastIndex: this.data.lastIndex,
            entities: [
                ...this.data.entities.slice(0, entityIndex),
                updatedEntity,
                this.data.entities.slice(entityIndex + 1)
            ]
        };
        return this._write(newData, updatedEntity);
    }

    delete(id) {
        const deletedEntity = this.getOne(id);
        const newData = {
            lastIndex: this.data.lastIndex,
            entities: this.data.entities.filter(({id: i}) => i !== id)
        }
        return this._write(newData, deletedEntity);
    }

    getOne(id) {
        return Promise.resolve(this.data.entities.find(({id: i}) => i === id));
    }

    getAll() {
        return Promise.resolve(this.data.entities);
    }

    getOneByEmail(email) {
        return Promise.resolve(this.data.entities.find(({email: i}) => i === email));
    }
}

module.exports = new CustomerModel();