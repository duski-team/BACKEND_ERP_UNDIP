const { DataTypes } = require('sequelize');
const { sq } = require('../../config/connection');
const produk = require('../produk/model');
const tipePembayaran = require('../tipe_pembayaran/model');
const statusOrder = require('../status_order/model');
const jenisPembelian = require('../jenis_pembelian/model');
const statusVa = require('../status_va/model');

const order = sq.define('order', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    jumlah: {
        type: DataTypes.INTEGER
    },
    harga: {
        type: DataTypes.STRING
    },
    satuan: {
        type: DataTypes.STRING
    },
    alamat_order: {
        type: DataTypes.STRING
    },
    keterangan: {
        type: DataTypes.STRING
    },
    no_va: {
        type: DataTypes.STRING
    },
    kode_invoice: {
        type: DataTypes.STRING
    },
    tgl_order: {
        type: DataTypes.DATE
    },
    tgl_expire: {
        type: DataTypes.DATE
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });

order.belongsTo(produk, { foreignKey: 'produk_id' })
produk.hasMany(order, { foreignKey: 'produk_id' })

order.belongsTo(tipePembayaran, { foreignKey: 'tipe_pembayaran_id' })
tipePembayaran.hasMany(order, { foreignKey: 'tipe_pembayaran_id' })

order.belongsTo(statusOrder, { foreignKey: 'status_order_id' })
statusOrder.hasMany(order, { foreignKey: 'status_order_id' })

order.belongsTo(jenisPembelian, { foreignKey: 'jenis_pembelian_id' })
jenisPembelian.hasMany(order, { foreignKey: 'jenis_pembelian_id' })

order.belongsTo(statusVa, { foreignKey: 'status_va_id' })
statusVa.hasMany(order, { foreignKey: 'status_va_id' })

module.exports = order