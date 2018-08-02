'use strict';

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const rest = require('restler');
const bunyan = require('bunyan');
const amqp = require('amqplib/callback_api');

const EXCHANGE_NAME = 'service.a';
const QUEUE_NAME = 'service.a.consumer';
const ROUTING_KEY = '';

const HOSTNAME = '0.0.0.0';
const PORT = 8000;
const SERVICE_B_URL = 'http://service_b:8000/resources'
const RMQ_CONNECTION_STRING = 'amqp://rabbitmq'

var log = bunyan.createLogger({
  name: 'ServiceA'
});

function checkFatalError(err) {
  if (err !== null && err !== undefined) {
    log.fatal(err);
  }
}

//MESSAGE SUBSCRIBER
amqp.connect(RMQ_CONNECTION_STRING, (err, conn) => {
  checkFatalError(err);
  conn.createChannel((err, ch) => {
    checkFatalError(err);
    log.info({
      exchange: EXCHANGE_NAME,
      queue: QUEUE_NAME
    }, 'subscribing channel open');
    ch.checkExchange(EXCHANGE_NAME, (err, ex) => {
      checkFatalError(err);
      ch.checkQueue(QUEUE_NAME, (err, ok) => {
        checkFatalError(err);
        log.info({}, 'worker listening');
        ch.consume(QUEUE_NAME, function(msg) {
          //TODO:  NEED TO SHOW EXAMPLE WITH ACK/NACK
          var resource = JSON.parse(msg.content);
          log.info(resource, 'processing resource');
          rest.postJson(SERVICE_B_URL, resource).on('success', (data, response) => {
            log.info(resource, 'resource processed');
            ch.ack(msg);
          }).on('error', (err) => {
            ch.nack(msg);
            log.error({
                url: SERVICE_B_URL,
                err: err
            }, 'failed to process resource');  
          });
        }, {
          noAck: false
        });
      });
    });
  });
});

//MESSAGE PUBLISHER
amqp.connect(RMQ_CONNECTION_STRING, (err, conn) => {
  checkFatalError(err);
  log.info({
    exchange: EXCHANGE_NAME
  }, 'publishing channel open');
  conn.createChannel((err, ch) => {
    checkFatalError(err);
    ch.checkExchange(EXCHANGE_NAME, (err, ex) => {
        checkFatalError(err);
        onConnected(ch);
    });
  })
});

function onConnected(channel){
    var app = express();
    app.use(bodyParser.json());

    app.post('/resources', (req, res) => {
      var body = req.body;
      log.info(body, 'resource received');
      var msg = JSON.stringify(body);

      //TODO:  ASSERT ON SERVER CONFIRM BEFORE RETURNING
      channel.publish(EXCHANGE_NAME, ROUTING_KEY, new Buffer(msg));
      log.info(body, 'resource recorded');
      res.status(200).end();
    });

    var server = http.createServer(app);
    server.listen(PORT, HOSTNAME, () => {
      log.info({
        port: PORT,
        hostname: HOSTNAME,
        serviceB_url: SERVICE_B_URL,
        rmq_url: RMQ_CONNECTION_STRING
      },'Service A listening');
    });
}
