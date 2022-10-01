const { sq } = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const order = require("./model");
const { QueryTypes } = require('sequelize');
const s = { type: QueryTypes.SELECT };


class Controller {

    static register(req, res) {
        const { jumlah, harga, satuan, alamat_order, keterangan, no_va, kode_invoice, tgl_order, tgl_expire, produk_id, tipe_pembayaran_id, status_order_id, jenis_pembelian_id, status_va_id } = req.body

        order.create({ id: uuid_v4(), jumlah, harga, satuan, alamat_order, keterangan, no_va, kode_invoice, tgl_order, tgl_expire, produk_id, tipe_pembayaran_id, status_order_id, jenis_pembelian_id, status_va_id }).then(data => {
            res.status(200).json({ status: 200, message: "sukses", data });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static update(req, res) {
        const { id, jumlah, harga, satuan, alamat_order, keterangan, no_va, kode_invoice, tgl_order, tgl_expire, produk_id, tipe_pembayaran_id, status_order_id, jenis_pembelian_id, status_va_id } = req.body

        order.update({ jumlah, harga, satuan, alamat_order, keterangan, no_va, kode_invoice, tgl_order, tgl_expire, produk_id, tipe_pembayaran_id, status_order_id, jenis_pembelian_id, status_va_id }, { where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static delete(req, res) {
        const { id } = req.body

        order.destroy({ where: { id } }).then(data => {
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
            from pembelian p join produk p2 on p2.id = p.produk_id join m_jenis_aset mja on p.jenis_asset_pembelian_id where p.deletedAt is NULL order by p.createdAt desc`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listPembelianByProdukId(req, res) {
        const { produk_id } = req.body
        try {
            let data = await sq.query(`select p.id as pembelian_id, p2.*,mja.*
            from pembelian p join produk p2 on p2.id = p.produk_id join m_jenis_aset mja on p.jenis_asset_pembelian_id where p.deletedAt is NULL and p.produk_id ='${produk_id}' order by p.createdAt desc`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listPembelianByJenisAsetPembelianId(req, res) {
        const { jenis_asset_pembelian_id } = req.body
        try {
            let data = await sq.query(`select p.id as pembelian_id, p2.*,mja.*
            from pembelian p join produk p2 on p2.id = p.produk_id join m_jenis_aset mja on p.jenis_asset_pembelian_id where p.deletedAt is NULL and p.jenis_asset_pembelian_id = '${jenis_asset_pembelian_id}' order by p.createdAt desc`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async detailsById(req, res) {
        const { id } = req.params

        try {
            let data = await sq.query(`select p.id as pembelian_id, p2.*,mja.*
            from pembelian p join produk p2 on p2.id = p.produk_id join m_jenis_aset mja on p.jenis_asset_pembelian_id where p.deletedAt is NULL and p.id = '${id}'`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }
}
module.exports = Controller;