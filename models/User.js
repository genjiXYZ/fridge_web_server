const mongoose = require('mongoose')


const schema = new mongoose.Schema({
	username: {type: String, unique:true},
	nickname:{type:String, unique:true},
	email:{type:String,unique:true},
	phone:{type:String,unique:true},
	password:{
		type: String,
		set(val){return require('bcrypt').hashSync(val,10)}
	},
	avatar:{type:String,
	default:"https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"}
})

module.exports = mongoose.model('User',schema)	