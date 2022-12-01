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
        type: DataTypes.FLOAT,
        defaultValue:0
    },
    pengurangan: {
        type: DataTypes.FLOAT,
        defaultValue:0
    },
    keterangan: {
        type: DataTypes.STRING
    },
    referensi_bukti: {
        type: DataTypes.STRING
    },
    sisa_saldo: {
        type: DataTypes.INTEGER,
        defaultValue:0
    },
    status: {
        type: DataTypes.INTEGER,  // 0 || 1
        defaultValue: 0
    },
    tanggal_persetujuan: {
        type: DataTypes.DATE
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