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
            let data = await sq.query(`SELECT ps.id as penugasan_sdm_id, ps.*, s.*, p.uraian_penugasan ,p.tanggal_penugasan ,p.instruksi ,p.status ,p.sdm_id as sdm_id_penugasan FROM penugasan_sdm ps join sdm s on s.id = ps.sdm_id join penugasan p on p.id = ps.penugasan_id WHERE ps.deletedAt is null and s.deletedAt is null and p.deletedAt is null ORDER BY ps.createdAt DESC`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async detailsById(req, res) {
        const { id } = req.params

        try {
            let data = await sq.query(`SELECT ps.id as penugasan_sdm_id, ps.*, s.*, p.uraian_penugasan ,p.tanggal_penugasan ,p.instruksi ,p.status ,p.sdm_id as sdm_id_penugasan FROM penugasan_sdm ps join sdm s on s.id = ps.sdm_id join penugasan p on p.id = ps.penugasan_id WHERE ps.deletedAt is null and s.deletedAt is null and p.deletedAt is null and ps.id = '${id}'`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }
}
module.exports = Controller;