const { DataTypes } = require('sequelize');
const { sq } = require('../../config/connection');
const coa6 = require('../coa6/model');
const kategori = require('../kategori/model');
const subKategori = require('../sub_kategori/model');
const subSubKategori = require('../sub_sub_kategori/model');
const companyUsaha = require('../company_usaha/model');
const masterSatuan = require('../master_satuan/model');

const persediaan = sq.define('persediaan', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    nama_persediaan: {
        type: DataTypes.STRING
    },
    kode_persediaan: {
        type: DataTypes.STRING
    },
    harga_jual: {
        type: DataTypes.DOUBLE
    },
    stock: {
        type: DataTypes.INTEGER
    },
    gambar: {
        type: DataTypes.STRING
    },
    stock_rusak: {
        type: DataTypes.INTEGER
    },
    harga_satuan: {
        type: DataTypes.DOUBLE
    },
    tanggal_saldo_awal: {
        type: DataTypes.DATE
    },
    kondisi: {
        type: DataTypes.STRING
    },
    keterangan: {
        type: DataTypes.STRING
    },
    status_persediaan: {
        type: DataTypes.SMALLINT ,
        defaultValue: 0  // 0: Tidak tampil || 1: Tampil
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });

persediaan.belongsTo(coa6, { foreignKey: 'coa6_id' })
coa6.hasMany(persediaan, { foreignKey: 'coa6_id' })

persediaan.belongsTo(kategori, { foreignKey: 'kategori_id' })
kategori.hasMany(persediaan, { foreignKey: 'kategori_id' })

persediaan.belongsTo(subKategori, { foreignKey: 'sub_kategori_id' })
subKategori.hasMany(persediaan, { foreignKey: 'sub_kategori_id' })

persediaan.belongsTo(subSubKategori, { foreignKey: 'sub_sub_kategori_id' })
subSubKategori.hasMany(persediaan, { foreignKey: 'sub_sub_kategori_id' })

persediaan.belongsTo(companyUsaha, { foreignKey: 'company_id' })
companyUsaha.hasMany(persediaan, { foreignKey: 'company_id' })

persediaan.belongsTo(masterSatuan, { foreignKey: 'master_satuan_id' })
masterSatuan.hasMany(persediaan, { foreignKey: 'master_satuan_id' })

module.exports = persediaan