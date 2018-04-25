let marked = require('marked')
let high = require('highlight.js')
let express = require('express')
let bodyParser = require('body-parser')
let app = express();
let self = this;
self.cache = [];
let { ast } = require('./ast.js')
let parse = ast();
let { diff } = require('./diff.js')
let { myers } = require('./diff2.js')

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
    var value = marked(req.body.text)
    // 去除所有的换行符
    // var dom = parse(`<div>${value.replace(/\n/g,'')}</div>`)
    var data = {
        data:value
    }
    res.end(JSON.stringify(data))
    // if(last){
    //     var maxPath = myers(last.children,dom.children,diff)
    //     var n = dom.children;
    //     var o = last.children;
    //     for(let i = 0 ; i < maxPath.length ; i++){
    //         if(maxPath[i+1]){
    //             var d = [maxPath[i+1][0]-maxPath[i][0],maxPath[i+1][1]-maxPath[i][1]]
    //             if(d[0] == 1 && d[1] == 1){
    //                 console.log(`  ${n[maxPath[i][1]].tag}`)
    //             }else if(d[0] == 1 && d[1] == 0){
    //                 console.log(`- ${o[maxPath[i][0]].tag}`)
    //             }else if(d[0] == 0 && d[1] == 1){
    //                 console.log(`+ ${n[maxPath[i][1]].tag}`)
    //             }
    //         }
    //     }
    // }else{
    //     console.log('没有last')
    // }
    // 最后记录上一次dom节点
    // last = parse(`<div>${value.replace(/\n/g,'')}</div>`)
})
// app.post('/test',function(req,res){
//     res.end(req.body.text)
// })
app.get('/test',function(req,res){
    res.end('ok')
})
var port = process.env.port || 4000;
app.listen(port)

