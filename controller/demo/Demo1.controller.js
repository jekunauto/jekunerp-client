sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"apestech/ui/erp/controller/BaseController",
	"sap/ui/Device",
	"sap/m/MessageToast",
	"sap/m/SplitContainer",
	"sap/ui/core/format/DateFormat"
], function (JSONModel, BaseController, Device, MessageToast, SplitContainer, DateFormat) {
	"use strict";

	return BaseController.extend("apestech.ui.erp.controller.demo.demo1", {
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
      		
      		var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("demo1").attachPatternMatched(this._onObjectMatched, this);
		},
		
		_onObjectMatched: function(oEvent){
			var oParam = oEvent.getParameter("arguments");
			this.getView().setModel(oParam, "Params");
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
		
		onBeforeRendering: function () {
			if (Device.system.desktop && this._oSplitContainer) {
				this._oSplitContainer.setMode("HideMode");
				this._oSplitContainer.hideMaster();
			}
			
			console.log(this.getView().getModel("Params"));
		},
		handleLink1Press: function (oEvent) {
			 this.getMessagesBox().showDefaultMessage("Page 1 a very long link clicked");
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
			this.getMessagesBox().showWarningMessage("You are sure to save the order's Data!");
			console.log(this.getView().getModel().getData());
		},

		showErrorMessage: function(){
			this.getMessagesBox().showErrorMessage("Yur are sure to reject the order's data");
		},
		
		showSuccessMessage: function(){
			this.getMessagesBox().showSuccessMessage("If you see this message, the order's is saved into the DataBase");
		},
		
		handleSelectionChange: function(oEvent) {
			var changedItem = oEvent.getParameter("changedItem");
			var isSelected = oEvent.getParameter("selected");

			var state = "Selected";
			if (!isSelected) {
				state = "Deselected";
			}

			MessageToast.show("Event 'selectionChange': " + state + " '" + changedItem.getText() + "'", {
				width: "auto"
			});
		},

		handleSelectionFinish: function(oEvent) {
			var selectedItems = oEvent.getParameter("selectedItems");
			var messageText = "Event 'selectionFinished': [";

			for (var i = 0; i < selectedItems.length; i++) {
				messageText += "'" + selectedItems[i].getText() + "'";
				if (i != selectedItems.length - 1) {
					messageText += ",";
				}
			}

			messageText += "]";

			MessageToast.show(messageText, {
				width: "auto"
			});
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
		
		onSwitchChange: function(oEvent) {
			var switchState = oEvent.getParameter("state");	//获取 switch 的状态
			var oName = this.getView().byId("name");
			oName.setEditable(switchState);			//设置 ipnut 不可以编辑
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
		
		handleChange:function(oEvent){
			var bValid = oEvent.getParameter("valid");
			var oDRS = oEvent.oSource;
			if (bValid) {
				oDRS.setValueState(sap.ui.core.ValueState.None);
			} else {
				oDRS.setValueState(sap.ui.core.ValueState.Error);
			}
		},
		
		getSelectedIndices: function (oEvent) {
			var aIndices = this.getView().byId("table1").getSelectedIndices();
			var sMsg;
			if (aIndices.length < 1) {
				sMsg = "no item selected";
			} else {
				sMsg = aIndices;
			}
			MessageToast.show(sMsg);
		},
		
		onGridSwitchChange:function(oEvent){
			var switchState = oEvent.getParameter("state");	//获取 switch 的状态
			/* 隐藏列的方法*/
			var oTableColumnQuantity = this.getView().byId("Quantity");
			oTableColumnQuantity.setVisible(switchState);
		},
		
		addGridRow: function(oEvent){
			var oTable = this.getView().byId("table1");
			var jsonData = oTable.getModel().getData();
			var productData = jsonData.ProductCollection;
			
			productData.push({});
			oTable.getModel().setData(jsonData);
		},
		
		deleteGridRow: function(oEvent){
			var aIndices = this.getView().byId("table1").getSelectedIndices();
			if (aIndices.length > 1) {
				
				var oTable = this.getView().byId("table1");
				var jsonData = oTable.getModel().getData();
				var productDataArray = jsonData.ProductCollection;
				
				var filtered = productDataArray.filter(function(data, index){
					if( aIndices.includes( index ) ){
						return false;
					}else{
						return true;
					}
				});
				
				jsonData.ProductCollection = filtered;
				oTable.getModel().setData(jsonData);
			}
		}
	});
}, true);