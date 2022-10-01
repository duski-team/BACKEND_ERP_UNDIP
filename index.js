const router = require("express").Router();

router.use("/akunSaldoAwal", require('./module/akun_saldo_awal/route'));
router.use("/companyUsaha", require('./module/company_usaha/route'));
router.use("/jenisKerja", require('./module/jenis_kerja/route'));
router.use("/jenisPembelian", require('./module/jenis_pembelian/route'));
router.use("/jenisPenggunaan", require('./module/jenis_penggunaan/route'));
router.use("/jenisUser", require('./module/jenis_user/route'));
router.use("/kategori", require('./module/kategori/route'));
router.use("/kewarganegaraan", require('./module/kewarganegaraan/route'));
router.use("/kompetensi", require('./module/kompetensi/route'));
router.use("/layanan", require('./module/layanan/route'));
router.use("/mJenisAset", require('./module/m_jenis_aset/route'));
router.use("/mJenisAset", require('./module/m_jenis_aset/route'));
router.use("/pembelian", require('./module/pembelian/route'));
router.use("/penggunaanAset", require('./module/penggunaan_aset/route'));
router.use("/penugasan", require('./module/penugasan/route'));
router.use("/penugasanSdm", require('./module/penugasan_sdm/route'));
router.use("/produk", require('./module/produk/route'));
router.use("/sdm", require('./module/sdm/route'));
router.use("/statusOrder", require('./module/status_order/route'));
router.use("/statusSdm", require('./module/status_sdm/route'));
router.use("/statusVa", require('./module/status_va/route'));
router.use("/subKategori", require('./module/sub_kategori/route'));
router.use("/subLayanan", require('./module/sub_layanan/route'));
router.use("/subSubKategori", require('./module/sub_sub_kategori/route'));
router.use("/subAkunSaldoAwal", require('./module/subakun_saldo_awal/route'));
router.use("/tipePembayaran", require('./module/tipe_pembayaran/route'));
router.use("/trxPembelian", require('./module/trx_pembelian/route'));
router.use("/tugas", require('./module/tugas/route'));
router.use("/users", require('./module/users/route'));


module.exports = router;