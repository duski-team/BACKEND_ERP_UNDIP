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

    static async listAkunPengembalianInvestasi(req, res) {
        try {
            let data = await sq.query(`select c6.id as "coa6_id", * from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id where c6."deletedAt" isnull and c5."deletedAt" isnull and c5.company_id = '${req.dataUsers.company_id}' and c6.kode_coa6 ilike '1.1.2%' or c6.kode_coa6 ilike '1.2.1%' order by c6.kode_coa6`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listAkunPendanaanDariPinjaman(req, res) {
        try {
            let data = await sq.query(`select c6.id as "coa6_id", * from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id where c6."deletedAt" isnull and c5."deletedAt" isnull and c5.company_id = '${req.dataUsers.company_id}' and c6.kode_coa6 ilike '2.1.7%' order by c6.kode_coa6`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listAkunPenambahanModal(req, res) {
        try {
            let data = await sq.query(`select c6.id as "coa6_id", * from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id where c6."deletedAt" isnull and c5."deletedAt" isnull and c5.company_id = '${req.dataUsers.company_id}' and c6.kode_coa6 ilike '3%' order by c6.kode_coa6`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listAkunJenisInvestasi(req, res) {
        try {
            let data = await sq.query(`select c6.id as "coa6_id", * from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id where c6."deletedAt" isnull and c5."deletedAt" isnull and c5.company_id = '${req.dataUsers.company_id}' and c6.kode_coa6 ilike '1.2.1%' order by c6.kode_coa6 `, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async registerPenerimaanKasNonPelangganPengembalianInvestasi(req, res) {
        const { coa6_id, jumlah, deskripsi_penerimaan_kas, nomor_faktur, company_id } = req.body

        try {
            if (!company_id) {
                company_id = req.dataUsers.company_id
            }
            let akunKas = await sq.query(`select c6.* from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.kode_coa6 = '1.1.1.1.01.0001'`, s)
            let penambahanKas = { id: uuid_v4(), penambahan: jumlah, keterangan: deskripsi_penerimaan_kas, referensi_bukti: nomor_faktur, akun_id: coa6_id, akun_pasangan_id: akunKas[0].id, status: 1, nama_transaksi: "penerimaan kas non pelanggan pengembalian investasi" }
            let kas = { id: uuid_v4(), penambahan: jumlah, keterangan: deskripsi_penerimaan_kas, referensi_bukti: nomor_faktur, akun_id: akunKas[0].id, akun_pasangan_id: coa6_id, status: 1, nama_transaksi: "penerimaan kas non pelanggan pengembalian investasi" }
            let hasil = await generalLedger.bulkCreate([penambahanKas, kas])
            res.status(200).json({ status: 200, message: "sukses", data: hasil })
        } catch (err) {
            console.log(req.body)
            console.log(err)
            res.status(500).json({ status: 500, message: "gagal", data: err })
        }
    }

    static async registerPenerimaanKasNonPelangganPendanaanDariPinjaman(req, res) {
        const { coa6_id, jumlah, deskripsi_penerimaan_kas, nomor_faktur, company_id } = req.body

        try {
            if (!company_id) {
                company_id = req.dataUsers.company_id
            }
            let akunKas = await sq.query(`select c6.* from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.kode_coa6 = '1.1.1.1.01.0001'`, s)
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
        const { coa6_id, jumlah, deskripsi_penerimaan_kas, nomor_faktur, company_id } = req.body

        try {
            if (!company_id) {
                company_id = req.dataUsers.company_id
            }
            let akunKas = await sq.query(`select c6.* from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.kode_coa6 = '1.1.1.1.01.0001'`, s)
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

    static async approvalPenerimaanKasNonPelanggan(req, res) {
        const { id, tanggal_persetujuan, status } = req.body

        try {
            if (status == 4) {
                let cekId = await sq.query(`select * from general_ledger gl where gl."deletedAt" isnull and gl.id = '${id}'`, s)
                let cekAkun = await sq.query(`select c6.id as "coa6_id", * from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id join general_ledger gl on gl.akun_id = c6.id where c6."deletedAt" isnull and gl.status = 1 order by gl."createdAt" desc`, s)
                let cekSaldo = await sq.query(`select gl.sisa_saldo from general_ledger gl join coa6 c6 on c6.id = gl.akun_pasangan_id where gl."deletedAt" isnull and gl.status = 4 and c6.kode_coa6 = '1.1.1.1.01.0001' order by gl.tanggal_persetujuan desc limit 1`, s)

                let akunPenambahanKas = { id, tanggal_persetujuan, sisa_saldo: 0, status: 4 }
                let akunKas = { id: '', tanggal_persetujuan, sisa_saldo: 0, status: 4 }

                for (let i = 0; i < cekAkun.length; i++) {
                    if (cekAkun[i].referensi_bukti == cekId[0].referensi_bukti) {
                        if (cekId[0].akun_pasangan_id == cekAkun[i].akun_id) {
                            akunKas.id = cekAkun[i].id
                            if (cekSaldo.length == 0) {
                                akunPenambahanKas.sisa_saldo = cekAkun[i].penambahan
                                akunKas.sisa_saldo = cekAkun[i].penambahan
                            } else {
                                if (cekSaldo[0].sisa_saldo == 0) {
                                    akunPenambahanKas.sisa_saldo = cekAkun[i].penambahan
                                    akunKas.sisa_saldo = cekAkun[i].penambahan
                                } else {
                                    akunPenambahanKas.sisa_saldo = cekAkun[i].penambahan
                                    akunKas.sisa_saldo = cekSaldo[0].sisa_saldo + cekAkun[i].penambahan
                                }
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

    static async pengembalianDanaInvestasi(req, res) {
        let { invoice, tanggal_transaksi, jenis_investasi_id, nominal, deskripsi, company_id, akun_bank_id } = req.body;

        try {
            if (!company_id) {
                company_id = req.dataUsers.company_id
            }

            let akunKas = await sq.query(`select c6.*,gl.sisa_saldo from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id and gl.status = 4 where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.id ='${jenis_investasi_id}' order by gl.tanggal_persetujuan desc limit 1`, s);
            let akunBank = await sq.query(`select c6.*,gl.sisa_saldo from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id and gl.status = 4 where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.id ='${akun_bank_id}' order by gl.tanggal_persetujuan desc limit 1`, s);
            let cekSaldo = await sq.query(`select gl.sisa_saldo from general_ledger gl join coa6 c6 on c6.id = gl.akun_id where gl."deletedAt" isnull and gl.status = 4 and c6.kode_coa6 = '1.1.1.1.01.0001' order by gl.tanggal_persetujuan desc limit 1`, s)

            let kas = { id: uuid_v4(), tanggal_transaksi, pengurangan: nominal, keterangan: deskripsi, referensi_bukti: invoice, tanggal_persetujuan: tanggal_transaksi, akun_id: akunBank[0].id, akun_pasangan_id: akunKas[0].id, sisa_saldo: 0, status: 4, nama_transaksi: "pengembalian dana investasi" }
            let jenisInvestasi = { id: uuid_v4(), tanggal_transaksi, pengurangan: nominal, keterangan: deskripsi, referensi_bukti: invoice, tanggal_persetujuan: tanggal_transaksi, akun_id: akunKas[0].id, akun_pasangan_id: akunBank[0].id, sisa_saldo: 0, status: 4, nama_transaksi: "pengembalian dana investasi" }

            if (cekSaldo.length == 0 || cekSaldo[0].sisa_saldo == 0) {
                kas.sisa_saldo = nominal
            } else {
                kas.sisa_saldo = cekSaldo[0].sisa_saldo - nominal
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
}
module.exports = Controller;