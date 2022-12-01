const { sq } = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const pembelian = require("./model");
const trxPembelian = require("../trx_pembelian/model");
const generalLedger = require("../general_ledger/model");
const { QueryTypes } = require('sequelize');
const s = { type: QueryTypes.SELECT };


class Controller {

    static async register(req, res) {
        let { jumlah_pembelian, tanggal_pembelian, persediaan_id, jenis_asset_pembelian_id, vendor_id,satuan_txp,harga_satuan_txp,harga_total_txp,company_id,akun_barang_id } = req.body;

        const t = await sq.transaction();
        try {
            if(!company_id){
                company_id = req.dataUsers.company_id 
            }

            let pembelian_id = uuid_v4();
            let akunHutang = await sq.query(`select c6.* from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.kode_coa6 = '2.1.7.1.01.0001'`,s);

            let barang = {id:uuid_v4(),tanggal_transaksi:tanggal_pembelian,penambahan:harga_total_txp,pembelian_id,akun_id:akun_barang_id,akun_pasangan_id:akunHutang[0].id,nama:"barang"}
            let hutang = {id:uuid_v4(),tanggal_transaksi:tanggal_pembelian,penambahan:harga_total_txp,pembelian_id,akun_id:akunHutang[0].id,akun_pasangan_id:akun_barang_id,nama:"hutang"}

            let hasil = await pembelian.create({ id:pembelian_id , jumlah_pembelian, tanggal_pembelian, persediaan_id, jenis_asset_pembelian_id, vendor_id, company_id },{transaction:t});
            await trxPembelian.create({ id: uuid_v4(),jumlah_txp:jumlah_pembelian,satuan_txp,harga_satuan_txp,harga_total_txp,pembelian_id },{transaction:t});
            await generalLedger.bulkCreate([barang,hutang],{transaction:t})

            await t.commit();

            res.status(200).json({ status: 200, message: "sukses", data:hasil });
        } catch (err) {
            await t.rollback();
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async registerAset(req, res) {
        const { jumlah_pembelian,tanggal_pembelian,jenis_asset_pembelian_id,vendor_id,satuan_txp,harga_satuan_txp,harga_total_txp,company_id,coa6_id } = req.body;

        const t = await sq.transaction();
        try {
            if(!company_id){
                company_id = req.dataUsers.company_id 
            }

            let pembelian_id = uuid_v4();
            let akunHutang = await sq.query(`select c6.* from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.kode_coa6 = '2.1.7.1.01.0001'`,s);

            let barang = {id:uuid_v4(),tanggal_transaksi:tanggal_pembelian,penambahan:harga_total_txp,pembelian_id,akun_id:coa6_id,akun_pasangan_id:akunHutang[0].id,nama:"barang"}
            let hutang = {id:uuid_v4(),tanggal_transaksi:tanggal_pembelian,penambahan:harga_total_txp,pembelian_id,akun_id:akunHutang[0].id,akun_pasangan_id:akun_barang_id,nama:"hutang"}

            let hasil = await pembelian.create({ id:pembelian_id , jumlah_pembelian, tanggal_pembelian, jenis_asset_pembelian_id, vendor_id, company_id },{transaction:t});
            await trxPembelian.create({ id: uuid_v4(),jumlah_txp:jumlah_pembelian,satuan_txp,harga_satuan_txp,harga_total_txp,pembelian_id },{transaction:t});
            await generalLedger.bulkCreate([barang,hutang],{transaction:t})

            await t.commit();

            res.status(200).json({ status: 200, message: "sukses", data:hasil });
        } catch (err) {
            await t.rollback();
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    // static async register(req, res) {
    //     let { jumlah_pembelian, tanggal_pembelian, persediaan_id, jenis_asset_pembelian_id, vendor_id,satuan_txp,harga_satuan_txp,harga_total_txp, company_id,coa6_id } = req.body;

    //     const t = await sq.transaction();
    //     try {
    //         if(!company_id){
    //             company_id = req.dataUsers.company_id
    //         }
    //         let pembelian_id = uuid_v4()
    //         let hasil = await pembelian.create({ id:pembelian_id , jumlah_pembelian, tanggal_pembelian, persediaan_id, jenis_asset_pembelian_id, vendor_id, company_id,coa6_id },{transaction:t});
    //         await trxPembelian.create({ id: uuid_v4(),jumlah_txp:jumlah_pembelian,satuan_txp,harga_satuan_txp,harga_total_txp,pembelian_id },{transaction:t});
    //         await t.commit();

    //         res.status(200).json({ status: 200, message: "sukses", data:hasil });
    //     } catch (err) {
    //         await t.rollback();
    //         console.log(req.body);
    //         console.log(err);
    //         res.status(500).json({ status: 500, message: "gagal", data: err });
    //     }
    // }

    static async update(req, res) {
        let { id, jumlah_pembelian, tanggal_pembelian, persediaan_id, jenis_asset_pembelian_id, vendor_id,satuan_txp,harga_satuan_txp,harga_total_txp, company_id,coa6_id } = req.body

        const t = await sq.transaction();

        try {
            if(!company_id){
                company_id = req.dataUsers.company_id
            }

            let cekPembelian = await trxPembelian.findAll({where:{pembelian_id:id}})

            if(cekPembelian[0].status_persetujuan_txp == 1){
                await pembelian.update({ jumlah_pembelian, tanggal_pembelian, status_pembelian, persediaan_id, jenis_asset_pembelian_id, vendor_id, company_id,coa6_id }, { where: { id },transaction:t });
                await trxPembelian.update({jumlah_txp:jumlah_pembelian,satuan_txp,harga_satuan_txp,harga_total_txp },{where:{pembelian_id:id},transaction:t});
                await t.commit();

                res.status(200).json({ status: 200, message: "sukses" });
            }else{
                res.status(201).json({ status: 204, message: "status trx pembelian bukan 1" });
            }
        } catch (err) {
            await t.rollback();
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
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

    static async listPembelianByCompanyId(req, res) {
        const { company_id } = req.body
        try {
            let data = await sq.query(`select p.id as pembelian_id, * , c6.nama_coa6 as "nama_aset" from pembelian p left join persediaan p2 on p2.id = p.persediaan_id left join m_jenis_aset mja on p.jenis_asset_pembelian_id = mja.id left join master_vendor mv on mv.id = p.vendor_id left join coa6 c6 on c6.id = p.coa6_id left join trx_pembelian tp on tp.pembelian_id = p.id where p."deletedAt" isnull and p.company_id = '${company_id}' order by p."createdAt" desc`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }
}
module.exports = Controller;