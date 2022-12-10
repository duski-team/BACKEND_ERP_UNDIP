const router = require("express").Router();
const QRCode = require('qrcode')
const { PassThrough } = require('stream');

// router.use("/penugasan", require('./module/DELETE_penugasan/route'));
// router.use("/sdm", require('./module/DELETE_sdm/route'));
// router.use("/tugas", require('./module/DELETE_tugas/route'));
// router.use("/pool_akses", require('./module/DELETE_pool_akses/route'));
// router.use("/master_akses", require('./module/DELETE_master_akses/route'));
// router.use("/subAkunSaldoAwal", require('./module/DELETE_subakun_saldo_awal/route'));
// router.use("/akunSaldoAwal", require('./module/DELETE_akun_saldo_awal/route'));


router.use("/companyUsaha", require('./module/company_usaha/route'));
router.use("/jenisKerja", require('./module/jenis_kerja/route'));
router.use("/jenisPengeluaranKas", require('./module/jenis_pengeluaran_kas/route'));
router.use("/jenisPenggunaan", require('./module/jenis_penggunaan/route'));
router.use("/jenisPenjualan", require('./module/jenis_penjualan/route'));
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
router.use("/list_coa", require('./module/list_coa/route'));
router.use("/masterVendor", require('./module/master_vendor/route'));
router.use("/generalLedger", require('./module/general_ledger/route'));
router.use("/penugasanSdm", require('./module/penugasan_sdm/route'));
router.use("/returBarang", require('./module/retur_barang/route'));



router.get('/qr', async (req, res, next) => {
    try{
        const content = req.query.cid;            
        const qrStream = new PassThrough();
        const result = await QRCode.toFileStream(qrStream, content,
                    {
                        type: 'png',
                        width: 200,
                        errorCorrectionLevel: 'H'
                    }
                );

        qrStream.pipe(res);
    } catch(err){
        console.error('Failed to return content', err);
    }
})


module.exports = router;