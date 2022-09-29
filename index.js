const router = require("express").Router();

router.use("/jenisUser",require('./module/jenis_user/route'));


module.exports = router;