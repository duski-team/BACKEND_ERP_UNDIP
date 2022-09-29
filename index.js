const router = require("express").Router();

router.use("/jenisUser", require('./module/jenis_user/route'));
router.use("/companyUsaha", require('./module/company_usaha/route'));


module.exports = router;