const Controller = require('./controller');
const router = require('express').Router();
const authentification = require('../../middleware/authentification');

router.post('/register', authentification, Controller.register);
router.post('/update', authentification, Controller.update);
router.post('/delete', authentification, Controller.delete);
router.get('/list', authentification, Controller.list);
router.post('/listTrxPengeluaranKasByJenisPengeluaranKasId', authentification, Controller.listTrxPengeluaranKasByJenisPengeluaranKasId);
router.post('/listTrxPengeluaranKasByTrxPembelianId', authentification, Controller.listTrxPengeluaranKasByTrxPembelianId);
router.post('/listPembelianByVendorId', authentification, Controller.listPembelianByVendorId);
router.get('/detailsById/:id', authentification, Controller.detailsById);
router.post('/acceptPersetujuanPembayaranKewajibanVendor', authentification, Controller.acceptPersetujuanPembayaranKewajibanVendor);
router.post('/acceptPersetujuanPembayaranKewajibanLainKepadaVendor', authentification, Controller.acceptPersetujuanPembayaranKewajibanLainKepadaVendor);

module.exports = router