define(function (require, exports, module) {/**
 * DevExtreme (viz/funnel/tiling.js)
 * Version: 18.1.6
 * Build date: Mon Sep 03 2018
 *
 * Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _normalizeEnum = require("../core/utils").normalizeEnum,
    algorithms = {},
    defaultAlgorithm;
exports.getAlgorithm = function(name) {
    return algorithms[_normalizeEnum(name)] || defaultAlgorithm
};
exports.addAlgorithm = function(name, callback, setDefault) {
    algorithms[name] = callback;
    if (setDefault) {
        defaultAlgorithm = algorithms[name]
    }
};

});
