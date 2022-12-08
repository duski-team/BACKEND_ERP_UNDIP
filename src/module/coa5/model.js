const { DataTypes } = require('sequelize');
const { sq } = require('../../config/connection');
const coa4 = require('../coa4/model');
const companyUsaha = require('../company_usaha/model');

const coa5 = sq.define('coa5', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    nama_coa5: {
        type: DataTypes.STRING
    },
    kode_coa5: {
        type: DataTypes.STRING
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });

coa5.belongsTo(coa4, { foreignKey: 'coa4_id' });
coa4.hasMany(coa5, { foreignKey: 'coa4_id' });

coa5.belongsTo(companyUsaha, { foreignKey: 'company_id' })
companyUsaha.hasMany(coa5, { foreignKey: 'company_id' })

module.exports = coa5