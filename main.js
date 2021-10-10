const {app, BrowserWindow, ipcMain, screen} = require('electron')
const url = require('url')
const path = require('path')

let mainWindow

function createWindow() {
  const {width, height} = screen.getPrimaryDisplay().workAreaSize

  mainWindow = new BrowserWindow({
    width: 1000,
    height: 660,
    minWidth: 900,
    minHeight: 650,
    maxWidth: width,
    maxHeight: height,
    fullscreen: false,
    fullscreenable: false,
    frame: false,
    darkTheme: false,
    resizable: true,
    movable: true,
    backgroundColor: '#fff',
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      devTools: false,
      contextIsolation: false
    }
  })

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/index.html`),
      protocol: 'file:',
      slashes: true
    })
  )

  // mainWindow.maximize()

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  mainWindow.removeMenu()

  mainWindow.on('closed', function() {
    mainWindow = null
  })

  ipcMain.on('closeApp', () => {
    mainWindow.close()
  })

  ipcMain.on('minimizeApp', () => {
    mainWindow.minimize()
  })

  ipcMain.on('maximizeRestoreApp', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.restore()
    } else {
      mainWindow.maximize()
    }
  })

  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('isMaximized')
  })

  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('isRestored')
  })

}

app.on('ready', createWindow)

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function() {
  if (mainWindow === null) createWindow()
})
