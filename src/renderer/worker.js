let express = require('express')
let bodyParser = require('body-parser')
let app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.all('*',function (req,res,next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","POST,GET");
    next();
});

app.post('/test',function(req,res){
    res.end(JSON.stringify(req.body.text))
})
app.listen(3000)
// for(let i = 0 ; i < 1000000000 ; i++){}
// console.log('ok')
