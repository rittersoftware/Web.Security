define(function (require, exports, module) {/**
 * DevExtreme (integration/angular/action_executors.js)
 * Version: 18.1.6
 * Build date: Mon Sep 03 2018
 *
 * Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var Action = require("../../core/action");
Action.registerExecutor({
    ngExpression: {
        execute: function(e) {
            if ("string" === typeof e.action) {
                e.context.$eval(e.action)
            }
        }
    }
});

});
