const { sq } = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const barangOrder = require("./model");
const { QueryTypes } = require('sequelize');
const s = { type: QueryTypes.SELECT };


class Controller {

    static register(req, res) {
        const { harga_total, jumlah, persediaan_id, order_id } = req.body

        barangOrder.create({ id: uuid_v4(), harga_total, jumlah, persediaan_id, order_id }).then(data2 => {
            res.status(200).json({ status: 200, message: "sukses",data: data2 });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static update(req, res) {
        const { id, harga_total, jumlah, persediaan_id, order_id } = req.body

        barangOrder.update({ harga_total, jumlah, persediaan_id, order_id }, { where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static delete(req, res) {
        const { id } = req.body

        barangOrder.destroy({ where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static list(req, res) {
        barangOrder.findAll({order:[['createdAt','DESC']]}).then(data => {
            res.status(200).json({ status: 200, message: "sukses", data });
        }).catch(err => {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static detailsById(req, res) {
        const { id } = req.params

        barangOrder.findAll({ where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses", data });
        }).catch(err => {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }
}
module.exports = Controller;