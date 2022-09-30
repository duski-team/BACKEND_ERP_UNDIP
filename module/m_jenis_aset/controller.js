const { sq } = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const mJenisAset = require("./model");
const { QueryTypes } = require('sequelize');
const s = { type: QueryTypes.SELECT };


class Controller {

    static register(req, res) {
        const { nama_jenis_aset } = req.body

        mJenisAset.findAll({ where: { nama_jenis_aset } }).then(data => {
            if (data.length) {
                res.status(201).json({ status: 204, message: "data sudah ada" });
            } else {
                mJenisAset.create({ id: uuid_v4(), nama_jenis_aset }).then(data2 => {
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
        const { id, nama_jenis_aset } = req.body

        mJenisAset.update({ nama_jenis_aset }, { where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static delete(req, res) {
        const { id } = req.body

        mJenisAset.destroy({ where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static list(req, res) {
        mJenisAset.findAll({order:[['createdAt','DESC']]}).then(data => {
            res.status(200).json({ status: 200, message: "sukses", data });
        }).catch(err => {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static detailsById(req, res) {
        const { id } = req.params

        mJenisAset.findAll({ where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses", data });
        }).catch(err => {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }
}
module.exports = Controller;