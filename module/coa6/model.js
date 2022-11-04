const { DataTypes } = require('sequelize');
const { sq } = require('../../config/connection');
const coa5 = require('../coa5/model');

const coa6 = sq.define('coa6', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    nama_coa6: {
        type: DataTypes.STRING
    },
    kode_coa6: {
        type: DataTypes.STRING
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });

coa6.belongsTo(coa5, { foreignKey: 'coa5_id' });
coa5.hasMany(coa6, { foreignKey: 'coa5_id' });

module.exports = coa6