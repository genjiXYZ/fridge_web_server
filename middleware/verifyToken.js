//验证token  中间件

module.exports = options => {

	//token
	const jwt = require('jsonwebtoken')
	//http-assert

	// const assert = require('http-assert')

	//model
	const User = require('../models/User')


	return async (req, res,next) => {
		const token = String(req.headers.authorization).split(" ").pop()
		// assert(token, 401, "请重新登录")
		// console.log(req.headers.authorization)
		const {
			id
		} = jwt.verify(token, req.app.get('envSecret'))
		//这里注意 req.app    如果不封装 直接app 就可以
		// assert(id, 401, "请重新登录")
		req.user = await User.findById(id)
		// assert(req.user, 401, '请重新登录')
		console.log(req.user)
	 		await  next()
	}


}