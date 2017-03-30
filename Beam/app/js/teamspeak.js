//requires
let util = require('util');
let events = require('events');
let botConfig = require('./config.js');

var ts3bot = function(connectTo){
//
    let self = this;
    let who;
    let TeamSpeak = require('node-teamspeak-api');
    const colors = require('colors');
    let botid;
    var tsClient = new TeamSpeak(connectTo, 10011);
    //Subscribe to all 
    // tsClient.on('notify', function(eventName, resp) {
    //     console.log(`TS3 Event: ${eventName}`);
    // });
    tsClient.on('notify.cliententerview', function(resp, data) {
        //console.log(data.client_nickname);
        self.emit('join', data);
    });
    tsClient.on('notify.clientleftview', function(resp, data) {
        //console.log(data);
        self.emit('part', data);
    });
    tsClient.on('notify.textmessage', function(resp, data) {
        //console.log(`${data.invokername}: ${data.msg}`);
        
        self.emit('text', data);
    });

    //listen for clientlist
    tsClient.on('clientlist', function(err, resp) {
        if (err) {
                    self.emit('error', err);
                }
        // console.log(resp.data)
        who = resp.data;
        self.emit('who', who);
        for(key in resp.data){
            if(resp.data[key].client_database_id == 108){
                if(resp.data[key].client_type == 1){
                tsClient.send('clientmove', {clid: resp.data[key].clid, cid: 41}, function(err, resp, req) {});
                }
            }
        }
    });
    
    tsClient.api.login({
        client_login_name: botConfig.teamspeak.serverQueryUser,
        client_login_password: botConfig.teamspeak.serverQueryPass
    }, function(err, resp, req) {
        tsClient.api.use({
            sid: 1
        }, function(err, resp, req) {
        console.log(colors.yellow(`teamspeak connected`));            
        //tsClient.send('sendtextmessage', {targetmode:2, target:1, msg:`PAbot reloaded @ ${new Date(Date.now())}`}, function(err, resp, req) {});
            tsClient.send('servernotifyregister', {event: 'server'}, function(err, resp, req) {
                //console.log(resp);
                if (err) {
                    self.emit('error', err);
                }
            });
            tsClient.send('servernotifyregister', {event: 'textserver'}, function(err, resp, req) {
                //console.log(resp);
                if (err) {
                    self.emit('error', err);
                }
            });
            tsClient.send('servernotifyregister', {event: 'textchannel'}, function(err, resp, req) {
                //console.log(resp);
                if (err) {
                    self.emit('error', err);
                }

            });
            tsClient.send('servernotifyregister', {event: 'textprivate'}, function(err, resp, req) {
                //console.log(resp);
                if (err) {
                    self.emit('error', err);
                }
            });
            tsClient.api.clientlist();
            setInterval(tsClient.api.clientlist, 60000);
        });
    });

//
};
ts3bot.prototype = new events.EventEmitter;
module.exports = ts3bot;