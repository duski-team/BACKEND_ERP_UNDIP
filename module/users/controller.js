require('dotenv').config({})
const {sq} = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const users = require("./model");
const company = require("../company_usaha/model")
const { QueryTypes, Op, where } = require('sequelize');
const s = {type:QueryTypes.SELECT};
const bcrypt = require('../../helper/bcrypt');
const jwt = require('../../helper/jwt');

async function createSuperUser(){
    let encryptedPassword = bcrypt.hashPassword(process.env.ADMIN);
    await company.findOrCreate({
        where:{id:"UNDIP"},
        defaults:{
            id:"UNDIP",
            nama_usaha: "MASTER",
            nama_pengelola: "UNDIP",
            code: "UNDIP"
        }

    })
    await users.findOrCreate({
        where:{username:"erp_admin"},
        defaults:{
            id:"superadmin",
            username:"erp_admin",
            email:"admin@gmail.com",
            password: encryptedPassword,
            company_id: "UNDIP"
        }
    })
}

createSuperUser()

class Controller {

    static  async register (req,res){
        const {email,username,firstname,lastname,phone_no,password,register_token,resetpassword_token,variant,priority,jenis_user_id,nama_usaha,location,code}= req.body

        const t = await sq.transaction();

        try {
            let cekCompany = await company.findAll({where:{[Op.or]:[{nama_usaha},{code}]}});
            let cekUser = await users.findAll({where:{[Op.or]:[{email},{username}]}});

            if(cekCompany.length>0 || cekUser.length>0){
                res.status(201).json({ status: 204, message: "data sudah ada" });
            }else{
                let profil_image = "";

                if (req.files) {
                    if (req.files.file1) {
                        profil_image = req.files.file1[0].filename;
                    }
                }
                let encryptedPassword = bcrypt.hashPassword(password);
                let perusahan_id = await company.create({id:uuid_v4(),nama_usaha,location,code},{transaction:t})
                let data = await users.create({id:uuid_v4(),email,username,firstname,lastname,phone_no,password:encryptedPassword,register_token,resetpassword_token,variant,priority,profil_image,jenis_user_id,company_id:perusahan_id.id},{transaction:t})
                await t.commit();

                res.status(200).json({ status: 200, message: "sukses",data });
            }
        } catch (err) {
            await t.rollback();
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
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

    static async login (req,res){
        const {username,password,code} = req.body

        try {
            let perusahan_id = await company.findAll({where:{code}})

            if(perusahan_id.length==0){
                res.status(201).json({ status: 204, message: "Perusahaan Code Tidak Terdaftar"});
            }else{
                console.log(perusahan_id[0].id);
                let cekUser = await users.findAll({where:{username,company_id:perusahan_id[0].id}});

                if(cekUser.length == 0){
                    res.status(201).json({ status: 204, message: "User Tidak Terdaftar"});
                }else{
                    let dataToken = {
                        id: cekUser[0].id,
                        email: cekUser[0].email,
                        username: cekUser[0].username,
                        jenis_user_id: cekUser[0].jenis_user_id,
                        company_id: cekUser[0].company_id
                    }
                    let hasil = bcrypt.compare(password, cekUser[0].password);
                    if(hasil){
                        res.status(200).json({status: 200,message: "sukses",token: jwt.generateToken(dataToken),data:dataToken});
                    }else{
                        res.status(201).json({ status: 204, message: "Password Salah" });
                    }
                }
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async cekEmailUsername (req,res){
        const {username,email} = req.body
        try {
            let data = await sq.query(`select * from users u where u."deletedAt" isnull and u.username ilike '%${username}%' or u.email ilike '%${email}%'`,s);

            res.status(200).json({ status: 200, message: "sukses",data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listUserAdminCompany(req,res){
        const {status_users} = req.body
        try {
            let isi =''
            if(status_users){
                isi+=`and u.status_users =${status_users}`
            }
            let data = await sq.query(`select u.id as user_id, * from users u join company_usaha cu on cu.id = u.company_id join jenis_user ju on ju.id = u.jenis_user_id 
            where u."deletedAt" isnull and ju.nama_jenis_user ilike 'admin_company' ${isi}`,s);

            res.status(200).json({ status: 200, message: "sukses",data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }
}
module.exports = Controller;