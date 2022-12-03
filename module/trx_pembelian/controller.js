const { sq } = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const trxPembelian = require("./model");
const persediaan = require("../persediaan/model");
const generalLedger = require("../general_ledger/model");
const { QueryTypes } = require('sequelize');
const s = { type: QueryTypes.SELECT };


class Controller {

    static register(req, res) {
        const { status_persetujuan_txp,tgl_persetujuan_manajer_txp,jumlah_txp,harga_satuan_txp,harga_total_txp,tgl_persetujuan_akuntan_txp,pembelian_id,master_satuan_id } = req.body

        trxPembelian.create({ id: uuid_v4(), status_persetujuan_txp,tgl_persetujuan_manajer_txp,jumlah_txp,harga_satuan_txp,harga_total_txp,tgl_persetujuan_akuntan_txp,pembelian_id,master_satuan_id }).then(data => {
            res.status(200).json({ status: 200, message: "sukses",data });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static update(req, res) {
        const { id, status_persetujuan_txp,tgl_persetujuan_manajer_txp,jumlah_txp,harga_satuan_txp,harga_total_txp,tgl_persetujuan_akuntan_txp,pembelian_id,master_satuan_id } = req.body

        trxPembelian.update({ status_persetujuan_txp,tgl_persetujuan_manajer_txp,jumlah_txp,harga_satuan_txp,harga_total_txp,tgl_persetujuan_akuntan_txp,pembelian_id,master_satuan_id }, { where: { id } }).then(data => {
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

    static async acceptPersetujuan(req, res) {
        const { id,status_persetujuan_txp,tgl_persetujuan_akuntan_txp,tgl_persetujuan_manajer_txp } = req.body

        const t = await sq.transaction();
        try {
            let tanggal_persetujuan

            let cekStatus = await sq.query(`select tp.*,p.persediaan_id,p2.stock,p2.harga_satuan,(tp.jumlah_txp+p2.stock) as total_stock from trx_pembelian tp join pembelian p on p.id = tp.pembelian_id left join persediaan p2 on p2.id = p.persediaan_id where tp."deletedAt" isnull and tp.id = '${id}'`,s);

            if(cekStatus[0].status_persetujuan_txp == 3){
                res.status(201).json({ status: 204, message: "status sudah 3" });
            }else{
                if(status_persetujuan_txp == 3){
                    tanggal_persetujuan= tgl_persetujuan_akuntan_txp
                    let akunGl = await sq.query(`select gl.*,(gl2.sisa_saldo+gl.penambahan) as total_sisa from general_ledger gl left join general_ledger gl2 on gl2.akun_id = gl.akun_id and gl2.status = 1 where gl."deletedAt" isnull and gl.pembelian_id = '${cekStatus[0].pembelian_id}'`,s);
                    for (let i = 0; i < akunGl.length; i++) {
                        akunGl[i].sisa_saldo = !akunGl[i].total_sisa?akunGl[0].penambahan:akunGl[i].total_sisa
                        akunGl[i].tanggal_persetujuan = tanggal_persetujuan
                        akunGl[i].status = 1
                    }
                    if(cekStatus[0].persediaan_id){
                        await persediaan.update({stock:cekStatus[0].total_stock,harga_satuan:cekStatus[0].harga_satuan_txp},{where:{id:cekStatus[0].persediaan_id},transaction:t})
                    }
                    await generalLedger.bulkCreate(akunGl,{updateOnDuplicate:['status','tanggal_persetujuan','sisa_saldo'],transaction:t})
                }
    
                await trxPembelian.update({tgl_persetujuan_akuntan_txp,tgl_persetujuan_manajer_txp,status_persetujuan_txp},{where:{id},transaction:t});
                await t.commit();
                res.status(200).json({ status: 200, message: "sukses" });
            }
        } catch (err) {
            await t.rollback();
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }
}
module.exports = Controller;