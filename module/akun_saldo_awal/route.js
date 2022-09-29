const Controller = require('./controller');
const router = require('express').Router();
const upload = require('../../helper/upload');

router.post('/register', upload, Controller.register);
router.post('/update', upload, Controller.update);
router.post('/delete', Controller.delete);
router.get('/list', Controller.list);
router.get('/detailsById/:id', Controller.detailsById);

module.exports = router