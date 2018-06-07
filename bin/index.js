#!/usr/bin/env node
var os = require('os')
var path = require('path')
var Server = require('..')

var port = process.env.PORT || 5000
var secret = process.env.SECRET || 'INSECURE-SECRET'
var publicDir = process.env.PUBLICDIR || path.join(__dirname, '../public')

var server = new Server({
  port: port,
  secret: secret,
  publicDir: publicDir
})
if (!server) throw new Error('Invalid server')

function getIPAddresses () {
  var ifaces = os.networkInterfaces()
  var addresses = []

  Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0

    ifaces[ifname].forEach(function (iface) {
      if (iface.family !== 'IPv4' || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return
      }

      if (alias >= 1) {
        // this single interface has multiple ipv4 addresses
        addresses.push(iface.address)
      } else {
        // this interface has only one ipv4 adress
        addresses.push(iface.address)
      }
    })
  })
  return addresses
}

getIPAddresses().forEach(function (addr) {
  console.log('server listening on %s:%d', addr, port)
})
