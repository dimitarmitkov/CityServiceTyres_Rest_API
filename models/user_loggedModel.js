const {Sequelize, DataTypes} = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const Logged = sequelize.define('userLogged', {
    // Model attributes are defined here
    userId:{
        type: DataTypes.INTEGER(11),
        allowNull: false
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    // Other model options go here
});