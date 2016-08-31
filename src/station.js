const Station = require('capture-lib')

let station

module.exports = name => {
  if (station) return station

  station = new Station(name)
  return station
}
