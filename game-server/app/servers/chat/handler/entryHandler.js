/**
 * Created by lvnanzhen on 2017/7/12.
 */

module.exports = function (app) {
    return new Handler(app);
}

var Handler = function (app) {
    this.app = app;
}

Handler.prototype.send = function (msg, session, next) {
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