var http = require("http");

var s = http.createServer(function (req, res) {
    var body = 'Thanks for Calling! \n';
    var content_length = body.length;
    res.writeHead(200, {
        'Content-Length': content_length,
        'Content-Type': 'text/plain'
    });
    res.end(body);
});

//run server

s.listen(8080);