const Controller = require('./controller');
const router = require('express').Router();
const authentification = require('../../middleware/authentification');

router.post('/register', authentification, Controller.register);
router.post('/registerKewajibanLainKepadaVendor', authentification, Controller.registerKewajibanLainKepadaVendor);
router.post('/update', authentification, Controller.update);
router.post('/delete', authentification, Controller.delete);
router.get('/list', authentification, Controller.list);
router.post('/listTrxPengeluaranKasByJenisPengeluaranKasId', authentification, Controller.listTrxPengeluaranKasByJenisPengeluaranKasId);
router.post('/listTrxPengeluaranKasByTrxPembelianId', authentification, Controller.listTrxPengeluaranKasByTrxPembelianId);
router.post('/listPembelianByVendorId', authentification, Controller.listPembelianByVendorId);
router.post('/listTrxPengeluaranKasByStatusPersetujuan', authentification, Controller.listTrxPengeluaranKasByStatusPersetujuan);
router.get('/detailsById/:id', authentification, Controller.detailsById);
router.post('/acceptPersetujuanPembayaranKewajibanVendor', authentification, Controller.acceptPersetujuanPembayaranKewajibanVendor);
router.post('/acceptPersetujuanPembayaranKewajibanLainKepadaVendor', authentification, Controller.acceptPersetujuanPembayaranKewajibanLainKepadaVendor);
router.post('/pengembalianDanaInvestasi', authentification, Controller.pengeluaranKasPengembalianDanaInvestasi);
router.post('/pembayaranDanaInvestasi', authentification, Controller.pengeluaranKasPembayaranDanaInvestasi);
router.post('/approvalPengeluaranKasPembayaranDanaInvestasi', authentification, Controller.approvalPengeluaranKasPembayaranDanaInvestasi);
router.post('/pengeluaranKasUntukPegawai', authentification, Controller.pengeluaranKasUntukPegawai);
router.post('/approvalPengeluaranKasUntukPegawai', authentification, Controller.approvalPengeluaranKasUntukPegawai);
router.post('/pengeluaranKasNonPegawai', authentification, Controller.pengeluaranKasNonPegawai);
router.post('/approvalPengeluaranKasNonPegawai', authentification, Controller.approvalPengeluaranKasNonPegawai);
router.get('/listPengeluaranKasPengembalianDanaInvestasi', authentification, Controller.listPengeluaranKasPengembalianDanaInvestasi);
router.get('/listPengeluaranKasPembayaranDanaInvestasi', authentification, Controller.listPengeluaranKasPembayaranDanaInvestasi);
router.get('/listpengeluaranKasUntukPegawai', authentification, Controller.listpengeluaranKasUntukPegawai);
router.get('/listpengeluaranKasNonPegawai', authentification, Controller.listpengeluaranKasNonPegawai);

module.exports = router