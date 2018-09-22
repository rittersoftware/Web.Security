define(function (require, exports, module) {/**
 * DevExtreme (core/memorized_callbacks.js)
 * Version: 18.1.6
 * Build date: Mon Sep 03 2018
 *
 * Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var each = require("../core/utils/iterator").each,
    Callbacks = require("./utils/callbacks");
var MemorizedCallbacks = function() {
    var memory = [];
    var callbacks = Callbacks();
    this.add = function(fn) {
        each(memory, function(_, item) {
            fn.apply(fn, item)
        });
        callbacks.add(fn)
    };
    this.remove = function(fn) {
        callbacks.remove(fn)
    };
    this.fire = function() {
        memory.push(arguments);
        callbacks.fire.apply(callbacks, arguments)
    }
};
module.exports = MemorizedCallbacks;

});
