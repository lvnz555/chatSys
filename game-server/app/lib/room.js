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

    this.key = '__room__'

    this.redisClient = redis.createClient(opts);

    this.redisClient.on('error', function (err) {
        console.log('redis error,err.stack:',err.stack)
    })
};

Component.prototype.name = '__room__';

Component.prototype.in = function (rid, sid) {
    return new Promise(function (resolve, reject) {
        if(typeof rid !== 'object'){
            let tm = {};
            tm[rid] = sid;
            rid = tm;
        }
        this.redisClient.hmset(this.key, rid, function (err, reply) {
            if(err){
                return reject(err);
            }
            return resolve(reply);
        })
    })
}

Component.prototype.out = function (rid) {
    return new Promise(function (resolve, reject) {
        this.redisClient.hdel(this.key, rid, function (err, reply) {
            if(err){
                return reject(err);
            }
            return resolve(reply);
        })
    })
}

Component.prototype.getServerIdByrid = function (rid) {
    return new Promise(function (resolve, reject) {
        this.redisClient.hget(this.key, rid, function (err, reply) {
            if(err){
                return reject(err);
            }
            return resolve(reply && reply[rid]);
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