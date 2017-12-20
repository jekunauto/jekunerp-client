/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([  
 	"jquery.sap.global",
 	"jquery.sap.storage",
    "sap/ui/core/UIComponent",
	"sap/ui/Device",
	"apestech/ui/erp/model/models",
	"apestech/ui/erp/controller/ErrorHandler",
	"sap/ui/model/json/JSONModel",
	"apestech/ui/erp/util/ModuleRouter",
	"apestech/ui/erp/controller/util/ConfigUtil",
	"apestech/ui/erp/controller/util/MessageUtils",
	"apestech/ui/erp/model/AuthGuard"
], function (jQuery,storage,UIComponent, Device, models, ErrorHandler, JSONModel, ModuleRouter, ConfigUtil, MessageUtils,AuthGuard) {
	"use strict";

	var aTreeContent = [],
		iTreeModelLimit = 1000000; 

	return UIComponent.extend("apestech.ui.erp.Component", {

		metadata: {
			manifest: "json",
			includes: [
				"css/style.css",
				"thirdparty/google-code-prettify/prettify.css",
				"thirdparty/google-code-prettify/prettify.js",
				"thirdparty/google-code-prettify/lang-css.js"
			]
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * In this method, the device models are set and the router is initialized.
		 * @public
		 * @override
		 */
		init: function () {
            // This promise will be resolved when the api-based models (libsData, treeData) have been loaded
			this._modelsPromise = null;

			this._oErrorHandler = new ErrorHandler(this);
			
			this._MessageUtils = new MessageUtils(this);
			//var store = jQuery.sap.storage(oStorage, sIdPrefix);
			//this._Storage =  jQuery.sap.storage(oStorage, sIdPrefix);   
			
            this._SessionStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session,'jekun');
			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			// set the global tree data
			this.setModel(new JSONModel(), "treeData");

			// call the base component's init function and create the App view
			UIComponent.prototype.init.apply(this, arguments);

			// create the views based on the url/hash
			this.getRouter().initialize();

			if (Device.system.desktop) {
				// Preload API Info on desktop for faster startup
				this.fetchMenuInfoAndBindModels.bind(this);
			}
           
                  
			// Prevents inappropriate focus change which causes ObjectPage to scroll,
			// thus text can be selected and copied
			// sap.m.TablePopin.prototype.onfocusin = function () { };
		},

		/**
		 * The component is destroyed by UI5 automatically.
		 * In this method, the ListSelector and ErrorHandler are destroyed.
		 * @public
		 * @override
		 */
		destroy: function () {
			this._oErrorHandler.destroy();
			this._MessageUtils.destroy();
			this._oConfigUtil.destroy();
			this._oConfigUtil = null;
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
		},

		/**
		 * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
		 * design mode class should be set, which influences the size appearance of some controls.
		 * @public
		 * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
		 */
		getContentDensityClass: function () {
			if (this._sContentDensityClass === undefined) {
				// check whether FLP has already set the content density class; do nothing in this case
				if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
					this._sContentDensityClass = "";
				}
				// The default density class for the sap.ui.documentation project will be compact
				this._sContentDensityClass = "sapUiSizeCompact";
			}
			return this._sContentDensityClass;
		},
		getSessionStorage: function(){
			if (!this._SessionStorage) {
				this._SessionStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session,'jekun'); 
			}
			return this._SessionStorage;
		},
		/**
		 * 消息
		 */
		getMessageUtils: function(){
			if (!this._MessageUtils) {
				this._MessageUtils = new MessageUtils(this);
			}
			return this._MessageUtils;
		},

		/**
		 * 配置工具 .
		 * @public
		 * @return {apestech.ui.erp.controller.util.ConfigUtil} 
		 */
		getConfigUtil: function () {
			if (!this._oConfigUtil) {
				this._oConfigUtil = new ConfigUtil(this);
			}
			return this._oConfigUtil;
		} ,
		
		 hasLogin: function () {
			return new Promise(function (resolve) {
				 //do something
				resolve(true);
			}.bind(this));
		},

		fetchMenuInfoAndBindModels: function () {
			if (this._modelsPromise) {
				return this._modelsPromise;
			}

			this._modelsPromise = new Promise(function (resolve) {

				aTreeContent = [{
				    "text": "会员管理",
				    "name": "CRM",
				    "isSelected": false,
				    "icon": "sap-icon://employee",
				    "nodes": [{
				        "text": "会员信息录入",
				        "name": "vipInfoEntry",
				        "icon": "sap-icon://add-employee",
				        "isSelected": false
				     }]
				}, {
				    "text": "服务管理",
				    "name": "SER",
				    "isSelected": false,
				    "icon": "sap-icon://attachment-audio",
				    "nodes": [{
				        "text": "服务单",
				        "name": "serviceOrders",
				        "icon": "sap-icon://building",
				        "isSelected": false
				     }]
				}, {
				    "text": "模版界面",
				    "name": "DEMO",
				    "isSelected": false,
				    "icon": "sap-icon://attachment-html",
				    "nodes": [{
				        "text": "模版界面1",
				        "name": "demo1",
				        "icon": "sap-icon://attachment-html",
				        "isSelected": false
				     }, {
				        "text": "模版界面2",
				        "name": "demo2",
				        "icon": "sap-icon://attachment-html",
				        "isSelected": false
				     }, {
				        "text": "模版界面3",
				        "name": "demo3",
				        "icon": "sap-icon://attachment-html",
				        "isSelected": false
				     }, {
				        "text": "模版界面4",
				        "name": "demo4",
				        "icon": "sap-icon://attachment-html",
				        "isSelected": false
				     }, {
				        "text": "模版界面5",
				        "name": "demo5",
				        "icon": "sap-icon://attachment-html",
				        "isSelected": false
				     }, {
				        "text": "模版界面6",
				        "name": "demo6",
				        "icon": "sap-icon://attachment-html",
				        "isSelected": false
				     }]
				}];

				this._bindTreeModel(aTreeContent);
				resolve();
			}.bind(this));

			return this._modelsPromise;
		},


		_bindTreeModel: function (bTreeContent) {
			var treeModel = this.getModel("treeData");
			treeModel.setSizeLimit(iTreeModelLimit);
			treeModel.setData(bTreeContent, false);
		}

	});
}
);