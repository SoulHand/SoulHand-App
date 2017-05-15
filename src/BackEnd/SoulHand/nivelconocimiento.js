var CRUD = require('./CRUD.js')

class nivelconocimiento extends CRUD {
  add (name) {
    var query = {name: name}
    return super.add(query, query)
  }
}

module.exports = nivelconocimiento
