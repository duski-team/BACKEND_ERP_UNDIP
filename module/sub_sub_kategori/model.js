const { DataTypes } = require('sequelize');
const { sq } = require('../../config/connection');
const subKategori = require('../sub_kategori/model');

const subSubKategori = sq.define('sub_sub_kategori', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    nama_sub_sub_kategori: {
        type: DataTypes.STRING
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });

    subSubKategori.belongsTo(subKategori,{foreignKey:'sub_kategori_id'})
    subKategori.hasMany(subSubKategori,{foreignKey:'sub_kategori_id'})
    
module.exports = subKategori