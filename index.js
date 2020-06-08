const express = require("express");
const cors = require('cors');
const app  = express();


//jwt  secret
app.set('envSecret',"envSecret" )   


app.use (express.json())

// //跨域


app.use(cors())
app.use('/avatars',express.static(__dirname+'/avatars'))

// //数据库
require('./db/db')(app)

// //路由
require('./router_admin')(app)

//端口3000
app.listen(3000, ()=>{
	console.log("http://localhost:3000")
})

console.log(__dirname)