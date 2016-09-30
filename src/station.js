const Station = require('capture-lib')
// const crashReporter = require('crash-reporter')
const dbs = require('./db')
const logging = require('./log')

let station

module.exports = name => {
  if(station) return station
  if(!name) return false
  const saneName = name.replace(/[\W_]+/g, '')

  // TODO: setup crash reporter

  // Setup DBs
  dbs.setup(saneName)

  // Setup logging
  logging.setup(saneName, dbs.logDb())

  station = new Station(saneName, dbs.getAll(), logging.getLogger())
  return station
}
