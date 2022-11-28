const { DataTypes } = require('sequelize');
const {sq} = require('../../config/connection');

const jenisPenjualan = sq.define('jenis_penjualan', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    nama_jenis_penjualan: {
        type: DataTypes.STRING
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });
    
module.exports = jenisPenjualan