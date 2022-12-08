const { DataTypes } = require('sequelize');
const {sq} = require('../../config/connection');
const coa1 = require('../coa1/model');

const coa2 = sq.define('coa2', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    nama_coa2: {
        type: DataTypes.STRING
    },
    kode_coa2: {
        type: DataTypes.STRING
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });
    
    coa2.belongsTo(coa1,{foreignKey:'coa1_id'});
    coa1.hasMany(coa2,{foreignKey:'coa1_id'});
    
module.exports = coa2