sap.ui.define([
	  "sap/ui/model/json/JSONModel", 
       "apestech/ui/erp/model/Api"
    ], function (JSONModel,Api) {
        "use strict";
        
         var AuthGuard = {
            hasSession: function (cbk) {
                var currentUser = AuthGuard.getCurrentUser()!=undefined?AuthGuard.getCurrentUser():null;
                if (currentUser != null) {
                     cbk(false);
                } else {
                    cbk(true);
                }
             },

            getCurrentUser: function () {
                return Api.getSessionSotrage().get("currentUser");
            },

            signOut: function (SessionStorage,cdk) {
                var posts = { "id":1 };
                Api.post("aut.user.logout", {"body":JSON.stringify(posts)}).done(function () {
					// 当result为true的回调
                    SessionStorage.remove("currentUser");
                    cdk.onSuccess();
				}).fail(function (err) {
				  // 当result为false的回调
				    
				    cdk.onFailure(err);
				});
            },

            getUsername: function (SessionStorage) {
               if (SessionStorage.get("currentUser")){
                  var userObj = new JSONModel(SessionStorage.get("currentUser"));
                  return userObj.firstName + " " + userObj.lastName;
               }
               return "no-user";
            },
            authenticateUser: function (user, pass, cdk) {
                var userJSON={"userid":user,"password":pass};
             	Api.post("aut.user.login", {"body":JSON.stringify(userJSON)}).done(function (resp) {
					// 当result为true的回调
                    Api.getSessionSotrage().put("currentUser",resp);
                    cdk.onSuccess();
				}).fail(function (err) {
				  // 当result为false的回调
				   cdk.onFailure(err);
				});
            } 
        };

        return AuthGuard;
    }
);