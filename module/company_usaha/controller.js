const { sq } = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const companyUsaha = require("./model");
const { QueryTypes, Op } = require('sequelize');
const s = { type: QueryTypes.SELECT };


class Controller {

    static register(req, res) {
        const { nama_usaha, nama_pengelola, ktp_passport, code, Row, email, phone_no, location, header, motive, details } = req.body

        let icon = "";
        let logo_usaha = "";
        if (req.files) {
            if (req.files.file1) {
                icon = req.files.file1[0].filename;
            }
            if (req.files.file2) {
                logo_usaha = req.files.file2[0].filename;
            }
        }

        companyUsaha.findAll({ where: {[Op.or]:[{nama_usaha},{code}]} }).then(data => {
            if (data.length) {
                res.status(201).json({ status: 204, message: "data sudah ada" });
            } else {
                companyUsaha.create({ id: uuid_v4(), nama_usaha, nama_pengelola, ktp_passport, code, Row, email, phone_no, location, header, motive, details, icon, logo_usaha }).then(data2 => {
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
        const { id, nama_usaha, nama_pengelola, ktp_passport, code, Row, email, phone_no, location, header, motive, details } = req.body

        if (req.files) {
            if (req.files.file1) {
                let icon = req.files.file1[0].filename;
                companyUsaha.update({ icon }, { where: { id } });
            }
            if (req.files.file2) {
                let logo_usaha = req.files.file2[0].filename;
                companyUsaha.update({ logo_usaha }, { where: { id } });
            }
        }
        companyUsaha.update({ nama_usaha, nama_pengelola, ktp_passport, code, Row, email, phone_no, location, header, motive, details }, { where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static delete(req, res) {
        const { id } = req.body

        companyUsaha.destroy({ where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static list(req, res) {
        companyUsaha.findAll({order:[['createdAt','DESC']]}).then(data => {
            res.status(200).json({ status: 200, message: "sukses", data });
        }).catch(err => {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static detailsById(req, res) {
        const { id } = req.params

        companyUsaha.findAll({ where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses", data });
        }).catch(err => {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static async cekCompany (req,res){
        const {nama_usaha,code} = req.body
        try {
            let isi = ''
            if(nama_usaha){
                isi += ` and cu.nama_usaha ilike '%${nama_usaha}%' `
            }
            if(code) {
                isi += ` and cu.code ilike '%${code}%' `
            }
            let data = await sq.query(`select * from company_usaha cu where cu."deletedAt" isnull ${isi}`,s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }
}
module.exports = Controller;