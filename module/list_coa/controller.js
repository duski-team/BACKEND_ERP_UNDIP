const { sq } = require("../../config/connection");
const { QueryTypes } = require('sequelize');
const s = { type: QueryTypes.SELECT };


class Controller {

    //! COA1
    //! COA2
    static async listCoa6ByAssetTetap (req,res){
        try {
            let data = await sq.query(`select c6.id as coa6_id,*,left(c6.kode_coa6,3)as kode_coa2 from coa6 c6 join coa5 c5 on c5.id = c6.coa5_id where c6."deletedAt" isnull and c5.company_id ='${req.dataUsers.company_id}' and left(c6.kode_coa6,3) = '1.3'`,s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }
    //! COA3
    //! COA4
    //! COA5
    //! COA6
}
module.exports = Controller;