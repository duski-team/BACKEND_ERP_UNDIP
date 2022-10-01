const { DataTypes } = require('sequelize');
const { sq } = require('../../config/connection');

const jenisPengeluaranKas = sq.define('jenis_pengeluaran_kas', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    nama_jenis_pengeluaran_kas: {
        type: DataTypes.STRING
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });

module.exports = jenisPengeluaranKas