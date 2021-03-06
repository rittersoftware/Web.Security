define(function (require, exports, module) {/**
 * DevExtreme (integration/jquery/element.js)
 * Version: 18.1.6
 * Build date: Mon Sep 03 2018
 *
 * Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var setPublicElementWrapper = require("../../core/utils/dom").setPublicElementWrapper;
var useJQuery = require("./use_jquery")();
var getPublicElement = function($element) {
    return $element
};
if (useJQuery) {
    setPublicElementWrapper(getPublicElement)
}

});
