const {BrowserWindow, ipcMain} = require('electron')
const EventBridge = require('./lib/bridge')
const logDB = require('./station')().logDB

const logWindow = new BrowserWindow({
	minWidth: 10,
	minHeight: 10,
	width: 750,
	height: 550,
	useContentSize: true,
	show: false,
	closable: false,
	frame: false
})
const bridge = new EventBridge(ipcMain, logWindow)

logWindow.on('ready-to-show', () => {
	// Move the logWindow to show the main window behind it
	const currentPosition = logWindow.getPosition()
	logWindow.setPosition(currentPosition[0] + 50, currentPosition[1] + 50)
})

// Handle Log db rebuild
let logDBListener

function logDBChangeHandler({doc, seq}) {
	if (!bridge) {
		return
	}

	bridge.emit('log:doc', doc, seq)
}

bridge.on('log:seedDocs', () => {
	if (logDBListener) {
		logDBListener.cancel()
		logDBListener = null
	}

	// Get last seq number
	logDB.allDocs({
		include_docs: true, // eslint-disable-line camelcase
		descending: true,
		limit: 50 // Do not fill the main process with log entries
	})
		.then(seed => {
			// Send the big batch of docs
			bridge.emit('log:seedDocs', seed.rows)

			// Setup the changes listener to start in lastSeq
			// There may be a small chance of one or two log entries being missing,
			// but I prefer that to consuming 2GB of memory on startup...
			logDBListener = logDB.changes({
				live: true,
				include_docs: true, // eslint-disable-line camelcase
				since: 'now'
			})
				.on('change', logDBChangeHandler)
		})
})

bridge.on('log:hide', () => logWindow.hide())

bridge.on('log:show', () => logWindow.show())

const urlBase = process.env.NODE_ENV === 'dev' && process.env.BROWSER_SYNC !== 'false' ? 'http://localhost:3000' : `file:${__dirname}/../ui`

logWindow.loadURL(urlBase + '/log-window.html')

// From the moment it's first used we assume bugs
module.exports = logWindow
