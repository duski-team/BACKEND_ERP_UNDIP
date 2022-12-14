const { DataTypes } = require('sequelize');
const { sq } = require('../../config/connection');
const jenisUser = require('../jenis_user/model');
const companyUsaha = require('../company_usaha/model');
// const tugas = require('../tugas_DELETE/model');
const pendidikan = require('../pendidikan/model');
const jenisKerja = require('../jenis_kerja/model');
const kompetensi = require('../kompetensi/model');

const users = sq.define('users', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING
    },
    username: {
        type: DataTypes.STRING
    },
    firstname: {
        type: DataTypes.STRING
    },
    lastname: {
        type: DataTypes.STRING
    },
    phone_no: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    register_token: {
        type: DataTypes.STRING
    },
    resetpassword_token: {
        type: DataTypes.STRING
    },
    variant: {
        type: DataTypes.STRING
    },
    priority: {
        type: DataTypes.STRING
    },
    profil_image: {
        type: DataTypes.STRING
    },
    status_users: {
        type: DataTypes.SMALLINT,
        defaultValue: 1  // 0 : Ditolak || 1 : Default || 2 : Accept
    },
    nik: {
        type: DataTypes.STRING
    },
    alamat_users: {
        type: DataTypes.STRING
    },
    waktu_masuk: {
        type: DataTypes.TIME
    },
    waktu_keluar: {
        type: DataTypes.TIME
    },
    tanggal_masuk: {
        type: DataTypes.DATE
    },
    tanggal_keluar: {
        type: DataTypes.DATE
    },
    jenis_penugasan: {
        type: DataTypes.STRING
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });

users.belongsTo(jenisUser, { foreignKey: 'jenis_user_id' })
jenisUser.hasMany(users, { foreignKey: 'jenis_user_id' })

users.belongsTo(companyUsaha, { foreignKey: 'company_id' })
companyUsaha.hasMany(users, { foreignKey: 'company_id' })

// users.belongsTo(tugas, { foreignKey: 'tugas_id' })
// tugas.hasMany(users, { foreignKey: 'tugas_id' })

users.belongsTo(pendidikan, { foreignKey: 'pendidikan_id' })
pendidikan.hasMany(users, { foreignKey: 'pendidikan_id' })

users.belongsTo(jenisKerja, { foreignKey: 'jenis_kerja_id' })
jenisKerja.hasMany(users, { foreignKey: 'jenis_kerja_id' })

users.belongsTo(kompetensi, { foreignKey: 'kompetensi_id' })
kompetensi.hasMany(users, { foreignKey: 'kompetensi_id' })

module.exports = users