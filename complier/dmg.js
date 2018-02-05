const dmg = require('appdmg')
const path = require('path')
const ee = dmg({
    target:'mark.dmg',
    basepath:path.join(__dirname,'../build/markdown编辑器-darwin-x64/markdown编辑器.app'),
    specification:{
        "title":"mark install",
        "icon":path.join(__dirname,'../icons/icon.icns'),
         "contents": [
            { "x": 448, "y": 344, "type": "link", "path": "/Applications" },
            { "x": 192, "y": 344, "type": "file", "path": path.join(__dirname,'../build/markdown编辑器-darwin-x64/markdown编辑器.app'), }
        ]
    }
});

ee.on('progress', function (info) {

  // info.current is the current step
  // info.total is the total number of steps
  // info.type is on of 'step-begin', 'step-end'

  // 'step-begin'
  // info.title is the title of the current step

  // 'step-end'
  // info.status is one of 'ok', 'skip', 'fail'

});

ee.on('finish', function () {
  console.log('打包完成')
});

ee.on('error', function (err) {
  console.log('报错了：');
  console.log(err);
});