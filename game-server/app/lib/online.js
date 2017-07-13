/**
 * Created by lvnanzhen on 2017/7/12.
 */

var redis = require('redis');

module.exports = function (app, opts) {
    opts = opts || {};
    opts.host = opts.host || "127.0.0.1";
    opts.port = opts.port || 6379;

    return new Component(app, opts);
}

var Component = function(app, opts) {
    this.app = app;
    this.opts = opts;

    this.key = '__online__'

    this.redisClient = redis.createClient(opts);

    this.redisClient.on('error', function (err) {
        console.log('redis error,err.stack:',err.stack)
    })
};

Component.prototype.name = '__online__';

Component.prototype.connect = function (uid, sid) {
    return new Promise(function (resolve, reject) {
        if(typeof uid !== 'object'){
            let tm = {};
            tm[uid] = sid;
            uid = tm;
        }
        this.redisClient.hmset(this.key, uid, function (err, reply) {
            if(err){
                return reject(err);
            }
            return resolve(reply);
        })
    })
}

Component.prototype.disconnect = function (uid) {
    return new Promise(function (resolve, reject) {
        this.redisClient.hdel(this.key, uid, function (err, reply) {
            if(err){
                return reject(err);
            }
            return resolve(reply);
        })
    })
}

Component.prototype.isConnect = function (uid) {
    return new Promise(function (resolve, reject) {
        this.redisClient.hget(this.key, uid, function (err, reply) {
            if(err){
                return reject(err);
            }
            return resolve(reply && reply[uid]);
        })
    })
}

Component.prototype.getALL = function () {
    return new Promise(function (resolve, reject) {
        this.redisClient.hgetall(this.key, function (err, reply) {
            if(err){
                return reject(err);
            }
            return resolve(reply);
        })
    })
}