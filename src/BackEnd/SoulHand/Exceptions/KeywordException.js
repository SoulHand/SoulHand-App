var Exception = require('./Exception.js')

class KeywordException extends Exception {
  constructor (msg) {
    super(msg)
    this.code = '152'
    this.status = 400
  }
}

module.exports = KeywordException
