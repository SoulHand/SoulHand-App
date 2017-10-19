var Exception = require('./Exception.js')

class KeywordVoidException extends Exception {
  constructor (msg) {
    super(msg)
    this.code = '154'
    this.status = 400
  }
}

module.exports = KeywordVoidException
