const { DataTypes } = require('sequelize');
const { sq } = require('../../config/connection');
const kategori = require('../kategori/model');

const subKategori = sq.define('sub_kategori', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    nama_sub_kategori: {
        type: DataTypes.STRING
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });

    subKategori.belongsTo(kategori,{foreignKey:'kategori_id'})
    kategori.hasMany(subKategori,{foreignKey:'kategori_id'})

module.exports = subKategori