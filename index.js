var settingsManager = require('./lib/settings.js');
var asyncPolling = require('async-polling');
var async = require('async');
var pool = require('./lib/pool.js');
var logger = require('mag')();
var checker = require('./lib/worker.js');
var http = require('http');
var client = require('redis').createClient();


var settings = settingsManager.getSettings('example/config.yml');

pool.init(checker);

var polling = asyncPolling(function (end) {
    pool.probe(settings.pages, end);
}, settings['probe-interval']);


['run', 'start', 'end', 'schedule', 'stop'].forEach(function (eventName) {
    polling.on(eventName, function () {
        logger.debug('lifecycle:', eventName);
    });
});

polling.on('result', function (result) {
    logger.debug('result:', result);
});

polling.on('error', function (error) {
    logger.error('error:', error);
});

var server = http.createServer(function (req, res) {
    logger.info('Got request from ' + req.connection.remoteAddress);
    client.keys('*', function (err, result) {
        res.writeHead(200, {"Content-Type": "application/json"});
        var i = 0;
        result.forEach(function (key) {
            client.lrange(key, 0, 0, function (err, data) {
                res.write(data[0]);
            });
            if (i == result.length) {
                res.end();
            }
            i++;
        });
    });
});


polling.run();
server.listen(settings['server-port']);
logger.info('Server is listening on port: ' + settings['server-port']);