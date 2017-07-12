var pomelo  = require('pomelo');
var fs      = require('fs')
var path    = require('path')
/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'chatSys');

// app configuration
app.configure('production|development', 'connector', function(){
  app.set('connectorConfig',
    {
      connector : pomelo.connectors.hybridconnector,
      heartbeat : 3,
      useDict : true,
      useProtobuf : true
    });
  app.set('redisConfig', {
      host : '120.77.202.64',
      port : 6379,
      db : 0
  })
});

fs.readdirSync(__dirname + '/app/lib').forEach(function (filename) {
    if (!/\.js$/.test(filename)) {
        return;
    }
    var name = path.basename(filename, '.js');
    var _load = require('./app/lib/' + name);

    app.load(_load, app.get(name+'Config'))
});


// start app
app.start();

process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});
