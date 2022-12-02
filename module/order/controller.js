const { sq } = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const order = require("./model");
const { QueryTypes } = require('sequelize');
const s = { type: QueryTypes.SELECT };


class Controller {

    static async register(req, res) {
        let { alamat_order, keterangan, no_va, kode_invoice, tgl_order, tgl_expire, tipe_pembayaran_id, status_order_id, jenis_penjualan_id, customer_id, company_id,bulkData, pajak, biaya_admin, total_penjualan,total_harga_barang } = req.body

        const t = await sq.transaction();

        try {
            if (!company_id) {
                company_id = req.dataUsers.company_id
            }

            let order_id = uuid_v4();
            let barang_id =[]

            for (let i = 0; i < bulkData.length; i++) {
                bulkData[i].order_id = order_id
                barang_id.push(`,${bulkData[i].persediaan_id}`);
            }

            let barang = await sq.query(`select * from persediaan p where p."deletedAt" isnull and p.id in ()`)

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async registerBulk(req, res) {
        let { bulkData, pajak, biaya_admin, total_penjualan, company_id } = req.body

        try {
            if (!company_id) {
                company_id = req.dataUsers.company_id
            }
            let persediaan = []

            for (let i = 0; i < bulkData.length; i++) {
                bulkData[i].id = uuid_v4();
                bulkData[i].company_id = company_id;
                persediaan.push(bulkData[i].persediaan_id);
            }

            let data = await order.bulkCreate(bulkData);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static update(req, res) {
        const { id, jumlah, harga, satuan, alamat_order, keterangan, no_va, kode_invoice, tgl_order, tgl_expire, persediaan_id, tipe_pembayaran_id, status_order_id, jenis_penjualan_id, status_va_id, customer_id, company_id } = req.body

        order.update({ jumlah, harga, satuan, alamat_order, keterangan, no_va, kode_invoice, tgl_order, tgl_expire, persediaan_id, tipe_pembayaran_id, status_order_id, jenis_penjualan_id, status_va_id, customer_id, company_id }, { where: { id } }).then(data => {
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
            let data = await sq.query(`select o.id as "order_id", * from "order" o join persediaan p on p.id = o.persediaan_id join status_order so on so.id = o.status_order_id join jenis_penjualan jp on jp.id = o.jenis_penjualan_id join status_va sv on sv.id = o.status_va_id join tipe_pembayaran tp on tp.id = o.tipe_pembayaran_id join users u on u.id = o.customer_id where o."deletedAt" isnull and o.company_id = '${req.dataUsers.company_id}' order by o."createdAt" desc`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listOrderByStatusOrderId(req, res) {
        const { status_order_id } = req.body
        try {
            let data = await sq.query(`select o.id as "order_id", * from "order" o join persediaan p on p.id = o.persediaan_id join status_order so on so.id = o.status_order_id join jenis_penjualan jp on jp.id = o.jenis_penjualan_id join status_va sv on sv.id = o.status_va_id join tipe_pembayaran tp on tp.id = o.tipe_pembayaran_id join users u on u.id = o.customer_id where o."deletedAt" isnull and o.status_order_id = '${status_order_id}' and o.company_id = '${req.dataUsers.company_id}' order by o."createdAt" desc`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listOrderByJenisPembelianId(req, res) {
        const { jenis_penjualan_id } = req.body
        try {
            let data = await sq.query(`select o.id as "order_id", * from "order" o join persediaan p on p.id = o.persediaan_id join status_order so on so.id = o.status_order_id join jenis_penjualan jp on jp.id = o.jenis_penjualan_id join status_va sv on sv.id = o.status_va_id join tipe_pembayaran tp on tp.id = o.tipe_pembayaran_id join users u on u.id = o.customer_id where o."deletedAt" isnull and o.jenis_penjualan_id = '${jenis_penjualan_id}' and o.company_id = '${req.dataUsers.company_id}' order by o."createdAt" desc`, s);

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

    static async listOrderByCompanyId(req, res) {
        let { company_id } = req.body
        try {
            if (!company_id) {
                company_id = req.dataUsers.company_id
            }
            let data = await sq.query(`select o.id as "order_id", * from "order" o left join persediaan p on p.id = o.persediaan_id left join status_order so on so.id = o.status_order_id left join jenis_penjualan jp on jp.id = o.jenis_penjualan_id left join status_va sv on sv.id = o.status_va_id left join tipe_pembayaran tp on tp.id = o.tipe_pembayaran_id left join users u on u.id = o.customer_id where o."deletedAt" isnull and o.company_id = '${company_id}' order by o."createdAt" desc`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listOrderByKodeInvoice(req, res) {
        let { kode_invoice } = req.body
        try {
            let data = await sq.query(`select o.id as "order_id", * from "order" o left join persediaan p on p.id = o.persediaan_id left join status_order so on so.id = o.status_order_id left join jenis_penjualan jp on jp.id = o.jenis_penjualan_id left join status_va sv on sv.id = o.status_va_id left join tipe_pembayaran tp on tp.id = o.tipe_pembayaran_id left join users u on u.id = o.customer_id where o."deletedAt" isnull and o.kode_invoice = '${kode_invoice}' order by o."createdAt" desc`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }
}
module.exports = Controller;