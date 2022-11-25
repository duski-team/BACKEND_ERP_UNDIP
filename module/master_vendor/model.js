const { DataTypes } = require('sequelize');
const { sq } = require('../../config/connection');

const masterVendor = sq.define('master_vendor', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    nama_vendor: {
        type: DataTypes.STRING
    },
    alamat_vendor: {
        type: DataTypes.STRING
    },
    no_hp_vendor: {
        type: DataTypes.STRING
    },
},
    {
        paranoid: true,
        freezeTableName: true
    });

module.exports = masterVendor