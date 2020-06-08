module.exports = options => {
	return async (req, res, next) => {
		if(['user','users'].includes(req.params.resource)){
		 return	res.send({
				message:"你无权访问"
			})

		}
		// CURD 通用接口 中间件
		//转换类名
		const modelName = require('inflection').classify(req.params.resource)
		///这里 要req.Model  给请求数据挂载一个Model 否则后面访问不到
		req.Model = require(`../models/${modelName}`)
		req.logName = modelName
		
		next()
	}
}
