const { DataTypes } = require('sequelize');
const {sq} = require('../../config/connection');
const trxPembelian = require('../trx_pembelian/model');
// const penugasanSdm = require('../penugasan_sdm/model');
const jenisPengeluaranKas = require('../jenis_pengeluaran_kas/model');

const trxPengeluaranKas = sq.define('trx_pengeluaran_kas', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    persetujuan_manajer_txpk: {
        type: DataTypes.INTEGER
    },
    tgl_persetujuan_manajer_txpk: {
        type: DataTypes.DATE
    },
    persetujuan_kasir_txpk: {
        type: DataTypes.INTEGER
    },
    tgl_persetujuan_kasir_txpk: {
        type: DataTypes.DATE
    },
    status_bayar_txpk: {
        type: DataTypes.INTEGER
    },
    persetujuan_akuntan_txpk: {
        type: DataTypes.INTEGER
    },
    tgl_persetujuan_akuntan_txpk: {
        type: DataTypes.DATE
    },
    status_persetujuan_txpk: {
        type: DataTypes.INTEGER
    },
},
    {
        paranoid: true,
        freezeTableName: true
    });
    
    // trxPengeluaranKas.belongsTo(penugasanSdm,{foreignKey:'penugasan_sdm_id'})
    // penugasanSdm.hasMany(trxPengeluaranKas,{foreignKey:'penugasan_sdm_id'})

    trxPengeluaranKas.belongsTo(trxPembelian,{foreignKey:'trx_pembelian_id'})
    trxPembelian.hasMany(trxPengeluaranKas,{foreignKey:'trx_pembelian_id'})
    
    trxPengeluaranKas.belongsTo(jenisPengeluaranKas,{foreignKey:'jenis_pengeluaran_kas_id'})
    jenisPengeluaranKas.hasMany(trxPengeluaranKas,{foreignKey:'jenis_pengeluaran_kas_id'})

module.exports = trxPengeluaranKas