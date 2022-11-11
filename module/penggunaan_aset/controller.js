const { sq } = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
// const penggunaanAset = require("./model");
const { QueryTypes } = require('sequelize');
const penggunaanAset = require("./model");
const s = { type: QueryTypes.SELECT };


class Controller {

    static register(req, res) {
        const { tgl_persetujuan_manager,status_persetujuan_manager,status_barang,tgl_diserahkan,tgl_mulai_penggunaan,tgl_selesai_penggunaan,verifikasi_barang_diterima,jenis_aset_id,users_id,jenis_penggunaan_id,coa6_id } = req.body

        // penggunaanAset.findAll({ where: { jenis_aset_id,users_id,jenis_penggunaan_id } }).then(data => {
        //     if (data.length) {
        //         res.status(201).json({ status: 204, message: "data sudah ada" });
        //     } else {
                penggunaanAset.create({ id: uuid_v4(),tgl_persetujuan_manager,status_persetujuan_manager,status_barang,tgl_diserahkan,tgl_mulai_penggunaan,tgl_selesai_penggunaan,verifikasi_barang_diterima,jenis_aset_id,users_id,jenis_penggunaan_id,coa6_id }).then(data2 => {
                    res.status(200).json({ status: 200, message: "sukses",data: data2 });
                })
            // }
        // })
        .catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static update(req, res) {
        const { id,tgl_persetujuan_manager,status_persetujuan_manager,status_barang,tgl_diserahkan,tgl_mulai_penggunaan,tgl_selesai_penggunaan,verifikasi_barang_diterima,jenis_aset_id,users_id,jenis_penggunaan_id,coa6_id } = req.body

        penggunaanAset.update({ tgl_persetujuan_manager,status_persetujuan_manager,status_barang,tgl_diserahkan,tgl_mulai_penggunaan,tgl_selesai_penggunaan,verifikasi_barang_diterima,jenis_aset_id,users_id,jenis_penggunaan_id,coa6_id }, { where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static delete(req, res) {
        const { id } = req.body

        penggunaanAset.destroy({ where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static async list(req, res) {
        try {
            let data = await sq.query(`select pa.id as penggunaan_aset_id, pa.*, u.*, jp.* from penggunaan_aset pa join users u on u.id = pa.users_id join jenis_penggunaan jp on jp.id = pa.jenis_penggunaan_id where pa."deletedAt" isnull order by pa."createdAt" desc`,s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listPenggunaanAsetByUserId(req, res) {
        const {users_id} = req.body
        try {
            let data = await sq.query(`select pa.id as penggunaan_aset_id, pa.*, u.*, jp.* from penggunaan_aset pa join users u on u.id = pa.users_id join jenis_penggunaan jp on jp.id = pa.jenis_penggunaan_id where pa."deletedAt" isnull and pa.users_id = '${users_id}' order by pa."createdAt" desc`,s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }
    
    static async listPenggunaanAsetByJenisPenggunaanId(req, res) {
        const {jenis_penggunaan_id} = req.body
        try {
            let data = await sq.query(`select pa.id as penggunaan_aset_id, pa.*, u.*, jp.* from penggunaan_aset pa join users u on u.id = pa.users_id join jenis_penggunaan jp on jp.id = pa.jenis_penggunaan_id where pa."deletedAt" isnull and pa.jenis_penggunaan_id = '${jenis_penggunaan_id}' order by pa."createdAt" desc`,s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async detailsById(req, res) {
        const { id } = req.params

        try {
            let data = await sq.query(`select pa.id as penggunaan_aset_id, pa.*, u.*, jp.* from penggunaan_aset pa join users u on u.id = pa.users_id join jenis_penggunaan jp on jp.id = pa.jenis_penggunaan_id where pa."deletedAt" isnull and pa.id = '${id}'`,s);
            
            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }
}
module.exports = Controller;