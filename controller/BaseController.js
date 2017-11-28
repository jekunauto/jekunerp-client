/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/*global history */
sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/ui/core/routing/History",
		"sap/ui/Device",
		"apestech/ui/erp/thirdparty/encoding/jquery.encoding"
	], function (Controller, History, Device) {
		"use strict";

		return Controller.extend("apestech.ui.erp.controller.BaseController", {

			// Prerequisites
			_oCore: sap.ui.getCore(),

			onInit: function() {
				// Load <code>versionInfo</code> to ensure the <code>versionData</code> model is loaded.
				if (Device.system.phone || Device.system.tablet) {
					this.getOwnerComponent().loadVersionInfo(); // for Desktop is always loaded in <code>Component.js</code>
				}
			},

			hideMasterSide : function() {
				var splitApp = this.getSplitApp();
				splitApp.setMode(sap.m.SplitAppMode.HideMode);
			},

			showMasterSide : function() {
				var splitApp = this.getSplitApp();
				splitApp.setMode(sap.m.SplitAppMode.ShowHideMode);
			},

			getSplitApp: function() {
				return this.getView().getParent().getParent();
			},

			/**
			 * Convenience method for accessing the router in every controller of the application.
			 * @public
			 * @returns {sap.ui.core.routing.Router} the router for this component
			 */
			getRouter : function () {
				return this.getOwnerComponent().getRouter();
			},

			/**
			 * Convenience method for getting the view model by name in every controller of the application.
			 * @public
			 * @param {string} sName the model name
			 * @returns {sap.ui.model.Model} the model instance
			 */
			getModel : function (sName) {
				return this.getView().getModel(sName);
			},

			/**
			 * Convenience method for setting the view model in every controller of the application.
			 * @public
			 * @param {sap.ui.model.Model} oModel the model instance
			 * @param {string} sName the model name
			 * @returns {sap.ui.mvc.View} the view instance
			 */
			setModel : function (oModel, sName) {
				return this.getView().setModel(oModel, sName);
			},

			/**
			 * Convenience method for getting the application configuration located in manifest.json.
			 * @public
			 * @returns {object} the configuration of the component
			 */
			getConfig : function () {
				return this.getOwnerComponent().getMetadata().getConfig();
			},

			/**
			 * Event handler  for navigating back.
			 * It checks if there is a history entry. If yes, history.go(-1) will happen.
			 * If not, it will replace the current entry of the browser history with the master route.
			 * @public 
			 * @param {sap.ui.base.Event} event Device orientation change event
			 */
			onNavBack : function(event) {
				var sPreviousHash = History.getInstance().getPreviousHash();

				if (sPreviousHash !== undefined) {
					// The history contains a previous entry
					history.go(-1);
				} else {
					var sCurrentHash = window.location.hash;

					if (sCurrentHash.indexOf("#/topic/") === 0) {
						this.getRouter().navTo("topic", {}, true);
					} else if (sCurrentHash.indexOf("#/api/") === 0) {
						this.getRouter().navTo("api", {}, true);
					}
				}
			},

			searchResultsButtonVisibilitySwitch : function(oButton) {
				var sPreviousHash = History.getInstance().getPreviousHash();
				if (sPreviousHash && sPreviousHash.indexOf("search/") === 0) {
					oButton.setVisible(true);
				} else {
					oButton.setVisible(false);
				}
			},

			/**
			 * Getter for the application root view
			 * @return {sap.ui.core.mvc.View} Application root view
			 */
			getRootView: function () {
				var oComponent = this.getOwnerComponent();
				return oComponent.byId(oComponent.getManifestEntry("/sap.ui5/rootView").id);
			},

			/**
			 * Switches the maximum height of the phone image for optimal display in landscape mode
			 * @param {sap.ui.base.Event} oEvent Device orientation change event
			 * @private
			 */
			_onOrientationChange: function(oEvent) {
				if (Device.system.phone) {
					this.byId("phoneImage").toggleStyleClass("phoneHeaderImageLandscape", oEvent.landscape);
				}
			},

			/**
			 * Registers an event listener on device orientation change
			 * @private
			 */
			_registerOrientationChange: function () {
				Device.orientation.attachHandler(this._onOrientationChange, this);
			},

			/**
			 * Deregisters the event listener for device orientation change
			 * @private
			 */
			_deregisterOrientationChange: function () {
				Device.orientation.detachHandler(this._onOrientationChange, this);
			},

			/**
			 * Handles landing image load event and makes landing image headline visible
			 * when the image has loaded.
			 */
			handleLandingImageLoad: function () {
				this.getView().byId("landingImageHeadline").setVisible(true);
			},
			
			/**
			 * 功能：url转换.
			 * @public
			 * @param {string} url 输入url
			 * @returns {string} 输出url
			 */
			formatUrl: function (url) {
				if (url.indexOf('http://') === -1 && url.indexOf('https://') === -1) {
					url = this.getConfig().appServerUrl + url;
				}
				var index = url.indexOf('//') + 2;
				return url.substring(0, index) + url.substring(index).replace(/\/\//g, '/');
			},
			
			/**
			 * 功能：签名.
			 * @public
			 * @param {Object} param 输入param
			 * @param {String} secret 输入secret
			 * @returns {string} 输出url
			 */
			sign: function (param, secret) {
				// 对参数名进行字典排序    
				var array = new Array();
				for (var key in param) {
					array.push(key);
				}
				array.sort();
				// 拼接有序的参数名-值串    
				var paramArray = new Array();
				paramArray.push(secret);
				for (var index in array) {
					var key1 = array[index];
					paramArray.push(key1 + param[key1]);
				}
				paramArray.push(secret);
				// SHA-1编码，并转换成大写，即可获得签名    
				var shaSource = paramArray.join("");
				var sign = $.encoding.digests.hexSha1Str(shaSource).toUpperCase();
				return sign;
			},
			
			ajax: function (url, data, async, type, dataType) {
				// 利用了jquery延迟对象回调的方式对ajax封装，使用done()，fail()，always()等方法进行链式回调操作
				// 如果需要的参数更多，比如有跨域dataType需要设置为'jsonp'等等，可以考虑参数设置为对象
				return $.ajax({
					url: this.formatUrl(url),
					data: data || {},
					type: type || "GET", //请求类型
					dataType: dataType || "json", //接收数据类型
					async: async || true, //异步请求
					crossDomain: true,  //跨域
					cache: true
				});
			},
		
			request: function (url, data, async, type) {
				data = data || {};
				// 定义申请获得的appKey和appSecret    
				var appKey = this.getConfig().appKey;
				var secret = this.getConfig().appSecret;
				data.appKey = appKey;
				data.messageFormat = "json";
				data.version = "1.0";
				data.sign = this.sign(data, secret);
		
				return this.ajax(url, data, async, type).then(function (resp) {
					// 成功回调
					if (resp.header.code === "success") {
						return resp.body; // 直接返回要处理的数据，作为默认参数传入之后done()方法的回调
					} else {
						return $.Deferred().reject(resp); // 返回一个失败状态的deferred对象，把错误代码作为默认参数传入之后fail()方法的回调
					}
				}, function (err) {
					// 失败回调
					return $.Deferred().reject(err);
					//console.error(err); // 打印状态码
				});
			},
		
			httpPost: function (url, data, async) {
				return this.request(url, data, async || true, "POST");
			},
			
			post: function (method, data, async) {
				var url = "/router";
				data = data || {};
				data.method = method;
				return this.httpPost(url, data, async || true);
			},
			
			httpGet: function (url, data, async) {
				return this.request(url, data, async || true, "GET");
			},
			
			get: function (method, data, async) {
				var url = "/router";
				data = data || {};
				data.method = method;
				return this.httpGet(url, data, async || true);
			}
		});

	}
);