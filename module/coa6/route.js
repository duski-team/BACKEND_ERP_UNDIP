const Controller = require('./controller');
const router = require('express').Router();

router.post('/register', Controller.register);
router.post('/update', Controller.update);
router.post('/delete', Controller.delete);
router.get('/list', Controller.list);
router.get('/detailsById/:id', Controller.detailsById);
// router.get('/listAll', Controller.list);

module.exports = router