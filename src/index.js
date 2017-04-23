const {app, BrowserWindow, ipcMain} = require('electron')

// Set dbNamePrefix, for a better place to save the DBs
global.pathPrefix = process.env.DB_PATH || app.getPath('userData')

let dialogWindow

// Listen to name setting!
function messageListener(event, name, nameConfirm) {
	if (typeof name === 'string') {
		if (name === nameConfirm) {
			// Create station and logs and whatnot
			require('./station')(name)

			// Launch the main window and close the current one!
			require('./main-window') // eslint-disable-line import/no-unassigned-import

			if (dialogWindow) {
				dialogWindow.close()
				dialogWindow.once('closed', () => dialogWindow = null)
			}

			// Remove event listener
			ipcMain.removeListener('asynchronous-message', messageListener)
		} else if (name === 'exit') {
			app.quit()
		}
	}
}

ipcMain.on('asynchronous-message', messageListener)

// Create window when ready
app.on('ready', () => {
	// DEVELOPMENT ONLY: circumvent annoying prompt
	if (process.env.NODE_ENV === 'dev' && !process.env.NO_QUICK_START) {
		// Set a dev-only name!
		messageListener(null, 'devstation-do-not-use---ever', 'devstation-do-not-use---ever')
		return
	}

	// Create the name dialog window
	dialogWindow = new BrowserWindow({
		width: 420,
		height: 430,
		frame: false
	})

	// Wait a bit for browser-sync when necessary
	if (process.env.NODE_ENV === 'dev' && process.env.BROWSER_SYNC !== 'false') {
		setTimeout(() => dialogWindow.loadURL('http://localhost:3000/name-dialog.html'), 2000)
	} else {
		dialogWindow.loadURL(`file:${__dirname}/../ui/name-dialog.html`)
	}
})
