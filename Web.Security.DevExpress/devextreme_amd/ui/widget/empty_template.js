define(function (require, exports, module) {/**
 * DevExtreme (ui/widget/empty_template.js)
 * Version: 18.1.6
 * Build date: Mon Sep 03 2018
 *
 * Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var $ = require("../../core/renderer"),
    TemplateBase = require("./ui.template_base");
var EmptyTemplate = TemplateBase.inherit({
    _renderCore: function() {
        return $()
    }
});
module.exports = EmptyTemplate;

});
