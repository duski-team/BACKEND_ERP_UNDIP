const { sq } = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const masterVendor = require("./model");
const { QueryTypes, Op } = require('sequelize');
const s = { type: QueryTypes.SELECT };


class Controller {

    static register(req, res) {
        const { nama_vendor, alamat_vendor, no_hp_vendor, company_id } = req.body

        masterVendor.findAll({ where: { nama_vendor } }).then(data => {
            if (data.length) {
                res.status(201).json({ status: 204, message: "data sudah ada" });
            } else {
                masterVendor.create({ id: uuid_v4(), nama_vendor, alamat_vendor, no_hp_vendor, company_id }).then(data2 => {
                    res.status(200).json({ status: 200, message: "sukses", data: data2 });
                })
            }
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static update(req, res) {
        const { id, nama_vendor, alamat_vendor, no_hp_vendor, company_id } = req.body

        masterVendor.update({ nama_vendor, alamat_vendor, no_hp_vendor, company_id }, { where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static delete(req, res) {
        const { id } = req.body

        masterVendor.destroy({ where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static async list(req, res) {
        try {
            let data = await sq.query(`select mv.id as "master_vendor_id", * from master_vendor mv join company_usaha cu on cu.id = mv.company_id where cu."deletedAt" isnull and mv."deletedAt" isnull order by mv."createdAt" desc`, s)

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async detailsById(req, res) {
        const { id } = req.params
        try {
            let data = await sq.query(`select mv.id as "master_vendor_id", * from master_vendor mv join company_usaha cu on cu.id = mv.company_id where cu."deletedAt" isnull and mv."deletedAt" isnull and mv.id = '${id}'`, s)

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }
}

module.exports = Controller;