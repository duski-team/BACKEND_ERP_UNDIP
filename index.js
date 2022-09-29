const router = require("express").Router();

router.use("/jenisUser", require('./module/jenis_user/route'));
router.use("/companyUsaha", require('./module/company_usaha/route'));
router.use("/tugas", require('./module/tugas/route'));
router.use("/statusSdm", require('./module/status_sdm/route'));
router.use("/pendidikan", require('./module/pendidikan/route'));
router.use("/jenisKerja", require('./module/jenis_kerja/route'));
router.use("/kompetensi", require('./module/kompetensi/route'));


module.exports = router;