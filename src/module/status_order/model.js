const { DataTypes } = require('sequelize');
const {sq} = require('../../config/connection');

const statusOrder = sq.define('status_order', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    nama_status_order: {
        type: DataTypes.STRING
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });
    
module.exports = statusOrder