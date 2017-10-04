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