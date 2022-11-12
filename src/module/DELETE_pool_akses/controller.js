// const { sq } = require("../../config/connection");
// const { v4: uuid_v4 } = require("uuid");
// const pool_akses = require("./model");
// const { QueryTypes } = require('sequelize');
// const s = { type: QueryTypes.SELECT };


// class Controller {

//     static register(req, res) {
//         const { user_id,master_akses_id } = req.body

//         pool_akses.findAll({ where: { user_id,master_akses_id } }).then(data => {
//             if (data.length) {
//                 res.status(201).json({ status: 204, message: "data sudah ada" });
//             } else {
//                 pool_akses.create({ id: uuid_v4(), user_id,master_akses_id }).then(data2 => {
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
//         const { id, user_id,master_akses_id } = req.body

//         pool_akses.update({ user_id,master_akses_id }, { where: { id } }).then(data => {
//             res.status(200).json({ status: 200, message: "sukses" });
//         }).catch(err => {
//             console.log(req.body);
//             console.log(err);
//             res.status(500).json({ status: 500, message: "gagal", data: err });
//         })
//     }

//     static delete(req, res) {
//         const { id } = req.body

//         pool_akses.destroy({ where: { id } }).then(data => {
//             res.status(200).json({ status: 200, message: "sukses" });
//         }).catch(err => {
//             console.log(req.body);
//             console.log(err);
//             res.status(500).json({ status: 500, message: "gagal", data: err });
//         })
//     }

//     static async list(req, res) {
//        try {
//         let data = await sq.query(`select pa.id as pool_akses_id,* from pool_akses pa join users u on u.id = pa.user_id join master_akses ma on ma.id = pa.master_akses_id where pa."deletedAt" isnull`,s)
//         res.status(200).json({ status: 200, message: "sukses",data });
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ status: 500, message: "gagal", data: err });
//        }
//     }

//     static async detailsById(req, res) {
//         const { id } = req.params

//         try {
//             let data = await sq.query(`select pa.id as pool_akses_id,* from pool_akses pa join users u on u.id = pa.user_id join master_akses ma on ma.id = pa.master_akses_id where pa."deletedAt" isnull and pa.id = '${id}'`,s)
//             res.status(200).json({ status: 200, message: "sukses",data });
//         } catch (err) {
//             console.log(err);
//             res.status(500).json({ status: 500, message: "gagal", data: err });
//            }
//     }
// }
// module.exports = Controller;