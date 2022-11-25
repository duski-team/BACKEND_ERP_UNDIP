const { sq } = require("../../config/connection");
const { QueryTypes } = require('sequelize');
const s = { type: QueryTypes.SELECT };


class Controller {

    //! COA1
    //! COA2
    static async listCoa6ByAssetTetap (req,res){
        try {
            let data = await sq.query(``,s);
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