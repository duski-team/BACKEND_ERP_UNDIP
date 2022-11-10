const coa5 = require('../coa5/model')
const { sq } = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const { QueryTypes } = require('sequelize');
const s = { type: QueryTypes.SELECT };

class Controller{

    static async test(req,res){
       let data = await sq.query(`select * from coa5`,s)
    //    console.log(data); 
        for(let i=0;i<data.length;i++){
            let x = data[i].kode_coa5.slice(0,8)+0+data[i].kode_coa5[8]
            // console.log(x);
            await coa5.update({kode_coa5:x},{where:{
                id:data[i].id
            }})
        }
       res.json('oke')

    }

}

module.exports=Controller