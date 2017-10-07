/*
    Expresiones regulares para separacion de palabras en textos
*/

/*
    Separacion de verbos
 */
module.exports.VERBOS = [
    /^[a-z]+(?:ar|er|ir)$/ig, // Verbos infinitivos
    /^[a-z]+(?:se)$/ig, // Verbos flexivos
    /^[a-z]+(?:cer|aer|an|en)$/ig, // Verbos irregulares
];

//Acciones
module.exports.ACTIONS = [
    /^dia[a-z]*/ig,
    /^ilustra[a-z]*/ig,
    /[a-z]*cultura$/ig,
    /pint(ura|ar)*/ig,
    /jueg[oa]n?/ig,
    /solu?/ig,
    /^[a-z]+(?:os|as)$/ig
];

//Instrumentos
module.exports.INSTRUMENTS = [
    /Obra|Art[efaculoti]*|libro|car[tilcaur]*|pr?o[emabl]s?|can[ciotarn]+/ig,
    /repor[teja]+s?|historia(dor)?|m[uú]sica|bai[lare]|(foto)?copia[rsn]?/ig
];

//Modo de un morfema
module.exports.MODE_MORPHEMS = {
    PREFIX: "MORPH-PREFIX", // Morphema clase afijo antepone a la raiz (español todos son derivativos)
    SUFIX: "MORPH-SUFIX", // Morphema clase afijo despues de la raiz ()
    INTERFIX: "MORPH-INTER" // Morphema clase afijo intermedio a la raiz (casi nulos)
};

//Tipos de morfemas
module.exports.TYPE_MORPHEMS = {
    NOFOREING: "MORPH-NOFOREING", // Morfema Independiente preposiciones y conjugaciones
    DERIVATE: "MORPH-DERIVATE", //Morfemas dependientes unen monemas para generar significado (cerca de la raiz).
    FLEX: "MORPH-FLEX" // marcan accion verbal marcan genero numero y en el verbo tiempo.
}

//categoria gramatical
module.exports.CONCEPTS = {
    VERB: "VERBO", //expresan acciones
    SUSTANT: "SUSTANTIVO", // representan entidades fijas
    PREPO: "PREPOSICION", // palabra invariante para establecer relacion entre dos o mas palabras
    ADJECT: "ADJECTIVO", // acompaña al sustantivo expresa cualidad
    PARTICI: "PARTICIPIO",
    PRONOMB: "PRONOMBRE",
    ARTIC: "ARTICULO",
    NAME: "NOMBRE",
    ADVER: "ADVERBIO"
};

//tiempos verbales
module.exports.TIMES = {
    PRESENT: "PRESENTE", //accion habitual
    PRETERITO_PERFECT: "PRETERITO-PERFECTO", // no hace demasiado tiempo
    PRETERITO_INPERFECT: "PRETERITO-INPERFECTO", // accion pasada sin identificacion de completado.
    ANTE_COPRETERITO: "PRETERITO-PLUSCUAMPERFECTO", // accion pasada con anterioridad a otra accion pasada.
    PRETERITO_PERFECTO_SIMPLEX: "PRETERITO-PERFECTO-SIMPLE", //accion indefinida
    PRETERITO_BEFORE: "PRETERITO-ANTERIOR", // lo mismo que preterito perfecto pero en desuso.
    FUTURO_SIMPLEX: "FUTURO-SIMPLE", // forma simple futura
    FUTURO_PERFECT: "FUTURO-PERFECTO", // verbo futuro con tiempo pasado
    CONDITIONAL_SIMPLEX: "CONDICIONAL-SIMPLE", // forma simple condicional termina en ía
    CONDITIONAL_PERFECT: "CONDICIONAL-PERFECTO" // auxiliar a una condicional
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