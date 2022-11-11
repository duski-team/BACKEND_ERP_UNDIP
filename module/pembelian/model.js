const { DataTypes } = require('sequelize');
const {sq} = require('../../config/connection');
const produk = require('../persediaan/model');
const jenisAssetPembelian = require('../m_jenis_aset/model');

const pembelian = sq.define('pembelian', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    jumlah_pembelian: {
        type: DataTypes.INTEGER
    },
    tanggal_pembelian: {
        type: DataTypes.DATE
    },
    status_pembelian: {
        type: DataTypes.INTEGER
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