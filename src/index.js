const { app, BrowserWindow, ipcMain } = require('electron')
const { EventEmitter } = require('events')

// Prevent window being garbage collected
let window

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
})
