var config = {
    log: {
        enable: true
    }
};
var colors = require('colors');
var logger = function () {
};

logger.prototype.prepareMessage = function () {
    var args = Array.prototype.slice.call(arguments);
    return args.join();
};

logger.prototype.log = function () {
    if (config.log.enable) {
        var message = this.prepareMessage.apply(this, arguments);
        console.log(message);
    }
};

logger.prototype.warn = function () {
    if (config.log.enable) {
        var message = this.prepareMessage.apply(this, arguments);
        console.warn(message.yellow);
    }
};

logger.prototype.error = function () {
    if (config.log.enable) {
        var message = this.prepareMessage.apply(this, arguments);
        console.error(message.red);
    }
};

logger.prototype.success = function () {
    if (config.log.enable) {
        var message = this.prepareMessage.apply(this, arguments);
        console.log(message.green);
    }
};

module.exports = new logger();

