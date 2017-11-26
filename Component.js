/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"jekunauto/ui/erp/model/models",
	"jekunauto/ui/erp/controller/ErrorHandler",
	"sap/ui/model/json/JSONModel",
	"jekunauto/ui/erp/util/DocumentationRouter",
	"jekunauto/ui/erp/controller/util/ConfigUtil"
], function (jQuery, UIComponent, Device, models, ErrorHandler, JSONModel, DocumentationRouter, ConfigUtil) {
	"use strict";

	var aTreeContent = [],
		iTreeModelLimit = 1000000;

	return UIComponent.extend("jekunauto.ui.erp.Component", {

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

		/**
		 * 配置工具 .
		 * @public
		 * @return {jekunauto.ui.erp.controller.util.ConfigUtil} 
		 */
		getConfigUtil: function () {
			if (!this._oConfigUtil) {
				this._oConfigUtil = new ConfigUtil(this);
			}
			return this._oConfigUtil;
		},
		
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
				if (aTreeContent.length > 0) {
					aTreeContent.push({
						isSelected: false,
						name: "experimental",
						ref: "#/api/experimental",
						text: "Experimental APIs"
					}, {
							isSelected: false,
							name: "deprecated",
							ref: "#/api/deprecated",
							text: "Deprecated APIs"
						});
				}
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