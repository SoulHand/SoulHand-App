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
        if (Validator.isNull()(request.body.type)) {
            throw new ValidatorException("No se admite tipo nulo!");
        }
        if (Validator.isNull()(request.body.mode)) {
            throw new ValidatorException("No se admite mode nulo!");
        }
        try {
            var exp = new RegExp(request.body.regexp, "ig");
        } catch (error) {
            throw new ValidatorException("La expresión regular es invalida!");
        }
        var concepts = [];
        if (request.body.concept) {
            var isValidConcept = false;
            for (var key in WORDS.CONCEPTS) {
                if (WORDS.CONCEPTS[key] == request.body.concept) {
                    isValidConcept = true;
                    break;
                }
            }
            if (!isValidConcept) {
                throw new ValidatorException("No existe el tipo de morfema!");
            }
            concepts.push(request.body.concept);
        }
        if (request.body.type) {
            var isValidType = false;
            for (var key in WORDS.TYPE_MORPHEMS) {
                if (WORDS.TYPE_MORPHEMS[key] == request.body.type) {
                    isValidType = true;
                    break;
                }
            }
            if (!isValidType) {
                throw new ValidatorException("No existe el tipo de morfema!");
            }
            concepts.push(request.body.type);
        }
        if (request.body.mode) {
            var isValidMode = false;
            for (var key in WORDS.MODE_MORPHEMS) {
                if (WORDS.MODE_MORPHEMS[key] == request.body.mode) {
                    isValidMode = true;
                    break;
                }
            }
            if (!isValidMode) {
                throw new ValidatorException("No existe el tipo de morfema!");
            }
            concepts.push(request.body.mode);
        }
        if (request.body.time) {
            var isValidTime = false;
            for (var key in WORDS.TIMES) {
                if (WORDS.TIMES[key] == request.body.time) {
                    isValidTime = true;
                    break;
                }
            }
            if (!isValidTime) {
                throw new ValidatorException("No existe el tipo de morfema!");
            }
            concepts.push(request.body.time);
        }
        if (request.body.genero) {
            var isValidGenero = false;
            for (var key in WORDS.GENERO) {
                if (WORDS.GENERO[key] == request.body.genero) {
                    isValidGenero = true;
                    break;
                }
            }
            if (!isValidGenero) {
                throw new ValidatorException("No existe el genero de morfema!");
            }
            concepts.push(request.body.genero);
        }
        if (request.body.count) {
            var isValidcount = false;
            for (var key in WORDS.COUNT) {
                if (WORDS.COUNT[key] == request.body.count) {
                    isValidcount = true;
                    break;
                }
            }
            if (!isValidcount) {
                throw new ValidatorException("No existe el genero de morfema!");
            }
            concepts.push(request.body.count);
        }
        Schema.lexemas.findOne({ _id: ObjectId(request.params.lexema) }).then((lexema) => {
            if (!lexema) {
                throw new ValidatorException("No existe el lexema!");
            }
            var _morphema = new Schema.morphems({
                key: request.body.name,
                regexp: request.body.regexp,
                concepts: concepts
            });
            for(var i = 0, n = lexema.morphems.length; i<n; i++){
                if(lexema.morphems[i].key == _morphema.key){
                    throw new ValidatorException("Ya existe una clave morfema igual!");
                }
            }
            lexema.morphems.push(_morphema);
            return lexema.save();
        })
            .then((data) => {
                response.send(data);
            })
            .catch((error) => {
                next(error);
            });
    });
    /**
     * Eliminar un Morfema
     */
    LexemaURI.delete('/:lexema/morphemas/:id', function (request, response, next) {
        if (!Validator.isMongoId()(request.params.id)) {
            throw new ValidatorException("El id no es valido!");
        }
        if (!Validator.isMongoId()(request.params.lexema)) {
            throw new ValidatorException("El id no es valido!");
        }
        Schema.lexemas.findOne({ _id: ObjectId(request.params.lexema) }).then((lexema) => {
            if (!lexema) {
                throw new ValidatorException("No existe el lexema!");
            }
            for(var i = 0, n = lexema.morphems.length; i<n; i++){
                if (lexema.morphems[i]._id.toString() == request.params.id){
                    lexema.morphems[i].remove();
                    return lexema.save();
                }
            }
            throw new ValidatorException("No existe el morfema!");
        })
            .then((data) => {
                response.send(data);
            })
            .catch((error) => {
                next(error);
            });
    });
    app.use('/v1/words/lexemas', LexemaURI);
    
    /*
    * Rutas para Palabras
    */
    let wordsURI = express.Router();
    /**
     * Añadir una palabra
     */
    wordsURI.post('/', function (request, response, next) {
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
        if(request.body.time){
            var isValidTime = false;
            for (var key in WORDS.TIMES) {
                if (WORDS.TIMES[key] == request.body.time) {
                    isValidTime = true;
                    break;
                }
            }
            if (!isValidTime) {
                throw new ValidatorException("El tiempo gramatical no es valido!");
            }
        }
        if(request.body.count){
            var isValidCount = false;
            for (var key in WORDS.COUNT) {
                if (WORDS.COUNT[key] == request.body.count) {
                    isValidCount = true;
                    break;
                }
            }
            if (!isValidCount) {
                throw new ValidatorException("El numero gramatical no es valido!");
            }
        }
        if(request.body.genero){
            var isValidGenero = false;
            for (var key in WORDS.GENERO) {
                if (WORDS.GENERO[key] == request.body.genero) {
                    isValidGenero = true;
                    break;
                }
            }
            if (!isValidGenero) {
                throw new ValidatorException("El genero gramatical no es valido!");
            }
        }
        Schema.lexemas.find().then((row) => {
            var _word = new Schema.words({
                key: request.body.name.trim(),
                concept: [],
                morphems: []
            });
            for(var i = 0, n = row.length; i<n; i++){
                var _regexp = new RegExp(row[i].regexp, "ig");
                if (_regexp.test(_word.key)){
                    _word.lexema = row[i]._id;
                    var _rest = _word.key.replace(_regexp, '');
                    for(var j = 0, m = row[i].morphems.length; j < m; j++){
                        var _regexp2 = new RegExp(row[i].morphems[j].regexp, "ig");
                        if (!_regexp2.test(_rest)){
                            continue;
                        }
                        _word.morphems.push({
                            key: row[i].morphems[j].key,
                            _id: row[i].morphems[j]._id
                        });
                    }
                    break;
                }
            }
            if(!_word.lexema){
                throw new ValidatorException("No se identificó el lexema de la palabra");
            }
            console.log(_word);
            return _word.save();
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
    wordsURI.get('/', function (request, response, next) {
        Schema.words.find().populate("lexema").populate("morphems").then((rows) => {
            response.send(rows);
        })
        .catch((error) => {
            next(error);
        });
    });
    /**
     * Eliminar una palabra
     */
    wordsURI.delete('/:id', function (request, response, next) {
        if (!Validator.isMongoId()(request.params.id)) {
            throw new ValidatorException("El id no es valido!");
        }
        Schema.words.findOne({ _id: ObjectId(request.params.id) }).then((word) => {
            if (!word) {
                throw new ValidatorException("No existe la palabra!");
            }
            return word.remove();
        })
            .then((data) => {
                response.send(data);
            })
            .catch((error) => {
                next(error);
            });
    });
    app.use('/v1/words', wordsURI);
}