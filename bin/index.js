#!/usr/bin/env node
var path = require('path')
var Server = require('..')

var port = process.env.PORT || 5000
var secret = process.env.SECRET || 'INSECURE-SECRET'

var server = new Server({
  port: port,
  secret: secret,
  publicDir: path.join(__dirname, '../public')
})
if (!server) throw new Error('Invalid server')
console.log('server listening on %d', port)
