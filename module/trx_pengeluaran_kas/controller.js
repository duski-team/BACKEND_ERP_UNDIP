const { sq } = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const trxPengeluaranKas = require("./model");
const pembelian = require("../pembelian/model");
const generalLedger = require("../general_ledger/model");
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
                isi += ` and p.status_pembelian = ${status_pembelian}`
            }

            let data = await sq.query(`select tp.id as trx_pembelian_id,tp.*,P.*,c6.nama_coa6,c6.kode_coa6,ms.nama_master_satuan,mja.nama_jenis_aset,mv.nama_vendor,mv.alamat_vendor,mv.no_hp_vendor, 
            (select sum(tpk.nominal_txpk) from trx_pengeluaran_kas tpk where tpk."deletedAt" isnull and tpk.trx_pembelian_id = tp.id and tpk.status_persetujuan_txpk > 1) as total_dibayar 
            from trx_pembelian tp
            join pembelian p on p.id = tp.pembelian_id
            join coa6 c6 on c6.id = p.coa6_id 
            join master_vendor mv on mv.id = p.vendor_id
            join master_satuan ms on ms.id = tp.master_satuan_id
            left join m_jenis_aset mja on mja.id = p.jenis_asset_pembelian_id
            where tp."deletedAt" isnull and tp.status_persetujuan_txp = 4 and p.company_id = '${company_id}' and p.vendor_id = '${vendor_id}' ${isi} order by tp.tgl_persetujuan_akuntan_txp desc`, s);

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
        let { id, status_persetujuan_txpk, tgl_persetujuan_manajer_txpk, tgl_persetujuan_kasir_txpk, tgl_persetujuan_akuntan_txpk, company_id,akun_kas_id } = req.body;

        const t = await sq.transaction();

        try {
            if (!company_id) {
                company_id = req.dataUsers.company_id
            }

            let cekPersetujuan = await sq.query(`select tpk.*, tp.harga_total_txp,(select case when sum(tpk2.nominal_txpk) isnull then 0 else sum(tpk2.nominal_txpk) end from trx_pengeluaran_kas tpk2 where tpk2."deletedAt" isnull and tpk2.status_persetujuan_txpk > 1 and tpk2.trx_pembelian_id = tpk.trx_pembelian_id) as total,tp.pembelian_id 
            from trx_pengeluaran_kas tpk join trx_pembelian tp on tp.id = tpk.trx_pembelian_id where tpk."deletedAt" isnull and tpk.id = '${id}'`, s);

            if (cekPersetujuan[0].status_persetujuan_txpk == 4) {
                res.status(201).json({ status: 204, message: "status sudah 4" });
            } else {
                let totalPembayaran = cekPersetujuan[0].status_persetujuan_txpk ==0?cekPersetujuan[0].total+cekPersetujuan[0].nominal_txpk:cekPersetujuan[0].total
                let status_bayar_txpk = 0
                if (totalPembayaran > cekPersetujuan[0].harga_total_txp) {
                    res.status(201).json({ status: 204, message: "pembayaran melebihi tagihan" });
                } else {
                    if (status_persetujuan_txpk == 4) {
                        if (totalPembayaran == cekPersetujuan[0].harga_total_txp) {
                            status_bayar_txpk = 1
                            await pembelian.update({status_pembelian:1},{where:{id:cekPersetujuan[0].pembelian_id},transaction:t});
                        }

                        let akunKas = await sq.query(`select c6.*,gl.sisa_saldo 
                        from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id and gl.status = 4 where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.id = '${akun_kas_id}' order by gl.tanggal_persetujuan desc limit 1`,s);
                        let akunHutang = await sq.query(`select c6.*,gl.sisa_saldo from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id and gl.status = 4 where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.kode_coa6 = '2.1.7.1.01.0001' order by gl.tanggal_persetujuan desc limit 1`,s);

                        // console.log(akunKas);
                        // console.log(akunHutang);
                        // console.log("=============================================");

                        let sisaSaldo = !akunKas[0].sisa_saldo?akunKas[0].nominal_coa6:akunKas[0].sisa_saldo
                        let saldoKas = sisaSaldo - cekPersetujuan[0].nominal_txpk
                        let saldoHutang = akunHutang[0].sisa_saldo - cekPersetujuan[0].nominal_txpk
                        
                        let kas = {id:uuid_v4(),tanggal_transaksi:cekPersetujuan[0].createdAt,pengurangan:cekPersetujuan[0].nominal_txpk,pembelian_id:cekPersetujuan[0].pembelian_id,akun_id:akunKas[0].id,akun_pasangan_id:akunHutang[0].id,tanggal_persetujuan:tgl_persetujuan_akuntan_txpk,sisa_saldo:saldoKas,status:4,nama_transaksi:"pembayaran",nama:"kas",referensi_bukti:cekPersetujuan[0].no_invoice_txpk }
                        let hutang = {id:uuid_v4(),tanggal_transaksi:cekPersetujuan[0].createdAt,pengurangan:cekPersetujuan[0].nominal_txpk,pembelian_id:cekPersetujuan[0].pembelian_id,akun_id:akunHutang[0].id,akun_pasangan_id:akunKas[0].id,tanggal_persetujuan:tgl_persetujuan_akuntan_txpk,sisa_saldo:saldoHutang,status:4,nama_transaksi:"pembayaran",nama:"hutang",referensi_bukti:cekPersetujuan[0].no_invoice_txpk}

                        // console.log(kas);
                        // console.log(hutang);

                        await generalLedger.bulkCreate([kas,hutang],{transaction:t});
                    }
                    await trxPengeluaranKas.update({ tgl_persetujuan_manajer_txpk, tgl_persetujuan_kasir_txpk, tgl_persetujuan_akuntan_txpk, status_bayar_txpk,status_persetujuan_txpk }, { where: { id }, transaction: t })

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