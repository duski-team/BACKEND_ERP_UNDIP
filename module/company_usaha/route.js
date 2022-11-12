const Controller = require('./controller');
const router = require('express').Router();
const upload = require('../../helper/upload');
const authentification = require('../../middleware/authentification');

router.post('/register', authentification, upload, Controller.register);
router.post('/update', authentification, upload, Controller.update);
router.post('/delete', authentification, Controller.delete);
router.get('/list', authentification, Controller.list);
router.get('/detailsById/:id', authentification, Controller.detailsById);
router.post('/cekCompany', authentification, Controller.cekCompany);

module.exports = router