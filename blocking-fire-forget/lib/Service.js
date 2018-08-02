'use strict';

const http = require('http');
const util = require('util');
const express = require('express');
const bodyParser = require('body-parser');
const uuidV4 = require('uuid/v4');
const rest = require('restler');

var objects = {};

function Service(config){
    var app = express();
    app.use(bodyParser.json());
    var server = http.createServer(app);
    var self = {};

    app.post('/visit', (req, res) => {
        if (config.upstreamServiceUrl !== undefined){
           rest.post(config.upstreamServiceUrl + '/visit').on('success', (data, response) => {
                data.push({
                    stamp: config.name
                });
                res.json(data).status(200).end();
           });
        }else{
            res.json([{
                stamp: config.name
            }]).status(200).end();
        }
    });

    self.url = (path) => {
      return util.format('http://%s:%d%s', 
          config.hostname, 
          config.port,
          path);
    };

    self.start = (callback) => {
        server.listen(config.port, config.hostname, callback);
    };

    self.stop = (callback) => {
        server.close(callback);
    };

    return self;
}

module.exports = Service;
