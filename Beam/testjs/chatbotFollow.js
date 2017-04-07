
const BeamClient = require('beam-client-node');
const BeamSocket = require('beam-client-node/lib/ws');

let userInfo;

const client = new BeamClient();


// app.js
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
//var play = require('play').Play();

const Carina = require('carina').Carina;
const ws = require('ws');
Carina.WebSocket = ws;



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
}

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

////If you want to know when the player has defintely started playing
//play.on('play', function (valid) {
//    console.log('I just started playing!');
//});

////If you want to know if this can't play for some reason
//play.on('error', function () {
//    console.log('I cant play!');
//});

var oauth;

// With OAuth we don't need to login, the OAuth Provider will attach
// the required information to all of our requests after this call.
client.use('oauth', {
    tokens: {
        access: 'NG0LKAXLN1cLu5d03QhMKN6aXFQGPzPiwlbLVbBtzlP0EaBh2ED3DTSeHT0T80PX',
        expires: Date.now() + (365 * 24 * 60 * 60 * 1000)
    },
});

var channelId;

// Get's the user we have access to with the token
client.request('GET', `users/current`)
.then(response => {

    userInfo = response.body;



    channelId = response.body.channel.id

   console.log(channelId); 
    return client.chat.join(response.body.channel.id);
})
.then(response => {
    const body = response.body;
    //console.log(response.body);
    return createChatSocket(userInfo.id, userInfo.channel.id, body.endpoints, body.authkey);
    return null;
})
.catch(error => {
    console.log('Something went wrong:', error);
});

//// Get's the user we have access to with the token
//client.request('GET', `chat:${channelId}`)
//.then(response => {

//    userInfo = response.body;

//   // channelId = response.body.channel.id
//    return client.chat.join(channelId);
//})
//.then(response => {
//    const body = response.body;
//    console.log(response.body);
//    return null;
//   // return createChatSocket(userInfo.id, userInfo.channel.id, body.endpoints, body.authkey);
//})
//.catch(error => {
//    console.log('Something went wrong:', error);
//});

/**
 * Creates a beam chat socket and sets up listeners to various chat events.
 * @param {any} userId The user to authenticate as
 * @param {any} channelId The channel id to join
 * @param {any} endpoints An endpoints array from a beam.chat.join call.
 * @param {any} authkey An authentication key from a beam.chat.join call.
 * @returns {Promise.<>}
 */

var socketBeamServer;

const ca = new Carina({ isBot: true }).open();
let self = this;

console.log('subscribing');
ca.subscribe(`user:${channelId}:followed`, data => {
    self.emit('event', {type: 'followed', info: data});
});

ca.subscribe(`channel:${channelId}:hosted`, data => {
    console.log(`hosted`);
    console.log(data);
    self.emit('event', { type: 'hosted', info: data });
});

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







