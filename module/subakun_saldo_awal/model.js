const { DataTypes } = require('sequelize');
const { sq } = require('../../config/connection');
const akunSaldoAwal = require('../akun_saldo_awal/model');

const subAkunsaldoAwal = sq.define('subakun_saldo_awal', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    nama_barang_akun: {
        type: DataTypes.STRING
    },
    harga_satuan: {
        type: DataTypes.DOUBLE
    },
    tanggal_saldo_awal: {
        type: DataTypes.DATE
    },
    jumlah: {
        type: DataTypes.INTEGER
    },
    satuan: {
        type: DataTypes.STRING
    },
    kondisi: {
        type: DataTypes.STRING
    },
    keterangan: {
        type: DataTypes.STRING
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });

    subAkunsaldoAwal.belongsTo(akunSaldoAwal,{foreignKey:'akun_saldo_awal_id'})
    akunSaldoAwal.hasMany(subAkunsaldoAwal,{foreignKey:'akun_saldo_awal_id'})

module.exports = subAkunsaldoAwal