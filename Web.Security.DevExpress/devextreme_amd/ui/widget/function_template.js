define(function (require, exports, module) {/**
 * DevExtreme (ui/widget/function_template.js)
 * Version: 18.1.6
 * Build date: Mon Sep 03 2018
 *
 * Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var TemplateBase = require("./ui.template_base"),
    domUtils = require("../../core/utils/dom");
var FunctionTemplate = TemplateBase.inherit({
    ctor: function(render) {
        this._render = render
    },
    _renderCore: function(options) {
        return domUtils.normalizeTemplateElement(this._render(options))
    }
});
module.exports = FunctionTemplate;

});
