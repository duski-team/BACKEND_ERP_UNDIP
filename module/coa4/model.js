const { DataTypes } = require('sequelize');
const { sq } = require('../../config/connection');
const coa3 = require('../coa3/model');

const coa4 = sq.define('coa4', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    nama_coa4: {
        type: DataTypes.STRING
    },
    kode_coa4: {
        type: DataTypes.STRING
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });

coa4.belongsTo(coa3, { foreignKey: 'coa3_id' });
coa3.hasMany(coa4, { foreignKey: 'coa3_id' });

module.exports = coa4