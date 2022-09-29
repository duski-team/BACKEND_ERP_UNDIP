const { DataTypes } = require('sequelize');
const {sq} = require('../../config/connection');

const layanan = sq.define('layanan', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    nama_layanan: {
        type: DataTypes.STRING
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });

module.exports = layanan