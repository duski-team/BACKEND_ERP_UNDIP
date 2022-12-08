const { DataTypes } = require('sequelize');
const { sq } = require('../../config/connection');
const persediaan = require('../persediaan/model');
const jenisAssetPembelian = require('../m_jenis_aset/model');
const masterVendor = require('../master_vendor/model');
const companyUsaha = require('../company_usaha/model');
const coa6 = require('../coa6/model');

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
        type: DataTypes.SMALLINT,
        defaultValue: 0         // 0: default || 1: lunas
    },
},
    {
        paranoid: true,
        freezeTableName: true
    });

pembelian.belongsTo(persediaan, { foreignKey: 'persediaan_id' })
persediaan.hasMany(pembelian, { foreignKey: 'persediaan_id' })

pembelian.belongsTo(jenisAssetPembelian, { foreignKey: 'jenis_asset_pembelian_id' })
jenisAssetPembelian.hasMany(pembelian, { foreignKey: 'jenis_asset_pembelian_id' })

pembelian.belongsTo(masterVendor, { foreignKey: 'vendor_id' })
masterVendor.hasMany(pembelian, { foreignKey: 'vendor_id' })

pembelian.belongsTo(companyUsaha, { foreignKey: 'company_id' })
companyUsaha.hasMany(pembelian, { foreignKey: 'company_id' })

pembelian.belongsTo(coa6, { foreignKey: 'coa6_id' })
coa6.hasMany(pembelian, { foreignKey: 'coa6_id' })

module.exports = pembelian