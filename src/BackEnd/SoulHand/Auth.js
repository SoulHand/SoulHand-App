var Token = require('./Token.js')
var UserException = require('./Exceptions/UserException.js')
var Validator = require('string-validator')

var isUser = (request, db) => {
  if (!Validator.isBase64()(request.query.PublicKeyId) || !Validator.isUUID()(request.query.PrivateKeyId)) {
    throw new UserException('Token invalidos')
  }
  var user = new Token(db.Sessions)
  var address = request.connection.address() || request.socket.address()
  var navigator = request.headers['user-agent']
  var p1 = user.find({
    $and: [
      {publicKeyId: request.query.PublicKeyId},
      {privateKeyId: request.query.PrivateKeyId},
      {ip: address.address},
      {navigator: navigator},
      {dateDeleted: null}
    ]
  }).then((data) => {
    if (!data) {
      throw new UserException('Credenciales Invalidas!')
    }
    return data;
  });
  return p1;
}

module.exports.isAdmin = function (request, response, next) {
  isUser(request, this).then((data) => {
    if (data.user.isAdmin !== true) {
      throw new UserException('No posee permisos administrativos')
    }
    request.user = data.user
    next()
  }).catch((error) => {
    next(error)
  })
}

module.exports.isUser = function (request, response, next) {
  isUser(request, this).then((data) => {
    if (data.user.isAdmin !== true) {
      throw new UserException('No posee permisos administrativos')
    }
    request.user = data.user
    next()
  }).catch((error) => {
    next(error)
  })
}

module.exports.isTeacherOrNot = function (request, response, next) {
  isUser(request, this).then((data) => {
    var bool = (data.user.isAdmin === true);
    if (data.user.people.mode) {
      for(var i=0, n=data.user.people.mode.length; i<n; i++){
        bool = bool || data.user.people.mode[i] == "TEACHER";
      }
    }
    if (!bool) {
      throw new UserException('No posee permisos!')
    }
    request.user = data.user
    next()
  }).catch((error) => {
    next(error)
  })
}

module.exports.isTeacher = function (request, response, next) {
  isUser(request, this).then((data) => {
    var bool = false;
    if (data.user.people.mode){
      for(var i=0, n=data.user.people.mode.length; i<n; i++){
        bool = bool || data.user.people.mode[i] == "TEACHER";
      }
    }
    if (!bool) {
      throw new UserException('No posee permisos!')
    }
    request.user = data.user
    next()
  }).catch((error) => {
    next(error)
  })
}
