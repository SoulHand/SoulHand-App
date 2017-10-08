var mongoose = require('mongoose')
var Exception = require('./SoulHand/Exceptions/Exception.js')
const logger = require('winston')
var path = require('path')
const fs = require('fs')

module.exports = function (app, __DIR__) {
  let uri = path.join(__DIR__, '/logs')
  try {
    fs.accessSync(uri)
  } catch (e) {
    fs.mkdirSync(uri)
  }
  if(process.env.NODE_ENV == "production"){
    logger.level = 'debug'
    logger.add(logger.transports.File,
      {filename: path.join(uri, '/server.log')});
      logger.remove(logger.transports.Console);
  }
  return {
    ErrorHandler: function (error, request, response, next) {
      var body = {
        code: 500,
        message: null
      }
      var status = 500
      body.message = error.toString()
      if (error.code && error.status) {
        body.code = error.code
        status = error.status
      }
      console.log(body);
      logger.error(error)
      response.status(status).send(body)
    }
  }
}
