//requires
let util = require('util');
let events = require('events');
let botConfig = require('./config.js');
var request = require('request');
//module
let beamchat = function (authToken) {
    //

    if (authToken) {


        console.log('accessing beam chat js ' + authToken);

        let chanID = 582310;
        const BeamClient = require('beam-client-node');
        const BeamSocket = require('beam-client-node/lib/ws');
        const colors = require('colors');

        let userInfo;
        let self = this;
        const client = new BeamClient();
        let socket;

        // With OAuth we don't need to login, the OAuth Provider will attach
        // the required information to all of our requests after this call.
        client.use('oauth', {
            tokens: {
                //access: botConfig.beam.ownerchatoauth,
                //access: botConfig.beam.botoauth,
                access: authToken
                , expires: Date.now() + (365 * 24 * 60 * 60 * 1000)
            },
        });

        // Get's the user we have access to with the token
        client.request('GET', `users/current`)
            .then(response => {
                userInfo = response.body;

                return client.chat.join(chanID);
            })
            .then(response => {
                const body = response.body;
                console.log('User ' + userInfo.id + ' has joined channel ' + chanID);
                // console.log(body)
                // return createChatSocket(userInfo.id, chanID, body.endpoints, body.authkey);
                return createChatSocket(userInfo.id, chanID, body.endpoints, body.authkey);

            })
            .catch(error => {
                self.emit('error', error);
            });






        /**
         * Creates a beam chat socket and sets up listeners to various chat events.
         * @param {any} userId The user to authenticate as
         * @param {any} channelId The channel id to join
         * @param {any} endpoints An endpoints array from a beam.chat.join call.
         * @param {any} authkey An authentication key from a beam.chat.join call.
         * @returns {Promise.<>}
    
    
         */

      //  var messagessent = 0;
        function createChatSocket(userId, channelId, endpoints, authkey) {

            if (userId == null) {

            }

            socket = new BeamSocket(endpoints).boot();

            console.log('accessing beam chat socket js');

            socket.on('UserJoin', data => {
                self.emit('UserJoin', data);
         
            });
            socket.on('UserLeave', data => {
                self.emit('UserLeave', data);
            });
            socket.on('ChatMessage', data => {
               // messagessent = messagessent + 1;
                //console.log('Message Sent from Beam ' + messagessent + ' times');
               
               try {
                   self.emit('ChatMessage', data);          
               } catch (error) {
                   console.log('error sending to beam' + error);
               }

            });
            socket.on('error', error => {
                self.emit('error', error);
            });
            socket.on('PollStart', data => {
                self.emit('PollStart', data);
            });
            socket.on('PollEnd', data => {
                self.emit('PollEnd', data);
            });
            socket.on('PurgeMessage', data => {
                self.emit('PurgeMessage', data);
            });
            socket.on('DeleteMessage', data => {
                self.emit('DeleteMessage', data);
            });
            socket.on('ClearMessages', data => {
                self.emit('ClearMessages', data);
            });
            socket.on('UserUpdate', data => {
                self.emit('UserUpdate', data);
            });







            return socket.auth(channelId, userId, authkey)
                .then(() => {
                    console.log('accessing logged in');
                    console.log(colors.yellow('Beam Chat Login'));


                    //change user to mod

/*Found it
So, you need the channel:update:self scope to use this endpoint
PATCH /channels/{channelId}/users/{userId}
{channelId} is the channel id of the token. {userId} Is the user id of the user you want to mod
Then you send it as a application/json header with this payload:
{"add": ["Mod"]}
Remember the token in the header*/

//
/*582310 channelId
862913 userId*/

var channelId = 582310;
var userId = 949494;


try {

// only mods can make other users mod and mod must be higher rank than user
//, owner is only exception
                        client.request('PATCH', `channels/${channelId}/users/${userId}`,
                        {
                            body: {
                                "add": ["Mod"]
                            }
                        })
                        .then(response => {

                            console.log('No error');
                            console.log(response.body.details);
                            return (response);
                        })
                        .catch(error => {
                            console.log(error);
                        });
    
} catch (error) {

    console.log('catch handler' + error);
    
}

                }

                );
        }
        self.say = function (msg) {
            socket.call('msg', [`${msg}`]);

        }
        self.poll = function (q, a, t) {
            socket.call('vote:start', [q, a, t]);
        }

        self.clienthtml = function (msg) {
                try {
                    socket.call('msg', [`${msg}`]); 
                } catch (error) {
                    console.log('error in beamchat.js self.clienthtml' + error)
                }

        }

    }        //
}
beamchat.prototype = new events.EventEmitter;
module.exports = beamchat;