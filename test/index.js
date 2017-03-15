var tape = require('tape')
var debug = require('debug')
var path = require('path')
var log = debug('test')
var Server = require('..')

var secret = 'secret'
var port = 5000

tape('Starting test', function (t) {
  var s = Server({
    secret: secret,
    port: port,
    publicDir: path.join(__dirname, '../public'),
    seed: 1337
  })
  log('server started')
  t.ok(s)
  log('closing server')
  s.close()
  t.end()
})
