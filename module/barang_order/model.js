const { DataTypes } = require('sequelize');
const { sq } = require('../../config/connection');
const order = require('../order/model');
const persediaan = require('../persediaan/model');

const barangOrder = sq.define('barang_order', {
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
        defaultValue: 0
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });

barangOrder.belongsTo(persediaan, { foreignKey: 'produk_id' })
persediaan.hasMany(barangOrder, { foreignKey: 'produk_id' })

barangOrder.belongsTo(order, { foreignKey: 'order_id' })
order.hasMany(barangOrder, { foreignKey: 'order_id' })

module.exports = barangOrder