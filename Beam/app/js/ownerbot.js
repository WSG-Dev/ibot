//requires
let util = require('util');
let events = require('events');
let botConfig = require('./config.js');
//module
let ownerbot = function() {
    //
    let chanID = botConfig.beam.connectTo;
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
            access: botConfig.beam.owneroauth,
            expires: Date.now() + (365 * 24 * 60 * 60 * 1000)
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
    function createChatSocket(userId, channelId, endpoints, authkey) {
        socket = new BeamSocket(endpoints).boot();
        return socket.auth(channelId, userId, authkey)
            .then(() => {
                socket.on('error', error => {
                    self.emit('error', error);
                });
               console.log(colors.yellow('Beam Chat Login'));
                //return socket.call('msg', [`reloaded at : ${new Date(Date.now())}`]);
            });
    }
    self.say = function(msg) {
            socket.call('msg', [`${msg}`]);
    }
        //
}
beamchat.prototype = new events.EventEmitter;
module.exports = beamchat;