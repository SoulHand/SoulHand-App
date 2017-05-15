var CRUD = require('./CRUD.js')

class Activity extends CRUD {
  add (input) {
    return super.add({name: input.name}, input)
  }
}

module.exports = Activity
