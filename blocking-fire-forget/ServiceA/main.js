const architecture1 = require('./lib');

var hostname = '0.0.0.0';
var port = 8000;

var server = new architecture1.Service({
    hostname : hostname,
    port : port,
    name: 'Service A',
    upstreamServiceUrl: 'http://service_b:8000'
});

server.start(() => {
    console.log('server listening on', hostname, port);    
});
