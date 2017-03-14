[![Build Status](https://travis-ci.org/elavoie/pando-server.svg?branch=master)](https://travis-ci.org/elavoie/pando-server)

# pando-server
Server for bootstrapping a pando network and serving the volunteer code.

# Usage

    SECRET='12345...' PORT=1234 PUBLICDIR='./public' pando-server

# API

## Server([opts])

`opts` is an optional object with the options below, given with their default values:

    {
        secret: 'INSECURE-SECRET',
        publicDir: '<pando-server-dir>/public',
        port: 5000     
    }

