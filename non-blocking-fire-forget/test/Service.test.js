'use strict';

var rest = require('restler');
var architecture1 = require('../lib');

describe('Service communication', () => {

   var url = "http://0.0.0.0:8000/resources"; 

    it('completes', (done) => {
        rest.postJson(url, {
            property1: 'something',
            property2: 'something else'
        }).on('success',
            (data, response) => {
           console.log(data); 
           done();
        });

    });

});

