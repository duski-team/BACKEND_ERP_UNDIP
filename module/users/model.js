const { DataTypes } = require('sequelize');
const {sq} = require('../../config/connection');
const jenisUser = require('../jenis_user/model');
const companyUsaha = require('../company_usaha/model');

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
    }
},
    {
        paranoid: true,
        freezeTableName: true
    });
    
    users.belongsTo(jenisUser,{foreignKey:'jenis_user_id'})
    jenisUser.hasMany(users,{foreignKey:'jenis_user_id'})

    users.belongsTo(companyUsaha,{foreignKey:'company_id'})
    companyUsaha.hasMany(users,{foreignKey:'company_id'})

module.exports = users