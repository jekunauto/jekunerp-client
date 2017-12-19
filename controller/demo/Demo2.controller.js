sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"apestech/ui/erp/controller/BaseController",
	"sap/ui/Device",
	"sap/m/MessageToast",
	"sap/m/SplitContainer"
], function (JSONModel, BaseController, Device, MessageToast, SplitContainer) {
	"use strict";

	return BaseController.extend("apestech.ui.erp.controller.demo.demo2", {
		
		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("demo1").attachPatternMatched(this._onObjectMatched, this);
		},
		
		_onObjectMatched: function(oEvent){
			var oParam = oEvent.getParameter("arguments");
			this.getView().setModel(oParam, "Params");
		},
		
		onBeforeRendering: function () {
			console.log(this.getView().getModel("Params"));
		}
	});
}, true);