const { DataTypes } = require('sequelize');
const {sq} = require('../../config/connection');

const tipePembayaran = sq.define('tipe_pembayaran', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    nama_tipe_pembayaran: {
        type: DataTypes.STRING
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });
    
module.exports = tipePembayaran