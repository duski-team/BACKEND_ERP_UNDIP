const { DataTypes } = require('sequelize');
const { sq } = require('../../config/connection');
const persediaan = require('../persediaan/model');
const order = require('../order/model');

const returBarang = sq.define('retur_barang', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    harga_total: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    jumlah: {
        type: DataTypes.INTEGER,
        defaultValue:0
    },
    tanggal_retur: {
        type: DataTypes.DATE
    },
    keterangan: {
        type: DataTypes.STRING
    },
    no_invoice: {
        type: DataTypes.STRING
    },
    akun_pajak_id: {
        type: DataTypes.STRING
    },
    persentase_pajak: {
        type: DataTypes.INTEGER
    },
    nominal_pajak: {
        type: DataTypes.INTEGER, 
        defaultValue: 0 
    },
    total_harga_dan_pajak: {
        type: DataTypes.DOUBLE, 
        defaultValue: 0 
    },
    status_retur: {
        type: DataTypes.SMALLINT,
        defaultValue : 1
    },
},
    {
        paranoid: true,
        freezeTableName: true
    });

returBarang.belongsTo(persediaan, { foreignKey: 'persediaan_id' })
persediaan.hasMany(returBarang, { foreignKey: 'persediaan_id' })

returBarang.belongsTo(order, { foreignKey: 'order_id' })
order.hasMany(returBarang, { foreignKey: 'order_id' })

module.exports = returBarang