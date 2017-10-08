var Exception = require('./Exception.js')

class GradeException extends Exception {
  constructor (msg) {
    super(msg)
    this.code = '101'
    this.status = 400
  }
}
module.exports = GradeException
