var colors = require('colors');
var logger = function () {
};
var levels = [
    'debug',
    'info',
    'warn',
    'error',
    'fatal'
];

logger.prototype.verbosityLevel = 'debug';

logger.prototype.setVerbosity = function (level) {
    if (levels.indexOf(level) == -1) {
        throw new Error('Incorrect verbosity level!');
        return;
    }
    this.verbosityLevel = level;
};


logger.prototype.prepareMessage = function () {
    var args = Array.prototype.slice.call(arguments);
    return args.join(':');
};


logger.prototype.log = function (level) {
    if (levels.indexOf(level) >= levels.indexOf(this.verbosityLevel)) {
        var args = Array.prototype.slice.call(arguments);
        var message = this.prepareMessage.apply(this, args.slice(1));
        console.log(message);
    }
};

logger.prototype.info = function () {
    this.log('info', arguments);
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

