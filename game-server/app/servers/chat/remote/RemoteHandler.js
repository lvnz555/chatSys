/**
 * Created by lvnanzhen on 2017/7/13.
 */

module.exports = function (app) {
    return new Handler(app)
}

var Handler = function (app) {
    this.app = app;
    this.channelService = app.get('channelService');
}

Handler.prototype.add = function (uid, sid, room, flag, cb) {

    let channel = this.channelService.getChannel(room, flag);

    if(!!channel){
        channel.add(uid, sid)
    }

    let param = {
        route : 'onAdd',
        uid : uid
    }

    let users = channel.getMembers();

    channel.pushMessage(param);

    cb({users})
}

Handler.prototype.leave = function (uid, sid, room, flag, cb) {

    let channel = this.channelService.getChannel(room, false);

    if(!!channel){
        channel.leave(uid, sid)
    }

    let param = {
        route : 'onAdd',
        uid : uid
    }

    channel.pushMessage(param);

    cb();
}