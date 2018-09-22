define(function (require, exports, module) {/**
 * DevExtreme (ui/filter_builder/ui.filter_operations_dictionary.js)
 * Version: 18.1.6
 * Build date: Mon Sep 03 2018
 *
 * Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var OPERATION_ICONS = {
        "=": "equal",
        "<>": "notequal",
        "<": "less",
        "<=": "lessorequal",
        ">": "greater",
        ">=": "greaterorequal",
        notcontains: "doesnotcontain",
        contains: "contains",
        startswith: "startswith",
        endswith: "endswith",
        isblank: "isblank",
        isnotblank: "isnotblank"
    },
    OPERATION_NAME = {
        "=": "equal",
        "<>": "notEqual",
        "<": "lessThan",
        "<=": "lessThanOrEqual",
        ">": "greaterThan",
        ">=": "greaterThanOrEqual",
        startswith: "startsWith",
        contains: "contains",
        notcontains: "notContains",
        endswith: "endsWith",
        isblank: "isBlank",
        isnotblank: "isNotBlank",
        between: "between"
    };
module.exports = {
    getIconByFilterOperation: function(filterOperation) {
        return OPERATION_ICONS[filterOperation]
    },
    getNameByFilterOperation: function(filterOperation) {
        return OPERATION_NAME[filterOperation]
    }
};

});
