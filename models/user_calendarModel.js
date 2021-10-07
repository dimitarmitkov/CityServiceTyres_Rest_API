const {Sequelize, DataTypes} = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const Logged = sequelize.define('userLogged', {
    // Model attributes are defined here
    userId:{
        type: DataTypes.INTEGER(11),
        allowNull: true
    },
    carId:{
        type: DataTypes.INTEGER(11),
        allowNull: true
    },
    license_plate:{
        type: DataTypes.STRING,
        allowNull: true
    },
    email:{
        type: DataTypes.STRING,
        allowNull: true
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    hour: {
        type: DataTypes.ENUM('9','10','11','12','13','14','15','16','17'),
        allowNull: false
    }
}, {
    // Other model options go here
});