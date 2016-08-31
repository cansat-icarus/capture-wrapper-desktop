// ONLY FOR UI DEMONSTRATION PURPOSES
const station = require('../station')()

function * randomIntGen (min, max) {
  while (true) yield Math.floor(Math.random() * (max - min + 1)) + min
}

const templates = [
  {
    type: 't',
    aField: true,
    anotherField: 'also true',
    notAField: false,
    notAFieldAgain: 'pants on fire'
  },
  {
    type: 'i',
    message: {
      id: 2,
      text: 'Only one DS18B20 sensor found. [temperature]',
      asd: [
        {
          b: [
            {a: 'hi there!'}
          ]
        }
      ]
    }
  },
  {
    type: 's',
    module: {
      id: 1,
      name: 'Telemetry packet routine',
      enable: true,
      lastRun: 147160520123,
      interval: 1000
    }
  }
]

function * randomTemplateGen () {
  const randomIndex = randomIntGen(0, 2)
  const randomScore = randomIntGen(0, 100)
  while (true) {
    const packet = Object.assign({}, templates[randomIndex.next().value])
    packet.receivedAt = Date.now()
    packet.score = randomScore.next().value

    yield packet
  }
}

const randomPacket = randomTemplateGen()
let interval
function start () {
  if (!interval) {
    console.log('demo open')
    interval = setInterval(() => {
      station.serial.emit('data', randomPacket.next().value)
    }, 1000)
    station.serial._updateState('open')
  }
  return Promise.resolve()
}

function stop () {
  if (interval) {
    console.log('demo close')
    clearInterval(interval)
    interval = undefined
    station.serial._updateState('close')
  }
  return Promise.resolve()
}

// Monkey-patch station.db
station.db = { put: () => Promise.resolve() }

// Monkey-patch station.serial
station.serial.open = start.bind(this)
station.serial.close = stop.bind(this)

// Monkey-patch station.classifier
station.classifier.classifyPacket = (packet, upd = true) => {
  if (upd) station.classifier.classifyStationInc(packet.score)
  return packet.score
}

// Any port here is useless
station.serial._destroyPort()
