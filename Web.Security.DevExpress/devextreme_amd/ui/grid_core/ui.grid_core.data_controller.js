define(function (require, exports, module) {/**
 * DevExtreme (ui/grid_core/ui.grid_core.data_controller.js)
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
    ArrayStore = require("../../data/array_store"),
    CustomStore = require("../../data/custom_store"),
    errors = require("../widget/ui.errors"),
    commonUtils = require("../../core/utils/common"),
    each = require("../../core/utils/iterator").each,
    typeUtils = require("../../core/utils/type"),
    extend = require("../../core/utils/extend").extend,
    DataHelperMixin = require("../../data_helper"),
    equalKeys = commonUtils.equalByValue,
    deferredUtils = require("../../core/utils/deferred"),
    when = deferredUtils.when,
    Deferred = deferredUtils.Deferred;
module.exports = {
    defaultOptions: function() {
        return {
            loadingTimeout: 0,
            dataSource: null,
            cacheEnabled: true,
            onDataErrorOccurred: null,
            remoteOperations: "auto",
            paging: {
                enabled: true,
                pageSize: void 0,
                pageIndex: void 0
            }
        }
    },
    controllers: {
        data: modules.Controller.inherit({}).include(DataHelperMixin).inherit(function() {
            var changePaging = function(that, optionName, value) {
                var dataSource = that._dataSource;
                if (dataSource) {
                    if (void 0 !== value) {
                        if (dataSource[optionName]() !== value) {
                            if ("pageSize" === optionName) {
                                dataSource.pageIndex(0)
                            }
                            dataSource[optionName](value);
                            that._skipProcessingPagingChange = true;
                            that.option("paging." + optionName, value);
                            that._skipProcessingPagingChange = false;
                            return dataSource["pageIndex" === optionName ? "load" : "reload"]().done(that.pageChanged.fire.bind(that.pageChanged))
                        }
                        return Deferred().resolve().promise()
                    }
                    return dataSource[optionName]()
                }
                return 0
            };
            var members = {
                init: function() {
                    var that = this;
                    that._items = [];
                    that._columnsController = that.getController("columns");
                    that._columnsChangedHandler = that._handleColumnsChanged.bind(that);
                    that._dataChangedHandler = that._handleDataChanged.bind(that);
                    that._loadingChangedHandler = that._handleLoadingChanged.bind(that);
                    that._loadErrorHandler = that._handleLoadError.bind(that);
                    that._customizeStoreLoadOptionsHandler = that._handleCustomizeStoreLoadOptions.bind(that);
                    that._columnsController.columnsChanged.add(that._columnsChangedHandler);
                    that._isLoading = false;
                    that._isCustomLoading = false;
                    that._changes = [];
                    that.createAction("onDataErrorOccurred");
                    that.dataErrorOccurred.add(function(error) {
                        return that.executeAction("onDataErrorOccurred", {
                            error: error
                        })
                    });
                    that._refreshDataSource()
                },
                callbackNames: function() {
                    return ["changed", "loadingChanged", "dataErrorOccurred", "pageChanged", "dataSourceChanged"]
                },
                callbackFlags: function(name) {
                    if ("dataErrorOccurred" === name) {
                        return {
                            stopOnFalse: true
                        }
                    }
                },
                publicMethods: function() {
                    return ["beginCustomLoading", "endCustomLoading", "refresh", "filter", "clearFilter", "getCombinedFilter", "keyOf", "byKey", "getDataByKeys", "pageIndex", "pageSize", "pageCount", "totalCount", "_disposeDataSource", "getKeyByRowIndex", "getRowIndexByKey", "getDataSource", "getVisibleRows", "repaintRows"]
                },
                optionChanged: function(args) {
                    var that = this;

                    function handled() {
                        args.handled = true
                    }

                    function reload() {
                        that._columnsController.reset();
                        that._items = [];
                        that._refreshDataSource()
                    }
                    if ("dataSource" === args.name && args.name === args.fullName && args.value === args.previousValue) {
                        handled();
                        that.refresh();
                        return
                    }
                    switch (args.name) {
                        case "cacheEnabled":
                        case "loadingTimeout":
                        case "remoteOperations":
                            handled();
                            break;
                        case "keyExpr":
                        case "dataSource":
                        case "scrolling":
                        case "paging":
                            handled();
                            if (!that.skipProcessingPagingChange(args.fullName)) {
                                reload()
                            }
                            break;
                        case "rtlEnabled":
                            reload();
                            break;
                        default:
                            that.callBase(args)
                    }
                },
                isReady: function() {
                    return !this._isLoading
                },
                getDataSource: function() {
                    return this._dataSource && this._dataSource._dataSource
                },
                getCombinedFilter: function(returnDataField) {
                    return this.combinedFilter(void 0, returnDataField)
                },
                combinedFilter: function(filter, returnDataField) {
                    var additionalFilter, that = this,
                        dataSource = that._dataSource,
                        columnsController = that._columnsController;
                    if (dataSource) {
                        if (void 0 === filter) {
                            filter = dataSource.filter()
                        }
                        additionalFilter = that._calculateAdditionalFilter();
                        if (additionalFilter) {
                            if (columnsController.isDataSourceApplied() || columnsController.isAllDataTypesDefined()) {
                                filter = gridCoreUtils.combineFilters([additionalFilter, filter])
                            }
                        }
                        filter = columnsController.updateFilter(filter, returnDataField || dataSource.remoteOperations().filtering)
                    }
                    return filter
                },
                _endUpdateCore: function() {
                    var changes = this._changes;
                    if (changes.length) {
                        this._changes = [];
                        this.updateItems(1 === changes.length ? changes[0] : {})
                    }
                },
                _handleCustomizeStoreLoadOptions: function(e) {
                    var columnsController = this._columnsController,
                        dataSource = this._dataSource,
                        storeLoadOptions = e.storeLoadOptions;
                    if (e.isCustomLoading && !storeLoadOptions.isLoadingAll) {
                        return
                    }
                    storeLoadOptions.filter = this.combinedFilter(storeLoadOptions.filter);
                    if (!columnsController.isDataSourceApplied()) {
                        columnsController.updateColumnDataTypes(dataSource)
                    }
                    this._columnsUpdating = true;
                    columnsController.updateSortingGrouping(dataSource, !this._isFirstLoading);
                    this._columnsUpdating = false;
                    storeLoadOptions.sort = columnsController.getSortDataSourceParameters();
                    storeLoadOptions.group = columnsController.getGroupDataSourceParameters();
                    dataSource.sort(storeLoadOptions.sort);
                    dataSource.group(storeLoadOptions.group);
                    storeLoadOptions.sort = columnsController.getSortDataSourceParameters(!dataSource.remoteOperations().sorting);
                    e.group = columnsController.getGroupDataSourceParameters(!dataSource.remoteOperations().grouping);
                    this._isFirstLoading = false
                },
                _handleColumnsChanged: function(e) {
                    var filterValue, filterValues, filterApplied, that = this,
                        changeTypes = e.changeTypes,
                        optionNames = e.optionNames;
                    var updateItemsHandler = function updateItemsHandler() {
                        that._columnsController.columnsChanged.remove(updateItemsHandler);
                        that.updateItems()
                    };
                    if (changeTypes.sorting || changeTypes.grouping) {
                        if (that._dataSource && !that._columnsUpdating) {
                            that._dataSource.group(that._columnsController.getGroupDataSourceParameters());
                            that._dataSource.sort(that._columnsController.getSortDataSourceParameters());
                            that.reload()
                        }
                    } else {
                        if (changeTypes.columns) {
                            if (optionNames.filterValues || optionNames.filterValue || optionNames.selectedFilterOperation) {
                                filterValue = that._columnsController.columnOption(e.columnIndex, "filterValue");
                                filterValues = that._columnsController.columnOption(e.columnIndex, "filterValues");
                                if (Array.isArray(filterValues) || void 0 === e.columnIndex || typeUtils.isDefined(filterValue) || !optionNames.selectedFilterOperation || optionNames.filterValue) {
                                    that._applyFilter();
                                    filterApplied = true
                                }
                            }
                            if (!that._needApplyFilter && !gridCoreUtils.checkChanges(optionNames, ["width", "visibleWidth", "filterValue", "bufferedFilterValue", "selectedFilterOperation", "filterValues", "filterType"])) {
                                that._columnsController.columnsChanged.add(updateItemsHandler)
                            }
                            if (typeUtils.isDefined(optionNames.visible)) {
                                var column = that._columnsController.columnOption(e.columnIndex);
                                if (column && (typeUtils.isDefined(column.filterValue) || typeUtils.isDefined(column.filterValues))) {
                                    that._applyFilter();
                                    filterApplied = true
                                }
                            }
                        }
                    }
                    if (!filterApplied && changeTypes.filtering) {
                        that.reload()
                    }
                },
                _handleDataChanged: function(e) {
                    var that = this,
                        dataSource = that._dataSource,
                        columnsController = that._columnsController,
                        isAsyncDataSourceApplying = false;
                    if (dataSource && !that._isDataSourceApplying) {
                        that._isDataSourceApplying = true;
                        when(that._columnsController.applyDataSource(dataSource)).done(function() {
                            if (that._isLoading) {
                                that._handleLoadingChanged(false)
                            }
                            if (isAsyncDataSourceApplying && e && e.isDelayed) {
                                e.isDelayed = false
                            }
                            that._isDataSourceApplying = false;
                            var additionalFilter = that._calculateAdditionalFilter(),
                                needApplyFilter = that._needApplyFilter;
                            that._needApplyFilter = false;
                            if (needApplyFilter && additionalFilter && additionalFilter.length && !that._isAllDataTypesDefined) {
                                errors.log("W1005", that.component.NAME);
                                that._applyFilter()
                            } else {
                                that.updateItems(e)
                            }
                        }).fail(function() {
                            that._isDataSourceApplying = false
                        });
                        if (that._isDataSourceApplying) {
                            isAsyncDataSourceApplying = true;
                            that._handleLoadingChanged(true)
                        }
                        that._needApplyFilter = !that._columnsController.isDataSourceApplied();
                        that._isAllDataTypesDefined = columnsController.isAllDataTypesDefined()
                    }
                },
                _handleLoadingChanged: function(isLoading) {
                    this._isLoading = isLoading;
                    this._fireLoadingChanged()
                },
                _handleLoadError: function(e) {
                    this.dataErrorOccurred.fire(e)
                },
                _setPagingOptions: function(dataSource) {
                    var pageIndex = this.option("paging.pageIndex"),
                        pageSize = this.option("paging.pageSize"),
                        pagingEnabled = this.option("paging.enabled"),
                        scrollingMode = this.option("scrolling.mode"),
                        appendMode = "infinite" === scrollingMode,
                        virtualMode = "virtual" === scrollingMode;
                    dataSource.requireTotalCount(!appendMode);
                    if (void 0 !== pagingEnabled) {
                        dataSource.paginate(pagingEnabled || virtualMode || appendMode)
                    }
                    if (void 0 !== pageSize) {
                        dataSource.pageSize(pageSize)
                    }
                    if (void 0 !== pageIndex) {
                        dataSource.pageIndex(pageIndex)
                    }
                },
                _getSpecificDataSourceOption: function() {
                    var dataSource = this.option("dataSource");
                    if (Array.isArray(dataSource)) {
                        return {
                            store: {
                                type: "array",
                                data: dataSource,
                                key: this.option("keyExpr")
                            }
                        }
                    }
                    return dataSource
                },
                _initDataSource: function() {
                    var that = this,
                        dataSource = this.option("dataSource"),
                        oldDataSource = this._dataSource;
                    that.callBase();
                    dataSource = that._dataSource;
                    that._isFirstLoading = true;
                    if (dataSource) {
                        that._setPagingOptions(dataSource);
                        that.setDataSource(dataSource)
                    } else {
                        if (oldDataSource) {
                            that.updateItems()
                        }
                    }
                },
                _loadDataSource: function() {
                    var dataSource = this._dataSource,
                        result = new Deferred;
                    when(this._columnsController.refresh(true)).always(function() {
                        if (dataSource) {
                            dataSource.load().done(result.resolve).fail(result.reject)
                        } else {
                            result.resolve()
                        }
                    });
                    return result.promise()
                },
                _beforeProcessItems: function(items) {
                    return items.slice(0)
                },
                getRowIndexDelta: function() {
                    return 0
                },
                _processItems: function(items, changeType) {
                    var that = this,
                        rowIndexDelta = that.getRowIndexDelta(),
                        visibleColumns = that._columnsController.getVisibleColumns(null, "loadingAll" === changeType),
                        visibleItems = that._items,
                        dataIndex = "append" === changeType && visibleItems.length > 0 ? visibleItems[visibleItems.length - 1].dataIndex + 1 : 0,
                        options = {
                            visibleColumns: visibleColumns,
                            dataIndex: dataIndex
                        },
                        result = [];
                    each(items, function(index, item) {
                        if (typeUtils.isDefined(item)) {
                            options.rowIndex = index - rowIndexDelta;
                            item = that._processItem(item, options);
                            result.push(item)
                        }
                    });
                    return result
                },
                _processItem: function(item, options) {
                    item = this._generateDataItem(item);
                    item = this._processDataItem(item, options);
                    item.dataIndex = options.dataIndex++;
                    return item
                },
                _generateDataItem: function(data) {
                    return {
                        rowType: "data",
                        data: data,
                        key: this.keyOf(data)
                    }
                },
                _processDataItem: function(dataItem, options) {
                    dataItem.values = this.generateDataValues(dataItem.data, options.visibleColumns);
                    return dataItem
                },
                generateDataValues: function(data, columns) {
                    var column, value, values = [];
                    for (var i = 0; i < columns.length; i++) {
                        column = columns[i];
                        value = null;
                        if (column.command) {
                            value = null
                        } else {
                            if (column.calculateCellValue) {
                                value = column.calculateCellValue(data)
                            } else {
                                if (column.dataField) {
                                    value = data[column.dataField]
                                }
                            }
                        }
                        values.push(value)
                    }
                    return values
                },
                _applyChangeUpdate: function(change) {
                    var changeType, that = this,
                        items = change.items,
                        rowIndices = change.rowIndices.slice(0),
                        rowIndexDelta = that.getRowIndexDelta(),
                        prevIndex = -1,
                        rowIndexCorrection = 0;
                    rowIndices.sort(function(a, b) {
                        return a - b
                    });
                    for (var i = 0; i < rowIndices.length; i++) {
                        if (rowIndices[i] < 0) {
                            rowIndices.splice(i, 1);
                            i--
                        }
                    }
                    change.items = [];
                    change.rowIndices = [];
                    change.changeTypes = [];
                    var equalItems = function(item1, item2, strict) {
                        var result = item1 && item2 && equalKeys(item1.key, item2.key);
                        if (result && strict) {
                            result = item1.rowType === item2.rowType && ("detail" !== item2.rowType || item1.isEditing === item2.isEditing)
                        }
                        return result
                    };
                    each(rowIndices, function(index, rowIndex) {
                        var oldItem, newItem, oldNextItem, newNextItem, strict;
                        rowIndex += rowIndexCorrection + rowIndexDelta;
                        if (prevIndex === rowIndex) {
                            return
                        }
                        prevIndex = rowIndex;
                        oldItem = that._items[rowIndex];
                        oldNextItem = that._items[rowIndex + 1];
                        newItem = items[rowIndex];
                        newNextItem = items[rowIndex + 1];
                        strict = equalItems(oldItem, oldNextItem) || equalItems(newItem, newNextItem);
                        if (newItem) {
                            change.items.push(newItem)
                        }
                        if (oldItem && newItem && equalItems(oldItem, newItem, strict)) {
                            changeType = "update";
                            that._items[rowIndex] = newItem;
                            if (oldItem.visible !== newItem.visible) {
                                change.items.splice(-1, 1, {
                                    visible: newItem.visible
                                })
                            }
                        } else {
                            if (newItem && !oldItem || newNextItem && equalItems(oldItem, newNextItem, strict)) {
                                changeType = "insert";
                                that._items.splice(rowIndex, 0, newItem);
                                rowIndexCorrection++
                            } else {
                                if (oldItem && !newItem || oldNextItem && equalItems(newItem, oldNextItem, strict)) {
                                    changeType = "remove";
                                    that._items.splice(rowIndex, 1);
                                    rowIndexCorrection--;
                                    prevIndex = -1
                                } else {
                                    if (newItem) {
                                        changeType = "update";
                                        that._items[rowIndex] = newItem
                                    } else {
                                        return
                                    }
                                }
                            }
                        }
                        change.rowIndices.push(rowIndex - rowIndexDelta);
                        change.changeTypes.push(changeType)
                    })
                },
                _applyChange: function(change) {
                    var that = this;
                    if ("update" === change.changeType) {
                        that._applyChangeUpdate(change)
                    } else {
                        that._items = change.items.slice(0)
                    }
                },
                _updateItemsCore: function(change) {
                    var items, that = this,
                        dataSource = that._dataSource,
                        changeType = change.changeType || "refresh";
                    change.changeType = changeType;
                    if (dataSource) {
                        items = change.items || dataSource.items();
                        items = that._beforeProcessItems(items);
                        items = that._processItems(items, changeType);
                        change.items = items;
                        that._applyChange(change);
                        each(that._items, function(index, item) {
                            item.rowIndex = index
                        })
                    } else {
                        that._items = []
                    }
                },
                updateItems: function(change) {
                    change = change || {};
                    var that = this;
                    if (that._updateLockCount) {
                        that._changes.push(change);
                        return
                    }
                    that._updateItemsCore(change);
                    if (change.cancel) {
                        return
                    }
                    that._fireChanged(change)
                },
                _fireChanged: function(change) {
                    var that = this;
                    commonUtils.deferRender(function() {
                        that.changed.fire(change)
                    })
                },
                isLoading: function() {
                    return this._isLoading || this._isCustomLoading
                },
                _fireLoadingChanged: function() {
                    this.loadingChanged.fire(this.isLoading(), this._loadingText)
                },
                _calculateAdditionalFilter: function() {
                    return null
                },
                _applyFilter: function() {
                    var that = this,
                        dataSource = that._dataSource;
                    if (dataSource) {
                        dataSource.pageIndex(0);
                        return that.reload().done(that.pageChanged.fire.bind(that.pageChanged))
                    }
                },
                filter: function filter(filterExpr) {
                    var dataSource = this._dataSource,
                        filter = dataSource.filter();
                    if (0 === arguments.length) {
                        return dataSource ? dataSource.filter() : void 0
                    }
                    filterExpr = arguments.length > 1 ? Array.prototype.slice.call(arguments, 0) : filterExpr;
                    if (gridCoreUtils.equalFilterParameters(filter, filterExpr)) {
                        return
                    }
                    if (dataSource) {
                        dataSource.filter(filterExpr)
                    }
                    this._applyFilter()
                },
                clearFilter: function(filterName) {
                    var that = this,
                        columnsController = that._columnsController,
                        clearColumnOption = function(optionName) {
                            var index, columnCount = columnsController.columnCount();
                            for (index = 0; index < columnCount; index++) {
                                columnsController.columnOption(index, optionName, void 0)
                            }
                        };
                    that.component.beginUpdate();
                    if (arguments.length > 0) {
                        switch (filterName) {
                            case "dataSource":
                                that.filter(null);
                                break;
                            case "search":
                                that.searchByText("");
                                break;
                            case "header":
                                clearColumnOption("filterValues");
                                break;
                            case "row":
                                clearColumnOption("filterValue")
                        }
                    } else {
                        that.filter(null);
                        that.searchByText("");
                        clearColumnOption("filterValue");
                        clearColumnOption("filterValues")
                    }
                    that.component.endUpdate()
                },
                _fireDataSourceChanged: function() {
                    var that = this;
                    var changedHandler = function changedHandler() {
                        that.changed.remove(changedHandler);
                        that.dataSourceChanged.fire()
                    };
                    that.changed.add(changedHandler)
                },
                _getDataSourceAdapter: commonUtils.noop,
                _createDataSourceAdapterCore: function(dataSource, remoteOperations) {
                    var dataSourceAdapterProvider = this._getDataSourceAdapter(),
                        dataSourceAdapter = dataSourceAdapterProvider.create(this.component);
                    dataSourceAdapter.init(dataSource, remoteOperations);
                    return dataSourceAdapter
                },
                isLocalStore: function(store) {
                    store = store || this.store();
                    return store instanceof ArrayStore
                },
                isCustomStore: function(store) {
                    store = store || this.store();
                    return store instanceof CustomStore
                },
                _createDataSourceAdapter: function(dataSource) {
                    var remoteOperations = this.option("remoteOperations"),
                        store = dataSource.store(),
                        enabledRemoteOperations = {
                            filtering: true,
                            sorting: true,
                            paging: true,
                            grouping: true,
                            summary: true
                        };
                    if (remoteOperations && remoteOperations.groupPaging) {
                        remoteOperations = extend({}, enabledRemoteOperations, remoteOperations)
                    }
                    if ("auto" === remoteOperations) {
                        remoteOperations = this.isLocalStore(store) || this.isCustomStore(store) ? {} : {
                            filtering: true,
                            sorting: true,
                            paging: true
                        }
                    }
                    if (true === remoteOperations) {
                        remoteOperations = enabledRemoteOperations
                    }
                    return this._createDataSourceAdapterCore(dataSource, remoteOperations)
                },
                setDataSource: function(dataSource) {
                    var that = this,
                        oldDataSource = that._dataSource;
                    if (!dataSource && oldDataSource) {
                        oldDataSource.changed.remove(that._dataChangedHandler);
                        oldDataSource.loadingChanged.remove(that._loadingChangedHandler);
                        oldDataSource.loadError.remove(that._loadErrorHandler);
                        oldDataSource.customizeStoreLoadOptions.remove(that._customizeStoreLoadOptionsHandler);
                        oldDataSource.dispose(that._isSharedDataSource)
                    }
                    if (dataSource) {
                        dataSource = that._createDataSourceAdapter(dataSource)
                    }
                    that._dataSource = dataSource;
                    if (dataSource) {
                        that._fireDataSourceChanged();
                        that._isLoading = !dataSource.isLoaded();
                        that._needApplyFilter = true;
                        that._isAllDataTypesDefined = that._columnsController.isAllDataTypesDefined();
                        dataSource.changed.add(that._dataChangedHandler);
                        dataSource.loadingChanged.add(that._loadingChangedHandler);
                        dataSource.loadError.add(that._loadErrorHandler);
                        dataSource.customizeStoreLoadOptions.add(that._customizeStoreLoadOptionsHandler)
                    }
                },
                items: function() {
                    return this._items
                },
                isEmpty: function() {
                    return !this.items().length
                },
                pageCount: function() {
                    return this._dataSource ? this._dataSource.pageCount() : 1
                },
                dataSource: function() {
                    return this._dataSource
                },
                store: function() {
                    var dataSource = this._dataSource;
                    return dataSource && dataSource.store()
                },
                loadAll: function(data) {
                    var that = this,
                        d = new Deferred,
                        dataSource = that._dataSource;
                    if (dataSource) {
                        if (data) {
                            var options = {
                                data: data,
                                isCustomLoading: true,
                                storeLoadOptions: {},
                                loadOptions: {
                                    filter: that.getCombinedFilter(),
                                    group: dataSource.group(),
                                    sort: dataSource.sort()
                                }
                            };
                            dataSource._handleDataLoaded(options);
                            when(options.data).done(function(data) {
                                data = that._beforeProcessItems(data);
                                d.resolve(that._processItems(data, "loadingAll"), options.extra && options.extra.summary)
                            }).fail(d.reject)
                        } else {
                            if (!that.isLoading()) {
                                var loadOptions = extend({}, dataSource.loadOptions(), {
                                    isLoadingAll: true,
                                    requireTotalCount: false
                                });
                                dataSource.load(loadOptions).done(function(items, extra) {
                                    items = that._beforeProcessItems(items);
                                    items = that._processItems(items, "loadingAll");
                                    d.resolve(items, extra && extra.summary)
                                }).fail(d.reject)
                            } else {
                                d.reject()
                            }
                        }
                    } else {
                        d.resolve([])
                    }
                    return d
                },
                getKeyByRowIndex: function(rowIndex) {
                    var item = this.items()[rowIndex];
                    if (item) {
                        return item.key
                    }
                },
                getRowIndexByKey: function(key) {
                    return gridCoreUtils.getIndexByKey(key, this.items())
                },
                keyOf: function(data) {
                    var store = this.store();
                    if (store) {
                        return store.keyOf(data)
                    }
                },
                byKey: function(key) {
                    var result, store = this.store(),
                        rowIndex = this.getRowIndexByKey(key);
                    if (!store) {
                        return
                    }
                    if (rowIndex >= 0) {
                        result = (new Deferred).resolve(this.items()[rowIndex].data)
                    }
                    return result || store.byKey(key)
                },
                key: function() {
                    var store = this.store();
                    if (store) {
                        return store.key()
                    }
                },
                getRowIndexOffset: function() {
                    return 0
                },
                getDataByKeys: function(rowKeys) {
                    var that = this,
                        result = new Deferred,
                        deferreds = [],
                        data = [];
                    each(rowKeys, function(index, key) {
                        deferreds.push(that.byKey(key).done(function(keyData) {
                            data[index] = keyData
                        }))
                    });
                    when.apply($, deferreds).always(function() {
                        result.resolve(data)
                    });
                    return result
                },
                pageIndex: function(value) {
                    return changePaging(this, "pageIndex", value)
                },
                pageSize: function(value) {
                    return changePaging(this, "pageSize", value)
                },
                beginCustomLoading: function(messageText) {
                    this._isCustomLoading = true;
                    this._loadingText = messageText || "";
                    this._fireLoadingChanged()
                },
                endCustomLoading: function() {
                    this._isCustomLoading = false;
                    this._loadingText = void 0;
                    this._fireLoadingChanged()
                },
                refresh: function() {
                    var that = this,
                        d = new Deferred;
                    when(this._columnsController.refresh()).always(function() {
                        when(that.reload(true)).done(d.resolve).fail(d.reject)
                    });
                    return d
                },
                getVisibleRows: function() {
                    return this.items()
                },
                _disposeDataSource: function() {
                    this.setDataSource(null)
                },
                repaintRows: function(rowIndexes) {
                    rowIndexes = Array.isArray(rowIndexes) ? rowIndexes : [rowIndexes];
                    if (rowIndexes.length > 1 || typeUtils.isDefined(rowIndexes[0])) {
                        this.updateItems({
                            changeType: "update",
                            rowIndices: rowIndexes
                        })
                    }
                },
                skipProcessingPagingChange: function(fullName) {
                    return this._skipProcessingPagingChange && ("paging.pageIndex" === fullName || "paging.pageSize" === fullName)
                },
                getUserState: function() {
                    return {
                        searchText: this.option("searchPanel.text"),
                        pageIndex: this.pageIndex(),
                        pageSize: this.pageSize()
                    }
                }
            };
            gridCoreUtils.proxyMethod(members, "load");
            gridCoreUtils.proxyMethod(members, "reload");
            gridCoreUtils.proxyMethod(members, "itemsCount", 0);
            gridCoreUtils.proxyMethod(members, "totalItemsCount", 0);
            gridCoreUtils.proxyMethod(members, "hasKnownLastPage", true);
            gridCoreUtils.proxyMethod(members, "isLoaded", true);
            gridCoreUtils.proxyMethod(members, "totalCount", 0);
            return members
        }())
    }
};

});