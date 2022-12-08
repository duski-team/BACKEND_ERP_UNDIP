const { DataTypes } = require('sequelize');
const {sq} = require('../../config/connection');

const coa1 = sq.define('coa1', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    nama_coa1: {
        type: DataTypes.STRING
    },
    kode_coa1: {
        type: DataTypes.STRING
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });
    
module.exports = coa1