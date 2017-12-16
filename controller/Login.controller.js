sap.ui.define([
	    "app/controller/BaseController",
        "sap/ui/model/json/JSONModel",
        "sap/m/MessageToast",
        "app/model/AuthGuard"
    ], function (BaseController, JSONModel, MessageToast,AuthGuard) {
        "use strict";
        var currentUser;
        return BaseController.extend("apestech.ui.erp.controller.Login", {
            model: {
                userid: "", 
                password: ""
            }, 
            onInit: function () {
            	this.getRouter().getRoute("login").attachPatternMatched(this._onMatched, this);
                this.getView().setModel(new JSONModel(this.model));
            },
            loginPressHandle: function () {
                var targets = this.getOwnerComponent().getTargets();
                sap.ui.core.BusyIndicator.show();
                
                currentUser = AuthGuard.authenticateUser(this.model.userid, this.model.password, function(err){
                    if (err) {
                        targets.display("login");
                        return;
                    }
                    targets.display("welcome");
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