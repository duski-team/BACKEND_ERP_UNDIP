const { DataTypes } = require('sequelize');
const { sq } = require('../../config/connection');

const jenisKerja = sq.define('jenis_kerja', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    nama_jenis_kerja: {
        type: DataTypes.STRING
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });

module.exports = jenisKerja