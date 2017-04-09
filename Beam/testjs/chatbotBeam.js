
const bigBang = Date.now();

const beamchat = require('./app/js/beamchat.js');
const constellation = require('./app/js/constellation.js');

const colors = require('colors');


//var express = require('express');
//var app = express();
var port = process.env.PORT || 8081;

var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');

var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');

const path = require('path');

////const server = require('http').createServer(app);
//var app = require('express').createServer();
//var io = require('socket.io')(app);
////const io = require('socket.io')(server);
var express = require('express');
var app = express();
var server = require('http').createServer(app);
const io = require('socket.io')(server);
var fs = require('fs');

require('./config/passport')(passport);

app.use(morgan('dev'));


app.use(express.static(__dirname + '/wwwClient'));
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
    secret: 'anystringoftext',
    saveUninitialized: true,
    resave: true
}));


app.use(passport.initialize());

console.log('Server attempting to run: ' + port);

app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
//console.log(JSON.stringify(passport));


require('./app/routes.js')(app, passport);


server.listen(port, function () {
    console.log(colors.magenta('Webserver Listening on port: ' + port));
});

//console.log(passport.GetAuthData);
//socket.io stuff
//sockets
var connections = 0;
var isConnected = false;
io.on('connection', function (socket) {

   // console.log('Auth Token is ' + xd);
    connections = connections + 1;
    socket.name = socket.id;
    console.log(colors.magenta(`New Socket Event`));
    console.log(`${socket.name} connected`);
    console.log('connected ' + connections + ' times');
    console.log('connected with', `${socket.name} IP: ${socket.handshake.address}`)


    socket.on('disconnect', function () {
        console.log(colors.magenta(`New Socket Event`));
        console.log(socket.name + ' disconnected');
        socket.disconnect;
    });

    socket.on('message', function (message) {
        try {
                SendMessageToBeam(message);    
        } catch (error) {
         console.log('error in main');   
        }

    });


  /*  socket.on('authenticated', function (message) {
       // io.emit('authenticated' , message);
    });
    */
    if (!isConnected)
    {
        CreateBeamObjects(passport.BBBToken, null);
        console.log('connect to socket ' + connections + ' times');
    }


});

let bc = null;
let co = null;

function CreateBeamObjects(Token , message) {

    if (Token != null) {

        bc = new beamchat(passport.BBBToken);
        co = new constellation();
        isConnected = true;
        console.log('Authenticated To Beam');


          bc.on('ChatMessage', function (data) {
 
                console.log(colors.red(`ChatMessage`));

                console.log(`chanID: ${data.channel} [${data.user_roles[0]}] ${data.user_name} - Level 
                {
                    if(${data.user_level} == undefined){'No Level'}else {${data.user_level}}
                }`)

                let t = '';
                for (key in data.message.message) {

                    t += data.message.message[key].text;
                }

//                console.log('printing message');
               // console.log(t)

              //send message to client window
               io.emit('message', t);

                //try this here
                var splitTxt = '';
                for (key in data.message.message) { splitTxt += data.message.message[key].text; };
                var text = splitTxt.split(' ');
                if (text[0].substr(0, 1) == "!") {
                    if (data.user_roles[0] == 'Owner') {
                        console.log(`owner ran me.`)
                        switch (text[0]) {
                            case '!commands':
                                bc.say('The commands in this channel are: !ping , !shoryuken');
                                break;
                            case '!shoryuken':
                                //console.log('owner said shoryuken');
                                bc.say('That\'s a move right there!');
                                break;
                            case '!ping':
                                //console.log('owner said ping');
                                bc.say('PONG!');
                                break;
                            default:
                                break;
                        }
                    }
                    if (data.user_roles[0] == 'Mod') {
                        console.log(`Mod User`);
                    }
                    if (data.user_roles[0] == 'Pro') {
                        console.log(`Pro Users`);
                    }
                    if (data.user_roles[0] == 'User') {

                        switch (text[0]) {
                            case '!commands':
                                bc.say('The commands in this channel are: !ping , !shoryuken');
                                break;
                            case '!shoryuken':
                                console.log('user said shoryuken');
                                bc.say('That\'s a move right there!');
                                break;
                            case '!ping':
                                console.log('user said shoryuken');
                                bc.say('PONG!');
                                break;
                            default:
                                break;
                        }

                    }
                }
            });

co.on('event', function (data) {
    console.log(colors.green(data.type));
    //if(bl.isNew()){}
    switch (data.type) {
        case ('update'):
            io.emit('constupdate', data);
            break;
        case ('followed'):
           // console.log('A user has followed ' + JSON.stringify(data,null,2));
            if (data.info.following == true) {
               // if (bl.check(data.info.user.username) == false) {

                //    bc.say(`User ${data.info.user.username} Followed the Channel! `)
                    io.emit('followed', data);
                    FollowMessage();
/*            
            var httpnew = require('http'),
    fsnew = require('fs');
fsnew.readFile(__dirname + '/wwwClient/overlay.html', function (err, html) {
    if (err) {
        throw err; 
    }       
    httpnew.createServer(function(request, response) {  
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();  
    }).listen(8081);
});*/



              //  }
            }
            else {

               // bc.say(`User ${data.info.user.username} UnFollowed the Channel!`)
                io.emit('unfollowed', data);
            }
            break;
        case ('hosted'):
            if (data.info.hoster != null) { //user is hosting you
                console.log(data.info.hoster.token);
            }
            if (data.info.hostee != null) { //user is being hosted

            }
            //console.log(data.info); //hoster/hostee for possibles.
          //  if (bl.check(data.info.hoster.token) == false) {

                bc.say(`User ${data.info.hoster.token} hosted  the Channel! `);
                console.log(data.info.hoster.viewersCurrent);
                io.emit('hosted', data);
            
            //    }
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
    }

         else 
            {
            io.emit('authenticated', 'false');
            console.log('Not Authenticated');
            }

};


function SendMessageToBeam(message) {

    if (bc == null) {

        console.log('Bot not Authenticated');
    }
    else {

        bc.clienthtml(message);
    }
}

function FollowMessage(){

try {
    console.log('Attempting to show follow event');


    app.get('/overlay', function(req, res) {
        console.log('got response from overlay')
    res.render('overlays/overlay.ejs');
});

    
} catch (error) {
    console.log(error);
}




}