const {Sequelize, DataTypes} = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const Car = sequelize.define('User_car', {
    // Model attributes are defined here
    userId:{
        type: DataTypes.INTEGER(11),
        allowNull: false
    },
    CarMake: {
        type: DataTypes.STRING,
        allowNull: false
    },
    carModel: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    licensePlate: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    deleted: {
        type: DataTypes.ENUM('0', '1'),
        defaultValue: '0'
    },
    regDate: {
        type: DataTypes.DATE
    }
}, {
    // Other model options go here
});