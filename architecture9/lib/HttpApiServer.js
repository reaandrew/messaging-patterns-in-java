'use strict';

const http = require('http');
const util = require('util');
const express = require('express');
const bodyParser = require('body-parser');
const uuidV4 = require('uuid/v4');

var claims = {};

function HttpApiServer(config, claimService){
    var app = express();
    app.use(bodyParser.json());
    var server = http.createServer(app);
    var self = {};

    app.post('/claims', (req, res) => {
      var claimId = uuidV4();
      var claimObj = req.body;
      claimObj.id = claimId;

      claimService.save(claimObj, () => {
          var path = util.format('/claims/%s', claimId);
          res.location(self.url(path)).status(202).end();
      });

    });

    app.get('/claims/:id', (req, res) => {
        var id = req.params.id;
        claimService.getClaimById(id, (err, claim) => {
            res.status(201);
            res.json(claim);
            res.end();
        });
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

module.exports = HttpApiServer;
