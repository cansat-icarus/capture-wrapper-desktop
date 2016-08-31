const { app, BrowserWindow, ipcMain } = require('electron')
const { EventEmitter } = require('events')

// Prevent window being garbage collected
let window

// Event handling thingie
const eventBridge = new EventEmitter()

// .emit sends events to the outside (ipcRenderer)
eventBridge._emitInternal = eventBridge.emit
eventBridge.emit = (event, ...args) => {
  console.log('emitting', event, ...args)
  window.webContents.send('asynchronous-message', event, ...args)
}

// .on/.once/... receive events from the outside (ipcRenderer)
ipcMain.on('asynchronous-message', (eventObj, ...args) => {
  console.log('received', ...args)
  eventBridge._emitInternal(...args)
})

// Handle close button
eventBridge.on('close', () => app.quit())

// Export event bridge and window
exports.bridge = eventBridge
exports.getWindow = () => window

// Create window when ready
app.on('ready', () => {
  window = new BrowserWindow({
    minWidth: 750,
    minHeight: 400,
    width: 750,
    height: 550,
    useContentSize: true,
    frame: false
  })

  if (process.env.NODE_ENV === 'dev') {
    // Wait a bit for browser-sync
    setTimeout(() => window.loadURL('http://localhost:3000/'), 5000)
  } else {
    window.loadURL(`file:${__dirname}/../ui/index.html`)
  }

  // Dereference the window, let GC do its thing
  window.on('closed', () => {
    window = null

    // Main window close = app quit
    app.quit()
  })

  // Start event handlers
  require('./event-handlers')

  // Ensure a clean exit strategy
  require('./cleanup')
})
