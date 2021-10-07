const {Sequelize, DataTypes} = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const User = sequelize.define('user', {
    // Model attributes are defined here
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    type: {
        type: DataTypes.ENUM('user', 'admin', 'master', 'other'),
        defaultValue: 'user'
    },
    deleted: {
        type: DataTypes.ENUM('0', '1'),
        defaultValue: '0'
    }
}, {
    // Other model options go here
});

module.exports = sequelize.model('user') ;