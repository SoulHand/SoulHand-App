var express = require('express')
const logger = require('winston')
var app = express()
var server = require('http').Server(app)
var bodyParser = require('body-parser')
var multer = require('multer') // v1.0.5
var upload = multer() // for parsing multipart/form-data
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(upload.array()) // for parsing application/x-www-form-urlencoded
app.settings = require('./src/BackEnd/config.js').settings(__dirname)
// process.env.NODE_ENV = 'production'
/* Dependences */
app.container = require('./src/BackEnd/dependences.js')(app, __dirname)

// middleware
require('./src/BackEnd/middleware.js')(app, express, server, __dirname)

/* Routes */
require('./src/BackEnd/routes.js')(app, express, server, __dirname)

require('./src/BackEnd/testInit.js')(app, express, server, __dirname)

server.listen(app.settings.port || 8080, function () {
  var addr = server.address()
  logger.debug('Chat server listening at', addr.address + ':' + addr.port)
})

if (app.container.ErrorHandler) {
  app.use(app.container.ErrorHandler)
}
// not Found Middleware
app.use(function (req, res, next) {
  res.status(404).send({code: 404, message: 'No existe la ruta!'})
})
