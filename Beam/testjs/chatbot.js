
const BeamClient = require('beam-client-node');
const BeamSocket = require('beam-client-node/lib/ws');
var play = require('play');

let userInfo;

const client = new BeamClient();

// With OAuth we don't need to login, the OAuth Provider will attach
// the required information to all of our requests after this call.
client.use('oauth', {
    tokens: {
        access: 'NG0LKAXLN1cLu5d03QhMKN6aXFQGPzPiwlbLVbBtzlP0EaBh2ED3DTSeHT0T80PX',
        expires: Date.now() + (365 * 24 * 60 * 60 * 1000)
    },
});

// Get's the user we have access to with the token
client.request('GET', `users/current`)
.then(response => {
    userInfo = response.body;
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
function createChatSocket(userId, channelId, endpoints, authkey) {
    // Chat connection
    const socket = new BeamSocket(endpoints).boot();

    // Greet a joined user
    socket.on('UserJoin', data => {
        socket.call('msg', [`Hi ${data.username}! I'm pingbot! Write !ping and I will pong back!`]);
    });

    // React to our !pong command
    socket.on('ChatMessage', data => {
        if (data.message.message[0].data.toLowerCase().startsWith('!ping')) {
            socket.call('msg', [`@${data.user_name} PONG!`]);
            console.log(`Ponged ${data.user_name}`);

        }

        if (!data.message.message[0].data.toLowerCase().startsWith('!'))
        {
            console.log(data.message.message[0].data);
        }
    });

    // Handle errors
    socket.on('error', error => {
        console.error('Socket error', error);
    });

    return socket.auth(channelId, userId, authkey)
    .then(() => {
        console.log('Login successful');
        return socket.call('msg', ['Hi! I\'m pingbot! Write !ping and I will pong back!']);
    });
}





//// play with a callback
//play.sound('./wavs/sfx/intro.wav', function(){

//    // these are all "fire and forget", no callback
//    play.sound('./wavs/sfx/alarm.wav');
//    play.sound('./wavs/sfx/crinkle.wav');
//    play.sound('./wavs/sfx/flush.wav');
//    play.sound('./wavs/sfx/ding.wav');

//});

////If you want to know when the player has defintely started playing
//play.on('play', function (valid) {
//    console.log('I just started playing!');
//});
//play.sound('./wavs/sfx/ding.wav');

////If you want to know if this can't play for some reason
//play.on('error', function () {
//    console.log('I can\'t play!');
//});


