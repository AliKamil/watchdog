'use strict';
var fs = require('fs'),
    yaml = require('js-yaml');
var settingsManager = function () {
};

settingsManager.getSettings = function () {
    try {
        return yaml.safeLoad(fs.readFileSync('./config.yml'));
    } catch (err) {
        throw (err);
    }
};

module.exports = settingsManager;