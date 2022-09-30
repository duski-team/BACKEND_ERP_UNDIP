const {sq} = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const jenisPenggunaan = require("./model");
const { QueryTypes } = require('sequelize');
const s = {type:QueryTypes.SELECT};


class Controller {

    static register (req,res){
        const {nama_jenis_penggunaan}= req.body
        
        jenisPenggunaan.findAll({where:{nama_jenis_penggunaan}}).then(data =>{
            if(data.length){
                res.status(201).json({ status: 204, message: "data sudah ada" });
            }else{
                jenisPenggunaan.create({id:uuid_v4(),nama_jenis_penggunaan}).then(data2 =>{
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
        const {id,nama_jenis_penggunaan}= req.body
        
        jenisPenggunaan.update({nama_jenis_penggunaan},{where:{id}}).then(data =>{
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err =>{
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static delete (req,res){
        const {id}= req.body

        jenisPenggunaan.destroy({where:{id}}).then(data =>{
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err =>{
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static list (req,res){
        jenisPenggunaan.findAll({order:[['createdAt','DESC']]}).then(data =>{
            res.status(200).json({ status: 200, message: "sukses",data });
        }).catch(err=>{
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static detailsById (req,res){
        const {id} = req.params

        jenisPenggunaan.findAll({where:{id}}).then(data =>{
            res.status(200).json({ status: 200, message: "sukses",data });
        }).catch(err=>{
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }
}
module.exports = Controller;