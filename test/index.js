var tape = require('tape')
var debug = require('debug')
var path = require('path')
var log = debug('test')
var Server = require('..')
var SimpleWebSocket = require('simple-websocket')

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

tape('Monitoring test', function (t) {
  t.timeoutAfter(2 * 1000)
  var server = Server({
    monitoringInterval: 1,
    secret: secret,
    port: port,
    publicDir: path.join(__dirname, '../public'),
    seed: 1337
  })
  log('server started')
  t.ok(server)

  server.on('listening', function () {
    var monitor = new SimpleWebSocket('ws://localhost:' + port + '/monitoring/monitor')
    monitor.on('data', function (data) {
      var summary = JSON.parse(data)
      var messages = {}

      t.equal(summary.connectionNb, 2)

      for (var id in summary.statuses) {
        var s = summary.statuses[id]
        messages[s.message] = true
      }

      t.deepEqual(messages, { 'hello': true, 'world': true })
      log('closing server')
      server.close()
      t.end()
    })

    var processor1 = new SimpleWebSocket('ws://localhost:' + port + '/monitoring/processor')
    var processor2 = new SimpleWebSocket('ws://localhost:' + port + '/monitoring/processor')

    processor1.on('connect', function () {
      processor1.send(JSON.stringify({ 'message': 'hello' }))
    })
    processor2.on('connect', function () {
      processor2.send(JSON.stringify({ 'message': 'world' }))
    })
  })
})
