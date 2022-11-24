const { verifyToken } = require('../helper/jwt')
const user = require('../module/users/model')

async function authentification (req,res,next){
    try {
        let authToken = req.headers.authorization
        let token = authToken.split(' ')[1]
        let decode = verifyToken(token);
        let masterUser = await user.findAll({where:{id:decode.id,password:decode.password}})
        if(masterUser.length==0){
            res.status(201).json({ status: 201, message: "anda belum login" });
        }else{
            req.dataUsers = decode, 
            next()
        }
    } catch (err) {
        console.log(err);
        res.status(201).json({ status: 201, message: "anda belum login" });
    }
}

module.exports = authentification