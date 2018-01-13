function main(){
    let express = require('express');
    let app = express();
    let opn = require('opn');
    let path = require('path');
    app.use(express.static(path.join('./dist')));
    app.listen(3001,function(req,res){
        opn('http://localhost:3001');
    })
}

module.exports = main;