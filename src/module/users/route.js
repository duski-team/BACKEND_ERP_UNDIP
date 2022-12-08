const Controller = require('./controller');
const router = require('express').Router();
const authentification = require('../../middleware/authentification')

router.post('/register',Controller.register);
router.post('/registerUser',Controller.registerUser);
router.post('/update',authentification,Controller.update);
router.post('/delete',authentification,Controller.delete);
router.get('/detailsById/:id',authentification,Controller.detailsById);
router.post('/login',Controller.login);
router.post('/cekEmailUsername',Controller.cekEmailUsername);
router.post('/aceptedUser',authentification,Controller.aceptedUser);
router.get('/list',authentification,Controller.list);
router.post('/listUserAdminCompany',authentification,Controller.listUserAdminCompany);
router.post('/listUserByCompanyId',authentification,Controller.listUserByCompanyId);
router.post('/listUserByJenisUserId',authentification,Controller.listUserByJenisUserId);
router.post('/registerPelanggan',authentification,Controller.registerPelanggan);
router.post('/cekUserByNomorHp',authentification,Controller.cekUserByNomorHp);

module.exports = router