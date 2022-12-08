const { DataTypes } = require('sequelize');
const {sq} = require('../../config/connection');
const trxPembelian = require('../trx_pembelian/model');
const company = require('../company_usaha/model');
const jenisPengeluaranKas = require('../jenis_pengeluaran_kas/model');

const trxPengeluaranKas = sq.define('trx_pengeluaran_kas', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    tgl_persetujuan_manajer_txpk: {
        type: DataTypes.DATE
    },
    tgl_persetujuan_kasir_txpk: {
        type: DataTypes.DATE
    },
    status_bayar_txpk: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    tgl_persetujuan_akuntan_txpk: {
        type: DataTypes.DATE
    },
    status_persetujuan_txpk: {
        type: DataTypes.INTEGER,
        defaultValue : 1    // 0: tolak || 1: default || 2: manager/supervisor || 3: kasir || 4: Akuntansi
    },
    nominal_txpk:{
        type: DataTypes.DOUBLE
    },
    no_invoice_txpk:{
        type: DataTypes.STRING
    },
    deskripsi_txpk:{
        type: DataTypes.STRING
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });
    
    trxPengeluaranKas.belongsTo(company,{foreignKey:'company_id'})
    company.hasMany(trxPengeluaranKas,{foreignKey:'company_id'})

    trxPengeluaranKas.belongsTo(trxPembelian,{foreignKey:'trx_pembelian_id'})
    trxPembelian.hasMany(trxPengeluaranKas,{foreignKey:'trx_pembelian_id'})
    
    trxPengeluaranKas.belongsTo(jenisPengeluaranKas,{foreignKey:'jenis_pengeluaran_kas_id'})
    jenisPengeluaranKas.hasMany(trxPengeluaranKas,{foreignKey:'jenis_pengeluaran_kas_id'})

module.exports = trxPengeluaranKas