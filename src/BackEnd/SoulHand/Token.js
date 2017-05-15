var CRUD = require('./CRUD.js')

class Token extends CRUD {
  add (user, ip, navigator) {
    const uuidV4 = require('uuid/v4')
    const base64 = require('base-64')
    var p1 = this.find({
      $and: [
        {user: user._id},
        {ip: ip},
        {navigator: navigator},
        {dateDeleted: null}
      ]
    }).then((token) => {
      if (!token) {
        token = new this._db({
          privateKeyId: uuidV4(),
          publicKeyId: base64.encode(user._id),
          ip: ip,
          navigator: navigator,
          dateCreated: Date.now(),
          dateLastConnect: Date.now(),
          user: user._id
        })
        token.save()
        token.user = user
        return token
      }
      token.dateLastConnect = Date.now()
      return token.save()
    })
    return p1
  }
  find (query) {
    var p1 = this._db.findOne(query).populate('user').then((data) => {
      return data
    })
    return p1
  }
}

module.exports = Token
