const { sq } = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const returBarang = require("./model");
const persediaan = require("../persediaan/model");
const generalLedger = require("../general_ledger/model");
const { QueryTypes } = require('sequelize');
const moment = require('moment');
const s = { type: QueryTypes.SELECT };


class Controller {

    static register(req, res) {
        let { harga_total, jumlah, tanggal_retur, keterangan, status_retur, no_invoice, akun_pajak_id, persentase_pajak, nominal_pajak, persediaan_id, order_id, total_harga_dan_pajak,pembelian_id,company_id } = req.body
        
        if (!company_id) {
            company_id = req.dataUsers.company_id
        }
        
        returBarang.create({ id: uuid_v4(), harga_total, jumlah, tanggal_retur, keterangan, status_retur, no_invoice, akun_pajak_id, persentase_pajak, nominal_pajak, persediaan_id, order_id, total_harga_dan_pajak,pembelian_id,company_id }).then(data => {
            res.status(200).json({ status: 200, message: "sukses", data });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static update(req, res) {

        const { id, harga_total, jumlah, tanggal_retur, keterangan, status_retur, no_invoice, akun_pajak_id, persentase_pajak, nominal_pajak, persediaan_id, order_id, total_harga_dan_pajak,pembelian_id,company_id } = req.body

        returBarang.findAll({where:{id}}).then(async data =>{
            if(data[0].status_retur >1){
                res.status(202).json({status:204,message:"status retur lebih dari 1"})
            }else{
                await returBarang.update({ harga_total, jumlah, tanggal_retur, keterangan, status_retur, no_invoice, akun_pajak_id, persentase_pajak, nominal_pajak, persediaan_id, order_id, total_harga_dan_pajak,pembelian_id,company_id }, { where: { id } }).then(data => {
                    res.status(200).json({ status: 200, message: "sukses" });
                })
            }
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static delete(req, res) {
        const { id } = req.body

        returBarang.findAll({where:{id}}).then(async data =>{
            if(data[0].status_retur>1){
                res.status(202).json({status:204,message:"status retur lebih dari 1"})
            }else{
                await returBarang.destroy({ where: { id } }).then(data => {
                    res.status(200).json({ status: 200, message: "sukses" });
                })
            }
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

    // static registerPenjualanBarang(req, res) {
    //     const { harga_total, jumlah, tanggal_retur, keterangan, status_retur, no_invoice, akun_pajak_id, persentase_pajak, nominal_pajak, persediaan_id, order_id, total_harga_dan_pajak,pembelian_id } = req.body
        
    //     returBarang.create({ id: uuid_v4(), harga_total, jumlah, tanggal_retur, keterangan, status_retur, no_invoice, akun_pajak_id, persentase_pajak, nominal_pajak, persediaan_id, order_id, total_harga_dan_pajak,pembelian_id }).then(data => {
    //         res.status(200).json({ status: 200, message: "sukses", data });
    //     }).catch(err => {
    //         console.log(req.body);
    //         console.log(err);
    //         res.status(500).json({ status: 500, message: "gagal", data: err });
    //     })
    // }

    // static async registerPenjualanKas(req, res) {
    //     let { harga_total, jumlah, tanggal_retur, keterangan, status_retur, no_invoice, akun_pajak_id, persentase_pajak, nominal_pajak, persediaan_id, order_id, total_harga_dan_pajak,pembelian_id,company_id } = req.body
        
    //     const t = await sq.transaction();
    //     try {
    //         if(!company_id){
    //             company_id = req.dataUsers.company_id
    //         }
    //         let idRetur = uuid_v4()
    //         let tanggal_persetujuan = moment().format();

    //         let data = await sq.query(`select p.*,c6.nominal_coa6,gl.sisa_saldo 
    //         from persediaan p join coa6 c6 on c6.id = p.coa6_id left join general_ledger gl on gl.akun_id = p.coa6_id and gl.status = 4 where p."deletedAt" isnull and p.id = '${persediaan_id}' order by gl.tanggal_persetujuan desc limit 1`,s);

    //         let hasil = []

    //         let akunHpp = await sq.query(`select c6.*,gl.sisa_saldo from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.kode_coa6 ='1.1.3.2.01.0009' order by gl.tanggal_persetujuan desc limit 1`,s);
    //         let akunPajak = await sq.query(`select c6.*,gl.sisa_saldo from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.id ='${akun_pajak_id}' order by gl.tanggal_persetujuan desc limit 1`,s);
    //         let akunKas = await sq.query(`select c6.*,gl.sisa_saldo from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.kode_coa6 ='2.1.7.2.01.0013' order by gl.tanggal_persetujuan desc limit 1`,s);
    //         let akunPenjualan = await sq.query(`select c6.*,gl.sisa_saldo from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.kode_coa6 ='6.2.4.3.01.0001' order by gl.tanggal_persetujuan desc limit 1`,s);
    //         let stock = data[0].stock + jumlah;
    //         let stock_rusak = data[0].stock_rusak + jumlah;

    //         let saldoBarang = data[0].sisa_saldo + harga_total
    //         let saldoHpp = akunHpp[0].sisa_saldo - harga_total
    //         let saldoPajak = akunPajak[0].sisa_saldo - nominal_pajak
    //         let saldoPenjualan = akunPenjualan[0].sisa_saldo - harga_total
    //         let saldoKas = akunKas[0].sisa_saldo

    //         let barang = {id:uuid_v4(),tanggal_transaksi:tanggal_retur,keterangan:keterangan,penambahan:harga_total,referensi_bukti:no_invoice,sisa_saldo:saldoBarang,tanggal_persetujuan,nama_transaksi:"retur kas penjualan",status:4,penjualan_id: order_id,akun_id:data[0].coa6_id,akun_pasangan_id:akunHpp[0].id,retur_barang_id:idRetur,nama:"barang"}

    //         let hpp = {id:uuid_v4(),tanggal_transaksi:tanggal_retur,keterangan:keterangan,pengurangan:harga_total,referensi_bukti:no_invoice,sisa_saldo:saldoHpp,tanggal_persetujuan,nama_transaksi:"retur kas penjualan",status:4,penjualan_id:order_id,akun_id:data[0].coa6_id,akun_pasangan_id:akunHpp[0].id,retur_barang_id:idRetur,nama:"hpp"}

    //         let pajak = {id:uuid_v4(),tanggal_transaksi:tanggal_retur,keterangan:keterangan,pengurangan:nominal_pajak,referensi_bukti:no_invoice,sisa_saldo:saldoPajak,tanggal_persetujuan,nama_transaksi:"retur kas penjualan",status:4,penjualan_id:order_id,akun_id:akunPajak[0].id,akun_pasangan_id:akunKas[0].id,retur_barang_id:idRetur,nama:"pajak"}

    //         let penjualan = {id:uuid_v4(),tanggal_transaksi:tanggal_retur,keterangan:keterangan,pengurangan:harga_total,referensi_bukti:no_invoice,sisa_saldo:saldoPenjualan,tanggal_persetujuan,nama_transaksi:"retur kas penjualan",status:4,penjualan_id:order_id,akun_id:akunPenjualan[0].id,akun_pasangan_id:akunKas[0].id,retur_barang_id:idRetur,nama:"penjualan"}

    //         let kasPajak = {id:uuid_v4(),tanggal_transaksi:tanggal_retur,keterangan:keterangan,pengurangan:nominal_pajak,referensi_bukti:no_invoice,sisa_saldo:saldoKas-=nominal_pajak,tanggal_persetujuan,nama_transaksi:"retur kas penjualan",status:4,penjualan_id:order_id,akun_id:akunKas[0].id,akun_pasangan_id:akunPajak[0].id,retur_barang_id:idRetur,nama:"kasPajak"}

    //         let kasPenjualan = {id:uuid_v4(),tanggal_transaksi:tanggal_retur,keterangan:keterangan,pengurangan:harga_total,referensi_bukti:no_invoice,sisa_saldo:saldoKas-=harga_total,tanggal_persetujuan,nama_transaksi:"retur kas penjualan",status:4,penjualan_id:order_id,akun_id:akunKas[0].id,akun_pasangan_id:akunPenjualan[0].id,retur_barang_id:idRetur,nama:"kasPenjualan"}

    //         hasil.push(barang,hpp,pajak,penjualan,kasPajak,kasPenjualan)


    //         // console.log(data);
    //         // console.log("======================================");
    //         // console.log(hasil);

    //         await returBarang.create({ id:idRetur, harga_total, jumlah, tanggal_retur, keterangan, status_retur, no_invoice, akun_pajak_id, persentase_pajak, nominal_pajak, persediaan_id, order_id, total_harga_dan_pajak,pembelian_id },{transaction:t})
    //         await persediaan.update({stock,stock_rusak},{where:{id:persediaan_id},transaction:t});
    //         await generalLedger.bulkCreate(hasil,{transaction:t});
    //         await t.commit();

    //         res.status(200).json({status:200,message:"sukses"})
    //     } catch (err) {
    //         await t.rollback()
    //         console.log(req.body);
    //         console.log(err);
    //         res.status(500).json({ status: 500, message: "gagal", data: err });
    //     }
    // }
    
    // static registerPembelianBarang(req, res) {
    //     const { harga_total, jumlah, tanggal_retur, keterangan, status_retur, no_invoice, akun_pajak_id, persentase_pajak, nominal_pajak, persediaan_id, order_id, total_harga_dan_pajak,pembelian_id } = req.body
        
    //     returBarang.create({ id: uuid_v4(), harga_total, jumlah, tanggal_retur, keterangan, status_retur, no_invoice, akun_pajak_id, persentase_pajak, nominal_pajak, persediaan_id, order_id, total_harga_dan_pajak,pembelian_id }).then(data => {
    //         res.status(200).json({ status: 200, message: "sukses", data });
    //     }).catch(err => {
    //         console.log(req.body);
    //         console.log(err);
    //         res.status(500).json({ status: 500, message: "gagal", data: err });
    //     })
    // }
    
    // static async registerPembelianKas(req, res) {
    //     let { harga_total, jumlah, tanggal_retur, keterangan, status_retur, no_invoice, akun_pajak_id, persentase_pajak, nominal_pajak, persediaan_id, order_id, total_harga_dan_pajak,pembelian_id,company_id } = req.body;

    //     const t = await sq.transaction();
    //     try {
    //         if(!company_id){
    //             company_id = req.dataUsers.company_id
    //         }
    //         let hasil = []
    //         let data = await sq.query(`select p.*,gl.sisa_saldo from persediaan p left join general_ledger gl on gl.akun_id = p.coa6_id and gl.status = 4 where p."deletedAt" isnull and p.id = '${persediaan_id}' order by gl.tanggal_persetujuan desc limit 1`,s);
    //         let akunHutang = await sq.query(`select c6.*,gl.sisa_saldo from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id and gl.status = 4 where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.kode_coa6 = '2.1.7.1.01.0001' order by gl.tanggal_persetujuan desc limit 1`,s);

    //         let idRetur = uuid_v4();
    //         let totalHargaBarang = harga_total * jumlah
    //         let saldoBarang = data[0].sisa_saldo - totalHargaBarang
    //         let saldoHutang = akunHutang[0].sisa_saldo - totalHargaBarang
    //         let stock = data[0].stock - jumlah
     
    //         let barang = {id:uuid_v4(),tanggal_transaksi:tanggal_retur,keterangan:keterangan,pengurangan:totalHargaBarang,referensi_bukti:no_invoice,sisa_saldo:saldoBarang,tanggal_persetujuan:tanggal_retur,nama_transaksi:"retur kas pembelian",status:4,pembelian_id:pembelian_id,akun_id:data[0].coa6_id,akun_pasangan_id:akunHutang[0].id,retur_barang_id:idRetur,nama:"barang"}
    //         let hutang = {id:uuid_v4(),tanggal_transaksi:tanggal_retur,keterangan:keterangan,pengurangan:totalHargaBarang,referensi_bukti:no_invoice,sisa_saldo:saldoHutang,tanggal_persetujuan:tanggal_retur,nama_transaksi:"retur kas pembelian",status:4,pembelian_id:pembelian_id,akun_id:akunHutang[0].id,akun_pasangan_id:data[0].coa6_id,retur_barang_id:idRetur,nama:"hutang"}

    //         hasil.push(barang,hutang)

    //         await returBarang.create({ id: idRetur, harga_total, jumlah, tanggal_retur, keterangan, status_retur, no_invoice, akun_pajak_id, persentase_pajak, nominal_pajak, persediaan_id, order_id, total_harga_dan_pajak,pembelian_id },{transaction:t})
    //         await persediaan.update({stock},{where:{id:persediaan_id}});
    //         await generalLedger.bulkCreate(hasil,{transaction:t})
    //         await t.commit();
    //         res.status(200).json({ status: 200, message: "sukses"});
    //     } catch (err) {
    //         await t.rollback();
    //         console.log(req.body);
    //         console.log(err);
    //         res.status(500).json({ status: 500, message: "gagal", data: err });
    //     }
    // }

    // static async acceptReturPenjualanBarang(req,res){
    //     let {id,status_retur,tanggal_persetujuan,company_id} = req.body;

    //     const t = await sq.transaction();
    //     try {
    //         if(!company_id){
    //             company_id = req.dataUsers.company_id
    //         }
    //         let data = await sq.query(`select rb.*,p.nama_persediaan,p.stock,p.stock_rusak,p.coa6_id,gl.sisa_saldo,c6.nominal_coa6 from retur_barang rb join persediaan p on p.id = rb.persediaan_id left join general_ledger gl on gl.akun_id = p.coa6_id and gl.status = 4 join coa6 c6 on c6.id = p.coa6_id where
    //         rb."deletedAt" isnull and rb.id = '${id}' order by gl.tanggal_persetujuan desc limit 1`,s);

    //         if(data[0].status_retur == 4){
    //             res.status(201).json({ status: 204, message: "status retur 4" });
    //         }else{
    //             if(status_retur == 4){
    //                 let hasil = []

    //                 let akunHpp = await sq.query(`select c6.*,gl.sisa_saldo from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.kode_coa6 ='1.1.3.2.01.0009' order by gl.tanggal_persetujuan desc limit 1`,s);
    //                 let akunPajak = await sq.query(`select c6.*,gl.sisa_saldo from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.id ='${data[0].akun_pajak_id}' order by gl.tanggal_persetujuan desc limit 1`,s);
    //                 let akunKas = await sq.query(`select c6.*,gl.sisa_saldo from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.kode_coa6 ='2.1.7.2.01.0013' order by gl.tanggal_persetujuan desc limit 1`,s);
    //                 let akunPenjualan = await sq.query(`select c6.*,gl.sisa_saldo from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.kode_coa6 ='6.2.4.3.01.0001' order by gl.tanggal_persetujuan desc limit 1`,s);
    //                 let stock = data[0].stock + data[0].jumlah;
    //                 let stock_rusak = data[0].stock_rusak + data[0].jumlah;
    //                 let totalBarang = data[0].harga_total * data[0].jumlah
                    
    //                 let saldoBarang = data[0].sisa_saldo + totalBarang
    //                 let saldoHpp = akunHpp[0].sisa_saldo - totalBarang
    //                 let saldoPajak = akunPajak[0].sisa_saldo - data[0].nominal_pajak
    //                 let saldoPenjualan = akunPenjualan[0].sisa_saldo - totalBarang
    //                 let saldoKas = akunKas[0].sisa_saldo

    //                 let barang = {id:uuid_v4(),tanggal_transaksi:data[0].tanggal_retur,keterangan:data[0].keterangan,penambahan:totalBarang,referensi_bukti:data[0].no_invoice,sisa_saldo:saldoBarang,tanggal_persetujuan,nama_transaksi:"retur barang penjualan",status:4,penjualan_id:data[0].order_id,akun_id:data[0].coa6_id,akun_pasangan_id:akunHpp[0].id,retur_barang_id:data[0].id,nama:"barang"}

    //                 let hpp = {id:uuid_v4(),tanggal_transaksi:data[0].tanggal_retur,keterangan:data[0].keterangan,pengurangan:totalBarang,referensi_bukti:data[0].no_invoice,sisa_saldo:saldoHpp,tanggal_persetujuan,nama_transaksi:"retur barang penjualan",status:4,penjualan_id:data[0].order_id,akun_id:data[0].coa6_id,akun_pasangan_id:akunHpp[0].id,retur_barang_id:data[0].id,nama:"hpp"}

    //                 let pajak = {id:uuid_v4(),tanggal_transaksi:data[0].tanggal_retur,keterangan:data[0].keterangan,pengurangan:data[0].nominal_pajak,referensi_bukti:data[0].no_invoice,sisa_saldo:saldoPajak,tanggal_persetujuan,nama_transaksi:"retur barang penjualan",status:4,penjualan_id:data[0].order_id,akun_id:akunPajak[0].id,akun_pasangan_id:akunKas[0].id,retur_barang_id:data[0].id,nama:"pajak"}

    //                 let penjualan = {id:uuid_v4(),tanggal_transaksi:data[0].tanggal_retur,keterangan:data[0].keterangan,pengurangan:totalBarang,referensi_bukti:data[0].no_invoice,sisa_saldo:saldoPenjualan,tanggal_persetujuan,nama_transaksi:"retur barang penjualan",status:4,penjualan_id:data[0].order_id,akun_id:akunPenjualan[0].id,akun_pasangan_id:akunKas[0].id,retur_barang_id:data[0].id,nama:"penjualan"}

    //                 let kasPajak = {id:uuid_v4(),tanggal_transaksi:data[0].tanggal_retur,keterangan:data[0].keterangan,pengurangan:data[0].nominal_pajak,referensi_bukti:data[0].no_invoice,sisa_saldo:saldoKas-=data[0].nominal_pajak,tanggal_persetujuan,nama_transaksi:"retur barang penjualan",status:4,penjualan_id:data[0].order_id,akun_id:akunKas[0].id,akun_pasangan_id:akunPajak[0].id,retur_barang_id:data[0].id,nama:"kasPajak"}

    //                 let kasPenjualan = {id:uuid_v4(),tanggal_transaksi:data[0].tanggal_retur,keterangan:data[0].keterangan,pengurangan:totalBarang,referensi_bukti:data[0].no_invoice,sisa_saldo:saldoKas-=totalBarang,tanggal_persetujuan,nama_transaksi:"retur barang penjualan",status:4,penjualan_id:data[0].order_id,akun_id:akunKas[0].id,akun_pasangan_id:akunPenjualan[0].id,retur_barang_id:data[0].id,nama:"kasPenjualan"}

    //                 hasil.push(barang,hpp,pajak,penjualan,kasPajak,kasPenjualan)

    //                 await persediaan.update({stock,stock_rusak},{where:{id:data[0].persediaan_id}});
    //                 await generalLedger.bulkCreate(hasil,{transaction:t})
    //             }
    //             await returBarang.update({status_retur},{where:{id},transaction:t})
    //             await t.commit();
    //             res.status(200).json({ status: 200, message: "sukses"});
    //         }
    //     } catch (err) {
    //         await t.rollback();
    //         console.log(req.body);
    //         console.log(err);
    //         res.status(500).json({ status: 500, message: "gagal", data: err });
    //     }
    // }

    // static async acceptReturPembelianBarang(req,res){
    //     let {id,status_retur,tanggal_persetujuan,company_id} = req.body;

    //     const t = await sq.transaction();
    //     try {
    //         if(!company_id){
    //             company_id = req.dataUsers.company_id
    //         }

    //         let data = await sq.query(`select rb.*,p.coa6_id,p2.stock,p2.stock_rusak,gl.sisa_saldo 
    //         from retur_barang rb join pembelian p on p.id = rb.pembelian_id left join persediaan p2 on p2.id = p.persediaan_id left join general_ledger gl on gl.akun_id = p.coa6_id and gl.status = 4 where rb."deletedAt" isnull and rb.id = '${id}' order by gl.tanggal_persetujuan desc limit 1`,s);

    //         if(data[0].status_retur == 4){
    //             res.status(201).json({ status: 204, message: "status retur 4" });
    //         }else{
    //             if(status_retur == 4){
    //                 let hasil = []
    //                 let akunHutang = await sq.query(`select c6.*,gl.sisa_saldo from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id and gl.status = 4 where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.kode_coa6 = '2.1.7.1.01.0001' order by gl.tanggal_persetujuan desc limit 1`,s);

    //                 let totalHargaBarang = data[0].harga_total * data[0].jumlah
    //                 let saldoBarang = data[0].sisa_saldo - totalHargaBarang
    //                 let saldoHutang = akunHutang[0].sisa_saldo - totalHargaBarang
    //                 let stock = data[0].stock - data[0].jumlah
             
    //                 let barang = {id:uuid_v4(),tanggal_transaksi:data[0].tanggal_retur,keterangan:data[0].keterangan,pengurangan:totalHargaBarang,referensi_bukti:data[0].no_invoice,sisa_saldo:saldoBarang,tanggal_persetujuan,nama_transaksi:"retur barang pembelian",status:4,pembelian_id:data[0].pembelian_id,akun_id:data[0].coa6_id,akun_pasangan_id:akunHutang[0].id,retur_barang_id:data[0].id,nama:"barang"}
    //                 let hutang = {id:uuid_v4(),tanggal_transaksi:data[0].tanggal_retur,keterangan:data[0].keterangan,pengurangan:totalHargaBarang,referensi_bukti:data[0].no_invoice,sisa_saldo:saldoHutang,tanggal_persetujuan,nama_transaksi:"retur barang pembelian",status:4,pembelian_id:data[0].pembelian_id,akun_id:akunHutang[0].id,akun_pasangan_id:data[0].coa6_id,retur_barang_id:data[0].id,nama:"hutang"}

    //                 hasil.push(barang,hutang)

    //                 await persediaan.update({stock},{where:{id:data[0].persediaan_id}});
    //                 await generalLedger.bulkCreate(hasil,{transaction:t})
    //             }
    //             await returBarang.update({status_retur},{where:{id},transaction:t})
    //             await t.commit();
    //             res.status(200).json({ status: 200, message: "sukses"});
    //         }
    //     } catch (err) {
    //         await t.rollback();
    //         console.log(req.body);
    //         console.log(err);
    //         res.status(500).json({ status: 500, message: "gagal", data: err });
    //     }
    // }
}
module.exports = Controller;