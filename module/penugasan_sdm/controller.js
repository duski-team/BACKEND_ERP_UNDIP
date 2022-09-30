const { sq } = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const penugasanSdm = require("./model");
const { QueryTypes } = require('sequelize');
const s = { type: QueryTypes.SELECT };


class Controller {

    static register(req, res) {
        const { tanggal_tugas, status_penugasan, total_kerja, sdm_id, penugasan_id } = req.body

        penugasanSdm.create({ id: uuid_v4(), tanggal_tugas, status_penugasan, total_kerja, sdm_id, penugasan_id }).then(data => {
            res.status(200).json({ status: 200, message: "sukses",data });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static update(req, res) {
        const { id, tanggal_tugas, status_penugasan, total_kerja, sdm_id, penugasan_id } = req.body

        penugasanSdm.update({ tanggal_tugas, status_penugasan, total_kerja, sdm_id, penugasan_id }, { where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static delete(req, res) {
        const { id } = req.body

        penugasanSdm.destroy({ where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static async list(req, res) {
        try {
            let data = await sq.query(`SELECT p.id as penugasan_id, * FROM penugasan p join sdm s on s.id = p.sdm_id WHERE p.deletedAt is null and s.deletedAt is null ORDER BY p.createdAt DESC`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async detailsById(req, res) {
        const { id } = req.params

        try {
            let data = await sq.query(`SELECT p.id as penugasan_id, * FROM penugasan p join sdm s on s.id = p.sdm_id WHERE p.deletedAt is null and s.deletedAt is null and p.id = '${id}'`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }
}
module.exports = Controller;