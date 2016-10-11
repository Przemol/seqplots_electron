const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const {ipcMain} = require('electron')

const path = require('path');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
  	width: 1200, height: 1000, frame: false, title: 'SeqPlots', titleBarStyle: 'hidden', backgroundColor: '#FFFFFF'
  });
  mainWindow.maximize();

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
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

ipcMain.on('seqplots-dead', function(event, arg) {
  	console.log('See you next time!');
 	app.quit()
});


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
