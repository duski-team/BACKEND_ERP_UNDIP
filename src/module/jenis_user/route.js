const Controller = require('./controller');
const router = require('express').Router();
const authentification = require('../../middleware/authentification');

router.post('/register', authentification, Controller.register);
router.post('/update', authentification, Controller.update);
router.post('/delete', authentification, Controller.delete);
router.get('/list', Controller.list);
router.get('/listUser', Controller.listUser);
router.get('/detailsById/:id', Controller.detailsById);

module.exports = router