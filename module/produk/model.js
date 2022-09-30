const { DataTypes } = require('sequelize');
const {sq} = require('../../config/connection');
const subAkunSaldoawal = require('../subakun_saldo_awal/model');
const kategori = require('../kategori/model');
const subKategori = require('../sub_kategori/model');
const subSubKategori = require('../sub_sub_kategori/model');

const produk = sq.define('produk', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    nama_produk: {
        type: DataTypes.STRING
    },
    kode_produk: {
        type: DataTypes.STRING
    },
    satuan_produk: {
        type: DataTypes.STRING
    },
    harga_jual: {
        type: DataTypes.STRING
    },
    stock: {
        type: DataTypes.STRING
    },
    gambar: {
        type: DataTypes.JSON
    },
    spesifikasi: {
        type: DataTypes.JSON
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });
    
    produk.belongsTo(subAkunSaldoawal,{foreignKey:'subakun_saldo_awal_id'})
    subAkunSaldoawal.hasMany(produk,{foreignKey:'subakun_saldo_awal_id'})

    produk.belongsTo(kategori,{foreignKey:'kategori_id'})
    kategori.hasMany(produk,{foreignKey:'kategori_id'})

    produk.belongsTo(subKategori,{foreignKey:'sub_kategori_id'})
    subKategori.hasMany(produk,{foreignKey:'sub_kategori_id'})

    produk.belongsTo(subSubKategori,{foreignKey:'sub_sub_kategori_id'})
    subSubKategori.hasMany(produk,{foreignKey:'sub_sub_kategori_id'})

module.exports = produk