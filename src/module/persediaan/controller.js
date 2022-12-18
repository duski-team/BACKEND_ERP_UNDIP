const { sq } = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const persediaan = require("./model");
const trxPembelian = require("../trx_pembelian/model");
const generalLedger = require('../general_ledger/model');
const coa6 = require('../coa6/model');
const { QueryTypes } = require('sequelize');
const moment = require('moment');
const s = { type: QueryTypes.SELECT };


class Controller {

    static async register(req, res) {
        let { nama_persediaan, kode_persediaan, harga_jual, stock, stock_rusak, harga_satuan, tanggal_saldo_awal, kondisi, keterangan, coa6_id, kategori_id, sub_kategori_id, sub_sub_kategori_id,company_id,master_satuan_id } = req.body

        try {
            if(!company_id){
                company_id = req.dataUsers.company_id
            }

            const cekPersediaan = await persediaan.findAll({ where: { company_id, kode_persediaan, coa6_id } });

            if(cekPersediaan.length>0){
                res.status(201).json({ status: 204, message: "data sudah ada" });
            }else{
                let gambar = "";

                if (req.files) {
                    if (req.files.file1) {
                        gambar = req.files.file1[0].filename;
                    }
                }
                let pembelian_id = uuid_v4();
                let data = await persediaan.create({ id:pembelian_id, nama_persediaan, kode_persediaan, harga_jual, stock, stock_rusak, harga_satuan, tanggal_saldo_awal, kondisi, keterangan, coa6_id, kategori_id, sub_kategori_id, sub_sub_kategori_id, gambar, company_id,master_satuan_id });

                res.status(200).json({ status: 200, message: "sukses",data });
            }
        } catch (err) {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async registerSaldoAwal(req, res) {
        let { nama_coa6, kode_coa6, coa5_id,nominal_coa6,deskripsi,nama_persediaan, kode_persediaan, harga_jual, stock, stock_rusak, harga_satuan, tanggal_saldo_awal, kondisi, keterangan, kategori_id, sub_kategori_id, sub_sub_kategori_id,master_satuan_id,company_id } = req.body

        const t = await sq.transaction();

        try {
            if(!company_id){
                company_id = req.dataUsers.company_id
            }
            let cekCoa = await coa6.findAll({where:{kode_coa6,coa5_id}});
            if(cekCoa.length>0){
                res.status(201).json({ status: 204, message: "data sudah ada" });
            }else{
                let coa6_id = uuid_v4();
                let gambar = "";

                if (req.files) {
                    if (req.files.file1) {
                        gambar = req.files.file1[0].filename;
                    }
                }

                let akunModal = await sq.query(`select c6.*,gl.sisa_saldo from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id and gl.status = 4 where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.kode_coa6 = '3.1.1.1.01.0001' order by gl.tanggal_transaksi desc limit 1`,s);
                let sisa_saldo = nominal_coa6
                let saldoModal = sisa_saldo

                if(akunModal[0].sisa_saldo){
                    saldoModal= akunModal[0].sisa_saldo + parseFloat(sisa_saldo)
                }

                let barang = {id:uuid_v4(),tanggal_transaksi:tanggal_saldo_awal,sisa_saldo:sisa_saldo,penambahan:sisa_saldo,status:4,akun_id:coa6_id,tanggal_persetujuan:tanggal_saldo_awal,company_id,nama_transaksi:"saldo awal"}
                let modal = {id:uuid_v4(),tanggal_transaksi:tanggal_saldo_awal,sisa_saldo:saldoModal,penambahan:sisa_saldo,status:4,akun_id:akunModal[0].id,tanggal_persetujuan:tanggal_saldo_awal,company_id,nama_transaksi:"saldo awal"}

                let data = await coa6.create({id:coa6_id,nama_coa6, kode_coa6, coa5_id,nominal_coa6,deskripsi},{transaction:t});
                await persediaan.create({ id:uuid_v4(), nama_persediaan, kode_persediaan, harga_jual, stock, stock_rusak, harga_satuan, tanggal_saldo_awal, kondisi, keterangan, coa6_id, kategori_id, sub_kategori_id, sub_sub_kategori_id, gambar, company_id,master_satuan_id },{transaction:t});
                await trxPembelian.create({id:uuid_v4(),tgl_persetujuan_manajer_txp:tanggal_saldo_awal,jumlah_txp:stock,tgl_persetujuan_akuntan_txp:tanggal_saldo_awal,status_persetujuan_txp:4,harga_satuan_txp:0,harga_total_txp:0,master_satuan_id},{transaction:t});
                await generalLedger.bulkCreate([barang,modal],{transaction:t});
               
                await t.commit();

                res.status(200).json({ status: 200, message: "sukses",data });
            }
        } catch (err) {
            await t.rollback();
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    // static async registerSaldoAwal(req, res) {
    //     let { nama_coa6, kode_coa6, coa5_id,nominal_coa6,deskripsi,nama_persediaan, kode_persediaan, harga_jual, stock, stock_rusak, harga_satuan, tanggal_saldo_awal, kondisi, keterangan, kategori_id, sub_kategori_id, sub_sub_kategori_id,master_satuan_id,company_id } = req.body

    //     const t = await sq.transaction();

    //     try {
    //         if(!company_id){
    //             company_id = req.dataUsers.company_id
    //         }
    //         let cekCoa = await coa6.findAll({where:{kode_coa6,coa5_id}});
    //         if(cekCoa.length>0){
    //             res.status(201).json({ status: 204, message: "data sudah ada" });
    //         }else{
    //             let coa6_id = uuid_v4();
    //             let gambar = "";

    //             if (req.files) {
    //                 if (req.files.file1) {
    //                     gambar = req.files.file1[0].filename;
    //                 }
    //             }

    //             let akunModal = await sq.query(`select c6.*,gl.sisa_saldo from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id and gl.status = 4 where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.kode_coa6 = '3.1.1.1.01.0001' order by gl.tanggal_transaksi desc limit 1`,s);
    //             let sisa_saldo = nominal_coa6
    //             let saldoModal = sisa_saldo

    //             if(akunModal[0].sisa_saldo){
    //                 saldoModal= akunModal[0].sisa_saldo + parseFloat(sisa_saldo)
    //             }

    //             let barang = {id:uuid_v4(),tanggal_transaksi:tanggal_saldo_awal,sisa_saldo:sisa_saldo,penambahan:sisa_saldo,status:4,akun_id:coa6_id,akun_pasangan_id:akunModal[0].id,tanggal_persetujuan:tanggal_saldo_awal,company_id,nama_transaksi:"saldo awal"}
    //             let modal = {id:uuid_v4(),tanggal_transaksi:tanggal_saldo_awal,sisa_saldo:saldoModal,penambahan:sisa_saldo,status:4,akun_id:akunModal[0].id,akun_pasangan_id:coa6_id,tanggal_persetujuan:tanggal_saldo_awal,company_id,nama_transaksi:"saldo awal"}

    //             let data = await coa6.create({id:coa6_id,nama_coa6, kode_coa6, coa5_id,nominal_coa6,deskripsi},{transaction:t});
    //             await persediaan.create({ id:uuid_v4(), nama_persediaan, kode_persediaan, harga_jual, stock, stock_rusak, harga_satuan, tanggal_saldo_awal, kondisi, keterangan, coa6_id, kategori_id, sub_kategori_id, sub_sub_kategori_id, gambar, company_id,master_satuan_id },{transaction:t});
    //             await trxPembelian.create({id:uuid_v4(),tgl_persetujuan_manajer_txp:tanggal_saldo_awal,jumlah_txp:stock,tgl_persetujuan_akuntan_txp:tanggal_saldo_awal,status_persetujuan_txp:4,harga_satuan_txp:0,harga_total_txp:0,master_satuan_id},{transaction:t});
    //             await generalLedger.bulkCreate([barang,modal],{transaction:t});
               
    //             await t.commit();

    //             res.status(200).json({ status: 200, message: "sukses",data });
    //         }
    //     } catch (err) {
    //         await t.rollback();
    //         console.log(req.body);
    //         console.log(err);
    //         res.status(500).json({ status: 500, message: "gagal", data: err });
    //     }
    // }

    static async update(req, res) {
        const { id, nama_persediaan, kode_persediaan, harga_jual, stock, stock_rusak, harga_satuan, tanggal_saldo_awal, kondisi, keterangan, coa6_id, kategori_id, sub_kategori_id, sub_sub_kategori_id, company_id,master_satuan_id, status_persediaan } = req.body

        const t = await sq.transaction();

        try {
            if (req.files) {
                if (req.files.file1) {
                    let gambar = req.files.file1[0].filename;
                    await persediaan.update({ gambar }, { where: { id }, transaction: t })
                }
            }
            await persediaan.update({ nama_persediaan, kode_persediaan, harga_jual, stock, stock_rusak, harga_satuan, tanggal_saldo_awal, kondisi, keterangan, coa6_id, kategori_id, sub_kategori_id, sub_sub_kategori_id,company_id,master_satuan_id, status_persediaan  }, { where: { id }, transaction: t })
            await t.commit();

            res.status(200).json({ status: 200, message: "sukses" });
        } catch (err) {
            await t.rollback();
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err })
        }
    }

    static async updateBulk(req, res) {
        const { bulkData } = req.body

        try {
            await persediaan.bulkCreate(bulkData,{updateOnDuplicate:['status_persediaan']})
            res.status(200).json({ status: 200, message: "sukses" });
        } catch (err) {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err })
        }
    }

    static delete(req, res) {
        const { id } = req.body

        persediaan.destroy({ where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static async list(req, res) {
        try {
            let data = await sq.query(`select p.id as persedian_id,p.*,c.*,k.nama_kategori,sk.nama_sub_kategori,sk.kategori_id,ssk.nama_sub_sub_kategori,ssk.sub_kategori_id from persediaan p 
            join coa6 c on c.id = p.coa6_id 
            join kategori k on k.id = p.kategori_id 
            join sub_kategori sk on sk.id = p.sub_kategori_id 
            join sub_sub_kategori ssk on ssk.id = p.sub_sub_kategori_id 
            where p."deletedAt" isnull order by c.kode_coa6, p."createdAt"`, s)

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listPersediaanByCoa6Id(req, res) {
        const { coa6_id } = req.body
        try {
            let data = await sq.query(`select p.id as persedian_id,p.*,c.*,k.nama_kategori,sk.nama_sub_kategori,sk.kategori_id,ssk.nama_sub_sub_kategori,ssk.sub_kategori_id from persediaan p 
            join coa6 c on c.id = p.coa6_id 
            join kategori k on k.id = p.kategori_id 
            join sub_kategori sk on sk.id = p.sub_kategori_id 
            join sub_sub_kategori ssk on ssk.id = p.sub_sub_kategori_id 
            where p."deletedAt" isnull and p.coa6_id = '${coa6_id}' order by c.kode_coa6, p."createdAt"`, s)

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listPersediaanByKategoriId(req, res) {
        const { kategori_id } = req.body
        try {
            let data = await sq.query(`select p.id as persedian_id,p.*,c.*,k.nama_kategori,sk.nama_sub_kategori,sk.kategori_id,ssk.nama_sub_sub_kategori,ssk.sub_kategori_id from persediaan p 
            join coa6 c on c.id = p.coa6_id 
            join kategori k on k.id = p.kategori_id 
            join sub_kategori sk on sk.id = p.sub_kategori_id 
            join sub_sub_kategori ssk on ssk.id = p.sub_sub_kategori_id 
            where p."deletedAt" isnull and p.kategori_id  = '${kategori_id}' order by c.kode_coa6, p."createdAt"`, s)

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listPersediaanBySubKategoriId(req, res) {
        const { sub_kategori_id } = req.body
        try {
            let data = await sq.query(`select p.id as persedian_id,p.*,c.*,k.nama_kategori,sk.nama_sub_kategori,sk.kategori_id,ssk.nama_sub_sub_kategori,ssk.sub_kategori_id from persediaan p 
            join coa6 c on c.id = p.coa6_id 
            join kategori k on k.id = p.kategori_id 
            join sub_kategori sk on sk.id = p.sub_kategori_id 
            join sub_sub_kategori ssk on ssk.id = p.sub_sub_kategori_id 
            where p."deletedAt" isnull and p.sub_kategori_id = '${sub_kategori_id}' order by c.kode_coa6, p."createdAt"`, s)

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listPersediaanBySubSubKategoriId(req, res) {
        const { sub_sub_kategori_id } = req.body
        try {
            let data = await sq.query(`select p.id as persedian_id,p.*,c.*,k.nama_kategori,sk.nama_sub_kategori,sk.kategori_id,ssk.nama_sub_sub_kategori,ssk.sub_kategori_id from persediaan p 
            join coa6 c on c.id = p.coa6_id 
            join kategori k on k.id = p.kategori_id 
            join sub_kategori sk on sk.id = p.sub_kategori_id 
            join sub_sub_kategori ssk on ssk.id = p.sub_sub_kategori_id 
            where p."deletedAt" isnull and p.sub_sub_kategori_id = '${sub_sub_kategori_id}' order by c.kode_coa6, p."createdAt"`, s)

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async detailsById(req, res) {
        const { id } = req.params

        try {
            let data = await sq.query(`select p.id as persedian_id,p.*,c.*,k.nama_kategori,sk.nama_sub_kategori,sk.kategori_id,ssk.nama_sub_sub_kategori,ssk.sub_kategori_id from persediaan p 
            join coa6 c on c.id = p.coa6_id 
            join kategori k on k.id = p.kategori_id 
            join sub_kategori sk on sk.id = p.sub_kategori_id 
            join sub_sub_kategori ssk on ssk.id = p.sub_sub_kategori_id 
            where p."deletedAt" isnull and p.id = '${id}'`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listPersediaanByBarangJual(req,res){
        try {
            let data = await sq.query(`select p.id as persediaan_id, *, left(c6.kode_coa6,7) as kode_coa4 
            from persediaan p join coa6 c6 on c6.id = p.coa6_id 
            left join master_satuan ms on ms.id = p.master_satuan_id 
            where p."deletedAt" isnull and c6."deletedAt" isnull 
            and p.company_id = '${req.dataUsers.company_id}' and left(c6.kode_coa6,7) = '1.1.4.1' order by p."createdAt" desc`,s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listPersediaanByBarangHabisPakai(req,res){
        try {
            let data = await sq.query(`select p.id as persediaan_id,*,left(c6.kode_coa6,7)as kode_coa4 from persediaan p join coa6 c6 on c6.id = p.coa6_id where p."deletedAt" isnull and c6."deletedAt" isnull and p.company_id = '${req.dataUsers.company_id}' and left(c6.kode_coa6,7) = '1.1.4.2' order by p."createdAt" desc`,s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listPersediaanByBarangJualTampil(req,res){
        let { company_id } = req.body
        try {
            let data = await sq.query(`select p.id as persediaan_id,*,left(c6.kode_coa6,7)as kode_coa4 from persediaan p join coa6 c6 on c6.id = p.coa6_id left join master_satuan ms on ms.id = p.master_satuan_id where p."deletedAt" isnull and c6."deletedAt" isnull and p.company_id = '${company_id}' and left(c6.kode_coa6,7) = '1.1.4.1' and p.status_persediaan = 1 order by p."createdAt" desc`,s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }
}
module.exports = Controller;