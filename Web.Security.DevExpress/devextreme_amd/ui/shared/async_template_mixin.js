define(function (require, exports, module) {/**
 * DevExtreme (ui/shared/async_template_mixin.js)
 * Version: 18.1.6
 * Build date: Mon Sep 03 2018
 *
 * Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
module.exports = {
    _renderAsyncTemplate: function(template, args) {
        var result = template && template.render(args);
        if (!this._options.templatesRenderAsynchronously) {
            args.onRendered.call(this)
        }
        return result
    },
    _waitAsyncTemplates: function(callback) {
        if (this._options.templatesRenderAsynchronously) {
            this._asyncTemplatesTimers = this._asyncTemplatesTimers || [];
            var timer = setTimeout(function() {
                callback.call(this);
                clearTimeout(timer)
            }.bind(this));
            this._asyncTemplatesTimers.push(timer)
        } else {
            callback.call(this)
        }
    },
    _cleanAsyncTemplatesTimer: function() {
        var timers = this._asyncTemplatesTimers || [];
        for (var i = 0; i < timers.length; i++) {
            clearTimeout(timers[i])
        }
        delete this._asyncTemplatesTimers
    }
};

});
