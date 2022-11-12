<<<<<<< HEAD
const { DataTypes } = require('sequelize');
const { sq } = require('../../config/connection');
const tugas = require('../tugas_DELETE/DELETE/model');
const statusSdm = require('../status_sdm/model');
const pendidikan = require('../pendidikan/model');
const jenisKerja = require('../jenis_kerja/model');
const kompetensi = require('../kompetensi/model');
=======
// const { DataTypes } = require('sequelize');
// const { sq } = require('../../config/connection');
// const tugas = require('../tugas/model');
// const statusSdm = require('../status_sdm/model');
// const pendidikan = require('../pendidikan/model');
// const jenisKerja = require('../jenis_kerja/model');
// const kompetensi = require('../kompetensi/model');
>>>>>>> db60cf782501c7d08bb7d1a841a8e022ef19f2bf

// const sdm = sq.define('sdm', {
//     id: {
//         type: DataTypes.STRING,
//         primaryKey: true,
//     },
//     nama_sdm: {
//         type: DataTypes.STRING
//     },
//     nik: {
//         type: DataTypes.STRING
//     },
//     alamat: {
//         type: DataTypes.STRING
//     },
//     telp: {
//         type: DataTypes.STRING
//     },
//     waktu_masuk: {
//         type: DataTypes.TIME
//     },
//     waktu_keluar: {
//         type: DataTypes.TIME
//     },
//     tanggal_masuk: {
//         type: DataTypes.DATE
//     },
//     tanggal_keluar: {
//         type: DataTypes.DATE
//     },
//     jenis_penugasan: {
//         type: DataTypes.STRING
//     }
// },
//     {
//         paranoid: true,
//         freezeTableName: true
//     });

// sdm.belongsTo(tugas, { foreignKey: 'tugas_id' })
// tugas.hasMany(sdm, { foreignKey: 'tugas_id' })

// sdm.belongsTo(statusSdm, { foreignKey: 'status_sdm_id' })
// statusSdm.hasMany(sdm, { foreignKey: 'status_sdm_id' })

// sdm.belongsTo(pendidikan, { foreignKey: 'pendidikan_id' })
// pendidikan.hasMany(sdm, { foreignKey: 'pendidikan_id' })

// sdm.belongsTo(jenisKerja, { foreignKey: 'jenis_kerja_id' })
// jenisKerja.hasMany(sdm, { foreignKey: 'jenis_kerja_id' })

// sdm.belongsTo(kompetensi, { foreignKey: 'kompetensi_id' })
// kompetensi.hasMany(sdm, { foreignKey: 'kompetensi_id' })

// module.exports = sdm