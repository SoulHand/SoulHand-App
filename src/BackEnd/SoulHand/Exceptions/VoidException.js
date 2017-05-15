var Exception = require('./Exception.js')

class VoidException extends Exception {
  constructor (msg) {
    super(msg)
    this.code = '100'
    this.code = 204
  }
}

module.exports = VoidException
