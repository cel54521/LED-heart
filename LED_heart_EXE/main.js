'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const dialog = electron.dialog;

let mainWindow = null;
let sourceFileName = null;

app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

app.on('ready', function() {

  // ブラウザ(Chromium)の起動, 初期画面のロード
  mainWindow = new BrowserWindow({width: 1300, height: 900});
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

/*
// アプリケーションメニュー設定
var menu = Menu.buildFromTemplate([
  {
    label: 'LED-Heart',
    submenu: [
      {label: 'Quit', accelerator: 'CmdOrCtrl+Q',click: function () {app.quit();}}
    ]
  },
  {
    label: 'File',
    submenu: [
        {label: 'SAVE', accelerator: 'CmdOrCtrl+S',click: saveFile()},
        {label: 'LOAD', accelerator: 'CmdOrCtrl+O',click: function (){
            // 「ファイルを開く」ダイアログの呼び出し
            dialog.showOpenDialog(BrowserWindow.getFocusedWindow(),
                                  {title: 'Open', filters: [{name:'Source', extensions:['lhc']},{name: 'All Files', extensions: ['*']}],properties: ['openFile']},
                                  function (filename)
                                  {
                                      sourceFileName = filename;
                                  });
        }},
    ]
  }
]);
Menu.setApplicationMenu(menu);
*/
// アプリケーションメニュー設定
/*
var menu = Menu.buildFromTemplate([
  {
    label: 'LED-Heart',
    submenu: [
      {label: 'Quit', accelerator: 'CmdOrCtrl+Q',click: function () {app.quit();}}
    ]
  }
]);
Menu.setApplicationMenu(menu);
*/
