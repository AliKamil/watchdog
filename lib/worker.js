process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
var http = require('http');
var https = require('https');
var Url = require('url');
var logger = require('mag')();
var XRegExp = require('xregexp');
var querystring = require('querystring');
var client = require('redis').createClient();

var worker = function () {
};

worker.request = function (data) {
    request(data);
};

var request = function (data) {
    var result = {};
    result.url = data.url;
    result.probe_time = new Date();
    var parsed = Url.parse(data.url);
    var module = getRequestFunction(parsed.protocol);
    if (module) {
        var req = module.request(parsed)
            .on('response', function (response) {
                var res = '';
                response.on('data', function (chunk) {
                    res += chunk;
                }).on('end', function () {
                    result.status = response.statusCode;
                    result.request_time = new Date() - result.probe_time;
                    if (res.length > 0) {
                        result.patterns = validateResponse(res, data.patterns);
                    }
                    logger.log(result);
                    client.lpush(data.url, JSON.stringify(result));
                });
            })
            .on('error', function (err) {
                result.status = 'error: ' + err.message;
                logger.warn(result);
                client.lpush(data.url, JSON.stringify(result));
            });
        req.end();
    }
};


var validateResponse = function (data, patterns) {
    var result = patterns.map(function (pattern) {
        var regexp = XRegExp(pattern);
        var result = {};
        result[pattern] = regexp.test(data);
        return result;
    });
    return result;

};

var getRequestFunction = function (protocol) {
    switch (protocol) {
        case 'http:':
            return http;
        case 'https:':
            return https;
        default:
            logger.warn('Protocol ' + protocol + ' not supported');
            return null;
    }
};

module.exports = worker;