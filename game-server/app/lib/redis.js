/**
 * Created by lvnanzhen on 2017/7/12.
 */

var redis = require('redis');

module.exports = function (app, opts) {
    opts = opts || {};
    opts.host = opts.host || "127.0.0.1";
    opts.port = opts.port || 6379;

    var redisClient = redis.createClient(opts);

    redisClient.on('error', function (err) {
        console.log('redis error,err.stack:',err.stack)
    })

    return redisClient;
}