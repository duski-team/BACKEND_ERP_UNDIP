const { DataTypes } = require('sequelize');
const {sq} = require('../../config/connection');
const pembelian = require('../pembelian/model');
const masterSatuan = require('../master_satuan/model');

const trxPembelian = sq.define('trx_pembelian', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    status_persetujuan_txp: {
        type: DataTypes.INTEGER,
        defaultValue: 1            // 0: ditolak || 1: created || 2: supervisor/manager || 3: kasir || 4: akuntan
    },
    tgl_persetujuan_manajer_txp: {
        type: DataTypes.DATE
    },
    jumlah_txp: {
        type: DataTypes.INTEGER
    },
    harga_satuan_txp: {
        type: DataTypes.DOUBLE
    },
    harga_total_txp: {
        type: DataTypes.DOUBLE
    },
    tgl_persetujuan_akuntan_txp: {
        type: DataTypes.DATE
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });
    
    trxPembelian.belongsTo(pembelian,{foreignKey:'pembelian_id'})
    pembelian.hasMany(trxPembelian,{foreignKey:'pembelian_id'})
    
    trxPembelian.belongsTo(masterSatuan,{foreignKey:'master_satuan_id'})
    masterSatuan.hasMany(trxPembelian,{foreignKey:'master_satuan_id'})

module.exports = trxPembelian