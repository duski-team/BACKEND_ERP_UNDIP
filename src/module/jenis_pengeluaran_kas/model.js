const { DataTypes } = require('sequelize');
const { sq } = require('../../config/connection');
const company = require('../company_usaha/model');

const jenisPengeluaranKas = sq.define('jenis_pengeluaran_kas', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    nama_jenis_pengeluaran_kas: {
        type: DataTypes.STRING
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });

jenisPengeluaranKas.belongsTo(company, { foreignKey: 'company_id' })
company.hasMany(jenisPengeluaranKas, { foreignKey: 'company_id' })

module.exports = jenisPengeluaranKas