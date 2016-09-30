const { BrowserWindow, ipcMain } = require('electron')
const EventBridge = require('./lib/bridge')
const logDb = require('./db').logDb()

const logWindow = new BrowserWindow({
  minWidth: 10,
  minHeight: 10,
  width: 750,
  height: 550,
  useContentSize: true,
  show: false
})
const bridge = new EventBridge(ipcMain, logWindow)

// Handle Log db rebuild
let logDbListener

function logDbChangeHandler({ doc, seq }) {
  bridge.emit('logdoc', doc, seq)
}

bridge.on('logwrebuild', (incrementalSeq = 0) => {
  if(logDbListener) logDbListener.cancel()

  logDbListener = logDb.changes({
    live: true,
    include_docs: true,
    since: incrementalSeq
  })
    .on('change', logDbChangeHandler)
})

const urlBase = process.env.NODE_ENV === 'dev' && process.env.BROWSER_SYNC !== 'false' ? 'http://localhost:3000' : `file:${__dirname}/../ui`

logWindow.loadURL(urlBase + '/log-window.html')

// From the moment it's first used we assume bugs
module.exports = logWindow
