var stream = function () {
};

stream.write = function (data) {
    console.log('stream: ' + data);
};

module.exports = stream;