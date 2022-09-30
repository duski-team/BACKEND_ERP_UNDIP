const Controller = require('./controller');
const router = require('express').Router();

router.post('/register', Controller.register);
router.post('/update', Controller.update);
router.post('/delete', Controller.delete);
router.get('/list', Controller.list);
router.post('/listPenggunaanAsetByUserId', Controller.listPenggunaanAsetByUserId);
router.post('/listPenggunaanAsetByJenisPenggunaanId', Controller.listPenggunaanAsetByJenisPenggunaanId);
router.get('/detailsById/:id', Controller.detailsById);

module.exports = router