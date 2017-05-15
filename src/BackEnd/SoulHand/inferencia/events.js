const Inferences = require('./inferences.js')
const VoidException = require('../Exceptions/VoidException.js')
const ValidatorException = require('../Exceptions/ValidatorException.js')
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
  return Inference
}
