
const BeamClient = require('beam-client-node');
const BeamSocket = require('beam-client-node/lib/ws');

let userInfo;

const client = new BeamClient();


//var fs = require('fs')
//    , passport = require('passport')
//    , express = require('express')
//    , app = express()
//    , server = require('http').createServer(app)
//    , io = require('socket.io')(server);
//;



//// , socket = require('socket.io');
//var BEAM_CLIENT_ID = 'd5cc5e3c8e1a9439c35e39296446e71065734ffd83f4e0f9';
//var BEAM_CLIENT_SECRET = '4dcc98af15dea891b787c9bb222c7f6ead3400a254305152c848b67f956b07ee'

//app.use(express.static(__dirname + '/bower_components'));

//app.get('/', function (req, res, next) {
//    res.sendFile(path.join(__dirname + '/index.html'));
//    //__dirname : It will resolve to your project folder.
//});

//app.get('/about', function (req, res) {
//    res.sendFile(path.join(__dirname + '/about.html'));
//});

//app.get('/sitemap', function (req, res) {
//    res.sendFile(path.join(__dirname + '/sitemap.html'));
//});

////var BeamStrategy = require('passport-beam').Strategy;

////    passport.use(new BeamStrategy({
////        clientID: BEAM_CLIENT_ID,
////        clientSecret: BEAM_CLIENT_SECRET,
////        callbackURL: "http://localhost:8001/auth/beam/callback"
////    },
////    function (accessToken, refreshToken, profile, done) {
////        User.findOrCreate({ beamId: profile.id }, function (err, user) {
////            return done(err, user);
////        });
////    }));

////app.get('/auth/beam',
////  passport.authenticate('beam'));

////app.get('/auth/beam/callback',
////  passport.authenticate('beam', { failureRedirect: '/login' }),
////  function (req, res) {
////      // Successful authentication, redirect home.
////      res.redirect('/');
////  });

//server.listen(8001);

// Socket.io server listens to our app


// app.js
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var passport = require('passport');
//var play = require('play').Play();

app.use(express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/'));

app.get('/', function (req, res, next) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/play', function (req, res, next) {
    res.sendFile(__dirname + '/play.html');
});

server.listen(8001);

//var events = require('events');
//var myEmitter = new events.EventEmitter();

//myEmitter.on('message', function (a) {

//});


// Emit welcome message on connection
io.on('connection', function (socket) {
    // Use socket to communicate with this particular client only, sending it it's own id
    socket.emit('welcome', { message: 'Welcome!', id: socket.id });

    socket.on('message', function (message) {
        console.log('Message Received from client: ', message);
      //  socket.broadcast.emit('message', message);
        //emits message to beam
        //socket.emit(message);
        sendMessageToBeamFromApp("[BOT]: " + message);
    });
});

var oauth;

// With OAuth we don't need to login, the OAuth Provider will attach
// the required information to all of our requests after this call.
client.use('oauth', {
    tokens: {
        access: 'NG0LKAXLN1cLu5d03QhMKN6aXFQGPzPiwlbLVbBtzlP0EaBh2ED3DTSeHT0T80PX',
       // access: '3oiNfwUX50Eu6oRR',
        expires: Date.now() + (365 * 24 * 60 * 60 * 1000)
    },
});

// Get's the user we have access to with the token
client.request('GET', `users/current`)
.then(response => {
    userInfo = response.body;
    console.log(response.body.channel.id);
    console.log(userInfo.id);
    return client.chat.join(response.body.channel.id);
})
.then(response => {
    const body = response.body;



    return createChatSocket(userInfo.id, userInfo.channel.id, body.endpoints, body.authkey);
})
.catch(error => {
    console.log('Something went wrong:', error);
});

/**
 * Creates a beam chat socket and sets up listeners to various chat events.
 * @param {any} userId The user to authenticate as
 * @param {any} channelId The channel id to join
 * @param {any} endpoints An endpoints array from a beam.chat.join call.
 * @param {any} authkey An authentication key from a beam.chat.join call.
 * @returns {Promise.<>}
 */

var socketBeamServer;

function sendMessageToBeamFromApp(message) {
    console.log('Sending Message to Beam: ', message);
    socketBeamServer.call('msg', [message]);
   // sendMessage(message);
}

function createChatSocket(userId, channelId, endpoints, authkey) {
    // Chat connection
    const socketBeam = new BeamSocket(endpoints).boot();
    socketBeamServer = socketBeam;
    // Greet a joined user
    socketBeam.on('UserJoin', data => {

        //cound users joined channel 
    });

    // React to our !pong command
    socketBeam.on('ChatMessage', data => {
        if (data.message.message[0].data.toLowerCase().startsWith('!ping')) {1
            socketBeam.call('msg', [`@${data.user_name} PONG!`]);
            console.log(`Ponged ${data.user_name}`);
        }

        if (!data.message.message[0].data.toLowerCase().startsWith('!'))
        {
            var message = data.user_name + ' [Beam] ' + " - " + data.message.message[0].data;
            //  console.log("Beam message: " + data.message.message[0].data);
            io.emit('message', message);

            //play.sound('./wavs/sfx/intro.wav', function () {

            //    // these are all "fire and forget", no callback
            //    play.sound('./wavs/sfx/alarm.wav');
            //    play.sound('./wavs/sfx/crinkle.wav');
            //    play.sound('./wavs/sfx/flush.wav');
            //    play.sound('./wavs/sfx/ding.wav');

            //});

        }
    });

    // Handle errors
    socketBeam.on('error', error => {
        console.error('Socket error', error);
    });

    return socketBeam.auth(channelId, userId, authkey)
    .then(() => {
        console.log('Login successful');
        return socketBeam.call('msg', ['Hi! I\'m pingbot! Write !ping and I will pong back!']);
    });
}







////If you want to know when the player has defintely started playing
//play.on('play', function (valid) {
//    console.log('I just started playing!');
//});


////If you want to know if this can't play for some reason
//play.on('error', function () {
//    console.log('I can\'t play!');
//});


