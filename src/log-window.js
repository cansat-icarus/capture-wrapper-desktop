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
	}

	// Get last seq number
	logDB.changes({since: 0, include_docs: true}) // eslint-disable-line camelcase
		.then(seed => {
			// Send the big batch of docs
			bridge.emit('log:seedDocs', seed)

			// Setup the changes listener to start in lastSeq
			logDBListener = logDB.changes({
				live: true,
				include_docs: true, // eslint-disable-line camelcase
				since: seed.last_seq
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
