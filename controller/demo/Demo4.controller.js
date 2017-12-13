sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"apestech/ui/erp/controller/BaseController",
	"sap/ui/Device",
	"sap/m/MessageToast",
	"sap/m/SplitContainer",
	"sap/ui/core/format/DateFormat"
], function(JSONModel, BaseController, Device, MessageToast, SplitContainer, DateFormat) {
	"use strict";

	return BaseController.extend("apestech.ui.erp.controller.demo.demo4", {

		onInit: function() {
			//get the goods data
			var jsonModel = new JSONModel();
			this.getView().setModel(jsonModel);
		},
		
		formatAvailableToObjectState : function (bAvailable) {
			return bAvailable ? "Success" : "Error";
		},
		
		formatAvailableToIcon : function(bAvailable) {
			return bAvailable ? "sap-icon://accept" : "sap-icon://decline";
		},
		
		showConfirm: function(){
			var viewObject = this; 
			this.getMessagesBox().showConfirmMessage({
				text :"确认保存数据?",
				confirm: function(){
					console.log(viewObject.getView().getModel().getData());
				},
				cancel: function(){
					
				}
			});
		},
		
		onExit: function() {
			this.oModel.destroy();
		}
	});
}, true);