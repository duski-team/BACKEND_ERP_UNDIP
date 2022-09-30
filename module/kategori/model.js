const { DataTypes } = require('sequelize');
const { sq } = require('../../config/connection');

const kategori = sq.define('kategori', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    nama_kategori: {
        type: DataTypes.STRING
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });

module.exports = kategori