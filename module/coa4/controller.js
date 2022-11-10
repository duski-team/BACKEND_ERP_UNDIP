const { sq } = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const coa4 = require("./model");
const { QueryTypes } = require('sequelize');
const s = { type: QueryTypes.SELECT };


class Controller {

    static register(req, res) {
        const { nama_coa4, kode_coa4, coa3_id } = req.body

        coa4.findAll({ where: { nama_coa4, kode_coa4 } }).then(async data => {
            if (data.length) {
                res.status(201).json({ status: 204, message: "data sudah ada" });
            } else {
                await coa4.create({ id: uuid_v4(), nama_coa4, kode_coa4, coa3_id }).then(data2 => {
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
        const { id, nama_coa4, kode_coa4, coa3_id } = req.body

        coa4.update({ nama_coa4, kode_coa4, coa3_id }, { where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static delete(req, res) {
        const { id } = req.body

        coa4.destroy({ where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static async list(req, res) {
        try {
            let data = await sq.query(`select c.id as "coa4_id", * from coa4 c join coa3 c2 on c2.id = c.coa3_id where c."deletedAt" isnull and c2."deletedAt" isnull order by c."createdAt" asc `, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async detailsById(req, res) {
        const { id } = req.params

        try {
            let data = await sq.query(`select c.id as "coa4_id", * from coa4 c join coa3 c2 on c2.id = c.coa3_id where c."deletedAt" isnull and c2."deletedAt" isnull and c.id = '${id}'`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listCoa4ByCoa3Id(req, res) {
        const { coa3_id } = req.body

        try {
            let data = await sq.query(`select c.id as "coa4_id", * from coa4 c join coa3 c2 on c2.id = c.coa3_id where c."deletedAt" isnull and c2."deletedAt" isnull and c.coa3_id = '${coa3_id}' order by c."createdAt" asc `, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }
}
module.exports = Controller;