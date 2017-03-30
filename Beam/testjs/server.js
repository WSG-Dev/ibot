const http = require('http');
const hostname = 'localhost'
var play = require('play');

const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World\n');


});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});