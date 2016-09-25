const { window, bridge } = require('../main-window')

// Track UI lock state
let uiLock = false

// Handle UI locking
bridge.on('lockUI', enable => {
  if(typeof enable === 'boolean') uiLock = enable

  bridge.emit('lockUI', uiLock)
})

// Window (un)maximizing
bridge.on('maximize', () => window.isMaximized() ? window.unmaximize() : window.maximize())
window.on('maximize', () => bridge.emit('maximize', true))
window.on('unmaximize', () => bridge.emit('maximize', false))

// Load the rest of event handlers
require('./events')
require('./protocol')

// Demo mode (instead of opening a serial port, spit out random packets every second for UI testing)
if(process.env.NODE_ENV === 'dev' && process.env.DEMO) require('./demo')
