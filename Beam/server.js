`use strict`;
// ================================================================
// get all the tools we need
// ================================================================
var express = require('express');
var routes = require('./public/routes/index.js');
const path = require('path');
var port = process.env.PORT || 3000;
var app = express();
// ================================================================
// setup our express application
// ================================================================
//app.use('/public', express.static(process.cwd() + '/public'));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/views'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/public/views')); 

// ================================================================
// setup routes
// ================================================================
routes(app);
// ================================================================
// start our server
// ================================================================
app.listen(port, function() {
 console.log('Server listening on port ' + port );
});