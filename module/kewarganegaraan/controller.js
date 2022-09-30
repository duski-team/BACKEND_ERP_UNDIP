const {sq} = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const kewarganegaraan = require("./model");
const { QueryTypes } = require('sequelize');
const s = {type:QueryTypes.SELECT};


class Controller {

    static register (req,res){
        const {nama_kewarganegaraan}= req.body
        
        kewarganegaraan.findAll({where:{nama_kewarganegaraan}}).then(data =>{
            if(data.length){
                res.status(201).json({ status: 204, message: "data sudah ada" });
            }else{
                kewarganegaraan.create({id:uuid_v4(),nama_kewarganegaraan}).then(data2 =>{
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
        const {id,nama_kewarganegaraan}= req.body
        
        kewarganegaraan.update({nama_kewarganegaraan},{where:{id}}).then(data =>{
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err =>{
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static delete (req,res){
        const {id}= req.body

        kewarganegaraan.destroy({where:{id}}).then(data =>{
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err =>{
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static list (req,res){
        kewarganegaraan.findAll({order:[['createdAt','DESC']]}).then(data =>{
            res.status(200).json({ status: 200, message: "sukses",data });
        }).catch(err =>{
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static detailsById (req,res){
        const {id} = req.body

        kewarganegaraan.findAll({where:{id}}).then(data =>{
            res.status(200).json({ status: 200, message: "sukses",data });
        }).catch(err =>{
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }
}
module.exports = Controller;