var http = require('http')
var express = require('express')
var path = require('path')
var website = require('simple-updatable-website')
var BootstrapServer = require('webrtc-bootstrap-server')

function Server (opts) {
  if (this === global) {
    return new Server(opts)
  }

  opts = opts || {}
  var secret = opts.secret || 'INSECURE-SECRET'
  var publicDir = opts.publicDir || path.join(__dirname, '..', 'public')
  var port = opts.port || 5000
  var seed = opts.seed || null

  var app = express()
  var httpServer = http.createServer(app)
  httpServer.listen(port)

  website.route(app, {
    secret: secret,
    public: publicDir
  })
  this._httpServer = httpServer
  this._bootstrap = new BootstrapServer(secret, {
    httpServer: httpServer,
    seed: seed
  })

  return this
}

Server.prototype.close = function () {
  this._httpServer.close()
}

module.exports = Server
