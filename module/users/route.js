const Controller = require('./controller');
const router = require('express').Router();
const authentification = require('../../middleware/authentification')

router.post('/register', Controller.register);
router.post('/update', authentification, Controller.update);
router.post('/delete', authentification, Controller.delete);
router.get('/list', authentification, Controller.list);
router.get('/detailsById/:id', authentification, Controller.detailsById);
router.post('/login', Controller.login);
router.post('/aceptedUser', authentification, Controller.aceptedUser);

module.exports = router