const { DataTypes } = require('sequelize');
const {sq} = require('../../config/connection');
const users = require('../users/model');
const jenisPenggunaan = require('../jenis_penggunaan/model');
const coa6= require('../coa6/model')

const penggunaanAset = sq.define('penggunaan_aset', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    tgl_persetujuan_manager: {
        type: DataTypes.DATE
    },
    status_persetujuan_manager: {
        type: DataTypes.INTEGER
    },
    status_barang: {
        type: DataTypes.INTEGER
    },
    tgl_diserahkan: {
        type: DataTypes.DATE
    },
    tgl_mulai_penggunaan: {
        type: DataTypes.DATE
    },
    tgl_selesai_penggunaan: {
        type: DataTypes.DATE
    },
    verifikasi_barang_diterima: {
        type: DataTypes.INTEGER
    },
    // jenis_aset_id: {
    //     type: DataTypes.STRING
    // }
},
    {
        paranoid: true,
        freezeTableName: true
    });
    
    penggunaanAset.belongsTo(users,{foreignKey:'users_id'})
    users.hasMany(penggunaanAset,{foreignKey:'users_id'})

    penggunaanAset.belongsTo(jenisPenggunaan,{foreignKey:'jenis_penggunaan_id'})
    jenisPenggunaan.hasMany(penggunaanAset,{foreignKey:'jenis_penggunaan_id'})

    penggunaanAset.belongsTo(coa6,{foreignKey:'coa6_id'})
    coa6.hasMany(penggunaanAset,{foreignKey:'coa6_id'})

module.exports = penggunaanAset