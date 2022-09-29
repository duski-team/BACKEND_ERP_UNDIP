const { DataTypes } = require('sequelize');
const {sq} = require('../../config/connection');

const jenisUser = sq.define('jenis_user', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    nama_jenis_user: {
        type: DataTypes.STRING
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });
    
module.exports = jenisUser