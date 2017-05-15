var Exception = require('./Exception.js')

class ValidatorException extends Exception {
  constructor (msg) {
    super(msg)
    this.code = '130'
    this.code = 400
  }
}

module.exports = ValidatorException
