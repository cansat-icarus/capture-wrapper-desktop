const { app, BrowserWindow, ipcMain } = require('electron')

let dialogWindow

// Listen to name setting!
function messageListener(event, name, nameConfirm) {
  console.log(arguments)
  if(typeof name === 'string') {
    if(name === nameConfirm) {
      // Create station and logs and whatnot
      require('./station')(name)

      // Launch the main window and close the current one!
      require('./main-window')

      dialogWindow.close()
      dialogWindow.once('closed', () => dialogWindow = null)

      // Remove event listener
      ipcMain.removeListener('asynchronous-message', messageListener)
    } else if(name === 'exit') {
      app.quit()
    }
  }
}

ipcMain.on('asynchronous-message', messageListener)

// Create window when ready
app.on('ready', () => {
  if(process.env.NODE_ENV === 'dev') require('devtron').install()

  // DEVELOPMENT ONLY: circumvent annoying prompt
  if(process.env.NODE_ENV === 'dev' && !process.env.NO_QUICK_START) {
    // Set a dev-only name!
    messageListener('devstation-do-not-use---ever', 'devstation-do-not-use---ever')
    return
  }

  // Create the name dialog window
  dialogWindow = new BrowserWindow({
    width: 420,
    height: 420,
    frame: false
  })

  // Wait a bit for browser-sync when necessary
  if(process.env.NODE_ENV === 'dev')
    setTimeout(() => dialogWindow.loadURL('http://localhost:3000/name-dialog.html'), 2000)
  else
    dialogWindow.loadURL(`file:${__dirname}/../ui/name-dialog.html`)
})
