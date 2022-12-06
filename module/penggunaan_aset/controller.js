const { sq } = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const penggunaanAset = require("./model");
const { QueryTypes } = require('sequelize');
const s = { type: QueryTypes.SELECT };


class Controller {

    static register(req, res) {
        const { tgl_persetujuan_manager, status_persetujuan_manager, status_barang, tgl_diserahkan, tgl_mulai_penggunaan, tgl_selesai_penggunaan, verifikasi_barang_diterima, users_id, jenis_penggunaan_id, coa6_id, jumlah_penggunaa_asset } = req.body

        penggunaanAset.create({ id: uuid_v4(), tgl_persetujuan_manager, status_persetujuan_manager, status_barang, tgl_diserahkan, tgl_mulai_penggunaan, tgl_selesai_penggunaan, verifikasi_barang_diterima, users_id, jenis_penggunaan_id, coa6_id, jumlah_penggunaa_asset }).then(data => {
            res.status(200).json({ status: 200, message: "sukses", data });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static update(req, res) {
        const { id, tgl_persetujuan_manager, status_persetujuan_manager, status_barang, tgl_diserahkan, tgl_mulai_penggunaan, tgl_selesai_penggunaan, verifikasi_barang_diterima, users_id, jenis_penggunaan_id, coa6_id, jumlah_penggunaa_asset } = req.body

        penggunaanAset.update({ tgl_persetujuan_manager, status_persetujuan_manager, status_barang, tgl_diserahkan, tgl_mulai_penggunaan, tgl_selesai_penggunaan, verifikasi_barang_diterima, users_id, jenis_penggunaan_id, coa6_id, jumlah_penggunaa_asset }, { where: { id } }).then(data => {
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
            let data = await sq.query(`select pa.id as penggunaan_asset_id,pa.*,u.firstname,u.lastname,u.username,u.email,jp.nama_jenis_penggunaan,mja.nama_jenis_aset,c.nama_coa6,c.kode_coa6,c.coa5_id,c.nominal_coa6 
            from penggunaan_aset pa
            join users u on u.id = pa.users_id 
            join jenis_penggunaan jp on jp.id = pa.jenis_penggunaan_id 
            join coa6 c on c.id = pa.coa6_id 
            join m_jenis_aset mja on mja.id = pa.jenis_aset_id 
            where pa."deletedAt" isnull order by c.kode_coa6`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listPenggunaanAsetByUserId(req, res) {
        const { users_id } = req.body
        try {
            let data = await sq.query(`select pa.id as penggunaan_asset_id,pa.*,u.firstname,u.lastname,u.username,u.email,jp.nama_jenis_penggunaan,mja.nama_jenis_aset,c.nama_coa6,c.kode_coa6,c.coa5_id,c.nominal_coa6 
            from penggunaan_aset pa
            join users u on u.id = pa.users_id 
            join jenis_penggunaan jp on jp.id = pa.jenis_penggunaan_id 
            join coa6 c on c.id = pa.coa6_id 
            join m_jenis_aset mja on mja.id = pa.jenis_aset_id 
            where pa."deletedAt" isnull and pa.users_id = '${users_id}' order by c.kode_coa6`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listPenggunaanAsetByJenisPenggunaanId(req, res) {
        const { jenis_penggunaan_id } = req.body

        try {
            let data = await sq.query(`select pa.id as penggunaan_asset_id,pa.*,u.firstname,u.lastname,u.username,u.email,jp.nama_jenis_penggunaan,mja.nama_jenis_aset,c.nama_coa6,c.kode_coa6,c.coa5_id,c.nominal_coa6 
            from penggunaan_aset pa
            join users u on u.id = pa.users_id 
            join jenis_penggunaan jp on jp.id = pa.jenis_penggunaan_id 
            join coa6 c on c.id = pa.coa6_id 
            join m_jenis_aset mja on mja.id = pa.jenis_aset_id 
            where pa."deletedAt" isnull and pa.jenis_penggunaan_id = '${jenis_penggunaan_id}' order by c.kode_coa6`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listPenggunaanAsetByCoa6Id(req, res) {
        const { coa6_id } = req.body

        try {
            let data = await sq.query(`select pa.id as penggunaan_asset_id,pa.*,u.firstname,u.lastname,u.username,u.email,jp.nama_jenis_penggunaan,mja.nama_jenis_aset,c.nama_coa6,c.kode_coa6,c.coa5_id,c.nominal_coa6 
            from penggunaan_aset pa
            join users u on u.id = pa.users_id 
            join jenis_penggunaan jp on jp.id = pa.jenis_penggunaan_id 
            join coa6 c on c.id = pa.coa6_id 
            join m_jenis_aset mja on mja.id = pa.jenis_aset_id 
            where pa."deletedAt" isnull and pa.coa6_id = '${coa6_id}' order by c.kode_coa6`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listPenggunaanAsetByCompanyId(req, res) {
        let { company_id } = req.body

        try {
            if (!company_id) {
                company_id = req.dataUsers.company_id
            }
            let data = await sq.query(`select pa.id as penggunaan_asset_id, pa.*, u.firstname, u.lastname, u.username, u.email, jp.nama_jenis_penggunaan ,c.nama_coa6, c.kode_coa6, c.coa5_id, c.nominal_coa6 
            from penggunaan_aset pa
            join users u on u.id = pa.users_id 
            join jenis_penggunaan jp on jp.id = pa.jenis_penggunaan_id 
            join coa6 c on c.id = pa.coa6_id 
            where pa."deletedAt" isnull and u.company_id = '${company_id}'`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async detailsById(req, res) {
        const { id } = req.params

        try {
            let data = await sq.query(`select pa.id as penggunaan_asset_id,pa.*,u.firstname,u.lastname,u.username,u.email,jp.nama_jenis_penggunaan,mja.nama_jenis_aset,c.nama_coa6,c.kode_coa6,c.coa5_id,c.nominal_coa6 
            from penggunaan_aset pa
            join users u on u.id = pa.users_id 
            join jenis_penggunaan jp on jp.id = pa.jenis_penggunaan_id 
            join coa6 c on c.id = pa.coa6_id 
            join m_jenis_aset mja on mja.id = pa.jenis_aset_id 
            where pa."deletedAt" isnull and pa.id = '${id}'`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }
}
module.exports = Controller;