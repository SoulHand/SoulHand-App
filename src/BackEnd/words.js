/*
    Expresiones regulares para separacion de palabras en textos
*/

//Separador de palabras
module.exports.wordSeparators= /[`~!@#$%^&*\(\)-=+\[{\]}\\|;:'\",.<>/?]/ig;

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
