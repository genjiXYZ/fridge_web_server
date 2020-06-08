module.exports = app=>{

	const mongoose = require('mongoose')

	// mongoose.connect("mongodb+srv://895939059:liulingyue00OO@cluster0-8zzgy.azure.mongodb.net/test?retryWrites=true&w=majority",{
	// 	useNewUrlParser:true,
	// 	useUnifiedTopology:true
	// }).then(() => {
	// 	console.log("cloud 连接数据库成功");
	// 	})
	// 	.catch(err => {
	// 	console.log(err);
	// 	})


		mongoose.connect("mongodb://127.0.0.1:27017/fridgelly",{
		useNewUrlParser:true,
		useUnifiedTopology:true,
		useCreateIndex:true
	}).then(() => {
		console.log("本地  连接数据库成功");
		})
		.catch(err => {
		console.log(err);
		})


		// mongoose.connect("mongodb+srv://895939059:liulingyue00OO@cluster0-8zzgy.azure.mongodb.net/test?retryWrites=true&w=majority",{
		// 	useNewUrlParser:true,
		// 	useUnifiedTopology:true,
		// 	useCreateIndex:true
		// }).then(() => {
		// 	console.log("mongodb clound  连接数据库成功");
		// 	})
		// 	.catch(err => {
		// 	console.log(err);
		// 	})
	


}