define(function (require, exports, module) {/**
 * DevExtreme (mobile/process_hardware_back_button.js)
 * Version: 18.1.6
 * Build date: Mon Sep 03 2018
 *
 * Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var hardwareBack = require("../core/utils/callbacks")();
module.exports = function() {
    hardwareBack.fire()
};
module.exports.processCallback = hardwareBack;
module.exports.default = module.exports;

});
