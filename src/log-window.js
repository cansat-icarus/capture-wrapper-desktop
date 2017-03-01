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

// Handle Log db rebuild
let logDBListener

function logDBChangeHandler({doc, seq}) {
	if (!bridge) return
	bridge.emit('logdoc', doc, seq)
}

bridge.on('logwrebuild', (incrementalSeq = 0) => {
	if (logDBListener) {
		logDBListener.cancel()
	}

	logDBListener = logDB.changes({
		live: true,
		include_docs: true, // eslint-disable-line camelcase
		since: incrementalSeq
	})
		.on('change', logDBChangeHandler)
})

bridge.on('log:hide', () => logWindow.hide())

const urlBase = process.env.NODE_ENV === 'dev' && process.env.BROWSER_SYNC !== 'false' ? 'http://localhost:3000' : `file:${__dirname}/../ui`

logWindow.loadURL(urlBase + '/log-window.html')

// From the moment it's first used we assume bugs
module.exports = logWindow
