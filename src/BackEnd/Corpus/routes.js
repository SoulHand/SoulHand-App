/*
    Rutas para corpus linguisticos

 */
var mongoose = require("mongoose");
var Validator = require('string-validator');
var ValidatorException = require('../SoulHand/Exceptions/ValidatorException.js');
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
            request.body.regexp = request.body.name;
        }
        try {
            var exp = new RegExp(request.body.regexp, "ig");
        } catch (error) {
            throw new ValidatorException("La expresión regular es invalida!");
        }
        Schema.lexemas.findOne({ key: request.body.name }).then((row) => {
            if (row) {
                throw new ValidatorException("Ya existe un lexema igual!");
            }
            var _lexema = new Schema.lexemas({
                key: request.body.name,
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
    /*
    * Rutas para Morfema monema
    */
    /**
     * Añadir un Morfema
     */
    LexemaURI.post('/:lexema/morphemas/', function (request, response, next) {
        if (Validator.isNull()(request.body.name)) {
            throw new ValidatorException("No se admite nulos!");
        }
        if (Validator.isNull()(request.body.regexp)) {
            request.body.regexp = request.body.name;
        }
        try {
            var exp = new RegExp(request.body.regexp, "ig");
        } catch (error) {
            throw new ValidatorException("La expresión regular es invalida!");
        }
        var isValidType = false;
        for(var key in WORDS.TYPE_MORPHEMS){
            if(WORDS.TYPE_MORPHEMS[key] == request.body.type){
                isValidType = true;
                break;
            }
        }
        if(!isValidType){
            throw new ValidatorException("No existe el tipo de morfema!");
        }
        var isValidMode = false;
        for(var key in WORDS.MODE_MORPHEMS){
            if (WORDS.MODE_MORPHEMS[key] == request.body.mode){
                isValidMode = true;
                break;
            }
        }
        if(!isValidMode){
            throw new ValidatorException("No existe el modo de morfema!");
        }
        Schema.lexemas.findOne({ _id: ObjectId(request.params.lexema) }).then((lexema) => {
            if (!lexema) {
                throw new ValidatorException("No existe el lexema!");
            }
            var _morphema = new Schema.morphems({
                key: request.body.name,
                regexp: request.body.regexp,
                type: request.body.type,
                mode: request.body.mode
            });
            for(var i = 0, n = lexema.morphems.length; i<n; i++){
                if(lexema.morphems[i].key == _morphema.key){
                    throw new ValidatorException("Ya existe una clave morfema igual!");
                }
            }
            lexema.morphems.push(_morphema);
            return _lexema.save();
        })
            .then((data) => {
                response.send(data);
            })
            .catch((error) => {
                next(error);
            });
    });
    app.use('/v1/words/lexemas', LexemaURI);
}