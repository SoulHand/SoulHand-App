const Inferences = require('./inferences.js')
const VoidException = require('../Exceptions/VoidException.js')
const ValidatorException = require('../Exceptions/ValidatorException.js')
var WORDS = require("../../words.js");
const logger = require('winston')

module.exports = function (db) {
  const Inference = new Inferences(db.events)
  Inference.on('physic-add', (physic, people) => {
    Inference.get('PHYSIC').then((data) => {
      var Event = db.events
      if (!data) {
        var helpEvent = new Event({
          name: 'PHYSIC',
          objects: {
            p1: 'physic.height',
            p2: 'people.data.genero',
            p3: 'physic.weight',
            p4: 'physic.age'
          }
        })
        helpEvent.save()
        return false
      }
      var result = Inference.ChainGetOne(data.premises, {
        p1: physic.height,
        p2: people.data.genero,
        p3: physic.weight,
        p4: physic.age
      })
      if (!result) {
        return false
      }
      return Promise.all([result.q1, people._id])
    }).then((result) => {
      if (!result) {
        throw new ValidatorException('No existe un conocimiento!')
      }
      logger.info({
        message: 'motor de inferencia ha evaluado el desarrollo físico',
        values: [result[0], result[1].toString()]
      })
      Inference.emit('history-students', result[0], result[1])
    }).catch((error) => {
      logger.error(error.toString())
    })
  })

  Inference.on('history-students', (message, student) => {
    db.Students.findOne({_id: student}).then((data) => {
      if (!data) {
        throw new VoidException('No existe el alumno!')
      }
      var history = new db.HistoryLearning({
        description: message
      })
      logger.info({message: message, student: student.toString()})
      data.history.push(history)
      return data.save()
    })
  })


  Inference.on('new-words', (words) => {
    db.lexemas.find().then((lexemas) => {
      var promises = [];
      for (var i = 0, n = words.length; i < n; i++) {
        var _word = new Schema.words({
          key: words[i].trim(),
          concepts: [],
          morphems: []
        });
        logger.info({ 
          message: `Nueva palabra ingresada ${_word.key}. Iniciando inferencia`
        });
        _word = WORDS.getMorphology(lexemas, _word);
        console.log(_word);
        if(!_word.lexema){
          logger.warning({ 
            message: `Nueva palabra ${_word.key} no fue localizado lexema!`
          });
          var _add = new db.wordsPending({
            key: _word.key
          });
          _add.save();
          logger.warning({
            message: `Registrada palabra "${_add.key}" en pendientes. No localizada`
          });
          var _lexema = _word.key.replace(WORDS.MORPHEM_CONJUGATION, '');
          var _morphema = _word.key.replace(_lexema, '');
          var _mode = WORDS.CLASS_GRAMATICAL.VERB;
          if (_lexema.trim() == "" || _morphema.trim() == ""){
            _lexema = _word.key.replace(WORDS.MORPHEM_PREFIX, '');
            _morphema = _word.key.replace(_lexema, '');
            _mode = WORDS.CLASS_GRAMATICAL.PREFIX;
          }
          if (_lexema.trim() == "" || _morphema.trim() == ""){
            _lexema = _word.key.replace(WORDS.MORPHEM_SUFIX, '');
            _morphema = _word.key.replace(_lexema, '');
            _mode = WORDS.CLASS_GRAMATICAL.SUFIX;
          }
          if (_lexema.trim() == "" || _morphema.trim() == ""){
            continue;
          }
          console.log(_lexema, _morphema, _mode);
          var _concept = new db.Concept({
            key: WORDS.CONCEPTS.CLASS,
            value: _mode
          });
          var _morphe = new db.morphems({
            key: _morphema,
            regexp: _morphema,
            concepts: [_concept]
          });
          var _lexe = new db.lexemas({
            key: _lexema,
            regexp: _lexema,
            morphems: [_morphe]
          });
          _lexe.save();
          _word.lexema = _lexe;
          _word.save();
          continue;
        }
        logger.info({ 
          message: `Nueva palabra ingresada ${_word.key} localizado en lexema ${_word.lexema}`
        });
        promises.push(_word.save());
      }
      return Promise.all(promises);
    })
    .then((words) => {
      var querys = words.map((word) => {
        return db.Hiperonimo.findOne({
          "hiponimos.words": word.key
        })
      });
      querys.push(words);
      return Promise.all([querys]);
    }).then((datas) => {
      var last = datas.length - 1;
      if (last <= 0){
        return null;
      }
      var _words = datas[last];
      for(var i = 0; i < last; i++){
        if(!datas[i]){
          var _add = new db.wordsPending({
            key: _words[i].key
          });
          _add.save();
          logger.warning({
            message: `Registrada palabra "${_add.key}" en pendientes. No localizada`
          });
          continue;
        }
        var _concept = new db.Taxon({
          key: _words[i].key,
          description: null,
          words: []
        });
        //datas[i].description
        for (var j = 0, m = datas[i].hiponimos.length; j<m; j++){
          var _isExist = false;
          for (var k = 0, u = datas[i].hiponimos[j].words.length; k<u; k++){
            if (datas[i].hiponimos[j].words[k] == _concept.key){
              logger.info({
                message: `Palabra "${_concept.key}" Posee un sinonimo en el hiponimo ${datas[i].hiponimos[j].key}`
              });
              _concept.description = datas[i].hiponimos[j] + " [REVISION]";
              _concept.words.push(datas[i].hiponimos[j].words[k]);
              _isExist = true;
              break;
            }
          }
          if(_isExist){
            break;
          }
        }
        logger.info({
          message: `Registrada palabra "${_concept.key}" en el hiperonimo ${datas[i].key}`
        });
        console.log(_concept);
        datas[i].hiponimos.push(_concept);
        datas[i].save();
      }
    });
  })
  return Inference
}
