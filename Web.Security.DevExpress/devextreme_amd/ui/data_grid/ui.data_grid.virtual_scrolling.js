define(function (require, exports, module) {/**
 * DevExtreme (ui/data_grid/ui.data_grid.virtual_scrolling.js)
 * Version: 18.1.6
 * Build date: Mon Sep 03 2018
 *
 * Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var gridCore = require("./ui.data_grid.core"),
    dataSourceAdapter = require("./ui.data_grid.data_source_adapter"),
    virtualScrollingModule = require("../grid_core/ui.grid_core.virtual_scrolling");
gridCore.registerModule("virtualScrolling", virtualScrollingModule);
dataSourceAdapter.extend(virtualScrollingModule.extenders.dataSourceAdapter);

});
