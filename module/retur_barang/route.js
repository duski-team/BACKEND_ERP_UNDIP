const Controller = require('./controller');
const router = require('express').Router();
const authentification = require('../../middleware/authentification');

router.post('/registerPenjualan', authentification, Controller.registerPenjualan);
router.post('/registerPembelian', authentification, Controller.registerPembelian);
router.post('/update', authentification, Controller.update);
router.post('/delete', authentification, Controller.delete);
router.get('/list', authentification, Controller.list);
router.get('/detailsById/:id', authentification, Controller.detailsById);

module.exports = router