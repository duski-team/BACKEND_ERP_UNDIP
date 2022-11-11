const Controller = require('./controller');
const router = require('express').Router();
const authentification = require('../../middleware/authentification');

router.post('/test', Controller.test);
router.post('/coa6', Controller.coa6);


module.exports = router