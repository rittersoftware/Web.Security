define(function (require, exports, module) {/**
 * DevExtreme (ui/scheduler/ui.scheduler.js)
 * Version: 18.1.6
 * Build date: Mon Sep 03 2018
 *
 * Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
 * Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
 */
"use strict";
var $ = require("../../core/renderer"),
    Callbacks = require("../../core/utils/callbacks"),
    translator = require("../../animation/translator"),
    errors = require("../widget/ui.errors"),
    windowUtils = require("../../core/utils/window"),
    dialog = require("../dialog"),
    recurrenceUtils = require("./utils.recurrence"),
    domUtils = require("../../core/utils/dom"),
    dateUtils = require("../../core/utils/date"),
    objectUtils = require("../../core/utils/object"),
    each = require("../../core/utils/iterator").each,
    extend = require("../../core/utils/extend").extend,
    inArray = require("../../core/utils/array").inArray,
    noop = require("../../core/utils/common").noop,
    typeUtils = require("../../core/utils/type"),
    devices = require("../../core/devices"),
    config = require("../../core/config"),
    registerComponent = require("../../core/component_registrator"),
    messageLocalization = require("../../localization/message"),
    dateSerialization = require("../../core/utils/date_serialization"),
    Widget = require("../widget/ui.widget"),
    subscribes = require("./ui.scheduler.subscribes"),
    FunctionTemplate = require("../widget/function_template"),
    appointmentTooltip = require("./ui.scheduler.appointment_tooltip"),
    SchedulerHeader = require("./ui.scheduler.header"),
    SchedulerWorkSpaceDay = require("./ui.scheduler.work_space_day"),
    SchedulerWorkSpaceWeek = require("./ui.scheduler.work_space_week"),
    SchedulerWorkSpaceWorkWeek = require("./ui.scheduler.work_space_work_week"),
    SchedulerWorkSpaceMonth = require("./ui.scheduler.work_space_month"),
    SchedulerTimelineDay = require("./ui.scheduler.timeline_day"),
    SchedulerTimelineWeek = require("./ui.scheduler.timeline_week"),
    SchedulerTimelineWorkWeek = require("./ui.scheduler.timeline_work_week"),
    SchedulerTimelineMonth = require("./ui.scheduler.timeline_month"),
    SchedulerAgenda = require("./ui.scheduler.agenda"),
    SchedulerResourceManager = require("./ui.scheduler.resource_manager"),
    SchedulerAppointmentModel = require("./ui.scheduler.appointment_model"),
    SchedulerAppointments = require("./ui.scheduler.appointments"),
    SchedulerLayoutManager = require("./ui.scheduler.appointments.layout_manager"),
    DropDownAppointments = require("./ui.scheduler.appointments.drop_down"),
    SchedulerTimezones = require("./ui.scheduler.timezones"),
    AsyncTemplateMixin = require("../shared/async_template_mixin"),
    DataHelperMixin = require("../../data_helper"),
    loading = require("./ui.loading"),
    AppointmentForm = require("./ui.scheduler.appointment_form"),
    Popup = require("../popup"),
    deferredUtils = require("../../core/utils/deferred"),
    when = deferredUtils.when,
    Deferred = deferredUtils.Deferred,
    EmptyTemplate = require("../widget/empty_template"),
    BindableTemplate = require("../widget/bindable_template"),
    themes = require("../themes");
var WIDGET_CLASS = "dx-scheduler",
    WIDGET_SMALL_CLASS = "dx-scheduler-small",
    WIDGET_READONLY_CLASS = "dx-scheduler-readonly",
    APPOINTMENT_POPUP_CLASS = "dx-scheduler-appointment-popup",
    RECURRENCE_EDITOR_ITEM_CLASS = "dx-scheduler-recurrence-rule-item",
    RECURRENCE_EDITOR_OPENED_ITEM_CLASS = "dx-scheduler-recurrence-rule-item-opened",
    WIDGET_SMALL_WIDTH = 400,
    APPOINTEMENT_POPUP_WIDTH = 610;
var VIEWS_CONFIG = {
    day: {
        workSpace: SchedulerWorkSpaceDay,
        renderingStrategy: "vertical"
    },
    week: {
        workSpace: SchedulerWorkSpaceWeek,
        renderingStrategy: "vertical"
    },
    workWeek: {
        workSpace: SchedulerWorkSpaceWorkWeek,
        renderingStrategy: "vertical"
    },
    month: {
        workSpace: SchedulerWorkSpaceMonth,
        renderingStrategy: "horizontalMonth"
    },
    timelineDay: {
        workSpace: SchedulerTimelineDay,
        renderingStrategy: "horizontal"
    },
    timelineWeek: {
        workSpace: SchedulerTimelineWeek,
        renderingStrategy: "horizontal"
    },
    timelineWorkWeek: {
        workSpace: SchedulerTimelineWorkWeek,
        renderingStrategy: "horizontal"
    },
    timelineMonth: {
        workSpace: SchedulerTimelineMonth,
        renderingStrategy: "horizontalMonthLine"
    },
    agenda: {
        workSpace: SchedulerAgenda,
        renderingStrategy: "agenda"
    }
};
var Scheduler = Widget.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            views: ["day", "week"],
            currentView: "day",
            currentDate: dateUtils.trimTime(new Date),
            min: void 0,
            max: void 0,
            dateSerializationFormat: void 0,
            firstDayOfWeek: void 0,
            groups: [],
            resources: [],
            dataSource: null,
            appointmentTemplate: "item",
            dropDownAppointmentTemplate: "dropDownAppointment",
            dataCellTemplate: null,
            timeCellTemplate: null,
            resourceCellTemplate: null,
            dateCellTemplate: null,
            startDayHour: 0,
            endDayHour: 24,
            editing: {
                allowAdding: true,
                allowDeleting: true,
                allowDragging: true,
                allowResizing: true,
                allowUpdating: true
            },
            showAllDayPanel: true,
            showCurrentTimeIndicator: true,
            shadeUntilCurrentTime: false,
            indicatorUpdateInterval: 3e5,
            indicatorTime: void 0,
            recurrenceEditMode: "dialog",
            cellDuration: 30,
            maxAppointmentsPerCell: "auto",
            selectedCellData: [],
            onAppointmentRendered: null,
            onAppointmentClick: null,
            onAppointmentDblClick: null,
            onAppointmentContextMenu: null,
            onCellClick: null,
            onCellContextMenu: null,
            onAppointmentAdding: null,
            onAppointmentAdded: null,
            onAppointmentUpdating: null,
            onAppointmentUpdated: null,
            onAppointmentDeleting: null,
            onAppointmentDeleted: null,
            onAppointmentFormCreated: null,
            appointmentTooltipTemplate: "appointmentTooltip",
            appointmentPopupTemplate: "appointmentPopup",
            crossScrollingEnabled: false,
            useDropDownViewSwitcher: false,
            startDateExpr: "startDate",
            endDateExpr: "endDate",
            textExpr: "text",
            descriptionExpr: "description",
            allDayExpr: "allDay",
            recurrenceRuleExpr: "recurrenceRule",
            recurrenceExceptionExpr: "recurrenceException",
            remoteFiltering: false,
            timeZone: "",
            startDateTimeZoneExpr: "startDateTimeZone",
            endDateTimeZoneExpr: "endDateTimeZone",
            noDataText: messageLocalization.format("dxCollectionWidget-noDataText"),
            allowMultipleCellSelection: true,
            _appointmentTooltipOffset: {
                x: 0,
                y: 0
            },
            _appointmentTooltipButtonsPosition: "bottom",
            _appointmentTooltipCloseButton: false,
            _useAppointmentColorForTooltip: false,
            _appointmentTooltipOpenButtonText: messageLocalization.format("dxScheduler-openAppointment"),
            _appointmentTooltipOpenButtonIcon: "",
            _dropDownButtonIcon: "overflow",
            _appointmentCountPerCell: 2,
            _appointmentGroupButtonOffset: 0,
            _appointmentOffset: 26
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
                return !devices.current().generic
            },
            options: {
                useDropDownViewSwitcher: true,
                editing: {
                    allowDragging: false,
                    allowResizing: false
                }
            }
        }, {
            device: function() {
                return themes.isMaterial()
            },
            options: {
                useDropDownViewSwitcher: true,
                dateCellTemplate: function(data, index, element) {
                    var text = data.text;
                    text.split(" ").forEach(function(text, index) {
                        var span = $("<span>").text(text).addClass("dx-scheduler-header-panel-cell-date");
                        $(element).append(span);
                        if (!index) {
                            $(element).append(" ")
                        }
                    })
                },
                _appointmentTooltipOffset: {
                    x: 0,
                    y: 11
                },
                _appointmentTooltipButtonsPosition: "top",
                _appointmentTooltipCloseButton: true,
                _useAppointmentColorForTooltip: true,
                _appointmentTooltipOpenButtonText: null,
                _appointmentTooltipOpenButtonIcon: "edit",
                _dropDownButtonIcon: "chevrondown",
                _appointmentCountPerCell: 1,
                _appointmentGroupButtonOffset: 20,
                _appointmentOffset: 30
            }
        }])
    },
    _postponeDataSourceLoading: function(promise) {
        this.postponedOperations.add("_reloadDataSource", this._reloadDataSource.bind(this), promise)
    },
    _postponeResourceLoading: function() {
        var _this = this;
        var whenLoaded = this.postponedOperations.add("_loadResources", function() {
                return _this._loadResources()
            }),
            resolveCallbacks = new Deferred;
        whenLoaded.done(function(resources) {
            resolveCallbacks.resolve(resources)
        });
        this._postponeDataSourceLoading(whenLoaded);
        return resolveCallbacks.promise()
    },
    _optionChanged: function(args) {
        var _this2 = this;
        var value = args.value,
            name = args.name;
        switch (args.name) {
            case "firstDayOfWeek":
                this._updateOption("workSpace", name, value);
                this._updateOption("header", name, value);
                break;
            case "currentDate":
                value = this._dateOption(name);
                value = dateUtils.trimTime(new Date(value));
                this._workSpace.option(name, value);
                this._header.option(name, this._workSpace._getViewStartByOptions());
                this._appointments.option("items", []);
                this._filterAppointmentsByDate();
                this._postponeDataSourceLoading();
                break;
            case "dataSource":
                this._initDataSource();
                this._customizeStoreLoadOptions();
                this._appointmentModel.setDataSource(this._dataSource);
                this._postponeResourceLoading().done(function(resources) {
                    _this2._filterAppointmentsByDate();
                    _this2._updateOption("workSpace", "showAllDayPanel", _this2.option("showAllDayPanel"))
                });
                break;
            case "min":
            case "max":
                value = this._dateOption(name);
                this._updateOption("header", name, new Date(value));
                this._updateOption("workSpace", name, new Date(value));
                break;
            case "views":
                this._processCurrentView();
                if (!!this._getCurrentViewOptions()) {
                    this.repaint()
                } else {
                    this._header.option(name, value)
                }
                break;
            case "useDropDownViewSwitcher":
                this._header.option(name, value);
                break;
            case "currentView":
                this._processCurrentView();
                this.option("selectedCellData", []);
                this._appointments.option({
                    items: [],
                    allowDrag: this._allowDragging(),
                    allowResize: this._allowResizing(),
                    itemTemplate: this._getAppointmentTemplate("appointmentTemplate")
                });
                this._updateHeader();
                this._postponeResourceLoading().done(function(resources) {
                    _this2.getLayoutManager().initRenderingStrategy(_this2._getAppointmentsRenderingStrategy());
                    _this2._refreshWorkSpace(resources);
                    _this2._filterAppointmentsByDate();
                    _this2._appointments.option("allowAllDayResize", "day" !== value)
                });
                break;
            case "appointmentTemplate":
                this._appointments.option("itemTemplate", value);
                break;
            case "dateCellTemplate":
            case "resourceCellTemplate":
            case "dataCellTemplate":
            case "timeCellTemplate":
                this._updateOption("workSpace", name, value);
                this.repaint();
                break;
            case "groups":
                this._postponeResourceLoading().done(function(resources) {
                    _this2._refreshWorkSpace(resources);
                    _this2._filterAppointmentsByDate()
                });
                break;
            case "resources":
                this._resourcesManager.setResources(this.option("resources"));
                this._appointmentModel.setDataAccessors(this._combineDataAccessors());
                this._postponeResourceLoading().done(function(resources) {
                    _this2._appointments.option("items", []);
                    _this2._refreshWorkSpace(resources);
                    _this2._filterAppointmentsByDate()
                });
                break;
            case "startDayHour":
            case "endDayHour":
                this._appointments.option("items", []);
                this._updateOption("workSpace", name, value);
                this._appointments.repaint();
                this._filterAppointmentsByDate();
                this._postponeDataSourceLoading();
                break;
            case "onAppointmentAdding":
            case "onAppointmentAdded":
            case "onAppointmentUpdating":
            case "onAppointmentUpdated":
            case "onAppointmentDeleting":
            case "onAppointmentDeleted":
            case "onAppointmentFormCreated":
                this._actions[name] = this._createActionByOption(name);
                break;
            case "onAppointmentRendered":
                this._appointments.option("onItemRendered", this._getAppointmentRenderedAction());
                break;
            case "onAppointmentClick":
                this._appointments.option("onItemClick", this._createActionByOption(name));
                break;
            case "onAppointmentDblClick":
                this._appointments.option(name, this._createActionByOption(name));
                break;
            case "onAppointmentContextMenu":
                this._appointments.option("onItemContextMenu", this._createActionByOption(name));
                break;
            case "noDataText":
            case "allowMultipleCellSelection":
            case "selectedCellData":
            case "accessKey":
            case "onCellClick":
                this._workSpace.option(name, value);
                break;
            case "onCellContextMenu":
                this._workSpace.option(name, value);
                break;
            case "crossScrollingEnabled":
                this._postponeResourceLoading().done(function(resources) {
                    _this2._appointments.option("items", []);
                    _this2._refreshWorkSpace(resources);
                    if (_this2._readyToRenderAppointments) {
                        _this2._appointments.option("items", _this2._getAppointmentsToRepaint())
                    }
                });
                break;
            case "cellDuration":
                this._appointments.option("items", []);
                if (this._readyToRenderAppointments) {
                    this._updateOption("workSpace", "hoursInterval", value / 60);
                    this._appointments.option("items", this._getAppointmentsToRepaint())
                }
                break;
            case "tabIndex":
            case "focusStateEnabled":
                this._updateOption("header", name, value);
                this._updateOption("workSpace", name, value);
                this._appointments.option(name, value);
                this.callBase(args);
                break;
            case "width":
                this._updateOption("header", name, value);
                if (this.option("crossScrollingEnabled")) {
                    this._updateOption("workSpace", "width", value)
                }
                this.callBase(args);
                this._dimensionChanged();
                break;
            case "height":
                this.callBase(args);
                this._dimensionChanged();
                break;
            case "editing":
                this._initEditing();
                var editing = this._editing;
                this._bringEditingModeToAppointments(editing);
                this.hideAppointmentTooltip();
                this._cleanPopup();
                break;
            case "showAllDayPanel":
                this._postponeResourceLoading().done(function(resources) {
                    _this2._filterAppointmentsByDate();
                    _this2._updateOption("workSpace", "allDayExpanded", value);
                    _this2._updateOption("workSpace", name, value)
                });
                break;
            case "showCurrentTimeIndicator":
            case "indicatorTime":
            case "indicatorUpdateInterval":
            case "shadeUntilCurrentTime":
                this._updateOption("workSpace", name, value);
                this.repaint();
                break;
            case "appointmentTooltipTemplate":
            case "appointmentPopupTemplate":
            case "recurrenceEditMode":
            case "remoteFiltering":
            case "timeZone":
            case "dropDownAppointmentTemplate":
            case "_appointmentTooltipOffset":
            case "_appointmentTooltipButtonsPosition":
            case "_appointmentTooltipCloseButton":
            case "_useAppointmentColorForTooltip":
            case "_appointmentTooltipOpenButtonText":
            case "_appointmentTooltipOpenButtonIcon":
            case "_dropDownButtonIcon":
            case "_appointmentCountPerCell":
            case "_appointmentGroupButtonOffset":
            case "_appointmentOffset":
                this.repaint();
                break;
            case "dateSerializationFormat":
                break;
            case "maxAppointmentsPerCell":
                break;
            case "startDateExpr":
            case "endDateExpr":
            case "startDateTimeZoneExpr":
            case "endDateTimeZoneExpr":
            case "textExpr":
            case "descriptionExpr":
            case "allDayExpr":
            case "recurrenceRuleExpr":
            case "recurrenceExceptionExpr":
                this._updateExpression(name, value);
                this._initAppointmentTemplate();
                this.repaint();
                break;
            default:
                this.callBase(args)
        }
    },
    _updateHeader: function() {
        var viewCountConfig = this._getViewCountConfig();
        this._header.option("intervalCount", viewCountConfig.intervalCount);
        this._header.option("startDate", viewCountConfig.startDate || new Date(this.option("currentDate")));
        this._header.option("min", this._dateOption("min"));
        this._header.option("max", this._dateOption("max"));
        this._header.option("currentDate", this._dateOption("currentDate"));
        this._header.option("firstDayOfWeek", this._getCurrentViewOption("firstDayOfWeek"));
        this._header.option("currentView", this._currentView)
    },
    _dateOption: function(optionName) {
        var optionValue = this._getCurrentViewOption(optionName);
        return dateSerialization.deserializeDate(optionValue)
    },
    _getSerializationFormat: function(optionName) {
        var value = this._getCurrentViewOption(optionName);
        if ("number" === typeof value) {
            return "number"
        }
        if (!typeUtils.isString(value)) {
            return
        }
        return dateSerialization.getDateSerializationFormat(value)
    },
    _bringEditingModeToAppointments: function(editing) {
        var editingConfig = {
            allowDelete: editing.allowUpdating && editing.allowDeleting
        };
        if (!this._isAgenda()) {
            editingConfig.allowDrag = editing.allowDragging;
            editingConfig.allowResize = editing.allowResizing;
            editingConfig.allowAllDayResize = editing.allowResizing && this._supportAllDayResizing()
        }
        this._appointments.option(editingConfig);
        this._dropDownAppointments.repaintExisting(this.$element())
    },
    _isAgenda: function() {
        return "agenda" === this._getAppointmentsRenderingStrategy()
    },
    _allowDragging: function() {
        return this._editing.allowDragging && !this._isAgenda()
    },
    _allowResizing: function() {
        return this._editing.allowResizing && !this._isAgenda()
    },
    _allowAllDayResizing: function() {
        return this._editing.allowResizing && this._supportAllDayResizing()
    },
    _supportAllDayResizing: function() {
        return "day" !== this._getCurrentViewType() || this._currentView.intervalCount > 1
    },
    _isAllDayExpanded: function(items) {
        return this.option("showAllDayPanel") && this._appointmentModel.hasAllDayAppointments(items, this._getCurrentViewOption("startDayHour"), this._getCurrentViewOption("endDayHour"))
    },
    _getTimezoneOffsetByOption: function(date) {
        return this._calculateTimezoneByValue(this.option("timeZone"), date)
    },
    _calculateTimezoneByValue: function(timezone, date) {
        var result = timezone;
        if ("string" === typeof timezone) {
            date = date || new Date;
            var dateUtc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes());
            result = SchedulerTimezones.getTimezoneOffsetById(timezone, dateUtc)
        }
        return result
    },
    _filterAppointmentsByDate: function() {
        var dateRange = this._workSpace.getDateRange();
        this._appointmentModel.filterByDate(dateRange[0], dateRange[1], this.option("remoteFiltering"), this.option("dateSerializationFormat"))
    },
    _loadResources: function() {
        var groups = this._getCurrentViewOption("groups"),
            result = new Deferred;
        this._resourcesManager.loadResources(groups).done(function(resources) {
            this._loadedResources = resources;
            result.resolve(resources)
        }.bind(this));
        return result.promise()
    },
    _dataSourceLoadedCallback: Callbacks(),
    _reloadDataSource: function() {
        var result = new Deferred;
        if (this._dataSource) {
            this._dataSource.load().done(function() {
                loading.hide();
                this._fireContentReadyAction();
                result.resolve()
            }.bind(this)).fail(function() {
                loading.hide();
                result.reject()
            });
            this._dataSource.isLoading() && loading.show({
                container: this.$element(),
                position: { of: this.$element()
                }
            })
        } else {
            result.resolve()
        }
        return result.promise()
    },
    _dimensionChanged: function() {
        var filteredItems = this.getFilteredItems();
        this._toggleSmallClass();
        if (!this._isAgenda() && filteredItems && this._isVisible()) {
            this._workSpace._cleanAllowedPositions();
            this._workSpace.option("allDayExpanded", this._isAllDayExpanded(filteredItems));
            var appointments = this._layoutManager.createAppointmentsMap(filteredItems);
            this._appointments.option("items", appointments)
        }
        this.hideAppointmentTooltip()
    },
    _clean: function() {
        this._cleanPopup();
        this.callBase()
    },
    _toggleSmallClass: function() {
        var width = this.$element().get(0).getBoundingClientRect().width;
        this.$element().toggleClass(WIDGET_SMALL_CLASS, width < WIDGET_SMALL_WIDTH)
    },
    _visibilityChanged: function(visible) {
        visible && this._dimensionChanged()
    },
    _dataSourceOptions: function() {
        return {
            paginate: false
        }
    },
    _init: function() {
        this._initExpressions({
            startDate: this.option("startDateExpr"),
            endDate: this.option("endDateExpr"),
            startDateTimeZone: this.option("startDateTimeZoneExpr"),
            endDateTimeZone: this.option("endDateTimeZoneExpr"),
            allDay: this.option("allDayExpr"),
            text: this.option("textExpr"),
            description: this.option("descriptionExpr"),
            recurrenceRule: this.option("recurrenceRuleExpr"),
            recurrenceException: this.option("recurrenceExceptionExpr")
        });
        this.callBase();
        this._initDataSource();
        this._loadedResources = [];
        this._proxiedCustomizeStoreLoadOptionsHandler = this._customizeStoreLoadOptionsHandler.bind(this);
        this._customizeStoreLoadOptions();
        this.$element().addClass(WIDGET_CLASS);
        this._initEditing();
        this._resourcesManager = new SchedulerResourceManager(this.option("resources"));
        var combinedDataAccessors = this._combineDataAccessors();
        this._appointmentModel = new SchedulerAppointmentModel(this._dataSource, {
            startDateExpr: this.option("startDateExpr"),
            endDateExpr: this.option("endDateExpr"),
            allDayExpr: this.option("allDayExpr"),
            recurrenceRuleExpr: this.option("recurrenceRuleExpr"),
            recurrenceExceptionExpr: this.option("recurrenceExceptionExpr")
        }, combinedDataAccessors);
        this._initActions();
        this._dropDownAppointments = new DropDownAppointments;
        this._subscribes = subscribes
    },
    _initTemplates: function() {
        this.callBase();
        this._initAppointmentTemplate();
        this._defaultTemplates.appointmentTooltip = new EmptyTemplate(this);
        this._defaultTemplates.appointmentPopup = new EmptyTemplate(this);
        this._defaultTemplates.dropDownAppointment = new EmptyTemplate(this)
    },
    _initAppointmentTemplate: function() {
        var that = this;
        this._defaultTemplates.item = new BindableTemplate(function($container, data, model) {
            var appointmentsInst = that.getAppointmentsInstance();
            appointmentsInst._renderAppointmentTemplate.call(appointmentsInst, $container, data, model)
        }, ["html", "text", "startDate", "endDate", "allDay", "description", "recurrenceRule", "recurrenceException", "startDateTimeZone", "endDateTimeZone"], this.option("integrationOptions.watchMethod"), {
            text: this._dataAccessors.getter.text,
            startDate: this._dataAccessors.getter.startDate,
            endDate: this._dataAccessors.getter.endDate,
            startDateTimeZone: this._dataAccessors.getter.startDateTimeZone,
            endDateTimeZone: this._dataAccessors.getter.endDateTimeZone,
            allDay: this._dataAccessors.getter.allDay,
            recurrenceRule: this._dataAccessors.getter.recurrenceRule
        })
    },
    _combineDataAccessors: function() {
        var resourcesDataAccessors = this._resourcesManager._dataAccessors,
            result = extend(true, {}, this._dataAccessors);
        each(resourcesDataAccessors, function(type, accessor) {
            result[type].resources = accessor
        }.bind(this));
        return result
    },
    _renderContent: function() {
        this._renderContentImpl()
    },
    _dataSourceChangedHandler: function(result) {
        if (this._readyToRenderAppointments) {
            this._workSpaceRecalculation.done(function() {
                this._filteredItems = this.fire("prerenderFilter");
                this._workSpace.option("allDayExpanded", this._isAllDayExpanded(this._filteredItems));
                if (this._isAgenda()) {
                    this.getRenderingStrategyInstance().calculateRows(this._filteredItems, 7, this.option("currentDate"), true)
                }
                if (this._filteredItems.length && this._isVisible()) {
                    this._appointments.option("items", this._getAppointmentsToRepaint());
                    delete this.instance._updatedAppointment
                } else {
                    this._appointments.option("items", [])
                }
                if (this._isAgenda()) {
                    this._workSpace._renderView();
                    this._dataSourceLoadedCallback.fireWith(this, [result])
                }
            }.bind(this))
        }
    },
    _getAppointmentsToRepaint: function() {
        var appointments = this._layoutManager.createAppointmentsMap(this._filteredItems);
        return this._layoutManager.markRepaintedAppointments(appointments, this.getAppointmentsInstance().option("items"))
    },
    _initExpressions: function(fields) {
        var dataCoreUtils = require("../../core/utils/data"),
            isDateField = function(field) {
                return "startDate" === field || "endDate" === field
            };
        if (!this._dataAccessors) {
            this._dataAccessors = {
                getter: {},
                setter: {}
            }
        }
        each(fields, function(name, expr) {
            if (!!expr) {
                var getter = dataCoreUtils.compileGetter(expr),
                    setter = dataCoreUtils.compileSetter(expr);
                var dateGetter, dateSetter;
                if (isDateField(name)) {
                    var that = this;
                    dateGetter = function() {
                        var value = getter.apply(this, arguments);
                        if (config().forceIsoDateParsing) {
                            if (!that.option("dateSerializationFormat")) {
                                var format = dateSerialization.getDateSerializationFormat(value);
                                if (format) {
                                    that.option("dateSerializationFormat", format)
                                }
                            }
                            value = dateSerialization.deserializeDate(value)
                        }
                        return value
                    };
                    dateSetter = function(object, value) {
                        if (config().forceIsoDateParsing || that.option("dateSerializationFormat")) {
                            value = dateSerialization.serializeDate(value, that.option("dateSerializationFormat"))
                        }
                        setter.call(this, object, value)
                    }
                }
                this._dataAccessors.getter[name] = dateGetter || getter;
                this._dataAccessors.setter[name] = dateSetter || setter
            } else {
                delete this._dataAccessors.getter[name];
                delete this._dataAccessors.setter[name]
            }
        }.bind(this))
    },
    _updateExpression: function(name, value) {
        var exprObj = {};
        exprObj[name.replace("Expr", "")] = value;
        this._initExpressions(exprObj)
    },
    _initEditing: function() {
        var editing = this.option("editing");
        this._editing = {
            allowAdding: !!editing,
            allowUpdating: !!editing,
            allowDeleting: !!editing,
            allowResizing: !!editing,
            allowDragging: !!editing
        };
        if (typeUtils.isObject(editing)) {
            this._editing = extend(this._editing, editing)
        }
        this._editing.allowDragging = this._editing.allowDragging && this._editing.allowUpdating;
        this._editing.allowResizing = this._editing.allowResizing && this._editing.allowUpdating;
        this.$element().toggleClass(WIDGET_READONLY_CLASS, this._isReadOnly())
    },
    _isReadOnly: function() {
        var result = true,
            editing = this._editing;
        for (var prop in editing) {
            if (editing.hasOwnProperty(prop)) {
                result = result && !editing[prop]
            }
        }
        return result
    },
    _customizeStoreLoadOptions: function() {
        this._dataSource && this._dataSource.on("customizeStoreLoadOptions", this._proxiedCustomizeStoreLoadOptionsHandler)
    },
    _dispose: function() {
        this.hideAppointmentPopup();
        this.hideAppointmentTooltip();
        this._cleanAsyncTemplatesTimer();
        this._dataSource && this._dataSource.off("customizeStoreLoadOptions", this._proxiedCustomizeStoreLoadOptionsHandler);
        this.callBase()
    },
    _customizeStoreLoadOptionsHandler: function(options) {
        options.storeLoadOptions.dxScheduler = {
            startDate: this.getStartViewDate(),
            endDate: this.getEndViewDate(),
            resources: this.option("resources")
        }
    },
    _initActions: function() {
        this._actions = {
            onAppointmentAdding: this._createActionByOption("onAppointmentAdding"),
            onAppointmentAdded: this._createActionByOption("onAppointmentAdded"),
            onAppointmentUpdating: this._createActionByOption("onAppointmentUpdating"),
            onAppointmentUpdated: this._createActionByOption("onAppointmentUpdated"),
            onAppointmentDeleting: this._createActionByOption("onAppointmentDeleting"),
            onAppointmentDeleted: this._createActionByOption("onAppointmentDeleted"),
            onAppointmentFormCreated: this._createActionByOption("onAppointmentFormCreated")
        }
    },
    _getAppointmentRenderedAction: function() {
        return this._createActionByOption("onAppointmentRendered", {
            excludeValidators: ["designMode", "disabled", "readOnly"]
        })
    },
    _renderFocusTarget: noop,
    _initMarkup: function() {
        this.callBase();
        this._processCurrentView();
        this._renderHeader();
        this._layoutManager = new SchedulerLayoutManager(this, this._getAppointmentsRenderingStrategy());
        this._appointments = this._createComponent("<div>", SchedulerAppointments, this._appointmentsConfig());
        this._appointments.option("itemTemplate", this._getAppointmentTemplate("appointmentTemplate"));
        this._loadResources().done(function(resources) {
            var _this3 = this;
            this._readyToRenderAppointments = windowUtils.hasWindow();
            this._workSpace && this._cleanWorkspace();
            this._renderWorkSpace(resources);
            this._appointments.option({
                fixedContainer: this._workSpace.getFixedContainer(),
                allDayContainer: this._workSpace.getAllDayContainer()
            });
            this._waitAsyncTemplates(function() {
                _this3._workSpaceRecalculation && _this3._workSpaceRecalculation.resolve()
            });
            this._filterAppointmentsByDate();
            this._reloadDataSource()
        }.bind(this))
    },
    _render: function() {
        this._toggleSmallClass();
        this.callBase()
    },
    _renderHeader: function() {
        var $header = $("<div>").appendTo(this.$element());
        this._header = this._createComponent($header, SchedulerHeader, this._headerConfig())
    },
    _headerConfig: function() {
        var result, currentViewOptions = this._getCurrentViewOptions(),
            countConfig = this._getViewCountConfig();
        result = extend({
            firstDayOfWeek: this.option("firstDayOfWeek"),
            currentView: this._currentView,
            tabIndex: this.option("tabIndex"),
            focusStateEnabled: this.option("focusStateEnabled"),
            width: this.option("width"),
            rtlEnabled: this.option("rtlEnabled"),
            useDropDownViewSwitcher: this.option("useDropDownViewSwitcher"),
            _dropDownButtonIcon: this.option("_dropDownButtonIcon")
        }, currentViewOptions);
        result.observer = this;
        result.intervalCount = countConfig.intervalCount;
        result.views = this.option("views");
        result.min = new Date(this._dateOption("min"));
        result.max = new Date(this._dateOption("max"));
        result.currentDate = dateUtils.trimTime(new Date(this._dateOption("currentDate")));
        return result
    },
    _appointmentsConfig: function() {
        var that = this;
        var config = {
            observer: this,
            onItemRendered: this._getAppointmentRenderedAction(),
            onItemClick: this._createActionByOption("onAppointmentClick"),
            onItemContextMenu: this._createActionByOption("onAppointmentContextMenu"),
            onAppointmentDblClick: this._createActionByOption("onAppointmentDblClick"),
            tabIndex: this.option("tabIndex"),
            focusStateEnabled: this.option("focusStateEnabled"),
            allowDrag: this._allowDragging(),
            allowDelete: this._editing.allowUpdating && this._editing.allowDeleting,
            allowResize: this._allowResizing(),
            allowAllDayResize: this._allowAllDayResizing(),
            rtlEnabled: this.option("rtlEnabled"),
            onContentReady: function() {
                that._workSpace && that._workSpace.option("allDayExpanded", that._isAllDayExpanded(that.getFilteredItems()))
            }
        };
        return config
    },
    getAppointmentGroupButtonOffset: function() {
        if (this._workSpace.applyGroupButtonOffset()) {
            return this.option("_appointmentGroupButtonOffset")
        } else {
            return 0
        }
    },
    getAppointmentDurationInMinutes: function() {
        return this._getCurrentViewOption("cellDuration")
    },
    _processCurrentView: function() {
        var views = this.option("views"),
            currentView = this.option("currentView"),
            that = this;
        this._currentView = currentView;
        each(views, function(_, view) {
            var isViewIsObject = typeUtils.isObject(view),
                viewName = isViewIsObject ? view.name : view,
                viewType = view.type;
            if (currentView === viewName || currentView === viewType) {
                that._currentView = view;
                return false
            }
        })
    },
    _getCurrentViewType: function() {
        return this._currentView.type || this._currentView
    },
    _getAppointmentsRenderingStrategy: function() {
        return VIEWS_CONFIG[this._getCurrentViewType()].renderingStrategy
    },
    _renderWorkSpace: function(groups) {
        this._readyToRenderAppointments && this._toggleSmallClass();
        var $workSpace = $("<div>").appendTo(this.$element());
        var countConfig = this._getViewCountConfig();
        this._workSpace = this._createComponent($workSpace, VIEWS_CONFIG[this._getCurrentViewType()].workSpace, this._workSpaceConfig(groups, countConfig));
        this._workSpace.getWorkArea().append(this._appointments.$element());
        this._recalculateWorkspace();
        countConfig.startDate && this._header && this._header.option("currentDate", this._workSpace._getHeaderDate());
        this._appointments.option("_appointmentGroupButtonOffset", this.getAppointmentGroupButtonOffset())
    },
    _getViewCountConfig: function() {
        var currentView = this.option("currentView");
        var view = this._getViewByName(currentView),
            viewCount = view && view.intervalCount || 1,
            startDate = view && view.startDate || null;
        return {
            intervalCount: viewCount,
            startDate: startDate
        }
    },
    _getViewByName: function(name) {
        var views = this.option("views");
        for (var i = 0; i < views.length; i++) {
            if (views[i].name === name || views[i].type === name || views[i] === name) {
                return views[i]
            }
        }
    },
    _recalculateWorkspace: function() {
        var _this4 = this;
        this._workSpaceRecalculation = new Deferred;
        this._waitAsyncTemplates(function() {
            domUtils.triggerResizeEvent(_this4._workSpace.$element());
            _this4._workSpace._refreshDateTimeIndication()
        })
    },
    _workSpaceConfig: function(groups, countConfig) {
        var _this5 = this;
        var result, currentViewOptions = this._getCurrentViewOptions();
        result = extend({
            noDataText: this.option("noDataText"),
            firstDayOfWeek: this.option("firstDayOfWeek"),
            startDayHour: this.option("startDayHour"),
            endDayHour: this.option("endDayHour"),
            tabIndex: this.option("tabIndex"),
            accessKey: this.option("accessKey"),
            focusStateEnabled: this.option("focusStateEnabled"),
            cellDuration: this.option("cellDuration"),
            showAllDayPanel: this.option("showAllDayPanel"),
            showCurrentTimeIndicator: this.option("showCurrentTimeIndicator"),
            indicatorTime: this.option("indicatorTime"),
            indicatorUpdateInterval: this.option("indicatorUpdateInterval"),
            shadeUntilCurrentTime: this.option("shadeUntilCurrentTime"),
            allDayExpanded: this._appointments.option("items"),
            crossScrollingEnabled: this.option("crossScrollingEnabled"),
            dataCellTemplate: this.option("dataCellTemplate"),
            timeCellTemplate: this.option("timeCellTemplate"),
            resourceCellTemplate: this.option("resourceCellTemplate"),
            dateCellTemplate: this.option("dateCellTemplate"),
            allowMultipleCellSelection: this.option("allowMultipleCellSelection"),
            selectedCellData: this.option("selectedCellData"),
            onSelectionChanged: function(args) {
                _this5.option("selectedCellData", args.selectedCellData)
            }
        }, currentViewOptions);
        result.observer = this;
        result.intervalCount = countConfig.intervalCount;
        result.startDate = countConfig.startDate;
        result.groups = groups;
        result.onCellClick = this._createActionByOption("onCellClick");
        result.onCellContextMenu = this._createActionByOption("onCellContextMenu");
        result.min = new Date(this._dateOption("min"));
        result.max = new Date(this._dateOption("max"));
        result.currentDate = dateUtils.trimTime(new Date(this._dateOption("currentDate")));
        result.hoursInterval = result.cellDuration / 60;
        result.allDayExpanded = this._isAllDayExpanded(this.getFilteredItems());
        result.dataCellTemplate = result.dataCellTemplate ? this._getTemplate(result.dataCellTemplate) : null;
        result.timeCellTemplate = result.timeCellTemplate ? this._getTemplate(result.timeCellTemplate) : null;
        result.resourceCellTemplate = result.resourceCellTemplate ? this._getTemplate(result.resourceCellTemplate) : null;
        result.dateCellTemplate = result.dateCellTemplate ? this._getTemplate(result.dateCellTemplate) : null;
        return result
    },
    _getCurrentViewOptions: function() {
        return this._currentView
    },
    _getCurrentViewOption: function(optionName) {
        var currentViewOptions = this._getCurrentViewOptions();
        if (currentViewOptions && void 0 !== currentViewOptions[optionName]) {
            return currentViewOptions[optionName]
        }
        return this.option(optionName)
    },
    _getAppointmentTemplate: function(optionName) {
        var currentViewOptions = this._getCurrentViewOptions();
        if (currentViewOptions && currentViewOptions[optionName]) {
            return this._getTemplate(currentViewOptions[optionName])
        }
        return this._getTemplateByOption(optionName)
    },
    _updateOption: function(viewName, optionName, value) {
        var currentViewOptions = this._getCurrentViewOptions();
        if (!currentViewOptions || !typeUtils.isDefined(currentViewOptions[optionName])) {
            this["_" + viewName].option(optionName, value);
        }
    },
    _refreshWorkSpace: function(groups) {
        var _this6 = this;
        this._cleanWorkspace();
        delete this._workSpace;
        this._renderWorkSpace(groups);
        if (this._readyToRenderAppointments) {
            this._appointments.option({
                fixedContainer: this._workSpace.getFixedContainer(),
                allDayContainer: this._workSpace.getAllDayContainer()
            });
            this._waitAsyncTemplates(function() {
                _this6._workSpaceRecalculation.resolve()
            })
        }
    },
    _cleanWorkspace: function() {
        this._appointments.$element().detach();
        this._workSpace._dispose();
        this._workSpace.$element().remove()
    },
    getWorkSpaceScrollable: function() {
        return this._workSpace.getScrollable()
    },
    getWorkSpaceScrollableScrollTop: function(allDay) {
        return this._workSpace.getGroupedScrollableScrollTop(allDay)
    },
    getWorkSpaceScrollableScrollLeft: function() {
        return this._workSpace.getScrollableScrollLeft()
    },
    getWorkSpaceScrollableContainer: function() {
        return this._workSpace.getScrollableContainer()
    },
    getWorkSpaceAllDayHeight: function() {
        return this._workSpace.getAllDayHeight()
    },
    getWorkSpaceAllDayOffset: function() {
        return this._workSpace.getAllDayOffset()
    },
    getWorkSpaceHeaderPanelHeight: function() {
        return this._workSpace.getHeaderPanelHeight()
    },
    getWorkSpaceDateTableOffset: function() {
        return !this.option("crossScrollingEnabled") || this.option("rtlEnabled") ? this._workSpace.getWorkSpaceLeftOffset() : 0
    },
    getWorkSpace: function() {
        return this._workSpace
    },
    getHeader: function() {
        return this._header
    },
    getMaxAppointmentsPerCell: function() {
        return this._getCurrentViewOption("maxAppointmentsPerCell")
    },
    forceMaxAppointmentPerCell: function() {
        return this._getCurrentViewOption("forceMaxAppointmentPerCell")
    },
    _createPopup: function(appointmentData, processTimeZone) {
        this._$popup = $("<div>").addClass(APPOINTMENT_POPUP_CLASS).appendTo(this.$element());
        this._initDynamicPopupTemplate(appointmentData, processTimeZone);
        this._popup = this._createComponent(this._$popup, Popup, this._popupConfig(appointmentData))
    },
    _popupContent: function(appointmentData, processTimeZone) {
        var $popupContent = this._popup.$content();
        this._createAppointmentForm(appointmentData, $popupContent, processTimeZone);
        return $popupContent
    },
    _createAppointmentForm: function(appointmentData, $content, processTimeZone) {
        var allDay = this.fire("getField", "allDay", appointmentData),
            resources = this.option("resources"),
            startDate = this.fire("getField", "startDate", appointmentData),
            endDate = this.fire("getField", "endDate", appointmentData);
        each(this._resourcesManager.getResourcesFromItem(appointmentData, true) || {}, function(resourceName, resourceValue) {
            appointmentData[resourceName] = resourceValue
        });
        var formData = extend(true, {}, appointmentData);
        if (processTimeZone) {
            startDate = this.fire("convertDateByTimezone", startDate);
            endDate = this.fire("convertDateByTimezone", endDate);
            this.fire("setField", "startDate", formData, startDate);
            this.fire("setField", "endDate", formData, endDate)
        }
        if (this._appointmentForm) {
            var startDateExpr = this.option("startDateExpr"),
                endDateExpr = this.option("endDateExpr");
            this._appointmentForm.option("formData", formData);
            this._appointmentForm.option("readOnly", this._editAppointmentData ? !this._editing.allowUpdating : false);
            AppointmentForm.checkEditorsType(this._appointmentForm, startDateExpr, endDateExpr, allDay)
        } else {
            AppointmentForm.prepareAppointmentFormEditors(allDay, {
                textExpr: this.option("textExpr"),
                allDayExpr: this.option("allDayExpr"),
                startDateExpr: this.option("startDateExpr"),
                endDateExpr: this.option("endDateExpr"),
                descriptionExpr: this.option("descriptionExpr"),
                recurrenceRuleExpr: this.option("recurrenceRuleExpr"),
                startDateTimeZoneExpr: this.option("startDateTimeZoneExpr"),
                endDateTimeZoneExpr: this.option("endDateTimeZoneExpr")
            }, this);
            if (resources && resources.length) {
                this._resourcesManager.setResources(this.option("resources"));
                AppointmentForm.concatResources(this._resourcesManager.getEditors())
            }
            this._appointmentForm = AppointmentForm.create(this._createComponent.bind(this), $content, this._editAppointmentData ? !this._editing.allowUpdating : false, formData)
        }
        var recurrenceRuleExpr = this.option("recurrenceRuleExpr"),
            recurrentEditorItem = recurrenceRuleExpr ? this._appointmentForm.itemOption(recurrenceRuleExpr) : null;
        if (recurrentEditorItem) {
            var options = recurrentEditorItem.editorOptions || {};
            options.startDate = startDate;
            this._appointmentForm.itemOption(recurrenceRuleExpr, "editorOptions", options)
        }
        this._actions.onAppointmentFormCreated({
            form: this._appointmentForm,
            appointmentData: appointmentData
        })
    },
    _initDynamicPopupTemplate: function(appointmentData, processTimeZone) {
        var that = this;
        this._defaultTemplates.appointmentPopup = new FunctionTemplate(function(options) {
            var $popupContent = that._popupContent(appointmentData, processTimeZone);
            $(options.container).append($popupContent);
            return $(options.container)
        })
    },
    _popupConfig: function(appointmentData) {
        var template = this._getTemplateByOption("appointmentPopupTemplate");
        return {
            maxWidth: APPOINTEMENT_POPUP_WIDTH,
            onHiding: function() {
                this.focus()
            }.bind(this),
            contentTemplate: new FunctionTemplate(function(options) {
                return template.render({
                    model: appointmentData,
                    container: options.container
                })
            }),
            defaultOptionsRules: [{
                device: function() {
                    return !devices.current().generic
                },
                options: {
                    fullScreen: true
                }
            }]
        }
    },
    _getPopupToolbarItems: function() {
        return [{
            shortcut: "done",
            location: "after",
            onClick: this._doneButtonClickHandler.bind(this)
        }, {
            shortcut: "cancel",
            location: "after"
        }]
    },
    _cleanPopup: function() {
        if (this._$popup) {
            this._popup.$element().remove();
            delete this._$popup;
            delete this._popup;
            delete this._appointmentForm
        }
    },
    _doneButtonClickHandler: function(args) {
        args.cancel = true;
        this._saveChanges(true);
        if (this._lastEditData) {
            var startDate = this.fire("getField", "startDate", this._lastEditData);
            this._workSpace.updateScrollPosition(startDate);
            delete this._lastEditData
        }
    },
    _saveChanges: function(disableButton) {
        var validation = this._appointmentForm.validate();
        if (validation && !validation.isValid) {
            return false
        }
        disableButton && this._disableDoneButton();
        var formData = objectUtils.deepExtendArraySafe({}, this._getFormData(), true),
            oldData = this._editAppointmentData,
            recData = this._updatedRecAppointment;

        function convert(obj, dateFieldName) {
            var date = new Date(this.fire("getField", dateFieldName, obj));
            var tzDiff = 36e5 * this._getTimezoneOffsetByOption() + this.fire("getClientTimezoneOffset", date);
            return new Date(date.getTime() + tzDiff)
        }
        if (oldData) {
            this._convertDatesByTimezoneBack(false, formData)
        }
        if (oldData && !recData) {
            this.updateAppointment(oldData, formData)
        } else {
            if (recData) {
                this.updateAppointment(oldData, recData);
                delete this._updatedRecAppointment;
                if ("number" === typeof this._getTimezoneOffsetByOption()) {
                    this.fire("setField", "startDate", formData, convert.call(this, formData, "startDate"));
                    this.fire("setField", "endDate", formData, convert.call(this, formData, "endDate"))
                }
            }
            this.addAppointment(formData)
        }
        this._enableDoneButton();
        this._lastEditData = formData;
        return true
    },
    _getFormData: function() {
        var formData = this._appointmentForm.option("formData"),
            startDate = this.fire("getField", "startDate", formData),
            endDate = this.fire("getField", "endDate", formData);
        this.fire("setField", "startDate", formData, startDate);
        this.fire("setField", "endDate", formData, endDate);
        return formData
    },
    _convertDatesByTimezoneBack: function(applyAppointmentTimezone, sourceAppointmentData, targetAppointmentData) {
        targetAppointmentData = targetAppointmentData || sourceAppointmentData;
        var processedStartDate = this.fire("convertDateByTimezoneBack", this.fire("getField", "startDate", sourceAppointmentData), applyAppointmentTimezone && this.fire("getField", "startDateTimeZone", sourceAppointmentData));
        var processedEndDate = this.fire("convertDateByTimezoneBack", this.fire("getField", "endDate", sourceAppointmentData), applyAppointmentTimezone && this.fire("getField", "endDateTimeZone", sourceAppointmentData));
        this.fire("setField", "startDate", targetAppointmentData, processedStartDate);
        this.fire("setField", "endDate", targetAppointmentData, processedEndDate)
    },
    _disableDoneButton: function() {
        var toolbarItems = this._popup.option("toolbarItems");
        toolbarItems[0].options = extend(toolbarItems[0].options, {
            disabled: true
        });
        this._popup.option("toolbarItems", toolbarItems)
    },
    _enableDoneButton: function() {
        var toolbarItems = this._popup.option("toolbarItems");
        toolbarItems[0].options = extend(toolbarItems[0].options, {
            disabled: false
        });
        this._popup.option("toolbarItems", toolbarItems)
    },
    _checkRecurringAppointment: function(targetAppointment, singleAppointment, exceptionDate, callback, isDeleted, isPopupEditing) {
        delete this._updatedRecAppointment;
        var recurrenceRule = this.fire("getField", "recurrenceRule", targetAppointment);
        if (!recurrenceUtils.getRecurrenceRule(recurrenceRule).isValid || !this._editing.allowUpdating) {
            callback();
            return
        }
        var editMode = this.option("recurrenceEditMode");
        switch (editMode) {
            case "series":
                callback();
                break;
            case "occurrence":
                this._singleAppointmentChangesHandler(targetAppointment, singleAppointment, exceptionDate, isDeleted, isPopupEditing);
                break;
            default:
                this._showRecurrenceChangeConfirm(isDeleted).done(function(result) {
                    result && callback();
                    !result && this._singleAppointmentChangesHandler(targetAppointment, singleAppointment, exceptionDate, isDeleted, isPopupEditing)
                }.bind(this)).fail(function() {
                    this._appointments.moveAppointmentBack()
                }.bind(this))
        }
    },
    _singleAppointmentChangesHandler: function(targetAppointment, singleAppointment, exceptionDate, isDeleted, isPopupEditing) {
        exceptionDate = new Date(exceptionDate);

        function processAppointmentDates(appointment, commonTimezoneOffset) {
            var startDate = this.fire("getField", "startDate", appointment);
            var processedStartDate = this.fire("convertDateByTimezoneBack", startDate, this.fire("getField", "startDateTimeZone", appointment));
            var endDate = this.fire("getField", "endDate", appointment);
            var processedEndDate = this.fire("convertDateByTimezoneBack", endDate, this.fire("getField", "endDateTimeZone", appointment));
            if ("number" === typeof commonTimezoneOffset && !isNaN(commonTimezoneOffset)) {
                var startDateClientTzOffset = -(this._subscribes.getClientTimezoneOffset(startDate) / 36e5);
                var endDateClientTzOffset = -(this._subscribes.getClientTimezoneOffset(endDate) / 36e5);
                var processedStartDateInUTC = processedStartDate.getTime() - 36e5 * startDateClientTzOffset,
                    processedEndDateInUTC = processedEndDate.getTime() - 36e5 * endDateClientTzOffset;
                processedStartDate = new Date(processedStartDateInUTC + 36e5 * commonTimezoneOffset);
                processedEndDate = new Date(processedEndDateInUTC + 36e5 * commonTimezoneOffset)
            }
            this.fire("setField", "startDate", appointment, processedStartDate);
            this.fire("setField", "endDate", appointment, processedEndDate)
        }
        this.fire("setField", "recurrenceRule", singleAppointment, "");
        this.fire("setField", "recurrenceException", singleAppointment, "");
        if (!isDeleted && !isPopupEditing) {
            processAppointmentDates.call(this, singleAppointment, this._getTimezoneOffsetByOption());
            this.addAppointment(singleAppointment)
        }
        var recurrenceException = this._makeDateAsRecurrenceException(exceptionDate, targetAppointment),
            updatedAppointment = extend({}, targetAppointment, {
                recurrenceException: recurrenceException
            });
        if (isPopupEditing) {
            this._updatedRecAppointment = updatedAppointment;
            processAppointmentDates.call(this, singleAppointment);
            this._showAppointmentPopup(singleAppointment, true, true);
            this._editAppointmentData = targetAppointment
        } else {
            this._updateAppointment(targetAppointment, updatedAppointment)
        }
    },
    _makeDateAsRecurrenceException: function(exceptionDate, targetAppointment) {
        var startDate = this._getStartDate(targetAppointment, true),
            startDateTimeZone = this.fire("getField", "startDateTimeZone", targetAppointment),
            exceptionByDate = this._getRecurrenceExceptionDate(exceptionDate, startDate, startDateTimeZone),
            recurrenceException = this.fire("getField", "recurrenceException", targetAppointment);
        return recurrenceException ? recurrenceException + "," + exceptionByDate : exceptionByDate
    },
    _getRecurrenceExceptionDate: function(exceptionDate, targetStartDate, startDateTimeZone) {
        var startDate = this.fire("convertDateByTimezoneBack", targetStartDate, startDateTimeZone);
        exceptionDate.setHours(startDate.getHours(), startDate.getMinutes(), startDate.getSeconds(), startDate.getMilliseconds());
        return dateSerialization.serializeDate(exceptionDate, "yyyyMMddTHHmmss")
    },
    _showRecurrenceChangeConfirm: function(isDeleted) {
        var message = messageLocalization.format(isDeleted ? "dxScheduler-confirmRecurrenceDeleteMessage" : "dxScheduler-confirmRecurrenceEditMessage"),
            seriesText = messageLocalization.format(isDeleted ? "dxScheduler-confirmRecurrenceDeleteSeries" : "dxScheduler-confirmRecurrenceEditSeries"),
            occurrenceText = messageLocalization.format(isDeleted ? "dxScheduler-confirmRecurrenceDeleteOccurrence" : "dxScheduler-confirmRecurrenceEditOccurrence");
        return dialog.custom({
            message: message,
            showCloseButton: true,
            showTitle: true,
            buttons: [{
                text: seriesText,
                onClick: function() {
                    return true
                }
            }, {
                text: occurrenceText,
                onClick: function() {
                    return false
                }
            }]
        }).show()
    },
    _getUpdatedData: function(options) {
        var target = options.data || options,
            cellData = this.getTargetCellData(),
            targetAllDay = this.fire("getField", "allDay", target),
            targetStartDate = new Date(this.fire("getField", "startDate", target)),
            targetEndDate = new Date(this.fire("getField", "endDate", target)),
            date = cellData.date || targetStartDate,
            duration = targetEndDate.getTime() - targetStartDate.getTime();
        if (this._workSpace.keepOriginalHours()) {
            var diff = targetStartDate.getTime() - dateUtils.trimTime(targetStartDate).getTime();
            date = new Date(dateUtils.trimTime(date).getTime() + diff)
        }
        var updatedData = {},
            allDay = cellData.allDay;
        this.fire("setField", "allDay", updatedData, allDay);
        this.fire("setField", "startDate", updatedData, date);
        var endDate = new Date(date.getTime() + duration);
        if (this.appointmentTakesAllDay(target) && !updatedData.allDay && this._workSpace.supportAllDayRow()) {
            endDate = this._workSpace.calculateEndDate(date)
        }
        if (targetAllDay && !this._workSpace.supportAllDayRow() && !this._workSpace.keepOriginalHours()) {
            var dateCopy = new Date(date);
            dateCopy.setHours(0);
            endDate = new Date(dateCopy.getTime() + duration);
            if (0 !== endDate.getHours()) {
                endDate.setHours(this._getCurrentViewOption("endDayHour"))
            }
        }
        this.fire("setField", "endDate", updatedData, endDate);
        this._resourcesManager.setResourcesToItem(updatedData, cellData.groups);
        return updatedData
    },
    _getCoordinates: function(dates, appointmentResources, allDay) {
        var result = [];
        for (var i = 0; i < dates.length; i++) {
            var currentCoords = this._workSpace.getCoordinatesByDateInGroup(dates[i], appointmentResources, allDay);
            for (var j = 0; j < currentCoords.length; j++) {
                extend(currentCoords[j], {
                    startDate: dates[i]
                })
            }
            result = result.concat(currentCoords)
        }
        return result
    },
    _getSingleAppointmentData: function(appointmentData, options) {
        options = options || {};
        var updatedStartDate, appointmentStartDate, $appointment = options.$appointment,
            updatedData = options.skipDateCalculation ? {} : this._getUpdatedData(options),
            resultAppointmentData = extend({}, appointmentData, updatedData),
            allDay = this.fire("getField", "allDay", appointmentData),
            isAllDay = this._workSpace.supportAllDayRow() && allDay,
            startDate = new Date(this.fire("getField", "startDate", resultAppointmentData)),
            endDate = new Date(this.fire("getField", "endDate", resultAppointmentData)),
            appointmentDuration = endDate.getTime() - startDate.getTime(),
            recurrenceRule = this.fire("getField", "recurrenceRule", appointmentData),
            isRecurrence = recurrenceRule && recurrenceUtils.getRecurrenceRule(recurrenceRule).isValid;
        if (typeUtils.isDefined($appointment) && this._needUpdateAppointmentData($appointment)) {
            var apptDataCalculator = this.getRenderingStrategyInstance().getAppointmentDataCalculator();
            if (typeUtils.isFunction(apptDataCalculator)) {
                updatedStartDate = apptDataCalculator($appointment, startDate).startDate
            } else {
                var coordinates = translator.locate($appointment);
                updatedStartDate = new Date(this._workSpace.getCellDataByCoordinates(coordinates, isAllDay).startDate);
                if ($appointment.hasClass("dx-scheduler-appointment-reduced")) {
                    appointmentStartDate = $appointment.data("dxAppointmentStartDate");
                    if (appointmentStartDate) {
                        updatedStartDate = appointmentStartDate
                    }
                }
                if (isRecurrence) {
                    appointmentStartDate = $appointment.data("dxAppointmentSettings") && $appointment.data("dxAppointmentSettings").startDate;
                    if (appointmentStartDate) {
                        updatedStartDate = appointmentStartDate
                    }
                }
                if (!options.skipHoursProcessing) {
                    updatedStartDate.setHours(startDate.getHours(), startDate.getMinutes(), startDate.getSeconds(), startDate.getMilliseconds())
                }
            }
        }
        if (updatedStartDate) {
            this.fire("setField", "startDate", resultAppointmentData, updatedStartDate);
            this.fire("setField", "endDate", resultAppointmentData, new Date(updatedStartDate.getTime() + appointmentDuration))
        }
        return resultAppointmentData
    },
    _needUpdateAppointmentData: function($appointment) {
        return $appointment.hasClass("dx-scheduler-appointment-compact") || $appointment.hasClass("dx-scheduler-appointment-recurrence")
    },
    subscribe: function(subject, action) {
        this._subscribes[subject] = subscribes[subject] = action
    },
    fire: function(subject) {
        var callback = this._subscribes[subject],
            args = Array.prototype.slice.call(arguments);
        if (!typeUtils.isFunction(callback)) {
            throw errors.Error("E1031", subject)
        }
        return callback.apply(this, args.slice(1))
    },
    getTargetCellData: function() {
        return this._workSpace.getDataByDroppableCell()
    },
    _updateAppointment: function(target, appointment, onUpdatePrevented) {
        var updatingOptions = {
            newData: appointment,
            oldData: target,
            cancel: false
        };
        var performFailAction = function(err) {
            if (typeUtils.isFunction(onUpdatePrevented)) {
                onUpdatePrevented.call(this)
            }
            if (err && "Error" === err.name) {
                throw err
            }
        }.bind(this);
        this._actions.onAppointmentUpdating(updatingOptions);
        this._processActionResult(updatingOptions, function(canceled) {
            if (!canceled) {
                this._expandAllDayPanel(appointment);
                try {
                    this._updatedAppointment = appointment;
                    this._appointmentModel.update(target, appointment).always(function(e) {
                        this._executeActionWhenOperationIsCompleted(this._actions.onAppointmentUpdated, appointment, e)
                    }.bind(this)).fail(function() {
                        performFailAction()
                    })
                } catch (err) {
                    performFailAction(err)
                }
            } else {
                performFailAction()
            }
        })
    },
    _processActionResult: function(actionOptions, callback) {
        when(deferredUtils.fromPromise(actionOptions.cancel)).done(callback.bind(this))
    },
    _expandAllDayPanel: function(appointment) {
        if (!this._isAllDayExpanded(this.getFilteredItems()) && this.appointmentTakesAllDay(appointment)) {
            this._workSpace.option("allDayExpanded", true)
        }
    },
    _executeActionWhenOperationIsCompleted: function(action, appointment, e) {
        var options = {
                appointmentData: appointment
            },
            isError = e && "Error" === e.name;
        if (isError) {
            options.error = e
        } else {
            if (this._popup && this._popup.option("visible")) {
                this._popup.hide()
            }
        }
        action(options);
        this._fireContentReadyAction()
    },
    _showAppointmentPopup: function(data, showButtons, processTimeZone) {
        if (!this._popup) {
            this._createPopup(data, processTimeZone)
        }
        var toolbarItems = [],
            showCloseButton = true;
        if (!typeUtils.isDefined(showButtons) || showButtons) {
            toolbarItems = this._getPopupToolbarItems();
            showCloseButton = this._popup.initialOption("showCloseButton")
        }
        this._popup.option({
            toolbarItems: toolbarItems,
            showCloseButton: showCloseButton
        });
        this._initDynamicPopupTemplate(data, processTimeZone);
        this._popup.option(this._popupConfig(data));
        this._popup.show()
    },
    getAppointmentPopup: function() {
        return this._popup
    },
    getAppointmentDetailsForm: function() {
        return this._appointmentForm
    },
    getUpdatedAppointment: function() {
        return this._updatedAppointment
    },
    getAppointmentsInstance: function() {
        return this._appointments
    },
    getResourceManager: function() {
        return this._resourcesManager
    },
    getLayoutManager: function() {
        return this._layoutManager
    },
    getRenderingStrategyInstance: function() {
        return this._layoutManager.getRenderingStrategyInstance()
    },
    getFilteredItems: function() {
        return this._filteredItems
    },
    getActions: function() {
        return this._actions
    },
    appointmentTakesAllDay: function(appointment) {
        return this._appointmentModel.appointmentTakesAllDay(appointment, this._getCurrentViewOption("startDayHour"), this._getCurrentViewOption("endDayHour"))
    },
    _getStartDate: function(appointment, skipNormalize) {
        var startDate = this.fire("getField", "startDate", appointment),
            startDateTimeZone = this.fire("getField", "startDateTimeZone", appointment);
        startDate = dateUtils.makeDate(startDate);
        startDate = this.fire("convertDateByTimezone", startDate, startDateTimeZone);
        !skipNormalize && this.fire("updateAppointmentStartDate", {
            startDate: startDate,
            appointment: appointment,
            callback: function(result) {
                startDate = result
            }
        });
        return startDate
    },
    _getEndDate: function(appointment) {
        var endDate = this.fire("getField", "endDate", appointment);
        if (endDate) {
            var endDateTimeZone = this.fire("getField", "endDateTimeZone", appointment);
            endDate = dateUtils.makeDate(endDate);
            endDate = this.fire("convertDateByTimezone", endDate, endDateTimeZone);
            this.fire("updateAppointmentEndDate", {
                endDate: endDate,
                callback: function(result) {
                    endDate = result
                }
            })
        }
        return endDate
    },
    _getRecurrenceException: function(appointmentData) {
        var recurrenceException = this.fire("getField", "recurrenceException", appointmentData);
        if (recurrenceException) {
            var startDate = this.fire("getField", "startDate", appointmentData),
                exceptions = recurrenceException.split(","),
                startDateTimeZone = this.fire("getField", "startDateTimeZone", appointmentData),
                exceptionByStartDate = this.fire("convertDateByTimezone", startDate, startDateTimeZone);
            exceptions.forEach(function(item, i) {
                exceptions[i] = item.replace(/\s/g, "");
                exceptions[i] = dateSerialization.deserializeDate(exceptions[i]);
                exceptions[i].setHours(exceptionByStartDate.getHours());
                exceptions[i] = dateSerialization.serializeDate(exceptions[i], "yyyyMMddTHHmmss")
            });
            recurrenceException = exceptions.join()
        }
        return recurrenceException
    },
    recurrenceEditorVisibilityChanged: function(visible) {
        if (this._appointmentForm) {
            this._appointmentForm.$element().find("." + RECURRENCE_EDITOR_ITEM_CLASS).toggleClass(RECURRENCE_EDITOR_OPENED_ITEM_CLASS, visible)
        }
    },
    dayHasAppointment: function(day, appointment, trimTime) {
        var startDate = new Date(this.fire("getField", "startDate", appointment)),
            endDate = new Date(this.fire("getField", "endDate", appointment)),
            startDateTimeZone = this.fire("getField", "startDateTimeZone", appointment),
            endDateTimeZone = this.fire("getField", "endDateTimeZone", appointment);
        startDate = this.fire("convertDateByTimezone", startDate, startDateTimeZone);
        endDate = this.fire("convertDateByTimezone", endDate, endDateTimeZone);
        if (day.getTime() === endDate.getTime()) {
            return startDate.getTime() === endDate.getTime()
        }
        if (trimTime) {
            day = dateUtils.trimTime(day);
            startDate = dateUtils.trimTime(startDate);
            endDate = dateUtils.trimTime(endDate)
        }
        var dayTimeStamp = day.getTime(),
            startDateTimeStamp = startDate.getTime(),
            endDateTimeStamp = endDate.getTime();
        return inArray(dayTimeStamp, [startDateTimeStamp, endDateTimeStamp]) > -1 || startDateTimeStamp < dayTimeStamp && endDateTimeStamp > dayTimeStamp
    },
    setTargetedAppointmentResources: function(targetedAppointment, appointmentElement, appointmentIndex) {
        var groups = this._getCurrentViewOption("groups");
        if (groups && groups.length) {
            var getGroups, setResourceCallback, resourcesSetter = this._resourcesManager._dataAccessors.setter,
                workSpace = this._workSpace;
            if (this._isAgenda()) {
                getGroups = function() {
                    var apptSettings = this.getLayoutManager()._positionMap[appointmentIndex];
                    return workSpace._getCellGroups(apptSettings[0].groupIndex)
                };
                setResourceCallback = function(_, group) {
                    resourcesSetter[group.name](targetedAppointment, group.id)
                }
            } else {
                getGroups = function() {
                    var apptPosition = $(appointmentElement).position();
                    return workSpace.getCellDataByCoordinates(apptPosition).groups
                };
                setResourceCallback = function(field, value) {
                    resourcesSetter[field](targetedAppointment, value)
                }
            }
            each(getGroups.call(this), setResourceCallback)
        }
    },
    getStartViewDate: function() {
        return this._workSpace.getStartViewDate()
    },
    getEndViewDate: function() {
        return this._workSpace.getEndViewDate()
    },
    showAppointmentPopup: function(appointmentData, createNewAppointment, currentAppointmentData) {
        var singleAppointment = !currentAppointmentData && appointmentData.length ? this._getSingleAppointmentData(appointmentData) : currentAppointmentData;
        var startDate;
        if (currentAppointmentData) {
            startDate = this.fire("getField", "startDate", currentAppointmentData)
        } else {
            startDate = this.fire("getField", "startDate", appointmentData)
        }
        this._checkRecurringAppointment(appointmentData, singleAppointment, startDate, function() {
            var editing = this._editing;
            if (createNewAppointment) {
                delete this._editAppointmentData;
                editing.allowAdding && this._showAppointmentPopup(appointmentData, true, false)
            } else {
                this._editAppointmentData = appointmentData;
                this._showAppointmentPopup(appointmentData, editing.allowUpdating, true)
            }
        }.bind(this), false, true)
    },
    hideAppointmentPopup: function(saveChanges) {
        if (!this._popup || !this._popup.option("visible")) {
            return
        }
        if (saveChanges) {
            this._saveChanges()
        }
        this._popup.hide()
    },
    showAppointmentTooltip: function(appointmentData, target, currentAppointmentData) {
        if (!appointmentData) {
            return
        }
        currentAppointmentData = currentAppointmentData || appointmentData;
        appointmentTooltip.show(appointmentData, currentAppointmentData, target, this)
    },
    hideAppointmentTooltip: function() {
        appointmentTooltip.hide()
    },
    scrollToTime: function(hours, minutes, date) {
        this._workSpace.scrollToTime(hours, minutes, date)
    },
    addAppointment: function(appointment) {
        var text = this.fire("getField", "text", appointment);
        if (!text) {
            this.fire("setField", "text", appointment, "")
        }
        var addingOptions = {
            appointmentData: appointment,
            cancel: false
        };
        this._actions.onAppointmentAdding(addingOptions);
        this._processActionResult(addingOptions, function(canceled) {
            if (!canceled) {
                this._expandAllDayPanel(appointment);
                this._appointmentModel.add(appointment, {
                    value: this._getTimezoneOffsetByOption(),
                    clientOffset: this.fire("getClientTimezoneOffset")
                }).always(function(e) {
                    this._executeActionWhenOperationIsCompleted(this._actions.onAppointmentAdded, appointment, e)
                }.bind(this))
            }
        })
    },
    updateAppointment: function(target, appointment) {
        this._updateAppointment(target, appointment)
    },
    deleteAppointment: function(appointment) {
        var deletingOptions = {
            appointmentData: appointment,
            cancel: false
        };
        this._actions.onAppointmentDeleting(deletingOptions);
        this._processActionResult(deletingOptions, function(canceled) {
            if (!canceled) {
                this._appointmentModel.remove(appointment).always(function(e) {
                    this._executeActionWhenOperationIsCompleted(this._actions.onAppointmentDeleted, appointment, e)
                }.bind(this))
            }
        })
    },
    focus: function() {
        if (this._editAppointmentData) {
            this._appointments.focus()
        } else {
            this._workSpace.focus()
        }
    }
}).include(AsyncTemplateMixin, DataHelperMixin);
registerComponent("dxScheduler", Scheduler);
module.exports = Scheduler;

});