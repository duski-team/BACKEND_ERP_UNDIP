const { DataTypes } = require('sequelize');
const { sq } = require('../../config/connection');

const statusSdm = sq.define('status_sdm', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    nama_status_sdm: {
        type: DataTypes.STRING
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });

module.exports = statusSdm