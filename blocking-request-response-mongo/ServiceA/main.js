'use strict';

const http = require('http');
const util = require('util');
const express = require('express');
const bodyParser = require('body-parser');
const rest = require('restler');
const bunyan = require('bunyan');
const mongodb = require('mongodb');

const HOSTNAME = '0.0.0.0';
const PORT = 8000;
const SERVICE_B_URL = 'http://service_b:8000/resources'
const MONGODB_URL = 'mongodb://mongodb:27017/serviceA';

var MongoClient = mongodb.MongoClient;
var ObjectID = mongodb.ObjectID

var log = bunyan.createLogger({
  name: 'ServiceA'
});

function checkFatalError(err) {
  if (err !== null && err !== undefined) {
    log.fatal(err);
  }
}

MongoClient.connect(MONGODB_URL, (err, db) => {
  onConnected(db);
});

//TODO: Show an example of when client generated IDs help with idempotency

function onConnected(db) {
  var app = express();
  app.use(bodyParser.json());

  app.post('/resources', (req, res) => {
    var obj = req.body;
    log.info(obj, 'resource received');

    var collection = db.collection('resources');
    obj._id = new ObjectID();
    collection.insert(obj, (err, result) => {
      rest.postJson(SERVICE_B_URL, obj).on('success', (data, response) => {
        log.info(obj, 'resource processed');
        var objUrl = util.format('/resources/%s', obj._id.toHexString());
        res.location(objUrl).status(201).end();
      });
    });
  });

  app.get('/resources/:id', (req, res) => {
    var collection = db.collection('resources');
    collection.findOne({_id: ObjectID.createFromHexString(req.params.id)}, (err, doc) => {
        if (err !== null && err !== undefined){
            log.error({}, err);
        }
        res.json(doc).end();
    });
  });

  var server = http.createServer(app);
  server.listen(PORT, HOSTNAME, () => {
    log.info({
      port: PORT,
      hostname: HOSTNAME,
      serviceB_url: SERVICE_B_URL,
      mongodb_url: MONGODB_URL
    }, 'Service A listening');
  });
}
