const { bridge } = require('../index')
const station = require('../station')()

bridge.on('serial:availablePorts', () => {
  station.getAvailablePorts()
    .then(autocompletion => bridge.emit('serial:availablePorts', autocompletion))
})

bridge.on('serial:path', path => {
  // Set path
  if(path) return station.serial.setPath(path)

  // Get path
  bridge.emit('serial:path', station.serial._path)
})

bridge.on('serial:status', () => bridge.emit('serial:status', station.serial._state))

bridge.on('serial:open', () => station.serial.open())
bridge.on('serial:close', () => station.serial.close())

bridge.on('stationScore', () => bridge.emit('stationScore', station.classifier.stationScore))

station.on('packet', packet => bridge.emit('packet', packet))
station.serial.on('stateChange', state => bridge.emit('serial:status', state))
station.serial.on('pathChange', path => bridge.emit('serial:path', path))
station.classifier.on('stationScore', score => bridge.emit('stationScore', score))
