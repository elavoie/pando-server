[![Build Status](https://travis-ci.org/elavoie/pando-server.svg?branch=master)](https://travis-ci.org/elavoie/pando-server)

# pando-server
Server for bootstrapping a pando network and serving the volunteer code.

# Usage

    SECRET='12345...' PORT=1234 PUBLICDIR='./public' pando-server

# Launch on heroku

    git clone git@github.com:elavoie/pando-server
    cd pando-server
    heroku login
    heroku create
    # 1. Generate an alphanumeric secret and add it to the environment variable on
    #    Heroku
    # 2. Note the host provided by heroku to used with the pando-computing tool

# API

## Server([opts])

`opts` is an optional object with the options below, given with their default values:

    {
        monitoringInterval: 5, // in seconds
        publicDir: '<pando-server-dir>/public',
        port: 5000,
        secret: 'INSECURE-SECRET',
        seed: null
    }

`opts.monitoringInterval` is the refresh rate for sending monitoring events.

`opts.publicDir` is the public directory to use to serve files over http.

`opts.port` is the port number on which to start the server.

`opts.secret` is the secret used by the root node to connect and upload files.

`opts.seed` is the seed to use for pseudo-random number generation (such as for Channel.id). If null, use the crypto.randomBytes method.

