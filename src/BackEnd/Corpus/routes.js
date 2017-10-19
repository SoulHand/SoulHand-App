/*
    Rutas para corpus linguisticos

 */
var mongoose = require("mongoose");
var Validator = require('string-validator');
var ValidatorException = require('../SoulHand/Exceptions/ValidatorException.js');
var VoidException = require('../SoulHand/Exceptions/VoidException.js');
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
        request.body.name = request.body.name.toUpperCase();
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
        Schema.lexemas.find().sort({ key: 1 }).then((rows) => {
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
        if (!Validator.isJSON()(request.body.concepts)) {
            throw new ValidatorException("No es valido los conceptos");
        }
        try {
            var exp = new RegExp(request.body.regexp, "ig");
        } catch (error) {
            throw new ValidatorException("La expresión regular es invalida!");
        }
        request.body.name = request.body.name.toUpperCase();
        request.body.concepts = JSON.parse(request.body.concepts);
        for (var i = 0, n = request.body.concepts.length; i<n; i++){
            switch (request.body.concepts[i].key){
                case WORDS.CONCEPTS.CLASS:
                    var isValid = false;
                    for (var key in WORDS.CLASS_GRAMATICAL){
                        if (WORDS.CLASS_GRAMATICAL[key]){
                            isValid = true;
                            break;
                        }
                    }
                    if (!isValid){
                        throw new ValidatorException("La clase gramatical es invalida!");
                    }
                break;
                case WORDS.CONCEPTS.COUNT:
                    var isValid = false;
                    for (var key in WORDS.COUNT){
                        if (WORDS.COUNT[key]){
                            isValid = true;
                            break;
                        }
                    }
                    if (!isValid){
                        throw new ValidatorException("El numero grámatical es invalido!");
                    }
                break;
                case WORDS.CONCEPTS.GENERO:
                    var isValid = false;
                    for (var key in WORDS.GENERO){
                        if (WORDS.GENERO[key]){
                            isValid = true;
                            break;
                        }
                    }
                    if (!isValid){
                        throw new ValidatorException("El genero grámatical es invalido!");
                    }
                break;
                case WORDS.CONCEPTS.TIME:
                    var isValid = false;
                    for (var key in WORDS.TIMES){
                        if (WORDS.TIMES[key]){
                            isValid = true;
                            break;
                        }
                    }
                    if (!isValid){
                        throw new ValidatorException("El tiempo verbal es invalido!");
                    }
                break;
            }
            if (request.body.concepts.length == 0){
                throw new ValidatorException("Es necesario al menos un concepto gramatical!");
            }
            request.body.concepts[i] = new Schema.Concept(request.body.concepts[i]);
        }
        Schema.lexemas.findOne({ _id: ObjectId(request.params.lexema) }).then((lexema) => {
            if (!lexema) {
                throw new ValidatorException("No existe el lexema!");
            }
            var _morphema = new Schema.morphems({
                key: request.body.name,
                regexp: request.body.regexp,
                concepts: request.body.concepts
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
        if (Validator.isNull()(request.body.description)) {
            throw new ValidatorException("Es necesario una descripción!");
        }
        if (!Validator.isJSON()(request.body.term)) {
            throw new ValidatorException("No existe el contexto!");
        }
        if (!Validator.isJSON()(request.body.morphem)) {
            throw new ValidatorException("No es valido los morfemas!");
        }
        if (!Validator.isMongoId()(request.body.lexem)) {
            throw new ValidatorException("No existe el lexema!");
        }
        if (Validator.isNull()(request.body.words)) {
            request.body.words = [];
        }else{
            request.body.words = WORDS.SeparatorWords(request.body.words);
        }
        try {
            var exp = new RegExp(request.body.regexp, "ig");
        } catch (error) {
            throw new ValidatorException("La expresión regular es invalida!");
        }
        request.body.morphem = JSON.parse(request.body.morphem);
        request.body.morphem.forEach((row) => {
            if (!Validator.isMongoId()(row)) {
                throw new ValidatorException("No existe el Morfema!");
            }
        });
        request.body.name = request.body.name.toUpperCase();
        request.body.name = request.body.name.toUpperCase();
        request.body.term = JSON.parse(request.body.term).map((row) => {
            return {
                _id: ObjectId(row)
            };
        })
        Promise.all([
            Schema.Hiperonimo.find({$or: request.body.term}),
            Schema.lexemas.findOne({ _id: ObjectId(request.body.lexem)})
                .populate("morphems.concepts"),
            Schema.words.findOne({ key: request.body.name })
        ])
        .then((rows) => {
            if(rows[0].length == 0){
                throw new ValidatorException("El contexto no existe o no es valido!");
            }
            if(!rows[1]){
                throw new ValidatorException("No existe el lexema!");
            }
            if(rows[2]){
                return [rows[2], rows[0]];
            }
            var _morphems = [];
            var _concepts = [];
            for(var i = 0, n = request.body.morphem.length; i<n; i++){
                var isExist = false;
                for(var j = 0, m = rows[1].morphems.length; j<m; j++){
                    if(rows[1].morphems[j]._id.toString() == request.body.morphem[i]){
                        _morphems.push({
                            _id: rows[1].morphems[j]._id,
                            key: rows[1].morphems[j].key
                        });
                        _concepts = _concepts.concat(rows[1].morphems[j].concepts);
                        isExist = true;
                        break;
                    }
                }
                if (!isExist){
                    throw new ValidatorException("No existe el morfema!");
                }
            }
            var _word = new Schema.words({
                key: request.body.name.trim(),
                concepts: _concepts,
                morphems: _morphems,
                lexema: rows[1],
            });
            return Promise.all([_word.save(), rows[0]]);
        })
        .then((data) => {
            var promises = [];
            data[1].forEach((hiperonimo) => {
                var _taxon = new Schema.Taxon({
                    key: data[0].key,
                    description: request.body.description,
                    words: request.body.words
                });
                hiperonimo.hiponimos.push(_taxon);
                promises.push(hiperonimo.save());
            });
            return Promise.all(promises);
        })
        .then((data) => {
            response.send(data);
        })
        .catch((error) => {
            console.log(error);
            next(error);
        });
    });
    /**
     * Obtener un lexema
     */
    wordsURI.get('/info/:info', function (request, response, next) {
        request.params.info = request.params.info.toUpperCase();
        Promise.all([
            Schema.words.findOne({ key: request.params.info})
            .populate("lexema")
            .populate("morphems"),
            Schema.Hiperonimo.find({
              "hiponimos.key": request.params.info
            }),
            Schema.wordsPending.find({
              key: request.params.info
            })
        ]).then((row) => {
            row[1] = row[1].map((row) => {
                var _val = row.toJSON();
                _val.hiponimos = row.hiponimos.filter((row2) => {
                    return row2.key == request.params.info;
                });
                return _val;
            });
            response.send(row);
        })
        .catch((error) => {
            next(error);
        });
    });
    /**
     * Obtener todos los lexemas
     */
    wordsURI.get('/', function (request, response, next) {
        Schema.words.find()
        .populate("lexema")
        .populate("morphems")
        .sort({ key: 1 })
        .then((rows) => {
            response.send(rows);
        })
        .catch((error) => {
            next(error);
        });
    });
    /**
     * Obtener todos los lexemas
     */
    wordsURI.get('/:id', function (request, response, next) {
        if(!Validator.isMongoId()(request.params.id)){
            throw new ValidatorException("El id no es valido!");
        }
        Schema.words.findOne({_id: ObjectId(request.params.id)}).populate("lexema").populate("morphems").then((data) => {
            var _body = data.toJSON();
            return Promise.all([_body, Schema.Hiperonimo.find({ "hiponimos.key": _body.key })]);
        })
        .then((datas) => {
            var body = datas[0];
            var terms = datas[1].map((row) => {
                row.hiponimos = row.hiponimos.filter((row2) => {
                    return row2.key == body.key;
                });
                return row;
            });
            body.terms = terms;
            response.send(body);
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

    /*
    * Rutas para hiperonimos (terminos)
    */
    let TermsURI = express.Router();
    /**
     * Añadir una palabra
     */
    TermsURI.post('/', function (request, response, next) {
        if (Validator.isNull()(request.body.name)) {
            throw new ValidatorException("No se admite nulos!");
        }
        if (Validator.isNull()(request.body.description)) {
            throw new ValidatorException("Es necesario una definición de terminos");
        }
        Schema.Hiperonimo.findOne({ concept: request.body.name })
        .then((data) => {
            if(data){
                throw new ValidatorException("El termino ya existe!");
            }
            var _term = new Schema.Hiperonimo({
                concept: request.body.name,
                description: request.body.description
            });
            return _term.save();
        })
        .then((data) => {
            response.send(data);
        })
        .catch((error) => {
            next(error);
        });
    }); 
    /**
     * Añadir una palabra
     */
    TermsURI.get('/', function (request, response, next) {
        Schema.Hiperonimo.find()
        .sort({concept: 1})
        .then((data) => {
            response.send(data);
        })
        .catch((error) => {
            next(error);
        });
    });
    /**
     * obtener una palabra
     */
    TermsURI.get('/:id', function (request, response, next) {
        if (!Validator.isMongoId(request.params.id)){
            throw new ValidatorException("No es valido el id");
        }
        Schema.Hiperonimo.findOne({_id: ObjectId(request.params.id)})
        .then((data) => {
            if(!data){
                throw new ValidatorException("No existe el registro!");
            }
            response.send(data);
        })
        .catch((error) => {
            next(error);
        });
    });
    /**
     * Añadir una palabra
     */
    TermsURI.delete('/:id', function (request, response, next) {
        if(!Validator.isMongoId(request.params.id)){
            throw new ValidatorException("Es necesario una id valida");
        }
        Schema.Hiperonimo.findOne({ _id: ObjectId(request.params.id)})
        .then((hiperonimo) => {
            if (!hiperonimo){
                throw new ValidatorException("No existe el termino!");
            }
            return hiperonimo.remove();
        })
        .then((data) => {
            response.send(data);
        })
        .catch((error) => {
            next(error);
        });
    });
    /**
     * Añadir una palabra
     */
    TermsURI.delete('/:hiper/hiponimos/:id', function (request, response, next) {
        if(!Validator.isMongoId(request.params.id)){
            throw new ValidatorException("Es necesario una id valida");
        }
        if(!Validator.isMongoId(request.params.hiper)){
            throw new ValidatorException("Es necesario una id valida");
        }
        Schema.Hiperonimo.findOne({ _id: ObjectId(request.params.hiper)})
        .then((hiperonimo) => {
            if (!hiperonimo){
                throw new ValidatorException("No existe el termino!");
            }
            for(var i = 0, n = hiperonimo.hiponimos.length; i<n; i++){
                if (hiperonimo.hiponimos[i]._id.toString() == request.params.id){
                    hiperonimo.hiponimos[i].remove();
                    return hiperonimo.save();
                }
            }
            throw new ValidatorException("No existe el hiponimo!");
        })
        .then((data) => {
            response.send(data);
        })
        .catch((error) => {
            next(error);
        });
    });
    app.use('/v1/terms', TermsURI);
    /*
    * Rutas para hiperonimos (terminos)
    */
    let PendingURI = express.Router();
    /**
     * Añadir una palabra
     */
    /**
     * Obtener palabras pendientes
     */
    PendingURI.get('/', function (request, response, next) {
        Schema.wordsPending.find()
        .sort({ dateCreated: 1 })
        .then((data) => {
            response.send(data);
        })
        .catch((error) => {
            next(error);
        });
    });
    app.use('/v1/words/pendings', PendingURI);
}