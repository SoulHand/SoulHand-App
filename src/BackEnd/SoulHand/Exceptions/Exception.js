class Exception extends Error {

  constructor (msg) {
    super(msg)
    this.code = '000'
    this.status = 500
    this.message = msg
  }

  toString () {
    return this.message
  }
}

module.exports = Exception
