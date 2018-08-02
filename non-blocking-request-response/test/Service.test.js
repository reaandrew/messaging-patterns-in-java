'use strict';

var http = require('http');
var util = require('util');

var express = require('express');
var rest = require('restler');
var should = require('should');

describe('Submitting a new resource', () => {

  var server;
  var url = (path) => 'http://0.0.0.0:8001' + path;

  describe('when a claim is submitted', () => {
    var submitResponse;

    before((done) => {
      rest.postJson(url('/resources'), {
        propertyA: 'Something',
        propertyB: 'Something Else'
      }).on('success', (data, response) => {
        submitResponse = response;
        done();
      });
    });

    it('an Accepted Response is returned', () => {
      should(submitResponse.statusCode).eql(202);
    });

    it('the location of the new claim object is returned', () => {
      should(submitResponse.headers.location).match(/resources\/[\w\d-]{36}/);
    });

    describe('when the resource url is queried', () => {

      var queryResponse;
      var queryData;

      before((done) => {
        //For the purposes of this example, allow some time to elapse before querying the object
        setTimeout(() => {
            rest.get(url(submitResponse.headers.location)).on('success', (data, response) => {
              queryResponse = response;
              queryData = data;
              done();
            });
        }, 500);
      });

      it('an OK 200 response is returned', () => {
        should(queryResponse.statusCode).eql(200);
      });

      it('the object is returned with name', () => {
        should(queryData.propertyA).eql('Something');
      });

      it('the object is returned with dob', () => {
        should(queryData.propertyB).eql('Something Else');
      });

      it('the object is returned with an id', () => {
        should(queryData.id).match(/[\w\d-]{36}/);
      });
    });
  });
});
