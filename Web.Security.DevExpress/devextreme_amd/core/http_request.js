define(function (require, exports, module) {/**
 * DevExtreme (core/http_request.js)
 * Version: 18.1.6
 * Build date: Mon Sep 03 2018
 *
 * Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var windowUtils = require("./utils/window");
var window = windowUtils.getWindow();
var injector = require("./utils/dependency_injector");
var nativeXMLHttpRequest = {
    getXhr: function() {
        return new window.XMLHttpRequest
    }
};
module.exports = injector(nativeXMLHttpRequest);

});
