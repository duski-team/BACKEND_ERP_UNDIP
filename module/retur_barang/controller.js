const { sq } = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const returBarang = require("./model");
const { QueryTypes } = require('sequelize');
const s = { type: QueryTypes.SELECT };


class Controller {

    static register(req, res) {
        const { harga_total, jumlah, tanggal_retur, keterangan, status_retur, no_invoice, akun_pajak_id, persentase_pajak, nominal_pajak, persediaan_id, order_id, total_harga_dan_pajak } = req.body
        
        returBarang.create({ id: uuid_v4(), harga_total, jumlah, tanggal_retur, keterangan, status_retur, no_invoice, akun_pajak_id, persentase_pajak, nominal_pajak, persediaan_id, order_id, total_harga_dan_pajak }).then(data => {
            res.status(200).json({ status: 200, message: "sukses", data });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static update(req, res) {
        const { id, harga_total, jumlah, tanggal_retur, keterangan, status_retur, no_invoice, akun_pajak_id, persentase_pajak, nominal_pajak, persediaan_id, order_id, total_harga_dan_pajak } = req.body

        returBarang.update({ harga_total, jumlah, tanggal_retur, keterangan, status_retur, no_invoice, akun_pajak_id, persentase_pajak, nominal_pajak, persediaan_id, order_id, total_harga_dan_pajak }, { where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static delete(req, res) {
        const { id } = req.body

        returBarang.destroy({ where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static async list(req, res) {
        try {
            let data = await sq.query(`select rb.id as "retur_barang_id", * from retur_barang rb join persediaan p on p.id = rb.persediaan_id join "order" o on o.id = rb.order_id where rb."deletedAt" isnull and p."deletedAt" isnull and o."deletedAt" isnull order by rb."createdAt" desc`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async detailsById(req, res) {
        const { id } = req.params

        try {
            let data = await sq.query(`select rb.id as "retur_barang_id", * from retur_barang rb join persediaan p on p.id = rb.persediaan_id join "order" o on o.id = rb.order_id where rb."deletedAt" isnull and p."deletedAt" isnull and o."deletedAt" isnull and rb.id = '${id}'`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }
}
module.exports = Controller;