const { sq } = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const order = require("./model");
const { QueryTypes } = require('sequelize');
const s = { type: QueryTypes.SELECT };


class Controller {

    static register(req, res) {
        let { jumlah, harga, satuan, alamat_order, keterangan, no_va, kode_invoice, tgl_order, tgl_expire, persediaan_id, tipe_pembayaran_id, status_order_id, jenis_penjualann_id, status_va_id, customer_id, company_id } = req.body

        if(!company_id){
            company_id = req.dataUsers.company_id 
        }
        
        order.create({ id: uuid_v4(), jumlah, harga, satuan, alamat_order, keterangan, no_va, kode_invoice, tgl_order, tgl_expire, persediaan_id, tipe_pembayaran_id, status_order_id, jenis_penjualann_id, status_va_id, customer_id, company_id }).then(data => {
            res.status(200).json({ status: 200, message: "sukses", data });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static async registerBulk(req, res) {
        let {bulkRegister,pajak,biaya_admin,total,company_id} = req.body

        try {
            if(!company_id){
                company_id = req.dataUsers.company_id 
            }
            for (let i = 0; i < bulkRegister.length; i++) {
                bulkRegister[i].id = uuid_v4();
                bulkRegister[i].company_id = company_id;
            }

            let data = await order.bulkCreate(bulkRegister);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static update(req, res) {
        const { id, jumlah, harga, satuan, alamat_order, keterangan, no_va, kode_invoice, tgl_order, tgl_expire, persediaan_id, tipe_pembayaran_id, status_order_id, jenis_penjualann_id, status_va_id, customer_id, company_id } = req.body

        order.update({ jumlah, harga, satuan, alamat_order, keterangan, no_va, kode_invoice, tgl_order, tgl_expire, persediaan_id, tipe_pembayaran_id, status_order_id, jenis_penjualann_id, status_va_id, customer_id, company_id }, { where: { id } }).then(data => {
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
            let data = await sq.query(`select o.id as "order_id", * from "order" o join persediaan p on p.id = o.persediaan_id join status_order so on so.id = o.status_order_id join jenis_penjualan jp on jp.id = o.jenis_penjualan_id join status_va sv on sv.id = o.status_va_id join tipe_pembayaran tp on tp.id = o.tipe_pembayaran_id join users u on u.id = o.customer_id where o."deletedAt" isnull order by o."createdAt" desc`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listOrderByStatusOrderId(req, res) {
        const { status_order_id } = req.body
        try {
            let data = await sq.query(`select o.id as "order_id", * from "order" o join persediaan p on p.id = o.persediaan_id join status_order so on so.id = o.status_order_id join jenis_penjualan jp on jp.id = o.jenis_penjualan_id join status_va sv on sv.id = o.status_va_id join tipe_pembayaran tp on tp.id = o.tipe_pembayaran_id join users u on u.id = o.customer_id where o."deletedAt" isnull and o.status_order_id = '${status_order_id}' order by o."createdAt" desc`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listOrderByJenisPembelianId(req, res) {
        const { jenis_penjualan_id } = req.body
        try {
            let data = await sq.query(`select o.id as "order_id", * from "order" o join persediaan p on p.id = o.persediaan_id join status_order so on so.id = o.status_order_id join jenis_penjualan jp on jp.id = o.jenis_penjualan_id join status_va sv on sv.id = o.status_va_id join tipe_pembayaran tp on tp.id = o.tipe_pembayaran_id join users u on u.id = o.customer_id where o."deletedAt" isnull and o.jenis_penjualan_id = '${jenis_penjualan_id}' order by o."createdAt" desc`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async detailsById(req, res) {
        const { id } = req.params

        try {
            let data = await sq.query(`select o.id as "order_id", * from "order" o join persediaan p on p.id = o.persediaan_id join status_order so on so.id = o.status_order_id join jenis_penjualan jp on jp.id = o.jenis_penjualan_id join status_va sv on sv.id = o.status_va_id join tipe_pembayaran tp on tp.id = o.tipe_pembayaran_id join users u on u.id = o.customer_id where o."deletedAt" isnull and o.id = '${id}'`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }
}
module.exports = Controller;