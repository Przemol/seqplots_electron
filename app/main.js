const electron = require('electron')
// Module to control application life.
const {app, Menu} = require('electron')
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const {ipcMain} = require('electron')
const path = require('path');
// Updater
const autoUpdater = electron.autoUpdater;
const os = require('os');
if(require('electron-squirrel-startup')) return;

var platform = os.platform() + '_' + os.arch();
var version = app.getVersion();
var seqplotsrunning = false;

try {
  //console.log('https://spup.herokuapp.com/'+platform+'/'+version);
  //autoUpdater.setFeedURL('https://spup.herokuapp.com/'+platform+'/'+version);
} catch (e) {console.log(e)}

autoUpdater.on('update-downloaded', function(){
  console.log('update');
  mainWindow.webContents.send('update-ready');
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {

  // Create the browser window.
  const {session} = require('electron');
  var ses = session.fromPartition('persist:seqplots');

  ses.cookies.on('changed', function(event, cookie, cause) {
    if(["skip_tutoial", "genome", "user", "warn"].indexOf(cookie.name) >= 0 & seqplotsrunning) {
    	var fs = require('fs');
    	var cnf = JSON.parse(fs.readFileSync(path.resolve(path.join(__dirname, 'seqplots.json')), 'utf8'));
    	eval('cnf.' + cookie.name + '=' + "'" + cookie.value + "'");
      fs.writeFileSync(path.resolve(path.join(__dirname, 'seqplots.json')), JSON.stringify(cnf, null, 4), 'utf8');

      //var expiration = new Date();
      //var hour = expiration.getHours();
      //hour = hour + (24*365*3);
      //expiration.setHours(hour);
      //cookie.expirationDate = expiration.getTime();
      //ses.cookies.set(cookie, function (error) {
      //   console.log(error);
      //});
      console.log('cooke saved to file: ' + cookie.name + ' = ' + "'" + cookie.value + "'")
    }
  });

  mainWindow = new BrowserWindow({
  	width: 1200, height: 1000, frame: false, title: 'SeqPlots', titleBarStyle: 'hidden', backgroundColor: '#FFFFFF'
  });
  mainWindow.maximize();

  mainWindow.webContents.once("did-frame-finish-load", function (e) {
    try {
      autoUpdater.checkForUpdates();
    } catch (e) {}
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  const template = [
  {
    label: 'Edit',
    submenu: [
      {
        role: 'undo'
      },
      {
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        role: 'cut'
      },
      {
        role: 'copy'
      },
      {
        role: 'paste'
      },
      {
        role: 'pasteandmatchstyle'
      },
      {
        role: 'delete'
      },
      {
        role: 'selectall'
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.reload()
        }
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.toggleDevTools()
        }
      },
      {
        type: 'separator'
      },
      {
        role: 'resetzoom'
      },
      {
        role: 'zoomin'
      },
      {
        role: 'zoomout'
      },
      {
        type: 'separator'
      },
      {
        role: 'togglefullscreen'
      }
    ]
  },
  {
    role: 'window',
    submenu: [
      {
        role: 'minimize'
      },
      {
        role: 'close'
      }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click () { require('electron').shell.openExternal('http://przemol.github.io/seqplots/') }
      }
    ]
  }
]

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      {
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        role: 'hide'
      },
      {
        role: 'hideothers'
      },
      {
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        role: 'quit'
      }
    ]
  })
  // Edit menu.
  template[1].submenu.push(
    {
      type: 'separator'
    },
    {
      label: 'Speech',
      submenu: [
        {
          role: 'startspeaking'
        },
        {
          role: 'stopspeaking'
        }
      ]
    }
  )
  // Window menu.
  template[3].submenu = [
    {
      label: 'Close',
      accelerator: 'CmdOrCtrl+W',
      role: 'close'
    },
    {
      label: 'Minimize',
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize'
    },
    {
      label: 'Zoom',
      role: 'zoom'
    },
    {
      type: 'separator'
    },
    {
      label: 'Bring All to Front',
      role: 'front'
    }
  ]
}

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  //if (process.platform !== 'darwin') {
    app.quit()
  //}
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})


var pids = [];
ipcMain.on('pid-message', function(event, arg) {
  console.log('Main process PID:', arg);
  pids.push(arg);
});

ipcMain.on('addr-change', function(event, arg) {
  console.log('Setting url to:', arg);
  mainWindow.loadURL(arg);
});

ipcMain.on('dev-tools', function(event, arg) {
  // Open the DevTools.
  mainWindow.webContents.openDevTools()

});

ipcMain.on('choose-path', function(event, arg) {
  fs = require('fs');
  var cnf = JSON.parse(fs.readFileSync(path.resolve(path.join(__dirname, 'seqplots.json')), 'utf8'));
  const {dialog} = require('electron')
  var ans = dialog.showOpenDialog({properties: ['openDirectory']});
  if(ans) {
    cnf.root = ans[0];
    fs.writeFileSync(path.resolve(path.join(__dirname, 'seqplots.json')), JSON.stringify(cnf, null, 4), 'utf8');
    mainWindow.reload();
  }

});


ipcMain.on('help', function(event, arg) {
  console.log('Setting url to:', arg);
  help = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      webSecurity: true,
      preload: path.resolve(path.join(__dirname, 'preload.js'))
    },
    width: 1300,
    height: 1000
  });

  // and load the index.html of the app.
  help.loadURL(arg)

  // Emitted when the window is closed.
  help.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    help = null
  })
});

ipcMain.on('cookie', function(event, arg) {
  const ses = mainWindow.webContents.session;
  ses.defaultSession.cookies.get({}, (error, cookies) => {
    console.log(error, cookies)
  });
});

ipcMain.on('installUpdate', function(event) {
  autoUpdater.quitAndInstall();
});



function killProcess(pid) {
  try {
    process.kill(-pid, 'SIGINT');
    process.kill(-pid, 'SIGTERM');
    console.log( 'Process %s killed!', pid );
  } catch (e) {
    try {
      process.kill(pid, 'SIGTERM');
      console.log( 'Process %s terminated!', pid );
    } catch (e) {}
  }
}



app.on('before-quit', function() {
  pids.forEach(function(pid) {
    // A simple pid lookup
    console.log( 'Process %s tergeted for termination!', pid );
    killProcess(pid);
  });
});

ipcMain.on('seqplotsrunning', function(event, arg) {
    console.log('Seqplots is running: ', arg)
  	seqplotsrunning = arg;
});



ipcMain.on('seqplots-dead', function(event, arg) {
  	console.log('See you next time!');
 	app.quit()
});


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
