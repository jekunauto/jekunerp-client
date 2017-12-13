sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"apestech/ui/erp/controller/BaseController",
	"sap/ui/Device",
	"sap/m/MessageToast",
	"sap/m/SplitContainer",
	"sap/ui/core/format/DateFormat"
], function(JSONModel, BaseController, Device, MessageToast, SplitContainer, DateFormat) {
	"use strict";

	return BaseController.extend("apestech.ui.erp.controller.checkoutDesk", {

		onInit: function() {
			var oModel = this.initTreeModel();
			//get the goods data
			this.getView().setModel(oModel);
		},
		
		initTreeModel: function(){
			var oModel = new JSONModel();
			jQuery.ajax(jQuery.sap.getModulePath("apestech.ui.erp.mockdata", "/Clothing.json"), {
				dataType: "json",
				success: function (oData) {
					oModel.setData(oData);
				},
				error: function () {
					jQuery.sap.log.error("failed to load json");
				}
			});
			
			return oModel;
		},
		
		onCollapseAll: function () {
            var oTreeTable = this.getView().byId("TreeTableBasic");
            oTreeTable.collapseAll();
        },

        onExpandFirstLevel: function () {
            var oTreeTable = this.getView().byId("TreeTableBasic");
            oTreeTable.expandToLevel(1);
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