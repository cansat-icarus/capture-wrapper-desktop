const { bridge } = require('../index')
const station = require('../station')()

const routines = {
  auto_open () {
    return station.getAvailablePorts()
      .then(ports => station.serial.setPath(ports[0].comName))
      .then(() => station.serial.open())
  },
  auto_close () {
    return station.serial.close()
  },
  log () {
    return Promise.resolve('LOG ROUTINE NOT IMPLEMENTED')
  },
  test () {
    return new Promise(resolve => setTimeout(resolve, 10000))
  }
}

bridge.on('protocol:run', routine => {
  if (!routines[routine]) return bridge.emit('protocol:done', 'ROUTINE DOES NOT EXIST: ' + routine)

  routines[routine]()
    .then(message => bridge.emit('protocol:done', message))
})

module.exports = routines
