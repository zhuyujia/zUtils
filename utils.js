;(function(root){
	'use strict';

	var Utils = {
		/**
		 * 用于读取/写入/删除浏览器 cookie。使用方法：
		 * 读取 cookie：Utils.cookie('name');
		 * 写入 cookie：Utils.cookie('name', 'zhuyujia'); 或者 Utils.cookie('age', 28, {expires: 1});
		 * 删除 cookie：Utils.cookie('name', null);
		 * 
		 * @param  {String} name  读取/写入/删除 cookie 的名称
		 * @param  {String} value 需要设置 cookie 的值
		 * @param  {Object} opts  其他参数，有效期 expires 单位小时；路径 path，域名 domain，安全性 secure
		 * @return {String}       有 cookie 就返回 cookie 的值，没有返回 null
		 */
		cookie: function(name, value, opts){
			if(typeof value !== 'undefined'){
				var expires = '';
				opts = opts || {};
				if(value === null){
					value = '';
					opts.expires = -1;
				}
				if(opts.expires){
					var date = new Date();
					date.setTime(date.getTime() + (opts.expires * 60 * 60 * 1000));
					expires = '; expires=' + date.toGMTString();
				}
				var path   = opts.path ? '; path=' + opts.path : '';
				var domain = opts.domain ? '; domain=' + opts.domain : '';
				var secure = opts.secure ? '; secure' : '';
				document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
			} else {
				var cookies;
				if(document.cookie && document.cookie !== ''){
					cookies = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'));
					if(cookies){
						return cookies[2];
					}else{
						return null;
					}
				}
			}
		},
		/**
		 * 添加到收藏夹
		 * @param {Object} obj  指代上下文，一般用 this，如：<a href="javascript:;" onclick="Utils.addFavorite(this)">点击收藏</a>
		 * @param {Object} opts 收藏夹的标题和链接，默认为当前页面的标题和链接 {title: 'your_title', url: 'your_url'}
		 */
		addFavorite: function(obj, opts){
			var _t, _u;
			if(typeof opts !== 'object'){
				_t = document.title;
				_u = location.href;
			}else{
				_t = opts.title || document.title;
				_u = opts.url || location.href;
			}
			try{
				window.external.addFavorite(_u, _t);
			}catch(e){
				if(window.sidebar){
				    obj.href  = _u;
				    obj.title = _t;
				    obj.rel   = 'sidebar';
				}else{
				    alert('抱歉，您所使用的浏览器无法完成此操作。\n\n请使用 Ctrl + D 将本页加入收藏夹！');
				}
			}
		},
		/**
		 * 改变文本字体大小
		 * @param  {Object} opts 参数集合
		 * range：			字体大小增加幅度
		 * min：			字体最小值
		 * max：			字体最大值
		 * disabledClass：	禁用样式名
		 * btnLarge：	  	增大字体按钮
		 * btnSmall：	  	减小字体按钮
		 * target：			字体改变的容器
		 */
		fontSizeChange: function(opts){
			var oTarget        = document.getElementById(opts.target),
				oBtnLarge      = document.getElementById(opts.btnLarge),
				oBtnSmall      = document.getElementById(opts.btnSmall),
				oTargetStyle   = root.getComputedStyle ? root.getComputedStyle(oTarget, '') : oTarget.currentStyle,
				iCurSize       = parseInt(oTargetStyle.fontSize, 10),
				iMin           = opts.min || 12,
				iMax           = opts.max || 20,
				sDisabledClass = opts.disabledClass || 'disabled',
				regExp         = new RegExp('(\\s|^)' + sDisabledClass + '(\\s|$)');

			function changeSize(oBtn, num){
				if(regExp.test(oBtn.className)){
					return false;
				}else{
					iCurSize += num;
					oTarget.style.fontSize = iCurSize + 'px';
					if(num < 0){
						oBtnLarge.className = oBtnLarge.className.replace(regExp, ' ');
						if(iCurSize <= iMin){
							oBtnSmall.className += ' ' + sDisabledClass;
						}
					}else{
						oBtnSmall.className = oBtnSmall.className.replace(regExp, ' ');
						if(iCurSize >= iMax){
							oBtnLarge.className += ' ' + sDisabledClass;
						}
					}
				}
			}

			oBtnLarge.onclick = function(){
				changeSize(oBtnLarge, opts.num);
			};

			oBtnSmall.onclick = function(){
				changeSize(oBtnSmall, -opts.num);
			};
		}
	};

	root.Utils = Utils;
})(window);