sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"apestech/ui/erp/controller/BaseController",
	"sap/ui/Device",
	"sap/m/MessageToast",
	"sap/m/Dialog",
	"sap/m/SplitContainer",
	"sap/ui/core/format/DateFormat",
	'sap/m/GroupHeaderListItem'
], function(JSONModel, BaseController, Device, MessageToast,Dialog, SplitContainer, DateFormat, GroupHeaderListItem) {
	"use strict";

	return BaseController.extend("apestech.ui.erp.controller.demo.demo6", {

		onInit: function() {
			//get the goods data
			var oProductJson = this.initSampleDataModel();
			this.getView().setModel(oProductJson);
		},
		
		initSampleDataModel : function() {
			var oModel = new JSONModel();
			var oDateFormat = DateFormat.getDateInstance({source: {pattern: "timestamp"}, pattern: "dd/MM/yyyy"});

			jQuery.ajax(jQuery.sap.getModulePath("apestech.ui.erp.mockdata", "/products.json"), {
				dataType: "json",
				success: function (oData) {
					var aTemp1 = [];
					var aTemp2 = [];
					var aSuppliersData = [];
					var aCategoryData = [];
					for (var i = 0; i < oData.ProductCollection.length; i++) {
						var oProduct = oData.ProductCollection[i];
						if (oProduct.SupplierName && jQuery.inArray(oProduct.SupplierName, aTemp1) < 0) {
							aTemp1.push(oProduct.SupplierName);
							aSuppliersData.push({Name: oProduct.SupplierName});
						}
						if (oProduct.Category && jQuery.inArray(oProduct.Category, aTemp2) < 0) {
							aTemp2.push(oProduct.Category);
							aCategoryData.push({Name: oProduct.Category});
						}
						oProduct.DeliveryDate = (new Date()).getTime() - (i % 10 * 4 * 24 * 60 * 60 * 1000);
						oProduct.DeliveryDateStr = oDateFormat.format(new Date(oProduct.DeliveryDate));
						oProduct.Heavy = oProduct.WeightMeasure > 1000 ? "true" : "false";
						oProduct.Available = oProduct.Status == "Available" ? true : false;
					}

					oData.Suppliers = aSuppliersData;
					oData.Categories = aCategoryData;

					oModel.setData(oData);
				},
				error: function () {
					jQuery.sap.log.error("failed to load json");
				}
			});

			return oModel;
		},
		
		formatAvailableToObjectState : function (bAvailable) {
			return bAvailable ? "Success" : "Error";
		},
		
		formatAvailableToIcon : function(bAvailable) {
			return bAvailable ? "sap-icon://accept" : "sap-icon://decline";
		},
		
		getGroupHeader: function(oGroup){
			return new GroupHeaderListItem( {
				title: oGroup.key,
				upperCase: false
			} );
		},
		onDialogPress: function(oEvent){
		    if (!this._oDialog) {
			 	this._oDialog = sap.ui.xmlfragment("apestech.ui.erp.view..dialog.MyDialog", this);
			}
			// Multi-select if required
		    //var bMultiSelect = !!oEvent.getSource().data("multi");
		    //bMultiSelect=true;
		    //this._oDialog.setMultiSelect(bMultiSelect);

			// Remember selections if required
			var bRemember = !!oEvent.getSource().data("remember");
			this._oDialog.setRememberSelections(bRemember);

			this.getView().addDependent(this._oDialog);

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oDialog.open();
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
			MessageToast.show("You have chosen1111 " + JSON.stringify(list));
			this.getModel().setData(oModel);
		},
		onExit: function() {
			this.oModel.destroy();
		}
	});
}, true);