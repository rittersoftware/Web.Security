define(function (require, exports, module) {/**
 * DevExtreme (ui/tab_panel.js)
 * Version: 18.1.6
 * Build date: Mon Sep 03 2018
 *
 * Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var $ = require("../core/renderer"),
    support = require("../core/utils/support"),
    extend = require("../core/utils/extend").extend,
    devices = require("../core/devices"),
    registerComponent = require("../core/component_registrator"),
    MultiView = require("./multi_view"),
    Tabs = require("./tabs"),
    iconUtils = require("../core/utils/icon"),
    getPublicElement = require("../core/utils/dom").getPublicElement,
    BindableTemplate = require("./widget/bindable_template"),
    windowUtils = require("../core/utils/window");
var TABPANEL_CLASS = "dx-tabpanel",
    TABPANEL_TABS_CLASS = "dx-tabpanel-tabs",
    TABPANEL_CONTAINER_CLASS = "dx-tabpanel-container",
    TABS_ITEM_TEXT_CLASS = "dx-tab-text";
var TabPanel = MultiView.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            itemTitleTemplate: "title",
            hoverStateEnabled: true,
            showNavButtons: false,
            scrollByContent: true,
            scrollingEnabled: true,
            onTitleClick: null,
            onTitleHold: null,
            onTitleRendered: null
        })
    },
    _defaultOptionsRules: function() {
        return this.callBase().concat([{
            device: function() {
                return "desktop" === devices.real().deviceType && !devices.isSimulator()
            },
            options: {
                focusStateEnabled: true
            }
        }, {
            device: function() {
                return !support.touch
            },
            options: {
                swipeEnabled: false
            }
        }, {
            device: {
                platform: "generic"
            },
            options: {
                animationEnabled: false
            }
        }])
    },
    _init: function() {
        this.callBase();
        this.$element().addClass(TABPANEL_CLASS);
        this.setAria("role", "tabpanel")
    },
    _initMarkup: function() {
        this.callBase();
        this._createTitleActions();
        this._renderLayout()
    },
    _initTemplates: function() {
        this.callBase();
        this._defaultTemplates.title = new BindableTemplate(function($container, data) {
            $container.text(data.title || String(data));
            var $iconElement = iconUtils.getImageContainer(data.icon);
            $container.wrapInner($("<span>").addClass(TABS_ITEM_TEXT_CLASS));
            $iconElement && $iconElement.prependTo($container)
        }, ["title", "html", "icon"], this.option("integrationOptions.watchMethod"))
    },
    _createTitleActions: function() {
        this._createTitleClickAction();
        this._createTitleHoldAction();
        this._createTitleRenderedAction()
    },
    _createTitleClickAction: function() {
        this._titleClickAction = this._createActionByOption("onTitleClick")
    },
    _createTitleHoldAction: function() {
        this._titleHoldAction = this._createActionByOption("onTitleHold")
    },
    _createTitleRenderedAction: function() {
        this._titleRenderedAction = this._createActionByOption("onTitleRendered")
    },
    _renderContent: function() {
        var that = this;
        this.callBase();
        if (this.option("templatesRenderAsynchronously")) {
            this._resizeEventTimer = setTimeout(function() {
                that._updateLayout()
            }, 0)
        }
    },
    _renderLayout: function() {
        if (this._tabs) {
            return
        }
        var $element = this.$element();
        this._$tabContainer = $("<div>").addClass(TABPANEL_TABS_CLASS).appendTo($element);
        var $tabs = $("<div>").appendTo(this._$tabContainer);
        this._tabs = this._createComponent($tabs, Tabs, this._tabConfig());
        this._$container = $("<div>").addClass(TABPANEL_CONTAINER_CLASS).appendTo($element);
        this._$container.append(this._$wrapper);
        this._updateLayout()
    },
    _updateLayout: function() {
        if (windowUtils.hasWindow()) {
            var tabsHeight = this._$tabContainer.outerHeight();
            this._$container.css({
                marginTop: -tabsHeight,
                paddingTop: tabsHeight
            })
        }
    },
    _refreshActiveDescendant: function() {
        if (!this._tabs) {
            return
        }
        var tabs = this._tabs,
            tabItems = tabs.itemElements(),
            $activeTab = $(tabItems[tabs.option("selectedIndex")]),
            id = this.getFocusedItemId();
        this.setAria("controls", void 0, $(tabItems));
        this.setAria("controls", id, $activeTab)
    },
    _tabConfig: function() {
        return {
            selectOnFocus: true,
            focusStateEnabled: this.option("focusStateEnabled"),
            hoverStateEnabled: this.option("hoverStateEnabled"),
            tabIndex: this.option("tabIndex"),
            selectedIndex: this.option("selectedIndex"),
            onItemClick: this._titleClickAction.bind(this),
            onItemHold: this._titleHoldAction.bind(this),
            itemHoldTimeout: this.option("itemHoldTimeout"),
            onSelectionChanged: function(e) {
                this.option("selectedIndex", e.component.option("selectedIndex"));
                this._refreshActiveDescendant()
            }.bind(this),
            onItemRendered: this._titleRenderedAction.bind(this),
            itemTemplate: this._getTemplateByOption("itemTitleTemplate"),
            items: this.option("items"),
            noDataText: null,
            scrollingEnabled: this.option("scrollingEnabled"),
            scrollByContent: this.option("scrollByContent"),
            showNavButtons: this.option("showNavButtons"),
            itemTemplateProperty: "tabTemplate",
            loopItemFocus: this.option("loop"),
            selectionRequired: true,
            onOptionChanged: function(args) {
                if ("focusedElement" === args.name) {
                    if (args.value) {
                        var $value = $(args.value);
                        var $newItem = this._itemElements().eq($value.index());
                        this.option("focusedElement", getPublicElement($newItem))
                    } else {
                        this.option("focusedElement", args.value)
                    }
                }
            }.bind(this),
            onFocusIn: function(args) {
                this._focusInHandler(args.event)
            }.bind(this),
            onFocusOut: function(args) {
                this._focusOutHandler(args.event)
            }.bind(this)
        }
    },
    _renderFocusTarget: function() {
        this._focusTarget().attr("tabIndex", -1);
        this._refreshActiveDescendant()
    },
    _updateFocusState: function(e, isFocused) {
        this.callBase(e, isFocused);
        if (e.target === this._tabs._focusTarget().get(0)) {
            this._toggleFocusClass(isFocused, this._focusTarget())
        }
    },
    _setTabsOption: function(name, value) {
        if (this._tabs) {
            this._tabs.option(name, value)
        }
    },
    _visibilityChanged: function(visible) {
        if (visible) {
            this._tabs._dimensionChanged();
            this._updateLayout()
        }
    },
    _optionChanged: function(args) {
        var name = args.name,
            value = args.value,
            fullName = args.fullName;
        switch (name) {
            case "dataSource":
                this.callBase(args);
                break;
            case "items":
                this._setTabsOption(fullName, value);
                this._updateLayout();
                this._tabs.repaint();
                this.callBase(args);
                break;
            case "selectedIndex":
            case "selectedItem":
            case "itemHoldTimeout":
            case "focusStateEnabled":
            case "hoverStateEnabled":
                this._setTabsOption(fullName, value);
                this.callBase(args);
                break;
            case "scrollingEnabled":
            case "scrollByContent":
            case "showNavButtons":
                this._setTabsOption(fullName, value);
                break;
            case "focusedElement":
                var id = value ? $(value).index() : value;
                var newItem = value ? this._tabs._itemElements().eq(id) : value;
                this._setTabsOption("focusedElement", getPublicElement(newItem));
                this.callBase(args);
                break;
            case "itemTitleTemplate":
                this._setTabsOption("itemTemplate", this._getTemplateByOption("itemTitleTemplate"));
                break;
            case "onTitleClick":
                this._createTitleClickAction();
                this._setTabsOption("onItemClick", this._titleClickAction.bind(this));
                break;
            case "onTitleHold":
                this._createTitleHoldAction();
                this._setTabsOption("onItemHold", this._titleHoldAction.bind(this));
                break;
            case "onTitleRendered":
                this._createTitleRenderedAction();
                this._setTabsOption("onItemRendered", this._titleRenderedAction.bind(this));
                break;
            case "loop":
                this._setTabsOption("loopItemFocus", value);
                break;
            default:
                this.callBase(args)
        }
    },
    _clean: function() {
        clearTimeout(this._resizeEventTimer);
        this.callBase()
    }
});
registerComponent("dxTabPanel", TabPanel);
module.exports = TabPanel;
module.exports.default = module.exports;

});
