const mongoose = require('mongoose')


const schema = new mongoose.Schema({
	usernameID:{type:mongoose.SchemaTypes.ObjectId,ref:"User"}, ///关联 用户名id
	name: {type: String},
	position:{type:String},
	categoryID:{type:mongoose.SchemaTypes.ObjectId,ref:"Category"},///关联 分类
	num:{type:Number},
	buyDate:{type:String},
	freshTime:{type:String}	,
	eidterID:{type:mongoose.SchemaTypes.ObjectId,ref:"User"}
})

module.exports = mongoose.model('History',schema)