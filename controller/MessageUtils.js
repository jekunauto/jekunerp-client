/*global Message */
sap.ui.define([
		'sap/m/Button',
		'sap/m/Dialog',
		'sap/m/Text',
		"sap/ui/base/Object"
	], function(Button, Dialog, Text, UI5Object) {
	"use strict";

	return UI5Object.extend("apestech.ui.erp.controller.MessageUtils", {

		constructor : function (oComponent) {
				this._oComponent = oComponent;
				this._oModel = oComponent.getModel();
				this._bMessageOpen = false;
				this._sErrorText = "Sorry, a technical error occurred! Please try again later.";
		},
		
		showDefaultMessage: function (text) {
			var dialog = new Dialog({
				title: 'Default Message',
				type: 'Message',
					content: new Text({
						text: text
					}),
				beginButton: new Button({
					text: 'OK',
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});

			dialog.open();
		},

		showErrorMessage: function (text) {
			var dialog = new Dialog({
				title: 'Error',
				type: 'Message',
				state: 'Error',
				content: new Text({
					text: text
				}),
				beginButton: new Button({
					text: 'OK',
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});

			dialog.open();
		},

		showWarningMessage: function (text) {
			var dialog = new Dialog({
				title: 'Warning',
				type: 'Message',
				state: 'Warning',
				content: new Text({
					text: text
				}),
				beginButton: new Button({
					text: 'OK',
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});

			dialog.open();
		},

		showSuccessMessage: function (text) {
			var dialog = new Dialog({
				title: 'Success',
				type: 'Message',
				state: 'Success',
				content: new Text({
					text: text
				}),
				beginButton: new Button({
					text: 'OK',
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});

			dialog.open();
		}
	});
	
});