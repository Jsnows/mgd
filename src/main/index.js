import { app, BrowserWindow, globalShortcut,dialog,ipcMain} from 'electron'
import fs from 'fs'
import path from 'path'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */

const exec = require('child_process').exec;  
exec(`node ${path.join(__dirname,'../renderer/worker.js')}`,function(err,stdout,stderr){
  
})

if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  // autoUpdater.updateMenu()
  // var shouldQuit = makeSingleInstance()
  // if (shouldQuit) return app.quit()
  var filePath = '';
  mainWindow = new BrowserWindow({
    useContentSize: true,
    minWidth:1000,
    minHeight:600,
    width:2000,
    height:2000,
    backgroundColor:'#2e2c29'
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}
app.on('ready', ()=>{
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
app.on('open-file',(event,filePath)=>{
  if(process.env._firsted){
    process.env._openFilePath = filePath;
    createWindow();
  }else{
    process.env._firsted = true;
    process.env._openFilePath = filePath;  
  }
})
ipcMain.on('webDone',()=>{
  process.env._openFilePath = '';
})
// function makeSingleInstance () {
//   if (process.mas) return false

//   return app.makeSingleInstance(function () {
//     if (mainWindow) {
//       if (mainWindow.isMinimized()) mainWindow.restore()
//       mainWindow.focus()
//     }
//   })
// }
