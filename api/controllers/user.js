// const userAction = require("./userActions");
const userModel = require("../../models/userModel");
const {Sequelize} = require('sequelize');
const cs = require("../connection/connectionData");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const {QueryTypes} = require('sequelize');
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const myKey = require("../connection/myKey");

// const sequelize = new Sequelize('database', 'username', 'password', {
const sequelize = new Sequelize(cs.database, cs.user, cs.password, {
    host: cs.host,
    port: cs.port,
    dialect: 'mysql',
});

try {
    sequelize.authenticate()
        .then(res => console.log('Connection has been established successfully.',
            sequelize.getDatabaseName()))
        .catch(err => console.log(err));

} catch (error) {
    console.error('Unable to connect to the database:', error);
}


module.exports.createUser = function (req, res, next) {
    const {
        name,
        email,
        insertPassword,
        phone,
        make,
        model,
        plate
        // regDate,
        // type,
        // deleted
    } = req.body;

    const password = bcrypt.hashSync(`${insertPassword}`, 10);

    const isValidPass = bcrypt.compareSync(`${insertPassword}`, `${password}`);

    // console.log(isValidPass);

    const userTable = sequelize.define("usersModel", {
            name,
            email,
            password,
            phone,
            // regDate,
            // type,
            // deleted
        },
        {tableName: "users"});


    try {
        userTable.create({
            name,
            email,
            password,
            phone,
            // regDate,
            // type,
            // deleted
        }).then(customer => {
            console.log(customer.dataValues.id);
            let userId = customer.dataValues.id;

            let CarMake = make;
            let carModel = model;
            let licensePlate = plate;

            const carTable = sequelize.define("user_carModel",
                {userId, CarMake, carModel, licensePlate},
                {tableName: "user_cars"});


            carTable.create({userId, CarMake, carModel, licensePlate})
                .then(customer => {
                    res.status(201).send(customer);
                })
                .catch(err => {
                    res.satus(400).send('some error')
                });

            // res.status(201).send(customer);
        }).catch(next => {
            res.status(400).send('already exists')
        });

    } catch (err) {
        res.send("this email already exists.")
    }
}

module.exports.getUsers = function (req, res, next) {
    const userTable = sequelize.define("usersModel", {},
        {tableName: "users"});

    const carTable = sequelize.define("user_carModel",
        {},
        {tableName: "user_cars"});

    const loggedUser = sequelize.define("user_loggedModel",
        {},
        {tableName: "user_logged"});

    loggedUser.findAll({attributes: ['id', 'userId', 'token']})
        .then(logged => {
            let [firstElement] = logged;
            let currentToken = firstElement.dataValues.token;
            let tokenId = firstElement.dataValues.id;

            // const payload = jwt.verify(currentToken,`${myKey}`)?jwt.verify(currentToken,`${myKey}`):false;
            jwt.verify(currentToken, `${myKey}`, (err, user) => {
                if (err) {
                    loggedUser.destroy(
                        {
                            where: {id: tokenId},
                            force: true
                        },
                    );
                }

                if (user) {
                    const payload = jwt.verify(currentToken, `${myKey}`);
                    console.log(payload);
                }
            })

        })
        .catch(err => console.log(err));

    // console.log(req);

    const {QueryTypes} = require('sequelize');
    const records = sequelize.query("select Users.id, Users.name, Users.email, Users.phone, Cars.CarMake, " +
        "Cars.carModel from users as Users left join user_cars as Cars " +
        "on Users.id = Cars.userId " +
        "where Users.deleted = '0'",
        {
            type: QueryTypes.SELECT
        }).then(result => {

        // console.log(JSON.stringify(result, null, 2));

        res.send(JSON.stringify(result, null, 2));
    }).catch(next => console.log(next));


    // userTable.findAll(
    //     {
    //         attributes: ['id', 'name', 'email', 'type', 'deleted', 'phone'],
    //         where: {deleted : "0"},
    //     },
    //
    // ).then(customers =>{
    //     customers.every(user => user instanceof userTable);
    //
    //     // console.log(JSON.stringify(customers, null, 2));
    //
    //     res.send(JSON.stringify(customers, null, 2));
    // }).catch(next);
}


module.exports.loginUser = function (req, res, next) {

    const {insertEmail, insertPassword} = req.body;
    const userTable = sequelize.define("usersModel", {},
        {tableName: "users"});
    try {

        userTable.findOne(
            {
                attributes: ['id', 'name', 'email', 'password', 'type', 'deleted'],
                where: {email: insertEmail}
            }).then(user => {
            if (user) {

                let checkPass = user.dataValues.password;
                const password_valid = bcrypt.compareSync(`${insertPassword}`, `${checkPass}`);

                if (password_valid) {
                    let userId = user.dataValues.id;

                    const carTable = sequelize.define("user_carModel",
                        {userId},
                        {tableName: "user_cars"});

                    carTable.findAll(
                        {
                            attributes: ['id', 'userId'],
                            where: {userId: userId}
                        }).then(car => {

                        let token = jwt.sign(
                            {

                                username: user.dataValues.name,
                                id: user.dataValues.id,
                                type: user.dataValues.type,
                                email: user.dataValues.email,
                                deleted: user.dataValues.deleted,
                                car: car[0].dataValues.id,
                            },
                            `${myKey}`,
                            {expiresIn: '300s'});

                        const user_loggedTable = sequelize.define("user_loggedModel", {userId, token},
                            {tableName: "user_logged"});

                        res.cookie("access_token", token, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === "production"
                        })
                            .status(200)
                            .json({message: "Successfully logged"});
                    }).catch();
                } else {
                    res.status(400).json({error: "Password Incorrect"});
                }

            } else {
                res.status(404).json({error: "User does not exist"});
            }

        }).catch(err => console.log(err));
    } catch (err) {
        res.send("incorrect user or password.")
    }
}

module.exports.logoutUser = function (req, res, next) {
    return res
        .clearCookie("access_token")
        .status(200)
        .json({ message: "Successfully logged out" });
}

module.exports.updateUser = function (req, res, next) {
    const id = req.params.id;

    const userTable = sequelize.define("usersModel", {},
        {tableName: "users"});

    userTable.update(
        {customers: {deleted: '1'}},
        {
            where: {id: id},
            returning: true, // needed for affectedRows to be populated
            plain: true
        })
        .then(customers => {

            console.log(customers, "res");
            res.send(JSON.stringify(customers, null, 2));
        })
        .catch(next => console.log(next, "err"));

}

module.exports.deleteUser = function (req, res, next) {
    console.log(req);
    const idData = req.params.id;
    let deleted = "";

    const userTable = sequelize.define("usersModel", {deleted},
        {tableName: "users"});

    userTable.update(
        {
            deleted: '1',
        },
        {
            where: {
                id: idData
            },
        })
        .then(customers => {

            console.log(JSON.stringify(customers, null, 2), "res");
            res.send(JSON.stringify(customers, null, 2));
        })
        .catch(next => console.log(next, "err"));
}

module.exports.addCalendarRecord = function (req, res, next) {


    const loggedUser = sequelize.define("user_loggedModel",
        {},
        {tableName: "user_logged"});

    loggedUser.findAll({attributes: ['id', 'userId', 'token']})
        .then(logged => {
            let [firstElement] = logged;
            let currentToken = firstElement.dataValues.token;
            let tokenId = firstElement.dataValues.id;

            // const payload = jwt.verify(currentToken,`${myKey}`)?jwt.verify(currentToken,`${myKey}`):false;
            jwt.verify(currentToken, `${myKey}`, (err, user) => {
                if (err) {
                    loggedUser.destroy(
                        {
                            where: {id: tokenId},
                            force: true
                        },
                    );
                }

                if (user) {
                    const payload = jwt.verify(currentToken, `${myKey}`);
                    const userId = payload.id;
                    let currentDate = new Date();
                    let date = currentDate.toISOString().substring(0, 10);
                    let hour = "9";
                    const userCalendarTable = sequelize.define("users_calendarModel", {userId, date, hour},
                        {tableName: "user_calendar"});
                    userCalendarTable.create({userId, date, hour});
                }
            })

            // console.log(payload.exp);
        })
        .catch(err => console.log(err));

}

module.exports.addNewCalendarRecord = function (req, res, next) {

    let date = req.body.currentDateInput;
    let userId = req.body.userId;
    let carId = req.body.carId;
    let licensePlate = req.body.license;
    let email = req.body.userEmail;
    let hour = parseInt(req.body.time).toString();

    const userCalendarTable = sequelize.define("users_calendarModel", {userId, date, hour, carId, licensePlate, email},
        {tableName: "user_calendar"});
    userCalendarTable.create({userId, date, hour, carId, licensePlate, email})
        .then(data => res.send("ok"))
        .catch()
}

module.exports.addNewCalendarRecordGuest = function (req, res, next) {

    let date = req.body.currentDateInput;
    let licensePlate = req.body.license;
    let email = req.body.email;
    let hour = parseInt(req.body.time).toString();

    const userCalendarTable = sequelize.define("users_calendarModel", {licensePlate, date, hour, email},
        {tableName: "user_calendar"});
    userCalendarTable.create({licensePlate, date, hour, email})
        .then(data => res.send("ok"))
        .catch()

}

module.exports.authorization = function (req, res, next) {

    const token = req.cookies.access_token;
    if (!token) {
        return res.sendStatus(403);
    }
    try {
        const data = jwt.verify(token, `${myKey}`);
        req.userId = data.id;
        req.type = data.type;
        // return next();
        res.send(data);
    } catch {
        return res.sendStatus(403);
    }
}

// module.exports.calendarGetHoursTaken = function (req, res, next) {
//
//     // const date = new Date(`${req.body}`);
//     const dateInUse = new Date(req.params.date);
//     const date = dateInUse.toISOString().split('T')[0];
//     const hour = 0;
//     let responseArray = [];
//
//     const calendarTable = sequelize.define("user_calendarModel", {
//             date,
//             hour
//         },
//         {tableName: "user_calendar"});
//
//     calendarTable.findAll({
//         attributes: ['date','hour'],
//         where: {date : date},
//         returning: true
//     })
//         .then(data=>{
//             // for (const dataKey in data) {
//             //     console.log(dataKey.dataValues.hour);
//             //     res.send(dataKey.dataValues.hour);
//             // }
//
//             for (let i = 0; i < data.length; i++) {
//                 responseArray.push(data[i].dataValues.hour);
//             }
// console.log(responseArray);
//             res.send(responseArray);
//             // res.send("AAAAAAAA");
//                 // console.log(data[0].dataValues.hour);
//             // res.send(JSON.stringify(responseArray, null, 2));
//             // return responseArray;
//         })
//         .catch(err=> res.send(err));
//
//
// }

module.exports.calendarGetHoursTaken = function (req, res, next) {

    const dateInUse = new Date(req.body.currentDateInput);
    const date = dateInUse.toISOString().split('T')[0];
    const hour = 0;
    let responseArray = [];

    const calendarTable = sequelize.define("user_calendarModel", {
            date,
            hour
        },
        {tableName: "user_calendar"});

    calendarTable.findAll({
        attributes: ['date', 'hour'],
        where: {date: date},
        returning: true
    })
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                responseArray.push(data[i].dataValues.hour);
            }
            res.send(responseArray);
        })
        .catch(err => res.send(err));


}

module.exports.getCarLicensePlate = function (req, res, next) {

    let carId = req.body.carId;
    let licensePlate = "";

    const carTable = sequelize.define("user_carModel", {
            licensePlate,
        },
        {tableName: "user_cars"});

    carTable.findOne({
        attributes: ['id', 'licensePlate'],
        where: {id: carId},
        returning: true
    })
        .then(carPlate => {
            let result = carPlate.dataValues.licensePlate;
            res.send(JSON.stringify(result, null, 2));
        })
        .catch(err => res.send(err));
}

module.exports.getCalendarItems = function (req, res, next) {

    const {QueryTypes} = require('sequelize');
    const records = sequelize.query("select Users.id, Users.name, Users.email, Users.phone, " +
        "Cal.date, Cal.licensePlate, " +
        "Cal.hour, Cal.email, Hotel.size, Hotel.season, Hotel.tires_number from user_calendar as Cal " +
        "left join users as Users " +
        "on Cal.userId = Users.id " +
        "left join user_hotel as Hotel " +
        "on Cal.userId = Hotel.userId "
        ,
        {
            type: QueryTypes.SELECT
        }).then(result => {


        res.send(JSON.stringify(result, null, 2));
    }).catch(next => console.log(next));
}

