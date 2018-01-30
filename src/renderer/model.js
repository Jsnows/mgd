const model = {
    init:function (self) {
        _menu(self);
    }
}
// 菜单初始化
function _menu(self){
    const {app, Menu} = require('electron').remote
    const template = [
    {
      label: '编辑',
      submenu: [{
        label: '撤销',
        accelerator: 'CmdOrCtrl+Z',
        role: 'undo'
      }, {
        label: '重做',
        accelerator: 'Shift+CmdOrCtrl+Z',
        role: 'redo'
      }, {
        type: 'separator'
      }, {
        label: '剪切',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
      }, {
        label: '复制',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
      }, {
        label: '粘贴',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
      }, {
        label: '全选',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall'
      }]
    },{
      label: '字体',
      submenu:[{
        label: '增大markdown字体',
        accelerator: 'CmdOrCtrl+=',
        click:()=>{self.addFontSize()}
      },
      {
        label: '减小markdown字体',
        accelerator: 'CmdOrCtrl+-',
        click:()=>{self.minuFontSize()}
      },
      {
        label: '增大html字体',
        accelerator: 'Shift+CmdOrCtrl+=',
        click:()=>{self.addHtmlFontSize()}
      },
      {
        label: '减小html字体',
        accelerator: 'Shift+CmdOrCtrl+-',
        click:()=>{self.minuHtmlFontSize()}
      }]
    },
    {
      label: '窗口',
      submenu:[{
        label: '缩放文档展示区域',
        accelerator: 'CmdOrCtrl+F',
        click:()=>{
          if(!self.show){
            self.clickShow();
          }else{
            self.hiddenShow();
          }
        }
      },{
        label: '创建新窗口',
        accelerator: 'CmdOrCtrl+N',
        click:()=>{
          self.openNewWindow();
        }
      }]
    }]
    if (process.platform === 'darwin') {
      template.unshift({
        label: app.getName(),
        submenu: [
          {label:'关于',role: 'about'},
          {type: 'separator'},
          {role: 'services', submenu: []},
          {type: 'separator'},
          {role: 'hide'},
          {role: 'hideothers'},
          {role: 'unhide'},
          {type: 'separator'},
          {role: 'quit'}
        ]
      })
    }
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}
export default model;