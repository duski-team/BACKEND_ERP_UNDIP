const { sq } = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const subKategori = require("./model");
const { QueryTypes } = require('sequelize');
const s = { type: QueryTypes.SELECT };


class Controller {

    static register(req, res) {
        const { nama_sub_kategori,kategori_id } = req.body

        subKategori.findAll({ where: { nama_sub_kategori,kategori_id } }).then(data => {
            if (data.length) {
                res.status(201).json({ status: 204, message: "data sudah ada" });
            } else {
                subKategori.create({ id: uuid_v4(), nama_sub_kategori,kategori_id }).then(data2 => {
                    res.status(200).json({ status: 200, message: "sukses",data: data2 });
                })
            }
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static update(req, res) {
        const { id, nama_sub_kategori,kategori_id } = req.body

        subKategori.update({nama_sub_kategori,kategori_id}, { where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static delete(req, res) {
        const { id } = req.body

        subKategori.destroy({ where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static async list(req, res) {
       try {
            let data = await sq.query(`select *,sk.id as sub_kategori_id from sub_kategori sk join kategori k on k.id = sk.kategori_id where sk.deletedAt is NULL order by sk.createdAt desc`,s);

            res.status(200).json({ status: 200, message: "sukses",data });
       } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
       }
    }

    static async listSubKategoriByKategoriId(req, res) {
        const {kategori_id} =req.body
       try {
            let data = await sq.query(`select *,sk.id as sub_kategori_id from sub_kategori sk join kategori k on k.id = sk.kategori_id where sk.deletedAt is NULL and sk.kategori_id='${kategori_id}' order by sk.createdAt desc`,s);

            res.status(200).json({ status: 200, message: "sukses",data });
       } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
       }
    }

    static async detailsById(req, res) {
        const { id } = req.params

         try {
            let data = await sq.query(`select *,sk.id as sub_kategori_id from sub_kategori sk join kategori k on k.id = sk.kategori_id where sk.deletedAt is NULL and sk.id = '${id}'`,s);
            
            res.status(200).json({ status: 200, message: "sukses",data });
       } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
       }
    }
}
module.exports = Controller;