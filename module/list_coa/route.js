const Controller = require('./controller');
const router = require('express').Router();
const authentification = require('../../middleware/authentification');

//! COA1
//! COA2
router.get('/listCoa6ByAssetTetap', authentification, Controller.listCoa6ByAssetTetap);
//! COA3
router.post('/listCoa6ByCoa3', authentification, Controller.listCoa6ByCoa3);
//! COA4
//! COA5
//! COA6
router.get('/listAkunPengembalianInvestasi', authentification, Controller.listAkunPengembalianInvestasi);
router.get('/listAkunPendanaanDariPinjaman', authentification, Controller.listAkunPendanaanDariPinjaman);
router.get('/listAkunPenambahanModal', authentification, Controller.listAkunPenambahanModal);
router.get('/listAkunJenisInvestasi', authentification, Controller.listAkunJenisInvestasi);
router.get('/listAkunKasByCompanyId', authentification, Controller.listAkunKasByCompanyId);
router.post('/listCoa6ByCoa2', authentification, Controller.listCoa6ByCoa2);

module.exports = router