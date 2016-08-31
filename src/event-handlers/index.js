const { getWindow, bridge } = require('../index')

let window = getWindow()

// Track UI lock state
let uiLock = false

// Track name readiness
let nameReady = false
let name

// Handle UI locking
bridge.on('lockUI', enable => {
  if (typeof enable === 'boolean') uiLock = enable

  bridge.emit('lockUI', uiLock)
})

// Set the name
bridge.on('name', n => {
  if (typeof n !== 'string' || name === '') return

  // Construct station and load the rest of the handlers
  require('../station')(n)
  require('./events')
  require('./protocol')

  // Demo mode (instead of opening a serial port, spit out random packets every second for UI testing)
  if (process.env.NODE_ENV === 'dev' && process.env.DEMO) require('./demo')

  // Name is ready
  nameReady = true
  name = n
  console.log('name is', name, n)
  bridge._emitInternal('nameReady')
})

// Check if the name is properly set and all is good
bridge.on('nameReady', () => {
  console.log('name ready', nameReady, name)
  bridge.emit('nameReady', nameReady, name)
})

// Window (un)maximizing
bridge.on('maximize', () => window.isMaximized() ? window.unmaximize() : window.maximize())
window.on('maximize', () => bridge.emit('maximize', true))
window.on('unmaximize', () => bridge.emit('maximize', false))

// DEVELOPMENT ONLY: circumvent annoying prompt
if (!nameReady && process.env.NODE_ENV === 'dev' && !process.env.NO_QUICK_START) {
  // Set a dev-only name!
  bridge._emitInternal('name', 'devstation-do-not-use---ever')

  // Reload window to fix things
  setTimeout(() => window.reload(), 200)
}

module.exports = () => nameReady
