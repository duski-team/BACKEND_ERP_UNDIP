const { sq } = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const trxPembelian = require("./model");
const { QueryTypes } = require('sequelize');
const s = { type: QueryTypes.SELECT };


class Controller {

    static register(req, res) {
        const { status_persetujuan_txp,persetujuan_manajer_txp,tgl_persetujuan_manajer_txp,jumlah_txp,satuan_txp,harga_satuan_txp,harga_total_txp,persetujuan_akuntan_txp,tgl_persetujuan_akuntan_txp,pembelian_id} = req.body

        trxPembelian.create({ id: uuid_v4(), status_persetujuan_txp,persetujuan_manajer_txp,tgl_persetujuan_manajer_txp,jumlah_txp,satuan_txp,harga_satuan_txp,harga_total_txp,persetujuan_akuntan_txp,tgl_persetujuan_akuntan_txp,pembelian_id }).then(data => {
            res.status(200).json({ status: 200, message: "sukses",data });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static update(req, res) {
        const { id, status_persetujuan_txp,persetujuan_manajer_txp,tgl_persetujuan_manajer_txp,jumlah_txp,satuan_txp,harga_satuan_txp,harga_total_txp,persetujuan_akuntan_txp,tgl_persetujuan_akuntan_txp,pembelian_id } = req.body

        trxPembelian.update({ status_persetujuan_txp,persetujuan_manajer_txp,tgl_persetujuan_manajer_txp,jumlah_txp,satuan_txp,harga_satuan_txp,harga_total_txp,persetujuan_akuntan_txp,tgl_persetujuan_akuntan_txp,pembelian_id }, { where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static delete(req, res) {
        const { id } = req.body

        trxPembelian.destroy({ where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static async list(req, res) {
        try {
            let data = await sq.query(`select tp.id as trx_pembelian_id, tp.*, p.* from trx_pembelian tp join pembelian p on p.id = tp.pembelian_id where tp."deletedAt" isnull order by tp."createdAt" desc`,s);

            res.status(200).json({ status: 200, message: "sukses",data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listTrxPembelianByPembelianId(req, res) {
        const {pembelian_id} = req.body
        try {
            let data = await sq.query(`select tp.id as trx_pembelian_id, tp.*, p.* from trx_pembelian tp join pembelian p on p.id = tp.pembelian_id where tp."deletedAt" isnull and tp.pembelian_id ='${pembelian_id}' order by tp."createdAt" desc`,s);

            res.status(200).json({ status: 200, message: "sukses",data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async detailsById(req, res) {
        const { id } = req.params

        try {
            let data = await sq.query(`select tp.id as trx_pembelian_id, tp.*, p.* from trx_pembelian tp join pembelian p on p.id = tp.pembelian_id where tp."deletedAt" isnull and tp.id ='${id}'`,s);

            res.status(200).json({ status: 200, message: "sukses",data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }
}
module.exports = Controller;