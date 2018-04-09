let marked = require('marked')
let high = require('highlight.js')
let express = require('express')
let bodyParser = require('body-parser')
let app = express();
let self = this;
self.cache = [];
let { ast } = require('./ast.js')
let parse = ast();
function ss(o) {
    // Note: cache should not be re-used by repeated calls to JSON.stringify.
    var cache = [];
    JSON.stringify(o, function(key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return;
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    });
    return o
    cache = null; // Enable garbage collection
}
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

app.use(bodyParser.json({limit: '2mb'}))
app.use(bodyParser.urlencoded({ extended: true , limit:'2mb'}))
app.use(bodyParser.json())

app.all('*',function (req,res,next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","POST,GET");
    next();
});
let last = ''
app.post('/worker',function(req,res){
    var value = marked(req.body.text);
    var data = {
        data:value
    }
    res.end(JSON.stringify(data))
})
app.post('/test',function(req,res){
    res.end(req.body.text)
})
app.get('/test',function(req,res){
    res.end('ok')
})

app.listen(4000)

