const Controller = require('./controller');
const router = require('express').Router();
const authentification = require('../../middleware/authentification');

router.post('/register', authentification, Controller.register);
router.post('/update', authentification, Controller.update);
router.post('/delete', authentification, Controller.delete);
router.post('/acceptStatus', authentification, Controller.acceptStatus);
router.get('/list', authentification, Controller.list);
router.post('/listOrderByCompanyId', authentification, Controller.listOrderByCompanyId);
router.post('/listOrderByKodeInvoice', authentification, Controller.listOrderByKodeInvoice);
router.post('/listOrderByCustomerId', authentification, Controller.listOrderByCustomerId);
router.get('/detailsById/:id', authentification, Controller.detailsById);

module.exports = router