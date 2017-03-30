//beam bot by madkiwi
const bigBang = Date.now();
//
const beamchat = require('./js/beamchat.js');
const beaminteractive = require('./js/beaminteractive.js');
const Packets = require('beam-interactive-node/dist/robot/packets').default;
const twitterbot = require('./js/twitterbot.js');
const teamspeakapi = require('./js/teamspeak.js');
const constellation = require('./js/constellation.js');
const radio = require('./js/radio.js');
const blacklist = require('./js/blacklist.js');
const botConfig = require('./js/config.js');
const mongoose = require('mongoose');
const colors = require('colors');
//


// Viewers... if you are OCD about your code... thats fine...
// I am not... if you see a logic flaw or piece of code you could do easier,
// please suggest it, but do so in a non-forceful manner.
// and do not be offended if i do not wish to use it THIS VERY MOMENT.
// Thankyou... 


///
// BLACKLIST. ( user bl.check(term) to return if the term is banned. then if true, perform ban/timerout ect. )
///

// add to blacklist table in db ??
let blTerms = [
        'beambot',
        'cici',
        'fuck'// because i shouldnt have to do this guys, wtf you're adults....
];

//
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser'); //COOOKIES!! NOM
const bodyParser = require('body-parser');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const webport = 80;
const port = process.env.PORT || webport;
//
let bc = new beamchat();
let bi = new beaminteractive();
let co = new constellation();
let bl = new blacklist(blTerms);

//HTTP
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + '/www/'));
server.listen(port, function () {
    console.log(colors.yellow('Webserver Listening on port: ' + webport));
});

//sockets
io.on('connection', function (socket) {
    socket.name = socket.id;
    console.log(colors.green(`Socket Event`));
    console.log(`${socket.name} connected`);
    natUpdate(socket.handshake.address);
    socket.emit('connected', `${socket.name} using IP: ${socket.handshake.address}`)
    socket.on('hash', function (hash) { addHash(socket.handshake.address, hash) });
    socket.on('disconnect', function () {
        console.log(colors.green(`Socket Event`));
        console.log(socket.name + ' disconnected');
    });
});

io.on('message', function (socket) {
    socket.name = socket.id;
    console.log(colors.green(`Socket Event`));
    console.log(`${socket.name} connected`);
    natUpdate(socket.handshake.address);
    socket.emit('connected', `${socket.name} using IP: ${socket.handshake.address}`)
    socket.on('hash', function (hash) { addHash(socket.handshake.address, hash) });
    socket.on('disconnect', function () {
        console.log(colors.green(`Socket Event`));
        console.log(socket.name + ' disconnected');
    });
});


bc.on('UserJoin', function (data) {
    console.log(colors.green(`Chatjoin`));
    console.log(`${data.id} [${data.roles[0]}] ${data.username}`);
    io.emit('beamjoin', data);
});
bc.on('UserLeave', function (data) {
    console.log(colors.green(`Chatleave`));
    console.log(`${data.id} [${data.roles[0]}] ${data.username}`);
    io.emit('beampart', data);
});
bc.on('ChatMessage', function (data) {
    console.log(colors.green(`ChatMessage`));
    console.log(`chanID: ${data.channel} [${data.user_roles[0]}] ${data.user_name} - Level ${data.user_level}`)
    let t = '';
    for (key in data.message.message) {
        t += data.message.message[key].text;
    }
    console.log(t);
   
    parsechat(data);

    logchat(Date.now(), data);//emit to webpage at the bottom of parsechat()
});



co.on('event', function (data) {
    console.log(colors.green(data.type));
    //if(bl.isNew()){}
    switch (data.type) {
        case ('followed'):
            //console.log(data.info);
            if (data.info.following == true) {
                if (bl.check(data.info.user.username) == false) {
                    bc.say(`User ${data.info.user.username} Followed the Channel! `)
                    io.emit('followed', data);
                }
            }
            else {
                //bc.say(`User ${data.info.user.username} UnFollowed the Channel! Fugging Dick....`)
                //io.emit('unfollowed', data);
            }
            break;
        case ('hosted'):
            if (data.info.hoster != null) { //user is hosting you
                console.log(data.info.hoster.token);
            }
            if (data.info.hostee != null) { //user is being hosted

            }
            //console.log(data.info); //hoster/hostee for possibles.
            if (bl.check(data.info.hoster.token) == false) {
                bc.say(`User ${data.info.hoster.token} hosted  the Channel! `);
                console.log(data.info.hoster.viewersCurrent);
                io.emit('hosted', data);
            }
            break;
        case ('subscribed'):
            console.log(data.info);
            io.emit('subscribed', data);
            break;
        case ('resubscribed'):
            console.log(data.info);
            io.emit('resubscribed', data);
            break;
        default://dont trigger anything.
            console.log(data.info);
            break;
    }
});

//functions

function parseChat(d) {
    //    
    let data = d;
    var tmptxt = '';
    for (key in data.message.message) { tmptxt += data.message.message[key].text; };
    var cmd = tmptxt.split(' ');// 1st word = cmd[0] 2nd word = cmd[1] etc etc
    if (cmd[0].substr(0, 1) == "!") {
        if (data.user_roles[0] == 'Owner') {
            console.log(`owner ran me.`)
            switch (cmd[0]) {
                // if user_roles[0] == pro run command fred
                // if user_roles[0] == user  cant run command fred
                case '!aardvark': //idle
                    bc.say(`I completely agree ${data.user_name}! AAAARRRRDVARRRRK!}!!!`);
                    break;
                case '!llama': //idle
                    bc.say('llama llama ding dong');
                    break;
                default: //should not be called EVER.
            }
        }
        if (data.user_roles[0] == 'Mod') {
            console.log(`a mod ran me.`)
        }
        if (data.user_roles[0] == 'Pro') {
            if (bl.check(data.user_name) == false) {
                console.log(`a pro user ran me.`)
            }
        }
        if (data.user_roles[0] == 'User') {
            if (bl.check(data.user_name) == false) {
                switch (cmd[0]) {
                    case '!aardvark': //idle
                        bc.say(`I completely agree ${data.user_name}! AAAARRRRDVARRRRK!}!!!`);
                        break;
                    case '!llama': //idle
                        bc.say('llama llama ding dong');
                        break;
                }
            }
        }
    }

};

function natUpdate(nat) {
    //console.log(`ip:`)
    //console.log(nat)    
};
function addHash(nat, hash) {
    console.log(`checking token`)
    let h = hash.substr(1),
    token = h.substr(h.indexOf('access_token='))
                  .split('&')[0]
                  .split('=')[1];
    if (token) {

        const Beam = require('beam-client-node');
        let client = new Beam();
        client.use('oauth', {
            tokens: {
                access: token,
                expires: Date.now() + (365 * 24 * 60 * 60 * 1000)
            },
        })
        client.request('GET', 'users/current', {}).then(res => {
            //console.log(res.body)
            console.log(`Found user [${res.body.id}]${res.body.username} , saving to IP: ${nat}`);
        })
        .catch(error => {
            console.log('Something went wrong:', error);
        });

        //
        //
    }
};



//errors
bc.on('error', function (error) {
    console.log(`chat`)
    errorReport(error);
});
bi.on('error', function (error) {
    console.log(`interactive`)
    errorReport(error);
    bi = new beaminteractive();
});

function errorReport(error) {
    console.error(error);
};