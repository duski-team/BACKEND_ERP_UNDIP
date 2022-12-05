const Controller = require('./controller');
const router = require('express').Router();
const authentification = require('../../middleware/authentification');

router.post('/register', authentification, Controller.register);
router.post('/update', authentification, Controller.update);
router.post('/listAkunPengembalianInvestasi', authentification, Controller.listAkunPengembalianInvestasi);
router.post('/listAkunPendanaanDariPinjaman', authentification, Controller.listAkunPendanaanDariPinjaman);
router.post('/listAkunPenambahanModal', authentification, Controller.listAkunPenambahanModal);
router.post('/listAkunJenisInvestasi', authentification, Controller.listAkunJenisInvestasi);
router.post('/registerPenerimaanKasNonPelangganPengembalianInvestasi', authentification, Controller.registerPenerimaanKasNonPelangganPengembalianInvestasi);
router.post('/registerPenerimaanKasNonPelangganPendanaanDariPinjaman', authentification, Controller.registerPenerimaanKasNonPelangganPendanaanDariPinjaman);
router.post('/registerPenerimaanKasNonPelangganPenambahanModal', authentification, Controller.registerPenerimaanKasNonPelangganPenambahanModal);
router.post('/pengembalianDanaInvestasi', authentification, Controller.pengembalianDanaInvestasi);
router.post('/approvalPenerimaanKasNonPelanggan', authentification, Controller.approvalPenerimaanKasNonPelanggan);
router.post('/delete', authentification, Controller.delete);
router.get('/list', authentification, Controller.list);
router.get('/detailsById/:id', authentification, Controller.detailsById);

module.exports = router