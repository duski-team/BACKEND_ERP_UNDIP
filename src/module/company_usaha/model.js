const { DataTypes } = require('sequelize');
const { sq } = require('../../config/connection');

const companyUsaha = sq.define('company_usaha', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    nama_usaha: {
        type: DataTypes.STRING
    },
    nama_pengelola: {
        type: DataTypes.STRING
    },
    ktp_passport: {
        type: DataTypes.STRING
    },
    icon: {
        type: DataTypes.STRING
    },
    logo_usaha: {
        type: DataTypes.STRING
    },
    code: {
        type: DataTypes.STRING
    },
    Row: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    phone_no: {
        type: DataTypes.STRING
    },
    location: {
        type: DataTypes.STRING
    },
    header: {
        type: DataTypes.STRING
    },
    motive: {
        type: DataTypes.STRING
    },
    details: {
        type: DataTypes.STRING
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });

module.exports = companyUsaha