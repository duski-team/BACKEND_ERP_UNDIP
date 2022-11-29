const { sq } = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const pembelian = require("./model");
const trxPembelian = require("../trx_pembelian/model");
const generalLedger = require("../general_ledger/model");
const { QueryTypes } = require('sequelize');
const s = { type: QueryTypes.SELECT };


class Controller {

    // static async register(req, res) {
    //     const { jumlah_pembelian, tanggal_pembelian, status_pembelian, persediaan_id, jenis_asset_pembelian_id, vendor_id,satuan_txp,harga_satuan_txp,harga_total_txp,company_id,akun_barang_id } = req.body;

    //     const t = await sq.transaction();
    //     try {
    //         let pembelian_id = uuid_v4();

    //         let akunHutang = await sq.query(`select c6.*,gl.akun_id,gl.sisa_saldo from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.kode_coa6 = '2.1.7.1.01.0001' order by gl."createdAt" desc limit 1`,s);
    //         let akunBarang = await sq.query(`select * from general_ledger gl where gl."deletedAt" isnull where gl.akun_id = '${akun_barang_id}' order by gl."createdAt" desc  limit 1`,s);

    //         let  sisaSaldoHutang = akunHutang[0].nominal_coa6 + harga_total_txp
    //         let  sisaSaldoBarang = akunBarang.length ==0?0:akunBarang[0].nominal_coa6 + harga_total_txp

    //         let hasil = await pembelian.create({ id:pembelian_id , jumlah_pembelian, tanggal_pembelian, status_pembelian, persediaan_id, jenis_asset_pembelian_id, vendor_id, company_id },{transaction:t});
    //         await trxPembelian.create({ id: uuid_v4(),jumlah_txp:jumlah_pembelian,satuan_txp,harga_satuan_txp,harga_total_txp,pembelian_id },{transaction:t});
    //         await generalLedger.create({tanggal_transaksi:tanggal_pembelian,penambahan:harga_total_txp,sisa_saldo:sisaSaldoBarang,pembelian_id,akun_id:akun_barang_id},{transaction:t})
    //         await generalLedger.create({tanggal_transaksi:tanggal_pembelian,pengurangan:harga_total_txp,sisa_saldo:sisaSaldoHutang,pembelian_id,akun_id:akunHutang[0].id},{transaction:t})
    //         // pasangan nya silang

    //         await t.commit();

    //         res.status(200).json({ status: 200, message: "sukses", data:hasil });
    //     } catch (err) {
    //         await t.rollback();
    //         console.log(req.body);
    //         console.log(err);
    //         res.status(500).json({ status: 500, message: "gagal", data: err });
    //     }
    // }

    static async register(req, res) {
        const { jumlah_pembelian, tanggal_pembelian, status_pembelian, persediaan_id, jenis_asset_pembelian_id, vendor_id,satuan_txp,harga_satuan_txp,harga_total_txp, company_id,coa6_id } = req.body;

        const t = await sq.transaction();
        try {
            let pembelian_id = uuid_v4()
            let hasil = await pembelian.create({ id:pembelian_id , jumlah_pembelian, tanggal_pembelian, status_pembelian, persediaan_id, jenis_asset_pembelian_id, vendor_id, company_id,coa6_id },{transaction:t});
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
        const { id, jumlah_pembelian, tanggal_pembelian, status_pembelian, persediaan_id, jenis_asset_pembelian_id, vendor_id,satuan_txp,harga_satuan_txp,harga_total_txp, company_id,coa6_id } = req.body

        const t = await sq.transaction();

        try {
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
            let data = await sq.query(`select p.id as pembelian_id, p.*, p2.*, mja.* from pembelian p left join persediaan p2 on p2.id = p.persediaan_id left join m_jenis_aset mja on p.jenis_asset_pembelian_id = mja.id where p."deletedAt" isnull and p.company_id = '${company_id}' order by p."createdAt" desc `, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }
}
module.exports = Controller;