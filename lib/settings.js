'use strict';
var fs = require('fs'),
    yaml = require('js-yaml');
var settingsManager = function () {
};

settingsManager.getSettings = function (filename) {
    try {
        return yaml.safeLoad(fs.readFileSync(filename));
    } catch (err) {
        throw (err);
    }
};

module.exports = settingsManager;