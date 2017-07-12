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
