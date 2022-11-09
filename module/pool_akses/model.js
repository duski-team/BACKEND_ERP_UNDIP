const { DataTypes } = require('sequelize');
const { sq } = require('../../config/connection');
const users=require('../users/model')
const master_akses=require('../master_akses/model')

const pool_akses = sq.define('pool_akses', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });

pool_akses.belongsTo(users,{foreignKey:"user_id"})
users.hasMany(pool_akses,{foreignKey:"user_id"})


pool_akses.belongsTo(master_akses,{foreignKey:"master_akses"})
master_akses.hasMany(pool_akses,{foreignKey:"master_akses"})

module.exports = pool_akses