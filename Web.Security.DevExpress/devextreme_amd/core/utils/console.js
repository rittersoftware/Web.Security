define(function (require, exports, module) {/**
 * DevExtreme (core/utils/console.js)
 * Version: 18.1.6
 * Build date: Mon Sep 03 2018
 *
 * Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var isFunction = require("./type").isFunction;
var noop = function() {};
var getConsoleMethod = function(method) {
    if ("undefined" === typeof console || !isFunction(console[method])) {
        return noop
    }
    return console[method].bind(console)
};
var logger = {
    info: getConsoleMethod("info"),
    warn: getConsoleMethod("warn"),
    error: getConsoleMethod("error")
};
var debug = function() {
    function assert(condition, message) {
        if (!condition) {
            throw new Error(message)
        }
    }

    function assertParam(parameter, message) {
        assert(null !== parameter && void 0 !== parameter, message)
    }
    return {
        assert: assert,
        assertParam: assertParam
    }
}();
exports.logger = logger;
exports.debug = debug;

});
