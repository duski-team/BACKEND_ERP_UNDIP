const { sq } = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const sdm = require("./model");
const { QueryTypes } = require('sequelize');
const s = { type: QueryTypes.SELECT };


class Controller {

    static register(req, res) {
        const { nama_sdm, nik, alamat, telp, waktu_masuk, waktu_keluar, tanggal_masuk, tanggal_keluar, jenis_penugasan, tugas_id, status_sdm_id, pendidikan_id, jenis_kerja_id, kompetensi_id } = req.body

        sdm.findAll({ where: { nama_usaha } }).then(data => {
            if (data.length) {
                res.status(200).json({ status: 204, message: "data sudah ada" });
            } else {
                sdm.create({ id: uuid_v4(), nama_sdm, nik, alamat, telp, waktu_masuk, waktu_keluar, tanggal_masuk, tanggal_keluar, jenis_penugasan, tugas_id, status_sdm_id, pendidikan_id, jenis_kerja_id, kompetensi_id }).then(data2 => {
                    res.status(200).json({ status: 200, message: "sukses" });
                })
            }
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static update(req, res) {
        const { id, nama_sdm, nik, alamat, telp, waktu_masuk, waktu_keluar, tanggal_masuk, tanggal_keluar, jenis_penugasan, tugas_id, status_sdm_id, pendidikan_id, jenis_kerja_id, kompetensi_id } = req.body

        sdm.update({ nama_sdm, nik, alamat, telp, waktu_masuk, waktu_keluar, tanggal_masuk, tanggal_keluar, jenis_penugasan, tugas_id, status_sdm_id, pendidikan_id, jenis_kerja_id, kompetensi_id }, { where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static delete(req, res) {
        const { id } = req.body

        sdm.destroy({ where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static list(req, res) {
        sdm.findAll({order:[['createdAt','DESC']]}).then(data => {
            res.status(200).json({ status: 200, message: "sukses", data });
        }).catch(err => {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static detailsById(req, res) {
        const { id } = req.params

        sdm.findAll({ where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses", data });
        }).catch(err => {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }
}
module.exports = Controller;