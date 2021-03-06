(function( window, undefined){
	var _mtools = window.mtools,
	mtools= {
			validatemobile: function (mobile) {
				if (mobile.length == 0) {
					mui.toast('请输入手机号码！');
					return false;
				}
				if (mobile.length != 11) {
					mui.toast('请输入有效的手机号码！');
					return false;
				}

				var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
				if (!myreg.test(mobile)) {
					mui.toast('请输入有效的手机号码！');
					return false;
				}
				return true;
			},
			validateAuthCode: function (code) {
				if (code.length == 0) {
					mui.toast('请输入有效的验证码！');
					return false;
				}
				if (code.length != 6) {
					mui.toast('请输入有效的验证码！');
					return false;
				}

				var reg = new RegExp(/^\d{6}$/);
				if (!reg.test(code)) {
					mui.toast('请输入有效的验证码！');
					return false;
				}
				return true;
			},
			isEmpty: function (value){
				if(this.trim(value).length == 0){
					return true;
				}
				return false;
			},
			isLogin: function (){
				if(this.getToken() && this.getUserId()){
					return true;
				}
				else
					window.location.href = 'register.html';
			},
			getUserInfo: function (){
				if(window.localStorage.userInfo){
					return JSON.parse(window.localStorage.userInfo);
				}
				return null;
			},
			getToken: function (){
				if(this.getUserInfo())
					return this.getUserInfo().token;
			},
			getUserId: function (){
				if(this.getUserInfo())
					return this.getUserInfo().id;
			},
			getUserName: function (){
				if(this.getUserInfo())
					return this.getUserInfo().name;
			},
			getEl: function(id){
				return document.querySelector(id);
			},
			trim: function(value){
				return value.replace(/(^\s*)|(\s*$)/g, "");
			}
	};
	window.mtools = mtools;
})( window )
