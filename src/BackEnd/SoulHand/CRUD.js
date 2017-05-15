var InsertException = require('./Exceptions/InsertException.js')
var Exception = require('./Exceptions/Exception.js')

class CRUD {

  constructor (db) {
    this._db = db
  }

  add (query, input) {
    let p1 = this._db.findOne(query).exec().then((data) => {
      if (data) {
        throw new InsertException('No se puede insertar un registro duplicado')
      }
      let addValue = new this._db(input)
      return addValue.save()
    })
    return p1
  }

  find (query) {
    let p1 = this._db.findOne(query).exec().then((data) => {
      if (!data) {
        throw new Exception('No existe un registro de este tipo')
      }
      return data
    })
    return p1
  }

  get (query) {
    let p1 = this._db.find(query).exec().then((data) => {
      if (data.length === 0) {
        throw new Exception('No existe un registro de este tipo')
      }
      return data
    })
    return p1
  }

  update (query, callback) {
    let p1 = this.find(query).then((data) => {
      let replace = callback(data)
      return replace.save()
    })
    return p1
  }

  remove (query) {
    let p1 = this.find(query).then((data) => {
      return data.remove()
    })
    return p1
  }
}

module.exports = CRUD
