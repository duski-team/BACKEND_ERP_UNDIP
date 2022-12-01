const Controller = require('./controller');
const router = require('express').Router();
const authentification = require('../../middleware/authentification');

router.post('/register', authentification, Controller.register);
router.post('/update', authentification, Controller.update);
router.post('/delete', authentification, Controller.delete);
router.get('/list', authentification, Controller.list);
router.post('/listTrxPengeluaranKasByJenisPengeluaranKasId', authentification, Controller.listTrxPengeluaranKasByJenisPengeluaranKasId);
router.post('/listTrxPengeluaranKasByTrxPembelianId', authentification, Controller.listTrxPengeluaranKasByTrxPembelianId);
router.get('/detailsById/:id', authentification, Controller.detailsById);
router.post('/acceptPersetujuan', authentification, Controller.acceptPersetujuan);

module.exports = router