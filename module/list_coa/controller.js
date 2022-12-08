const { sq } = require("../../config/connection");
const { QueryTypes } = require('sequelize');
const s = { type: QueryTypes.SELECT };


class Controller {

    //! COA1
    //! COA2
    static async listCoa6ByAssetTetap(req, res) {
        try {
            let data = await sq.query(`select c6.id as coa6_id,*,left(c6.kode_coa6,3)as kode_coa2 from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id where c6."deletedAt" isnull and c5.company_id ='${req.dataUsers.company_id}' and left(c6.kode_coa6,3) = '1.3'`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }
    //! COA3
    static async listCoa6ByCoa3(req, res) {
        const { kode_coa3 } = req.body;
        try {
            let data = await sq.query(`select c6.id as coa6_id,*,left(c6.kode_coa6,5) as kode_coa3 from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id where c6."deletedAt" isnull and left(c6.kode_coa6,5) = '${kode_coa3}' and c5.company_id = '${req.dataUsers.company_id}'`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }
    static async listAkunKasDanSetaraKas(req, res) {
        try {
            let data = await sq.query(`select c6.id as coa6_id,*,left(c6.kode_coa6,5) as kode_coa3 from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id where c6."deletedAt" isnull and left(c6.kode_coa6,5) = '1.1.1' and c5.company_id = '${req.dataUsers.company_id}'`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }
    //! COA4
    //! COA5
    //! COA6
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

    static async listAkunKasByCompanyId(req, res) {
        try {
            let data = await sq.query(`select c6.id as "coa6_id", * from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id join coa4 c4 on c4.id = c5.coa4_id where c6."deletedAt" isnull and c5."deletedAt" isnull and c4.kode_coa4 = '1.1.1.1' or c4.kode_coa4 = '1.1.1.7' and c5.company_id = '${req.dataUsers.company_id}' order by c6.kode_coa6`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listCoa6ByCoa2(req, res) {
        let { kode_coa2 } = req.body
        try {
            let data = await sq.query(`select c6.id as coa6_id, *, left(c6.kode_coa6,3) as kode_coa2 from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id where c6."deletedAt" isnull and left(c6.kode_coa6,3) = '${kode_coa2}' and c5.company_id = '${req.dataUsers.company_id}'`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listAkunJenisBiayaUntukPegawai(req, res) {
        try {
            let data = await sq.query(`select c6.id as "coa6_id", * from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id where c6."deletedAt" isnull and c5.company_id = '${req.dataUsers.company_id}' and left(c6.kode_coa6,3) = '7.1'`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listAkunJenisBiayaNonPegawai(req, res) {
        try {
            let data = await sq.query(`select c6.id as "coa6_id", * from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id where c6."deletedAt" isnull and c5.company_id = '${req.dataUsers.company_id}' and left(c6.kode_coa6,3) = '7.2'`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listAkunPajak(req, res) {
        try {
            let data = await sq.query(`select c6.id as "coa6_id", * from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id where c6."deletedAt" isnull and c5.company_id = '${req.dataUsers.company_id}' and left(c6.kode_coa6,7) = '2.1.6.1'`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }
}
module.exports = Controller;