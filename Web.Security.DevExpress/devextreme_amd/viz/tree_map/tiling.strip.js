define(function (require, exports, module) {/**
 * DevExtreme (viz/tree_map/tiling.strip.js)
 * Version: 18.1.6
 * Build date: Mon Sep 03 2018
 *
 * Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var _squarify = require("./tiling.squarified.base");

function accumulate(total, current, count) {
    return ((count - 1) * total + current) / count
}

function strip(data) {
    return _squarify(data, accumulate, true)
}
require("./tiling").addAlgorithm("strip", strip);
module.exports = strip;

});
