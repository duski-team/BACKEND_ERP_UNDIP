const Controller = require('./controller');
const router = require('express').Router();

router.post('/register', Controller.register);
router.post('/update', Controller.update);
router.post('/delete', Controller.delete);
router.get('/list', Controller.list);
router.post('/listProdukBySubAkunSaldoAwalId', Controller.listProdukBySubAkunSaldoAwalId);
router.post('/listProdukByKategoriId', Controller.listProdukByKategoriId);
router.post('/listProdukBySubKategoriId', Controller.listProdukBySubKategoriId);
router.post('/listProdukBySubSubKategoriId', Controller.listProdukBySubSubKategoriId);
router.get('/detailsById/:id', Controller.detailsById);

module.exports = router