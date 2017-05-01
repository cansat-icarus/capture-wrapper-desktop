const {bridge} = require('../main-window')
const station = require('../station')()

// Misc events
bridge.on('stationScore', () => bridge.emit('stationScore', station.classifier.stationScore))

station.on('packet', packet => bridge.emit('packet', packet))

// Station~Serial events
bridge.on('serial:availablePorts', () => {
	station.getAvailablePorts()
		.then(autocompletion => bridge.emit('serial:availablePorts', autocompletion))
})
bridge.on('serial:path', path => {
	// Set path
	if (path) {
		return station.serial.setPath(path)
	}

	// Get path
	bridge.emit('serial:path', station.serial._path)
})
bridge.on('serial:status', () => bridge.emit('serial:status', station.serial._state))
bridge.on('serial:open', () => station.serial.open())
bridge.on('serial:close', () => station.serial.close())

station.serial.on('stateChange', state => bridge.emit('serial:status', state))
station.serial.on('pathChange', path => bridge.emit('serial:path', path))

// Station~Classifier events
station.classifier.on('stationScore', score => bridge.emit('stationScore', score))

// Station~Backend events
bridge.on('backend:status', () => bridge.emit('backend:status', station.backend._state))
bridge.on('backend:replicator:data:status', () => bridge.emit('backend:replicator:data:status', station.backend.dataReplicator._state))
bridge.on('backend:replicator:log:status', () => bridge.emit('backend:replicator:log:status', station.backend.logReplicator._state))
bridge.on('backend:connect', url => station.backend.connect(url))
bridge.on('backend:disconnect', () => station.backend.disconnect())

station.backend.on('state', status => bridge.emit('backend:status', status))
station.backend.on('replicator:data:state', status => bridge.emit('backend:replicator:data:status', status))
station.backend.on('replicator:log:state', status => bridge.emit('backend:replicator:log:status', status))
