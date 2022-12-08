const { DataTypes } = require('sequelize');
const { sq } = require('../../config/connection');
const company = require('../company_usaha/model');

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

    kategori.belongsTo(company, { foreignKey: 'company_id' });
    company.hasMany(kategori, { foreignKey: 'company_id' });

module.exports = kategori