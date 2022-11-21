const jwt = require( 'jsonwebtoken' )

let private = process.env.PRIVATE

function generateToken( payload ) {
	return jwt.sign( payload,private )
}

function verifyToken( token ) {
	return jwt.verify( token,private )
}

module.exports = {generateToken,verifyToken}