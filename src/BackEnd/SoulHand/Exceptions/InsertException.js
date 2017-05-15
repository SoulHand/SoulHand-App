var Exception = require('./Exception.js')

class InsertException extends Exception {
  constructor (msg) {
    super(msg)
    this.code = '110'
    this.code = 400
  }
}

module.exports = InsertException
