const { sq } = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const trxPengeluaranKas = require("./model");
const { QueryTypes } = require('sequelize');
const s = { type: QueryTypes.SELECT };


class Controller {

    static register(req, res) {
        const { tgl_persetujuan_manajer_txpk,tgl_persetujuan_kasir_txpk,status_bayar_txpk,tgl_persetujuan_akuntan_txpk,status_persetujuan_txpk,trx_pembelian_id,jenis_pengeluaran_kas_id,nominal_txpk,no_invoice_txpk } = req.body

        trxPengeluaranKas.create({ id: uuid_v4(),tgl_persetujuan_manajer_txpk,tgl_persetujuan_kasir_txpk,status_bayar_txpk,tgl_persetujuan_akuntan_txpk,status_persetujuan_txpk,trx_pembelian_id,jenis_pengeluaran_kas_id,nominal_txpk,no_invoice_txpk }).then(data => {
            res.status(200).json({ status: 200, message: "sukses",data });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static update(req, res) {
        const { id,tgl_persetujuan_manajer_txpk,tgl_persetujuan_kasir_txpk,status_bayar_txpk,tgl_persetujuan_akuntan_txpk,status_persetujuan_txpk,trx_pembelian_id,jenis_pengeluaran_kas_id,nominal_txpk,no_invoice_txpk } = req.body

        trxPengeluaranKas.update({ tgl_persetujuan_manajer_txpk,tgl_persetujuan_kasir_txpk,status_bayar_txpk,tgl_persetujuan_akuntan_txpk,status_persetujuan_txpk,trx_pembelian_id,jenis_pengeluaran_kas_id,nominal_txpk,no_invoice_txpk }, { where: { id } }).then(data => {
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
            let data = await sq.query(`select tpk.id as trx_pengeluaran_kas_id, tp.*,jpk.* from trx_pengeluaran_kas tpk join trx_pembelian tp on tp.id = tpk.trx_pembelian_id join jenis_pengeluaran_kas jpk on jpk.id = tpk.jenis_pengeluaran_kas_id where tpk."deletedAt" isnull order by tpk."createdAt" desc`,s);

            res.status(200).json({ status: 200, message: "sukses",data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listTrxPengeluaranKasByTrxPembelianId(req, res) {
        const {trx_pembelian_id} = req.body
        try {
            let data = await sq.query(`select tpk.id as trx_pengeluaran_kas_id, tp.*,jpk.* from trx_pengeluaran_kas tpk join trx_pembelian tp on tp.id = tpk.trx_pembelian_id join jenis_pengeluaran_kas jpk on jpk.id = tpk.jenis_pengeluaran_kas_id where tpk."deletedAt" isnull and tpk.trx_pembelian_id ='${trx_pembelian_id}' order by tpk."createdAt" desc`,s);

            res.status(200).json({ status: 200, message: "sukses",data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listTrxPengeluaranKasByJenisPengeluaranKasId(req, res) {
        const {jenis_pengeluaran_kas_id} = req.body
        try {
            let data = await sq.query(`select tpk.id as trx_pengeluaran_kas_id, tp.*,jpk.* from trx_pengeluaran_kas tpk join trx_pembelian tp on tp.id = tpk.trx_pembelian_id join jenis_pengeluaran_kas jpk on jpk.id = tpk.jenis_pengeluaran_kas_id where tpk."deletedAt" isnull and tpk.jenis_pengeluaran_kas_id = '${jenis_pengeluaran_kas_id}' order by tpk."createdAt" desc`,s);

            res.status(200).json({ status: 200, message: "sukses",data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async detailsById(req, res) {
        const { id } = req.params

        try {
            let data = await sq.query(`select tpk.id as trx_pengeluaran_kas_id, tp.*,jpk.* from trx_pengeluaran_kas tpk join trx_pembelian tp on tp.id = tpk.trx_pembelian_id join jenis_pengeluaran_kas jpk on jpk.id = tpk.jenis_pengeluaran_kas_id where tpk."deletedAt" isnull and tpk.id = '${id}'`,s);

            res.status(200).json({ status: 200, message: "sukses",data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async acceptPersetujuan (req,res){
        const {id,status_persetujuan_txpk,tanggal_persetujuan} = req.body;

        try {
            let tgl_persetujuan_manajer_txpk = null
            let tgl_persetujuan_kasir_txpk = null
            let tgl_persetujuan_akuntan_txpk = null
            if(status_persetujuan_txpk == 2){
                tgl_persetujuan_manajer_txpk = tanggal_persetujuan
            }
            if(status_persetujuan_txpk == 3){
                tgl_persetujuan_kasir_txpk = tanggal_persetujuan
            }
            if(status_persetujuan_txpk == 4){
                tgl_persetujuan_akuntan_txpk = tanggal_persetujuan
            }

            await trxPengeluaranKas.update({tgl_persetujuan_manajer_txpk,tgl_persetujuan_kasir_txpk,tgl_persetujuan_akuntan_txpk},{where:{id}})
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }
}
module.exports = Controller;