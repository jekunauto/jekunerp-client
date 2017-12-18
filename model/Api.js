sap.ui.define([
    "sap/m/MessageToast"
   // "apestech/ui/erp/model/AuthGuard", AuthGuard
], function (MessageToast) {
    "use strict";
     var Config = {
        	 "appServerUrl": "http://10.2.5.37:8060",
			 "appKey":"00001",
		     "appSecret":"abcdeabcdeabcdeabcdeabcde"
        };
     return {
        // post: function (uri, params, cb) {
        //     params = params || {};
        //     params._jwt = AuthGuard.getJwt();
        //     sap.ui.core.BusyIndicator.show(1000);

        //     jQuery.ajax({
        //         type: "POST",
        //         contentType: "application/json",
        //         data: JSON.stringify(params),
        //         url: backend + uri,
        //         cache: false,
        //         dataType: "json",
        //         async: true,
        //         success: function (data, textStatus, jqXHR) {
        //             sap.ui.core.BusyIndicator.hide();
        //             cb(data);
        //         },
        //         error: function (data, textStatus, jqXHR) {
        //             sap.ui.core.BusyIndicator.hide();
        //             switch (data.status) {
        //                 case 403: // Forbidden
        //                     MessageToast.show('Auth error');
        //                     break;
        //                 default:
        //                     console.log('Error', data);
        //             }
        //         }
        //     });
        // },

        // get: function (uri, params, cb) {
        //     params = params || {};
        //     params._jwt = AuthGuard.getJwt();
        //     sap.ui.core.BusyIndicator.show(1000);

        //     jQuery.ajax({
        //         type: "GET",
        //         contentType: "application/json",
        //         data: params,
        //         url: backend + uri,
        //         cache: false,
        //         dataType: "json",
        //         async: true,
        //         success: function (data, textStatus, jqXHR) {
        //             sap.ui.core.BusyIndicator.hide();
        //             cb(data);
        //         },
        //         error: function (data, textStatus, jqXHR) {
        //             sap.ui.core.BusyIndicator.hide();
        //             switch (data.status) {
        //                 case 403: // Forbidden
        //                     MessageToast.show('Auth error');
        //                     break;
        //                 default:
        //                     console.log('Error', data);
        //             }
        //         }
        //     });
        // }
        /**
			 * 功能：url转换.
			 * @public
			 * @param {string} url 输入url
			 * @returns {string} 输出url
			 */
			formatUrl: function (url) {
			 	if (url.indexOf('http://') === -1 && url.indexOf('https://') === -1) {
					url =  Config.appServerUrl + url;
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
					url: url,
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
				var appKey = Config.appKey;
				var secret = Config.appSecret;
				data.appKey = appKey;
				//data.messageFormat = "json";
				data.version = "1.0";
				data.sign = this.sign(data, secret);
	            //data.session = AuthGuard.getCurrentUser();
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
				url = this.formatUrl(url);
				data = data || {};
				data.method = method;
				return this.httpPost(url, data, async || true);
			},
			
			httpGet: function (url, data, async) {
				return this.request(url, data, async || true, "GET");
			},
			
			get: function (method, data, async) {
				var url = "/router";
				url = this.formatUrl(url);
				data = data || {};
				data.method = method;
				return this.httpGet(url, data, async || true);
			} 
    };
});