const { sq } = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const coa3 = require("./model");
const { QueryTypes } = require('sequelize');
const s = { type: QueryTypes.SELECT };


class Controller {

    static register(req, res) {
        const { nama_coa3, kode_coa3, coa2_id } = req.body

        coa3.findAll({ where: { nama_coa3, kode_coa3 } }).then(async data => {
            if (data.length) {
                res.status(201).json({ status: 204, message: "data sudah ada" });
            } else {
                await coa3.create({ id: uuid_v4(), nama_coa3, kode_coa3, coa2_id }).then(data2 => {
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
        const { id, nama_coa3, kode_coa3, coa2_id } = req.body

        coa3.update({ nama_coa3, kode_coa3, coa2_id }, { where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static delete(req, res) {
        const { id } = req.body

        coa3.destroy({ where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static async list(req, res) {
        try {
            let data = await sq.query(`select c.id as "coa3_id", * from coa3 c join coa2 c2 on c2.id = c.coa2_id where c2."deletedAt" isnull and c."deletedAt" isnull order by c.kode_coa3`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async detailsById(req, res) {
        const { id } = req.params

        try {
            let data = await sq.query(`select c.id as "coa3_id", * from coa3 c join coa2 c2 on c2.id = c.coa2_id where c2."deletedAt" isnull and c."deletedAt" isnull and c.id = '${id}'`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listCoa3ByKodeCoa2(req, res) {
        const { kode_coa2 } = req.body

        try {
            let data = await sq.query(`select c.id as "coa3_id", * from coa3 c join coa2 c2 on c2.id = c.coa2_id where c2."deletedAt" isnull and c."deletedAt" isnull and c2.kode_coa2 = '${kode_coa2}' order by c.kode_coa3`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }
}
module.exports = Controller;