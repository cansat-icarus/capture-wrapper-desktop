const bunyan = require('bunyan')
let logger

exports.getLogger = () => logger

exports.setup = (name, db) => {
  const bufferStream = new bunyan.RingBuffer({ limit: 50 })
  const dbStream = {
    write: obj => {
      // error and fatal items include more information
      if(obj.level > 45) obj._context = bufferStream.records

      // save to db
      db.post(obj)
    }
  }

  logger = bunyan.createLogger({
    name: `CanSatGS-${name}`,
    streams: [
      {
        level: 'trace',
        stream: process.stdout
      },
      {
        level: 'debug',
        type: 'rotating-file',
        path: `CanSatGS-${name}.log`,
        period: '3h', // New log file at every 3h
        count: 10 // Keep 10 log files
      },
      {
        level: 'trace',
        type: 'raw',
        stream: bufferStream
      },
      {
        level: 'info',
        type: 'raw',
        stream: dbStream
      }
    ]
  })
}
