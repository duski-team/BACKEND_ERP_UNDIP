const {sq} = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const users = require("./model");
const { QueryTypes } = require('sequelize');
const s = {type:QueryTypes.SELECT};


class Controller {

    static register (req,res){
        const {email,username,firstname,lastname,phone_no,password,register_token,resetpassword_token,variant,priority,profil_image}= req.body
        
        users.findAll({where:{email,username}}).then(data =>{
            if(data.length){
                res.status(200).json({ status: 204, message: "data sudah ada" });
            }else{
                users.create({id:uuid_v4(),email,username,firstname,lastname,phone_no,password,register_token,resetpassword_token,variant,priority,profil_image}).then(data2 =>{
                    res.status(200).json({ status: 200, message: "sukses" });
                })
            }
        }).catch(err =>{
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static update (req,res){
        const {id,email,username,firstname,lastname,phone_no,password,register_token,resetpassword_token,variant,priority,profil_image}= req.body
        
        users.update({email,username,firstname,lastname,phone_no,password,register_token,resetpassword_token,variant,priority,profil_image},{where:{id}}).then(data =>{
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
            let data = await sq.query(`SELECT u.id as user_id,u.*,ju.*,cu.* FROM users u join jenis_user ju on ju.id = u.jenis_user_id join company_usaha cu on cu.id = u.company_id where u.deletedAt IS NULL order by u.createdAt desc`,s);

            res.status(200).json({ status: 200, message: "sukses",data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listUserByCompanyId (req,res){
        const {company_id} = req.body
        try {
            let data = await sq.query(`SELECT u.id as user_id,u.*,ju.*,cu.* FROM users u join jenis_user ju on ju.id = u.jenis_user_id join company_usaha cu on cu.id = u.company_id where u.deletedAt IS NULL and and u.company_id = '${company_id}' order by u.createdAt desc`,s);

            res.status(200).json({ status: 200, message: "sukses",data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listUserByJenisUserId (req,res){
        const {jenis_user_id} = req.body
        try {
            let data = await sq.query(`SELECT u.id as user_id,u.*,ju.*,cu.* FROM users u join jenis_user ju on ju.id = u.jenis_user_id join company_usaha cu on cu.id = u.company_id where u.deletedAt IS NULL and and u.jenis_user_id = '${jenis_user_id}' order by u.createdAt desc`,s);

            res.status(200).json({ status: 200, message: "sukses",data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async detailsById (req,res){
        const {id} = req.params

        try {
            let data = await sq.query(`SELECT u.id as user_id,u.*,ju.*,cu.* FROM users u join jenis_user ju on ju.id = u.jenis_user_id join company_usaha cu on cu.id = u.company_id where u.deletedAt IS NULL and u.id = '${id}'`,s);

            res.status(200).json({ status: 200, message: "sukses",data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }
}
module.exports = Controller;