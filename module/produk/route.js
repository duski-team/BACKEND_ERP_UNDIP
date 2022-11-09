const Controller = require('./controller');
const router = require('express').Router();
const authentification = require('../../middleware/authentification');

router.post('/register', authentification, Controller.register);
router.post('/update', authentification, Controller.update);
router.post('/delete', authentification, Controller.delete);
router.get('/list', authentification, Controller.list);
router.post('/listProdukBySubAkunSaldoAwalId', authentification, Controller.listProdukBySubAkunSaldoAwalId);
router.post('/listProdukByKategoriId', authentification, Controller.listProdukByKategoriId);
router.post('/listProdukBySubKategoriId', authentification, Controller.listProdukBySubKategoriId);
router.post('/listProdukBySubSubKategoriId', authentification, Controller.listProdukBySubSubKategoriId);
router.get('/detailsById/:id', authentification, Controller.detailsById);

module.exports = router