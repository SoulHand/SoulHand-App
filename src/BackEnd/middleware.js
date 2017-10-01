var path = require('path')
var Auth = require('./SoulHand/Auth.js')

module.exports = function (app, express, Schema, __DIR__) {
  app.use(function (request, response, next) {
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.setHeader('Access-Control-Allow-Headers',
    'X-Requested-With, Content-Type, Accept, Origin, Authorization')
    response.setHeader('Access-Control-Allow-Methods', '*')
    next()
  })
  app.use(express.static(path.resolve(__DIR__, 'public')))
  app.use('/v1/reports', Auth.isTeacherOrNot.bind(Schema))
  app.use('/v1/activities', Auth.isTeacherOrNot.bind(Schema))
  app.use('/v1/conflicts', Auth.isTeacherOrNot.bind(Schema))
  app.use('/v1/teachers', Auth.isAdmin.bind(Schema))
  app.use('/v1/students', Auth.isAdmin.bind(Schema))
  app.use('/v1/representives', Auth.isAdmin.bind(Schema))
}
