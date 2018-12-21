var http = require('http')
var express = require('express')
var path = require('path')
var website = require('simple-updatable-website')
var BootstrapServer = require('webrtc-bootstrap-server')
var debug = require('debug')
var log = debug('pando-server')
var randombytes = require('randombytes')
var ee = require('event-emitter')

function periodic (fn, delay) {
  var timeout = null

  function execute () {
    fn()
    timeout = setTimeout(execute, delay)
    return this
  }

  function stop () {
    clearTimeout(timeout)
    return this
  }

  return {
    start: execute,
    stop: stop
  }
}

function Server (opts) {
  if (this === global) {
    return new Server(opts)
  }

  opts = opts || {}
  var secret = opts.secret || 'INSECURE-SECRET'
  var publicDir = opts.publicDir || path.join(__dirname, '..', 'public')
  var port = opts.port || 5000
  var seed = opts.seed || null
  var monitoringInverval = opts.monitoringInterval || 5

  var app = express()
  var httpServer = http.createServer(app)
  httpServer.listen(port)

  website.route(app, {
    secret: secret,
    public: publicDir
  })
  this._app = app
  this._httpServer = httpServer
  this._bootstrap = new BootstrapServer(secret, {
    httpServer: httpServer,
    seed: seed
  })

  var connectionNb = 0
  var connections = {}
  this._connections = connections
  var statuses = {}
  this._monitor = null

  var self = this

  function addClient (ws) {
    ws.id = randombytes(4).hexSlice()
    log('addClient(' + ws.id + ')')
    connections[ws.id] = ws
    connectionNb++
    return ws.id
  }

  function removeClient (ws) {
    log('removeClient(' + ws.id + ')')
    if (connections.hasOwnProperty(ws.id)) {
      delete connections[ws.id]
      connectionNb--
    }
    if (statuses.hasOwnProperty(ws.id)) {
      delete statuses[ws.id]
    }
    return ws.id
  }

  function sendSummary () {
    log('sendSummary()')
    var summary = {
      connectionNb: connectionNb,
      statuses: statuses
    }

    if (self._monitor) {
      log('sending to monitor')
      self._monitor.send(JSON.stringify(summary))
    }
  }

  this._bootstrap.server
    .on('connection/monitoring/processor',
      function (ws) {
        log('connection/monitoring/processor')
        var id = addClient(ws)
        ws.on('message', function (data) {
          var status = JSON.parse(data)
          statuses[id] = status
        })
        ws.on('error', function (err) {
          log('connection/client error:')
          log(err)
          removeClient(ws)
        })
        ws.on('close', function () {
          log('connection/client closed')
          removeClient(ws)
        })
      })
    .on('connection/monitoring/monitor',
      function (ws) {
        log('connection/monitoring/monitor')
        self._monitor = ws
        ws.on('close', function () {
          self._monitor = null
        })
        ws.on('error', function () {
          self._monitor = null
        })
      })
    .on('listening',
      function () {
        self.emit('listening')
      })

  this._updater = periodic(sendSummary, monitoringInverval * 1000).start()
  return this
}

ee(Server.prototype)

Server.prototype.close = function () {
  this._httpServer.close()
  this._updater.stop()
  for (var c in this._connections) {
    this._connections[c].close()
  }
  if (this._monitor) this._monitor.close()
}

module.exports = Server
