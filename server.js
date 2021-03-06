var express = require('express')
const logger = require('winston')
const bodyParser = require('body-parser')
var multer = require('multer')
var upload = multer() // for parsing multipart/form-data
var mongoose= require('mongoose');

class App {
  constructor(){
    this._app = express()
    this._app.use(bodyParser.json()) // for parsing application/json
    this._app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
    this._app.use(upload.array()) // for parsing application/x-www-form-urlencoded
    this._settings = require('./src/BackEnd/config.js').settings(__dirname)
    //this._connect = mongoose.createConnection(process.env.DATABASE.DNS);
    this._db = require("./src/BackEnd/models.js");
    /* Dependences */
    this._app.container = require('./src/BackEnd/dependences.js')(this._app, __dirname)

    // middleware
    require('./src/BackEnd/middleware.js')(this._app, express, this._db, __dirname)

    /* Routes */
    require('./src/BackEnd/routes.js')(this._app, express, this._db, __dirname)
    if(process.env.NODE_ENV == "production"){
      require('./src/BackEnd/testInit.js')(this._db);
    }
    if (this._app.container.ErrorHandler) {
      this._app.use(this._app.container.ErrorHandler)
    }
    // not Found Middleware
    this._app.use(function (req, res, next) {
      res.status(404).send({code: 404, message: 'No existe la ruta!'})
    });
  }
  start(){
    var p1 = new Promise((resolve, reject) => {
      this._server = this._app.listen(process.env.PORT || 8080, () => {
        var addr = this._server.address()
        logger.debug('Chat server listening at', addr.address + ':' + addr.port)
        resolve(addr);
      });
    });
    return p1;
  }
  close(){
    this._server.close();
  }
}
module.exports = App;
