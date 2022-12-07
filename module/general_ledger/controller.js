const { sq } = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const generalLedger = require("./model");
const { QueryTypes } = require('sequelize');
const s = { type: QueryTypes.SELECT };


class Controller {

    static register(req, res) {
        const { tanggal_transaksi, penambahan, pengurangan, keterangan, referensi_bukti, sisa_saldo, pembelian_id, penjualan_id, akun_id, akun_pasangan_id, tanggal_persetujuan } = req.body

        generalLedger.create({ id: uuid_v4(), tanggal_transaksi, penambahan, pengurangan, keterangan, referensi_bukti, sisa_saldo, pembelian_id, penjualan_id, akun_id, akun_pasangan_id, tanggal_persetujuan }).then(data => {
            res.status(200).json({ status: 200, message: "sukses", data });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static async registerPenerimaanKasNonPelangganPengembalianInvestasi(req, res) {
        let { coa6_id, jumlah, deskripsi_penerimaan_kas, nomor_faktur, akun_kas_id, company_id } = req.body

        try {
            if (!company_id) {
                company_id = req.dataUsers.company_id
            }
            let akunKas = await sq.query(`select c6.* from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.id = '${akun_kas_id}'`, s)

            let penambahanKas = { id: uuid_v4(), pengurangan: jumlah, keterangan: deskripsi_penerimaan_kas, referensi_bukti: nomor_faktur, akun_id: coa6_id, akun_pasangan_id: akunKas[0].id, status: 1, nama_transaksi: "penerimaan kas non pelanggan pengembalian investasi" }
            let kas = { id: uuid_v4(), pengurangan: jumlah, keterangan: deskripsi_penerimaan_kas, referensi_bukti: nomor_faktur, akun_id: akunKas[0].id, akun_pasangan_id: coa6_id, status: 1, nama_transaksi: "penerimaan kas non pelanggan pengembalian investasi" }

            let hasil = await generalLedger.bulkCreate([penambahanKas, kas])
            res.status(200).json({ status: 200, message: "sukses", data: hasil })
        } catch (err) {
            console.log(req.body)
            console.log(err)
            res.status(500).json({ status: 500, message: "gagal", data: err })
        }
    }

    static async registerPenerimaanKasNonPelangganPendanaanDariPinjaman(req, res) {
        let { coa6_id, jumlah, deskripsi_penerimaan_kas, nomor_faktur, akun_kas_id, company_id } = req.body

        try {
            if (!company_id) {
                company_id = req.dataUsers.company_id
            }
            let akunKas = await sq.query(`select c6.* from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.id = '${akun_kas_id}'`, s)

            let penambahanKas = { id: uuid_v4(), penambahan: jumlah, keterangan: deskripsi_penerimaan_kas, referensi_bukti: nomor_faktur, akun_id: coa6_id, akun_pasangan_id: akunKas[0].id, status: 1, nama_transaksi: "penerimaan kas non pelanggan pendanaan dari pinjaman" }
            let kas = { id: uuid_v4(), penambahan: jumlah, keterangan: deskripsi_penerimaan_kas, referensi_bukti: nomor_faktur, akun_id: akunKas[0].id, akun_pasangan_id: coa6_id, status: 1, nama_transaksi: "penerimaan kas non pelanggan pendanaan dari pinjaman" }

            let hasil = await generalLedger.bulkCreate([penambahanKas, kas])
            res.status(200).json({ status: 200, message: "sukses", data: hasil })
        } catch (err) {
            console.log(req.body)
            console.log(err)
            res.status(500).json({ status: 500, message: "gagal", data: err })
        }
    }

    static async registerPenerimaanKasNonPelangganPenambahanModal(req, res) {
        let { coa6_id, jumlah, deskripsi_penerimaan_kas, nomor_faktur, akun_kas_id, company_id } = req.body

        try {
            if (!company_id) {
                company_id = req.dataUsers.company_id
            }
            let akunKas = await sq.query(`select c6.* from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.id = '${akun_kas_id}'`, s)

            let penambahanKas = { id: uuid_v4(), penambahan: jumlah, keterangan: deskripsi_penerimaan_kas, referensi_bukti: nomor_faktur, akun_id: coa6_id, akun_pasangan_id: akunKas[0].id, status: 1, nama_transaksi: "penerimaan kas non pelanggan penambahan modal" }
            let kas = { id: uuid_v4(), penambahan: jumlah, keterangan: deskripsi_penerimaan_kas, referensi_bukti: nomor_faktur, akun_id: akunKas[0].id, akun_pasangan_id: coa6_id, status: 1, nama_transaksi: "penerimaan kas non pelanggan penambahan modal" }

            let hasil = await generalLedger.bulkCreate([penambahanKas, kas])
            res.status(200).json({ status: 200, message: "sukses", data: hasil })
        } catch (err) {
            console.log(req.body)
            console.log(err)
            res.status(500).json({ status: 500, message: "gagal", data: err })
        }
    }

    static async approvalPenerimaanKasNonPelangganPengembalianInvestasi(req, res) {
        const { id, tanggal_persetujuan, status } = req.body

        try {
            if (status == 4) {
                let cekId = await sq.query(`select * from general_ledger gl where gl."deletedAt" isnull and gl.id = '${id}'`, s)
                let cekAkun = await sq.query(`select c6.id as "coa6_id", * from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id join general_ledger gl on gl.akun_id = c6.id where c6."deletedAt" isnull and gl.status = 1 order by gl."createdAt" desc`, s)
                let cekSaldo = await sq.query(`select * from general_ledger gl where gl."deletedAt" isnull and gl.status = 4 order by gl.tanggal_persetujuan desc limit 2`, s)


                let saldo = 0
                for (let j = 0; j < cekSaldo.length; j++) {
                    if (cekSaldo[j].pengurangan != cekSaldo[j].sisa_saldo) {
                        saldo = cekSaldo[j].sisa_saldo
                    }
                }
                let akunPenambahanKas = { id, tanggal_persetujuan, sisa_saldo: 0, status: 4 }
                let akunKas = { id: '', tanggal_persetujuan, sisa_saldo: 0, status: 4 }

                for (let i = 0; i < cekAkun.length; i++) {
                    if (cekAkun[i].referensi_bukti == cekId[0].referensi_bukti) {
                        if (cekId[0].akun_pasangan_id == cekAkun[i].akun_id) {
                            akunKas.id = cekAkun[i].id
                            if (cekSaldo[0].sisa_saldo == 0 || cekSaldo.length == 0) {
                                akunPenambahanKas.sisa_saldo = cekAkun[i].pengurangan
                                akunKas.sisa_saldo = cekAkun[i].pengurangan
                            } else {
                                akunPenambahanKas.sisa_saldo = cekAkun[i].pengurangan
                                akunKas.sisa_saldo = saldo + cekAkun[i].pengurangan
                            }
                        }
                    }
                }

                await generalLedger.bulkCreate([akunPenambahanKas, akunKas], { updateOnDuplicate: ["sisa_saldo", "status", "tanggal_persetujuan"] })

                res.status(200).json({ status: 200, message: "sukses" })
            } else {
                res.status(200).json({ status: 200, message: "sukses" })
            }

        } catch (err) {
            console.log(req.body)
            console.log(err)
            res.status(500).json({ status: 500, message: "gagal", data: err })
        }
    }

    static async approvalPenerimaanKasNonPelangganPendanaanDariPinjaman(req, res) {
        const { id, tanggal_persetujuan, status } = req.body

        try {
            if (status == 4) {
                let cekId = await sq.query(`select * from general_ledger gl where gl."deletedAt" isnull and gl.id = '${id}'`, s)
                let cekAkun = await sq.query(`select c6.id as "coa6_id", * from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id join general_ledger gl on gl.akun_id = c6.id where c6."deletedAt" isnull and gl.status = 1 order by gl."createdAt" desc`, s)
                let cekSaldo = await sq.query(`select * from general_ledger gl where gl."deletedAt" isnull and gl.status = 4 order by gl.tanggal_persetujuan desc limit 2`, s)

                let saldo = 0
                for (let j = 0; j < cekSaldo.length; j++) {
                    if (cekSaldo[j].pengurangan != cekSaldo[j].sisa_saldo) {
                        saldo = cekSaldo[j].sisa_saldo
                    }
                }
                let akunPenambahanKas = { id, tanggal_persetujuan, sisa_saldo: 0, status: 4 }
                let akunKas = { id: '', tanggal_persetujuan, sisa_saldo: 0, status: 4 }

                for (let i = 0; i < cekAkun.length; i++) {
                    if (cekAkun[i].referensi_bukti == cekId[0].referensi_bukti) {
                        if (cekId[0].akun_pasangan_id == cekAkun[i].akun_id) {
                            akunKas.id = cekAkun[i].id
                            if (cekSaldo[0].sisa_saldo == 0 || cekSaldo.length == 0) {
                                akunPenambahanKas.sisa_saldo = cekAkun[i].penambahan
                                akunKas.sisa_saldo = cekAkun[i].penambahan
                            } else {
                                akunPenambahanKas.sisa_saldo = cekAkun[i].penambahan
                                akunKas.sisa_saldo = saldo + cekAkun[i].penambahan
                            }
                        }
                    }
                }

                await generalLedger.bulkCreate([akunPenambahanKas, akunKas], { updateOnDuplicate: ["sisa_saldo", "status", "tanggal_persetujuan"] })

                res.status(200).json({ status: 200, message: "sukses" })
            } else {
                res.status(200).json({ status: 200, message: "sukses" })
            }

        } catch (err) {
            console.log(req.body)
            console.log(err)
            res.status(500).json({ status: 500, message: "gagal", data: err })
        }
    }

    static async approvalPenerimaanKasNonPelangganPenambahanModal(req, res) {
        const { id, tanggal_persetujuan, status } = req.body

        try {
            if (status == 4) {
                let cekId = await sq.query(`select * from general_ledger gl where gl."deletedAt" isnull and gl.id = '${id}'`, s)
                let cekAkun = await sq.query(`select c6.id as "coa6_id", * from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id join general_ledger gl on gl.akun_id = c6.id where c6."deletedAt" isnull and gl.status = 1 order by gl."createdAt" desc`, s)
                let cekSaldo = await sq.query(`select * from general_ledger gl where gl."deletedAt" isnull and gl.status = 4 order by gl.tanggal_persetujuan desc limit 2`, s)

                let saldo = 0
                for (let j = 0; j < cekSaldo.length; j++) {
                    if (cekSaldo[j].pengurangan != cekSaldo[j].sisa_saldo) {
                        saldo = cekSaldo[j].sisa_saldo
                    }
                }
                let akunPenambahanKas = { id, tanggal_persetujuan, sisa_saldo: 0, status: 4 }
                let akunKas = { id: '', tanggal_persetujuan, sisa_saldo: 0, status: 4 }

                for (let i = 0; i < cekAkun.length; i++) {
                    if (cekAkun[i].referensi_bukti == cekId[0].referensi_bukti) {
                        if (cekId[0].akun_pasangan_id == cekAkun[i].akun_id) {
                            akunKas.id = cekAkun[i].id
                            if (cekSaldo[0].sisa_saldo == 0 || cekSaldo.length == 0) {
                                akunPenambahanKas.sisa_saldo = cekAkun[i].penambahan
                                akunKas.sisa_saldo = cekAkun[i].penambahan
                            } else {
                                akunPenambahanKas.sisa_saldo = cekAkun[i].penambahan
                                akunKas.sisa_saldo = saldo + cekAkun[i].penambahan
                            }
                        }
                    }
                }

                await generalLedger.bulkCreate([akunPenambahanKas, akunKas], { updateOnDuplicate: ["sisa_saldo", "status", "tanggal_persetujuan"] })

                res.status(200).json({ status: 200, message: "sukses" })
            } else {
                res.status(200).json({ status: 200, message: "sukses" })
            }

        } catch (err) {
            console.log(req.body)
            console.log(err)
            res.status(500).json({ status: 500, message: "gagal", data: err })
        }
    }

    static async listPenerimaanKasNonPelanggan(req, res) {
        try {
            let data = await sq.query(`select gl.id as "general_ledger_id",c6.nama_coa6 ,c6.kode_coa6 , c62.nama_coa6 as "nama_coa6_pasangan", c62.kode_coa6 as "kode_coa6_pasangan",gl.tanggal_transaksi ,gl.penambahan ,gl.pengurangan ,gl.keterangan ,gl.referensi_bukti ,gl.sisa_saldo ,gl.tanggal_persetujuan , gl.nama_transaksi ,gl.status from general_ledger gl join coa6 c6 on c6.id = gl.akun_id join coa6 c62 on c62.id = gl.akun_pasangan_id where gl.nama_transaksi = 'penerimaan kas non pelanggan pendanaan dari pinjaman' or gl.nama_transaksi = 'penerimaan kas non pelanggan pengembalian investasi' or gl.nama_transaksi = 'penerimaan kas non pelanggan penambahan modal' order by gl."createdAt" desc`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static update(req, res) {
        const { id, tanggal_transaksi, penambahan, pengurangan, keterangan, referensi_bukti, sisa_saldo, pembelian_id, penjualan_id, akun_id, akun_pasangan_id, tanggal_persetujuan } = req.body

        generalLedger.update({ tanggal_transaksi, penambahan, pengurangan, keterangan, referensi_bukti, sisa_saldo, pembelian_id, penjualan_id, akun_id, akun_pasangan_id, tanggal_persetujuan }, { where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static delete(req, res) {
        const { id } = req.body

        generalLedger.destroy({ where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static async list(req, res) {
        try {
            let data = await sq.query(`select gl.id as "general_ledger_id", * from general_ledger gl join "order" o on o.id = gl.penjualan_id join pembelian p on p.id = gl.pembelian_id join coa6 c on c.id = gl.akun_id and c.id = gl.akun_pasangan_id where gl."deletedAt" isnull order by gl."createdAt" desc`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async detailsById(req, res) {
        const { id } = req.params

        try {
            let data = await sq.query(`select gl.id as "general_ledger_id", * from general_ledger gl join "order" o on o.id = gl.penjualan_id join pembelian p on p.id = gl.pembelian_id join coa6 c on c.id = gl.akun_id and c.id = gl.akun_pasangan_id where gl."deletedAt" isnull and gl.id = '${id}'`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async pengeluaranKasPengembalianDanaInvestasi(req, res) {
        let { invoice, tanggal_transaksi, jenis_investasi_id, nominal, deskripsi, company_id, akun_bank_id } = req.body;

        try {
            if (!company_id) {
                company_id = req.dataUsers.company_id
            }

            let akunKas = await sq.query(`select c6.*,gl.sisa_saldo from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id and gl.status = 4 where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.id ='${jenis_investasi_id}' order by gl.tanggal_persetujuan desc limit 1`, s);
            let akunBank = await sq.query(`select c6.*,gl.sisa_saldo from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id and gl.status = 4 where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.id ='${akun_bank_id}' order by gl.tanggal_persetujuan desc limit 1`, s);
            let cekSaldo = await sq.query(`select gl.sisa_saldo from general_ledger gl join coa6 c6 on c6.id = gl.akun_id where gl."deletedAt" isnull and gl.status = 4 and c6.id = '${akun_bank_id}' order by gl.tanggal_persetujuan desc limit 1`, s)

            let kas = { id: uuid_v4(), tanggal_transaksi, pengurangan: nominal, keterangan: deskripsi, referensi_bukti: invoice, tanggal_persetujuan: tanggal_transaksi, akun_id: akunBank[0].id, akun_pasangan_id: akunKas[0].id, sisa_saldo: 0, status: 4, nama_transaksi: "pengembalian dana investasi" }
            let jenisInvestasi = { id: uuid_v4(), tanggal_transaksi, pengurangan: nominal, keterangan: deskripsi, referensi_bukti: invoice, tanggal_persetujuan: tanggal_transaksi, akun_id: akunKas[0].id, akun_pasangan_id: akunBank[0].id, sisa_saldo: 0, status: 4, nama_transaksi: "pengembalian dana investasi" }

            if (cekSaldo.length == 0 || cekSaldo[0].sisa_saldo == 0) {
                kas.sisa_saldo = nominal
                jenisInvestasi.sisa_saldo = nominal
            } else {
                kas.sisa_saldo = cekSaldo[0].sisa_saldo - nominal
                jenisInvestasi.sisa_saldo = nominal
            }

            // console.log(kas);
            // console.log(jenisInvestasi);
            let hasil = await generalLedger.bulkCreate([jenisInvestasi, kas])
            res.status(200).json({ status: 200, message: "sukses", data: hasil })

        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async pengeluaranKasPembayaranDanaInvestasi(req, res) {
        let { invoice, tanggal_transaksi, jenis_investasi_id, nominal, deskripsi, company_id, akun_bank_id } = req.body;

        try {
            if (!company_id) {
                company_id = req.dataUsers.company_id
            }

            let akunKas = await sq.query(`select c6.*,gl.sisa_saldo from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id and gl.status = 4 where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.id ='${jenis_investasi_id}' order by gl.tanggal_persetujuan desc limit 1`, s);
            let akunBank = await sq.query(`select c6.*,gl.sisa_saldo from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id and gl.status = 4 where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.id ='${akun_bank_id}' order by gl.tanggal_persetujuan desc limit 1`, s);
            let cekSaldo = await sq.query(`select gl.sisa_saldo from general_ledger gl join coa6 c6 on c6.id = gl.akun_id where gl."deletedAt" isnull and gl.status = 4 and c6.kode_coa6 = '1.1.1.1.01.0001' order by gl.tanggal_persetujuan desc limit 1`, s)

            let kas = { id: uuid_v4(), tanggal_transaksi, pengurangan: nominal, keterangan: deskripsi, referensi_bukti: invoice, tanggal_persetujuan: tanggal_transaksi, akun_id: akunBank[0].id, akun_pasangan_id: akunKas[0].id, sisa_saldo: 0, status: 4, nama_transaksi: "pembayaran dana investasi" }
            let jenisInvestasi = { id: uuid_v4(), tanggal_transaksi, pengurangan: nominal, keterangan: deskripsi, referensi_bukti: invoice, tanggal_persetujuan: tanggal_transaksi, akun_id: akunKas[0].id, akun_pasangan_id: akunBank[0].id, sisa_saldo: 0, status: 4, nama_transaksi: "pembayaran dana investasi" }

            if (cekSaldo.length == 0 || cekSaldo[0].sisa_saldo == 0) {
                kas.sisa_saldo = nominal
                jenisInvestasi.sisa_saldo = nominal
            } else {
                kas.sisa_saldo = cekSaldo[0].sisa_saldo - nominal
                jenisInvestasi.sisa_saldo = nominal
            }

            // console.log(kas);
            // console.log(jenisInvestasi);
            let hasil = await generalLedger.bulkCreate([jenisInvestasi, kas])
            res.status(200).json({ status: 200, message: "sukses", data: hasil })

        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async pengeluaranKasUntukPegawai(req, res) {
        let { coa6_id_beban, jenis_biaya, tanggal_transaksi, nomor_invoice, pegawai_id, jumlah_hak_pembayaran, coa6_id_pajak, tarif_pph_21, nilai_potongan, jumlah_dibayarkan, keterangan_pembayaran, akun_kas_id, company_id } = req.body;

        try {
            if (!company_id) {
                company_id = req.dataUsers.company_id
            }

            let akunKas = await sq.query(`select c6.* from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.id = '${akun_kas_id}'`, s)

            let bebanPegawai = { id: uuid_v4(), tanggal_transaksi, penambahan: jumlah_hak_pembayaran, keterangan: keterangan_pembayaran, referensi_bukti: nomor_invoice, nama_transaksi: "pengeluaran kas untuk pegawai", status: 1, akun_id: coa6_id_beban, akun_pasangan_id: akunKas[0].id }
            let utangPajak = { id: uuid_v4(), tanggal_transaksi, penambahan: nilai_potongan, keterangan: keterangan_pembayaran, referensi_bukti: nomor_invoice, nama_transaksi: "pengeluaran kas untuk pegawai", status: 1, akun_id: coa6_id_pajak, akun_pasangan_id: akunKas[0].id }

            let kasBebanPegawai = { id: uuid_v4(), tanggal_transaksi, pengurangan: jumlah_hak_pembayaran, keterangan: keterangan_pembayaran, referensi_bukti: nomor_invoice, nama_transaksi: "pengeluaran kas untuk pegawai", status: 1, akun_id: akunKas[0].id, akun_pasangan_id: coa6_id_beban }
            let kasUtangPajak = { id: uuid_v4(), tanggal_transaksi, pengurangan: nilai_potongan, keterangan: keterangan_pembayaran, referensi_bukti: nomor_invoice, nama_transaksi: "pengeluaran kas untuk pegawai", status: 1, akun_id: akunKas[0].id, akun_pasangan_id: coa6_id_pajak }

            let hasil = await generalLedger.bulkCreate([bebanPegawai, kasBebanPegawai, utangPajak, kasUtangPajak])
            res.status(200).json({ status: 200, message: "sukses", data: hasil })

        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }
}
module.exports = Controller;