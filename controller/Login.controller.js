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
                    targets.display("home");
                });
            }
        });
});