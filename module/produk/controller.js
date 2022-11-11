const { sq } = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const produk = require("./model");
const { QueryTypes } = require('sequelize');
const s = { type: QueryTypes.SELECT };


class Controller {

    // static register(req, res) {
    //     const { nama_produk, kode_produk, satuan_produk, harga_jual, stock, spesifikasi } = req.body

    //     let gambar = "";
    //     if (req.files) {
    //         if (req.files.file1) {
    //             gambar = req.files.file2[0].filename;
    //         }
    //     }

    //     produk.findAll({ where: { nama_produk, kode_produk } }).then(data => {
    //         if (data.length) {
    //             res.status(201).json({ status: 204, message: "data sudah ada" });
    //         } else {
    //             produk.create({ id: uuid_v4(), nama_produk, kode_produk, satuan_produk, harga_jual, stock, gambar, spesifikasi }).then(data2 => {
    //                 res.status(200).json({ status: 200, message: "sukses", data: data2 });
    //             })
    //         }
    //     }).catch(err => {
    //         console.log(req.body);
    //         console.log(err);
    //         res.status(500).json({ status: 500, message: "gagal", data: err });
    //     })
    // }

    static register(req, res) {
        const { nama_produk,kode_produk,satuan_produk,harga_jual,stock,gambar,spesifikasi } = req.body

        produk.findAll({ where: { nama_produk,kode_produk } }).then(data => {
            if (data.length) {
                res.status(201).json({ status: 204, message: "data sudah ada" });
            } else {
                produk.create({ id: uuid_v4(), nama_produk,kode_produk,satuan_produk,harga_jual,stock,gambar,spesifikasi }).then(data2 => {
                    res.status(200).json({ status: 200, message: "sukses",data: data2 });
                })
            }
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static update(req, res) {
        const { id, nama_produk, kode_produk, satuan_produk, harga_jual, stock, gambar, spesifikasi } = req.body

        produk.update({ nama_produk, kode_produk, satuan_produk, harga_jual, stock, gambar, spesifikasi }, { where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static delete(req, res) {
        const { id } = req.body

        produk.destroy({ where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static async list(req, res) {
        try {
            let data = await sq.query(`select p.id as produk_id, p.*, ssa.*, k.*, sk.*, ssk.* from produk p join subakun_saldo_awal ssa on ssa.id = p.subakun_saldo_awal_id join kategori k on k.id = p.kategori_id join sub_kategori sk on sk.id = p.sub_kategori_id join sub_sub_kategori ssk on ssk.id = p.sub_sub_kategori_id where p."deletedAt" isnull order by p."createdAt" desc`, s)

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listProdukBySubAkunSaldoAwalId(req, res) {
        const { subakun_saldo_awal_id } = req.body
        try {
            let data = await sq.query(`select p.id as produk_id, p.*, ssa.*, k.*, sk.*, ssk.* from produk p join subakun_saldo_awal ssa on ssa.id = p.subakun_saldo_awal_id join kategori k on k.id = p.kategori_id join sub_kategori sk on sk.id = p.sub_kategori_id join sub_sub_kategori ssk on ssk.id = p.sub_sub_kategori_id where p."deletedAt" isnull and p.subakun_saldo_awal_id = '${subakun_saldo_awal_id}' order by p."createdAt" desc`, s)

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listProdukByKategoriId(req, res) {
        const { kategori_id } = req.body
        try {
            let data = await sq.query(`select p.id as produk_id, p.*, ssa.*, k.*, sk.*, ssk.* from produk p join subakun_saldo_awal ssa on ssa.id = p.subakun_saldo_awal_id join kategori k on k.id = p.kategori_id join sub_kategori sk on sk.id = p.sub_kategori_id join sub_sub_kategori ssk on ssk.id = p.sub_sub_kategori_id where p."deletedAt" isnull and p.kategori_id = '${kategori_id}' order by p."createdAt" desc`, s)

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listProdukBySubKategoriId(req, res) {
        const { sub_kategori_id } = req.body
        try {
            let data = await sq.query(`select p.id as produk_id, p.*, ssa.*, k.*, sk.*, ssk.* from produk p join subakun_saldo_awal ssa on ssa.id = p.subakun_saldo_awal_id join kategori k on k.id = p.kategori_id join sub_kategori sk on sk.id = p.sub_kategori_id join sub_sub_kategori ssk on ssk.id = p.sub_sub_kategori_id where p."deletedAt" isnull and p.sub_kategori_id = '${sub_kategori_id}' order by p."createdAt" desc`, s)

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listProdukBySubSubKategoriId(req, res) {
        const { sub_sub_kategori_id } = req.body
        try {
            let data = await sq.query(`select p.id as produk_id, p.*, ssa.*, k.*, sk.*, ssk.* from produk p join subakun_saldo_awal ssa on ssa.id = p.subakun_saldo_awal_id join kategori k on k.id = p.kategori_id join sub_kategori sk on sk.id = p.sub_kategori_id join sub_sub_kategori ssk on ssk.id = p.sub_sub_kategori_id where p."deletedAt" isnull and p.sub_sub_kategori_id = '${sub_sub_kategori_id}' order by p."createdAt" desc`, s)

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async detailsById(req, res) {
        const { id } = req.params

        try {
            let data = await sq.query(`select p.id as produk_id, p.*, ssa.*, k.*, sk.*, ssk.* from produk p join subakun_saldo_awal ssa on ssa.id = p.subakun_saldo_awal_id join kategori k on k.id = p.kategori_id join sub_kategori sk on sk.id = p.sub_kategori_id join sub_sub_kategori ssk on ssk.id = p.sub_sub_kategori_id where p."deletedAt" isnull and p.id = '${id}'`, s)

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }
}
module.exports = Controller;