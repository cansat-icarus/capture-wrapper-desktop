const { bridge } = require('../index')
const station = require('../station')()

bridge.on('stationScore', () => bridge.emit('stationScore', station.classifier.stationScore))

station.on('packet', packet => bridge.emit('packet', packet))
station.classifier.on('stationScore', score => bridge.emit('stationScore', score))
