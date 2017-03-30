//oh god here we go.
////requires
let util = require('util');
let events = require('events');
let botConfig = require('./config.js');
let radio = function (){
//LIVE RADIO REQUEST IMPLIMENTATION FOR SAM RADIO and ICECAST.
var http = require('http');
const host = botConfig.radio.host;
const requestport = botConfig.radio.port;
let self = this;
//
self.request = function(songid){
    let url = `http://${host}:${requestport}/req/?songID=${songid}&host=${host}`
    //console.log(url);
    http.get(url, res => {
        console.log(res.statusMessage);
        console.log(res.statusMessage);
        self.emit('request', res.statusMessage);
    }); 
}

}
radio.prototype = new events.EventEmitter;
module.exports = radio;