'use strict';

function InProcClaimService(store){
    var self = {};

    self.save = (claim, callback) => {
        store[claim.id] = claim;
        callback(undefined);
    };

    self.getClaimById = (id, callback) => {
        var claim = store[id];
        callback(undefined, claim);
    };

    return self;
}

module.exports = InProcClaimService;
