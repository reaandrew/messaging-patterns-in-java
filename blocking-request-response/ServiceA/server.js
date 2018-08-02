'use strict';

const http = require('http');
const util = require('util');
const express = require('express');
const bodyParser = require('body-parser');
const rest = require('restler');
const bunyan = require('bunyan');
const uuidV4 = require('uuid/v4');

const HOSTNAME = '0.0.0.0';
const PORT = 8000;
const SERVICE_B_URL = 'http://service_b:8000/resources'

var log = bunyan.createLogger({
  name: 'ServiceA'
});

//CURRENTLY STATEFUL SERVICE FOR THE PURPOSES OF EXAMPLE
var resources = {};

function checkFatalError(err) {
  if (err !== null && err !== undefined) {
    log.fatal(err);
  }
}

var app = express();
app.use(bodyParser.json());

app.post('/resources', (req, res) => {
  var obj = req.body;
  obj.id = uuidV4();
  log.info(obj, 'resource received');

  rest.postJson(SERVICE_B_URL, obj).on('success', (data, response) => {
    log.info(obj, 'resource processed');
    resources[obj.id] = obj;
    var objUrl = util.format('/resources/%s', obj.id);
    res.location(objUrl).status(201).end();
  });
});

app.get('/resources/:id', (req, res) => {
    var id = req.params.id;
    var obj = resources[id];
    res.json(obj).end();
});

var server = http.createServer(app);
server.listen(PORT, HOSTNAME, () => {
  log.info({
    port: PORT,
    hostname: HOSTNAME,
    serviceB_url: SERVICE_B_URL,
  }, 'Service A listening');
});
