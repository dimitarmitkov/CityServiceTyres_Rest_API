const cs = require("../connection/connectionData");
const initialData = require("./initialFileStructure")
const fs = require("fs");
const path = require("path");
const mysql = require("mysql");
const bcrypt = require("bcrypt");

let continueDataOperate = true;

//MySQL details
let connection = mysql.createConnection({
    host: cs.host,
    port: cs.port,
    user: cs.user,
    password: cs.password,
    database: cs.database,
    multipleStatements: cs.multipleStatements
});

class CustomerModel {
    constructor() {
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

    _writeSim(newData, resolveData) {
        return new Promise((resolve, reject) => {


            connection.connect(function (err) {
                if (err) {
                    console.error('THIS error connecting: ' + err.stack);
                    return;
                }
            })


            let sql = 'insert into Users(name, email, licensePlate, carMake, carModel, productionYear) values ( ? , ? , ? , ? , ? ,? )';
            connection.query(sql, ["Mitkov", `${resolveData.email}`, `${resolveData.license}`, "Porsche", "923", `${resolveData.date}`],
                (err, data) => {
                    if (err) {
                        console.log(err);
                        return
                    } else {
                        console.log(data);
                    }
                });
        })
    }

    _writeSim2(newData, resolveData) {
        return new Promise((resolve, reject) => {


            connection.connect(function (err) {
                if (err) {
                    console.error('THIS error connecting: ' + err.stack);
                    return;
                }
            })

            let sql = 'insert into Users(name, email,password,regDate) values ( ? , ? , ? , ? )';

            const hash = bcrypt.hashSync(`${resolveData.password}`, 10);

            const isValidPass = bcrypt.compareSync(`${resolveData.password}`, hash);

            console.log(isValidPass);

            connection.query(sql, [`${resolveData.name}`, `${resolveData.email}`, `${hash}`,
                    `${new Date().toISOString().slice(0, 19).replace('T', ' ')}`],
                (err, data) => {
                    if (err) {
                        console.log("error", err);
                        return continueDataOperate = false;
                    } else {
                        console.log("data", data);
                    }
                });
            if (continueDataOperate) {
                connection.query("SELECT MAX( id ) as max FROM users", (err, data, fields) => {
                    if (err) {
                        console.log("error", err);
                        return continueDataOperate = false;
                    } else if (continueDataOperate) {

                        let string = JSON.stringify(data);
                        let json = JSON.parse(string);
                        let currentId = (Object.values(json)[0].max);

                        let sql = 'insert into User_Cars(userId, carMake, carModel, licensePlate, regDate) ' +
                            'values ( ? , ? , ? , ? , ? )';
                        connection.query(sql, [`${currentId}`, `${resolveData.make}`,
                                `${resolveData.model}`,
                                `${resolveData.plate}`, `${new Date().toISOString().slice(0, 19).replace('T', ' ')}`],
                            (err, data) => {
                                if (err) {
                                    console.log("error", err);
                                    return continueDataOperate = false;
                                } else {
                                    console.log("data", data);
                                }
                            });
                    }
                });
            }
        })
    }

    _getById(value) {
        return new Promise((resolve, reject) => {

            let sql = mysql.format(`select email from users where email= ?`, [value]);

            connection.query(sql,
                (err, data) => {
                    if (err) {
                        console.log("error", err);
                        return err;
                    } else {

                       return  JSON.parse(JSON.stringify(data[0]));
                    }
                }
            );
        })
    }


    insert(newCustomer) {
        const newIndex = ++this.data.lastIndex;
        newCustomer = {id: newIndex, ...newCustomer};

        let customers = this.data.entities;

        const newData = {
            lastIndex: newIndex,
            entities: this.data.entities.concat(newCustomer)
        };


        return this._writeSim2( newCustomer);
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

    login(id, hashPassword) {
        return Promise.resolve(this.data.entities.find(({id: i, password: password}) => (i === id && password === hashPassword)));


    }

    getAll() {
        return Promise.resolve(this.data.entities);
    }

    getOneByEmail(email) {
        return Promise.resolve(this._getById(email));
    }

}

module.exports = new CustomerModel();
