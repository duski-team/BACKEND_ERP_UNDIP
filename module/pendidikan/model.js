const { DataTypes } = require('sequelize');
const {sq} = require('../../config/connection');

const pendidikan = sq.define('pendidikan', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    nama_pendidikan: {
        type: DataTypes.STRING
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });
    
module.exports = pendidikan