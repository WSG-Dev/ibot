//requires
let util = require('util');
let events = require('events');
let botConfig = require('./config.js');
    const colors = require('colors');
//module
let twitter = function(searchstring) {
    //
    let self = this;
    //TWEETBOT
    let twit = require('twit');
    const colors = require('colors');
    let tBot = new twit(botConfig.twitter);
    let stream = tBot.stream('statuses/filter', { track: searchstring, language: 'en' });
    stream.on('tweet', function(tweet) {
        self.emit('tweet', tweet);
    });
    stream.on('error', function (error){
        self.emit('error', error);
    })
    //
    console.log(colors.yellow(`Twitterbot Loaded.`));
}
twitter.prototype = new events.EventEmitter;
module.exports = twitter;