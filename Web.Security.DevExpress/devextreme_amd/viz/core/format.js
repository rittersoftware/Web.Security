define(function (require, exports, module) {/**
 * DevExtreme (viz/core/format.js)
 * Version: 18.1.6
 * Build date: Mon Sep 03 2018
 *
 * Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _format = require("../../format_helper").format;
module.exports = function(value, options) {
    return _format(value, options.format, options.precision)
};

});
