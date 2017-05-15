var CRUD = require('./CRUD.js')

class User extends CRUD {
  add (input) {
    return super.add({$or: [{username: input.username},
      {email: input.email}, {'people.dni': input.people.dni}]}, input)
  }
}

module.exports = User
