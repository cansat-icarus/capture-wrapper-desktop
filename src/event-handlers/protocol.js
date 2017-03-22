const {app} = require('electron')
const camelCase = require('camelcase')
const {bridge} = require('../main-window')
const station = require('../station')()

const routines = {
	autoOpen() {
		return station.getAvailablePorts()
			.then(ports => station.serial.setPath(ports[0].comName))
			.then(() => station.serial.open())
			.then(routines.ui_lock)
	},
	autoClose() {
		return station.serial.close()
			.then(routines.ui_lock)
	},
	log() {
		require('../log-window').show()
		return Promise.resolve()
	},
	uiLock() {
		bridge._emitInternal('lockUI', true)
		return Promise.resolve()
	},
	uiUnlock() {
		bridge._emitInternal('lockUI', false)
		return Promise.resolve()
	},
	nukeAllTheThings() {
		// Delete data and quit
		return Promise.resolve(`NUKE ROUTINE NOT IMPLEMENTED, DELETE ${app.getPath('userData')} MANUALLY`)
	},
	test() {
		return new Promise(resolve => setTimeout(resolve, 10000))
	}
}

bridge.on('protocol:run', routineSnakeCase => {
	const routine = camelCase(routineSnakeCase)

	if (!routines[routine]) {
		return bridge.emit('protocol:done', 'ROUTINE DOES NOT EXIST: ' + routine)
	}

	routines[routine]()
		.then(message => bridge.emit('protocol:done', message))
})

module.exports = routines
