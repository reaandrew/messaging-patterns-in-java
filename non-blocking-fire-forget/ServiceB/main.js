'use strict';

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const bunyan = require('bunyan');

var log = bunyan.createLogger({name: 'ServiceB'});

var hostname = '0.0.0.0';
var port = 8000;

var app = express();
app.use(bodyParser.json());

app.post('/resources', (req, res) => {
    log.info(req.body, 'resource received');
    res.status(200).end();
});

var server = http.createServer(app);
server.listen(port, hostname, () => {
    console.log('Service B listening on', port);
});
