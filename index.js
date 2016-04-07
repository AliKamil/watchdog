var settingsManager = require('./settings.js');
var asyncPolling = require('async-polling');
var async = require('async');
var pool = require('./pool.js');
var logger = require('./logger.js');
var checker = require('./worker.js');
var http = require('http');
var client = require('./redisClient.js');
var settings = settingsManager.getSettings();

pool.init(checker);

var polling = asyncPolling(function (end) {
    pool.probe(settings.pages, end);
}, settings['probe-interval']);


['run', 'start', 'end', 'schedule', 'stop'].forEach(function (eventName) {
    polling.on(eventName, function () {
        console.log('lifecycle:', eventName);
    });
});

polling.on('result', function (result) {
    console.log('result:', result);
});

polling.on('error', function (error) {
    console.error('error:', error);
});

var server = http.createServer(function (req, res) {
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
server.listen(669);