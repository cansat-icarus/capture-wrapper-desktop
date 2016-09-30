const path = require('path')
const PouchDB = require('pouchdb')
const basepath = require('electron').app.getPath('userData')

function _db(name) {
  return new PouchDB(path.join(basepath, name))
}

const logDb = _db('log')
let dataDb

exports.logDb = () => logDb
exports.dataDb = () => dataDb
exports.setup = name => {
  dataDb = _db('data_' + name)
}
exports.getAll = () => ({ logDb, dataDb })
