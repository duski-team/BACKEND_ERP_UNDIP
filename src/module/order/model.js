const { DataTypes } = require('sequelize');
const { sq } = require('../../config/connection');
const tipePembayaran = require('../tipe_pembayaran/model');
const jenisPenjualan = require('../jenis_penjualan/model');
const statusVa = require('../status_va/model');
const users = require('../users/model');
const companyUsaha = require('../company_usaha/model');

const order = sq.define('order', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
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
    },
    persen_pajak:{
        type: DataTypes.FLOAT
    },
    total_pajak:{
        type: DataTypes.FLOAT
    },
    biaya_admin:{
        type: DataTypes.DOUBLE
    },
    total_penjualan:{
        type: DataTypes.DOUBLE
    },
    status_order:{
        type: DataTypes.SMALLINT,
        defaultValue : 1       // 0: batal || 1: default || 2: lunas
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });


order.belongsTo(tipePembayaran, { foreignKey: 'tipe_pembayaran_id' })
tipePembayaran.hasMany(order, { foreignKey: 'tipe_pembayaran_id' })

order.belongsTo(jenisPenjualan, { foreignKey: 'jenis_penjualan_id' })
jenisPenjualan.hasMany(order, { foreignKey: 'jenis_penjualan_id' })

order.belongsTo(users, { foreignKey: 'customer_id' })
users.hasMany(order, { foreignKey: 'customer_id' })

order.belongsTo(companyUsaha, { foreignKey: 'company_id' })
companyUsaha.hasMany(order, { foreignKey: 'company_id' })

order.belongsTo(statusVa, { foreignKey: 'status_va_id' })
statusVa.hasMany(order, { foreignKey: 'status_va_id' })

module.exports = order