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
		/**
		 * shwo the general Message
		 */
		showDefaultMessage: function (text) {
			var dialog = new Dialog({
				title: 'Default Message',
				draggable: true,
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
		/**
		 * shwo the Error Message
		 */
		showErrorMessage: function (text) {
			var dialog = new Dialog({
				title: 'Error',
				type: 'Message',
				state: 'Error',
				draggable: true,
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

		/**
		 * show the Warning Message
		 */
		showWarningMessage: function (text) {
			var dialog = new Dialog({
				title: 'Warning',
				type: 'Message',
				state: 'Warning',
				draggable: true,
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

		/**
		 * show the success Message
		 */
		showSuccessMessage: function (text) {
			var dialog = new Dialog({
				title: 'Success',
				type: 'Message',
				state: 'Success',
				draggable: true,
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
		
		/**
		 * show the confirm Message
		 * return value: 
		 *		true: confirmed
		 *		false: cancle
		 */
		showConfirmMessage: function (json) {
			var dialog = new Dialog({
				title: 'Confirm',
				type: 'Message',
				draggable: true,
				content: new Text({ text: json.text }),
				beginButton: new Button({
					text: 'Submit',
					press: function () {
						dialog.close();
						json.confirm();
					}
				}),
				endButton: new Button({
					text: 'Cancel',
					press: function () {
						dialog.close();
						json.cancel();
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