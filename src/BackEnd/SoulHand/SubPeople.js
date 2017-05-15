var CRUD = require('./CRUD.js')

class SubPeople extends CRUD {
  add (input) {
    return super.add({'data.dni': input.dni}, input)
  }
}

module.exports = SubPeople
