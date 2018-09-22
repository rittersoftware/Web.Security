define(function (require, exports, module) {/**
 * DevExtreme (ui/grid_core/ui.grid_core.context_menu.js)
 * Version: 18.1.6
 * Build date: Mon Sep 03 2018
 *
 * Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var $ = require("../../core/renderer"),
    getPublicElement = require("../../core/utils/dom").getPublicElement,
    noop = require("../../core/utils/common").noop,
    each = require("../../core/utils/iterator").each,
    modules = require("./ui.grid_core.modules"),
    ContextMenu = require("../context_menu");
var CONTEXT_MENU = "dx-context-menu",
    viewName = {
        columnHeadersView: "header",
        rowsView: "content",
        footerView: "footer",
        headerPanel: "headerPanel"
    },
    VIEW_NAMES = ["columnHeadersView", "rowsView", "footerView", "headerPanel"];
var ContextMenuController = modules.ViewController.inherit({
    init: function() {
        this.createAction("onContextMenuPreparing")
    },
    getContextMenuItems: function(dxEvent) {
        if (!dxEvent) {
            return false
        }
        var view, options, rowIndex, columnIndex, rowOptions, $element, $targetRowElement, $targetCellElement, menuItems, that = this,
            $targetElement = $(dxEvent.target);
        each(VIEW_NAMES, function() {
            view = that.getView(this);
            $element = view && view.element();
            if ($element && ($element.is($targetElement) || $element.find($targetElement).length)) {
                $targetCellElement = $targetElement.closest("td");
                $targetRowElement = $targetCellElement.closest(".dx-row");
                rowIndex = view.getRowIndex($targetRowElement);
                columnIndex = $targetCellElement[0] && $targetCellElement[0].cellIndex;
                rowOptions = $targetRowElement.data("options");
                options = {
                    event: dxEvent,
                    targetElement: getPublicElement($targetElement),
                    target: viewName[this],
                    rowIndex: rowIndex,
                    row: view._getRows()[rowIndex],
                    columnIndex: columnIndex,
                    column: rowOptions && rowOptions.cells[columnIndex].column
                };
                options.items = view.getContextMenuItems && view.getContextMenuItems(options);
                that.executeAction("onContextMenuPreparing", options);
                that._contextMenuPrepared(options);
                menuItems = options.items;
                if (menuItems) {
                    return false
                }
            }
        });
        return menuItems
    },
    _contextMenuPrepared: noop
});
var ContextMenuView = modules.View.inherit({
    _renderCore: function() {
        var that = this;
        this._createComponent(that.element().addClass(CONTEXT_MENU), ContextMenu, {
            onPositioning: function(actionArgs) {
                var event = actionArgs.event,
                    contextMenuInstance = actionArgs.component,
                    items = that.getController("contextMenu").getContextMenuItems(event);
                if (items) {
                    contextMenuInstance.option("items", items);
                    event.stopPropagation()
                } else {
                    actionArgs.cancel = true
                }
            },
            onItemClick: function(params) {
                params.itemData.onItemClick && params.itemData.onItemClick(params)
            },
            cssClass: that.getWidgetContainerClass(),
            target: that.component.$element()
        })
    }
});
module.exports = {
    defaultOptions: function() {
        return {
            onContextMenuPreparing: null
        }
    },
    controllers: {
        contextMenu: ContextMenuController
    },
    views: {
        contextMenuView: ContextMenuView
    }
};

});
