const { app, BrowserWindow, ipcMain } = require('electron')
const { EventEmitter } = require('events')

// Prevent window being garbage collected
const window = new BrowserWindow({
  minWidth: 750,
  minHeight: 400,
  width: 750,
  height: 550,
  useContentSize: true,
  frame: false
})

// Main window close = app quit
window.on('closed', () => {
  // No need to dereference window, we're quitting
  app.quit()
})

if(process.env.NODE_ENV === 'dev' && process.env.BROWSER_SYNC !== 'false')
  window.loadURL('http://localhost:3000/')
else
  window.loadURL(`file:${__dirname}/../ui/index.html`)

// Event handling thingie
const eventBridge = new EventEmitter()

// .emit sends events to the outside (ipcRenderer)
eventBridge._emitInternal = eventBridge.emit
eventBridge.emit = (event, ...args) => {
  window.webContents.send('asynchronous-message', event, ...args)
}

// .on/.once/... receive events from the outside (ipcRenderer)
ipcMain.on('asynchronous-message', (eventObj, ...args) => {
  eventBridge._emitInternal(...args)
})

// Handle close button
eventBridge.on('close', () => app.quit())

// Export event bridge and window
exports.bridge = eventBridge
exports.window = window

// Start event handlers
require('./event-handlers')

// Ensure a clean exit strategy
require('./cleanup')
