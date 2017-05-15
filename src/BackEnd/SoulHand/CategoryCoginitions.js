var CRUD = require('./CRUD.js')

class CategoryCoginitions extends CRUD {
  add (name, input) {
    return super.add({name: name}, input)
  }
}

module.exports = CategoryCoginitions
