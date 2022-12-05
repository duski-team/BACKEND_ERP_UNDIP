const { sq } = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const order = require("./model");
const barangOrder = require("../barang_order/model");
const persediaan = require("../persediaan/model");
const { QueryTypes } = require('sequelize');
const s = { type: QueryTypes.SELECT };
const moment = require('moment')
moment.locale('id')
class Controller {

    static async register(req, res) {
        let { alamat_order, keterangan, no_va, kode_invoice, tgl_order, tgl_expire, persen_pajak, total_pajak, biaya_admin, total_penjualan, tipe_pembayaran_id, jenis_penjualan_id, customer_id, company_id,status_va_id,bulkData } = req.body

        const t = await sq.transaction();

        try {
            if (!company_id) {
                company_id = req.dataUsers.company_id
            }
            if(!kode_invoice){
                kode_invoice = `${moment().format('dddYYMMDDHHmmSSS')}`
            }

            let order_id = uuid_v4();
            let barang_id = ''
            let barangHabis = []
            let cek = false

            for (let i = 0; i < bulkData.length; i++) {
                bulkData[i].id = uuid_v4()
                bulkData[i].order_id = order_id
                barang_id+=`,'${bulkData[i].persediaan_id}'`
            }

            let barang = await sq.query(`select *,(p.stock - p.stock_rusak) as total_stock from persediaan p where p."deletedAt" isnull and p.id in (${barang_id.substring(1)})`,s);

            if(barang.length==0){
                res.status(201).json({status:204,message:"data tidak ada"})
            }else{
                for (let j = 0; j < barang.length; j++) {
                    for (let k = 0; k < bulkData.length; k++) {
                        if(barang[j].id == bulkData[k].persediaan_id){
                            if(bulkData[k].jumlah > barang[j].total_stock){
                                barangHabis.push({persediaan_id:barang[j].id,nama_persediaan:barang[j].nama_persediaan,total_stock:barang[j].total_stock});
                                cek = true
                            }else{
                                barang[j].stock-=bulkData[k].jumlah
                            }
                        }
                    }
                }

                if(cek){
                    res.status(201).json({status:204,message:"stock tidak cukup",data: barangHabis})
                }else{
                    let hasil = await order.create({id:order_id,alamat_order, keterangan, no_va, kode_invoice, tgl_order, tgl_expire, persen_pajak, total_pajak, biaya_admin, total_penjualan, tipe_pembayaran_id, jenis_penjualan_id, customer_id, company_id,status_va_id},{transaction:t});
                    await barangOrder.bulkCreate(bulkData,{transaction:t})
                    await persediaan.bulkCreate(barang,{updateOnDuplicate:['stock'],transaction:t});
                    await t.commit();

                    res.status(200).json({status:200,message:"sukses",data: hasil})
                }
            }
        } catch (err) {
            await t.rollback();
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async update(req, res) {
        const { id, alamat_order, keterangan, no_va, kode_invoice, tgl_order, tgl_expire, persen_pajak, total_pajak, biaya_admin, total_penjualan, tipe_pembayaran_id, jenis_penjualan_id, customer_id, company_id,status_va_id,bulkData } = req.body

        const t = await sq.transaction();

        try {
            let data = await sq.query(`select bo.*,o.status_order from barang_order bo join "order" o on o.id = bo.order_id where bo."deletedAt" isnull and bo.order_id ='${id}'`,s);

            if(data.length == 0){
                res.status(201).json({ status: 204, message: "data tidak ada"});
            }else{
                if(data[0].status_order != 1){
                    res.status(201).json({ status: 204, message: "status bukan 1"});
                }else{
                    let tmp = [...data,...bulkData];
                    let barangStock = []
                    let barang_id = '';
                    let cek = false

                    for (let i = 0; i < tmp.length; i++) {
                        barang_id+= `,'${tmp[i].persediaan_id}'`
                    }

                    let barang = await sq.query(`select * from persediaan p where p."deletedAt" isnull and p.id in (${barang_id.substring(1)})`,s);
                    
                    for (let j = 0; j < barang.length; j++) {
                        for (let k = 0; k < data.length; k++) {
                            if(barang[j].id == data[k].persediaan_id){
                                barang[j].stock += data[k].jumlah
                            }
                        }
                        let total = barang[j].stock - barang[j].stock_rusak

                        for (let l = 0; l < bulkData.length; l++) {
                            bulkData[l].id = uuid_v4();
                            bulkData[l].order_id = id
                            if(barang[j].id == bulkData[l].persediaan_id){
                                if(bulkData[l].jumlah>total){
                                    barangStock.push({id:barang[j].id,nama_persediaan:barang[j].nama_persediaan,total_stock:total})
                                    cek= true
                                }else{
                                    barang[j].stock-= bulkData[l].jumlah
                                }
                            }
                        }
                    }

                    if(cek){
                        res.status(201).json({ status: 204, message: "stok tidak cukup",data:barangStock});
                    }else{
                        await barangOrder.destroy({where:{order_id:id},transaction:t})
                        await order.update({ alamat_order, keterangan, no_va, kode_invoice, tgl_order, tgl_expire, persen_pajak, total_pajak, biaya_admin, total_penjualan, tipe_pembayaran_id, jenis_penjualan_id, customer_id, company_id,status_va_id }, {where: { id },transaction:t})
                        await barangOrder.bulkCreate(bulkData,{transaction:t});
                        await persediaan.bulkCreate(barang,{updateOnDuplicate:['stock'],transaction:t});
                        await t.commit();

                        res.status(200).json({ status: 200, message: "sukses" });
                    }
                }
            }
        } catch (err) {
            await t.rollback();
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async acceptStatus(req,res){
        let{id,status_order,company_id} = req.body

        const t = await sq.transaction();

        try {
            if(!company_id){
                company_id = req.dataUsers.company_id
            }

            let data = await sq.query(`select bo.*,o.kode_invoice,o.tgl_order,p.stock,p.coa6_id,o.status_order,c6.nominal_coa6,(select gl.sisa_saldo from general_ledger gl where gl."deletedAt" isnull and gl.status=4 and gl.akun_id = p.coa6_id order by gl.tanggal_persetujuan desc limit 1) from barang_order bo join "order" o on o.id = bo.order_id join persediaan p on p.id = bo.persediaan_id join coa6 c6 on c6.id = p.coa6_id where o."deletedAt" isnull and bo.order_id = '${id}'`,s);
            
            if(data.length == 0){
                res.status(201).json({ status: 204, message: "data tidak ada" });
            }else{
                if(data[0].status_order == 0 || data[0].status_order == 4){
                    res.status(201).json({ status: 204, message: "status 0/4" });
                }else{
                    if(status_order == 0){
                        let stock = []
                        for (let i = 0; i < data.length; i++) {
                            let jml = data[i].stock+data[i].jumlah
                            stock.push({id:data[i].persediaan_id,stock:jml})
                        }
                        await persediaan.bulkCreate(stock,{updateOnDuplicate:['stock'],transaction:t});
                    }
                    // if(status_order == 2){
                    //     let akunHpp = await sq.query(`select c6.*,gl.sisa_saldo from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id
                    //     where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.kode_coa6 ='1.1.3.2.01.0009' order by gl.tanggal_persetujuan desc limit 1`,s);
                    //     let barang = []
                    //     let hpp = []
                    //     let nilaiHpp = !akunHpp[0].sisa_saldo? akunHpp[0].nominal_coa6:akunHpp[0].sisa_saldo

                    //     for (let i = 0; i < data.length; i++) {
                    //         let saldoBarang = data[i].sisa_saldo - data[i].harga_total
                    //         nilaiHpp+=data[i].harga_total

                    //         let x = {id:uuid_v4(),tanggal_transaksi:data[i].tgl_order,pengurangan:data[i].harga_total,referensi_bukti:data[i].kode_invoice,sisa_saldo:saldoBarang,tanggal_persetujuan:moment().format(),nama_transaksi:"penjualan",status:4,penjualan_id:data[i].order_id,akun_id:data[i].coa6_id,akun_pasangan_id:akunHpp[0].id}
                    //         let y = {id:uuid_v4(),tanggal_transaksi:data[i].tgl_order,penambahan:data[i].harga_total,referensi_bukti:data[i].kode_invoice,sisa_saldo:nilaiHpp,tanggal_persetujuan:moment().format(),nama_transaksi:"penjualan",status:4,penjualan_id:data[i].order_id,akun_id:akunHpp[0].id,akun_pasangan_id:data[i].coa6_id}
                    //         barang.push(x)
                    //         hpp.push(y)
                    //     }

                    // }
                    await order.update({status_order},{where:{id},transaction:t})
                    await t.commit();
                    res.status(200).json({ status: 200, message: "sukses" });
                }
            }
        } catch (err) {
             await t.rollback();
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    // static async acceptStatus(req,res){
    //     const{id,status_order} = req.body

    //     const t = await sq.transaction();

    //     try {
    //         let data = await sq.query(`select bo.*,o.status_order from barang_order bo join "order" o on o.id = bo.order_id where bo."deletedAt" isnull and bo.order_id ='${id}'`,s);
            
    //         if(data.length == 0){
    //             res.status(201).json({ status: 204, message: "data tidak ada" });
    //         }else{
    //             if(data[0].status_order != 1){
    //                 res.status(201).json({ status: 204, message: "status bukan 1" });
    //             }else{
    //                 if(status_order == 0){
    //                     let barang = await sq.query(`select * from persediaan p where p."deletedAt" isnull and p.id in (select bo.persediaan_id from barang_order bo join "order" o on o.id = bo.order_id where bo."deletedAt" isnull and bo.order_id ='${id}')`,s);

    //                     for (let i = 0; i < barang.length; i++) {
    //                         for (let j = 0; j < data.length; j++) {
    //                             if(barang[i].id == data[j].persediaan_id){
    //                                 barang[i].stock += data[j].jumlah
    //                             }
    //                         }
    //                     }
    //                     await persediaan.bulkCreate(barang,{updateOnDuplicate:['stock'],transaction:t});
    //                 }
    //                 if(status_order == 4){
                        
    //                 }
    //                 await order.update({status_order},{where:{id},transaction:t})
    //                 await t.commit();
    //                 res.status(200).json({ status: 200, message: "sukses" });
    //             }
    //         }
    //     } catch (err) {
    //          await t.rollback();
    //         console.log(req.body);
    //         console.log(err);
    //         res.status(500).json({ status: 500, message: "gagal", data: err });
    //     }
    // }

    static  async delete(req, res) {
        const { id } = req.body

        const t = await sq.transaction();

        order.destroy({ where: { id },transaction:t }).then(async data => {
            barangOrder.destroy({where:{order_id:id},transaction:t}).then( async data2 =>{
                await t.commit();
                res.status(200).json({ status: 200, message: "sukses" });
            })
        }).catch(async err => {
            await t.rollback();
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static async list(req, res) {
        try {
            let data = await sq.query(`select o.id as "order_id", * from "order" o join jenis_penjualan jp on jp.id = o.jenis_penjualan_id join status_va sv on sv.id = o.status_va_id join tipe_pembayaran tp on tp.id = o.tipe_pembayaran_id join users u on u.id = o.customer_id where o."deletedAt" isnull and o.company_id = '${req.dataUsers.company_id}' order by o."createdAt" desc`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async detailsById(req, res) {
        const { id } = req.params

        try {
            let data = await sq.query(`select o.id as "order_id", * from "order" o join jenis_penjualan jp on jp.id = o.jenis_penjualan_id join status_va sv on sv.id = o.status_va_id join tipe_pembayaran tp on tp.id = o.tipe_pembayaran_id join users u on u.id = o.customer_id where o."deletedAt" isnull and o.id = '${id}'`, s);

            let barang = await sq.query(`select bo.id as "barang_order_id", * from barang_order bo join persediaan p on p.id = bo.persediaan_id where bo."deletedAt" isnull and p."deletedAt" isnull and bo.order_id = '${id}'`, s);

            data[0].barang_order = barang

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listOrderByCompanyId(req, res) {
        let { company_id } = req.body
        try {
            if (!company_id) {
                company_id = req.dataUsers.company_id
            }
            let data = await sq.query(`select o.id as "order_id", * from "order" o left join jenis_penjualan jp on jp.id = o.jenis_penjualan_id left join status_va sv on sv.id = o.status_va_id left join tipe_pembayaran tp on tp.id = o.tipe_pembayaran_id left join users u on u.id = o.customer_id where o."deletedAt" isnull and o.company_id = '${company_id}' order by o."createdAt" desc`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listOrderByKodeInvoice(req, res) {
        let { kode_invoice } = req.body
        try {
            let data = await sq.query(`select o.id as "order_id", * from "order" o left join jenis_penjualan jp on jp.id = o.jenis_penjualan_id left join status_va sv on sv.id = o.status_va_id left join tipe_pembayaran tp on tp.id = o.tipe_pembayaran_id left join users u on u.id = o.customer_id where o."deletedAt" isnull and o.kode_invoice = '${kode_invoice}' order by o."createdAt" desc`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listOrderByCustomerId(req, res) {
        let { customer_id } = req.body
        try {
            let data = await sq.query(`select o.id as "order_id", * from "order" o left join jenis_penjualan jp on jp.id = o.jenis_penjualan_id left join status_va sv on sv.id = o.status_va_id left join tipe_pembayaran tp on tp.id = o.tipe_pembayaran_id left join users u on u.id = o.customer_id where o."deletedAt" isnull and o.customer_id = '${customer_id}' order by o."createdAt" desc`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listBarangOrderByOrderId(req, res) {
        let { order_id } = req.body
        try {
            let data = await sq.query(`select bo.id as "barang_order_id", * from barang_order bo join persediaan p on p.id = bo.persediaan_id join master_satuan ms on ms.id = p.master_satuan_id join kategori k on k.id = p.kategori_id where bo."deletedAt" isnull and p."deletedAt" isnull and bo.order_id = '${order_id}'`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }
}
module.exports = Controller;