;(function(w) {
	'use strict';

	var Utils = {
		/**
		 * 用于读取/写入/删除浏览器 cookie。使用方法：
		 * 读取：Utils.cookie('name');
		 * 写入：Utils.cookie('name', 'zhuyujia'); 或者 Utils.cookie('age', 28, {expires: 1});
		 * 删除：Utils.cookie('name', null);
		 * @param  {String} name  读取/写入/删除 cookie 的名称
		 * @param  {String} value 需要设置 cookie 的值
		 * @param  {Object} opts  其他参数，有效期 expires 单位小时；路径 path，域名 domain，安全性 secure
		 * @return {String}       有 cookie 就返回 cookie 的值，没有返回 null
		 */
		cookie: function(name, value, opts) {
			if (typeof value !== 'undefined') {
				var expires = '';
				opts = opts || {};
				if (value === null) {
					value = '';
					opts.expires = -1;
				}
				if (opts.expires) {
					var date = new Date();
					date.setTime(date.getTime() + (opts.expires * 60 * 60 * 1000));
					expires = '; expires=' + date.toGMTString();
				}
				var path = opts.path ? '; path=' + opts.path : '';
				var domain = opts.domain ? '; domain=' + opts.domain : '';
				var secure = opts.secure ? '; secure' : '';
				document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
			} else {
				var cookies;
				if (document.cookie && document.cookie !== '') {
					cookies = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'));
					if (cookies) {
						return cookies[2];
					} else {
						return null;
					}
				}
			}
		},
		/**
		 * 添加到收藏夹，使用方法：Utils.addFavorite(obj, {'title': 'your_title', 'url': 'your_url'});
		 * @param {Object} obj  指代触发函数的上下文，一般用 this，如：<a href="javascript:;" onclick="Utils.addFavorite(this)">点击收藏</a>
		 * @param {Object} opts 收藏夹的标题和链接，默认为当前页面的标题和链接 {title: 'your_title', url: 'your_url'}
		 */
		addFavorite: function(obj, opts) {
			var _t, _u;
			if (typeof opts !== 'object') {
				_t = document.title;
				_u = location.href;
			} else {
				_t = opts.title || document.title;
				_u = opts.url || location.href;
			}
			try {
				window.external.addFavorite(_u, _t);
			} catch (e) {
				if (window.sidebar) {
					obj.href = _u;
					obj.title = _t;
					obj.rel = 'sidebar';
				} else {
					alert('抱歉，您所使用的浏览器无法完成此操作。\n\n请使用 Ctrl + D 将本页加入收藏夹！');
				}
			}
		},
		/**
		 * 改变文本字体大小，使用方法：Utils.fontSizeChange({'range': 1, 'min': 14, 'max': 20, 'disabledClass': 'disabled', 'btnLargeId': 'large', 'btnSmallId': 'small', 'target': 'wrapper'});
		 * @param  {Object} opts 参数集合，参数如下：
		 * range：字体大小增加幅度，默认 1
		 * min：字体最小值，默认 12
		 * max：字体最大值，默认 20
		 * disabledClass：禁用样式名，默认 'disabled'
		 * btnLargeId：增大字体按钮的 id
		 * btnSmallId：减小字体按钮的 id
		 * target：字体改变的容器的 id
		 */
		fontSizeChange: function(opts) {
			var oTarget = document.getElementById(opts.target),
				oBtnLarge = document.getElementById(opts.btnLargeId),
				oBtnSmall = document.getElementById(opts.btnSmallId),
				oTargetStyle = root.getComputedStyle ? root.getComputedStyle(oTarget, '') : oTarget.currentStyle,
				iCurSize = parseInt(oTargetStyle.fontSize, 10),
				iMin = opts.min || 12,
				iMax = opts.max || 20,
				sDisabledClass = opts.disabledClass || 'disabled',
				regExp = new RegExp('(\\s|^)' + sDisabledClass + '(\\s|$)');

			function changeSize(oBtn, range) {
				if (regExp.test(oBtn.className)) {
					return false;
				} else {
					iCurSize += range || 1;
					oTarget.style.fontSize = iCurSize + 'px';
					if (range < 0) {
						oBtnLarge.className = oBtnLarge.className.replace(regExp, ' ');
						if (iCurSize <= iMin) {
							oBtnSmall.className += ' ' + sDisabledClass;
						}
					} else {
						oBtnSmall.className = oBtnSmall.className.replace(regExp, ' ');
						if (iCurSize >= iMax) {
							oBtnLarge.className += ' ' + sDisabledClass;
						}
					}
				}
			}

			oBtnLarge.onclick = function() {
				changeSize(oBtnLarge, opts.range);
			};

			oBtnSmall.onclick = function() {
				changeSize(oBtnSmall, -opts.range);
			};
		},
		/**
		 * 输入框占位符提示语，支持 input 和 textarea，使用方法：Utils.placeholder('name', '请输入', 'tip');
		 * @param  {String} id        文本输入框 id
		 * @param  {String} msg       占位符提示语文字
		 * @param  {String} className 低版本浏览器占位符提示语样式名称，默认 tip-id，比如 id 为 name，那么样式名称为 'tip-name'
		 */
		placeholder: function(id, msg, className) {
			var isPlaceholder = 'placeholder' in document.createElement('input'),
				oTarget = document.getElementById(id),
				oParent = oTarget.parentNode,
				oLabel = document.createElement('label');

			function dealPlaceholder(oTarget, oLabel) {
				var deal = function() {
					var val = oTarget.value;
					if (val !== '') {
						oLabel.style.display = 'none';
					} else {
						oLabel.style.display = 'block';
					}
				};
				oTarget.oninput = oTarget.onpropertychange = deal;
			}

			if (isPlaceholder) {
				oTarget.setAttribute('placeholder', msg);
			} else {
				oLabel.setAttribute('for', id);
				oLabel.setAttribute('class', className || 'tip-' + id);
				oLabel.innerHTML = msg;
				oParent.insertBefore(oLabel, oTarget);
				if (oTarget.value !== '') {
					oLabel.style.display = 'none';
				}
				dealPlaceholder(oTarget, oLabel);
			}
		},
		/**
		 * 设置为首页，使用方法：<a href="javascript:;" onclick="Utils.setHome(this, window.location.href);">设为首页</a>
		 * @param {Object} obj 指代触发函数的上下文，一般用 this
		 * @param {String} url 设置为首页的地址
		 */
		setHome: function(obj, url){
			try{
				obj.style.behavior = 'url(#default#homepage)';
				obj.setHomePage(url);
			}catch(e){
				if(window.netscape){
					try{
						netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
					}catch(error){
						alert('抱歉，此操作被浏览器拒绝！\n\n请在浏览器地址栏输入“about:config”并回车\n\n然后将[signed.applets.codebase_principal_support]的值设置为true，双击即可。');
					}
					var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
					prefs.setCharPref('browser.startup.homepage', url);
				}else{
					alert('抱歉，您所使用的浏览器无法完成此操作。\n\n您需要手动将【' + url + '】设置为首页。');
				}
			}
		}
	};

	w.Utils = Utils;
})(window);