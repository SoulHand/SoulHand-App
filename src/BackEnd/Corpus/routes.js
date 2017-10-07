/*
    Rutas para corpus linguisticos

 */
var mongoose = require("mongoose");
var Validator = require('string-validator');
var ValidatorException = require('./SoulHand/Exceptions/ValidatorException.js');
var WORDS = require("../words.js");
const ObjectId = mongoose.Types.ObjectId;


module.exports = function (app, express, Schema, Events, __DIR__) {
    let LexemaURI = express.Router();
    /*
    * Rutas para lexema monema
    */
    /**
     * Añadir un Lexema
     */
    LexemaURI.post('/', function (request, response, next) {
        if (Validator.isNull()(request.body.name)){
            throw new ValidatorException("No se admite nulos!");
        }
        if (Validator.isNull()(request.body.regexp)){
            request.body.regexp = new RegExp(reques.boby.name, "ig");
        }
        try {
            var exp = new RegExp(reques.boby.regexp, "ig");
        } catch (error) {
            throw new ValidatorException("La expresión regular es invalida!");
        }
        Schema.lexemas.findOne({ name: request.boby.name }).then((row) => {
            if (row) {
                throw new ValidatorException("Ya existe un lexema igual!");
            }
            var _lexema = new Schema.lexemas({
                name: request.body.name,
                regexp: request.body.regexp
            });
            return _lexema.save();
        })
        .then((data) => {
            response.send(data);
        })
        .catch((error) => {
            next(error);
        });
    });
    /**
     * Obtener todos los lexemas
     */
    LexemaURI.get('/', function (request, response, next) {
        Schema.lexemas.find().then((rows) => {
            response.send(rows);
        })
        .catch((error) => {
            next(error);
        });
    });
    /**
     * Obtener un lexema
     */
    LexemaURI.get('/:id', function (request, response, next) {
        if(!Validator.isMongoId(request.params.id)){
            throw new ValidatorException("El ID no es valido!");
        }
        Schema.lexemas.findOne({_id: ObjectId(request.params.id)}).then((row) => {
            if(!row){
                throw new ValidatorException("No existe el registro!");
            }
            response.send(row);
        })
        .catch((error) => {
            next(error);
        });
    });
    /**
     * Eliminar un lexema
     */
    LexemaURI.delete('/:id', function (request, response, next) {
        if(!Validator.isMongoId(request.params.id)){
            throw new ValidatorException("El ID no es valido!");
        }
        Schema.lexemas.findOne({_id: ObjectId(request.params.id)}).then((row) => {
            if(!row){
                throw new ValidatorException("No existe el registro!");
            }
            return row.remove();
        }).then((data) => {
            response.send(data);
        })
        .catch((error) => {
            next(error);
        });
    }); 
    app.use('/v1/words/lexemas', LexemaURI);
}