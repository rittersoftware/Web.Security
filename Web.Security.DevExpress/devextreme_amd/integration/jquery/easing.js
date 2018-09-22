define(function (require, exports, module) {/**
 * DevExtreme (integration/jquery/easing.js)
 * Version: 18.1.6
 * Build date: Mon Sep 03 2018
 *
 * Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var jQuery = require("jquery"),
    easing = require("../../animation/easing");
if (jQuery) {
    easing.setEasing(jQuery.easing)
}

});
