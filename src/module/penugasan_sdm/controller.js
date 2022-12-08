const { sq } = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const penugasanSdm = require("./model");
const { QueryTypes } = require('sequelize');
const s = { type: QueryTypes.SELECT };


class Controller {

    static register(req, res) {
        const { nama, divisi, jabatan, tugas, target_kinerja, deskripsi_pekerjaan, users_id } = req.body

        penugasanSdm.create({ id: uuid_v4(), nama, divisi, jabatan, tugas, target_kinerja, deskripsi_pekerjaan, users_id }).then(data => {
            res.status(200).json({ status: 200, message: "sukses", data });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static update(req, res) {
        const { id, nama, divisi, jabatan, tugas, target_kinerja, deskripsi_pekerjaan, users_id } = req.body

        penugasanSdm.update({ nama, divisi, jabatan, tugas, target_kinerja, deskripsi_pekerjaan, users_id }, { where: { id } }).then(data => {
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
            let data = await sq.query(`select ps.id as "penugasan_sdm_id", * from penugasan_sdm ps join users u on u.id = ps.users_id where ps."deletedAt" isnull order by ps."createdAt" desc`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async detailsById(req, res) {
        const { id } = req.params

        try {
            let data = await sq.query(`select ps.id as "penugasan_sdm_id", * from penugasan_sdm ps join users u on u.id = ps.users_id where ps."deletedAt" isnull and ps.id = '${id}'`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }
}
module.exports = Controller;