sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller"
], function (JSONModel, Controller) {
	"use strict";
	return Controller.extend("apestech.ui.erp.controller.retailOrders.Main1", {
		onInit: function () {
			
			var oData = {"jobClassification": "Senior Ui Developer (UIDEV-SR)"};
			var oModel = new JSONModel(oData);
        	this.getView().setModel(oModel);
		},
		handleChange: function (oEvent) {
			var oDP = oEvent.oSource;
			var bValid = oEvent.getParameter("valid");
			
			this.byId("DP1").setMinDate(new Date(2017, 11, 1));
			this.byId("DP1").setMaxDate(new Date(2017, 11, 15));
			
			this._iEvent++;
			if (bValid) {
				oDP.setValueState(sap.ui.core.ValueState.None);
			} else {
				oDP.setValueState(sap.ui.core.ValueState.Error);
			}
		},
		onSubmit:function(){
			console.log("提交"); 
			console.log(this.getView().getModel().oData);
		}
	});
}, true);