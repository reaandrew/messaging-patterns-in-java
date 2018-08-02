const architecture1 = require('./lib');

var hostname = '0.0.0.0';
var port = 8000;

var claimService = new architecture1.InProcClaimService({});

var server = new architecture1.HttpApiServer({
    hostname : hostname,
    port: port
}, claimService);

server.start(() => {
    console.log('server listening on', hostname, port);    
});
