/**
 * Created by lvnanzhen on 2017/7/12.
 */

module.exports = function (app) {
    return new Handler(app);
}

var Handler = function (app) {
    this.app = app;
    this.channelService = app.get('channelService');
}

Handler.prototype.sendToRoom = function (msg, session, next) {
    let uid = session.uid;
    let channelService = this.app.get('channelService');

    let channel = channelService.getChannel(msg.target, false);
    if(!channel){
        return;
    }
    let param = {
        route: 'onChat',
        msg: msg.content,
        from: uid,
        target: msg.target
    }

    channel.pushMessage(param);

    next(null, {
        route : msg.route
    })
}

Handler.prototype.sendToPerson = function (msg, session, next) {
    let uid = session.uid;
    let channelService = this.app.get('channelService');
    let ol = this.app.components.__online__;

    let channel = channelService.getChannel(msg.target, false);
    if(!channel){
        return;
    }
    let param = {
        route: 'onChat',
        msg: msg.content,
        from: uid,
        target: msg.target
    }

    ol.isConnect(uid).then(function (ServerId) {
        if(ServerId){
            channel.sendMessageByUid(param,[{
                    sid:ServerId,
                    uid:uid
                }]
            );
        }

        next(null, {
            route : msg.route
        })
    });
}

Handler.prototype.addRoom = function (msg, session, next) {
    let roomId = msg.room;
    let uid = session.uid;

    let ol = this.components.__online__;
    let room = this.components.__room__;

    let channel = this.channelService.getChannel(roomId, true);

    let param = {
        route : 'onAdd',
        uid : uid
    }

    channel.pushMessage(param);

    if(!!channel){
        ol.isConnect(uid).then(function (sid) {
            channel.add(uid, sid)
        })
    }

    room.in(roomId, this.app.getServerId());

    next(null,{code : 200, route : msg.route})
}

Handler.prototype.leaveRoom = function (msg, session, next) {
    let roomId = msg.room;
    let uid = session.uid;

    let ol = this.components.__online__;
    let channel = this.channelService.getChannel(roomId, false);

    if(!!channel){
        ol.isConnect(uid).then(function (sid) {
            channel.leave(uid, sid)
        })
    }

    let param = {
        route : 'onLeave',
        uid : uid
    }

    channel.pushMessage(param);

    next(null,{code : 200, route : msg.route})
}

Handler.prototype.getRoomMember = function (msg, session, next) {
    let roomId = msg.room;

    let channel = this.channelService.getChannel(roomId, false);

    if(!!channel){
        var users = channel.getMembers();
        return next(null, {
            users
        })
    }

    next(null, {});
}