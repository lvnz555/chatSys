var pomelo  = require('pomelo');
var fs      = require('fs')
var path    = require('path')
var routeUtil   = require('./app/util/routeUtil')
/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'chatSys');

// app configuration
app.configure('production|development', 'connector|chat', function(){
    if(app.settings.serverType === 'connector'){
        app.route('chat', routeUtil.chat);
        app.set('connectorConfig', {
            connector : pomelo.connectors.hybridconnector
        });
    }
    app.set('onlineConfig', {
        host : '120.77.202.64',
        port : 6379,
        db : 0
    })
    app.set('roomConfig', {
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
