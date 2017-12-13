/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
		"apestech/ui/erp/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/ResizeHandler",
		"sap/ui/Device",
		"sap/ui/core/Component",
		"sap/ui/core/Fragment",
		"sap/ui/documentation/library",
		"sap/ui/core/IconPool",
		"sap/m/SplitAppMode",
		"sap/m/MessageBox"
	], function (BaseController, JSONModel, ResizeHandler, Device, Component, Fragment, library, IconPool, SplitAppMode, MessageBox) {
		"use strict";

		return BaseController.extend("apestech.ui.erp.controller.App", {
			onInit : function () {
				BaseController.prototype.onInit.call(this);
				
				this.post("user.save", {"body":'{"hello":"eeewe"}'}).done(function (resp) {
					// 当result为true的回调
					console.log(resp);
					
				}).fail(function (err) {
				  // 当result为false的回调
					console.error(err);
				});

				var oViewModel = new JSONModel({
					busy : false,
					delay : 0,
					bPhoneSize: false,
					bLandscape: Device.orientation.landscape,
					bHasMaster: false,
					bSearchMode: false
				});
			
				// Cache view reference
				this._oView = this.getView();

				this.setModel(oViewModel, "appView");

				this.oTabNavigation = this._oView.byId("tabHeader");
				this.oHeader = this._oView.byId("headerToolbar");
				this.oRouter = this.getRouter();

				ResizeHandler.register(this.oHeader, this.onHeaderResize.bind(this));
				this.oRouter.attachRouteMatched(this.onRouteChange.bind(this));

				// apply content density mode to root view
				this._oView.addStyleClass(this.getOwnerComponent().getContentDensityClass());
			},

			onBeforeRendering: function() {
				Device.orientation.detachHandler(this._onOrientationChange, this);
			},

			onAfterRendering: function() {
				Device.orientation.attachHandler(this._onOrientationChange, this);
			},

			onExit: function() {
				Device.orientation.detachHandler(this._onOrientationChange, this);
			},

			onRouteChange: function (oEvent) {

				if (!this.oRouter.getRoute(oEvent.getParameter("name"))._oConfig.target) {
					return;
				}

				var sRouteName = oEvent.getParameter("name"),
					sTabId = this.oRouter.getRoute(sRouteName)._oConfig.target[0] + "Tab",
					oTabToSelect = this._oView.byId(sTabId),
					sKey = oTabToSelect ? oTabToSelect.getKey() : "home",
					bPhone = Device.system.phone,
					oViewModel = this.getModel("appView"),
					bHasMaster = this.getOwnerComponent().getConfigUtil().hasMasterView(sRouteName),
					oMasterView,
					sMasterViewId;

				this.oTabNavigation.setSelectedKey(sKey);

				oViewModel.setProperty("/bHasMaster", bHasMaster);

				this._toggleTabHeaderClass();

				if (bPhone && bHasMaster) { // on phone we need the id of the master view (for mavigation)
					oMasterView = this.getOwnerComponent().getConfigUtil().getMasterView(sRouteName);
					sMasterViewId = oMasterView && oMasterView.getId();
					oViewModel.setProperty("/sMasterViewId", sMasterViewId);
				}

				// hide master on route change
				this.getView().byId("splitApp").hideMaster();
				oViewModel.setProperty("/bIsShownMaster", false);
			},

			toggleMaster: function(oEvent) {
				var bPressed = oEvent.getParameter("pressed"),
					bPhone = Device.system.phone,
					oSplitApp = this.getView().byId("splitApp"),
					isShowHideMode = oSplitApp.getMode() === SplitAppMode.ShowHideMode,
					isHideMode = oSplitApp.getMode() === SplitAppMode.HideMode,
					sMasterViewId = this.getModel("appView").getProperty("/sMasterViewId"),
					fnToggle;

				if (!bPhone && (isShowHideMode || isHideMode)) {
					fnToggle = (bPressed) ? oSplitApp.showMaster : oSplitApp.hideMaster;
					fnToggle.call(oSplitApp);
					return;
				}

				/* on phone there is no master-detail pair, but a single navContainer => so navigate within this navContainer: */
				if (bPhone) {
					if (bPressed) {
						oSplitApp.to(sMasterViewId);
					} else {
						oSplitApp.backDetail();
					}
				}
			},

			navigateToSection : function (oEvent) {
				var sKey = oEvent.getParameter("key");

				oEvent.preventDefault();
				if (sKey && sKey !== "home") {
					this.getRouter().navTo(sKey, {}, true);
				} else {
					this.getRouter().navTo("", {}, true);
					this.oTabNavigation.setSelectedKey("home");
				}
			},

			handleMenuItemClick: function (oEvent) {
				var sTargetText = oEvent.getParameter("item").getText();

				if (sTargetText === "About") {
					this.aboutDialogOpen();
					// sap.m.URLHelper.redirect(sTarget, true);    实现界面跳转
				}
			},

			aboutDialogOpen: function () {
				if (!this._oAboutDialog) {
					this._oAboutDialog = new sap.ui.xmlfragment("aboutDialogFragment", "apestech.ui.erp.view.AboutDialog", this);
					this._oView.addDependent(this._oAboutDialog);
				}
				this._oAboutDialog.open();
			},

			aboutDialogClose: function (oEvent) {
				this._oAboutDialog.close();
			},

			onAboutVersionDetails: function (oEvent) {
				var oViewModel = this.getModel("appView"),
					oViewModelData = oViewModel.getData(),
					that = this;

				library._loadAllLibInfo("", "_getLibraryInfo","", function(aLibs, oLibInfos) {
					var data = {};
					var oLibInfo = library._getLibraryInfoSingleton();

					for (var i = 0, l = aLibs.length; i < l; i++) {
						aLibs[i] = oLibInfos[aLibs[i]];
						aLibs[i].libDefaultComponent = oLibInfo._getDefaultComponent(aLibs[i]);
					}

					data.libs = aLibs;
					oViewModelData.oVersionInfo = data;
					oViewModel.setData(oViewModelData);
					that.setModel(oViewModel, "appView");
				});

				var oNavCon = Fragment.byId("aboutDialogFragment", "aboutNavCon"),
					oDetailPage = Fragment.byId("aboutDialogFragment", "aboutDetail");
				oNavCon.to(oDetailPage);
			},

			onAboutThirdParty: function (oEvent) {
				var oViewModel = this.getModel("appView"),
					oViewModelData = oViewModel.getData(),
					that = this;

				library._loadAllLibInfo("", "_getThirdPartyInfo", function(aLibs, oLibInfos){
					if (!aLibs){
						return;
					}
					var data = {};
					data.thirdparty = [];
					for (var j = 0; j < aLibs.length; j++) {
						var oData = oLibInfos[aLibs[j]];
						for (var i = 0; i < oData.libs.length; i++) {
							var oOpenSourceLib = oData.libs[i];
							oOpenSourceLib._lib = aLibs[j];
							data.thirdparty.push(oOpenSourceLib);
						}
					}

					data.thirdparty.sort(function(a,b){
						var aName = (a.displayName || "").toUpperCase();
						var bName = (b.displayName || "").toUpperCase();

						if (aName > bName){
							return 1;
						} else if (aName < bName){
							return -1;
						} else {
							return 0;
						}
					});

					oViewModelData.oThirdPartyInfo = data;
					oViewModel.setData(oViewModelData);
					that.setModel(oViewModel, "appView");
				});

				var oNavCon = Fragment.byId("aboutDialogFragment", "aboutNavCon"),
					oDetailPage = Fragment.byId("aboutDialogFragment", "aboutThirdParty");
				oNavCon.to(oDetailPage);
			},

			onReleaseDialogOpen: function (oEvent) {
				var oLibInfo = library._getLibraryInfoSingleton(),
					sVersion = oEvent.getSource().data("version"),
					sLibrary = oEvent.getSource().data("library"),
					oNotesModel = new JSONModel(),
					oDialogModel = new JSONModel(),
					that = this;

				if (!this._oReleaseDialog) {
					this._oReleaseDialog = new sap.ui.xmlfragment("releaseDialogFragment", "apestech.ui.erp.view.ReleaseDialog", this);
					this._oView.addDependent(this._oReleaseDialog);
				}

				if (!this._oNotesView) {
					this._oNotesView = sap.ui.view({id:"notesView", viewName:"apestech.ui.erp.view.ReleaseNotesView", type:"Template"});
					this._oNotesView.setModel(oNotesModel);
				}

				oLibInfo._getReleaseNotes(sLibrary, sVersion, function(oRelNotes, sVersion) {
					var oDialogData = {};

					if (oRelNotes && oRelNotes[sVersion] && oRelNotes[sVersion].notes && oRelNotes[sVersion].notes.length > 0) {
						that._oNotesView.getModel().setData(oRelNotes);
						that._oNotesView.bindObject("/" + sVersion);
					} else {
						oDialogData.noDataMessage = "No changes for this library!";
					}
					oDialogData.library = sLibrary;
					oDialogModel.setData(oDialogData);
				});

				this._oReleaseDialog.setModel(oDialogModel);
				this._oReleaseDialog.addContent(this._oNotesView);
				this._oReleaseDialog.open();
			},

			onReleaseDialogClose: function (oEvent) {
				this._oReleaseDialog.close();
			},

			onAboutNavBack: function (oEvent) {
				var oNavCon = Fragment.byId("aboutDialogFragment", "aboutNavCon");
				oNavCon.back();
			},


			onSearch : function (oEvent) {
				var sQuery = oEvent.getParameter("query");
				if (!sQuery) {
					return;
				}
				this.getRouter().navTo("search", {searchParam: sQuery}, false);
			},

			onHeaderResize: function (oEvent) {
				var iWidth = oEvent.size.width,
					bPhoneSize = Device.system.phone || iWidth < Device.media._predefinedRangeSets[Device.media.RANGESETS.SAP_STANDARD_EXTENDED].points[0];

				this.getModel("appView").setProperty("/bPhoneSize", bPhoneSize);

				this._toggleTabHeaderClass();
			},

			_onOrientationChange: function() {
				this.getModel("appView").setProperty("/bLandscape", Device.orientation.landscape);

				this._toggleTabHeaderClass();
			},

			onToggleSearchMode : function(oEvent) {
				var bSearchMode = oEvent.getParameter("isOpen"),
				oViewModel = this.getModel("appView");

				oViewModel.setProperty("/bSearchMode", bSearchMode);

				this._toggleTabHeaderClass();
			},

			_getUI5Version: function () {
				return this.getModel("versionData").getProperty("/version");
			},

			_getUI5VersionGav: function () {
				return this.getModel("versionData").getProperty("/versionGav");
			},

			_getUI5Distribution: function () {
				var sVersionGav = this._getUI5VersionGav();
				var sUI5Distribution = "SAPUI5";
				if (sVersionGav && /openui5/i.test(sVersionGav)) {
					sUI5Distribution = "OpenUI5";
				}
				return sUI5Distribution;
			},

			_getCurrentPageRelativeURL: function () {
				var parser = window.location;
				return parser.pathname + parser.hash + parser.search;
			},

			_isToggleButtonVisible: function() {
				var oViewModel = this.getModel("appView"),
					bHasMaster = oViewModel.getProperty("/bHasMaster"),
					bPhoneSize = oViewModel.getProperty("/bPhoneSize"),
					bLandscape = oViewModel.getProperty("/bLandscape"),
					bSearchMode = oViewModel.getProperty("/bSearchMode");

				return bHasMaster && (bPhoneSize || !bLandscape) && !bSearchMode;
			},

			_toggleTabHeaderClass: function() {
				var th = this.getView().byId("tabHeader");
				if (this._isToggleButtonVisible()) {
					th.addStyleClass("tabHeaderNoLeftMargin");
				} else {
					th.removeStyleClass("tabHeaderNoLeftMargin");
				}
			}

		});

	}
);