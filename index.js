const router = require("express").Router();

// router.use("/penugasan", require('./module/penugasan_DELETE/route'));
// router.use("/penugasanSdm", require('./module/penugasan_sdm_DELETE/route'));
// router.use("/sdm", require('./module/sdm_DELETE/route'));
// router.use("/tugas", require('./module/tugas_DELETE/route'));
// router.use("/pool_akses", require('./module/pool_akses_DELETE/route'));
// router.use("/master_akses", require('./module/master_akses_DELETE/route'));
// router.use("/subAkunSaldoAwal", require('./module/subakun_saldo_awal_DELETE/route'));
// router.use("/akunSaldoAwal", require('./module/akun_saldo_awal_DELETE/route'));

router.use("/companyUsaha", require('./module/company_usaha/route'));
router.use("/jenisKerja", require('./module/jenis_kerja/route'));
router.use("/jenisPembelian", require('./module/jenis_pembelian/route'));
router.use("/jenisPengeluaranKas", require('./module/jenis_pengeluaran_kas/route'));
router.use("/jenisPenggunaan", require('./module/jenis_penggunaan/route'));
router.use("/jenisUser", require('./module/jenis_user/route'));
router.use("/kategori", require('./module/kategori/route'));
router.use("/kewarganegaraan", require('./module/kewarganegaraan/route'));
router.use("/kompetensi", require('./module/kompetensi/route'));
router.use("/layanan", require('./module/layanan/route'));
router.use("/mJenisAset", require('./module/m_jenis_aset/route'));
router.use("/order", require('./module/order/route'));
router.use("/pembelian", require('./module/pembelian/route'));
router.use("/pendidikan", require('./module/pendidikan/route'));
router.use("/penggunaanAset", require('./module/penggunaan_aset/route'));
router.use("/persediaan", require('./module/persediaan/route'));
router.use("/statusOrder", require('./module/status_order/route'));
router.use("/statusSdm", require('./module/status_sdm/route'));
router.use("/statusVa", require('./module/status_va/route'));
router.use("/subKategori", require('./module/sub_kategori/route'));
router.use("/subLayanan", require('./module/sub_layanan/route'));
router.use("/subSubKategori", require('./module/sub_sub_kategori/route'));
router.use("/tipePembayaran", require('./module/tipe_pembayaran/route'));
router.use("/trxPembelian", require('./module/trx_pembelian/route'));
router.use("/trxPengeluaranKas", require('./module/trx_pengeluaran_kas/route'));
router.use("/users", require('./module/users/route'));
router.use("/coa1", require('./module/coa1/route'));
router.use("/coa2", require('./module/coa2/route'));
router.use("/coa3", require('./module/coa3/route'));
router.use("/coa4", require('./module/coa4/route'));
router.use("/coa5", require('./module/coa5/route'));
router.use("/coa6", require('./module/coa6/route'));
router.use("/test", require('./module/test/route'));
router.use("/masterSatuan", require('./module/master_satuan/route'));


module.exports = router;