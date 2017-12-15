sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"apestech/ui/erp/controller/BaseController",
	"sap/ui/Device",
	"sap/m/MessageToast",
	"sap/m/SplitContainer",
	"sap/ui/model/Filter"
], function(JSONModel, BaseController, Device, MessageToast, SplitContainer, Filter) {
	"use strict";

	return BaseController.extend("apestech.ui.erp.controller.demo.demo5", {

		onInit: function() {
			var oModel = this.initTreeModel();
			//get the goods data
			this.getView().setModel(oModel);
		},
		
		onBeforeRendering: function() {
		},

		onAfterRendering: function() {
		},

		onExit: function() {
			if (this._oDialog) {
				this._oDialog.destroy();
			}
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
			
			jQuery.ajax(jQuery.sap.getModulePath("apestech.ui.erp.mockdata", "/products.json"), {
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
        
        onTreeAddRow: function(){
        	var oTable = this.getView().byId("TreeTableBasic");
			var jsonData = oTable.getModel().getData();
			
			//获取选中的行索引
			var iIndex = oTable.getSelectedIndex();
        },
        
        onTreeDeleteRow: function(){
        	
        },
        
        toggleOpenState: function(oEvent){
        	var source = oEvent.getSource();
        	var param = oEvent.getParameters();
        	
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
		
		handleTableSelectDialogPress: function(oEvent){
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("apestech.ui.erp.view..dialog.QueryDialog", this);
			}

			// // Multi-select
			// this._oDialog.setMultiSelect(true);

			// // Remember selections
			// this._oDialog.setRememberSelections(true);

			this.getView().addDependent(this._oDialog);

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oDialog.open();
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
					return oJson;
				});
				MessageToast.show("You have chosen " + list.join(", "));
			}
			oEvent.getSource().getBinding("items").filter([]);
			
			var oModel = this.getView().getModel().getData();
			oModel.selectDialog = JSON.stringify(list);
			
			this.getModel().setData(oModel);
		}
		
	});
}, true);