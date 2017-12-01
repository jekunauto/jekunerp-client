sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"apestech/ui/erp/controller/BaseController",
	"sap/ui/Device",
	"sap/m/MessageToast",
	"sap/m/SplitContainer",
	"sap/ui/core/format/DateFormat"
], function (JSONModel, BaseController, Device, MessageToast, SplitContainer, DateFormat) {
	"use strict";

	return BaseController.extend("apestech.ui.erp.controller.retailOrders", {
		onInit: function () {
			//by default we always show the master
			if (Device.system.desktop) {
				this._oSplitContainer = sap.ui.getCore().byId("splitApp");
				if (this._oSplitContainer) {
					this._oSplitContainer.backToPage = this._back.bind(this._oSplitContainer);
				}
			}
			
			var oData = {};
        	var oProductJson = this.initSampleDataModel();
        	// oData = $.extend(oData, oProductJson);
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
		}
		,
		onBeforeRendering: function () {
			if (Device.system.desktop && this._oSplitContainer) {
				this._oSplitContainer.setMode("HideMode");
				this._oSplitContainer.hideMaster();
			}
		},
		handleLink1Press: function (oEvent) {
			MessageToast.show("Page 1 a very long link clicked");
		},
		handleLink2Press: function (oEvent) {
			MessageToast.show("Page 2 long link clicked");
		},
		_back: function () {
			this.setMode("ShowHideMode");
			this.showMaster();
			SplitContainer.prototype.backToPage.apply(this, arguments);
		},
		onSubmit: function(){
			console.log(this.getView().getModel().oData);
		},
		formatAvailableToObjectState : function (bAvailable) {
			return bAvailable ? "Success" : "Error";
		},

		formatAvailableToIcon : function(bAvailable) {
			return bAvailable ? "sap-icon://accept" : "sap-icon://decline";
		},
		handleDetailsPress : function(oEvent) {
			MessageToast.show("Details for product with id " + this.getView().getModel().getProperty("ProductId", oEvent.getSource().getBindingContext()));
		},
		

	});
}, true);