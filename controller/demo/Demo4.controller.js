sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"apestech/ui/erp/controller/BaseController",
	"sap/ui/Device",
	"sap/m/MessageToast",
	"sap/m/SplitContainer",
	"sap/ui/model/Filter"
], function(JSONModel, BaseController, Device, MessageToast, SplitContainer, Filter) {
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
		},
		
		handleTableSelectDialogPress: function(oEvent){
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("apestech.ui.erp.view.dialog.ExtendDialog", this);
			}

			// Multi-select
			// this._oDialog.setMultiSelect(true);

			// Remember selections
			// this._oDialog.setRememberSelections(true);

			this.getView().addDependent(this._oDialog);

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oDialog.open();
		},
		
		onPress:function(oEvent){
			var oThisView = this.getView(); 
			var oPageData = oThisView.getModel().getData();
		   	MessageToast.show(JSON.stringify(oPageData));
		   	
		   	var oModel = new JSONModel();
		   	jQuery.ajax(jQuery.sap.getModulePath("apestech.ui.erp.mockdata", "/products.json"), {
				dataType: "json",
				success: function (oData) {
					oModel.setData(oData);
					
					oThisView.setModel(oModel);
				},
				error: function () {
					jQuery.sap.log.error("failed to load json");
				}
			});
			
		},
		
		onConfirmDialog: function(oEvent){

			//获取弹出层的数据
		    var oControls=this._oDialog.getContent();
		    var oTable= oControls[2];
			var aIndices = oTable.getSelectedIndices();
			var sMsg;
			if (aIndices.length < 1) {
				sMsg = "no item selected";
			} else {
				sMsg = aIndices;
			}
			MessageToast.show(sMsg);
			
			this._oDialog.close();	
		},
		
	    onCloseDialog:function(){
	        this._oDialog.close();
	    },
		
		handleSearch: function(oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("Name", sap.ui.model.FilterOperator.Contains, sValue);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},

		handleClose: function(oEvent) {
			var aContexts = oEvent.getParameter("selectedContexts");
			
			var list=[];
			if (aContexts && aContexts.length) {
				list = aContexts.map(function(oContext){
					var oJson = oContext.getObject();
					return oJson.ProductId;
				});
				MessageToast.show("You have chosen " + list.join(", "));
			}
			oEvent.getSource().getBinding("items").filter([]);
			
			var oModel = this.getView().getModel().getData();
			oModel.selectDialog = list.toLocaleString();
			
			this.getModel().setData(oModel);
		}
	});
}, true);