var bigBang = new Date(Date.now());
//
//console.log('Began at :'+ bigBang);

// if(window.location.hash){
//
var socket = io(); // Socket.io
var ls = localStorage; //local broswer storage variable.
var mc = document.getElementById('mainContent');
//let jukebox = document.getElementById("jukebox");
//let soundObj = function (name, loc, vol){
//    jukebox.src = loc;
//    jukebox.volume = vol;
//    jukebox.play();
//}
//let vidbox = document.getElementById("vidbox");
//vidbox.onended = function(){
//    vidbox.src = '';
//};
//let videoObj = function (name, loc, vol){
//    vidbox.src = loc;
//    vidbox.volume = vol;
//    vidbox.play();
//}

socket.on('connected', function(socketname) {
    console.log(`you are connected as socket: ${socketname}.`);
    if(window.location.hash){ socket.emit('hash', window.location.hash); }
});
    

    socket.on('beamchatline', function(data) {
        //new chatobjectProto(data);
        chatDB.push(new chatobjectProto(data));
        UpdateEngine();
        console.log('beamchatline');
        console.log(data);
    });
    socket.on('beamjoin', function(data) {
        console.log('beamjoin');
        console.log(data);
    });
    socket.on('beampart', function(data) {
        console.log('beampart');
        console.log(data);
    });
  
    socket.on('followed', function(data) {
        console.log('followed');
        console.log(data);
        //gamelist[data.info.id] = new gameObj("Followed", data.info.user.username, data.info.user.avatarUrl, data.info.id, data.info);
    });
    socket.on('unfollowed', function(data) {
        console.log('unfollowed');
        console.log(data);
        //gamelist[data.info.id] = new gameObj("UnFollowed", data.info.user.username, data.info.user.avatarUrl, data.info.id, data.info);
    });
    socket.on('hosted', function(data) {
        console.log('hosted');// hoster (hosting you) hostee (you hosting)
        console.log(data);
        //gamelist[data.info.id] = new gameObj("Hosted", data.info.user.username, data.info.user.avatarUrl, data.info.id, data.info);
    });
    socket.on('subscribed', function(data) {
        console.log('subscribed');
        console.log(data);
        //gamelist[data.info.id] = new gameObj("Hosted", data.info.user.username, data.info.user.avatarUrl, data.info.id, data.info);
    });
    socket.on('resubscribed', function(data) {
        console.log('resubscribed');
        console.log(data);
        //gamelist[data.info.id] = new gameObj("Hosted", data.info.user.username, data.info.user.avatarUrl, data.info.id, data.info);
    });

    //button events
    //socket.on('sound', function(name) {
    //    switch(name){
    //        case 'honk':
    //        soundObj(name, 'media/sounds/honk.mp3', 0.5)// name, location of file, volume from 0 <> 1. 0.5 being 50%
    //        break;
    //        default://
    //    }
    //});
    //socket.on('video', function(name) {
    //    switch(name){
    //        case 'effyou':
    //        videoObj(name, 'media/videos/effyou.mp4', 1)//a video example.
    //        break;
    //        default://
    //    }
    //});
    //socket.on('image', function(name) {
    //    console.log(name);
    //    switch(name){
    //        case 'poop':
    //        //new notificationProto('image', `<img src='media/img/poop.jpg' />`);
    //        break;
    //        default://
    //    }
    //});

//var chatIndex = 0;
var chatDB = [];
var chatobjectProto = function(data) {
    //chatDB[chatIndex] = this;
    //this.id = chatIndex;
    this.io = data;
    this.data = data;
    this.starttime = Date.now();
    //chatIndex++; //make ID unavailable.
};
chatobjectProto.prototype.update = function(id) {
        var tmpd = Date.now() - this.starttime;
        var t = '';
        for (var i = 0; i < this.io.data.message.message.length; i++) {
            t += this.io.data.message.message[i].text;
        };
        if (this.io.apidata.avatarUrl != null) {
            mc.innerHTML += '<div id="nametag" class="' + this.io.data.user_roles[0] + '"><img src="' + this.io.apidata.avatarUrl + '" width="20px" />' + this.io.data.user_name + ' - Level ' + this.io.data.user_level + ' ' + this.io.data.user_roles[0] + '</div><div id="'+id+'" class="chattxt"></div>';
            let chattxt = document.getElementById(id);
            chattxt.innerText += ''+t+'';
        } else {
            mc.innerHTML += '<div id="nametag" class="' + this.io.data.user_roles[0] + '">' + this.io.data.user_name + ' - Level ' + this.io.data.user_level + ' ' + this.io.data.user_roles[0] + '</div><div id="'+id+'" class="chattxt"></div>';
            let chattxt = document.getElementById(id);
            chattxt.innerText += ''+t+'';
        }
};
let UpdateEngine = function() {
    mc.innerHTML = '';
    if(chatDB.length > 8){
        //console.log(`over number`);
        chatDB.shift(); 
    }
    for (var i = 0;i< chatDB.length; i++) {
        chatDB[i].update(i);
    }
    window.scrollTo(0, document.body.scrollHeight);
};

