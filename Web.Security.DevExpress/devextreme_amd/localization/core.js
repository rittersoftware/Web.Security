define(function (require, exports, module) {/**
 * DevExtreme (localization/core.js)
 * Version: 18.1.6
 * Build date: Mon Sep 03 2018
 *
 * Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var dependencyInjector = require("../core/utils/dependency_injector");
module.exports = dependencyInjector({
    locale: function() {
        var currentLocale = "en";
        return function(locale) {
            if (!locale) {
                return currentLocale
            }
            currentLocale = locale
        }
    }()
});

});
