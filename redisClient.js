var client = require('redis').createClient(),
    logger = require('./logger.js');

client.on('error', function (error) {
    logger.error(error);
});
client.on('ready', function () {
    logger.success('redis db connected');
});

client.insert = function (key, value, callback) {
    var data = JSON.stringify(value);
    client.mset(key, data, callback);
};

client.find = function (key, callback) {
    client.get(key, function(err, data){
        var result = JSON.parse(data);
        callback(err, result);
    });
};

client.dropAll = function(callback) {
    client.flushall(callback);
};
client.exist = function (key, callback) {
    client.get(key, function (err, res) {
        if (err) {
            //console.log(err);
        }
        callback(res != null);
    });
};

module.exports = client;
