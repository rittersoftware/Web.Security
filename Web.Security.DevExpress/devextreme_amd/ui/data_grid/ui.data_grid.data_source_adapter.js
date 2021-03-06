define(function (require, exports, module) {/**
 * DevExtreme (ui/data_grid/ui.data_grid.data_source_adapter.js)
 * Version: 18.1.6
 * Build date: Mon Sep 03 2018
 *
 * Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var DataSourceAdapter = require("../grid_core/ui.grid_core.data_source_adapter");
module.exports = {
    extend: function(extender) {
        DataSourceAdapter = DataSourceAdapter.inherit(extender)
    },
    create: function(component) {
        return new DataSourceAdapter(component)
    }
};

});
