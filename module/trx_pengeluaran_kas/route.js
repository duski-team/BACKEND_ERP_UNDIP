const Controller = require('./controller');
const router = require('express').Router();

router.post('/register', Controller.register);
router.post('/update', Controller.update);
router.post('/delete', Controller.delete);
router.get('/list', Controller.list);
router.post('/listTrxPengeluaranKasByJenisPengeluaranKasId', Controller.listTrxPengeluaranKasByJenisPengeluaranKasId);
router.post('/listTrxPengeluaranKasByPenugasanSdmId', Controller.listTrxPengeluaranKasByPenugasanSdmId);
router.post('/listTrxPengeluaranKasByTrxPembelianId', Controller.listTrxPengeluaranKasByTrxPembelianId);
router.get('/detailsById/:id', Controller.detailsById);

module.exports = router