define(function (require, exports, module) {/**
 * DevExtreme (core/utils/ready_callbacks.js)
 * Version: 18.1.6
 * Build date: Mon Sep 03 2018
 *
 * Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var domAdapter = require("../dom_adapter");
var injector = require("./dependency_injector");
var windowUtils = require("./window");
var callOnce = require("./call_once");
var callbacks = [];
var isReady = function() {
    return "complete" === domAdapter.getReadyState() || "loading" !== domAdapter.getReadyState() && !domAdapter.getDocumentElement().doScroll
};
var subscribeReady = callOnce(function() {
    var removeListener = domAdapter.listen(domAdapter.getDocument(), "DOMContentLoaded", function() {
        readyCallbacks.fire();
        removeListener()
    })
});
var readyCallbacks = {
    add: function(callback) {
        var hasWindow = windowUtils.hasWindow();
        if (hasWindow && isReady()) {
            callback()
        } else {
            callbacks.push(callback);
            hasWindow && subscribeReady()
        }
    },
    fire: function() {
        callbacks.forEach(function(callback) {
            callback()
        })
    }
};
module.exports = injector(readyCallbacks);

});
