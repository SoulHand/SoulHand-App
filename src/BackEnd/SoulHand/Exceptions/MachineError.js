var Exception = require('./Exception.js')

class MachineError extends Exception {
  constructor (msg) {
    super(msg)
    this.code = '153'
    this.status = 400
  }
}

module.exports = MachineError
