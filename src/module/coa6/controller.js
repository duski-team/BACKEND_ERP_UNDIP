const { sq } = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const coa6 = require("./model");
const { QueryTypes } = require('sequelize');
const s = { type: QueryTypes.SELECT };


class Controller {

    static register(req, res) {
        const { nama_coa6, kode_coa6, coa5_id, nominal_coa6, deskripsi } = req.body

        coa6.findAll({ where: { nama_coa6, kode_coa6 } }).then(async data => {
            if (data.length) {
                res.status(201).json({ status: 204, message: "data sudah ada" });
            } else {
                await coa6.create({ id: uuid_v4(), nama_coa6, kode_coa6, coa5_id, nominal_coa6, deskripsi }).then(data2 => {
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
        const { id, nama_coa6, kode_coa6, coa5_id, nominal_coa6, deskripsi } = req.body

        coa6.update({ nama_coa6, kode_coa6, coa5_id, nominal_coa6, deskripsi, deskripsi }, { where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static delete(req, res) {
        const { id } = req.body

        coa6.destroy({ where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static async list(req, res) {
        try {
            let data = await sq.query(`select c.id as "coa6_id", * from coa6 c join coa5 c2 on c2.id = c.coa5_id where c."deletedAt" isnull and c2."deletedAt" isnull and c2.company_id = '${req.dataUsers.company_id}' order by c.kode_coa6`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async detailsById(req, res) {
        const { id } = req.params

        try {
            let data = await sq.query(`select c.id as "coa6_id", * from coa6 c join coa5 c2 on c2.id = c.coa5_id where c."deletedAt" isnull and c2."deletedAt" isnull and c.id = '${id}'`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listCoa6ByKodeCoa5(req, res) {
        const { kode_coa5 } = req.body

        try {
            let data = await sq.query(`select c.id as "coa6_id", * from coa6 c join coa5 c2 on c2.id = c.coa5_id where c."deletedAt" isnull and c2."deletedAt" isnull and c2.company_id = '${req.dataUsers.company_id}' and c2.kode_coa5 = '${kode_coa5}' order by c.kode_coa6`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listCoa6ByCoa5IdCompanyId(req, res) {
        const { coa5_id, company_id } = req.body

        try {
            let data = await sq.query(`select c.id as "coa6_id", * from coa6 c join coa5 c2 on c2.id = c.coa5_id where c."deletedAt" isnull and c2."deletedAt" isnull and c.coa5_id = '${coa5_id}' and c2.company_id = '${company_id}' order by c.kode_coa6`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listPersediaanBarangJual(req, res) {
        try {
            //coa6 by coa 4
            let data = await sq.query(`select * from coa6 c where c."deletedAt" isnull and c.coa5_id in (select c2.id from coa5 c2 join coa4 c3 on c3.id = c2.coa4_id where c2."deletedAt" isnull and c3.kode_coa4 = '1.1.4.1' and c2.company_id= '${req.dataUsers.company_id}') order by c.kode_coa6`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listPersediaanBarangHabisPakai(req, res) {
        try {
            //coa6 by coa 4
            let data = await sq.query(`select * from coa6 c where c."deletedAt" isnull and c.coa5_id in (select c2.id from coa5 c2 join coa4 c3 on c3.id = c2.coa4_id where c2."deletedAt" isnull and c3.kode_coa4 = '1.1.4.2' and c2.company_id= '${req.dataUsers.company_id}') order by c.kode_coa6`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listCoa6ByKodeCoa1(req, res) {
        const { kode_coa1 } = req.body;
        try {
            let data = await sq.query(`select c.id as coa6_id,c.*,c2.company_id,c6.kode_coa1 from coa6 c join coa5 c2 on c2.id = c.coa5_id join coa4 c3 on c3.id = c2.coa4_id join coa3 c4 on c4.id = c3.coa3_id join coa2 c5 on c5.id = c4.coa2_id join coa1 c6 on c6.id = c5.coa1_id where c."deletedAt" isnull and c2.company_id = '${req.dataUsers.company_id}' and c6.kode_coa1 = '${kode_coa1}'`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }
}
module.exports = Controller;