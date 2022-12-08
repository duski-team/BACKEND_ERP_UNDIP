const { DataTypes } = require('sequelize');
const { sq } = require('../../config/connection');

const mJenisAset = sq.define('m_jenis_aset', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    nama_jenis_aset: {
        type: DataTypes.STRING
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });

module.exports = mJenisAset