/**
* DevExtreme (ui/progress_bar.d.ts)
* Version: 18.1.6
* Build date: Mon Sep 03 2018
*
* Copyright (c) 2012 - 2018 Developer Express Inc. ALL RIGHTS RESERVED
* Read about DevExtreme licensing here: https://js.devexpress.com/Licensing/
*/
import DevExpress from '../bundles/dx.all';

declare global {
interface JQuery {
    dxProgressBar(): JQuery;
    dxProgressBar(options: "instance"): DevExpress.ui.dxProgressBar;
    dxProgressBar(options: string): any;
    dxProgressBar(options: string, ...params: any[]): any;
    dxProgressBar(options: DevExpress.ui.dxProgressBarOptions): JQuery;
}
}
export default DevExpress.ui.dxProgressBar;
export type IOptions = DevExpress.ui.dxProgressBarOptions;