sap.ui.define(["sap/uxap/BlockBase"], function (BlockBase) {
	"use strict";
	var retailOrdersMain = BlockBase.extend("apestech.ui.erp.controller.retailOrders.Main", {
		metadata: {
			views: {
				Collapsed: {
					viewName: "apestech.ui.erp.view.retailOrders.Main",
					type: "XML"
				},
				Expanded: {
					viewName: "apestech.ui.erp.view.retailOrders.Main",
					type: "XML"
				}
			}
		}
	});
	return retailOrdersMain;
}, true);