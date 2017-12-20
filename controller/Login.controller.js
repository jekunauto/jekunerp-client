sap.ui.define([
	    "apestech/ui/erp/controller/BaseController",
        "sap/ui/model/json/JSONModel",
        "sap/m/MessageToast",
        "apestech/ui/erp/model/AuthGuard"
    ], function (BaseController, JSONModel, MessageToast,AuthGuard) {
        "use strict";
        return BaseController.extend("apestech.ui.erp.controller.Login", {
            model: {
                userid: "", 
                password: ""
            }, 
            onInit: function () {
                this.getView().setModel(new JSONModel(this.model));
                this.getRouter().getRoute("login").attachPatternMatched(this._onMatched, this);
            },
            loginPressHandle: function () {
               var router = this.getOwnerComponent().getRouter();
               sap.ui.core.BusyIndicator.show();
                AuthGuard.authenticateUser(this.model.userid, this.model.password, {
                    onSuccess: function () {
                       sap.ui.core.BusyIndicator.hide();
                       router.navTo("home");
                   },
                    onFailure: function (err) {
                        sap.ui.core.BusyIndicator.hide();
                        // switch (err.code) {
                        //     case "PasswordResetRequiredException":
                        //         that.getModel().setProperty("/flow", "PasswordReset");
                        //         break;
                        //     default:
                        MessageToast.show(JSON.stringify(err.header.message));
                    }
                
               });

               
            },
            _onMatched: function () {
				try {
					 this.hideMasterSide();
				} catch (e) {
					// try-catch due to a bug in UI5 SplitApp, CL 1898264 should fix it
					jQuery.sap.log.error(e);
				}
			}
        });
});