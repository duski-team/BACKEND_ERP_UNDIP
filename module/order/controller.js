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
        const{id,status_order} = req.body

        const t = await sq.transaction();

        try {
            let data = await sq.query(`select bo.*,o.status_order from barang_order bo join "order" o on o.id = bo.order_id where bo."deletedAt" isnull and bo.order_id ='${id}'`,s);
            
            if(data.length == 0){
                res.status(201).json({ status: 204, message: "data tidak ada" });
            }else{
                if(data[0].status_order != 1){
                    res.status(201).json({ status: 204, message: "status bukan 1" });
                }else{
                    if(status_order == 0){
                        let barang = await sq.query(`select * from persediaan p where p."deletedAt" isnull and p.id in (select bo.persediaan_id from barang_order bo join "order" o on o.id = bo.order_id where bo."deletedAt" isnull and bo.order_id ='${id}')`,s);

                        for (let i = 0; i < barang.length; i++) {
                            for (let j = 0; j < data.length; j++) {
                                if(barang[i].id == data[j].persediaan_id){
                                    barang[i].stock += data[j].jumlah
                                }
                            }
                        }
                        await persediaan.bulkCreate(barang,{updateOnDuplicate:['stock'],transaction:t});
                    }
                    if(status_order == 2){
        
                    }
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
            let data = await sq.query(`select o.id as "order_id", * from "order" o join persediaan p on p.id = o.persediaan_id join status_order so on so.id = o.status_order_id join jenis_penjualan jp on jp.id = o.jenis_penjualan_id join status_va sv on sv.id = o.status_va_id join tipe_pembayaran tp on tp.id = o.tipe_pembayaran_id join users u on u.id = o.customer_id where o."deletedAt" isnull and o.company_id = '${req.dataUsers.company_id}' order by o."createdAt" desc`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listOrderByStatusOrderId(req, res) {
        const { status_order_id } = req.body
        try {
            let data = await sq.query(`select o.id as "order_id", * from "order" o join persediaan p on p.id = o.persediaan_id join status_order so on so.id = o.status_order_id join jenis_penjualan jp on jp.id = o.jenis_penjualan_id join status_va sv on sv.id = o.status_va_id join tipe_pembayaran tp on tp.id = o.tipe_pembayaran_id join users u on u.id = o.customer_id where o."deletedAt" isnull and o.status_order_id = '${status_order_id}' and o.company_id = '${req.dataUsers.company_id}' order by o."createdAt" desc`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listOrderByJenisPembelianId(req, res) {
        const { jenis_penjualan_id } = req.body
        try {
            let data = await sq.query(`select o.id as "order_id", * from "order" o join persediaan p on p.id = o.persediaan_id join status_order so on so.id = o.status_order_id join jenis_penjualan jp on jp.id = o.jenis_penjualan_id join status_va sv on sv.id = o.status_va_id join tipe_pembayaran tp on tp.id = o.tipe_pembayaran_id join users u on u.id = o.customer_id where o."deletedAt" isnull and o.jenis_penjualan_id = '${jenis_penjualan_id}' and o.company_id = '${req.dataUsers.company_id}' order by o."createdAt" desc`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async detailsById(req, res) {
        const { id } = req.params

        try {
            let data = await sq.query(`select o.id as "order_id", * from "order" o join persediaan p on p.id = o.persediaan_id join status_order so on so.id = o.status_order_id join jenis_penjualan jp on jp.id = o.jenis_penjualan_id join status_va sv on sv.id = o.status_va_id join tipe_pembayaran tp on tp.id = o.tipe_pembayaran_id join users u on u.id = o.customer_id where o."deletedAt" isnull and o.id = '${id}'`, s);

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
            let data = await sq.query(`select o.id as "order_id", * from "order" o left join persediaan p on p.id = o.persediaan_id left join status_order so on so.id = o.status_order_id left join jenis_penjualan jp on jp.id = o.jenis_penjualan_id left join status_va sv on sv.id = o.status_va_id left join tipe_pembayaran tp on tp.id = o.tipe_pembayaran_id left join users u on u.id = o.customer_id where o."deletedAt" isnull and o.company_id = '${company_id}' order by o."createdAt" desc`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listOrderByKodeInvoice(req, res) {
        let { kode_invoice } = req.body
        try {
            let data = await sq.query(`select o.id as "order_id", * from "order" o left join persediaan p on p.id = o.persediaan_id left join status_order so on so.id = o.status_order_id left join jenis_penjualan jp on jp.id = o.jenis_penjualan_id left join status_va sv on sv.id = o.status_va_id left join tipe_pembayaran tp on tp.id = o.tipe_pembayaran_id left join users u on u.id = o.customer_id where o."deletedAt" isnull and o.kode_invoice = '${kode_invoice}' order by o."createdAt" desc`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }
}
module.exports = Controller;