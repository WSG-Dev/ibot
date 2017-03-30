var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');


//var configDB = require('./config/database.js');
//mongoose.connect(configDB.url);
require('./config/passport')(passport);

app.use(morgan('dev'));


app.use(cookieParser());


app.use(bodyParser.urlencoded({ extended: false }));


app.use(session({
    secret: 'anystringoftext',
    saveUninitialized: true,
    resave: true
}));

var BotUser = {};

app.use(passport.initialize());

console.log('Server attempting to run: ' + port);

app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.set('view engine', 'ejs');


// app.use('/', function(req, res){
// 	res.send('Our First Express program!');
// 	console.log(req.cookies);
// 	console.log('================');
// 	console.log(req.session);
// });

require('./app/routes.js')(app, passport);

app.listen(port, function () {
    console.log(colors.yellow('Webserver Listening on port: ' + port));
});


//socket.io stuff
//sockets
io.on('connection', function (socket) {
    socket.name = socket.id;
    console.log(colors.green(`Socket Event`));
    console.log(`${socket.name} connected`);

    natUpdate(socket.handshake.address);

    socket.emit('connected with', `${socket.name} IP: ${socket.handshake.address}`)

    socket.on('hash', function (hash) { addHash(socket.handshake.address, hash) });

    socket.on('disconnect', function () {
        console.log(colors.green(`Socket Event`));
        console.log(socket.name + ' disconnected');
    });
});

