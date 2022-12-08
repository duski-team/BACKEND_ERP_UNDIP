const { DataTypes } = require('sequelize');
const {sq} = require('../../config/connection');

const kompetensi = sq.define('kompetensi', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    nama_kompetensi: {
        type: DataTypes.STRING
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });
    
module.exports = kompetensi