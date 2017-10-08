/*
    Expresiones regulares para separacion de palabras en textos
*/
var Validator = require('string-validator')
var wordSeparators = /[`~!@#$%^&*\(\)-=+\[{\]}\\|;:'\",.<>/?\s]/ig;
//Separador de palabras
module.exports.wordSeparators = wordSeparators;

module.exports.SeparatorWords = (str) => {
    var words = str.split(wordSeparators);
    words = words.map((row) => {
        return row.trim();
    });
    words = words.filter((row) => {
        return !Validator.isNull()(row);
    });
    return words;
};

module.exports.getPendingWords = (words, _pendingWords,
    _keywords_src, _verbs, _containts, _peoples, CLASS_GRAMATICAL) => {
    for (var i = 0, n = words.length; i < n; i++) {
        if (!words[i]) {
            var isExist = false;
            for (var j = 0, m = _pendingWords.length; j < m; j++) {
                if (_pendingWords[j] == _keywords_src[i]) {
                    isExist = true;
                    break;
                }
            }
            if (!isExist) {
                _pendingWords.push(_keywords_src[i]);
            }
            continue;
        }
        for (var j = 0, m = words[i].concepts.length; j < m; j++) {
            switch (words[i].concepts[j].value) {
                case CLASS_GRAMATICAL.VERB:
                    var _isExist = false;
                    for (var k = 0, u = _verbs.length; k<u; k++){
                        if (_verbs[k].key == words[i].key){
                            _isExist = true;
                            break;
                        }
                    }
                    if (!_isExist){
                        _verbs.push(words[i]);
                    }
                break;
                case CLASS_GRAMATICAL.PRONOMBRE:
                case CLASS_GRAMATICAL.ADJECT:
                    var _isExist = false;
                    for (var k = 0, u = _peoples.length; k < u; k++) {
                        if (_peoples[k].key == words[i].key) {
                            _isExist = true;
                            break;
                        }
                    }
                    if (!_isExist) {
                        _peoples.push(words[i]);
                    }   
                break;
                default:
                    continue;
                break;
            }
            break;
        }
    }
};

module.exports.getMorphology = (row, _word) => {
    for (var i = 0, n = row.length; i < n; i++) {
        var _regexp = new RegExp(row[i].regexp, "ig");
        if (_regexp.test(_word.key)) {
            _word.lexema = row[i]._id;
            var _rest = _word.key.replace(_regexp, '');
            var length = 0;
            for (var j = 0, m = row[i].morphems.length; j < m; j++) {
                var _regexp2 = new RegExp(row[i].morphems[j].regexp, "ig");
                if (!_regexp2.test(_rest)) {
                    continue;
                }
                _word.morphems.push({
                    key: row[i].morphems[j].key,
                    _id: row[i].morphems[j]._id
                });
                var length1 = row[i].morphems[j].key.length;
                for (var k = 0, p = row[i].morphems[j].concepts.length; k < p; k++) {
                    var isDuplicated = false;
                    for (var u = 0, v = _word.concepts.length; u < v; u++) {
                        if (row[i].morphems[j].concepts[k].key == _word.concepts[u].key) {
                            if (length1 > length) {
                                _word.concepts[u] = row[i].morphems[j].concepts[k];
                            }
                            isDuplicated = true;
                            continue;
                        }
                    }
                    if (isDuplicated) {
                        continue;
                    }
                    _word.concepts.push(row[i].morphems[j].concepts[k]);
                }
                length = Math.max(length, row[i].morphems[j].key.length);
            }
            break;
        }
    }
    return _word;
}


//Conceptos gramaticales
module.exports.CONCEPTS = {
    TIME: "INDICATIVO-TIEMPO", // Morphema clase flexible tiempo verbal
    COUNT: "INDICATIVO-NUMERO", // Morphema clase flexible numero
    GENERO: "INDICATIVO-GENERO", // Morphema flexible genero
    CLASS: "CLASIFICACION-GRAMATICAL" // clasificación gramatical
};

//Clasificación gramatical
module.exports.CLASS_GRAMATICAL = {
    PREPOS: "INDEPENDIENTE-PREPOSICION",
    CONJUG: "INDEPENDIENTE-CONJUGACION",
    VERB: "CLASIFICACION-VERBO", //expresan acciones
    SUSTANT: "CLASIFICACION-SUSTANTIVO", // representan entidades fijas
    ADJECT: "CLASIFICACION-ADJETIVO", // acompaña al sustantivo expresa cualidad
    ART: "CLASIFICACION-ARTICULO",
    PARTICI: "CLASIFICACION-PARTICIPIO",
    PRONOMBRE: "CLASIFICACION-PRONOMBRE",
    PREFIX: "DERIVATIVO-PREFIJO", // Morphema clase afijo antepone a la raiz (español todos son derivativos)
    SUFIX: "DERIVATIVO-SUFIJO", // Morphema clase afijo despues de la raiz
    INTER: "DERIVATIVO-INTERFIJO" // Morphema clase afijo intermedio a la raiz (casi nulos)
};

//tiempos verbales
module.exports.TIMES = {
    INFINITY: "INFINITIVO", //accion habitual
    PRESENT: "PRESENTE", //accion habitual
    PRESENTE_PERFECT: "PRESENTE-PERFECTO",
    PASS: "PASADO",
    PASS_PERFECT: "PASADO-PERFECTO",
    FUTURO: "FUTURO",
    FUTURO_PERFECT: "FUTURO-PERFECTO"
/*
    PRETERITO_PERFECT: "PRETERITO-PERFECTO", // no hace demasiado tiempo
    PRETERITO_INPERFECT: "PRETERITO-INPERFECTO", // accion pasada sin identificacion de completado.
    ANTE_COPRETERITO: "PRETERITO-PLUSCUAMPERFECTO", // accion pasada con anterioridad a otra accion pasada.
    PRETERITO_PERFECTO_SIMPLEX: "PRETERITO-PERFECTO-SIMPLE", //accion indefinida
    PRETERITO_BEFORE: "PRETERITO-ANTERIOR", // lo mismo que preterito perfecto pero en desuso.
    FUTURO_SIMPLEX: "FUTURO-SIMPLE", // forma simple futura
    FUTURO_PERFECT: "FUTURO-PERFECTO", // verbo futuro con tiempo pasado
    CONDITIONAL_SIMPLEX: "CONDICIONAL-SIMPLE", // forma simple condicional termina en ía
    CONDITIONAL_PERFECT: "CONDICIONAL-PERFECTO" // auxiliar a una condicional */
};

//genero gramatical
module.exports.GENERO = {
    MAN: "MASCULINO",
    WOMAN: "FEMENINO"
}

//Numero gramatical 
module.exports.COUNT = {
    SINGLE: "SINGULAR",
    MULTI: "PLURAL"
}

/*
    Separacion de verbos
 */
module.exports.VERBOS = [
    /^[a-z]+(?:ar|er|ir)$/ig, // Verbos infinitivos
    /^[a-z]+(?:se)$/ig, // Verbos flexivos
    /^[a-z]+(?:cer|aer|an|en)$/ig, // Verbos irregulares
];

//Morfemas flexivos de conjugación verbos
module.exports.MORPHEM_CONJUGATION = /(ar|er|ir|ado|ido|ando|endo)$/ig;

//Morfemas derivativos sufijos
module.exports.MORPHEM_SUFIX = /(ano|ino|i|eño|ita|[eé]s|ense|o|an|aro|ego|ico|[oó]n|eco|ota|eta|era|cio|isco|enco)$/ig;

//Morfemas derivativos prefijos
module.exports.MORPHEM_PREFIX = /^(filo|bibli[oó]|grafo|repro|fago|aer[oó]|des)/ig;