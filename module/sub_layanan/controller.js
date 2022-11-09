const {sq} = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const layanan = require("./model");
const { QueryTypes } = require('sequelize');
const s = {type:QueryTypes.SELECT};


class Controller {

    static register (req,res){
        const {nama_sub_layanan,layanan_id}= req.body
        
        layanan.findAll({where:{nama_sub_layanan,layanan_id}}).then(data =>{
            if(data.length){
                res.status(201).json({ status: 204, message: "data sudah ada" });
            }else{
                layanan.create({id:uuid_v4(),nama_sub_layanan,layanan_id}).then(data2 =>{
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
        const {id,nama_sub_layanan,layanan_id}= req.body
        
        layanan.update({nama_sub_layanan,layanan_id},{where:{id}}).then(data =>{
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err =>{
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static delete (req,res){
        const {id}= req.body

        layanan.destroy({where:{id}}).then(data =>{
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err =>{
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static async list (req,res){
        try {
            let data = await sq.query(`SELECT *, sl.id as sub_layanan_id from sub_layanan sl join layanan l on l.id = sl.layanan_id WHERE sl."deletedAt" isnull order by sl."createdAt" desc`,s);
            res.status(200).json({ status: 200, message: "sukses",data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listSubLayananByLayananId (req,res){
        const {layanan_id} = req.body
        try {
            let data = await sq.query(`SELECT *, sl.id as sub_layanan_id from sub_layanan sl join layanan l on l.id = sl.layanan_id WHERE sl."deletedAt" isnull and sl.layanan_id = '${layanan_id}' order by sl."createdAt" desc`,s);

            res.status(200).json({ status: 200, message: "sukses",data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async detailsById (req,res){
        const {id} = req.params
        try {
            let data = await sq.query(`SELECT *, sl.id as sub_layanan_id from sub_layanan sl join layanan l on l.id = sl.layanan_id WHERE sl."deletedAt" isnull and sl.id = '${id}'`,s);
            res.status(200).json({ status: 200, message: "sukses",data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }
}
module.exports = Controller;