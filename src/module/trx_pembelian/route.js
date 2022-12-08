const Controller = require('./controller');
const router = require('express').Router();
const authentification = require('../../middleware/authentification');

router.post('/register', authentification, Controller.register);
router.post('/update', authentification, Controller.update);
router.post('/delete', authentification, Controller.delete);
router.post('/acceptPersetujuanPersediaan', authentification, Controller.acceptPersetujuanPersediaan);
router.post('/acceptPersetujuanAsset', authentification, Controller.acceptPersetujuanAsset);
router.get('/list', authentification, Controller.list);
router.post('/listTrxPembelianByPembelianId', authentification, Controller.listTrxPembelianByPembelianId);
router.get('/detailsById/:id', authentification, Controller.detailsById);

module.exports = router