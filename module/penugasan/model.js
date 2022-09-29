const { DataTypes } = require('sequelize');
const { sq } = require('../../config/connection');
const sdm = require('../sdm/model');

const penugasan = sq.define('penugasan', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    uraian_penugasan: {
        type: DataTypes.STRING
    },
    tanggal_penugasan: {
        type: DataTypes.DATE
    },
    instruksi: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.STRING
    },
},
    {
        paranoid: true,
        freezeTableName: true
    });

penugasan.belongsTo(sdm, { foreignKey: 'sdm_id' })
sdm.hasMany(penugasan, { foreignKey: 'sdm_id' })

module.exports = penugasan