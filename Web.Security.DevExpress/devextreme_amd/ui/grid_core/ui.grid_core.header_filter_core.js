define(function (require, exports, module) {/**
 * DevExtreme (ui/grid_core/ui.grid_core.header_filter_core.js)
 * Version: 18.1.6
 * Build date: Mon Sep 03 2018
 *
 * Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var $ = require("../../core/renderer"),
    modules = require("./ui.grid_core.modules"),
    gridCoreUtils = require("./ui.grid_core.utils"),
    isDefined = require("../../core/utils/type").isDefined,
    isFunction = require("../../core/utils/type").isFunction,
    each = require("../../core/utils/iterator").each,
    extend = require("../../core/utils/extend").extend,
    eventsEngine = require("../../events/core/events_engine"),
    Popup = require("../popup"),
    TreeView = require("../tree_view"),
    List = require("../list");
var HEADER_FILTER_CLASS = "dx-header-filter",
    HEADER_FILTER_MENU_CLASS = "dx-header-filter-menu";
var DEFAULT_SEARCH_EXPRESSION = "text";

function resetChildrenItemSelection(items) {
    items = items || [];
    for (var i = 0; i < items.length; i++) {
        items[i].selected = false;
        resetChildrenItemSelection(items[i].items)
    }
}

function updateSelectAllState(e, filterValues) {
    if (e.component.option("searchValue")) {
        return
    }
    var selectAllCheckBox = $(e.element).find(".dx-list-select-all-checkbox").data("dxCheckBox");
    if (selectAllCheckBox && filterValues && filterValues.length) {
        selectAllCheckBox.option("value", void 0)
    }
}

function isSearchEnabled(that, options) {
    var headerFilter = options.headerFilter;
    if (headerFilter && isDefined(headerFilter.allowSearch)) {
        return headerFilter.allowSearch
    }
    return that.option("headerFilter.allowSearch")
}
exports.updateHeaderFilterItemSelectionState = function(item, filterValuesMatch, isExcludeFilter) {
    if (filterValuesMatch ^ isExcludeFilter) {
        item.selected = true;
        if (isExcludeFilter && item.items) {
            for (var j = 0; j < item.items.length; j++) {
                if (!item.items[j].selected) {
                    item.selected = void 0;
                    break
                }
            }
        }
    } else {
        if (isExcludeFilter || item.selected) {
            item.selected = false;
            resetChildrenItemSelection(item.items)
        }
    }
};
exports.HeaderFilterView = modules.View.inherit({
    getPopupContainer: function() {
        return this._popupContainer
    },
    getListContainer: function() {
        return this._listContainer
    },
    applyHeaderFilter: function(options) {
        var that = this,
            list = that.getListContainer(),
            isSelectAll = !list.option("searchValue") && !options.isFilterBuilder && list.$element().find(".dx-checkbox").eq(0).hasClass("dx-checkbox-checked"),
            filterValues = [];
        var fillSelectedItemKeys = function fillSelectedItemKeys(filterValues, items, isExclude) {
            each(items, function(_, item) {
                if (void 0 !== item.selected && !!item.selected ^ isExclude) {
                    if (!list.option("searchValue") || !item.items || !item.items.length) {
                        filterValues.push(item.value);
                        return
                    }
                }
                if (item.items && item.items.length) {
                    fillSelectedItemKeys(filterValues, item.items, isExclude)
                }
            })
        };
        if (!isSelectAll) {
            if ("tree" === options.type) {
                fillSelectedItemKeys(filterValues, list.option("items"), "exclude" === options.filterType);
                options.filterValues = filterValues
            }
        } else {
            if (Array.isArray(options.filterValues)) {
                options.filterValues = []
            }
        }
        if (options.filterValues && !options.filterValues.length) {
            options.filterValues = null
        }
        options.apply();
        that.hideHeaderFilterMenu()
    },
    showHeaderFilterMenu: function($columnElement, options) {
        var popupContainer, that = this;
        if (options) {
            that._initializePopupContainer(options);
            popupContainer = that.getPopupContainer();
            that.hideHeaderFilterMenu();
            that.updatePopup($columnElement, options);
            popupContainer.show()
        }
    },
    hideHeaderFilterMenu: function() {
        var headerFilterMenu = this.getPopupContainer();
        headerFilterMenu && headerFilterMenu.hide()
    },
    updatePopup: function($element, options) {
        var that = this,
            alignment = "right" === options.alignment ? "left" : "right";
        if (that._popupContainer) {
            that._cleanPopupContent();
            that._popupContainer.option("position", {
                my: alignment + " top",
                at: alignment + " bottom",
                of: $element,
                collision: "flip fit"
            })
        }
    },
    _getSearchExpr: function(options) {
        var lookup = options.lookup,
            useDefaultSearchExpr = options.useDefaultSearchExpr,
            headerFilterDataSource = options.headerFilter && options.headerFilter.dataSource;
        if (useDefaultSearchExpr || isDefined(headerFilterDataSource) && !isFunction(headerFilterDataSource)) {
            return DEFAULT_SEARCH_EXPRESSION
        }
        if (lookup) {
            return lookup.displayExpr || "this"
        }
        if (options.dataSource) {
            var group = options.dataSource.group;
            if (Array.isArray(group) && group.length > 0) {
                return group[0].selector
            } else {
                if (isFunction(group)) {
                    return group
                }
            }
        }
        return options.dataField || options.selector
    },
    _cleanPopupContent: function() {
        this._popupContainer && this._popupContainer.$content().empty()
    },
    _initializePopupContainer: function(options) {
        var that = this,
            $element = that.element(),
            headerFilterOptions = that.option("headerFilter"),
            width = options.headerFilter && options.headerFilter.width || headerFilterOptions && headerFilterOptions.width,
            height = options.headerFilter && options.headerFilter.height || headerFilterOptions && headerFilterOptions.height,
            dxPopupOptions = {
                width: width,
                height: height,
                visible: false,
                shading: false,
                showTitle: false,
                showCloseButton: false,
                closeOnTargetScroll: true,
                dragEnabled: false,
                closeOnOutsideClick: true,
                focusStateEnabled: false,
                toolbarItems: [{
                    toolbar: "bottom",
                    location: "after",
                    widget: "dxButton",
                    options: {
                        text: headerFilterOptions.texts.ok,
                        onClick: function() {
                            that.applyHeaderFilter(options)
                        }
                    }
                }, {
                    toolbar: "bottom",
                    location: "after",
                    widget: "dxButton",
                    options: {
                        text: headerFilterOptions.texts.cancel,
                        onClick: function() {
                            that.hideHeaderFilterMenu()
                        }
                    }
                }],
                resizeEnabled: true,
                onShowing: function(e) {
                    e.component.$content().parent().addClass("dx-dropdowneditor-overlay");
                    that._initializeListContainer(options);
                    options.onShowing && options.onShowing(e)
                },
                onShown: function(e) {
                    eventsEngine.trigger(e.component.$content().find(".dx-checkbox").first(), "focus")
                },
                onHidden: options.onHidden,
                onInitialized: function(e) {
                    var component = e.component;
                    component.option("animation", component._getDefaultOptions().animation)
                }
            };
        if (!isDefined(that._popupContainer)) {
            that._popupContainer = that._createComponent($element, Popup, dxPopupOptions)
        } else {
            that._popupContainer.option(dxPopupOptions)
        }
    },
    _initializeListContainer: function(options) {
        var that = this,
            $content = that._popupContainer.$content(),
            widgetOptions = {
                searchEnabled: isSearchEnabled(that, options),
                searchTimeout: that.option("headerFilter.searchTimeout"),
                searchMode: options.headerFilter && options.headerFilter.searchMode || "",
                dataSource: options.dataSource,
                onContentReady: function() {
                    that.renderCompleted.fire()
                },
                itemTemplate: function(data, _, element) {
                    var $element = $(element);
                    if (options.encodeHtml) {
                        return $element.text(data.text)
                    }
                    return $element.html(data.text)
                }
            };
        if ("tree" === options.type) {
            that._listContainer = that._createComponent($("<div>").appendTo($content), TreeView, extend(widgetOptions, {
                showCheckBoxesMode: options.isFilterBuilder ? "normal" : "selectAll",
                keyExpr: "id"
            }))
        } else {
            that._listContainer = that._createComponent($("<div>").appendTo($content), List, extend(widgetOptions, {
                searchExpr: that._getSearchExpr(options),
                pageLoadMode: "scrollBottom",
                showSelectionControls: true,
                selectionMode: options.isFilterBuilder ? "multiple" : "all",
                onSelectionChanged: function(e) {
                    var items = e.component.option("items"),
                        selectedItems = e.component.option("selectedItems");
                    if (!e.component._selectedItemsUpdating && !e.component.option("searchValue") && !options.isFilterBuilder) {
                        if (0 === selectedItems.length && items.length && (!options.filterValues || options.filterValues.length <= 1)) {
                            options.filterType = "include";
                            options.filterValues = []
                        } else {
                            if (selectedItems.length === items.length) {
                                options.filterType = "exclude";
                                options.filterValues = []
                            }
                        }
                    }
                    each(items, function(index, item) {
                        var filterValueIndex, selected = gridCoreUtils.getIndexByKey(item, selectedItems, null) >= 0,
                            oldSelected = !!item.selected;
                        if (oldSelected !== selected) {
                            item.selected = selected;
                            options.filterValues = options.filterValues || [];
                            filterValueIndex = gridCoreUtils.getIndexByKey(item.value, options.filterValues, null);
                            if (filterValueIndex >= 0) {
                                options.filterValues.splice(filterValueIndex, 1)
                            }
                            if (selected ^ "exclude" === options.filterType) {
                                options.filterValues.push(item.value)
                            }
                        }
                    });
                    updateSelectAllState(e, options.filterValues)
                },
                onContentReady: function(e) {
                    var component = e.component,
                        items = component.option("items"),
                        selectedItems = [];
                    each(items, function() {
                        if (this.selected) {
                            selectedItems.push(this)
                        }
                    });
                    component._selectedItemsUpdating = true;
                    component.option("selectedItems", selectedItems);
                    component._selectedItemsUpdating = false;
                    updateSelectAllState(e, options.filterValues)
                }
            }))
        }
    },
    _renderCore: function() {
        this.element().addClass(HEADER_FILTER_MENU_CLASS)
    }
});
var allowHeaderFiltering = exports.allowHeaderFiltering = function(column) {
    return isDefined(column.allowHeaderFiltering) ? column.allowHeaderFiltering : column.allowFiltering
};
exports.headerFilterMixin = {
    _applyColumnState: function(options) {
        var $headerFilterIndicator, rootElement = options.rootElement,
            column = options.column;
        if ("headerFilter" === options.name) {
            rootElement.find("." + HEADER_FILTER_CLASS).remove();
            if (allowHeaderFiltering(column)) {
                $headerFilterIndicator = this.callBase(options).toggleClass("dx-header-filter-empty", this._isHeaderFilterEmpty(column))
            }
            return $headerFilterIndicator
        }
        return this.callBase(options)
    },
    _isHeaderFilterEmpty: function(column) {
        return !column.filterValues || !column.filterValues.length
    },
    _getIndicatorClassName: function(name) {
        if ("headerFilter" === name) {
            return HEADER_FILTER_CLASS
        }
        return this.callBase(name)
    },
    _renderIndicator: function(options) {
        var rtlEnabled, $container = options.container,
            $indicator = options.indicator;
        if ("headerFilter" === options.name) {
            rtlEnabled = this.option("rtlEnabled");
            if ($container.children().length && (!rtlEnabled && "right" === options.columnAlignment || rtlEnabled && "left" === options.columnAlignment)) {
                $container.prepend($indicator);
                return
            }
        }
        this.callBase(options)
    },
    optionChanged: function(args) {
        if ("headerFilter" === args.name) {
            this._invalidate();
            args.handled = true
        } else {
            this.callBase(args)
        }
    }
};

});
