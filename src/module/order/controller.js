const { sq } = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const order = require("./model");
const barangOrder = require("../barang_order/model");
const persediaan = require("../persediaan/model");
const generalLedger = require("../general_ledger/model");
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
                kode_invoice = `INV-${moment().format('dddYYMMDDHHmmSSS')}`
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
        let{id,status_order,company_id,tanggal_persetujuan,tipe_pembayaran_id} = req.body

        const t = await sq.transaction();

        try {
            if(!company_id){
                company_id = req.dataUsers.company_id
            }

            let data = await sq.query(`select bo.*,o.total_pajak,o.total_penjualan,o.biaya_admin,o.kode_invoice,o.tgl_order,p.stock,p.coa6_id,o.status_order,c6.nominal_coa6,(select gl.sisa_saldo from general_ledger gl where gl."deletedAt" isnull and gl.status=4 and gl.akun_id = p.coa6_id order by gl.tanggal_persetujuan desc limit 1) from barang_order bo join "order" o on o.id = bo.order_id join persediaan p on p.id = bo.persediaan_id join coa6 c6 on c6.id = p.coa6_id where o."deletedAt" isnull and bo.order_id = '${id}'`,s);
            
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
                    if(status_order == 4){
                        let akunHpp = await sq.query(`select c6.*,gl.sisa_saldo from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id and gl.status = 4 where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.kode_coa6 ='1.1.3.2.01.0009' order by gl.tanggal_persetujuan desc limit 1`,s);
                        let akunPajak = await sq.query(`select c6.*,gl.sisa_saldo from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id and gl.status = 4 where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.kode_coa6 ='2.1.6.1.01.0008' order by gl.tanggal_persetujuan desc limit 1`,s);
                        let akunBiayaAdmin = await sq.query(`select c6.*,gl.sisa_saldo from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id and gl.status = 4 where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.kode_coa6 ='2.1.7.2.01.0009' order by gl.tanggal_persetujuan desc limit 1`,s);
                        let akunKas = await sq.query(`select c6.*,gl.sisa_saldo from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id and gl.status = 4 where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.kode_coa6 ='2.1.7.2.01.0013' order by gl.tanggal_persetujuan desc limit 1`,s);
                        let akunPenjualan = await sq.query(`select c6.*,gl.sisa_saldo from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id and gl.status = 4 where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.kode_coa6 ='6.2.4.3.01.0001' order by gl.tanggal_persetujuan desc limit 1`,s);

                        let gl = []

                        let nilaiHpp = !akunHpp[0].sisa_saldo? akunHpp[0].nominal_coa6:akunHpp[0].sisa_saldo
                        let saldoPajak = (!akunPajak[0].sisa_saldo? akunPajak[0].nominal_coa6:akunPajak[0].sisa_saldo)+ data[0].total_pajak
                        let saldoBiayaAdmin = (!akunBiayaAdmin[0].sisa_saldo? akunBiayaAdmin[0].nominal_coa6:akunBiayaAdmin[0].sisa_saldo)+ data[0].biaya_admin
                        let saldoKas = (!akunKas[0].sisa_saldo? akunKas[0].nominal_coa6:akunKas[0].sisa_saldo)+ data[0].total_penjualan
                        let saldoPenjualan = !akunPenjualan[0].sisa_saldo? akunPenjualan[0].nominal_coa6:akunPenjualan[0].sisa_saldo
                        let total_penjualan = 0

                        for (let i = 0; i < data.length; i++) {
                            let saldoBarang = (!data[i].sisa_saldo?data[i].nominal_coa6:data[i].sisa_saldo) - data[i].harga_total
                            nilaiHpp+=data[i].harga_total
                            saldoPenjualan+=data[i].harga_total
                            total_penjualan+=data[i].harga_total

                            let x = {id:uuid_v4(),tanggal_transaksi:data[i].tgl_order,pengurangan:data[i].harga_total,referensi_bukti:data[i].kode_invoice,sisa_saldo:saldoBarang,tanggal_persetujuan,nama_transaksi:"penjualan",status:4,penjualan_id:data[i].order_id,akun_id:data[i].coa6_id,nama:"Barang"}
                            let y = {id:uuid_v4(),tanggal_transaksi:data[i].tgl_order,penambahan:data[i].harga_total,referensi_bukti:data[i].kode_invoice,company_id,sisa_saldo:nilaiHpp,tanggal_persetujuan,nama_transaksi:"penjualan",status:4,penjualan_id:data[i].order_id,akun_id:akunHpp[0].id,company_id,nama:"HPP"}
                            gl.push(x,y);
                        }

                        let pajak = {id:uuid_v4(),tanggal_transaksi:data[0].tgl_order,penambahan:data[0].total_pajak,referensi_bukti:data[0].kode_invoice,sisa_saldo:saldoPajak,tanggal_persetujuan,nama_transaksi:"penjualan",status:4,penjualan_id:data[0].order_id,akun_id:akunPajak[0].id,company_id,nama:"Pajak"}
                        let bAdmin = {id:uuid_v4(),tanggal_transaksi:data[0].tgl_order,penambahan:data[0].biaya_admin,referensi_bukti:data[0].kode_invoice,sisa_saldo:saldoBiayaAdmin,tanggal_persetujuan,nama_transaksi:"penjualan",status:4,penjualan_id:data[0].order_id,akun_id:akunBiayaAdmin[0].id,company_id,nama:"Biaya admin"}
                        let penjualan = {id:uuid_v4(),tanggal_transaksi:data[0].tgl_order,penambahan:total_penjualan,referensi_bukti:data[0].kode_invoice,sisa_saldo:saldoPenjualan,tanggal_persetujuan,nama_transaksi:"penjualan",status:4,penjualan_id:data[0].order_id,akun_id:akunPenjualan[0].id,company_id,nama:"Penjualan"}
                        let kasPenjualan = {id:uuid_v4(),tanggal_transaksi:data[0].tgl_order,penambahan:data[0].total_penjualan,referensi_bukti:data[0].kode_invoice,sisa_saldo:saldoKas,tanggal_persetujuan,nama_transaksi:"penjualan",status:4,penjualan_id:data[0].order_id,akun_id:akunKas[0].id,company_id,nama:"Kas Penjualan"}
                        gl.push(pajak,bAdmin,penjualan,kasPenjualan);
                        await generalLedger.bulkCreate(gl,{transaction:t})
                        // console.log(gl);
                    }
                    await order.update({status_order,tipe_pembayaran_id},{where:{id},transaction:t})
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

    static async delete(req, res) {
        const { id } = req.body

        const t = await sq.transaction();
        try {
            let data = await sq.query(`select bo.*,o.total_pajak,o.total_penjualan,o.biaya_admin,o.kode_invoice,o.tgl_order,p.stock,p.nama_persediaan,o.status_order from barang_order bo join "order" o on o.id = bo.order_id join persediaan p on p.id = bo.persediaan_id join coa6 c6 on c6.id = p.coa6_id where o."deletedAt" isnull and bo.order_id = '${id}'`,s);

            if(data[0].status_order>1){
                res.status(200).json({ status: 200, message: "status lebih dari 1" });
            }else{
                if(data[0].status_order==0){
                    await order.destroy({ where: { id },transaction:t })
                    await barangOrder.destroy({where:{order_id:id},transaction:t})
                }else if(data[0].status_order==1){
                    for (let i = 0; i < data.length; i++) {
                        let jml = data[i].stock+data[i].jumlah
                        stock.push({id:data[i].persediaan_id,stock:jml})
                    }
                    await persediaan.bulkCreate(stock,{updateOnDuplicate:['stock'],transaction:t});
                    await order.destroy({ where: { id },transaction:t })
                    await barangOrder.destroy({where:{order_id:id},transaction:t})
                }
                await t.commit();
                res.status(200).json({ status: 200, message: "sukses" });
            }
        } catch (err) {
            await t.rollback();
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
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

    static async listOrderLunasByCompanyId(req, res) {
        let { company_id } = req.body
        try {
            if (!company_id) {
                company_id = req.dataUsers.company_id
            }
            let data = await sq.query(`select o.id as "order_id", * from "order" o left join jenis_penjualan jp on jp.id = o.jenis_penjualan_id left join status_va sv on sv.id = o.status_va_id left join tipe_pembayaran tp on tp.id = o.tipe_pembayaran_id left join users u on u.id = o.customer_id where o."deletedAt" isnull and o.status_order = 2 and o.company_id = '${company_id}' order by o."createdAt" desc`, s);

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

    static async listOrderLunasByCustomerId(req, res) {
        let { customer_id } = req.body
        try {
            let data = await sq.query(`select o.id as "order_id", * from "order" o left join jenis_penjualan jp on jp.id = o.jenis_penjualan_id left join status_va sv on sv.id = o.status_va_id left join tipe_pembayaran tp on tp.id = o.tipe_pembayaran_id left join users u on u.id = o.customer_id where o."deletedAt" isnull and o.status_order = 2 and o.customer_id = '${customer_id}' order by o."createdAt" desc`, s);

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

    static async listPenerimaanKasDariPelanggan(req, res) {
        
        try {
            let data = await sq.query(`select o.id as "order_id", * from "order" o join users u on u.id = o.customer_id left join tipe_pembayaran tp on tp.id = o.tipe_pembayaran_id where o."deletedAt" isnull order by o.tgl_order desc`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }
}
module.exports = Controller;