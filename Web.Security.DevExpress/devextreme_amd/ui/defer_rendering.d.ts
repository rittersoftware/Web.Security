/**
* DevExtreme (ui/defer_rendering.d.ts)
* Version: 18.1.6
* Build date: Mon Sep 03 2018
*
* Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import DevExpress from '../bundles/dx.all';

declare global {
interface JQuery {
    dxDeferRendering(): JQuery;
    dxDeferRendering(options: "instance"): DevExpress.ui.dxDeferRendering;
    dxDeferRendering(options: string): any;
    dxDeferRendering(options: string, ...params: any[]): any;
    dxDeferRendering(options: DevExpress.ui.dxDeferRenderingOptions): JQuery;
}
}
export default DevExpress.ui.dxDeferRendering;
export type IOptions = DevExpress.ui.dxDeferRenderingOptions;