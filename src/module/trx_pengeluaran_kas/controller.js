const { sq } = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const trxPengeluaranKas = require("./model");
const pembelian = require("../pembelian/model");
const generalLedger = require("../general_ledger/model");
const { QueryTypes } = require('sequelize');
const s = { type: QueryTypes.SELECT };


class Controller {

    static register(req, res) {
        let { tgl_persetujuan_manajer_txpk, tgl_persetujuan_kasir_txpk, status_bayar_txpk, tgl_persetujuan_akuntan_txpk, status_persetujuan_txpk, trx_pembelian_id, jenis_pengeluaran_kas_id, nominal_txpk, no_invoice_txpk, company_id, deskripsi_txpk } = req.body

        if (!company_id) {
            company_id = req.dataUsers.company_id
        }

        trxPengeluaranKas.create({ id: uuid_v4(), tgl_persetujuan_manajer_txpk, tgl_persetujuan_kasir_txpk, status_bayar_txpk, tgl_persetujuan_akuntan_txpk, status_persetujuan_txpk, trx_pembelian_id, jenis_pengeluaran_kas_id, nominal_txpk, no_invoice_txpk, company_id, deskripsi_txpk }).then(data => {
            res.status(200).json({ status: 200, message: "sukses", data });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static async registerKewajibanLainKepadaVendor(req, res) {
        let { akun_kas_id, nominal_txpk, no_invoice_txpk, company_id, deskripsi_txpk, tanggal_transaksi, pembelian_id } = req.body

        try {
            if (!company_id) {
                company_id = req.dataUsers.company_id
            }

            let akunKas = await sq.query(`select c6.* from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.id = '${akun_kas_id}'`, s);

            let akunHutang = await sq.query(`select c6.* from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.kode_coa6 = '2.1.7.1.01.0001'`, s);

            let kas = { id: uuid_v4(), tanggal_transaksi, pengurangan: nominal_txpk, pembelian_id, akun_id: akunKas[0].id, nama_transaksi: "pembayaran kewajiban lain pada vendor", referensi_bukti: no_invoice_txpk, keterangan: deskripsi_txpk, nama: "kas" }
            let hutang = { id: uuid_v4(), tanggal_transaksi, pengurangan: nominal_txpk, pembelian_id, akun_id: akunHutang[0].id, nama_transaksi: "pembayaran kewajiban lain pada vendor", referensi_bukti: no_invoice_txpk, keterangan: deskripsi_txpk, nama: "hutang" }

            let data = await generalLedger.bulkCreate([kas, hutang])

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static update(req, res) {
        const { id, tgl_persetujuan_manajer_txpk, tgl_persetujuan_kasir_txpk, status_bayar_txpk, tgl_persetujuan_akuntan_txpk, status_persetujuan_txpk, trx_pembelian_id, jenis_pengeluaran_kas_id, nominal_txpk, no_invoice_txpk, company_id, deskripsi_txpk } = req.body

        trxPengeluaranKas.update({ tgl_persetujuan_manajer_txpk, tgl_persetujuan_kasir_txpk, status_bayar_txpk, tgl_persetujuan_akuntan_txpk, status_persetujuan_txpk, trx_pembelian_id, jenis_pengeluaran_kas_id, nominal_txpk, no_invoice_txpk, company_id, deskripsi_txpk }, { where: { id } }).then(data => {
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
        let { trx_pembelian_id, company_id } = req.body
        try {
            if (!company_id) {
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
        const { jenis_pengeluaran_kas_id, company_id } = req.body
        try {
            if (!company_id) {
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
        let { vendor_id, company_id, status_pembelian } = req.body
        try {
            if (!company_id) {
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

    static async acceptPersetujuanPembayaranKewajibanVendor(req, res) {
        let { id, status_persetujuan_txpk, tgl_persetujuan_manajer_txpk, tgl_persetujuan_kasir_txpk, tgl_persetujuan_akuntan_txpk, company_id, akun_kas_id } = req.body;

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
                let totalPembayaran = cekPersetujuan[0].status_persetujuan_txpk == 0 ? cekPersetujuan[0].total + cekPersetujuan[0].nominal_txpk : cekPersetujuan[0].total
                let status_bayar_txpk = 0
                if(status_bayar_txpk> 1){
                    if (totalPembayaran > cekPersetujuan[0].harga_total_txp){
                        res.status(201).json({ status: 204, message: "pembayaran melebihi tagihan" });
                    }else{
                        if (status_persetujuan_txpk == 4) {
                            if (totalPembayaran == cekPersetujuan[0].harga_total_txp) {
                                status_bayar_txpk = 1
                                await pembelian.update({status_pembelian:1},{where:{id:cekPersetujuan[0].pembelian_id},transaction:t});
                            }
        
                            let akunKas = await sq.query(`select c6.*,gl.sisa_saldo from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id and gl.status = 4 where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.id = '${akun_kas_id}' order by gl.tanggal_persetujuan desc limit 1`,s);
                            let akunHutang = await sq.query(`select c6.*,gl.sisa_saldo from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id and gl.status = 4 where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.kode_coa6 = '2.1.7.1.01.0001' order by gl.tanggal_persetujuan desc limit 1`,s);
        
                            let sisaSaldo = !akunKas[0].sisa_saldo?akunKas[0].nominal_coa6:akunKas[0].sisa_saldo
                            let saldoKas = sisaSaldo - cekPersetujuan[0].nominal_txpk
                            let saldoHutang = akunHutang[0].sisa_saldo - cekPersetujuan[0].nominal_txpk
        
                            let kas = {id:uuid_v4(),tanggal_transaksi:cekPersetujuan[0].createdAt,pengurangan:cekPersetujuan[0].nominal_txpk,pembelian_id:cekPersetujuan[0].pembelian_id,akun_id:akunKas[0].id,company_id,tanggal_persetujuan:tgl_persetujuan_akuntan_txpk,sisa_saldo:saldoKas,status:4,nama_transaksi:"pembayaran kewajiban vendor",referensi_bukti:cekPersetujuan[0].no_invoice_txpk,keterangan:cekPersetujuan[0].deskripsi_txpk,nama:"kas"}
                            let hutang = {id:uuid_v4(),tanggal_transaksi:cekPersetujuan[0].createdAt,pengurangan:cekPersetujuan[0].nominal_txpk,pembelian_id:cekPersetujuan[0].pembelian_id,akun_id:akunHutang[0].id,company_id,tanggal_persetujuan:tgl_persetujuan_akuntan_txpk,sisa_saldo:saldoHutang,status:4,nama_transaksi:"pembayaran kewajiban vendor",referensi_bukti:cekPersetujuan[0].no_invoice_txpk,keterangan:cekPersetujuan[0].deskripsi_txpk,nama:"hutang"}
        
                            // console.log(kas);
                            // console.log(hutang);
                            await generalLedger.bulkCreate([kas,hutang],{transaction:t});
                        }
                    } 
                }
                await trxPengeluaranKas.update({ tgl_persetujuan_manajer_txpk, tgl_persetujuan_kasir_txpk, tgl_persetujuan_akuntan_txpk, status_bayar_txpk,status_persetujuan_txpk }, { where: { id }, transaction: t })
                await t.commit();
                res.status(200).json({ status: 200, message: "sukses" });
            }
        } catch (err) {
            await t.rollback();
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async acceptPersetujuanPembayaranKewajibanLainKepadaVendor(req, res) {
        let { id, status_persetujuan_txpk, tgl_persetujuan_manajer_txpk, tgl_persetujuan_kasir_txpk, tgl_persetujuan_akuntan_txpk, company_id, akun_kas_id } = req.body;

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
                let totalPembayaran = cekPersetujuan[0].status_persetujuan_txpk == 0 ? cekPersetujuan[0].total + cekPersetujuan[0].nominal_txpk : cekPersetujuan[0].total
                let status_bayar_txpk = 0
                if (totalPembayaran > cekPersetujuan[0].harga_total_txp) {
                    res.status(201).json({ status: 204, message: "pembayaran melebihi tagihan" });
                } else {
                    if (status_persetujuan_txpk == 4) {
                        if (totalPembayaran == cekPersetujuan[0].harga_total_txp) {
                            status_bayar_txpk = 1
                            await pembelian.update({ status_pembelian: 1 }, { where: { id: cekPersetujuan[0].pembelian_id }, transaction: t });
                        }

                        let akunKas = await sq.query(`select c6.*,gl.sisa_saldo 
                        from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id and gl.status = 4 where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.id = '${akun_kas_id}' order by gl.tanggal_persetujuan desc limit 1`, s);
                        let akunHutang = await sq.query(`select c6.*,gl.sisa_saldo from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id and gl.status = 4 where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.kode_coa6 = '2.1.7.1.01.0001' order by gl.tanggal_persetujuan desc limit 1`, s);

                        // console.log(akunKas);
                        // console.log(akunHutang);
                        // console.log("=============================================");

                        let sisaSaldo = !akunKas[0].sisa_saldo ? akunKas[0].nominal_coa6 : akunKas[0].sisa_saldo
                        let saldoKas = sisaSaldo - cekPersetujuan[0].nominal_txpk
                        let saldoHutang = akunHutang[0].sisa_saldo - cekPersetujuan[0].nominal_txpk

                        let kas = { id: uuid_v4(), tanggal_transaksi: cekPersetujuan[0].createdAt, pengurangan: cekPersetujuan[0].nominal_txpk, pembelian_id: cekPersetujuan[0].pembelian_id, akun_id: akunKas[0].id, company_id, tanggal_persetujuan: tgl_persetujuan_akuntan_txpk, sisa_saldo: saldoKas, status: 4, nama_transaksi: "pembayaran kewajiban lain kepada vendor", nama: "kas", referensi_bukti: cekPersetujuan[0].no_invoice_txpk }
                        let hutang = { id: uuid_v4(), tanggal_transaksi: cekPersetujuan[0].createdAt, pengurangan: cekPersetujuan[0].nominal_txpk, pembelian_id: cekPersetujuan[0].pembelian_id, akun_id: akunHutang[0].id, company_id, tanggal_persetujuan: tgl_persetujuan_akuntan_txpk, sisa_saldo: saldoHutang, status: 4, nama_transaksi: "pembayaran kewajiban lain kepada vendor", nama: "hutang", referensi_bukti: cekPersetujuan[0].no_invoice_txpk }

                        // console.log(kas);
                        // console.log(hutang);

                        await generalLedger.bulkCreate([kas, hutang], { transaction: t });
                    }
                    await trxPengeluaranKas.update({ tgl_persetujuan_manajer_txpk, tgl_persetujuan_kasir_txpk, tgl_persetujuan_akuntan_txpk, status_bayar_txpk, status_persetujuan_txpk }, { where: { id }, transaction: t })

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

    // static async acceptPersetujuanPembayaranKewajibanVendor(req, res) {
    //     let { id, status_persetujuan_txpk, tgl_persetujuan_manajer_txpk, tgl_persetujuan_kasir_txpk, tgl_persetujuan_akuntan_txpk, company_id,akun_kas_id } = req.body;

    //     const t = await sq.transaction();

    //     try {
    //         if (!company_id) {
    //             company_id = req.dataUsers.company_id
    //         }

    //         let cekPersetujuan = await sq.query(`select tpk.*, tp.harga_total_txp,(select case when sum(tpk2.nominal_txpk) isnull then 0 else sum(tpk2.nominal_txpk) end from trx_pengeluaran_kas tpk2 where tpk2."deletedAt" isnull and tpk2.status_persetujuan_txpk > 1 and tpk2.trx_pembelian_id = tpk.trx_pembelian_id) as total,tp.pembelian_id 
    //         from trx_pengeluaran_kas tpk join trx_pembelian tp on tp.id = tpk.trx_pembelian_id where tpk."deletedAt" isnull and tpk.id = '${id}'`, s);

    //         if (cekPersetujuan[0].status_persetujuan_txpk == 4) {
    //             res.status(201).json({ status: 204, message: "status sudah 4" });
    //         } else {
    //             let totalPembayaran = cekPersetujuan[0].status_persetujuan_txpk ==0?cekPersetujuan[0].total+cekPersetujuan[0].nominal_txpk:cekPersetujuan[0].total
    //             let status_bayar_txpk = 0
    //             if (totalPembayaran > cekPersetujuan[0].harga_total_txp) {
    //                 res.status(201).json({ status: 204, message: "pembayaran melebihi tagihan" });
    //             } else {
    //                 if (status_persetujuan_txpk == 4) {
    //                     if (totalPembayaran == cekPersetujuan[0].harga_total_txp) {
    //                         status_bayar_txpk = 1
    //                         await pembelian.update({status_pembelian:1},{where:{id:cekPersetujuan[0].pembelian_id},transaction:t});
    //                     }

    //                     let akunKas = await sq.query(`select c6.*,gl.sisa_saldo 
    //                     from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id and gl.status = 4 where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.id = '${akun_kas_id}' order by gl.tanggal_persetujuan desc limit 1`,s);
    //                     let akunHutang = await sq.query(`select c6.*,gl.sisa_saldo from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id and gl.status = 4 where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.kode_coa6 = '2.1.7.1.01.0001' order by gl.tanggal_persetujuan desc limit 1`,s);

    //                     // console.log(akunKas);
    //                     // console.log(akunHutang);
    //                     // console.log("=============================================");

    //                     let sisaSaldo = !akunKas[0].sisa_saldo?akunKas[0].nominal_coa6:akunKas[0].sisa_saldo
    //                     let saldoKas = sisaSaldo - cekPersetujuan[0].nominal_txpk
    //                     let saldoHutang = akunHutang[0].sisa_saldo - cekPersetujuan[0].nominal_txpk

    //                     let kas = {id:uuid_v4(),tanggal_transaksi:cekPersetujuan[0].createdAt,pengurangan:cekPersetujuan[0].nominal_txpk,pembelian_id:cekPersetujuan[0].pembelian_id,akun_id:akunKas[0].id,akun_pasangan_id:akunHutang[0].id,tanggal_persetujuan:tgl_persetujuan_akuntan_txpk,sisa_saldo:saldoKas,status:4,nama_transaksi:"pembayaran kewajiban vendor",nama:"kas",referensi_bukti:cekPersetujuan[0].no_invoice_txpk }
    //                     let hutang = {id:uuid_v4(),tanggal_transaksi:cekPersetujuan[0].createdAt,pengurangan:cekPersetujuan[0].nominal_txpk,pembelian_id:cekPersetujuan[0].pembelian_id,akun_id:akunHutang[0].id,akun_pasangan_id:akunKas[0].id,tanggal_persetujuan:tgl_persetujuan_akuntan_txpk,sisa_saldo:saldoHutang,status:4,nama_transaksi:"pembayaran kewajiban vendor",nama:"hutang",referensi_bukti:cekPersetujuan[0].no_invoice_txpk}

    //                     // console.log(kas);
    //                     // console.log(hutang);

    //                     await generalLedger.bulkCreate([kas,hutang],{transaction:t});
    //                 }
    //                 await trxPengeluaranKas.update({ tgl_persetujuan_manajer_txpk, tgl_persetujuan_kasir_txpk, tgl_persetujuan_akuntan_txpk, status_bayar_txpk,status_persetujuan_txpk }, { where: { id }, transaction: t })

    //                 await t.commit();
    //                 res.status(200).json({ status: 200, message: "sukses" });
    //             }
    //         }
    //     } catch (err) {
    //         await t.rollback();
    //         console.log(err);
    //         res.status(500).json({ status: 500, message: "gagal", data: err });
    //     }
    // }

    // static async acceptPersetujuanPembayaranKewajibanLainKepadaVendor(req, res) {
    //     let { id, status_persetujuan_txpk, tgl_persetujuan_manajer_txpk, tgl_persetujuan_kasir_txpk, tgl_persetujuan_akuntan_txpk, company_id,akun_kas_id } = req.body;

    //     const t = await sq.transaction();

    //     try {
    //         if (!company_id) {
    //             company_id = req.dataUsers.company_id
    //         }

    //         let cekPersetujuan = await sq.query(`select tpk.*, tp.harga_total_txp,(select case when sum(tpk2.nominal_txpk) isnull then 0 else sum(tpk2.nominal_txpk) end from trx_pengeluaran_kas tpk2 where tpk2."deletedAt" isnull and tpk2.status_persetujuan_txpk > 1 and tpk2.trx_pembelian_id = tpk.trx_pembelian_id) as total,tp.pembelian_id 
    //         from trx_pengeluaran_kas tpk join trx_pembelian tp on tp.id = tpk.trx_pembelian_id where tpk."deletedAt" isnull and tpk.id = '${id}'`, s);

    //         if (cekPersetujuan[0].status_persetujuan_txpk == 4) {
    //             res.status(201).json({ status: 204, message: "status sudah 4" });
    //         } else {
    //             let totalPembayaran = cekPersetujuan[0].status_persetujuan_txpk ==0?cekPersetujuan[0].total+cekPersetujuan[0].nominal_txpk:cekPersetujuan[0].total
    //             let status_bayar_txpk = 0
    //             if (totalPembayaran > cekPersetujuan[0].harga_total_txp) {
    //                 res.status(201).json({ status: 204, message: "pembayaran melebihi tagihan" });
    //             } else {
    //                 if (status_persetujuan_txpk == 4) {
    //                     if (totalPembayaran == cekPersetujuan[0].harga_total_txp) {
    //                         status_bayar_txpk = 1
    //                         await pembelian.update({status_pembelian:1},{where:{id:cekPersetujuan[0].pembelian_id},transaction:t});
    //                     }

    //                     let akunKas = await sq.query(`select c6.*,gl.sisa_saldo 
    //                     from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id and gl.status = 4 where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.id = '${akun_kas_id}' order by gl.tanggal_persetujuan desc limit 1`,s);
    //                     let akunHutang = await sq.query(`select c6.*,gl.sisa_saldo from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id and gl.status = 4 where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.kode_coa6 = '2.1.7.1.01.0001' order by gl.tanggal_persetujuan desc limit 1`,s);

    //                     // console.log(akunKas);
    //                     // console.log(akunHutang);
    //                     // console.log("=============================================");

    //                     let sisaSaldo = !akunKas[0].sisa_saldo?akunKas[0].nominal_coa6:akunKas[0].sisa_saldo
    //                     let saldoKas = sisaSaldo - cekPersetujuan[0].nominal_txpk
    //                     let saldoHutang = akunHutang[0].sisa_saldo - cekPersetujuan[0].nominal_txpk

    //                     let kas = {id:uuid_v4(),tanggal_transaksi:cekPersetujuan[0].createdAt,pengurangan:cekPersetujuan[0].nominal_txpk,pembelian_id:cekPersetujuan[0].pembelian_id,akun_id:akunKas[0].id,akun_pasangan_id:akunHutang[0].id,tanggal_persetujuan:tgl_persetujuan_akuntan_txpk,sisa_saldo:saldoKas,status:4,nama_transaksi:"pembayaran kewajiban lain kepada vendor",nama:"kas",referensi_bukti:cekPersetujuan[0].no_invoice_txpk }
    //                     let hutang = {id:uuid_v4(),tanggal_transaksi:cekPersetujuan[0].createdAt,pengurangan:cekPersetujuan[0].nominal_txpk,pembelian_id:cekPersetujuan[0].pembelian_id,akun_id:akunHutang[0].id,akun_pasangan_id:akunKas[0].id,tanggal_persetujuan:tgl_persetujuan_akuntan_txpk,sisa_saldo:saldoHutang,status:4,nama_transaksi:"pembayaran kewajiban lain kepada vendor",nama:"hutang",referensi_bukti:cekPersetujuan[0].no_invoice_txpk}

    //                     // console.log(kas);
    //                     // console.log(hutang);

    //                     await generalLedger.bulkCreate([kas,hutang],{transaction:t});
    //                 }
    //                 await trxPengeluaranKas.update({ tgl_persetujuan_manajer_txpk, tgl_persetujuan_kasir_txpk, tgl_persetujuan_akuntan_txpk, status_bayar_txpk,status_persetujuan_txpk }, { where: { id }, transaction: t })

    //                 await t.commit();
    //                 res.status(200).json({ status: 200, message: "sukses" });
    //             }
    //         }
    //     } catch (err) {
    //         await t.rollback();
    //         console.log(err);
    //         res.status(500).json({ status: 500, message: "gagal", data: err });
    //     }
    // }

    static async listTrxPengeluaranKasByStatusPersetujuan(req, res) {
        let { company_id, status_persetujuan_txpk, vendor_id } = req.body;
        try {
            let isi = ''
            if (!company_id) {
                company_id = req.dataUsers.company_id
            }
            if (vendor_id) {
                isi += ` and p.vendor_id = '${vendor_id}' `
            }
            if (status_persetujuan_txpk) {
                isi += ` and tpk.status_persetujuan_txpk  = ${status_persetujuan_txpk} `
            }

            let data = await sq.query(`select tpk.id as trx_pengeluaran_kas_id,tpk.*,tp.*,p.*,jpk.nama_jenis_pengeluaran_kas,c6.nama_coa6,mv.nama_vendor,mv.alamat_vendor from trx_pengeluaran_kas tpk join trx_pembelian tp on tp.id = tpk.trx_pembelian_id left join jenis_pengeluaran_kas jpk on jpk.id = tpk.jenis_pengeluaran_kas_id join pembelian p on tp.pembelian_id = p.id left join master_vendor mv on mv.id = p.vendor_id join coa6 c6 on c6.id = p.coa6_id where tpk."deletedAt" isnull and tpk.company_id = '${company_id}' ${isi} order by tpk."createdAt" desc`,s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async pengeluaranKasPengembalianDanaInvestasi(req, res) {
        let { invoice, tanggal_transaksi, jenis_investasi_id, nominal, deskripsi, company_id, akun_bank_id } = req.body;

        try {
            if (!company_id) {
                company_id = req.dataUsers.company_id
            }

            let cekInvoice = await sq.query(`select * from general_ledger gl where gl."deletedAt" isnull and gl.referensi_bukti = '${invoice}'`, s)
            if (cekInvoice.length > 0) {
                res.status(201).json({ status: 204, message: "data sudah ada" })
            } else {
                let jenisInvestasi = { id: uuid_v4(), tanggal_transaksi, pengurangan: nominal, keterangan: deskripsi, referensi_bukti: invoice, tanggal_persetujuan: tanggal_transaksi, akun_id: jenis_investasi_id, sisa_saldo: 0, status: 1, nama_transaksi: "pengeluaran kas pengembalian dana investasi", pegawai_id: req.dataUsers.id, company_id }
                let kas = { id: uuid_v4(), tanggal_transaksi, pengurangan: nominal, keterangan: deskripsi, referensi_bukti: invoice, tanggal_persetujuan: tanggal_transaksi, akun_id: akun_bank_id, sisa_saldo: 0, status: 1, nama_transaksi: "pengeluaran kas pengembalian dana investasi", pegawai_id: req.dataUsers.id, company_id }

                let hasil = await generalLedger.bulkCreate([jenisInvestasi, kas])
                res.status(200).json({ status: 200, message: "sukses", data: hasil })
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async approvalPengeluaranKasPengembalianDanaInvestasi(req, res) {
        const { id, tanggal_persetujuan, status } = req.body

        try {
            let cekId = await sq.query(`select * from general_ledger gl where gl."deletedAt" isnull and gl.id = '${id}'`, s)
            let cekAkun = await sq.query(`select c6.id as "coa6_id", gl.id as "general_ledger_id", * from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id join general_ledger gl on gl.akun_id = c6.id where c6."deletedAt" isnull and c5.company_id = '${req.dataUsers.company_id}' order by c6."kode_coa6"`, s)

            let akunJenisInvestasi = { id, tanggal_persetujuan, sisa_saldo: 0, status }
            let akunKas = { id: '', tanggal_persetujuan, sisa_saldo: 0, status }
            let akun_kas_id = ''
            let pengurangan = 0
            for (let i = 0; i < cekAkun.length; i++) {
                if (cekAkun[i].referensi_bukti == cekId[0].referensi_bukti) {
                    if (cekId[0].akun_id != cekAkun[i].akun_id) {
                        akun_kas_id = cekAkun[i].coa6_id
                        akunKas.id = cekAkun[i].general_ledger_id
                        pengurangan = cekAkun[i].pengurangan
                    } else {
                        akunJenisInvestasi.sisa_saldo = cekAkun[i].pengurangan
                    }
                }
            }

            let cekSaldo = await sq.query(`select c6.*, gl.sisa_saldo from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id and gl.status = 4 where gl."deletedAt" isnull and c6."deletedAt" isnull and c5.company_id = '${req.dataUsers.company_id}' and c6.id = '${akun_kas_id}' order by gl.tanggal_persetujuan desc limit 1`, s)

            if (cekSaldo[0].sisa_saldo == 0 || cekSaldo[0].sisa_saldo == null) {
                akunKas.sisa_saldo = cekSaldo[0].nominal_coa6 - pengurangan
            } else {
                akunKas.sisa_saldo = cekSaldo[0].sisa_saldo - pengurangan
            }

            if (status == 4) {
                await generalLedger.bulkCreate([akunJenisInvestasi, akunKas], { updateOnDuplicate: ["sisa_saldo", "status", "tanggal_persetujuan"] })
                res.status(200).json({ status: 200, message: "sukses" })
            } else {
                await generalLedger.bulkCreate([akunJenisInvestasi, akunKas], { updateOnDuplicate: ["status"] })
                res.status(200).json({ status: 200, message: "sukses" })
            }
        } catch (err) {
            console.log(req.body)
            console.log(err)
            res.status(500).json({ status: 500, message: "gagal", data: err })
        }
    }

    static async pengeluaranKasPembayaranDanaInvestasi(req, res) {
        let { invoice, tanggal_transaksi, jenis_investasi_id, nominal, deskripsi, company_id, akun_bank_id } = req.body;

        try {
            if (!company_id) {
                company_id = req.dataUsers.company_id
            }

            let cekInvoice = await sq.query(`select * from general_ledger gl where gl."deletedAt" isnull and gl.referensi_bukti = '${invoice}'`, s)
            if (cekInvoice.length > 0) {
                res.status(201).json({ status: 204, message: "data sudah ada" })
            } else {
                let jenisInvestasi = { id: uuid_v4(), tanggal_transaksi, pengurangan: nominal, keterangan: deskripsi, referensi_bukti: invoice, tanggal_persetujuan: tanggal_transaksi, akun_id: jenis_investasi_id, sisa_saldo: 0, status: 1, nama_transaksi: "pengeluaran kas pembayaran dana investasi", pegawai_id: req.dataUsers.id, company_id }
                let kas = { id: uuid_v4(), tanggal_transaksi, pengurangan: nominal, keterangan: deskripsi, referensi_bukti: invoice, tanggal_persetujuan: tanggal_transaksi, akun_id: akun_bank_id, sisa_saldo: 0, status: 1, nama_transaksi: "pengeluaran kas pembayaran dana investasi", pegawai_id: req.dataUsers.id, company_id }

                let hasil = await generalLedger.bulkCreate([jenisInvestasi, kas])
                res.status(200).json({ status: 200, message: "sukses", data: hasil })
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async approvalPengeluaranKasPembayaranDanaInvestasi(req, res) {
        const { id, tanggal_persetujuan, status } = req.body

        try {
            let cekId = await sq.query(`select * from general_ledger gl where gl."deletedAt" isnull and gl.id = '${id}'`, s)
            let cekAkun = await sq.query(`select c6.id as "coa6_id", gl.id as "general_ledger_id", * from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id join general_ledger gl on gl.akun_id = c6.id where c6."deletedAt" isnull and c5.company_id = '${req.dataUsers.company_id}' order by c6."kode_coa6"`, s)

            let akunJenisInvestasi = { id, tanggal_persetujuan, sisa_saldo: 0, status }
            let akunKas = { id: '', tanggal_persetujuan, sisa_saldo: 0, status }
            let akun_kas_id = ''
            let pengurangan = 0
            for (let i = 0; i < cekAkun.length; i++) {
                if (cekAkun[i].referensi_bukti == cekId[0].referensi_bukti) {
                    if (cekId[0].akun_id != cekAkun[i].akun_id) {
                        akun_kas_id = cekAkun[i].coa6_id
                        akunKas.id = cekAkun[i].general_ledger_id
                        pengurangan = cekAkun[i].pengurangan
                    } else {
                        akunJenisInvestasi.sisa_saldo = cekAkun[i].pengurangan
                    }
                }
            }

            let cekSaldo = await sq.query(`select c6.*, gl.sisa_saldo from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id and gl.status = 4 where gl."deletedAt" isnull and c6."deletedAt" isnull and c5.company_id = '${req.dataUsers.company_id}' and c6.id = '${akun_kas_id}' order by gl.tanggal_persetujuan desc limit 1`, s)

            if (cekSaldo[0].sisa_saldo == 0 || cekSaldo[0].sisa_saldo == null) {
                akunKas.sisa_saldo = cekSaldo[0].nominal_coa6 - pengurangan
            } else {
                akunKas.sisa_saldo = cekSaldo[0].sisa_saldo - pengurangan
            }

            if (status == 4) {
                await generalLedger.bulkCreate([akunJenisInvestasi, akunKas], { updateOnDuplicate: ["sisa_saldo", "status", "tanggal_persetujuan"] })
                res.status(200).json({ status: 200, message: "sukses" })
            } else {
                await generalLedger.bulkCreate([akunJenisInvestasi, akunKas], { updateOnDuplicate: ["status"] })
                res.status(200).json({ status: 200, message: "sukses" })
            }
        } catch (err) {
            console.log(req.body)
            console.log(err)
            res.status(500).json({ status: 500, message: "gagal", data: err })
        }
    }

    static async listPengeluaranKasPengembalianDanaInvestasi(req, res) {
        try {
            let data = await sq.query(`select gl.id as "general_ledger_id", * from general_ledger gl join coa6 c6 on c6.id = gl.akun_id join coa5 c5 on c5.id = c6.coa5_id where gl."deletedAt" isnull and c6."deletedAt" isnull and c5."deletedAt" isnull and gl.nama_transaksi = 'pengeluaran kas pengembalian dana investasi' and c5.company_id = '${req.dataUsers.company_id}' order by gl."createdAt" desc `, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listPengeluaranKasPembayaranDanaInvestasi(req, res) {
        try {
            let data = await sq.query(`select gl.id as "general_ledger_id", * from general_ledger gl join coa6 c6 on c6.id = gl.akun_id join coa5 c5 on c5.id = c6.coa5_id where gl."deletedAt" isnull and c6."deletedAt" isnull and c5."deletedAt" isnull and gl.nama_transaksi = 'pengeluaran kas pembayaran dana investasi' and c5.company_id = '${req.dataUsers.company_id}' order by gl."createdAt" desc `, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async pengeluaranKasUntukPegawai(req, res) {
        let { coa6_id_beban, tanggal_transaksi, nomor_invoice, jumlah_hak_pembayaran, coa6_id_pajak, tarif_pph_21, nilai_potongan, jumlah_dibayarkan, keterangan_pembayaran, akun_kas_id, company_id } = req.body;

        try {
            if (!company_id) {
                company_id = req.dataUsers.company_id
            }

            let cekInvoice = await sq.query(`select * from general_ledger gl where gl."deletedAt" isnull and gl.referensi_bukti = '${nomor_invoice}'`, s)
            if (cekInvoice.length > 0) {
                res.status(201).json({ status: 204, message: "data sudah ada" })
            } else {
                let akunKas = await sq.query(`select c6.* from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.id = '${akun_kas_id}'`, s)

                let bebanPegawai = { id: uuid_v4(), tanggal_transaksi, penambahan: jumlah_hak_pembayaran, keterangan: keterangan_pembayaran, referensi_bukti: nomor_invoice, nama_transaksi: "pengeluaran kas untuk pegawai", status: 1, akun_id: coa6_id_beban, pegawai_id: req.dataUsers.id, company_id }
                let utangPajak = { id: uuid_v4(), tanggal_transaksi, penambahan: nilai_potongan, keterangan: keterangan_pembayaran, referensi_bukti: nomor_invoice, nama_transaksi: "pengeluaran kas untuk pegawai", status: 1, akun_id: coa6_id_pajak, pegawai_id: req.dataUsers.id, company_id }
                let kas = { id: uuid_v4(), tanggal_transaksi, pengurangan: jumlah_dibayarkan, keterangan: keterangan_pembayaran, referensi_bukti: nomor_invoice, nama_transaksi: "pengeluaran kas untuk pegawai", status: 1, akun_id: akunKas[0].id, pegawai_id: req.dataUsers.id, company_id }

                let hasil = await generalLedger.bulkCreate([bebanPegawai, utangPajak, kas])
                res.status(200).json({ status: 200, message: "sukses", data: hasil })
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async approvalPengeluaranKasUntukPegawai(req, res) {
        let { id, tanggal_persetujuan, status } = req.body;

        try {
            let cekId = await sq.query(`select * from general_ledger gl where gl."deletedAt" isnull and gl.id = '${id}'`, s)
            let cekAkun = await sq.query(`select c6.id as "coa6_id", gl.id as "general_ledger_id", * from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id join general_ledger gl on gl.akun_id = c6.id where c6."deletedAt" isnull and c5.company_id = '${req.dataUsers.company_id}' order by c6."kode_coa6"`, s)

            let akunBebanPegawai = { id, tanggal_persetujuan, sisa_saldo: 0, status }
            let akunUtangPajak = { id: '', tanggal_persetujuan, sisa_saldo: 0, status }
            let akunKas = { id: '', tanggal_persetujuan, sisa_saldo: 0, status }
            let akun_kas_id = ''
            let pengurangan = 0
            for (let i = 0; i < cekAkun.length; i++) {
                if (cekAkun[i].referensi_bukti == cekId[0].referensi_bukti) {
                    if (cekAkun[i].akun_id != cekId[0].akun_id) {
                        if (cekAkun[i].penambahan == 0) {
                            akun_kas_id = cekAkun[i].coa6_id
                            akunKas.id = cekAkun[i].general_ledger_id
                            pengurangan = cekAkun[i].pengurangan
                        } else {
                            akunUtangPajak.id = cekAkun[i].general_ledger_id
                            akunUtangPajak.sisa_saldo = cekAkun[i].penambahan
                        }
                    } else {
                        akunBebanPegawai.sisa_saldo = cekAkun[i].penambahan
                    }
                }
            }

            let cekSaldo = await sq.query(`select c6.*, gl.sisa_saldo from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id and gl.status = 4 where gl."deletedAt" isnull and c6."deletedAt" isnull and c5.company_id = '${req.dataUsers.company_id}' and c6.id = '${akun_kas_id}' order by gl.tanggal_persetujuan desc limit 1`, s)

            if (cekSaldo[0].sisa_saldo == 0 || cekSaldo[0].sisa_saldo == null) {
                akunKas.sisa_saldo = cekSaldo[0].nominal_coa6 - pengurangan
            } else {
                akunKas.sisa_saldo = cekSaldo[0].sisa_saldo - pengurangan
            }

            if (status == 4) {
                await generalLedger.bulkCreate([akunBebanPegawai, akunUtangPajak, akunKas], { updateOnDuplicate: ["sisa_saldo", "status", "tanggal_persetujuan"] })
                res.status(200).json({ status: 200, message: "sukses" })
            } else {
                await generalLedger.bulkCreate([akunBebanPegawai, akunUtangPajak, akunKas], { updateOnDuplicate: ["status"] })
                res.status(200).json({ status: 200, message: "sukses" })
            }

        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listpengeluaranKasUntukPegawai(req, res) {
        try {
            let data = await sq.query(`select gl.id as "general_ledger_id", * from general_ledger gl join coa6 c6 on c6.id = gl.akun_id join coa5 c5 on c5.id = c6.coa5_id where gl."deletedAt" isnull and c6."deletedAt" isnull and c5."deletedAt" isnull and gl.nama_transaksi = 'pengeluaran kas untuk pegawai' and c5.company_id = '${req.dataUsers.company_id}' order by gl."createdAt" desc `, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async pengeluaranKasNonPegawai(req, res) {
        let { coa6_id_biaya, tanggal_transaksi, nomor_invoice, jumlah_hak_pembayaran, coa6_id_pajak, tarif_pph_21, nilai_potongan, jumlah_dibayarkan, keterangan_pembayaran, akun_kas_id, company_id } = req.body;

        try {
            if (!company_id) {
                company_id = req.dataUsers.company_id
            }
            let cekInvoice = await sq.query(`select * from general_ledger gl where gl."deletedAt" isnull and gl.referensi_bukti = '${nomor_invoice}'`, s)
            if (cekInvoice.length > 0) {
                res.status(201).json({ status: 204, message: "data sudah ada" })
            } else {
                let pengeluaran = []
                let akunKas = await sq.query(`select c6.* from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.id = '${akun_kas_id}'`, s)

                let biaya = { id: uuid_v4(), tanggal_transaksi, penambahan: jumlah_hak_pembayaran, keterangan: keterangan_pembayaran, referensi_bukti: nomor_invoice, nama_transaksi: "pengeluaran kas non pegawai", status: 1, akun_id: coa6_id_biaya, pegawai_id: req.dataUsers.id, company_id }
                let utangPajak = { id: uuid_v4(), tanggal_transaksi, penambahan: nilai_potongan, keterangan: keterangan_pembayaran, referensi_bukti: nomor_invoice, nama_transaksi: "pengeluaran kas non pegawai", status: 1, akun_id: coa6_id_pajak, pegawai_id: req.dataUsers.id, company_id }
                let kas = { id: uuid_v4(), tanggal_transaksi, pengurangan: jumlah_hak_pembayaran, keterangan: keterangan_pembayaran, referensi_bukti: nomor_invoice, nama_transaksi: "pengeluaran kas non pegawai", status: 1, akun_id: akunKas[0].id, pegawai_id: req.dataUsers.id, company_id }

                if (coa6_id_pajak) {
                    pengeluaran.push(biaya, utangPajak, kas)
                } else {
                    pengeluaran.push(biaya, kas)
                }
                // console.log(pengeluaran);
                let hasil = await generalLedger.bulkCreate(pengeluaran)
                res.status(200).json({ status: 200, message: "sukses", data: hasil })
            }

        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async approvalPengeluaranKasNonPegawai(req, res) {
        let { id, tanggal_persetujuan, status } = req.body;

        try {
            let cekId = await sq.query(`select * from general_ledger gl where gl."deletedAt" isnull and gl.id = '${id}'`, s)
            let cekAkun = await sq.query(`select c6.id as "coa6_id", gl.id as "general_ledger_id", * from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id join general_ledger gl on gl.akun_id = c6.id where c6."deletedAt" isnull and c5.company_id = '${req.dataUsers.company_id}' order by c6."kode_coa6"`, s)

            let akunBiaya = { id, tanggal_persetujuan, sisa_saldo: 0, status }
            let akunUtangPajak = { id: '', tanggal_persetujuan, sisa_saldo: 0, status }
            let akunKas = { id: '', tanggal_persetujuan, sisa_saldo: 0, status }
            let akun_kas_id = ''
            let pengurangan = 0

            for (let i = 0; i < cekAkun.length; i++) {
                if (cekAkun[i].referensi_bukti == cekId[0].referensi_bukti) {
                    if (cekAkun[i].akun_id != cekId[0].akun_id) {
                        if (cekAkun[i].penambahan == 0) {
                            akun_kas_id = cekAkun[i].coa6_id
                            akunKas.id = cekAkun[i].general_ledger_id
                            pengurangan = cekAkun[i].pengurangan
                        } else {
                            akunUtangPajak.id = cekAkun[i].general_ledger_id
                            akunUtangPajak.sisa_saldo = cekAkun[i].penambahan
                        }
                    } else {
                        akunBiaya.sisa_saldo = cekAkun[i].penambahan
                    }
                }
            }

            let cekSaldo = await sq.query(`select c6.*, gl.sisa_saldo from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id and gl.status = 4 where gl."deletedAt" isnull and c6."deletedAt" isnull and c5.company_id = '${req.dataUsers.company_id}' and c6.id = '${akun_kas_id}' order by gl.tanggal_persetujuan desc limit 1`, s)

            if (cekSaldo[0].sisa_saldo == 0 || cekSaldo[0].sisa_saldo == null) {
                akunKas.sisa_saldo = cekSaldo[0].nominal_coa6 - pengurangan
            } else {
                akunKas.sisa_saldo = cekSaldo[0].sisa_saldo - pengurangan
            }

            let pengeluaran = []
            if (akunUtangPajak.id == '') {
                pengeluaran.push(akunBiaya, akunKas)
            } else {
                pengeluaran.push(akunBiaya, akunUtangPajak, akunKas)
            }

            if (status == 4) {
                await generalLedger.bulkCreate(pengeluaran, { updateOnDuplicate: ["sisa_saldo", "status", "tanggal_persetujuan"] })
                res.status(200).json({ status: 200, message: "sukses" })
            } else {
                await generalLedger.bulkCreate(pengeluaran, { updateOnDuplicate: ["status"] })
                res.status(200).json({ status: 200, message: "sukses" })
            }

        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listpengeluaranKasNonPegawai(req, res) {
        try {
            let data = await sq.query(`select gl.id as "general_ledger_id", * from general_ledger gl join coa6 c6 on c6.id = gl.akun_id join coa5 c5 on c5.id = c6.coa5_id where gl."deletedAt" isnull and c6."deletedAt" isnull and c5."deletedAt" isnull and gl.nama_transaksi = 'pengeluaran kas non pegawai' and c5.company_id = '${req.dataUsers.company_id}' order by gl."createdAt" desc `, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listPembayaranKewajibanLainVendorByStatusPersetujuan(req, res) {
        const { status } = req.body
        try {
            let data = await sq.query(`select gl.id as general_ledger_id,*
            from general_ledger gl
            left join pembelian p on p.id = gl.pembelian_id 
            join coa6 c6 on c6.id = gl.akun_id 
            where gl."deletedAt" isnull and gl.nama_transaksi = 'pembayaran kewajiban lain pada vendor' and gl.status = '' order by gl."createdAt" desc`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }
}
module.exports = Controller;