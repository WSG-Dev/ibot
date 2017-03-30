let bigBang = new Date(Date.now());
//requires
let util = require('util');
let events = require('events');
let botConfig = require('./config.js');
const blacklist = function (terms) {
function diff_hours(dt2, dt1) 
 {

  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= (60 * 60);
  return Math.abs(Math.round(diff));
  
 }
let self = this;
    self.terms = terms;
    self.check = function(str){
        let t = false;
        for(key in self.terms){
            if(str.includes(self.terms[key]) == true){
                //console.log(`user: ${self.terms[key]} is blacklisted!`);
                t = true;
            };
        }
        return t;
    }
    self.isNew = function(user) {
        let now = new Date(Date.now());
        let baked = new Date(user.apidata.createdAt);
        let timediff = diff_hours(baked, now);
        if(timediff < 24){
            self.emit('newaccount', {'user': user, 'hours': timediff})
            return true;
        }
        console.log(`hours since creation: ${timediff}`);
        return false;
    }
}
blacklist.prototype = new events.EventEmitter;
module.exports = blacklist;
