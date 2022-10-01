const { DataTypes } = require('sequelize');
const {sq} = require('../../config/connection');
const pembelian = require('../pembelian/model');

const trxPembelian = sq.define('trx_pembelian', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    status_persetujuan_txp: {
        type: DataTypes.INTEGER
    },
    persetujuan_manajer_txp: {
        type: DataTypes.INTEGER
    },
    tgl_persetujuan_manajer_txp: {
        type: DataTypes.DATE
    },
    jumlah_txp: {
        type: DataTypes.INTEGER
    },
    satuan_txp: {
        type: DataTypes.INTEGER
    },
    harga_satuan_txp: {
        type: DataTypes.INTEGER
    },
    harga_total_txp: {
        type: DataTypes.INTEGER
    },
    persetujuan_akuntan_txp: {
        type: DataTypes.INTEGER
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

module.exports = trxPembelian