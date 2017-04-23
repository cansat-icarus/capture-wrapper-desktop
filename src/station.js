const Station = require('@cansat-icarus/capture-lib')

let station

module.exports = name => {
	if (station) {
		return station
	}
	if (!name) {
		return false
	}
	const saneName = name.replace(/[\W_]+/g, '')

	// TODO: setup crash reporter

	station = new Station(saneName)
	return station
}
