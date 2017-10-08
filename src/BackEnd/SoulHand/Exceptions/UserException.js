var Exception = require('./Exception.js')

class UserException extends Exception {
  constructor (msg) {
    super(msg)
    this.code = '500'
    this.status = 401
  }
}

module.exports = UserException
