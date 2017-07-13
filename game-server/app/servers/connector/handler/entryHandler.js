module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
};

/**
 * New client entry.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */

Handler.prototype.entry = function (msg, session, next) {
	var ol = this.app.components.__online__;
	let uid = msg.uid;

	session.bind(uid);

    ol.connect(uid, this.app.getServerId());

    session.on('closed', onUserLeave.bind(null, this.app))

	next(null, {code:200, res:true})
}

/**
 * get room list.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */

Handler.prototype.roomList = function (msg, session, next) {
    var room = this.app.components.__room__;

    room.getAll().then(function (list) {
        list = list.map(function (obj) {
            return Object.keys(obj)[0];
        })

        next(null, {code:200, list:list})
    })
}

/**
 * User log out handler
 *
 * @param {Object} app current application
 * @param {Object} session current session object
 *
 */
var onUserLeave = function(app, session) {
    if(!session || !session.uid) {
        return;
    }
    var ol = app.components.__online__;

    ol.disconnect(session.uid);
};
