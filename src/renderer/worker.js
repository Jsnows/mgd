let marked = require('marked')
let high = require('highlight.js')
let express = require('express')
let bodyParser = require('body-parser')
let app = express();
let self = this;
self.cache = [];
marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: true,
    sanitize: false,
    smartLists: true,
    smartypants: true,
    xhtml: true,
    highlight: function (code) {
        if(self.cache.length !== 0){
            for(let i = 0 ; i < self.cache.length ; i++){
                if(self.cache[i].code == code){
                    return self.cache[i].highCode;
                }
            }
            var obj = {
                code:code,
                highCode:high.highlightAuto(code).value
            }
            self.cache.push(obj);
            return obj.highCode;    
        }else{
            var obj = {
                code:code,
                highCode:high.highlightAuto(code).value
            }
            self.cache.push(obj);
            return obj.highCode;
        }
    }
});
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.all('*',function (req,res,next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","POST,GET");
    next();
});

app.post('/test',function(req,res){
    res.end(marked(req.body.text))
})
app.listen(3000)
// for(let i = 0 ; i < 1000000000 ; i++){}
// console.log('ok')
