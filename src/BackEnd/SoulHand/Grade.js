var CRUD = require('./CRUD.js')

class Grade extends CRUD {
  add (name) {
    var query = {name: name}
    return super.add(query, query)
  }
}

module.exports = Grade
