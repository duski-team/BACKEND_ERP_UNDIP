const Controller = require('./controller');
const router = require('express').Router();
const authentification = require('../../middleware/authentification');

router.post('/register', authentification, Controller.register);
router.post('/update', authentification, Controller.update);
router.post('/delete', authentification, Controller.delete);
router.get('/list', authentification, Controller.list);
router.get('/detailsById/:id', authentification, Controller.detailsById);
router.post('/listCoa6ByCoa5Id', authentification, Controller.listCoa6ByCoa5Id);
router.post('/listCoa6ByCoa5IdCompanyId', authentification, Controller.listCoa6ByCoa5IdCompanyId);
// router.get('/listAll', Controller.list);

module.exports = router