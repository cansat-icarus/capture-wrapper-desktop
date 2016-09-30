const { app, BrowserWindow, ipcMain } = require('electron')
const EventBridge = require('./lib/bridge')

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
  window.loadURL('http://localhost:3000/main-window.html')
else
  window.loadURL(`file:${__dirname}/../ui/main-window.html`)

// Export event bridge and window
exports.bridge = new EventBridge(ipcMain, window)
exports.window = window

// Handle close button
exports.bridge.on('close', () => app.quit())

// Start event handlers
require('./event-handlers')

// Ensure a clean exit strategy
require('./cleanup')
