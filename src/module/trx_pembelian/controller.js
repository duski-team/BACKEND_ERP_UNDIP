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

    static async acceptPersetujuanPersediaan(req, res) {
        let { id,status_persetujuan_txp,tgl_persetujuan_akuntan_txp,tgl_persetujuan_manajer_txp } = req.body

        const t = await sq.transaction();
        try { 

            let cekStatus = await sq.query(`select tp.*,p.company_id,p.vendor_id,p.tanggal_pembelian,p.coa6_id,p.persediaan_id,p2.stock,p2.harga_satuan,(tp.jumlah_txp+p2.stock) as total_stock from trx_pembelian tp join pembelian p on p.id = tp.pembelian_id left join persediaan p2 on p2.id = p.persediaan_id where tp."deletedAt" isnull and tp.id = '${id}'`,s);

             // 4: akuntansi
            if(cekStatus[0].status_persetujuan_txp == 4){
                res.status(201).json({ status: 204, message: "status sudah 4" });
            }else{
                if(status_persetujuan_txp == 4){

                    let akunHutang = await sq.query(`select c6.*,gl.sisa_saldo from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id and gl.status = 4 where c6."deletedAt" isnull and c5.company_id = '${cekStatus[0].company_id}' and c6.kode_coa6 = '2.1.7.1.01.0001' order by gl.tanggal_persetujuan desc,gl.sisa_saldo desc limit 1`,s);
                    let akunBarang = await sq.query(`select gl.sisa_saldo from general_ledger gl where gl."deletedAt" isnull and gl.akun_id = '${cekStatus[0].coa6_id}' and gl.status = 4 order by gl.tanggal_persetujuan desc,gl.sisa_saldo desc`,s);
                    let hargaTotal = cekStatus[0].harga_total_txp
                    let tglPembelian = cekStatus[0].tanggal_pembelian

                    let saldoBarang = akunBarang.length>0?akunBarang[0].sisa_saldo+hargaTotal:hargaTotal
                    let saldoHutang = !akunHutang[0].sisa_saldo?hargaTotal:akunHutang[0].sisa_saldo+hargaTotal

                    let barang = {id:uuid_v4(),sisa_saldo:saldoBarang,tanggal_transaksi:tglPembelian,penambahan:hargaTotal,pembelian_id:cekStatus[0].pembelian_id,akun_id:cekStatus[0].coa6_id,vendor_id:cekStatus[0].vendor_id,company_id:cekStatus[0].company_id,tanggal_persetujuan:tgl_persetujuan_akuntan_txp,nama_transaksi:"pembelian persediaan",status:4,nama:"barang"}
                    
                    let hutang = {id:uuid_v4(),sisa_saldo:saldoHutang,tanggal_transaksi:tglPembelian,penambahan:hargaTotal,pembelian_id:cekStatus[0].pembelian_id,akun_id:akunHutang[0].id,vendor_id:cekStatus[0].vendor_id,company_id:cekStatus[0].company_id,tanggal_persetujuan:tgl_persetujuan_akuntan_txp,nama_transaksi:"pembelian persediaan",status:4,nama:"hutang"}

                    await generalLedger.bulkCreate([barang,hutang],{transaction:t})
                    
                    if(cekStatus[0].persediaan_id){
                        await persediaan.update({stock:cekStatus[0].total_stock,harga_satuan:cekStatus[0].harga_satuan_txp},{where:{id:cekStatus[0].persediaan_id},transaction:t})
                    }
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

    static async acceptPersetujuanAsset(req, res) {
        let { id,status_persetujuan_txp,tgl_persetujuan_akuntan_txp,tgl_persetujuan_manajer_txp } = req.body

        const t = await sq.transaction();
        try { 

            let cekStatus = await sq.query(`select tp.*,p.company_id,p.vendor_id,p.tanggal_pembelian,p.coa6_id,p.persediaan_id,p2.stock,p2.harga_satuan,(tp.jumlah_txp+p2.stock) as total_stock from trx_pembelian tp join pembelian p on p.id = tp.pembelian_id left join persediaan p2 on p2.id = p.persediaan_id where tp."deletedAt" isnull and tp.id = '${id}'`,s);

             // 4: akuntansi
            if(cekStatus[0].status_persetujuan_txp == 4){
                res.status(201).json({ status: 204, message: "status sudah 4" });
            }else{
                if(status_persetujuan_txp == 4){

                    let akunHutang = await sq.query(`select c6.*,gl.sisa_saldo from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id and gl.status = 4 where c6."deletedAt" isnull and c5.company_id = '${cekStatus[0].company_id}' and c6.kode_coa6 = '2.1.7.1.01.0001' order by gl.tanggal_persetujuan desc,gl.sisa_saldo desc limit 1`,s);
                    let akunBarang = await sq.query(`select gl.sisa_saldo from general_ledger gl where gl."deletedAt" isnull and gl.akun_id = '${cekStatus[0].coa6_id}' and gl.status = 4 order by gl.tanggal_persetujuan desc,gl.sisa_saldo desc`,s);
                    let hargaTotal = cekStatus[0].harga_total_txp
                    let tglPembelian = cekStatus[0].tanggal_pembelian

                    let saldoBarang = akunBarang.length>0?akunBarang[0].sisa_saldo+hargaTotal:hargaTotal
                    let saldoHutang = !akunHutang[0].sisa_saldo?hargaTotal:akunHutang[0].sisa_saldo+hargaTotal

                    let barang = {id:uuid_v4(),sisa_saldo:saldoBarang,tanggal_transaksi:tglPembelian,penambahan:hargaTotal,pembelian_id:cekStatus[0].pembelian_id,akun_id:cekStatus[0].coa6_id,vendor_id:cekStatus[0].vendor_id,company_id:cekStatus[0].company_id,tanggal_persetujuan:tgl_persetujuan_akuntan_txp,nama_transaksi:"pembelian aset",status:4,nama:"barang"}
                    
                    let hutang = {id:uuid_v4(),sisa_saldo:saldoHutang,tanggal_transaksi:tglPembelian,penambahan:hargaTotal,pembelian_id:cekStatus[0].pembelian_id,akun_id:akunHutang[0].id,vendor_id:cekStatus[0].vendor_id,company_id:cekStatus[0].company_id,tanggal_persetujuan:tgl_persetujuan_akuntan_txp,nama_transaksi:"pembelian aset",status:4,nama:"hutang"}

                    await generalLedger.bulkCreate([barang,hutang],{transaction:t})
                    
                    if(cekStatus[0].persediaan_id){
                        await persediaan.update({stock:cekStatus[0].total_stock,harga_satuan:cekStatus[0].harga_satuan_txp},{where:{id:cekStatus[0].persediaan_id},transaction:t})
                    }
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

    // static async acceptPersetujuanPersediaan(req, res) {
    //     let { id,status_persetujuan_txp,tgl_persetujuan_akuntan_txp,tgl_persetujuan_manajer_txp } = req.body

    //     const t = await sq.transaction();
    //     try { 

    //         let cekStatus = await sq.query(`select tp.*,p.company_id,p.tanggal_pembelian,p.coa6_id,p.persediaan_id,p2.stock,p2.harga_satuan,(tp.jumlah_txp+p2.stock) as total_stock from trx_pembelian tp join pembelian p on p.id = tp.pembelian_id left join persediaan p2 on p2.id = p.persediaan_id where tp."deletedAt" isnull and tp.id = '${id}'`,s);

    //          // 4: akuntansi
    //         if(cekStatus[0].status_persetujuan_txp == 4){
    //             res.status(201).json({ status: 204, message: "status sudah 4" });
    //         }else{
    //             if(status_persetujuan_txp == 4){

    //                 let akunHutang = await sq.query(`select c6.*,gl.sisa_saldo from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id and gl.status = 4 where c6."deletedAt" isnull and c5.company_id = '${cekStatus[0].company_id}' and c6.kode_coa6 = '2.1.7.1.01.0001' order by gl.tanggal_persetujuan desc,gl.sisa_saldo desc limit 1`,s);
    //                 let akunBarang = await sq.query(`select gl.sisa_saldo from general_ledger gl where gl."deletedAt" isnull and gl.akun_id = '${cekStatus[0].coa6_id}' and gl.status = 4 order by gl.tanggal_persetujuan desc,gl.sisa_saldo desc`,s);
    //                 let hargaTotal = cekStatus[0].harga_total_txp
    //                 let tglPembelian = cekStatus[0].tanggal_pembelian

    //                 let saldoBarang = akunBarang.length>0?akunBarang[0].sisa_saldo+hargaTotal:hargaTotal
    //                 let saldoHutang = !akunHutang[0].sisa_saldo?hargaTotal:akunHutang[0].sisa_saldo+hargaTotal

    //                 let barang = {id:uuid_v4(),sisa_saldo:saldoBarang,tanggal_transaksi:tglPembelian,penambahan:hargaTotal,pembelian_id:cekStatus[0].pembelian_id,akun_id:cekStatus[0].coa6_id,akun_pasangan_id:akunHutang[0].id,tanggal_persetujuan:tgl_persetujuan_akuntan_txp,nama_transaksi:"pembelian persediaan",status:4,nama:"barang"}
                    
    //                 let hutang = {id:uuid_v4(),sisa_saldo:saldoHutang,tanggal_transaksi:tglPembelian,penambahan:hargaTotal,pembelian_id:cekStatus[0].pembelian_id,akun_id:akunHutang[0].id,akun_pasangan_id:cekStatus[0].coa6_id,tanggal_persetujuan:tgl_persetujuan_akuntan_txp,nama_transaksi:"pembelian persediaan",status:4,nama:"hutang"}

    //                 await generalLedger.bulkCreate([barang,hutang],{transaction:t})
                    
    //                 if(cekStatus[0].persediaan_id){
    //                     await persediaan.update({stock:cekStatus[0].total_stock,harga_satuan:cekStatus[0].harga_satuan_txp},{where:{id:cekStatus[0].persediaan_id},transaction:t})
    //                 }
    //             }
    
    //             await trxPembelian.update({tgl_persetujuan_akuntan_txp,tgl_persetujuan_manajer_txp,status_persetujuan_txp},{where:{id},transaction:t});
    //             await t.commit();
    //             res.status(200).json({ status: 200, message: "sukses" });
    //         }
    //     } catch (err) {
    //         await t.rollback();
    //         console.log(err);
    //         res.status(500).json({ status: 500, message: "gagal", data: err });
    //     }
    // }

    // static async acceptPersetujuanAsset(req, res) {
    //     let { id,status_persetujuan_txp,tgl_persetujuan_akuntan_txp,tgl_persetujuan_manajer_txp } = req.body

    //     const t = await sq.transaction();
    //     try { 

    //         let cekStatus = await sq.query(`select tp.*,p.company_id,p.tanggal_pembelian,p.coa6_id,p.persediaan_id,p2.stock,p2.harga_satuan,(tp.jumlah_txp+p2.stock) as total_stock from trx_pembelian tp join pembelian p on p.id = tp.pembelian_id left join persediaan p2 on p2.id = p.persediaan_id where tp."deletedAt" isnull and tp.id = '${id}'`,s);

    //          // 4: akuntansi
    //         if(cekStatus[0].status_persetujuan_txp == 4){
    //             res.status(201).json({ status: 204, message: "status sudah 4" });
    //         }else{
    //             if(status_persetujuan_txp == 4){

    //                 let akunHutang = await sq.query(`select c6.*,gl.sisa_saldo from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id and gl.status = 4 where c6."deletedAt" isnull and c5.company_id = '${cekStatus[0].company_id}' and c6.kode_coa6 = '2.1.7.1.01.0001' order by gl.tanggal_persetujuan desc,gl.sisa_saldo desc limit 1`,s);
    //                 let akunBarang = await sq.query(`select gl.sisa_saldo from general_ledger gl where gl."deletedAt" isnull and gl.akun_id = '${cekStatus[0].coa6_id}' and gl.status = 4 order by gl.tanggal_persetujuan desc,gl.sisa_saldo desc`,s);
    //                 let hargaTotal = cekStatus[0].harga_total_txp
    //                 let tglPembelian = cekStatus[0].tanggal_pembelian

    //                 let saldoBarang = akunBarang.length>0?akunBarang[0].sisa_saldo+hargaTotal:hargaTotal
    //                 let saldoHutang = !akunHutang[0].sisa_saldo?hargaTotal:akunHutang[0].sisa_saldo+hargaTotal

    //                 let barang = {id:uuid_v4(),sisa_saldo:saldoBarang,tanggal_transaksi:tglPembelian,penambahan:hargaTotal,pembelian_id:cekStatus[0].pembelian_id,akun_id:cekStatus[0].coa6_id,akun_pasangan_id:akunHutang[0].id,tanggal_persetujuan:tgl_persetujuan_akuntan_txp,nama_transaksi:"pembelian aset",status:4,nama:"barang"}
                    
    //                 let hutang = {id:uuid_v4(),sisa_saldo:saldoHutang,tanggal_transaksi:tglPembelian,penambahan:hargaTotal,pembelian_id:cekStatus[0].pembelian_id,akun_id:akunHutang[0].id,akun_pasangan_id:cekStatus[0].coa6_id,tanggal_persetujuan:tgl_persetujuan_akuntan_txp,nama_transaksi:"pembelian aset",status:4,nama:"hutang"}

    //                 await generalLedger.bulkCreate([barang,hutang],{transaction:t})
                    
    //                 if(cekStatus[0].persediaan_id){
    //                     await persediaan.update({stock:cekStatus[0].total_stock,harga_satuan:cekStatus[0].harga_satuan_txp},{where:{id:cekStatus[0].persediaan_id},transaction:t})
    //                 }
    //             }
    
    //             await trxPembelian.update({tgl_persetujuan_akuntan_txp,tgl_persetujuan_manajer_txp,status_persetujuan_txp},{where:{id},transaction:t});
    //             await t.commit();
    //             res.status(200).json({ status: 200, message: "sukses" });
    //         }
    //     } catch (err) {
    //         await t.rollback();
    //         console.log(err);
    //         res.status(500).json({ status: 500, message: "gagal", data: err });
    //     }
    // }
}
module.exports = Controller;