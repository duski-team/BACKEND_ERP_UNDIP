const { DataTypes } = require('sequelize');
const {sq} = require('../../config/connection');
const produk = require('../produk/model');
const jenisAssetPembelian = require('../m_jenis_aset/model');

const pembelian = sq.define('pembelian', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    status_persetujuan_trxp: {
        type: DataTypes.INTEGER
    },
    persetujuan_manajer_trxp: {
        type: DataTypes.INTEGER
    },
    tgl_persetujuan_manajer_trxp: {
        type: DataTypes.DATE
    },
    jumlah_trxp: {
        type: DataTypes.INTEGER
    },
    satuan_trxp: {
        type: DataTypes.INTEGER
    },
    harga_satuan_trxp: {
        type: DataTypes.INTEGER
    },
    harga_total_trxp: {
        type: DataTypes.INTEGER
    },
    persetujuan_akuntan_trxp: {
        type: DataTypes.INTEGER
    },
    tgl_persetujuan_akuntan_trxp: {
        type: DataTypes.DATE
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });
    
    pembelian.belongsTo(produk,{foreignKey:'produk_id'})
    produk.hasMany(pembelian,{foreignKey:'produk_id'})

    pembelian.belongsTo(jenisAssetPembelian,{foreignKey:'jenis_asset_pembelian_id'})
    jenisAssetPembelian.hasMany(pembelian,{foreignKey:'jenis_asset_pembelian_id'})

module.exports = pembelian