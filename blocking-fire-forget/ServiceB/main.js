const architecture1 = require('./lib');

var hostname = '0.0.0.0';
var port = 8000;

var server = new architecture1.Service({
    hostname : hostname,
    port : port,
    name: 'Service B',
});

server.start(() => {
    console.log('server listening on', hostname, port);    
});
