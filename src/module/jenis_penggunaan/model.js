const { DataTypes } = require('sequelize');
const {sq} = require('../../config/connection');

const jenisPenggunaan = sq.define('jenis_penggunaan', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    nama_jenis_penggunaan: {
        type: DataTypes.STRING
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });
    
module.exports = jenisPenggunaan