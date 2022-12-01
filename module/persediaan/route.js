const Controller = require('./controller');
const router = require('express').Router();
const upload = require('../../helper/upload');
const authentification = require('../../middleware/authentification');

router.post('/register', authentification,upload, Controller.register);
router.post('/registerSaldoAwal', authentification,upload, Controller.registerSaldoAwal);
router.post('/update', authentification,upload, Controller.update);
router.post('/delete', authentification, Controller.delete);
router.get('/list', authentification, Controller.list);
router.post('/listPersediaanByCoa6Id', authentification, Controller.listPersediaanByCoa6Id);
router.post('/listPersediaanByKategoriId', authentification, Controller.listPersediaanByKategoriId);
router.post('/listPersediaanBySubKategoriId', authentification, Controller.listPersediaanBySubKategoriId);
router.post('/listPersediaanBySubSubKategoriId', authentification, Controller.listPersediaanBySubSubKategoriId);
router.get('/detailsById/:id', authentification, Controller.detailsById);
router.get('/listPersediaanByBarangHabisPakai', authentification, Controller.listPersediaanByBarangHabisPakai);
router.get('/listPersediaanByBarangJual', authentification, Controller.listPersediaanByBarangJual);
router.get('/listPersediaanByBarangJualTampil', authentification, Controller.listPersediaanByBarangJualTampil);

module.exports = router