var Exception = require('./Exception.js')

class InvalidOperationException extends Exception {
  constructor (msg) {
    super(msg)
    this.code = '100'
    this.code = 400
  }
}

module.exports = InvalidOperationException
