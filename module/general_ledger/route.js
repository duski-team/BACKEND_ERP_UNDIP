const Controller = require('./controller');
const router = require('express').Router();
const authentification = require('../../middleware/authentification');

router.post('/register', authentification, Controller.register);
router.post('/update', authentification, Controller.update);
router.post('/registerPenerimaanKasNonPelangganPengembalianInvestasi', authentification, Controller.registerPenerimaanKasNonPelangganPengembalianInvestasi);
router.post('/registerPenerimaanKasNonPelangganPendanaanDariPinjaman', authentification, Controller.registerPenerimaanKasNonPelangganPendanaanDariPinjaman);
router.post('/registerPenerimaanKasNonPelangganPenambahanModal', authentification, Controller.registerPenerimaanKasNonPelangganPenambahanModal);
router.post('/pengembalianDanaInvestasi', authentification, Controller.pengeluaranKasPengembalianDanaInvestasi);
router.post('/pembayaranDanaInvestasi', authentification, Controller.pengeluaranKasPembayaranDanaInvestasi);
router.post('/approvalPenerimaanKasNonPelangganPengembalianInvestasi', authentification, Controller.approvalPenerimaanKasNonPelangganPengembalianInvestasi);
router.post('/approvalPenerimaanKasNonPelangganPendanaanDariPinjaman', authentification, Controller.approvalPenerimaanKasNonPelangganPendanaanDariPinjaman);
router.post('/approvalPenerimaanKasNonPelangganPenambahanModal', authentification, Controller.approvalPenerimaanKasNonPelangganPenambahanModal);
router.post('/pengeluaranKasUntukPegawai', authentification, Controller.pengeluaranKasUntukPegawai);
router.post('/approvalPengeluaranKasUntukPegawai', authentification, Controller.approvalPengeluaranKasUntukPegawai);
router.post('/delete', authentification, Controller.delete);
router.get('/list', authentification, Controller.list);
router.get('/listPenerimaanKasNonPelanggan', authentification, Controller.listPenerimaanKasNonPelanggan);
router.get('/listPengeluaranKasPengembalianDanaInvestasi', authentification, Controller.listPengeluaranKasPengembalianDanaInvestasi);
router.get('/listPengeluaranKasPembayaranDanaInvestasi', authentification, Controller.listPengeluaranKasPembayaranDanaInvestasi);
router.get('/listpengeluaranKasUntukPegawai', authentification, Controller.listpengeluaranKasUntukPegawai);
router.get('/detailsById/:id', authentification, Controller.detailsById);

module.exports = router