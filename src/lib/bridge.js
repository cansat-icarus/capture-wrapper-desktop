const { EventEmitter } = require('events')

module.exports = class EventBridge extends EventEmitter {
  constructor(ipc, window) {
    super()
    this._window = window

    ipc.on('asynchronous-message', this._handleIpcMessage.bind(this))
  }

  emit(...args) {
    this._window.webContents.send('asynchronous-message', ...args)
  }

  _emitInternal(...args) {
    super.emit(...args)
  }

  _handleIpcMessage(eventObj, ...args) {
    this._emitInternal(...args)
  }
}