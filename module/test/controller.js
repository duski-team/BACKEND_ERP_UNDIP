const coa5 = require('../coa5/model')
const coa6 = require('../coa6/model')
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

    static async coa6(req,res){
        let data = await sq.query(`select * from coa6`,s)

        for(let i=0;i<data.length;i++){
            let arr = data[i].kode_coa6.split('.')
            let a = '0000'+ arr[5]
            let b = a.substring(a.length-4,a.length)
            let x = data[i].kode_coa6.slice(0,8)+0+data[i].kode_coa6[8]+'.'+b
            
            await coa6.update({kode_coa6:x},{where:{
                id:data[i].id
            }})
          
            
        }
        res.json('oke')
    }

}

module.exports=Controller