const mongoose = require('mongoose')


const schema = new mongoose.Schema({
	
	categoryId:{type:mongoose.SchemaTypes.ObjectId},
	selectName:{type:String},
	

})




module.exports = mongoose.model('Select',schema)