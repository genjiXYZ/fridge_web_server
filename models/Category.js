const mongoose = require('mongoose')


const schema = new mongoose.Schema({

	category: {
		type: String
	},
	defPosition: {
		type: String
	},
	pickTimes: {
		type: Number
	},
	icon: {
		type: String,
		default: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
	},
	defOption: {
		type: Array
	}
})


module.exports = mongoose.model('Category', schema)