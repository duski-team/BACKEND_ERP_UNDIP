const { sq } = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const pembelian = require("./model");
const trxPembelian = require("../trx_pembelian/model");
const { QueryTypes } = require('sequelize');
const s = { type: QueryTypes.SELECT };


class Controller {

    static async register(req, res) {
        const { jumlah_pembelian, tanggal_pembelian, status_pembelian, persediaan_id, jenis_asset_pembelian_id, vendor_id,satuan_txp,harga_satuan_txp,harga_total_txp } = req.body;

        const t = await sq.transaction();
        try {
            let pembelian_id = uuid_v4()
            let hasil = await pembelian.create({ id:pembelian_id , jumlah_pembelian, tanggal_pembelian, status_pembelian, persediaan_id, jenis_asset_pembelian_id, vendor_id },{transaction:t});
            await trxPembelian.create({ id: uuid_v4(),jumlah_txp:jumlah_pembelian,satuan_txp,harga_satuan_txp,harga_total_txp,pembelian_id },{transaction:t});
            await t.commit();

            res.status(200).json({ status: 200, message: "sukses", data:hasil });
        } catch (err) {
            await t.rollback();
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async update(req, res) {
        const { id, jumlah_pembelian, tanggal_pembelian, status_pembelian, persediaan_id, jenis_asset_pembelian_id, vendor_id,satuan_txp,harga_satuan_txp,harga_total_txp } = req.body

        const t = await sq.transaction();

        try {
            let cekPembelian = await trxPembelian.findAll({where:{pembelian_id:id}})
            if(cekPembelian[0].status_persetujuan_txp == 2){
                res.status(201).json({ status: 204, message: "status trx pembelian bukan 1" });
            }else{
                await pembelian.update({ jumlah_pembelian, tanggal_pembelian, status_pembelian, persediaan_id, jenis_asset_pembelian_id, vendor_id }, { where: { id },transaction:t });
                await trxPembelian.create({jumlah_txp:jumlah_pembelian,satuan_txp,harga_satuan_txp,harga_total_txp },{where:{pembelian_id:id},transaction:t});
                await t.commit();

                res.status(200).json({ status: 200, message: "sukses" });
            }
        } catch (err) {
            await t.rollback();
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
        pembelian.update({ jumlah_pembelian, tanggal_pembelian, status_pembelian, persediaan_id, jenis_asset_pembelian_id, vendor_id }, { where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err => {
            
        })
    }

    static delete(req, res) {
        const { id } = req.body

        pembelian.destroy({ where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static async list(req, res) {
        try {
            let data = await sq.query(`select p.id as pembelian_id,p.*,p2.*, mja.* from pembelian p join persediaan p2 on p2.id = p.persediaan_id join m_jenis_aset mja on p.jenis_asset_pembelian_id = mja.id where p."deletedAt" isnull order by p."createdAt" desc`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listPembelianByPersediaanId(req, res) {
        const { persediaan_id } = req.body
        try {
            let data = await sq.query(`select p.id as pembelian_id,p.*,p2.*, mja.* from pembelian p join persediaan p2 on p2.id = p.persediaan_id join m_jenis_aset mja on p.jenis_asset_pembelian_id = mja.id where p."deletedAt" isnull and p.persediaan_id = '${persediaan_id}' order by p."createdAt" desc`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listPembelianByJenisAsetPembelianId(req, res) {
        const { jenis_asset_pembelian_id } = req.body
        try {
            let data = await sq.query(`select p.id as pembelian_id,p.*,p2.*, mja.* from pembelian p join persediaan p2 on p2.id = p.persediaan_id join m_jenis_aset mja on p.jenis_asset_pembelian_id = mja.id where p."deletedAt" isnull and p.jenis_asset_pembelian_id = '${jenis_asset_pembelian_id}' order by p."createdAt" desc`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async detailsById(req, res) {
        const { id } = req.params

        try {
            let data = await sq.query(`select p.id as pembelian_id,p.*,p2.*, mja.* from pembelian p join persediaan p2 on p2.id = p.persediaan_id join m_jenis_aset mja on p.jenis_asset_pembelian_id = mja.id where p."deletedAt" isnull and p.id = '${id}'`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }
}
module.exports = Controller;