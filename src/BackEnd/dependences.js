var mongoose = require('mongoose')
var Exception = require('./SoulHand/Exceptions/Exception.js')
const logger = require('winston')
var path = require('path')
const fs = require('fs')

module.exports = function (app, __DIR__) {
  var db = mongoose.createConnection(app.settings.database.dns)
  var structDb = require('./models.js')
  var Schema = {}
  for (var i in structDb) {
    Schema[i] = db.model(i, structDb[i])
  }
  let uri = path.join(__DIR__, '/logs')
  try {
    fs.accessSync(uri)
  } catch (e) {
    fs.mkdirSync(uri)
  }
  logger.level = 'debug'
  logger.add(logger.transports.File,
  {filename: path.join(uri, '/server.log')})

  return {
    database: {
      db: db,
      Schema: Schema
    },
    ErrorHandler: function (error, request, response, next) {
      var body = {
        code: 500,
        message: null
      }
      var status = 500
      if (error instanceof Exception) {
        body.code = error.code
        status = error.status
      }
      body.message = error.toString()
      logger.error(error)
      response.status(status).send(body)
    }
  }
}
