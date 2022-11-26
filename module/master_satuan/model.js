const { DataTypes } = require('sequelize');
const {sq} = require('../../config/connection');

const masterSatuan = sq.define('master_satuan', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    nama_master_satuan: {
        type: DataTypes.STRING
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });
    
module.exports = masterSatuan