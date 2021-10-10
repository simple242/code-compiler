let ipcRenderer

try {
  ipcRenderer = require('electron').ipcRenderer
} catch (e) {
  console.log('IpcRenderer', e)
}
