const { DataTypes } = require('sequelize');
const { sq } = require('../../config/connection');
const pembelian = require('../pembelian/model');
const coa6 = require('../coa6/model');
const order = require('../order/model');
const pegawai = require('../users/model');
const masterVendor = require('../master_vendor/model');
const returBarang = require('../retur_barang/model');
const company = require('../company_usaha/model');

const generalLedger = sq.define('general_ledger', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    tanggal_transaksi: {
        type: DataTypes.DATE
    },
    penambahan: {
        type: DataTypes.DOUBLE,
        defaultValue:0
    },
    pengurangan: {
        type: DataTypes.DOUBLE,
        defaultValue:0
    },
    keterangan: {
        type: DataTypes.STRING
    },
    referensi_bukti: {
        type: DataTypes.STRING
    },
    sisa_saldo: {
        type: DataTypes.DOUBLE,
        defaultValue:0
    },
    tanggal_persetujuan: {
        type: DataTypes.DATE
    },
    nama_transaksi: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.SMALLINT, 
        defaultValue: 1  // 0: ditolak || 1: created || 2: supervisor || 3: manager || 4: akuntan
    },
    // jenis_biaya: {
    //     type: DataTypes.STRING
    // },
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

// generalLedger.belongsTo(coa6, { foreignKey: 'akun_pasangan_id' })
// coa6.hasMany(generalLedger, { foreignKey: 'akun_pasangan_id' })

generalLedger.belongsTo(pegawai, { foreignKey: 'pegawai_id' })
pegawai.hasMany(generalLedger, { foreignKey: 'pegawai_id' })

generalLedger.belongsTo(masterVendor, { foreignKey: 'vendor_id' })
masterVendor.hasMany(generalLedger, { foreignKey: 'vendor_id' })

generalLedger.belongsTo(returBarang, { foreignKey: 'retur_barang_id' })
returBarang.hasMany(generalLedger, { foreignKey: 'retur_barang_id' })

generalLedger.belongsTo(company, { foreignKey: 'company_id' })
company.hasMany(generalLedger, { foreignKey: 'company_id' })

module.exports = generalLedger