/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/*global history */
sap.ui.define([
		"apestech/ui/erp/controller/MasterTreeBaseController",
		"sap/ui/model/json/JSONModel"
	], function (MasterTreeBaseController) {
		"use strict";
		
		return MasterTreeBaseController.extend("apestech.ui.erp.controller.ApiMaster", {

			/**
			 * Called when the master list controller is instantiated. It sets up the event handling for the master/detail communication and other lifecycle tasks.
			 * @public
			 */
			onInit : function () {
				var oComponent = this.getOwnerComponent();

				/*var bTreeContent = [{
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
				}];

				var treeModel = oComponent.getModel("treeData");
				treeModel.setSizeLimit(1000000);
				treeModel.setData(bTreeContent, false);
				oComponent.setModel(treeModel, "treeData");*/

				oComponent.hasLogin()
					.then(oComponent.fetchMenuInfoAndBindModels.bind(oComponent))
					.then(function () {
						this._expandTreeToNode(this._topicId, this.getOwnerComponent().getModel("treeData"));
					}.bind(this));

				this._initTreeUtil("name", "nodes");

			 	this.getRouter().getRoute("home").attachPatternMatched(this._onTopicMatched, this);
			 	// this.getRouter().getRoute("experimental").attachPatternMatched(this._onTopicMatched, this);
			},

			/* =========================================================== */
			/* begin: internal methods                                     */
			/* =========================================================== */

			/**
			 * Handles "apiId" routing
			 * @function
			 * @param {sap.ui.base.Event} event pattern match event in route 'apiId'
			 * @private
			 */
			_onTopicMatched: function (event) {

				try {
					 this.showMasterSide();
				} catch (e) {
					// try-catch due to a bug in UI5 SplitApp, CL 1898264 should fix it
					jQuery.sap.log.error(e);
				}

				this._topicId = event.getParameter("arguments").id || event.getParameter("name");

				this._expandTreeToNode(this._topicId, this.getOwnerComponent().getModel("treeData"));
			},

			_onMatched: function () {
				var splitApp = this.getView().getParent().getParent(),
					masterTree = this.byId('tree'),
					selectedItem;

				splitApp.setMode(sap.m.SplitAppMode.ShowHideMode);

				if (masterTree) {
					selectedItem = masterTree.getSelectedItem();
					selectedItem && selectedItem.setSelected(false);
				}
			},

			compareTreeNodes: function (sNode1, sNode2) {
				if (sNode1 === "EXPERIMENTAL") {
					return 1;
				}

				if (sNode2 === "EXPERIMENTAL") {
					return -1;
				}

				if (sNode1 === "DEPRECATED") {
					return 1;
				}

				if (sNode2 === "DEPRECATED") {
					return -1;
				}

				if (sNode1 < sNode2) {
					return -1;
				}

				if (sNode1 > sNode2) {
					return 1;
				}

				if (sNode1 === sNode2) {
					return 0;
				}
			},

			onNodeSelect : function (oEvent) {
				var node = oEvent.getParameter("listItem");
				var apiId = node.getCustomData()[0].getValue();

				if (!apiId) {
					jQuery.sap.log.warning("Missing name for entity: " + node.getId() + " - cannot navigate to API ref");
					return;
				}

				//this.getRouter().navTo( "apiId", {id : apiId}, false);
				this.getRouter().navTo( apiId, {id : apiId}, false);
			}
		});
	}
);