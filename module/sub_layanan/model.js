const { DataTypes } = require('sequelize');
const {sq} = require('../../config/connection');
const layanan = require('../layanan/model');

const subLayanan = sq.define('sub_layanan', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    nama_sub_layanan: {
        type: DataTypes.STRING
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });

subLayanan.belongsTo(layanan,{foreignKey:'layanan_id'})
layanan.hasMany(subLayanan,{foreignKey:'layanan_id'})

module.exports = subLayanan