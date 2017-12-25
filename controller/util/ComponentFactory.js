/*Dynamic Form */
sap.ui.define([
		"sap/ui/base/Object"
	], function(UI5Object) {
	"use strict";

	return UI5Object.extend("apestech.ui.erp.controller.ComponentFactory", {

		constructor : function (oComponent) {
			this._oComponent = oComponent;
			this._oModel = oComponent.getModel();
			this._bMessageOpen = false;
			this._sErrorText = "Sorry, a technical error occurred! Please try again later.";
		},
		
		/**
		 * create Form Element
		 */
		createFormElement: function(oFormElement){
			var oTempForm = {} ;
			if( oFormElement.type === "Input" ){
				oTempForm = new sap.m.Input(oFormElement.attr);
			}else if( oFormElement.type === "DatePicker" ){
				oTempForm = new sap.m.DatePicker(oFormElement.attr);
			}else if( oFormElement.type === "TimePicker" ){
				oTempForm = new sap.m.TimePicker(oFormElement.attr);	
			}else{
				oTempForm = new sap.m.Input({"placehold":"{i18n>empty}"});
			}
			
			var oTempFormElement = new sap.ui.layout.form.FormElement({
				label : oFormElement.label,
				fields:[oTempForm]
			});
			return oTempFormElement;
		},
		
		/**
		 * create Form 
		 */
		createForm: function(viewId, aFormElementData){
			//生成表单
			var oDynamicForm = new sap.ui.layout.form.Form( viewId +"_DynamicForm", {editable: true});

			//设置表单的布局
			var oLayout1 = new sap.ui.layout.form.ResponsiveGridLayout( viewId +"_DialogLayout",{
				adjustLabelSpan: false,
				labelSpanXL: 2, labelSpanL: 2, labelSpanM: 2, labelSpanS: 1,
				emptySpanXL: 0, emptySpanL: 0, emptySpanM: 0, emptySpanS: 0,
				columnsXL: 2, columnsL: 2, columnsM: 2, columnsS: 1,
				singleContainerFullSize:true
			});
			oDynamicForm.setLayout(oLayout1);
			
			//计算传入的数据的大小，分两个Container显示
			var iLength = aFormElementData.length;
			var iSplit = Math.ceil(iLength/2);
			
			//表单增加FormContainer
			oDynamicForm.addFormContainer( new sap.ui.layout.form.FormContainer( viewId + "_Container1") );
			oDynamicForm.addFormContainer( new sap.ui.layout.form.FormContainer( viewId + "_Container2") );
			
			var aFormContainers = oDynamicForm.getFormContainers();
			for(var j=0, length=aFormElementData.length; j<length; j++){
				var oFromElement = aFormElementData[j];
				if(j < iSplit){
					aFormContainers[0].addFormElement( this.createFormElement(oFromElement) );
				}else{
					aFormContainers[1].addFormElement( this.createFormElement(oFromElement) );
				}
			}
			return oDynamicForm;
		}
	});
	
});