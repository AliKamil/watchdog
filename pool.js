var async = require('async');


var Checker;
var pool = function () {
};

pool.init = function (checker) {
    Checker = checker;
};

pool.probe = function (sites, end) {
    async.each(sites, function (list) {
        console.log('checking:' + list.url);
        Checker.request(list);
    }, function () {
        console.log('async callback fired')
    });
    return end(null, 'some end');
};

module.exports = pool;