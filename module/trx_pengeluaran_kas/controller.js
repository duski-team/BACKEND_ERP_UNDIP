const { sq } = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const trxPengeluaranKas = require("./model");
const { QueryTypes } = require('sequelize');
const s = { type: QueryTypes.SELECT };


class Controller {

    static register(req, res) {
        const { persetujuan_manajer_txpk,tgl_persetujuan_manajer_txpk,persetujuan_kasir_txpk,tgl_persetujuan_kasir_txpk,status_bayar_txpk,persetujuan_akuntan_txpk,tgl_persetujuan_akuntan_txpk,status_persetujuan_txpk,penugasan_sdm_id,trx_pembelian_id,jenis_pengeluaran_kas_id } = req.body

        trxPengeluaranKas.create({ id: uuid_v4(), persetujuan_manajer_txpk,tgl_persetujuan_manajer_txpk,persetujuan_kasir_txpk,tgl_persetujuan_kasir_txpk,status_bayar_txpk,persetujuan_akuntan_txpk,tgl_persetujuan_akuntan_txpk,status_persetujuan_txpk,penugasan_sdm_id,trx_pembelian_id,jenis_pengeluaran_kas_id }).then(data => {
            res.status(200).json({ status: 200, message: "sukses",data });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static update(req, res) {
        const { id, persetujuan_manajer_txpk,tgl_persetujuan_manajer_txpk,persetujuan_kasir_txpk,tgl_persetujuan_kasir_txpk,status_bayar_txpk,persetujuan_akuntan_txpk,tgl_persetujuan_akuntan_txpk,status_persetujuan_txpk,penugasan_sdm_id,trx_pembelian_id,jenis_pengeluaran_kas_id } = req.body

        trxPengeluaranKas.update({ persetujuan_manajer_txpk,tgl_persetujuan_manajer_txpk,persetujuan_kasir_txpk,tgl_persetujuan_kasir_txpk,status_bayar_txpk,persetujuan_akuntan_txpk,tgl_persetujuan_akuntan_txpk,status_persetujuan_txpk,penugasan_sdm_id,trx_pembelian_id,jenis_pengeluaran_kas_id }, { where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static delete(req, res) {
        const { id } = req.body

        trxPengeluaranKas.destroy({ where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static async list(req, res) {
        try {
            let data = await sq.query(`select  tpk.id as trx_pengeluaran_kas_id, tp.*,ps.*,jpk.* from trx_pengeluaran_kas tpk join trx_pembelian tp on tp.id = tpk.trx_pembelian_id join penugasan_sdm ps on ps.id = tpk.penugasan_sdm_id join jenis_pengeluaran_kas jpk on jpk.id = tpk.jenis_pengeluaran_kas_id where tpk.deletedAt is NULL order by tpk.createdAt desc`,s);

            res.status(200).json({ status: 200, message: "sukses",data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listTrxPengeluaranKasByTrxPembelianId(req, res) {
        const {trx_pembelian_id} = req.body
        try {
            let data = await sq.query(`select  tpk.id as trx_pengeluaran_kas_id, tp.*,ps.*,jpk.* from trx_pengeluaran_kas tpk join trx_pembelian tp on tp.id = tpk.trx_pembelian_id join penugasan_sdm ps on ps.id = tpk.penugasan_sdm_id join jenis_pengeluaran_kas jpk on jpk.id = tpk.jenis_pengeluaran_kas_id where tpk.deletedAt is NULL and tpk.trx_pembelian_id = '${trx_pembelian_id}' order by tpk.createdAt desc`,s);

            res.status(200).json({ status: 200, message: "sukses",data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listTrxPengeluaranKasByPenugasanSdmId(req, res) {
        const {penugasan_sdm_id} = req.body
        try {
            let data = await sq.query(`select  tpk.id as trx_pengeluaran_kas_id, tp.*,ps.*,jpk.* from trx_pengeluaran_kas tpk join trx_pembelian tp on tp.id = tpk.trx_pembelian_id join penugasan_sdm ps on ps.id = tpk.penugasan_sdm_id join jenis_pengeluaran_kas jpk on jpk.id = tpk.jenis_pengeluaran_kas_id where tpk.deletedAt is NULL and tpk.penugasan_sdm_id = '${penugasan_sdm_id}' order by tpk.createdAt desc`,s);

            res.status(200).json({ status: 200, message: "sukses",data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listTrxPengeluaranKasByJenisPengeluaranKasId(req, res) {
        const {jenis_pengeluaran_kas_id} = req.body
        try {
            let data = await sq.query(`select  tpk.id as trx_pengeluaran_kas_id, tp.*,ps.*,jpk.* from trx_pengeluaran_kas tpk join trx_pembelian tp on tp.id = tpk.trx_pembelian_id join penugasan_sdm ps on ps.id = tpk.penugasan_sdm_id join jenis_pengeluaran_kas jpk on jpk.id = tpk.jenis_pengeluaran_kas_id where tpk.deletedAt is NULL and tpk.jenis_pengeluaran_kas_id = '${jenis_pengeluaran_kas_id}' order by tpk.createdAt desc`,s);

            res.status(200).json({ status: 200, message: "sukses",data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async detailsById(req, res) {
        const { id } = req.params

        try {
            let data = await sq.query(`select  tpk.id as trx_pengeluaran_kas_id, tp.*,ps.*,jpk.* from trx_pengeluaran_kas tpk join trx_pembelian tp on tp.id = tpk.trx_pembelian_id join penugasan_sdm ps on ps.id = tpk.penugasan_sdm_id join jenis_pengeluaran_kas jpk on jpk.id = tpk.jenis_pengeluaran_kas_id where tpk.deletedAt is NULL and tpk.id = '${id}'`,s);

            res.status(200).json({ status: 200, message: "sukses",data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }
}
module.exports = Controller;