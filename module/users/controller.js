require('dotenv').config({})
const {sq} = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const users = require("./model");
const { QueryTypes, Op } = require('sequelize');
const s = {type:QueryTypes.SELECT};
const bcrypt = require('../../helper/bcrypt');
const jwt = require('../../helper/jwt');

async function createSuperUser(){
    let encryptedPassword = bcrypt.hashPassword(process.env.ADMIN);
    await users.findOrCreate({
        where:{username:"erp_admin"},
        defaults:{
            id:"superadmin",
            username:"erp_admin",
            email:"admin@gmail.com",
            password: encryptedPassword
        }
    })
}

createSuperUser()

class Controller {

    static register (req,res){
        const {email,username,firstname,lastname,phone_no,password,register_token,resetpassword_token,variant,priority,jenis_user_id,company_id}= req.body

        let profil_image = "";

        if (req.files) {
            if (req.files.file1) {
                profil_image = req.files.file1[0].filename;
            }
        }
        
        users.findAll({where:{[Op.or]:[{email},{username}]}}).then(async data =>{
            if(data.length){
                res.status(201).json({ status: 204, message: "email/username sudah terdaftar" });
            }else{
                let encryptedPassword = bcrypt.hashPassword(password);
                await users.create({id:uuid_v4(),email,username,firstname,lastname,phone_no,password:encryptedPassword,register_token,resetpassword_token,variant,priority,profil_image,jenis_user_id,company_id}).then(data2 =>{
                    res.status(200).json({ status: 200, message: "sukses",data: data2 });
                })
            }
        }).catch(err =>{
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static update (req,res){
        const {id,email,username,firstname,lastname,phone_no,password,register_token,resetpassword_token,variant,priority,jenis_user_id,company_id}= req.body
        
        if (req.files) {
            if (req.files.file1) {
                let profil_image = req.files.file1[0].filename;
                users.update({profil_image},{where:{id}})
            }
        }

        users.update({email,username,firstname,lastname,phone_no,password,register_token,resetpassword_token,variant,priority,jenis_user_id,company_id},{where:{id}}).then(data =>{
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err =>{
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static delete (req,res){
        const {id}= req.body

        users.destroy({where:{id}}).then(data =>{
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err =>{
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static async list (req,res){
        try {
            let data = await sq.query(`SELECT u.id as user_id, * FROM users u join jenis_user ju on ju.id = u.jenis_user_id join company_usaha cu on cu.id = u.company_id where u."deletedAt" ISNULL order by u."createdAt" desc`,s);

            res.status(200).json({ status: 200, message: "sukses",data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listUserByCompanyId (req,res){
        const {company_id} = req.body
        try {
            let data = await sq.query(`SELECT u.id as user_id, * FROM users u join jenis_user ju on ju.id = u.jenis_user_id join company_usaha cu on cu.id = u.company_id where u."deletedAt" isnull and u.company_id = '${company_id}' order by u."createdAt" desc`,s);

            res.status(200).json({ status: 200, message: "sukses",data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listUserByJenisUserId (req,res){
        const {jenis_user_id} = req.body
        try {
            let data = await sq.query(`SELECT u.id as user_id * FROM users u join jenis_user ju on ju.id = u.jenis_user_id join company_usaha cu on cu.id = u.company_id where u."deletedAt" ISNULL and and u.jenis_user_id = '${jenis_user_id}' order by u."createdAt" desc`,s);

            res.status(200).json({ status: 200, message: "sukses",data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async detailsById (req,res){
        const {id} = req.params

        try {
            let data = await sq.query(`SELECT u.id as user_id, * FROM users u join jenis_user ju on ju.id = u.jenis_user_id join company_usaha cu on cu.id = u.company_id where u."deletedAt" ISNULL and u.id = '${id}'`,s);

            res.status(200).json({ status: 200, message: "sukses",data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static login (req,res){
        const {username,password} = req.body

        users.findAll({where:{username}}).then(data =>{
            if(data.length == 0){
                res.status(200).json({ status: 200, message: "username Tidak Terdaftar" });
            }else{
                let dataToken = {
                    id: data[0].id,
                    password: data[0].password
                };
                let hasil = bcrypt.compare(password, data[0].dataValues.password);
                if(hasil){
                    res.status(200).json({status: 200,message: "sukses",token: jwt.generateToken(dataToken),id: data[0].id});
                }else{
                    res.status(200).json({ status: 200, message: "Password Salah" });
                }
            }
        }).catch(err =>{
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }
}
module.exports = Controller;