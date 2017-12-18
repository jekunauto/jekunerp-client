sap.ui.define([
	  "sap/ui/model/json/JSONModel",
      "jquery.sap.storage",
       "apestech/ui/erp/model/Api"
    ], function (JSONModel,storage,Api) {
        "use strict";
         var AuthGuard = {
          
            hasSession: function (cbk) {
                // var currentUser = AuthGuard.getCurrentUser();
                // if (currentUser != null) {
                //     var session="";
                //     /*session判断*/
                //     if (session.isValid()) {
                //             //jwt = session.idToken.getJwtToken();
                //             cbk(false, session);
                //         } else {
                //             cbk(true);
                //     }
                // } else {
                //     cbk(true);
                // }
                cbk(true);
            },

            getCurrentUser: function () {
                return storage.get("currentUser");
            },

            signOut: function () {
                this.token = null;
                storage.remove("currentUser");
            },

            getUsername: function () {
               if (storage.get("currentUser")){
                  var userObj = new JSONModel(storage.get("currentUser"));
                  return userObj.firstName + " " + userObj.lastName;
               }
               return "no-user";
            },
            authenticateUser: function (user, pass, cdk) {
                var userJSON={};
            	userJSON["userid"]=user;
            	userJSON["password"]=pass;
              	Api.post("aut.user.login", {"body":JSON.stringify(userJSON)}).done(function (resp) {
					// 当result为true的回调
                    //storage.put("currentUser",resp);
                    cdk.onSuccess(true);
				}).fail(function (err) {
				  // 当result为false的回调
				   cdk.onFailure(err);
				});
            }
        };

        return AuthGuard;
    }
);