const { sq } = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const pembelian = require("./model");
const { QueryTypes } = require('sequelize');
const s = { type: QueryTypes.SELECT };


class Controller {

    static register(req, res) {
        const { status_persetujuan_trxp,persetujuan_manajer_trxp,tgl_persetujuan_manajer_trxp,jumlah_trxp,satuan_trxp,harga_satuan_trxp,harga_total_trxp,persetujuan_akuntan_trxp,tgl_persetujuan_akuntan_trxp} = req.body

        pembelian.create({ id: uuid_v4(), status_persetujuan_trxp,persetujuan_manajer_trxp,tgl_persetujuan_manajer_trxp,jumlah_trxp,satuan_trxp,harga_satuan_trxp,harga_total_trxp,persetujuan_akuntan_trxp,tgl_persetujuan_akuntan_trxp }).then(data => {
            res.status(200).json({ status: 200, message: "sukses",data });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static update(req, res) {
        const { id, status_persetujuan_trxp,persetujuan_manajer_trxp,tgl_persetujuan_manajer_trxp,jumlah_trxp,satuan_trxp,harga_satuan_trxp,harga_total_trxp,persetujuan_akuntan_trxp,tgl_persetujuan_akuntan_trxp } = req.body

        pembelian.update({ status_persetujuan_trxp,persetujuan_manajer_trxp,tgl_persetujuan_manajer_trxp,jumlah_trxp,satuan_trxp,harga_satuan_trxp,harga_total_trxp,persetujuan_akuntan_trxp,tgl_persetujuan_akuntan_trxp }, { where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static delete(req, res) {
        const { id } = req.body

        pembelian.destroy({ where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static async list(req, res) {
        try {
            let data = await sq.query(`select p.id as pembelian_id, p2.*,mja.*
            from pembelian p join produk p2 on p2.id = p.produk_id join m_jenis_aset mja on p.jenis_asset_pembelian_id where p.deletedAt is NULL order by p.createdAt desc`,s);

            res.status(200).json({ status: 200, message: "sukses",data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listPembelianByProdukId(req, res) {
        const {produk_id} = req.body
        try {
            let data = await sq.query(`select p.id as pembelian_id, p2.*,mja.*
            from pembelian p join produk p2 on p2.id = p.produk_id join m_jenis_aset mja on p.jenis_asset_pembelian_id where p.deletedAt is NULL and p.produk_id ='${produk_id}' order by p.createdAt desc`,s);

            res.status(200).json({ status: 200, message: "sukses",data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listPembelianByJenisAsetPembelianId(req, res) {
        const {jenis_asset_pembelian_id} = req.body
        try {
            let data = await sq.query(`select p.id as pembelian_id, p2.*,mja.*
            from pembelian p join produk p2 on p2.id = p.produk_id join m_jenis_aset mja on p.jenis_asset_pembelian_id where p.deletedAt is NULL and p.jenis_asset_pembelian_id = '${jenis_asset_pembelian_id}' order by p.createdAt desc`,s);

            res.status(200).json({ status: 200, message: "sukses",data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async detailsById(req, res) {
        const { id } = req.params

        try {
            let data = await sq.query(`select p.id as pembelian_id, p2.*,mja.*
            from pembelian p join produk p2 on p2.id = p.produk_id join m_jenis_aset mja on p.jenis_asset_pembelian_id where p.deletedAt is NULL and p.id = '${id}'`,s);

            res.status(200).json({ status: 200, message: "sukses",data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }
}
module.exports = Controller;