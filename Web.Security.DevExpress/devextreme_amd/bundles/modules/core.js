define(function (require, exports, module) {/**
 * DevExtreme (bundles/modules/core.js)
 * Version: 18.1.6
 * Build date: Mon Sep 03 2018
 *
 * Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var windowUtils = require("../../core/utils/window");
var window = windowUtils.getWindow();
var DevExpress = window.DevExpress = window.DevExpress || {};
var errors = DevExpress.errors = require("../../core/errors");
if (DevExpress._DEVEXTREME_BUNDLE_INITIALIZED) {
    throw errors.Error("E0024")
}
DevExpress._DEVEXTREME_BUNDLE_INITIALIZED = true;
DevExpress.clientExporter = require("../../client_exporter");
DevExpress.VERSION = require("../../core/version");
DevExpress.Class = require("../../core/class");
DevExpress.DOMComponent = require("../../core/dom_component");
DevExpress.registerComponent = require("../../core/component_registrator");
DevExpress.devices = require("../../core/devices");
DevExpress.Color = require("../../color");
var animationFrame = require("../../animation/frame");
DevExpress.EventsMixin = require("../../core/events_mixin");
DevExpress.utils = {};
DevExpress.utils.requestAnimationFrame = animationFrame.requestAnimationFrame;
DevExpress.utils.cancelAnimationFrame = animationFrame.cancelAnimationFrame;
DevExpress.utils.initMobileViewport = require("../../mobile/init_mobile_viewport/init_mobile_viewport").initMobileViewport;
DevExpress.utils.extendFromObject = require("../../core/utils/extend").extendFromObject;
DevExpress.utils.createComponents = require("../../core/utils/dom").createComponents;
DevExpress.utils.triggerShownEvent = require("../../core/utils/dom").triggerShownEvent;
DevExpress.utils.triggerHidingEvent = require("../../core/utils/dom").triggerHidingEvent;
DevExpress.utils.resetActiveElement = require("../../core/utils/dom").resetActiveElement;
DevExpress.utils.findBestMatches = require("../../core/utils/common").findBestMatches;
DevExpress.createQueue = require("../../core/utils/queue").create;
DevExpress.utils.dom = require("../../core/utils/dom");
DevExpress.utils.common = require("../../core/utils/common");
DevExpress.utils.date = require("../../core/utils/date");
DevExpress.utils.browser = require("../../core/utils/browser");
DevExpress.utils.inflector = require("../../core/utils/inflector");
DevExpress.utils.iterator = require("../../core/utils/iterator");
DevExpress.utils.resizeCallbacks = require("../../core/utils/resize_callbacks");
DevExpress.utils.console = require("../../core/utils/console");
DevExpress.utils.string = require("../../core/utils/string");
DevExpress.utils.support = require("../../core/utils/support");
DevExpress.processHardwareBackButton = require("../../mobile/process_hardware_back_button");
DevExpress.viewPort = require("../../core/utils/view_port").value;
DevExpress.hideTopOverlay = require("../../mobile/hide_top_overlay");
DevExpress.formatHelper = require("../../format_helper");
DevExpress.config = require("../../core/config");
DevExpress.animationPresets = require("../../animation/presets/presets").presets;
DevExpress.fx = require("../../animation/fx");
DevExpress.TransitionExecutor = require("../../animation/transition_executor/transition_executor").TransitionExecutor;
DevExpress.AnimationPresetCollection = require("../../animation/presets/presets").PresetCollection;
DevExpress.events = require("../../events");
DevExpress.events.click = require("../../events/click");
DevExpress.events.utils = require("../../events/utils");
DevExpress.events.GestureEmitter = require("../../events/gesture/emitter.gesture");
DevExpress.localization = require("../../localization");
module.exports = DevExpress;

});