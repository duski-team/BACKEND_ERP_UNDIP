const { sq } = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const generalLedger = require("./model");
const { QueryTypes } = require('sequelize');
const s = { type: QueryTypes.SELECT };


class Controller {

    static register(req, res) {
        const { tanggal_transaksi, penambahan, pengurangan, keterangan, referensi_bukti, sisa_saldo, pembelian_id, penjualan_id, akun_id, akun_pasangan_id,tanggal_persetujuan } = req.body

        generalLedger.create({ id: uuid_v4(), tanggal_transaksi, penambahan, pengurangan, keterangan, referensi_bukti, sisa_saldo, pembelian_id, penjualan_id, akun_id, akun_pasangan_id,tanggal_persetujuan }).then(data => {
            res.status(200).json({ status: 200, message: "sukses", data });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static update(req, res) {
        const { id, tanggal_transaksi, penambahan, pengurangan, keterangan, referensi_bukti, sisa_saldo, pembelian_id, penjualan_id, akun_id, akun_pasangan_id,tanggal_persetujuan } = req.body

        generalLedger.update({ tanggal_transaksi, penambahan, pengurangan, keterangan, referensi_bukti, sisa_saldo, pembelian_id, penjualan_id, akun_id, akun_pasangan_id,tanggal_persetujuan }, { where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static delete(req, res) {
        const { id } = req.body

        generalLedger.destroy({ where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static async list(req, res) {
        try {
            let data = await sq.query(`select gl.id as "general_ledger_id", * from general_ledger gl join "order" o on o.id = gl.penjualan_id join pembelian p on p.id = gl.pembelian_id join coa6 c on c.id = gl.akun_id and c.id = gl.akun_pasangan_id where gl."deletedAt" isnull order by gl."createdAt" desc`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async detailsById(req, res) {
        const { id } = req.params

        try {
            let data = await sq.query(`select gl.id as "general_ledger_id", * from general_ledger gl join "order" o on o.id = gl.penjualan_id join pembelian p on p.id = gl.pembelian_id join coa6 c on c.id = gl.akun_id and c.id = gl.akun_pasangan_id where gl."deletedAt" isnull and gl.id = '${id}'`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }
}
module.exports = Controller;