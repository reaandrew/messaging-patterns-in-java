'use strict';
var should = require('should');

var architecture1 = require('../lib');

describe('InProcClaimService', () => {
    it('save a claim', (done) => {
        var store = {};
        var service = new architecture1.InProcClaimService(store);

        var obj = {id:1, name: 'John Doe'};
        service.save(obj, () => {
            should(store[1]).not.eql(undefined);
            done();
        });
    });

    it('retrieves a claim', (done) => {
        var expectedClaimId = 1;
        var store = {}
        store[expectedClaimId] = {id:expectedClaimId, name: 'something'};

        var service = new architecture1.InProcClaimService(store);
        var claim = service.getClaimById(expectedClaimId, (err, claim) => {
            should(claim.id).eql(store[expectedClaimId].id);
            should(claim.name).eql(store[expectedClaimId].name);
            done();
        });
    });
});
