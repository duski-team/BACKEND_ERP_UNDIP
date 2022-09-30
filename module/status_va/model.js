const { DataTypes } = require('sequelize');
const { sq } = require('../../config/connection');

const statusVa = sq.define('status_va', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    nama_status_va: {
        type: DataTypes.STRING
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });

module.exports = statusVa