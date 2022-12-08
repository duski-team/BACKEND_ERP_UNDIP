// const { sq } = require("../../config/connection");
// const { v4: uuid_v4 } = require("uuid");
// const master_akses = require("./model");
// const { QueryTypes } = require('sequelize');
// const s = { type: QueryTypes.SELECT };


// class Controller {

//     static register(req, res) {
//         const { nama_akses,kode_akses } = req.body

//         master_akses.findAll({ where: { kode_akses } }).then(data => {
//             if (data.length) {
//                 res.status(201).json({ status: 204, message: "data sudah ada" });
//             } else {
//                 master_akses.create({ id: uuid_v4(), nama_akses,kode_akses }).then(data2 => {
//                     res.status(200).json({ status: 200, message: "sukses",data: data2 });
//                 })
//             }
//         }).catch(err => {
//             console.log(req.body);
//             console.log(err);
//             res.status(500).json({ status: 500, message: "gagal", data: err });
//         })
//     }

//     static update(req, res) {
//         const { id, nama_akses,kode_akses } = req.body

//         master_akses.update({ nama_akses,kode_akses }, { where: { id } }).then(data => {
//             res.status(200).json({ status: 200, message: "sukses" });
//         }).catch(err => {
//             console.log(req.body);
//             console.log(err);
//             res.status(500).json({ status: 500, message: "gagal", data: err });
//         })
//     }

//     static delete(req, res) {
//         const { id } = req.body

//         master_akses.destroy({ where: { id } }).then(data => {
//             res.status(200).json({ status: 200, message: "sukses" });
//         }).catch(err => {
//             console.log(req.body);
//             console.log(err);
//             res.status(500).json({ status: 500, message: "gagal", data: err });
//         })
//     }

//     static list(req, res) {
//         master_akses.findAll({order:[['createdAt','DESC']]}).then(data => {
//             res.status(200).json({ status: 200, message: "sukses", data });
//         }).catch(err => {
//             console.log(err);
//             res.status(500).json({ status: 500, message: "gagal", data: err });
//         })
//     }

//     static detailsById(req, res) {
//         const { id } = req.params

//         master_akses.findAll({ where: { id } }).then(data => {
//             res.status(200).json({ status: 200, message: "sukses", data });
//         }).catch(err => {
//             console.log(err);
//             res.status(500).json({ status: 500, message: "gagal", data: err });
//         })
//     }
// }
// module.exports = Controller;