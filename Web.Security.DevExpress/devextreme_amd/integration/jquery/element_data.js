define(function (require, exports, module) {/**
 * DevExtreme (integration/jquery/element_data.js)
 * Version: 18.1.6
 * Build date: Mon Sep 03 2018
 *
 * Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var jQuery = require("jquery");
var dataUtils = require("../../core/element_data");
var useJQuery = require("./use_jquery")();
if (useJQuery) {
    dataUtils.setDataStrategy(jQuery)
}

});
