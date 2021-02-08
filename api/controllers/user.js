const userAction = require("./userActions");

module.exports.createUser = function (req,res,next){
    const {date, time, email} = req.body;
    try{
    userAction.insert({date, time, email}).then(customer=>{
        res.status(201).send(customer);
    }).catch(next);

    }catch (err){
        res.send("this email already exists.")
    }
}

module.exports.updateUser = function (req,res,next){
    const id = req.params.id;
    const {date, time, email} = req.body;
    userAction.update(id,{date, time, email}).then(customer=>{
        res.send(customer);
    }).catch(next);
}

module.exports.getUsers = function (req,res,next){
    userAction.getAll().then(customers =>{
        res.send(customers);
    }).catch(next);
}

module.exports.getUser = function (req,res,next){
    const id = req.params.id;
    userAction.getOne(id).then(customer=>{
        res.send(customer)
    }).catch(next);
}

module.exports.getUserByEmail = function (req,res,next){
    const email = req.params.email;
    userAction.getOneByEmail(email).then(customer=>{
        res.send(customer)
    }).catch(next);
}

module.exports.deleteUser = function (req,res,next){
    const id = req.params.id;
    userAction.delete(id).then(customer=>{
        res.send(customer)
    }).catch(next);
}