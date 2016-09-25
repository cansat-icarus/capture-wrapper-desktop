const { bridge } = require('../main-window')
const { app } = require('electron')
const station = require('../station')()

const routines = {
  auto_open() {
    return station.getAvailablePorts()
      .then(ports => station.serial.setPath(ports[0].comName))
      .then(() => station.serial.open())
      .then(routines.ui_lock)
  },
  auto_close() {
    return station.serial.close()
      .then(routines.ui_lock)
  },
  log() {
    return Promise.resolve('LOG ROUTINE NOT IMPLEMENTED')
  },
  ui_lock() {
    bridge._emitInternal('lockUI', true)
    return Promise.resolve()
  },
  ui_unlock() {
    bridge._emitInternal('lockUI', false)
    return Promise.resolve()
  },
  test() {
    return new Promise(resolve => setTimeout(resolve, 10000))
  }
}

bridge.on('protocol:run', routine => {
  if(!routines[routine]) return bridge.emit('protocol:done', 'ROUTINE DOES NOT EXIST: ' + routine)

  routines[routine]()
    .then(message => bridge.emit('protocol:done', message))
})

module.exports = routines
