define(function (require, exports, module) {/**
 * DevExtreme (ui/toolbar/ui.toolbar.strategy.list_bottom.js)
 * Version: 18.1.6
 * Build date: Mon Sep 03 2018
 *
 * Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var ListStrategy = require("./ui.toolbar.strategy.list_base"),
    Swipeable = require("../../events/gesture/swipeable");
var ListBottomStrategy = ListStrategy.inherit({
    NAME: "listBottom",
    _renderWidget: function() {
        this._renderContainerSwipe();
        this.callBase();
        this._toolbar._$toolbarItemsContainer.prependTo(this._listOverlay.$content())
    },
    _renderContainerSwipe: function() {
        this._toolbar._createComponent(this._toolbar._$toolbarItemsContainer, Swipeable, {
            elastic: false,
            onStart: this._swipeStartHandler.bind(this),
            onUpdated: this._swipeUpdateHandler.bind(this),
            onEnd: this._swipeEndHandler.bind(this),
            itemSizeFunc: this._getListHeight.bind(this),
            direction: "vertical"
        })
    },
    _swipeStartHandler: function(e) {
        e.event.maxTopOffset = this._menuShown ? 0 : 1;
        e.event.maxBottomOffset = this._menuShown ? 1 : 0
    },
    _swipeUpdateHandler: function(e) {
        var offset = this._menuShown ? e.event.offset : 1 + e.event.offset;
        this._renderMenuPosition(offset, false)
    },
    _swipeEndHandler: function(e) {
        var targetOffset = e.event.targetOffset;
        targetOffset -= this._menuShown - 1;
        this._toggleMenu(0 === targetOffset, true)
    }
});
module.exports = ListBottomStrategy;

});
