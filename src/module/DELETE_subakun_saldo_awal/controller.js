// const { sq } = require("../../config/connection");
// const { v4: uuid_v4 } = require("uuid");
// const subAkunsaldoAwal = require("./model");
// const { QueryTypes } = require('sequelize');
// const s = { type: QueryTypes.SELECT };


// class Controller {

//     static register(req, res) {
//         const { nama_barang_akun,harga_satuan,tanggal_saldo_awal,jumlah,satuan,kondisi,keterangan,akun_saldo_awal_id } = req.body

//         subAkunsaldoAwal.create({ id: uuid_v4(), nama_barang_akun,harga_satuan,tanggal_saldo_awal,jumlah,satuan,kondisi,keterangan,akun_saldo_awal_id }).then(data => {
//             res.status(200).json({ status: 200, message: "sukses",data });
//         }).catch(err => {
//             console.log(req.body);
//             console.log(err);
//             res.status(500).json({ status: 500, message: "gagal", data: err });
//         })
//     }

//     static update(req, res) {
//         const { id,nama_barang_akun,harga_satuan,tanggal_saldo_awal,jumlah,satuan,kondisi,keterangan,akun_saldo_awal_id } = req.body

//         subAkunsaldoAwal.update({ nama_barang_akun,harga_satuan,tanggal_saldo_awal,jumlah,satuan,kondisi,keterangan,akun_saldo_awal_id }, { where: { id } }).then(data => {
//             res.status(200).json({ status: 200, message: "sukses" });
//         }).catch(err => {
//             console.log(req.body);
//             console.log(err);
//             res.status(500).json({ status: 500, message: "gagal", data: err });
//         })
//     }

//     static delete(req, res) {
//         const { id } = req.body

//         subAkunsaldoAwal.destroy({ where: { id } }).then(data => {
//             res.status(200).json({ status: 200, message: "sukses" });
//         }).catch(err => {
//             console.log(req.body);
//             console.log(err);
//             res.status(500).json({ status: 500, message: "gagal", data: err });
//         })
//     }

//     static async list(req, res) {
//         try {
//             let data = await sq.query(`SELECT *,ssa.id as subakun_saldo_awal_id from subakun_saldo_awal ssa join akun_saldo_awal asa on asa.id = ssa.akun_saldo_awal_id where ssa."deletedAt" isnull order by ssa."createdAt" desc`,s);

//             res.status(200).json({ status: 200, message: "sukses", data });
//         } catch (err) {
//             console.log(err);
//             res.status(500).json({ status: 500, message: "gagal", data: err });
//         }
//     }

//     static async listSubAkunSaldoAwalBySaldoAwalId(req, res) {
//         const {akun_saldo_awal_id} = req.body
//         try {
//             let data = await sq.query(`SELECT *,ssa.id as subakun_saldo_awal_id from subakun_saldo_awal ssa join akun_saldo_awal asa on asa.id = ssa.akun_saldo_awal_id where ssa."deletedAt" isnull and ssa.akun_saldo_awal_id = '${akun_saldo_awal_id}' order by ssa."createdAt" desc`,s);

//             res.status(200).json({ status: 200, message: "sukses", data });
//         } catch (err) {
//             console.log(err);
//             res.status(500).json({ status: 500, message: "gagal", data: err });
//         }
//     }

//     static async detailsById(req, res) {
//         const { id } = req.params

//         try {
//             let data = await sq.query(`SELECT *,ssa.id as subakun_saldo_awal_id from subakun_saldo_awal ssa join akun_saldo_awal asa on asa.id = ssa.akun_saldo_awal_id where ssa."deletedAt" isnull and ssa.id ='${id}'`,s);

//             res.status(200).json({ status: 200, message: "sukses", data });
//         } catch (err) {
//             console.log(err);
//             res.status(500).json({ status: 500, message: "gagal", data: err });
//         }
//     }
// }
// module.exports = Controller;