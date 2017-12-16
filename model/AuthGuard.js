sap.ui.define([
	  "sap/ui/model/json/JSONModel",
      "jquery.sap.storage" 
    ], function (JSONModel,storage) {
        "use strict";
         var AuthGuard = {
          
            hasSession: function (cbk) {
                var currentUser = AuthGuard.getCurrentUser();
                if (currentUser != null) {
                    var session="";
                    /*session判断*/
                    if (session.isValid()) {
                            //jwt = session.idToken.getJwtToken();
                            cbk(false, session);
                        } else {
                            cbk(true);
                    }
                } else {
                    cbk(true);
                }
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
            }

    //         authenticateUser: function (user, pass，cdk) {
    //           	this.post("user.save", {"body":'{"userid":user,"password":pass}'}).done(function (resp) {
				// 	// 当result为true的回调
    //                 //storage.put("currentUser",resp);
    //                 cdk(false);
				// }).fail(function (err) {
				//   // 当result为false的回调
				//   cdk(err);
				// });
    //         }
        };

        return AuthGuard;
    }
);