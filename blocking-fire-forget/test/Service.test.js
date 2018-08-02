'use strict';

var rest = require('restler');
var architecture1 = require('../lib');

describe('Service communication', () => {

   var url = "http://0.0.0.0:8000/visit"; 

    it('completes', (done) => {
        rest.post(url).on('success',
            (data, response) => {
           console.log(data); 
           done();
        });

    });

});

