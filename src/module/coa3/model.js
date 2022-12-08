const { DataTypes } = require('sequelize');
const {sq} = require('../../config/connection');
const coa2 = require('../coa2/model');

const coa3 = sq.define('coa3', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    nama_coa3: {
        type: DataTypes.STRING
    },
    kode_coa3: {
        type: DataTypes.STRING
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });
    
    coa3.belongsTo(coa2,{foreignKey:'coa2_id'});
    coa2.hasMany(coa3,{foreignKey:'coa2_id'});
    
module.exports = coa3