// const { DataTypes } = require('sequelize');
// const { sq } = require('../../config/connection');
// const sdm = require('../sdm/model');
// const penugasan = require('../penugasan/model');

// const penugasanSdm = sq.define('penugasan_sdm', {
//     id: {
//         type: DataTypes.STRING,
//         primaryKey: true,
//     },
//     tanggal_tugas: {
//         type: DataTypes.DATE
//     },
//     status_penugasan: {
//         type: DataTypes.INTEGER
//     },
//     total_kerja: {
//         type: DataTypes.INTEGER
//     },
// },
//     {
//         paranoid: true,
//         freezeTableName: true
//     });

// penugasanSdm.belongsTo(sdm, { foreignKey: 'sdm_id' })
// sdm.hasMany(penugasanSdm, { foreignKey: 'sdm_id' })

// penugasanSdm.belongsTo(penugasan, { foreignKey: 'penugasan_id' })
// penugasan.hasMany(penugasanSdm, { foreignKey: 'penugasan_id' })

// module.exports = penugasanSdm