const { DataTypes } = require('sequelize');
const {sq} = require('../../config/connection');

const kewarganegaraan = sq.define('kewarganegaraan', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    nama_kewarganegaraan: {
        type: DataTypes.STRING
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });

module.exports = kewarganegaraan