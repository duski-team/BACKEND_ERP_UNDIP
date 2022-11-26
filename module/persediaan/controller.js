const { sq } = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const persediaan = require("./model");
const trxPembelian = require("../trx_pembelian/model");
const { QueryTypes } = require('sequelize');
const moment = require('moment');
const s = { type: QueryTypes.SELECT };


class Controller {

    static async register(req, res) {
        const { nama_persediaan, kode_persediaan, satuan_persedian, harga_jual, stock_awal, stock_rusak, harga_satuan, tanggal_saldo_awal, kondisi, keterangan, coa6_id, kategori_id, sub_kategori_id, sub_sub_kategori_id } = req.body


        try {
            const cekPersediaan = await persediaan.findAll({ where: { nama_persediaan, kode_persediaan } });

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
                let data = await persediaan.create({ id:pembelian_id, nama_persediaan, kode_persediaan, satuan_persedian, harga_jual, stock_awal, stock_rusak, harga_satuan, tanggal_saldo_awal, kondisi, keterangan, coa6_id, kategori_id, sub_kategori_id, sub_sub_kategori_id, gambar });

                res.status(200).json({ status: 200, message: "sukses",data });
            }
        } catch (err) {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async registerSaldoAwal(req, res) {
        const { nama_persediaan, kode_persediaan, satuan_persedian, harga_jual, stock_awal, stock_rusak, harga_satuan, tanggal_saldo_awal, kondisi, keterangan, coa6_id, kategori_id, sub_kategori_id, sub_sub_kategori_id } = req.body

        const t = await sq.transaction();

        try {
            const cekPersediaan = await persediaan.findAll({ where: { nama_persediaan, kode_persediaan } });

            if(cekPersediaan.length>0){
                res.status(201).json({ status: 204, message: "data sudah ada" });
            }else{
                let gambar = "";

                if (req.files) {
                    if (req.files.file1) {
                        gambar = req.files.file1[0].filename;
                    }
                }
                let persetujuan = moment().format();
                let totalBarang = stock_awal - stock_rusak
                
                let data = await persediaan.create({ id:uuid_v4(), nama_persediaan, kode_persediaan, satuan_persedian, harga_jual, stock_awal, stock_rusak, harga_satuan, tanggal_saldo_awal, kondisi, keterangan, coa6_id, kategori_id, sub_kategori_id, sub_sub_kategori_id, gambar },{transaction:t});
                await trxPembelian.create({id:uuid_v4(),tgl_persetujuan_manajer_txp:persetujuan,jumlah_txp:totalBarang,satuan_txp:satuan_persedian,tgl_persetujuan_akuntan_txp:persetujuan,status_persetujuan_txp:2,harga_satuan_txp:0,harga_total_txp:0},{transaction:t})
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

    static async update(req, res) {
        const { id, nama_persediaan, kode_persediaan, satuan_persedian, harga_jual, stock_awal, stock_rusak, harga_satuan, tanggal_saldo_awal, kondisi, keterangan, coa6_id, kategori_id, sub_kategori_id, sub_sub_kategori_id } = req.body

        const t = await sq.transaction();

        try {
            if (req.files) {
                if (req.files.file1) {
                    let gambar = req.files.file1[0].filename;
                    await persediaan.update({ gambar }, { where: { id }, transaction: t })
                }
            }
            await persediaan.update({ nama_persediaan, kode_persediaan, satuan_persedian, harga_jual, stock_awal, stock_rusak, harga_satuan, tanggal_saldo_awal, kondisi, keterangan, coa6_id, kategori_id, sub_kategori_id, sub_sub_kategori_id }, { where: { id }, transaction: t })
            await t.commit();

            res.status(200).json({ status: 200, message: "sukses" });
        } catch (err) {
            await t.rollback();
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
            where p."deletedAt" isnull and p.id = ${id}`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }
}
module.exports = Controller;