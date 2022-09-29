const { DataTypes } = require('sequelize');
const { sq } = require('../../config/connection');

const akunsaldoAwal = sq.define('akun_saldo_awal', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    akun_id: {
        type: DataTypes.STRING
    },
    nama_akun_saldo_awal: {
        type: DataTypes.STRING
    },
    saldo_awal: {
        type: DataTypes.STRING
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });

module.exports = akunsaldoAwal