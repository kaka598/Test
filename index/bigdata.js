(function() {
    String.prototype.trim=function(){
        return this.replace(/(^\s*)|(\s*$)/g, "");
}

    /**
     * 定义常用对象、函数的快捷调用常量。
     */
    var _toString = "toString";

    /**
     * 定义常量
     */
    var _tkd = "_tkd"; // 跟踪器名称
    
    var _domain = "trace.51jingying.com";
    var config = {
             referrerType :{
                directVisit : {value: 1},
                searchEngine: {value: 2},
                others : {value : 3}
             },
             search : [
                  [1, 'baidu.com', 'wd|word'],
                  [2, 'google.com', 'q'],
                  [3, 'sogou.com', 'query'],
                  [5, 'bing.com', 'q'],
                  [7, 'haosou.com', 'q']   //360搜索，已改为haosou,目前先不统计
             ],
             js : _domain + "/"
         };

    function Tracker() {
        var oThis = this;
        oThis.p = {
            push: function () {
                oThis.handleEvent.apply(oThis, arguments);
            }
        };
        oThis.handle();
    }

    Tracker.prototype = {
        /**
         * 页面上会使用_tkd.push，其作用是在js完全载入之前使用数组来替代对象_tkd
         * 当js完成载入后，系统会执行所有已列入数组的命令,并用 _tkd 对象来代替数组。
         */
        handle :function (){
            var oThis = this;
            try{
                _tracker_ : {
                    var tkd = window[_tkd],isArray = false;
                    if(tkd) {
                        isArray = IsArray(tkd);
                        if(!isArray){
                            break _tracker_;
                        }
                        //处理页面上已经设置好的事件
                        for (var x = 0; x < tkd.length; x++) {
                            oThis.handleEvent(tkd[x]);
                        }
                    }
                    window[_tkd] = oThis.p;
                }
            }catch(exception){
            }
        },
        handleEvent : function(args){
            switch (args[0]) {
            	//收集浏览日志
            	case "_trackPageView" :
            		//tkd.push(['_trackPageView', param]);
            		if (args.length == 2) {
            	        if(window.location.href.indexOf("searchmanager.php") > -1)
            	        	break;
            	        if(window.location.href.indexOf("searchcase.php") > -1)
            	        	break;
            	        if(window.location.href.indexOf("searchspy.php") > -1)
            	        	break;
            			recordPageView(args[1]);
            		}
            		break;
        		//收集搜索日志
                case "_trackSearch":
                	//tkd.push(['_trackSearch',category, param]);
                    if (args.length == 3) {
                    	handleTrackSearch(args[1], args[2]);
                    	
			var searchType = getField(args[2], "searchType");
                    	if(args[1] == "FoxEngine" && searchType != undefined && searchType == 4)
                    		break;
                    	recordPageView(args[2]);
                    }
                    break;
                //收集事件日志
                case "_trackEvent" :
                    // 例子：tkd.push(['_trackEvent',eventType, param]);
                    if (args.length == 3) {
                        handleTrackEvent(args[1], args[2]);
                    }
                    break;
            }
         }
    }
  
    /**
     * 记录页面访问日志:tkd.push(['_trackPageView', param]);
     * @param args
     */
    function recordPageView(arg) {
        var params = [];
        //参数放入数组中
        params = params.concat(parseUserInfo(arg));
        params = params.concat(getClientInfo());
        params = params.concat(getVisitInfo());
        send("tjpv.gif", params);
    }

    /**
     * 记录搜索日志：tkd.push(['_trackSearch',category, param]);
     * 对于中文关键字需要编码，encodeURIComponent默认为UTF-8
     * @param args
     */
    function handleTrackSearch(category, arg) {
        var params = [];
        params.push("cat=" + category);
        params = params.concat(parseParams(arg));
        send("tjsearch.gif", params);
    }

    /**
     * 记录事件日志：tkd.push(['_trackEvent', eventType, param]);
     * @param args
     */
    function handleTrackEvent(eventType, arg){
        var params = [];
        params.push("eventType=" + eventType);
        params.push("u=" + encodeURIComponent(window.location.href)); // 当前url
        params = params.concat(parseParams(arg));
       send("tjevent.gif", params);
    }
    
    /**
     * 把传递过来的字段值解析，并放入数组中
     */ 
    function parseParams(arg) {
       var params = [];
       var fieldArr = arg.split("||");
       for(var i = 0; i < fieldArr.length; i++){
           var data = fieldArr[i].split("=");
           if(data.length < 2 || data[1].trim().length == 0 || data[1] == "undefined")
               continue;
           params.push(data[0] + "=" + data[1]);
       }
       return params;
    }

    /**
     * webId、uid、utype、ckid、ckct、ip、devType
     */
    function parseUserInfo(arg){
        var params = [];
        var fieldArr = arg.split("||");
        for(var i = 0; i < fieldArr.length; i++){
            var data = fieldArr[i].split("=");
            if(data.length < 2 || data[1].trim().length == 0 || data[1] == "undefined")
                continue;
            if(data[0] == "webId" || data[0] == "uid" || data[0] == "utype" || data[0] == "ckid" || data[0] == "ckct" || data[0] == "ip" 
            	|| data[0] == "devType"){
                params.push(data[0] + "=" + data[1]);
            }
        }
        return params;
    }
    
    function getField(arg, field){
        var fieldArr = arg.split("||");
        for(var i = 0; i < fieldArr.length; i++){
            var data = fieldArr[i].split("=");
            if(data.length < 2 || data[1].trim().length == 0 || data[1] == "undefined")
                continue;
            if(data[0] == field) return data[1];
        }
      
    }
    
    /**
     * 获取客户端信息：色深、是否支持cookie、语言、分辨率等。
     * @returns {Array}
     */
    function getClientInfo() {
        var clientInfo = [];
        var cd = window.screen.colorDepth;//色深
        var ck = navigator.cookieEnabled;//是否支持cookie
        var la = navigator.language || navigator.browserLanguage || navigator.systemLanguage || navigator.userLanguage || "";//语言
        var sc = window.screen.width + "x" + window.screen.height;//分辨率
        var ug = navigator.userAgent;
        
        clientInfo.push("cd=" + cd);
        clientInfo.push("ck=" + ck);
        clientInfo.push("la=" + la);
        clientInfo.push("sc=" + sc);
        clientInfo.push("ug=" + ug);
        return clientInfo;
    }

    /**
     * 获取访问信息：上一页url、当前url、访问时间、访问来源等
     * @returns {Array}
     */
    function getVisitInfo() {
        var visitInfo = [];
        visitInfo.push("re=" + encodeURIComponent(document.referrer));//上一页url
        visitInfo.push("u=" + encodeURIComponent(window.location.href)); // 当前url
        visitInfo = visitInfo.concat(parseReferrer(document.referrer));
        return visitInfo;
    }

    /**
     * 获取来源信息：来源途径（直接访问、搜索引擎、外部链接）、搜索引擎域名、搜索引擎子域名、关键字
     * @returns {Array}
     */
    function parseReferrer(referrer) {
        var refhost = referrer.replace(new RegExp(document.location.protocol + "//(.*?)/(.*)","g"),"$1");
        var refInfo = [];
        var _referrerType = config.referrerType.others.value;//外部链接
        var _refDomain = ""; // 域名
        var _refSubDomain = ""; //子域名
        var _keyword = ""; // 搜索词

        //直接访问
        if(referrer == "" || refhost == window.location.host){
            _referrerType = config.referrerType.directVisit.value;
        } else {
            _refDomain = refhost;
            //判断是否是搜索引擎，并解析子域名和关键词
            for ( var i = 0; i < config.search.length; i++) {
                if (new RegExp(config.search[i][1]).test(refhost)) {
                    _keyword = query(referrer, config.search[i][2]) || '';
                    _referrerType = config.referrerType.searchEngine.value;
                    _refDomain = config.search[i][1];
                    _refSubDomain = refhost;
                    break;
                }
            }
        }
        refInfo.push("reftype=" + _referrerType);
        if(_refDomain.trim().length > 0){
            refInfo.push("refd=" + encodeURIComponent(_refDomain));
        }
        if(_refSubDomain.trim().length > 0){
            refInfo.push("refsubd=" + encodeURIComponent(_refSubDomain));
        }
        if(_keyword.trim().length > 0){
            refInfo.push("refkw=" + encodeURIComponent(_keyword));
        }
        return refInfo;
    }

    /**
     * 判断一个对象是否是数组。
     * @param o {Object} 要判断的对象。
     * @return {Boolean} 是否是一个数组。
     */
    function IsArray(o) {
        return Object.prototype[_toString].call(Object(o)) == "[object Array]";
    };

    /**
     * 匹配url来源是否是搜索引擎
     */
    function query(a, b) {
        var d = a.match(new RegExp("(^|&|\\?|#)(" + b + ")=([^&#]*)(&|$|#)", ""));
        return d ? d[3] : '';
    }

    function send(pic, param) {
    	var win = window;
    	var n = '_job_img_' + _make_rnd(),
    	img = win[n] = new Image(); //全局变量引用
    	img.onload = img.onerror = function () {
    	  win[n] = null;	//删除全局变量引用
    	};
		var q = "https:" == document.location.protocol ? "https:" : "http:";
 		img.src = q + "//" + _domain + "/" +  pic + "?" + param.join("&") + "&vt=" + new Date().getTime();
    }
    
    var _make_rnd  = function(){
        return (+new Date()) + '.r' + Math.floor(Math.random() * 1000);
    };

    new Tracker;
})();
