/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/*global history */
sap.ui.define([
		"apestech/ui/erp/controller/BaseController",
		"sap/m/library",
		"sap/ui/Device"
	], function (BaseController, mobileLibrary, Device) {
		"use strict";

		return BaseController.extend("apestech.ui.erp.controller.Home", {

			/**
			 * Called when the controller is instantiated.
			 * @public
			 */
			onInit: function () {
				this.getRouter().getRoute("home").attachPatternMatched(this._onMatched, this);

				// manually call the handler once at startup as device API won't do this for us
				this._onOrientationChange({
					landscape: Device.orientation.landscape
				});
			},

			/**
			 * Called before the view is rendered.
			 * @public
			 */
			onBeforeRendering: function() {
				this._deregisterOrientationChange();
			},

			/**
			 * Called after the view is rendered.
			 * @public
			 */
			onAfterRendering: function() {
				this._registerOrientationChange();
			},

			/**
			 * Called when the controller is destroyed.
			 * @public
			 */
			onExit: function() {
				this._deregisterOrientationChange();
			},

			/**
			 * Opens the control's details page
			 * @param event
			 */
			navigateToDetails: function (event) {
				var href = event.oSource.getHref() || event.oSource.getTarget();
				href = href.replace("#/", "").split('/');
				/** @type string */
				var page = href[0];
				/** @type string */
				var parameter = href[1];

				event.preventDefault();
				this.getRouter().navTo(page, {id: parameter}, true);
			},

			/**
			 * Navigates to the tutorial overview
			 */
			onGetStarted: function () {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("demo1", 	{"OptionalQueryString":{"category":"notebook","price":"desc"}}, true);
			},

			/**
			 * Handles "welcome" routing
			 * @function
			 * @private
			 */
			_onMatched: function () {
				try {
				   // this.hideMasterSide();
				} catch (e) {
					// try-catch due to a bug in UI5 SplitApp, CL 1898264 should fix it
					jQuery.sap.log.error(e);
				}
			}
		});
	}
);