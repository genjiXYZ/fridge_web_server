module.exports = app => {
	const express = require('express')
	const router = express.Router({
		mergeParams: true ///合并 url 参数  要不 获取不到
	})
	//token
	const jwt = require('jsonwebtoken')

	//http-assert
	const assert = require('http-assert')


	//model  这一要引入  否则 关联id无效
	const User = require('../models/User')
	const Guest = require('../models/Guest')

	const Category = require('../models/Category')
	const History = require('../models/History')



	//验证token 中间件  
	const verifyToken = require('../middleware/verifyToken')

	// curd 通用接口
	const resource = require('../middleware/resource')











	///增  动态创建 食物/Foods
	router.post('/', verifyToken(), async (req, res) => {
		const newModel = req.body
		newModel.usernameID = req.user._id
		console.log(newModel)
		const model = await req.Model.create(newModel)

		res.send({
			message: "添加成功"
		})
		console.log(' post   ' + req.logName)
	})




	//删
	router.delete('/:id', verifyToken(), async (req, res) => {
		const item = await req.Model.findByIdAndDelete(req.params.id)
		let historyModel = {
			...item._doc
		} //必要

		delete historyModel._id
		historyModel.usernameID += "" //第一次发现这个写法
		historyModel.categoryID = historyModel.categoryID + ""
		historyModel.eidterID = req.user._id
		historyModel.buyDate = new Date()
		console.log(historyModel)
		console.log(req.user)

		const historyRes = await History.create(historyModel)
		assert(item, 433, "对不起,已经被删除")
		res.send({
			message: "删除食物成功"
		})
		console.log(' delete  ' + req.logName)
	})

	//改修  
	router.put('/:id', verifyToken(), async (req, res) => {
		console.log(req.body)
		const historyModel = req.body
		const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
		console.log(historyModel)
		if (historyModel.num < model.num) {
			historyModel.num = model.num - historyModel.num
			historyModel.buyDate = new Date()
			delete historyModel._id
			await History.create(historyModel)
		}
		res.send({
			message: "修改成功"
		})

		console.log(' put  ' + req.logName)
	})


	///查  get 动态 列表
	router.get('/', async (req, res) => {
		let items
		console.log(req.params.resource)
		if (req.params.resource == 'categorys') {
			//根据用户select  次数更改 list 优先级  (待wanshan)
			items = await req.Model.find(req.body).sort({
				pickTimes: -1
			})
		} else {
			items = await req.Model.find(req.body).populate('categoryID')
		}
		console.log(items)
		res.send(items)
		console.log(' get  ' + req.logName)
	})

	//////////////////////////  获取食物详细信息

	router.get('/:id', async (req, res) => {
		const model = await req.Model.findById(req.params.id).populate('categoryID')
		// .populate('categoryID')
		res.send(model)
		console.log("edit fresher")
		console.log(req.params)
	})

	//http://localhost:3000/admin/api/rest/foods/position/:position
	///不同位置 不同 position  直接/:position  与/:id 冲突   没设计好 先放着

	router.get('/position/:position/:usernameID?', async (req, res) => {
		console.log(req.params)
		let searchModel = {}
		if (req.params.usernameID) {
			searchModel = {
				position: req.params.position,
				usernameID: req.params.usernameID
			}
		} else {
			searchModel = {
				position: req.params.position,
			}
		}


		//path  要查询的表 
		//select (option)	
		//要查询的 对象
		//3.model(可选)
		//类型：Model，可选，指定关联字段的 model，如果没有指定就会使用Schema的ref。
		// 4.match(可选)
		// 类型：Object，可选，指定附加的查询条件。
		// 5.options(可选)
		// 类型：Object，可选，指定附加的其他查询选项，如排序以及条数限制等等。
		const items = await req.Model.find(searchModel).populate({
			path: "usernameID",
			select: ["avatar", "nickname"]
		}).populate('categoryID')
		res.send(items)
	})


	// ///返回所有用户 拥有的  items
	// router.get('/item/:username', async (req, res) => {
	// 	console.log(req.params)
	// 	const items = await Fresher.find(req.params)
	// 	res.send(items)
	// 	console.log("item1")
	// })

	////挂载 ///   curd   

	//http://localhost:3000/admin/api/rest/:resource
	app.use('/admin/api/rest/:resource', resource(), router)






	//////获取用户组 


	app.get('/admin/api/groupMembers', async (req, res) => {
		const group = await User.find({})
		let groupMembers = []
		group.forEach(e => {
			groupMembers.push({
				"nickname": e.nickname,
				"avater": e.avatar,
				"id": e.id
			})
		});
		res.send(groupMembers)
	})


	//////// 用户名 重复性验证
	app.post('/admin/api/testUsername', async (req, res) => {
		const user = await User.findOne({
			username: req.body.username
		})
		console.log(user)
		assert(!user, 423, "用户名已存在")
		// if (user) {
		// 	return res.status(423).send({
		// 		message: "用户名已存在"
		// 	})
		// } 
		if (!user) {
			return res.status(200).send({
				message: "用户名可用"
			})
		}
	})
	//注册
	app.post('/admin/api/regist', async (req, res) => {


		const user = await User.create({
			username: req.body.username,
			nickname: req.body.nickname,
			password: req.body.password,
		})
		res.send({
			message: "注册成功"
		})
	})

	app.post('/admin/api/registGuest', async (req, res) => {

		let arr = [/^([A-Za-z0-9@._]){5,18}$/.test(req.body.username), /^([A-Za-z0-9@._]){5,18}$/.test(req.body.password)]

		assert(!arr.includes(false), 423, "格式不正确")



		if (!arr.includes(false)) {
			const user = await Guest.create({
				username: req.body.username,
				password: req.body.password,

			})
			res.send({
				message: "注册成功"
			})
		}

	})




	//用户登录
	app.post('/admin/api/login', async (req, res) => {
		const user = await User.findOne({
			username: req.body.username
		})
		assert(user, 422, "用户不存在")
		const isPasswordValid = require('bcrypt').compareSync(
			req.body.password,
			user.password
		)
		assert(isPasswordValid, 422, "密码填错了,认真点")
		//成功后 生成token  //jwt    secret
		const token = jwt.sign({
			id: String(user._id),
		}, app.get('envSecret'))
		const username = user.username
		const avatar = user.avatar
		const nickname = user.nickname

		res.send({
			token,
			// _id: user._id,
			username,
			avatar,
			nickname,
			message: `Dear ${username},welcome to 611's fridge`
		})
	})


	//头像上传
	const multer = require('multer')
	const upload = multer({
		dest: __dirname + '/../avatars'
	})
	app.post('/admin/api/upload/:username', upload.single('file'), async (req, res) => {
		const file = req.file
		file.url = `http://localhost:3000/avatars/${file.filename}`
		const addAvatar = {
			avatar: file.url
		}
		// const model = await User.findByIdAndUpdate(req.params.id, addAvatar)
		const model = await User.findOneAndUpdate(req.params.username, addAvatar)

		res.send(file)
	})

	//返回用户信息
	app.get('/admin/api/profile', verifyToken(), async (req, res) => {
		res.send(req.user)
	})


	// 错误捕获 express 5  可用
	app.use(async (err, req, res, next) => {
		console.log(err)
		if (err.message == "jwt malformed") {
			res.status(401).send({
				message: "权限:游客,请登录!"
			})
			return
		}

		res.status(err.statusCode || 500).send({
			message: ((err.message == "jwt malformed" ? "权限:游客,请登录!" : err.message))
		})


	})
}