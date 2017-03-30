//requires
let util = require('util');
let events = require('events');
let botConfig = require('./config.js');
//module
let beaminteractive = function() {
    //

    const Beam = require('beam-client-node');
    const Interactive = require('beam-interactive-node'); 
    const rjs = require('robotjs');
    const colors = require('colors');

    const channelId = botConfig.beam.connectTo;
    let self = this;
    const beam = new Beam();
    self.robot;
    self.holding = {};
    self.justMoved = false;

    beam.use('oauth', {
        tokens: {
            access: botConfig.beam.owneroauth,
            expires: Date.now() + (365 * 24 * 60 * 60 * 1000)
        },
    });

    beam.request('GET', `users/current`)
        .then(() => beam.game.join(channelId))
        .then(res => createRobot(res))
        .then(robot => performRobotHandShake(robot))
        .then(robot => setupRobotEvents(robot))
        .catch(error => {
            if (error.res) {
                self.emit('error', error.res.body.message);
            }
            self.emit('error', error);
        });

    function createRobot(res) {
        return new Interactive.Robot({
            remote: res.body.address,
            channel: channelId,
            key: res.body.key,
        });
    }

    function performRobotHandShake(robot) {
        return new Promise((resolve, reject) => {
            robot.handshake(err => {
                if (err) {
                    reject(err);
                    self.emit('error', err);
                }
                resolve(robot);
                console.log(colors.yellow(`Interactive Bot Connected`));
            });
        });
    }

    function setupRobotEvents(robot) { 
    self.robot = robot;
        robot.on('report', report => {
            let thisreport = this;
            for (key in report.tactile) {
                self.holding[report.tactile[key].id] = report.tactile[key].holding;
                // if (report.tactile[key].holding > 0) {
                //     //console.log(`button ${report.tactile[key].id} held: ${report.tactile[key].holding} users`);
                //     self.emit(`holding`, { id: report.tactile[key].id, amount: report.tactile[key].holding });
                // }
                if (report.tactile[key].pressFrequency > 0) {
                    //console.log(`button ${report.tactile[key].id} presses: ${report.tactile[key].pressFrequency} users`);
                    self.emit(`pressFrequency`, { id: report.tactile[key].id, amount: report.tactile[key].pressFrequency });
                }
                if (report.tactile[key].releaseFrequency > 0) {
                    //console.log(`button ${report.tactile[key].id} releases: ${report.tactile[key].releaseFrequency} users`);
                    self.emit(`releaseFrequency`, { id: report.tactile[key].id, amount: report.tactile[key].releaseFrequency });
                }
            }
        
        }); 
        robot.on('error', error => {
            self.emit('error', error);
        });
    }
//
}
beaminteractive.prototype = new events.EventEmitter;
module.exports = beaminteractive;