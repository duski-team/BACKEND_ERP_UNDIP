const { sq } = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const trxPengeluaranKas = require("./model");
const { QueryTypes } = require('sequelize');
const s = { type: QueryTypes.SELECT };


class Controller {

    static register(req, res) {
        let { tgl_persetujuan_manajer_txpk, tgl_persetujuan_kasir_txpk, status_bayar_txpk, tgl_persetujuan_akuntan_txpk, status_persetujuan_txpk, trx_pembelian_id, jenis_pengeluaran_kas_id, nominal_txpk, no_invoice_txpk, company_id } = req.body

        if (!company_id) {
            company_id = req.dataUsers.company_id
        }

        trxPengeluaranKas.create({ id: uuid_v4(), tgl_persetujuan_manajer_txpk, tgl_persetujuan_kasir_txpk, status_bayar_txpk, tgl_persetujuan_akuntan_txpk, status_persetujuan_txpk, trx_pembelian_id, jenis_pengeluaran_kas_id, nominal_txpk, no_invoice_txpk, company_id }).then(data => {
            res.status(200).json({ status: 200, message: "sukses", data });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static update(req, res) {
        const { id, tgl_persetujuan_manajer_txpk, tgl_persetujuan_kasir_txpk, status_bayar_txpk, tgl_persetujuan_akuntan_txpk, status_persetujuan_txpk, trx_pembelian_id, jenis_pengeluaran_kas_id, nominal_txpk, no_invoice_txpk, company_id } = req.body

        trxPengeluaranKas.update({ tgl_persetujuan_manajer_txpk, tgl_persetujuan_kasir_txpk, status_bayar_txpk, tgl_persetujuan_akuntan_txpk, status_persetujuan_txpk, trx_pembelian_id, jenis_pengeluaran_kas_id, nominal_txpk, no_invoice_txpk, company_id }, { where: { id } }).then(data => {
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
            let data = await sq.query(`select tpk.id as trx_pengeluaran_kas_id,tpk.*,tp.*,jpk.nama_jenis_pengeluaran_kas from trx_pengeluaran_kas tpk join trx_pembelian tp on tp.id = tpk.trx_pembelian_id join jenis_pengeluaran_kas jpk on jpk.id = tpk.jenis_pengeluaran_kas_id where tpk."deletedAt" isnull and tpk.company_id = '${req.dataUsers.company_id}' order by tpk."createdAt" desc`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listTrxPengeluaranKasByTrxPembelianId(req, res) {
        let { trx_pembelian_id,company_id } = req.body
        try {
            if(!company_id){
                company_id = req.dataUsers.company_id
            }
            let data = await sq.query(`select tpk.id as trx_pengeluaran_kas_id,tpk.*,tp.*,jpk.nama_jenis_pengeluaran_kas from trx_pengeluaran_kas tpk join trx_pembelian tp on tp.id = tpk.trx_pembelian_id join jenis_pengeluaran_kas jpk on jpk.id = tpk.jenis_pengeluaran_kas_id where tpk."deletedAt" isnull and tpk.trx_pembelian_id ='${trx_pembelian_id}' and tpk.company_id = '${company_id}' order by tpk."createdAt" desc`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listTrxPengeluaranKasByJenisPengeluaranKasId(req, res) {
        const { jenis_pengeluaran_kas_id,company_id } = req.body
        try {
            if(!company_id){
                company_id = req.dataUsers.company_id
            }
            let data = await sq.query(`select tpk.id as trx_pengeluaran_kas_id,tpk.*,tp.*,jpk.nama_jenis_pengeluaran_kas from trx_pengeluaran_kas tpk join trx_pembelian tp on tp.id = tpk.trx_pembelian_id join jenis_pengeluaran_kas jpk on jpk.id = tpk.jenis_pengeluaran_kas_id where tpk."deletedAt" isnull and tpk.jenis_pengeluaran_kas_id = '${jenis_pengeluaran_kas_id}' and tpk.company_id = '${company_id}' order by tpk."createdAt" desc`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listPembelianByVendorId(req, res) {
        let { vendor_id,company_id, status_pembelian } = req.body
        try {
            if(!company_id){
                company_id = req.dataUsers.company_id
            }
            let isi = ''
            if (status_pembelian) {
                isi += ` and p.status_pembelian = ${status_pembelian} `
            }

            let data = await sq.query(`select tp.id as trx_pembelian_id, *, (select sum(tpk.nominal_txpk) from trx_pengeluaran_kas tpk where tpk."deletedAt" isnull and tpk.trx_pembelian_id = tp.id and tpk.status_persetujuan_txpk >1) as total_dibayar from trx_pembelian tp join pembelian p on p.id = tp.pembelian_id join persediaan p2 on p2.id = p.persediaan_id  where tp."deletedAt" isnull and p.company_id = '${company_id}' and p.vendor_id = '${vendor_id}' and tp.status_persetujuan_txp = 3 ${isi} order by tp.tgl_persetujuan_akuntan_txp desc`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async detailsById(req, res) {
        const { id } = req.params

        try {
            let data = await sq.query(`select tpk.id as trx_pengeluaran_kas_id,tpk.*,tp.*,jpk.nama_jenis_pengeluaran_kas from trx_pengeluaran_kas tpk join trx_pembelian tp on tp.id = tpk.trx_pembelian_id join jenis_pengeluaran_kas jpk on jpk.id = tpk.jenis_pengeluaran_kas_id where tpk."deletedAt" isnull and tpk.id = '${id}'`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async acceptPersetujuan(req, res) {
        let { id, status_persetujuan_txpk, tgl_persetujuan_manajer_txpk, tgl_persetujuan_kasir_txpk, tgl_persetujuan_akuntan_txpk, company_id } = req.body;

        const t = await sq.transaction();

        try {
            if (!company_id) {
                company_id = req.dataUsers.company_id
            }
            let tanggal_persetujuan
            let cekPersetujuan = await sq.query(`select tpk.*, tp.harga_total_txp,(select case when sum(tpk2.nominal_txpk) isnull then 0 else sum(tpk2.nominal_txpk) end from trx_pengeluaran_kas tpk2 where tpk2."deletedAt" isnull and tpk2.status_bayar_txpk = 1 and tpk2.trx_pembelian_id = tpk.trx_pembelian_id) as total,tp.pembelian_id 
            from trx_pengeluaran_kas tpk join trx_pembelian tp on tp.id = tpk.trx_pembelian_id where tpk."deletedAt" isnull and tpk.id = '${id}'`, s);

            if (cekPersetujuan[0].status_persetujuan_txpk == 4) {
                res.status(201).json({ status: 204, message: "status sudah 4" });
            } else {
                let totalPembayaran = cekPersetujuan[0].nominal_txpk + cekPersetujuan[0].total
                let status_bayar_txpk = 0

                if (totalPembayaran > cekPersetujuan[0].harga_total_txp) {
                    res.status(201).json({ status: 204, message: "pembayaran melebihi tagihan" });
                } else {
                    if (status_persetujuan_txpk == 4) {
                        if (totalPembayaran == cekPersetujuan[0].harga_total_txp) {
                            status_bayar_txpk = 1
                        }
                        tanggal_persetujuan = tgl_persetujuan_akuntan_txpk

                        // let akunHutang = await sq.query(`select c6.*,gl.sisa_saldo from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id and gl.status = 1 where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.kode_coa6 = '2.1.7.1.01.0001' order by gl.tanggal_persetujuan desc limit 1`,s);

                        // let sisa_saldo = akunHutang[0].sisa_saldo - cekPersetujuan[0].nominal_txpk
                        // let hutang = {id:uuid_v4(),tanggal_transaksi:cekPersetujuan[0].createdAt,pengurangan:cekPersetujuan[0].nominal_txpk,pembelian_id:cekPersetujuan[0].pembelian_id,akun_id:akunHutang[0].id,akun_pasangan_id:"",tanggal_persetujuan,sisa_saldo,nama:"hutang"}
                    }
                    await trxPengeluaranKas.update({ tgl_persetujuan_manajer_txpk, tgl_persetujuan_kasir_txpk, tgl_persetujuan_akuntan_txpk, status_bayar_txpk }, { where: { id }, transaction: t })

                    await t.commit();
                    res.status(200).json({ status: 200, message: "sukses" });
                }
            }
        } catch (err) {
            await t.rollback();
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }
}
module.exports = Controller;