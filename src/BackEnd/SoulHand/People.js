var CRUD = require('./CRUD.js')

class People extends CRUD {
  add (input) {
    return super.add({'dni': input.dni}, input)
  }
}

module.exports = People
