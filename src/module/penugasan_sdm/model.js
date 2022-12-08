const { DataTypes } = require('sequelize');
const { sq } = require('../../config/connection');
const users = require('../users/model');

const penugasanSdm = sq.define('penugasan_sdm', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    nama: {
        type: DataTypes.STRING
    },
    divisi: {
        type: DataTypes.STRING
    },
    jabatan: {
        type: DataTypes.STRING
    },
    tugas: {
        type: DataTypes.STRING
    },
    target_kinerja: {
        type: DataTypes.STRING
    },
    deskripsi_pekerjaan: {
        type: DataTypes.STRING
    },
},
    {
        paranoid: true,
        freezeTableName: true
    });

penugasanSdm.belongsTo(users, { foreignKey: 'users_id' })
users.hasMany(penugasanSdm, { foreignKey: 'users_id' })

module.exports = penugasanSdm