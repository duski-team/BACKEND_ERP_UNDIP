const Controller = require('./controller');
const router = require('express').Router();
const authentification = require('../../middleware/authentification');

router.post('/register', authentification, Controller.register);
router.post('/registerBulk', authentification, Controller.registerBulk);
router.post('/update', authentification, Controller.update);
router.post('/delete', authentification, Controller.delete);
router.get('/list', authentification, Controller.list);
router.post('/listOrderByStatusOrderId', authentification, Controller.listOrderByStatusOrderId);
router.post('/listOrderByJenisPembelianId', authentification, Controller.listOrderByJenisPembelianId);
router.get('/detailsById/:id', authentification, Controller.detailsById);

module.exports = router