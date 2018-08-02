'use strict';

var http = require('http');
var util = require('util');

var express = require('express');
var rest = require('restler');
var should = require('should');
const uuidV4 = require('uuid/v4');

describe('Submitting a new claim', () => {

  var server;
  var url = (path) => 'http://0.0.0.0:8000' + path;

  describe('when a claim is submitted', () => {
    var submitResponse;

    before((done) => {
      rest.postJson(url('/claims'), {
        name: 'John Doe',
        dob: '21/04/1983'
      }).on('success', (data, response) => {
        submitResponse = response;
        done();
      });
    });

    it('an Accepted Response is returned', () => {
      should(submitResponse.statusCode).eql(202);
    });

    it('the location of the new claim object is returned', () => {
      should(submitResponse.headers.location).match(/claims\/[\w\d-]{36}/);
    });

    describe('when the claim url is queried', () => {

      var queryResponse;
      var queryData;

      before((done) => {
        rest.get(submitResponse.headers.location).on('success', (data, response) => {
          queryResponse = response;
          queryData = data;
          done();
        });
      });

      it('a Created 201 response is returned', () => {
        should(queryResponse.statusCode).eql(201);
      });

      it('the object is returned with name', () => {
        should(queryData.name).eql('John Doe');
      });

      it('the object is returned with dob', () => {
        should(queryData.dob).eql('21/04/1983');
      });

      it('the object is returned with an id', () => {
        should(queryData.id).match(/[\w\d-]{36}/);
      });
    });
  });
});
