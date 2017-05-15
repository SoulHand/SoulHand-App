const EventEmitter = require('events')

class Inferences extends EventEmitter {

  constructor (db) {
    super()
    this.db = db
  }

  get (event) {
    return this.db.findOne({
      name: event
    })
  }

  isContaint (str, keywords) {
    var exp = new RegExp(keywords.join('|'), 'ig')
    return exp.test(str)
  }

  ModusPones (premises, varGlobals) {
    var exp = new RegExp(`([xp-t][0-9]+)`, 'g')
    var consecuents = []
    while (premises.length) {
      var row = premises.shift()
      var premise = row.premise.replace(exp, 'varGlobals.$1')
      var p1 = eval(premise)
      if (p1) {
        var vars = {}
        var consecuent = row.consecuent.replace(exp, 'vars.$1')
        eval(consecuent)
        for (var i in vars) {
          varGlobals[i] = vars[i]
        }
        consecuents.push(vars)
      }
    }
    return consecuents
  }

  ChainGetAll (premises, varGlobals) {
    var exp = new RegExp('([p-t][0-9]+)', 'g')
    var matchs = []
    premises.forEach((premise) => {
      var condition = premise.premise.replace(exp, 'varGlobals.$1')
      var p1 = eval(condition)
      if (p1) {
        var vars = {}
        var consecuent = premise.consecuent.replace(exp, 'vars.$1')
        eval(consecuent)
        matchs.push(vars)
      }
    })
    return matchs
  }

  ChainGetAllBucle (premises, varGlobals) {
    var exp = new RegExp('([p-t][0-9]+)', 'g')
    var matchs = []
    var i = 0
    while (i < premises.length) {
      var premise = premises[i]
      var condition = premise.premise.replace(exp, 'varGlobals.$1')
      var p1 = eval(condition)
      if (p1) {
        var vars = {}
        var consecuent = premise.consecuent.replace(exp, 'vars.$1')
        eval(consecuent)
        matchs.push(vars)
        premises = premises.splice(i, 1)
      }
      i++
    }
    if (matchs.length === 0) {
      return false
    }
    return matchs
  }

  ChainGetOne (premises, varGlobals) {
    var exp = new RegExp('([p-t][0-9]+)', 'g')
    var matchs = []
    var premise
    premises.forEach((row) => {
      var condition = row.premise.replace(exp, 'varGlobals.$1')
      var p1 = eval(condition)
      if (p1) {
        matchs.push(row)
      }
    })
    if (matchs.length === 0) {
      return false
    }
    matchs.forEach((row) => {
      if (!premise) {
        premise = row
      }
      if (premise.h < row.h) {
        premise = row
      }
    })
    var vars = {}
    var consecuent = premise.consecuent.replace(exp, 'vars.$1')
    eval(consecuent)
    return vars
  }

  propagation (premises, varGlobals) {
    var results = varGlobals.map((row) => {
      return this.ChainGetOne(premises, row)
    })
    return results
  }
}

module.exports = Inferences
