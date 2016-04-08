var async = require('async');
var logger = require('mag')();
var Checker;
var pool = function () {
};

pool.init = function (checker) {
    Checker = checker;
};

pool.probe = function (sites, end) {
    async.each(sites, function (list) {
        logger.debug('checking:' + list.url);
        Checker.request(list);
    });
    return end();
};

module.exports = pool;