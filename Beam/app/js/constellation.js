//requires
let util = require('util');
let events = require('events');
//let botConfig = require('./config.js');
//module
let obj = function(){
    const Carina = require('carina').Carina;
    const ws = require('ws');
    Carina.WebSocket = ws;
    const channelId = 582310;
    const ca = new Carina({ isBot: true }).open();
    let self = this;
    ca.subscribe(`channel:${channelId}:followed`, data => {
        self.emit('event', {type: 'followed', info: data});
    });
    ca.subscribe(`channel:${channelId}:hosted`, data => {
        self.emit('event', {type: 'hosted', info: data});
    });
    ca.subscribe(`channel:${channelId}:status`, data => {
        console.log(`status`);
        console.log(data);
        self.emit('event', {type: 'status', info: data});
    });
    ca.subscribe(`channel:${channelId}:subscribed`, data => {
        self.emit('event', {type: 'subscribed', info: data});
    });
    ca.subscribe(`channel:${channelId}:resubscribed`, data => {
        self.emit('event', {type: 'resubscribed', info: data});
    });
    ca.subscribe(`channel:${channelId}:update`, data => {
        console.log(`update`);
        console.log(data);
        self.emit('event', {type: 'update', info: data});
    });
    ca.subscribe(`interactive:${channelId}:connect`, data => {
        self.emit('event', {type: 'gameconnect', info: data});
    });
    
};
obj.prototype = new events.EventEmitter;
module.exports = obj;