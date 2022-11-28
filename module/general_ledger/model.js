const { DataTypes } = require('sequelize');
const { sq } = require('../../config/connection');
const pembelian = require('../pembelian/model');
const coa6 = require('../coa6/model');
const order = require('../order/model');

const generalLedger = sq.define('general_ledger', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    tanggal_transaksi: {
        type: DataTypes.DATE
    },
    penambahan: {
        type: DataTypes.FLOAT
    },
    pengurangan: {
        type: DataTypes.FLOAT
    },
    keterangan: {
        type: DataTypes.STRING
    },
    referensi_bukti: {
        type: DataTypes.STRING
    },
    sisa_saldo: {
        type: DataTypes.INTEGER
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });

generalLedger.belongsTo(pembelian, { foreignKey: 'pembelian_id' })
pembelian.hasMany(generalLedger, { foreignKey: 'pembelian_id' })

generalLedger.belongsTo(order, { foreignKey: 'penjualan_id' })
order.hasMany(generalLedger, { foreignKey: 'penjualan_id' })

generalLedger.belongsTo(coa6, { foreignKey: 'akun_id' })
coa6.hasMany(generalLedger, { foreignKey: 'akun_id' })

generalLedger.belongsTo(coa6, { foreignKey: 'akun_pasangan_id' })
coa6.hasMany(generalLedger, { foreignKey: 'akun_pasangan_id' })

module.exports = generalLedger