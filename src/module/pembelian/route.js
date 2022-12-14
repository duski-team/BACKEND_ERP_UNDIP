const Controller = require('./controller');
const router = require('express').Router();
const authentification = require('../../middleware/authentification');

router.post('/register', authentification, Controller.register);
router.post('/registerAset', authentification, Controller.registerAset);
router.post('/update', authentification, Controller.update);
router.post('/delete', authentification, Controller.delete);
router.get('/list', authentification, Controller.list);
router.post('/listPembelianByPersediaanId', authentification, Controller.listPembelianByPersediaanId);
router.post('/listPembelianByJenisAsetPembelianId', authentification, Controller.listPembelianByJenisAsetPembelianId);
router.post('/listPembelianByCompanyId', authentification, Controller.listPembelianByCompanyId);
router.get('/detailsById/:id', authentification, Controller.detailsById);

module.exports = router