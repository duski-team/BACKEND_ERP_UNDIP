const { DataTypes } = require('sequelize');
const { sq } = require('../../config/connection');
const companyUsaha = require('../company_usaha/model');

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

masterVendor.belongsTo(companyUsaha, { foreignKey: 'company_id' })
companyUsaha.hasMany(masterVendor, { foreignKey: 'company_id' })

module.exports = masterVendor