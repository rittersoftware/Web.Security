define(function (require, exports, module) {/**
 * DevExtreme (ui/data_grid/ui.data_grid.editing.js)
 * Version: 18.1.6
 * Build date: Mon Sep 03 2018
 *
 * Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
require("./ui.data_grid.editor_factory");
var gridCore = require("./ui.data_grid.core"),
    editingModule = require("../grid_core/ui.grid_core.editing");
gridCore.registerModule("editing", editingModule);

});
