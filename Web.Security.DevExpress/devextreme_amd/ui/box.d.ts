/**
* DevExtreme (ui/box.d.ts)
* Version: 18.1.6
* Build date: Mon Sep 03 2018
*
* Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import DevExpress from '../bundles/dx.all';

declare global {
interface JQuery {
    dxBox(): JQuery;
    dxBox(options: "instance"): DevExpress.ui.dxBox;
    dxBox(options: string): any;
    dxBox(options: string, ...params: any[]): any;
    dxBox(options: DevExpress.ui.dxBoxOptions): JQuery;
}
}
export default DevExpress.ui.dxBox;
export type IOptions = DevExpress.ui.dxBoxOptions;