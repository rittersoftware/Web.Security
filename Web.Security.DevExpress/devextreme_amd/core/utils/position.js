define(function (require, exports, module) {/**
 * DevExtreme (core/utils/position.js)
 * Version: 18.1.6
 * Build date: Mon Sep 03 2018
 *
 * Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var config = require("../config");
var getDefaultAlignment = function(isRtlEnabled) {
    var rtlEnabled = isRtlEnabled || config().rtlEnabled;
    return rtlEnabled ? "right" : "left"
};
exports.getDefaultAlignment = getDefaultAlignment;

});
