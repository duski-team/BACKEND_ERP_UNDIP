const { sq } = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const generalLedger = require("./model");
const { QueryTypes } = require('sequelize');
const s = { type: QueryTypes.SELECT };


class Controller {

    static register(req, res) {
        const { tanggal_transaksi, penambahan, pengurangan, keterangan, referensi_bukti, sisa_saldo, pembelian_id, penjualan_id, akun_id, akun_pasangan_id, tanggal_persetujuan, company_id } = req.body

        generalLedger.create({ id: uuid_v4(), tanggal_transaksi, penambahan, pengurangan, keterangan, referensi_bukti, sisa_saldo, pembelian_id, penjualan_id, akun_id, akun_pasangan_id, tanggal_persetujuan, company_id }).then(data => {
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
            let cekNomorFaktur = await sq.query(`select * from general_ledger gl where gl."deletedAt" isnull and gl.referensi_bukti = '${nomor_faktur}'`, s)
            if (cekNomorFaktur.length > 0) {
                res.status(201).json({ status: 204, message: "data sudah ada" })
            } else {
                let akunKas = await sq.query(`select c6.* from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.id = '${akun_kas_id}'`, s)

                let penambahanKas = { id: uuid_v4(), pengurangan: jumlah, keterangan: deskripsi_penerimaan_kas, referensi_bukti: nomor_faktur, akun_id: coa6_id, status: 1, nama_transaksi: "penerimaan kas non pelanggan pengembalian investasi", pegawai_id: req.dataUsers.id, company_id }
                let kas = { id: uuid_v4(), penambahan: jumlah, keterangan: deskripsi_penerimaan_kas, referensi_bukti: nomor_faktur, akun_id: akunKas[0].id, status: 1, nama_transaksi: "penerimaan kas non pelanggan pengembalian investasi", pegawai_id: req.dataUsers.id, company_id }

                let hasil = await generalLedger.bulkCreate([penambahanKas, kas])
                res.status(200).json({ status: 200, message: "sukses", data: hasil })
            }
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
            let cekNomorFaktur = await sq.query(`select * from general_ledger gl where gl."deletedAt" isnull and gl.referensi_bukti = '${nomor_faktur}'`, s)
            if (cekNomorFaktur.length > 0) {
                res.status(201).json({ status: 204, message: "data sudah ada" })
            } else {
                let akunKas = await sq.query(`select c6.* from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.id = '${akun_kas_id}'`, s)

                let penambahanKas = { id: uuid_v4(), penambahan: jumlah, keterangan: deskripsi_penerimaan_kas, referensi_bukti: nomor_faktur, akun_id: coa6_id, status: 1, nama_transaksi: "penerimaan kas non pelanggan pendanaan dari pinjaman", pegawai_id: req.dataUsers.id, company_id }
                let kas = { id: uuid_v4(), penambahan: jumlah, keterangan: deskripsi_penerimaan_kas, referensi_bukti: nomor_faktur, akun_id: akunKas[0].id, status: 1, nama_transaksi: "penerimaan kas non pelanggan pendanaan dari pinjaman", pegawai_id: req.dataUsers.id, company_id }

                let hasil = await generalLedger.bulkCreate([penambahanKas, kas])
                res.status(200).json({ status: 200, message: "sukses", data: hasil })
            }
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
            let cekNomorFaktur = await sq.query(`select * from general_ledger gl where gl."deletedAt" isnull and gl.referensi_bukti = '${nomor_faktur}'`, s)
            if (cekNomorFaktur.length > 0) {
                res.status(201).json({ status: 204, message: "data sudah ada" })
            } else {
                let akunKas = await sq.query(`select c6.* from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id where c6."deletedAt" isnull and c5.company_id = '${company_id}' and c6.id = '${akun_kas_id}'`, s)

                let penambahanKas = { id: uuid_v4(), penambahan: jumlah, keterangan: deskripsi_penerimaan_kas, referensi_bukti: nomor_faktur, akun_id: coa6_id, status: 1, nama_transaksi: "penerimaan kas non pelanggan penambahan modal", pegawai_id: req.dataUsers.id, company_id }
                let kas = { id: uuid_v4(), penambahan: jumlah, keterangan: deskripsi_penerimaan_kas, referensi_bukti: nomor_faktur, akun_id: akunKas[0].id, status: 1, nama_transaksi: "penerimaan kas non pelanggan penambahan modal", pegawai_id: req.dataUsers.id, company_id }

                let hasil = await generalLedger.bulkCreate([penambahanKas, kas])
                res.status(200).json({ status: 200, message: "sukses", data: hasil })
            }

        } catch (err) {
            console.log(req.body)
            console.log(err)
            res.status(500).json({ status: 500, message: "gagal", data: err })
        }
    }

    static async approvalPenerimaanKasNonPelangganPengembalianInvestasi(req, res) {
        const { id, tanggal_persetujuan, status } = req.body

        try {
            let cekId = await sq.query(`select * from general_ledger gl where gl."deletedAt" isnull and gl.id = '${id}'`, s)
            let cekAkun = await sq.query(`select c6.id as "coa6_id", gl.id as "general_ledger_id", * from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id join general_ledger gl on gl.akun_id = c6.id where c6."deletedAt" isnull and c5.company_id = '${req.dataUsers.company_id}' order by c6."kode_coa6"`, s)
            
            let akunPenambahanKas = { id, tanggal_persetujuan, sisa_saldo: 0, status }
            let akunKas = { id: '', tanggal_persetujuan, sisa_saldo: 0, status }
            let akun_kas_id = ''
            let penambahan = 0 

            for (let i = 0; i < cekAkun.length; i++) {
                if (cekAkun[i].referensi_bukti == cekId[0].referensi_bukti) {
                    if (cekId[0].akun_id != cekAkun[i].akun_id) {
                        akunKas.id = cekAkun[i].general_ledger_id
                        akun_kas_id = cekAkun[i].coa6_id 
                        penambahan = cekAkun[i].penambahan
                    } else {
                        akunPenambahanKas.sisa_saldo = cekAkun[i].pengurangan
                    }
                }
            }

            let cekSaldo = await sq.query(`select c6.*, gl.sisa_saldo from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id and gl.status = 4 where gl."deletedAt" isnull and c6."deletedAt" isnull and c5.company_id = '${req.dataUsers.company_id}' and c6.id = '${akun_kas_id}' order by gl.tanggal_persetujuan desc limit 1`, s)

            if (cekSaldo[0].sisa_saldo == 0 || cekSaldo[0].sisa_saldo == null) {
                akunKas.sisa_saldo = cekSaldo[0].nominal_coa6 + penambahan
            } else {
                akunKas.sisa_saldo = cekSaldo[0].sisa_saldo + penambahan
            }

            if (status == 4) {
                await generalLedger.bulkCreate([akunPenambahanKas, akunKas], { updateOnDuplicate: ["sisa_saldo", "status", "tanggal_persetujuan"] })
                res.status(200).json({ status: 200, message: "sukses" })
            } else {
                await generalLedger.bulkCreate([akunPenambahanKas, akunKas], { updateOnDuplicate: ["status"] })
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
            let cekId = await sq.query(`select * from general_ledger gl where gl."deletedAt" isnull and gl.id = '${id}'`, s)
            let cekAkun = await sq.query(`select c6.id as "coa6_id", gl.id as "general_ledger_id", * from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id join general_ledger gl on gl.akun_id = c6.id where c6."deletedAt" isnull and c5.company_id = '${req.dataUsers.company_id}' order by c6."kode_coa6"`, s)
            
            let akunPenambahanKas = { id, tanggal_persetujuan, sisa_saldo: 0, status }
            let akunKas = { id: '', tanggal_persetujuan, sisa_saldo: 0, status }
            let akun_kas_id = ''
            let penambahan = 0 

            for (let i = 0; i < cekAkun.length; i++) {
                if (cekAkun[i].referensi_bukti == cekId[0].referensi_bukti) {
                    if (cekId[0].akun_id != cekAkun[i].akun_id) {
                        akunKas.id = cekAkun[i].general_ledger_id
                        akun_kas_id = cekAkun[i].coa6_id 
                        penambahan = cekAkun[i].penambahan
                    } else {
                        akunPenambahanKas.sisa_saldo = cekAkun[i].penambahan
                    }
                }
            }

            let cekSaldo = await sq.query(`select c6.*, gl.sisa_saldo from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id and gl.status = 4 where gl."deletedAt" isnull and c6."deletedAt" isnull and c5.company_id = '${req.dataUsers.company_id}' and c6.id = '${akun_kas_id}' order by gl.tanggal_persetujuan desc limit 1`, s)

            if (cekSaldo[0].sisa_saldo == 0 || cekSaldo[0].sisa_saldo == null) {
                akunKas.sisa_saldo = cekSaldo[0].nominal_coa6 + penambahan
            } else {
                akunKas.sisa_saldo = cekSaldo[0].sisa_saldo + penambahan
            }

            if (status == 4) {
                await generalLedger.bulkCreate([akunPenambahanKas, akunKas], { updateOnDuplicate: ["sisa_saldo", "status", "tanggal_persetujuan"] })
                res.status(200).json({ status: 200, message: "sukses" })
            } else {
                await generalLedger.bulkCreate([akunPenambahanKas, akunKas], { updateOnDuplicate: ["status"] })
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
            let cekId = await sq.query(`select * from general_ledger gl where gl."deletedAt" isnull and gl.id = '${id}'`, s)
            let cekAkun = await sq.query(`select c6.id as "coa6_id", gl.id as "general_ledger_id", * from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id join general_ledger gl on gl.akun_id = c6.id where c6."deletedAt" isnull and c5.company_id = '${req.dataUsers.company_id}' order by c6."kode_coa6"`, s)

            let akunPenambahanKas = { id, tanggal_persetujuan, sisa_saldo: 0, status }
            let akunKas = { id: '', tanggal_persetujuan, sisa_saldo: 0, status }
            let akun_kas_id = ''
            let penambahan = 0
            for (let i = 0; i < cekAkun.length; i++) {
                if (cekAkun[i].referensi_bukti == cekId[0].referensi_bukti) {
                    if (cekId[0].akun_id != cekAkun[i].akun_id) {
                        akun_kas_id = cekAkun[i].coa6_id
                        akunKas.id = cekAkun[i].general_ledger_id
                        penambahan = cekAkun[i].penambahan
                    } else {
                        akunPenambahanKas.sisa_saldo = cekAkun[i].penambahan
                    }
                }
            }

            let cekSaldo = await sq.query(`select c6.*, gl.sisa_saldo from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id left join general_ledger gl on gl.akun_id = c6.id and gl.status = 4 where gl."deletedAt" isnull and c6."deletedAt" isnull and c5.company_id = '${req.dataUsers.company_id}' and c6.id = '${akun_kas_id}' order by gl.tanggal_persetujuan desc limit 1`, s)

            if (cekSaldo[0].sisa_saldo == 0 || cekSaldo[0].sisa_saldo == null) {
                akunKas.sisa_saldo = cekSaldo[0].nominal_coa6 + penambahan
            } else {
                akunKas.sisa_saldo = cekSaldo[0].sisa_saldo + penambahan
            }

            if (status == 4) {
                await generalLedger.bulkCreate([akunPenambahanKas, akunKas], { updateOnDuplicate: ["sisa_saldo", "status", "tanggal_persetujuan"] })
                res.status(200).json({ status: 200, message: "sukses" })
            } else {
                await generalLedger.bulkCreate([akunPenambahanKas, akunKas], { updateOnDuplicate: ["status"] })
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
            let data = await sq.query(`select gl.id as "general_ledger_id",c6.nama_coa6 ,c6.kode_coa6 ,gl.tanggal_transaksi ,gl.penambahan ,gl.pengurangan ,gl.keterangan ,gl.referensi_bukti ,gl.sisa_saldo ,gl.tanggal_persetujuan , gl.nama_transaksi ,gl.status from general_ledger gl join coa6 c6 on c6.id = gl.akun_id where gl.nama_transaksi = 'penerimaan kas non pelanggan pendanaan dari pinjaman' or gl.nama_transaksi = 'penerimaan kas non pelanggan pengembalian investasi' or gl.nama_transaksi = 'penerimaan kas non pelanggan penambahan modal' order by gl."createdAt" desc`, s);
            let data2 = await sq.query(`select distinct gl.referensi_bukti from general_ledger gl join coa6 c6 on c6.id = gl.akun_id where gl.nama_transaksi = 'penerimaan kas non pelanggan pendanaan dari pinjaman' or gl.nama_transaksi = 'penerimaan kas non pelanggan pengembalian investasi' or gl.nama_transaksi = 'penerimaan kas non pelanggan penambahan modal' `, s);

            for (let i = 0; i < data2.length; i++) {
                data2[i].isi = []
                for (let j = 0; j < data.length; j++) {
                    if (data2[i].referensi_bukti == data[j].referensi_bukti) {
                        data2[i].isi.push(data[j])
                    }
                }
            }

            let hasil = []
            for (let k = 0; k < data2.length; k++) {
                for (let l = 0; l < data2[k].isi.length; l++) {
                    let x = {
                        general_ledger_id: data2[k].isi[0].general_ledger_id,
                        nama_coa6: data2[k].isi[0].nama_coa6,
                        kode_coa6: data2[k].isi[0].kode_coa6,
                        general_ledger_id_pasangan: data2[k].isi[1].general_ledger_id,
                        nama_coa6_pasangan: data2[k].isi[1].nama_coa6,
                        kode_coa6_pasangan: data2[k].isi[1].kode_coa6,
                        referensi_bukti: data2[k].isi[0].referensi_bukti,
                        nama_transaksi: data2[k].isi[0].nama_transaksi,
                    }
                    hasil.push(x)
                }
            }

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static update(req, res) {
        const { id, tanggal_transaksi, penambahan, pengurangan, keterangan, referensi_bukti, sisa_saldo, pembelian_id, penjualan_id, akun_id, akun_pasangan_id, tanggal_persetujuan, company_id } = req.body

        generalLedger.update({ tanggal_transaksi, penambahan, pengurangan, keterangan, referensi_bukti, sisa_saldo, pembelian_id, penjualan_id, akun_id, akun_pasangan_id, tanggal_persetujuan, company_id }, { where: { id } }).then(data => {
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

}
module.exports = Controller;