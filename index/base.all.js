/**
 * 项目常用函数封装，扩展到jQuery下，函数名以'_'线开头区别于jQuery本身的函数
 * 类方法调用：
 *     $.functionName( param1[, param2[, param3, ...] ] );
 *     $._trim( "abcdef", "f" ); //去除字符串首尾的'f'
 * 对象方法调用：
 *     jQueryObj.functionName( param1[, param2[, param3, ...] ] );
 *     $("#img")._imgPop(); //图片放大显示
 * 
 * 常用函数：
 *     1.  $._trim( string[, char] ); //去除字符串首尾的空格（包括全角空格），或特殊字符
 *     2.  $._rtrim( string[, char] ); //去除字符串右侧的空格（包括全角空格），或特殊字符
 *     3.  $._strLen( string ); //获取字符串长度，一个中文算两个字节
 *     4.  $._cutStr( string[, len[, replace]] ); //截取字符串
 *     5.  $._urlParams( [name] ); //获取url中的参数
 *     6.  $._stopProp( e ); //阻止冒泡传递
 *     7.  $._date( str[, c]); //获取当前日期
 *     8.  $._addMask( [bColor[, zindex]] ); //添加遮罩
 *     9.  $._removeMask(); //移除遮罩
 *     10. $._formData( id[, boolean] ); //获取form表单提交的值
 *     11. $._cookie( [name[, value[, options]]] ); //获取设置cookie的值
 *     12. $._removeCookie( name ); //移除cookie
 *     13. $._ajaxPage( fn, params[, pageId] ); //ajax分页
 *     14. $._loadingPop( [obj[, msg[, style]]] ); //加载提示
 *     15. $._panel( [params] ); //确认弹窗
 *     16. $._html2Entity( str ); //html转实体
 *     17. $._entity2Html( str ); //实体转html
 *     18. $._prompt( msg[, t]); //操作提示，隔t秒后隐藏提示
 *     19. $._promptMes(type, mes, obj, kind); //提示信息
 *     19. $._tooltip(type, kind, mes); //提示条
 *     20. $._mousePos( e ); //获取当前鼠标位置
 *     21. $._bottomFix(); //固定页脚
 *     
 *     22. _alignCenter( [offset[, bool[, style]]] ); //弹窗居中显示
 *     23. _dragHandle( dragId[, cursor] ); //拖动弹窗
 *     24. _checkTextArea( limitObj, len ); //检查textarea的字数
 *     25. _imgPop( [title[,src]] ); //图片放大
 *     
 * @author xianwei.li@51job.com
 */
//解决51jingying.com被恶意网站重定向问题 modify by ziheng.guo 2015-01-14
function redirectUrl() {
    var thisUrl = window.location.href;
    var thisHost = thisUrl;
    var thisName = window.location.pathname;
    if (thisName == "/"){
        thisName = "";
    }
    if (thisName != ""){
        thisHost = thisUrl.substring(0, thisUrl.indexOf(thisName));
    }
    //console.log(thisUrl);
    if (thisHost.substring(thisHost.length - 1, thisHost.length) == "/"){
        thisHost = thisHost.substring(0, thisHost.length - 1);
    }
    var reUrl = /^(http|https):\/\/([-A-Z0-9.]+)(\.51jingying\.com)$/gi;
    return false;
    if (!reUrl.test(thisHost)) {
        var baseUrl = "://www." + "51jing" + "ying.com";
        if (thisHost.indexOf("https") == 0){
            window.location.href = "https:" + baseUrl;
            return;
        }
        window.location.href = "http" + baseUrl;
    }
}
redirectUrl();
(function ($, document) {
    //扩展jQuery类本身的方法
    $.extend({
        /**
         * 功能：去除字符串两端的空格或指定字符
         * @param     string        str       字符串
         * @param     char          c         需要去除的字符，不填为去除空格
         * @return    string        字符串
         */
        _trim: function (str, c) {
            if (!str)
                return "";
            var re1 = !c ? /(^\s*)|(\s*$)/g : eval("/(\^" + c + ")|(" + c + "\$)/g"),
                    re2 = /(^[\u3000]*)|([\u3000]*$)/g;
            if (!c) {
                return str.replace(re1, "").replace(re2, "");
            }
            return str.replace(re1, "");
        },
        /**
         * 功能：去除字符串右端的空格或指定字符
         * @param     string        str       字符串
         * @param     char          c         需要去除的字符，不填为去除空格
         * @return    string        字符串
         */
        _rtrim: function (str, c) {
            if (!str)
                return "";
            var re1 = !c ? /(\s*$)/g : eval("/(" + c + "\$)/g"),
                    re2 = /[\u3000]*$/g;
            if (!c) {
                str.replace(re1, "").replace(re2, "");
            }
            return str.replace(re1, "");
        },
        /**
         * 功能：获取字符串长度，一个中文算两个字节，其它一个字节。
         * @param     string        str        字符串
         * @return    int           字符串长度（字节大小）
         */
        _strLen: function (str) {
            if (!str)
                return 0;
            return str.replace(/[^\x00-\xff]/g, "aa").length;
        },
        /**
         * 功能：截取字符串，默认截取20个字符（一个中文算2个字符），超出默认用'...'表示。
         * @param     string        str     要截取的字符串，必须
         * @param     int           len     要截取的字节长度，默认20个字符
         * @param     string        r       末尾替代字符，默认'...'
         * @return    string        字符串 
         */
        _cutStr: function (str, len, r) {
            if (!str)
                return "";
            len = len || 20;
            r = r === "" ? "" : "...";
            if ($._strLen(str) <= len) {
                return str;
            }
            for (var i = 0, l = 0, sLen = str.length, c; i < sLen; i++) {
                c = encodeURI(str.charAt(i));
                //        换行            空格             "             %             <               >              [              反斜线          ]            ^               `              {               |              }
                if (c === "%0A" || c === "%20" || c === "%22" || c === "%25" || c === "%3C" || c === "%3E" || c === "%5B" || c === "%5C" || c === "%5D" || c === "%5E" || c === "%60" || c === "%7B" || c === "%7C" || c === "%7D" ) {
                    l += 1;
                } else {
                    c.length > 2 ? l += 2 : l += 1;
                }
                if (l >= len) {
                    return l == len ? str.substr(0, i + 1) + r : str.substr(0, i) + r;
                }
            }
            return str;
        },
        /**
         * 功能：获取url中的参数。（有待优化，增加多个参数值获取）
         * @param     string         name     参数名称，不填获取所有参数
         * @param     string         doExtend 参数内容是否特殊处理。0：保持不变， 2：转为大写,  1或其他情况：转为小写
         * @return    string|obj     参数不为空返回指定参数的值，参数为空时返回所有参数
         *                           {param1:value1, param2:value2, ...}
         */
        _urlParams: function (name, doExtend) {
            var url = $._trim(location.href.split("?").pop());
            if (doExtend !== undefined && doExtend == 2) {
                url = url.toUpperCase();
            } else if (doExtend !== undefined && doExtend == 0) {
            } else {
                url = url.toLowerCase();
            }

            if (!url)
                return null;
            name = name ? name.toLowerCase() : "";
            var arr = url.split("&"), a, p, re = {};
            if (arr[0].split("=").length < 2)
                return null; //没有参数返回
            for (var i = 0, l = arr.length; i < l; i++) {
                a = arr[i].split("=");
                if (name == a[0].toLowerCase()) {
                    p = a[1];
                } else {
                    re[a[0]] = a[1];
                }
            }
            if (!name)
                return re;
            return p;
        },
        //阻止冒泡（事件传递）
        _stopProp: function (e) {
            e = e || window.event;
            if (e.stopPropagation) {
                e.stopPropagation();//W3C阻止冒泡方法
            } else {
                e.cancelBubble = true;//IE阻止冒泡方法  
            }
            return false;
        },
        /**
         * 功能：获取当前日期,不填参数获取完整的时间，格式'2013-12-22 06:20:21'。
         * @param    string        str     时间格式：
         *                                 y输出4位年份，如：2013
         *                                 ym输出年月，如：201312
         *                                 ymd输出年月日，如2013-12-20
         * @param    char          c       分割符，默认'-'
         * @return    string        当前日期
         */
        _date: function (str, c) {
            var myDate = new Date(), //创建日期对象
                    yyyy = myDate.getFullYear(), //获取完整的年份(4位,1970-????)
                    mm = myDate.getMonth() + 1, //获取当前月份(0-11,0代表1月)
                    dd = myDate.getDate(), //获取当前日(1-31)
                    hh = myDate.getHours(), //获取当前小时数(0-23)
                    ii = myDate.getMinutes(), //获取当前分钟数(0-59)
                    ss = myDate.getSeconds();    //获取当前秒数(0-59)
            mm = mm > 9 ? mm : "0" + mm;
            dd = dd > 9 ? dd : "0" + dd;
            hh = hh > 9 ? hh : "0" + hh;
            ii = ii > 9 ? ii : "0" + ii;
            ss = ss > 9 ? ss : "0" + ss;
            str = str ? str.toLowerCase() : "";
            c = c || "-";
            switch (str) {
                case "y":
                    return yyyy;
                case "ym":
                    return yyyy + c + mm;
                case "ymd":
                    return yyyy + c + mm + c + dd;
                default:
                    return yyyy + c + mm + c + dd + " " + hh + ":" + ii + ":" + ss;
            }
        },
        /**
         * 功能：添加遮罩
         * @param     string        style     遮罩的样式，默认黑色半透明
         * @param     string        option     为1时masknum属性不自增
         */
        _addMask: function (style) {
            if (typeof (style) == 'undefined') {
                style = '';
            }
            var m = $("#mask");
            if (m[0]) {
                $("#maskiframe_id").css("width", document.body.scrollWidth + "px");
                var masknum = parseInt($("#mask").attr("masknum")) + 1;
                $("#mask").attr("masknum", masknum);
                return m.show();
            }

            var mask = $('<div id="mask" class="mask" masknum="1"></div>');
            var str = '<div style="width:' + document.body.scrollWidth + 'px;height:' + ($(window).height() > document.body.scrollHeight ? $(window).height() : document.body.scrollHeight) +
                    'px;position:absolute;filter:alpha(opacity=50);opacity:0.5;background-color:#000000;top:0px;left:0px;z-index:9999;' + style +
                    '" id="maskiframe_id" name="maskiframe_name"></div>';
            return mask.html(str).appendTo("body");
        },
        /**
         * 功能：移除遮罩
         * @param     string        style     移除遮罩的方式，默认为直接移除，为1时根据masknum属性判断是否移除
         */
        _removeMask: function (style) {
            if($("#mask").attr("masknum")>1 && style==1){
                $("#mask").attr("masknum",1);
                return false;
            }
            return $("#mask").remove();
        },
        /**
         * 获取浏览器名称和版本号
         */
        _getBrowser: function () {
            var bs = {}, navigator = window.navigator;
            if (navigator.userAgent.indexOf('MSIE') >= 0 && navigator.userAgent.indexOf('Opera') < 0) {
                bs.name = "ie";
                bs.version = parseInt(navigator.userAgent.substr(navigator.userAgent.indexOf('MSIE') + 4, 4));
            } else if (navigator.userAgent.indexOf('Firefox') >= 0) {
                bs.name = "firefox";
                bs.version = parseInt(navigator.userAgent.substr(navigator.userAgent.indexOf('Firefox') + 8, 4));
            } else if (navigator.userAgent.indexOf('Chrome') >= 0) {
                bs.name = "chrome";
                bs.version = parseInt(navigator.userAgent.substr(navigator.userAgent.indexOf('Chrome') + 7, 4));
            } else {
                bs.name = bs.version = "unknown";
            }
            return bs;
        },
        /**
         * 功能：获取form表单中提交的值。
         * @param     object         obj 
         * @param     boolean        bool    返回的数据类型，默认返回json数据，若为true则返回string格式字符串
         * @return    string|obj     默认返回json数据，json对像{param1:param1Value, param2:param2Value, ...}
         *                           若bool=true则返回string类型的值格式：'param1=value1&param2=value2...',
         */
        _formData: function (obj, bool) {
            var obj, bs = $._getBrowser(), option;
            if (typeof obj === "string") {
                obj = document.getElementById(obj);
            } else if (obj instanceof jQuery) {
                obj = obj[0];
            } else {
                return null;
            }

            //返回string格式数据值
            if (bool) {
                var arr = [], val = '';
                for (var i = 0, l = obj.length; i < l; i++) {
                    if (!obj[i].name || obj[i].nodeName === "BUTTON" || ((obj[i].type === "radio" || obj[i].type === "checkbox") && !obj[i].checked)) {
                        continue;
                    } else {
                        if (obj[i].nodeName === "SELECT" && bs.browser === "ie" && bs.version <= 10) {
                            option = $(obj[i]).find("option[selected]");
                            if (option[0]) {
                                arr.push(obj[i].name + "=" + option.val());
                            }
                        } else {
                            val = obj[i].value === $(obj[i]).attr("placeholder") ? "" : obj[i].value;
                            arr.push(obj[i].name + "=" + val);
                        }
                    }
                }
                return arr.join("&");
            }

            //返回json数据值
            var params = {};
            for (var i = 0, l = obj.length; i < l; i++) {
                if (!obj[i].name || obj[i].nodeName === "BUTTON" || ((obj[i].type === "radio" || obj[i].type === "checkbox") && !obj[i].checked)) {
                    continue;
                } else {
                    if (obj[i].nodeName === "SELECT" && bs.browser === "ie" && bs.version <= 10) {
                        option = $(obj[i]).find("option[selected]");
                        if (option[0]) {
                            params[obj[i].name] = option.val();
                        }
                    } else {
                        params[obj[i].name] = obj[i].value === $(obj[i]).attr("placeholder") ? "" : obj[i].value;
                    }
                }
            }
            return params;
        },
        /**
         * 功能：获取cookie值，设置cookie值
         * @param     string     name       名称
         * @param     string     value      名称对应的值，value为空时为获取cookie中的值，value不为空设置cookie值
         * @param     Object     options    {expires:expires, path:path, domain:domain, secure:secure}
         *                                   expires：过期时间（单位：天，expries=2为2天后失效），默认为空，关闭浏览器后cookie值失效
         *                                   path：路径，path（如：/test/）下的所有页面共享该cookie，默认为空，当前目录
         *                                   domain：域，域下面所有页面都共享该cookie，默认为空，当前目录
         *                                   secure:安全，，默认为空不加密；若设置为"secure"，将采用加密的https传递数据
         * @return    string     cookie中的值
         */
        _cookie: function (name, value, options) {
            //获取cookie中的值
            if (value === undefined) {
                var cValue = {}, cookies, arr;
                if (document.cookie && document.cookie != "") {
                    cookies = document.cookie.split(";");
                    for (var i = 0, l = cookies.length; i < l; i++) {
                        arr = cookies[i].split("=");
                        if (name !== undefined && name == $.trim(arr[0])) {
                            return decodeURIComponent(arr[1]);
                        } else {
                            cValue[arr[0]] = arr[1];
                        }
                    }
                }
                return name === undefined ? cValue : "";
            }

            //设置cookie的值
            else {
                var options = options || {}, expires = "", date, path, domain, secure;

                //值为空时不设置cookie
                if (value === null) {
                    return false;
                }
                if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
                    if (typeof options.expires == 'number') {
                        date = new Date();
                        date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
                    } else {
                        date = options.expires;
                    }
                    expires = '; expires=' + date.toUTCString();
                }

                path = options.path ? ";path=" + options.path : ""; //路径
                domain = options.domain ? ";domain=" + options.domain : ""; //域
                secure = options.secure ? ";secure" : ""; //安全
                document.cookie = [name, "=", encodeURIComponent(value), expires, path, domain, secure].join("");
            }
        },
        /**
         * 功能：删除cookie中指定的值
         * @param     string         name      cookie中的值
         */
        _removeCookie: function (name) {
            document.cookie = name + "=;expires=" + (new Date(0)).toGMTString();
        },
        /**
         * 功能：AJAX分页
         * @param   function    fn      ajax提交后的回调函数，必须   
         * @param   object      params  提交参数
         * @param   mix         pageId  分页按钮div的id
         * @param   object      loadObj 显示loading动画的div对象
         * @param   int         offset  loading动画的div高度偏移值
         */
        _ajaxPage: function (fn, params, pageId, loadObj, offset) {
            pageId = pageId || "Paginator";
            var aObj = $("#" + pageId + " #pageButton a");
            if (aObj.length <= 0) {
                return false;
            }
            params = params || {};
            offset = offset || 0;
            var currPage = parseInt($("#" + pageId + " #pageButton a.now_page").text());
            var maxPage = parseInt($("#" + pageId).attr("countpage"));

            aObj.each(function () {
                $(this).bind("click", function () {
                    var $this = $(this);
                    if ($this.hasClass("prev") && currPage > 1) {
                        params.curr_page = currPage - 1;
                    } else if ($this.hasClass("prev") && currPage == 1) {
                        params.curr_page = currPage;
                    } else if ($this.hasClass('next') && currPage < maxPage) {
                        params.curr_page = currPage + 1;
                    } else if ($this.hasClass('next') && currPage == maxPage) {
                        params.curr_page = currPage;
                    } else {
                        params.curr_page = parseInt($this.text());
                    }
                    ajaxHandle($this, fn, params, currPage, loadObj, offset);
                });
            });
            $("#" + pageId + " #goButton input").unbind("keydown").bind("keydown", function (event) {
                if (event.keyCode == 13) {
                    !params.url && (params.url = $("#" + pageId + " #goButton a").attr("href").split("&").shift());
                    var $this = $(this);
                    var inPage = parseInt($this.val());
                    !inPage && (inPage = 1);
                    params.curr_page = inPage < 1 ? 1 : (inPage > maxPage ? maxPage : inPage);
                    ajaxHandle($this, fn, params, currPage, loadObj, offset);
                }
            });
            $("#" + pageId + " #goButton a").unbind("click");
            $("#" + pageId + " #goButton a").bind("click", function () {
                var $this = $(this);
                var inPage = parseInt($("#" + pageId + " #goButton input").val());
                params.curr_page = inPage < 1 ? 1 : (inPage > maxPage ? maxPage : inPage);
                currPage = -1;//分页GO按钮不中断 ajaxHandle->> params.curr_page == currPage
                ajaxHandle($this, fn, params, currPage, loadObj, offset);
            });

            function ajaxHandle($this, fn, params, currPage, loadObj, offset) {
                if (params.curr_page == currPage) {
                    return false;
                }
                !params.url && (params.url = $this.attr("href").split("&").shift());
                $this.removeAttr("href");
                if (isNaN(params.curr_page)) {
                    params.curr_page = 1;
                }
                //提交数据
                $.ajax({type: "POST", dataType: "json", url: webServerPath + params.url, data: params,
                    beforeSend: function () {
                        if (params.scroll != '1') {
                            loadObj ? $._loadingPop(loadObj, '', '', offset) : $._loadingPop($("div.list-wrap").parent(), '', '', offset);
                        }
                    },
                    success: function (data) {
                        $("#loadingPop").remove();
                        if (data.status == 400) {
                            eval(data.callback);
                            return false;
                        }
                        if (data.status == 200) {
                            return false;
                        }
                        if (params.scroll != '1') {
                            loadObj ? $("html,body").animate({scrollTop: loadObj.offset().top - 100}, 100) : $("html,body").animate({scrollTop: 0}, 100);
                        }
                        fn(data);
                    }
                });
            }
        },
        /**
         * 功能：显示加载提示
         * @param mix obj 需要显示加载提示的jQuery对象 必须
         * @param string msg 提示信息
         * @param string style 样式
         * @param int    offset 偏移量
         */
        _loadingPop: function (obj, msg, style, offset) {
            $("#loadingPop").remove();
            obj = obj || $("body");
            msg = msg || "加载中，请稍候...";
            style = style || "";
            offset = offset || 0;
            var lp = $('<div id="loadingPop" style="position:absolute;margin-left:' + ((obj.width() - 150) / 2) + 'px;margin-top:' + (150 - obj.height() + offset) + 'px;border-radius:4px;border:1px solid #F5BD27;background-color:#FAFAFA;padding:10px;text-align:center;z-index:10000;' + style + '"><img src="' + imgBasePath + '/images/loading.gif" style="margin-right:10px;"/>' + msg + '</div>');
            return lp.appendTo(obj);
        },
        /**
         * 功能：操作成功失败弹窗
         * @param object params
         *      params.type         弹窗类型，success:成功，不填为默认:注意
         *      params.title        弹窗标题，不填更具params.type来判断如，成功，失败，注意
         *      params.msg          弹窗提示信息
         *      params.btnNum       按钮数，默认为1个
         *      params.btnName1     弹窗第一个按钮名称，不填为“确定”
         *      params.btnPath1     弹窗第一个按钮跳转地址
         *      params.btnTarget1   是否打开新窗口，true打开新页面
         *      params.btnName2     弹窗第二个按钮名称，不填为“取消”
         *      params.btnPath2     弹窗第二个按钮跳转地址
         *      params.btnTarget2   是否打开新窗口，true打开新页面
         *      params.callback1    第一个按钮的回调函数
         *      params.callback2    第二个按钮的回调函数
         *      params.btnTarget1   第一个按钮是否打开新页面， true打开新的页面
         *      params.closePanel1  第一个按钮是否需要关闭弹窗 false不关闭，默认true关闭
         *      params.closeCallback 关闭弹窗的回调函数
         *      params.offset       弹窗距离浏览器顶端偏移量，默认80px
         */
        _panel: function (params) {
            params = params || {};
            var bg, i, title, str = "",
                    num = params.btnNum ? params.btnNum : params.btnName2 || params.callback2 ? 2 : 1,
                    offset = params.offset || 50;
            if (params.type == "success") {
                bg = "panel-success";
                i = "icon-tips-success-large";
                title = params.title || "成功";
            } else {
                bg = "panel-info";
                i = "icon-tips-info-large";
                title = params.title || "注意";
            }
            if ($('.panelDiv').length > 0) {
                $('.panelDiv').remove();
                $._removeMask();
            }
            var panel = $('<div id="panelDiv" class="panel panelDiv ' + bg + '" style="z-index:11000;"></div>');
            str += '<div id="dragPanel" class="panel-head" style="padding-right: 0;border-bottom: none;">';
            str += '<i class="' + i + '"></i><h2 style="text-indent: 0;float:none;">' + title + '</h2>';
            str += '<a name="close" class="icon-panelclose trans-50 btClose"></a>';
            str += '<i class="icon-panel-arrow"></i></div><div class="panel-body">';
            str += '<p class="' + (params.pClass || 'txt-l') + '">' + (params.msg || "") + '</p>';
            str += num >= 1 ? '<a name="sure" ' + (params.btnTarget1 ? 'target="_blank"' : "") + ' href="' + (params.btnPath1 || "javascript:;") + '" class="btn btSure">' + (params.btnName1 || "确定") + '</a>' : "";
            str += num >= 2 ? ' <a name="cancel" ' + (params.btnTarget2 ? 'target="_blank"' : "") + ' href="' + (params.btnPath2 || "javascript:;") + '" class="btn btCancel">' + (params.btnName2 || "取消") + '</a>' : "";
            str += '</div>';
            panel.html(str).appendTo($("body"))._alignCenter(offset)._dragHandle("dragPanel");
            panel.find("a.btClose, a.btSure, a.btCancel").bind("click", function (e) {
                if (!($(this).hasClass("btSure") && params.closePanel1 === false)) {
                    $._stopProp(e);
                    panel.remove();
                    $._removeMask(1);
                }
                if (this.name === "close") {
                    typeof params.closeCallback === "function" ? params.closeCallback() : null;
                } else if (this.name === "sure") {
                    typeof params.callback1 === "function" ? params.callback1() : null;
                } else if (this.name === "cancel") {
                    typeof params.callback2 === "function" ? params.callback2() : null;
                } else {
                    return false;
                }
            });
            return this;
        },
        //过滤字符，html标签转义为实体
        _html2Entity: function (str) {
            return str.replace(/[<> &"']/g, function (c) {
                return {
                    '<': '&lt;',
                    '>': '&gt;',
                    ' ': '&nbsp;',
                    '&': '&amp;',
                    '"': '&quot;',
                    "'": '&#039;'
                }
                [c];
            });
        },
        //实体转义为html标签
        _entity2Html: function (str) {
            var arrEntities = {
                'lt': '<',
                'gt': '>',
                'nbsp': ' ',
                'amp': '&',
                'quot': '"',
                '#039': '\''
            };
            return str.replace(/&(lt|gt|nbsp|amp|quot|#039);/ig, function (all, t) {
                return arrEntities[t];
            });
        },
        /**
         * 功能：显示悬停提示
         * @param string msg 需要显示加载提示的jQuery对象 必须
         * @param int    t   显示停留秒数，默认2秒
         * @param object obj 要显示在哪个div中
         * @param int    offset 距离顶部的偏移量
         */
        _prompt: function (msg, t, obj, offset) {
            msg = msg || "操作成功";
            t = t ? t * 1000 : 2000;
            offset = offset || 0;
            if (obj) {
                var p = $('<div style="z-index:10000;position:absolute;color:#FFFFFF;border-radius: 4px;margin-left:' + ((obj.width() - 150) / 2) + 'px;margin-top:' + (150 - obj.height() + offset) + 'px;" class="alert-small alert-success"><i class="icon-tips-success"></i>' + msg + '</div>');
                p.appendTo(obj);
            } else {
                var p = $('<div style="z-index:10000;position:absolute;color:#FFFFFF;border-radius: 4px;" class="alert-small alert-success"><i class="icon-tips-success"></i>' + msg + '</div>');
                p._alignCenter(0, false).appendTo($("body"));
            }
            setTimeout(function () {
                p.remove();
            }, t);
            return this;
        },
        //提示信息
        _promptMes: function (type, mes, obj, kind) {
            var content = '', X, Y;
            if (type == 'info') {
                content = '<i class="sprite icon_alert"></i>';
                content += '<span class="alertbg dropdown"><i class="sprite icon_arrow_alert pa"></i>' + mes + '</span>';
            } else if (type == 'error') {
                content = '<i class="sprite icon_error"></i>';
                content += '<span class="errorbg dropdown"><i class="sprite icon_arrow_error pa"></i>' + mes + '</span>';
            } else if (type == 'success') {
                content = '<i class="sprite icon_ok"></i>';
            } else if (type == 'float') {
                X = obj.offset().top - 38;
                Y = obj.offset().left;
                if (kind == 'relative') {
                    X = 0;
                    Y = 0;
                }
                content = '<div class="point-out" style="z-index:10002;position:absolute;top:' + X + 'px;left:' + Y + 'px;">';
                content += '<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>' + mes + '</span>';
                content += '</div>';
            }
            return content;
        },
        //提示条信息
        _tooltip: function (type, kind, mes, bool) {
            var small = '';
            var content = '';
            var a = '<a class="icon-panelclose trans-50" ' + (bool ? '' : 'onClick="javascript:$(this).parent().remove();"') + ' ></a>';
            if (kind == 'small') {
                small = 'alertSm';
            }
            var prompt_mes = mes.replace('<a', '<a class="txt-link" ');
            if (type == 'info') {
                content = '<div class="alert tooltip_spy alert-info ' + small + ' ">';
                content += '<i class="icon-tips-info"></i>' + prompt_mes + a + '</div>';
            } else if (type == 'error') {
                content = '<div class="tooltip_spy alert alert-error ' + small + ' ">';
                content += '<i class="icon-tips-error"></i>' + prompt_mes + a + '</div>';
            } else if (type == 'success') {
                content = '<div class="tooltip_spy alert alert-success ' + small + ' ">';
                content += '<i class="icon-tips-success"></i>' + prompt_mes + a + '</div>';
            }
            return content;
        },
        //获取当前鼠标的坐标
        _mousePos: function (e) {
            var e = e || window.event, db = document.body, dd = document.documentElement;
            return {
                x: e.clientX + db.scrollLeft + dd.scrollLeft,
                y: e.clientY + db.scrollTop + dd.scrollTop
            };
        },
        //去除html字符串中的style信息
        _clearStyle: function (str) {
            str = str || "";
            return str.replace(/style="[\w+-]+:\s+\w+;"/g, "");
        },
        //固定页脚div始终在底部
        _bottomFix: function () {
            var objFoot=$("#footer");
            if ($.trim(objFoot.html()) == ""){
                return;
            }
            strCssText = "";
            var i = document.documentElement.clientHeight - document.body.clientHeight; //浏览器窗口可见区域高度 - BODY对象总高度
            if (i > 0){
                if(i<objFoot.innerHeight()){
                    //i<objFoot.innerHeight()说明高度差在"底部高度"之间，不能贸然使用绝对定位。
                    //为防止层级关系，影响高度，先将底部隐藏，然后看高度关系。
                    objFoot.hide();
                    var i = document.documentElement.clientHeight - document.body.clientHeight; //可见区域高度-BODY对象高度
                    if (i > objFoot.innerHeight()){
                        //高度大于"底部高度"，可以使用绝对定位。
                        strCssText = "position:absolute;top:100%;z-index:-1;margin-top:-" + objFoot.innerHeight() + "px;";
                    }
                }else{
                    //i>0说明浏览器内容高度比较小，底部需要CSS特殊定位
                    strCssText = "position:absolute;top:100%;z-index:-1;margin-top:-" + objFoot.innerHeight() + "px;";
                }
           }
           if (objFoot[0].style.cssText != strCssText){
               objFoot[0].style.cssText = strCssText;
           }
           objFoot.show();
        },
        _linkHref: function (loginRole, viewerRole, viewerId, $caseId, passKey, agentPasskey) {
            if (viewerId === '0')
                return false;   //系统消息
            var interactiveRole = $._trim(loginRole) + $._trim(viewerRole);
            switch (interactiveRole.toLowerCase()) {
                case 'spyspy':
                case 'spyotherspy':
                case 'managerspy':
                    var spyInfo = $._trim(viewerId) != '' ? '?spyid=' + viewerId : '';
                    window.open(webServerPath + '/spy/spyinfo.php' + spyInfo);
                    break;
                case 'spymanager':
                case 'managermanager':
                    if ($._trim(viewerId) != '' && $._trim(passKey) != '') {
                        if (typeof (agentPasskey) == 'undefined') {
                            agentPasskey = '';
                        }
                        window.open(webServerPath + '/manager/cv.php?act=showCv&managerId=' + viewerId + '&caseid=' + $caseId + '&isenglish=0&passkey=' + passKey + '&agentPasskey=' + agentPasskey);
                    } else {
                        window.open(webServerPath + '/manager/managerprofile.php?act=showcv&isenglish=0&type=2');
                    }
                    break;
                default:
                    return false;
            }
        },
        /**
         * 功能：弹出积分，下载数提示框
         * @param     string       type       类型
         * @param     int          payKind    1-下载数 2-积分
         * @param     string       str        提示内容
         */
        _coinLayer: function (type, payKind, str, funName) {
            var name = '积分';
            if (payKind == 1) {
                name = '下载数';
            }
            $.ajax({type: "post", dataType: "json", url: webServerPath + "/spy/score.php?act=deductcoin",
                data: {
                    type: type,
                    payKind: payKind
                },
                success: function (data) {
                    if (data.status == '100') {
                        if (parseInt(data.msg.coin) < parseInt(data.msg.deductCoin)) {
                            $._panel({
                                msg: name + "总额：<b style='color:#fbad40;'>" + data.msg.coin + "</b><br>您的" + name + "不足，无法完成此操作",
                                btnName1: "立即充值",
                                btnPath1: webServerPath + "/spy/pay.php",
                                btnTarget1: true
                            });
                            return;
                        }

                        $._panel({
                            msg: name + "总额：<b style='color:#fbad40;'>" + data.msg.coin + "</b>&nbsp;&nbsp;" + "下载消耗:" + "<b style='color:#fbad40;'>"+data.msg.deductCoin  + "</b><br><b style='color:#FF0033;'>"+str,
                            btnName1: "确定",
                            callback1: funName
                        });
                    }
                }
            });
        }
    });

    //扩展jQuery对象方法
    $.fn.extend({
        /**
         * 功能：弹窗居中
         * @param     mix           dragId    触发拖动的对象或对象id
         * @param     int           offset     偏移量
         * @param     boolean       bool       是否添加遮罩，false不添加，默认添加遮罩
         * @param     string        style      遮罩样式
         * @return    object  弹出层
         */
        _alignCenter: function (offset, bool, style) {
            offset = offset || 0;
            var l = document.body.scrollLeft + (document.body.clientWidth - this.width()) / 2; //div宽度
            var t = document.body.scrollTop ?
                    (document.documentElement.clientHeight - this.height()) / 2 - offset + document.body.scrollTop :
                    (document.documentElement.clientHeight - this.height()) / 2 - offset + document.documentElement.scrollTop;
            l = l < 0 ? 100 : l;
            t = t < 0 ? 100 : t;
            this.css("zIndex") < 10000 ?
                    this.css({left: l + "px", top: t + "px", position: "absolute"}) :
                    this.css({left: l + "px", top: t + "px", zIndex: 10000, position: "absolute"});
            //添加遮罩
            bool === false ? null : $._addMask(style);
            return this;
        },
        /**
         * 功能：鼠标拖动div层
         * @param string dragId     点击对象id
         * @param string cursor     拖动时鼠标style
         * @return object 拖动层
         */
        _dragHandle: function (dragId, cursor) {
            cursor = cursor || "move";
            var isMousedown = false, clickLeft = 0, clickTop = 0, $this = this;
            var dragDom = typeof dragId === "string" ? $("#" + dragId).css("cursor", cursor)[0] : dragId.css("cursor", cursor)[0];
            $this.css("zIndex") <= 9999 ? $this.css("zIndex", 10000) : null;

            //按下鼠标左键时的事件
            function startDrag(e) {
                e = window.event || e;  // 获取当前事件对象
                isMousedown = true;  // 记录已经准备开始移动了
                clickLeft = e.clientX - $this.offset().left; // 获取鼠标与div左边的距离
                clickTop = e.clientY - $this.offset().top;   // 获取鼠标与div头部的距离
                document.onmouseup = endDrag;  // 鼠标释放事件
                document.onmousemove = doDrag; // 鼠标移动事件
            }

            //鼠标开始移动时的事件
            function doDrag(e) {
                e = window.event || e; // 获取当前事件对象
                if (!isMousedown) {
                    return false; // 如果_IsMousedown不等于真了返回
                }
                // 计算偏移量
                var posX = e.clientX - clickLeft;

                // left不能超过浏览器框架左右边界
                if (posX < 0) {
                    posX = 0;
                } else if (posX > document.documentElement.scrollLeft + document.documentElement.clientWidth - $this.width()) {
                    posX = document.documentElement.scrollLeft + document.documentElement.clientWidth - $this.width() - 2;
                }
                // top不能超过整个页面上下边界
                var posY = e.clientY - clickTop;
                var documentY = document.body.clientHeight < document.documentElement.clientHeight ?
                        document.documentElement.clientHeight : document.body.clientHeight;
                if (posY < 0) {
                    posY = 0;
                } else if (posY > (documentY - $this.height())) {
                    posY = documentY - $this.height();
                }
                //modify by fengshun 如果列表高度高于页面不让其跑出页面
                posY = posY < 0 ? 20 : posY;
                $this.css({left: posX + "px", top: posY + "px"});
            }

            // 释放鼠标左键时的事件
            function endDrag() {
                if (isMousedown) { // 如果_IsMousedown还为真那么就赋值为假
                    if (navigator.appName == "Microsoft Internet Explorer") {
                        $this[0].releaseCapture(); //该函数从当前的窗口释放鼠标捕获，并恢复通常的鼠标输入处理
                    }
                    isMousedown = false;
                    document.onmousemove = null;
                    document.onmouseup = null;
                }
            }
            dragDom.onmousedown = startDrag; // 鼠标按下事件
            return $this;
        },
        /**
         * 功能：检查输入域中的字数
         * @param   object  limitObj   提示字数div的jquery对象
         * @param   int     len        限制长度
         * @returns object  输入域textarea对象
         */
        _checkTextArea: function (limitObj, len) {
            var lw = typeof limitObj === "string" ? $("#" + limitObj) : limitObj;
            var wordLen = $._strLen($._trim($(this).val()));
            if (wordLen > len) {
                lw.html('已经超过<span class="f14" style="color:red;font-weight:bold;">' + Math.ceil((wordLen - len) / 2) + '</span>个字');
            } else {
                lw.html('还能输入<span class="f14" style="font-weight:bold;">' + Math.ceil((len - wordLen) / 2) + '</span>个字');
            }
            return this;
        },
        //图片放大
        _imgPop: function (title, src) {
            var pathArr = src.split('/');
            var name = pathArr[pathArr.length - 1];
            var nameArr = name.split('-');
            var height = 300;
            var width = 402;
            if (nameArr.length == 4) {
                //计算大图尺寸
                var size = nameArr[2].split('x');
                width = size[0];
                height = size[1];
                var h = $(window).height() - 100;
                var w = $(window).width() - 100;
                if (width > w) {
                    height = w / width * height;
                    width = w;
                }
                if (height > h) {
                    width = h / height * width;
                    height = h;
                }
            }

            var str = '<div id="imgPopup" style="position:absolute;z-index:10000;width:auto;height:' + parseInt(height) + 'px;width:' + parseInt(width) + 'px;">';
            str += '<div class="form">';
            str += '<img style="border:0px solid #cdcdcd;height:' + parseInt(height) + 'px;width:' + parseInt(width) + 'px;" src="' + src + '"></div>';
            str += '<a style="position:absolute;z-index:15000;right:-15px;top:-15px;" id ="closeIcon"><img /></a>';
            str += '</div>';
            var img = $(str);
            img.appendTo('body')._alignCenter().find("a").bind("click", function () {
                $._removeMask(1);
                img.remove();
            });
            var mouseOverSrc = webServerPath + "/images/closeIconMouseOver.png";
            var mouseOutSrc = webServerPath + "/images/closeIconMouseOut.png";
            $("#closeIcon img").attr('src', mouseOutSrc);
            $("#closeIcon").bind("mouseover", function () {
                $("#closeIcon img").attr('src', mouseOverSrc);
            });
            $("#closeIcon").bind("mouseout", function () {
                $("#closeIcon img").attr('src', mouseOutSrc);
            });
            return this;
        },
        //图片放大,可旋转
        _imgRotate: function (title, src, content) {
            content = content || '';
            src = src || $(this).attr("src");
            var str = '<div id="imgPopup" class="custom-panel panel-normal" style="position:absolute;z-index:10000;display:none;">';
            str += '<div class="panel custom-bg">';
            str += '<div class="panel-head" id="imgPopupHeader" style="padding-right:60px;"><a class="close" aria-hidden="true">×</a><h2>' + (title || '图片预览') + '</h2></div>';
            str += '<div class="panel-body-normal">';
            str += content;
            str += '<div class="well penel_card"><img src="' + src + '"  /></div>';
            str += '<div class="rotation_box clearfix">';
            str += '<a class="rotation_left">左转90度</a>';
            str += '<a class="rotation_center" href="' + src + '" target="_blank">查看原图</a>';
            str += '<a class="rotation_right">右转90度</a>';
            str += '</div>';
            str += '</div>';
            str += '<div class="panel-footer"></div>';
            str += '</div></div>';
            var img = $(str);
            img.appendTo('body');
            var image = new Image();
            image.src = src;
            image.onload = function () {
                var imgWidth = parseInt(image.width);
                var imgHeight = parseInt(image.height);
                var X = imgWidth / imgHeight;
                var maxHeight = 240 * X;
                if (X > 1) {
                    var topHeight = (maxHeight - 250) / 2;
                    $('#imgPopup .penel_card').css('height', maxHeight);
                    $('#imgPopup img').css('margin-top', topHeight);
                }
                if (X > 2) {
                    $('#imgPopup img').attr('width', '450');
                } else {
                    $('#imgPopup img').attr('height', '225');
                }
                $('#imgPopup')._alignCenter()._dragHandle("imgPopupHeader").find("a.close").bind("click", function () {
                    $._removeMask();
                    $('#imgPopup').remove();
                });
                $('#imgPopup').show();
            };
            return this;
        }
    });

})(jQuery, document);

//=================================JS验证规则================================
var RegExpObj = {
    //雅虎邮箱
    yahooemail: function (str) {
        return /^(([0-9a-zA-Z]+)|([0-9a-zA-Z]+[_.0-9a-zA-Z-]*))@yahoo.(\S)+$/.test(str);
    },
    //邮箱
    email: function (str) {
        return /^(([0-9a-zA-Z]+)|([0-9a-zA-Z]+[_.0-9a-zA-Z-]*))@([a-zA-Z0-9-]+[.])+([a-zA-Z]{2}|net|com|gov|mil|org|edu|int|name|asia)$/i.test(str);
    },
    //国号+手机
    phoneRich: function (str) {
        return /(^(([+]{0,1}\d{2,4}|\d{2,4})-?)?1[34578]\d{9}$)/.test(str);
    },
    //国号+电话/传真
    telephoneRich: function (str) {
        return /(^(([+]{0,1}\d{2,4}|\d{2,4})-?)?((\d{3,4})-?)?(\d{6,8})(-?(\d{1,6}))?$)/.test(str);
    },
    //手机
    phone: function (str) {
        return /^1[34578][0-9]{9}$/.test(str);
    },
    //电话/传真
    telephone: function (str) {
        return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?(\(0\d{2,3}\)|0\d{2,3})?(\(0\d{2,3}\)|0\d{2,3})?[1-9]\d{6,7}(\-\d{1,5})?$/.test(str);
    },
    //qq号
    qq: function (str) {
        return /[1-9][0-9]{4,}$/.test(str);
    },
    //微信号（中英文下划线数字）
    weixin: function (str) {
        return /^([0-9a-zA-Z]+[_0-9a-zA-Z]*)$/.test(str);
    },
    //超链接
    url: function (str) {
        return /^http[s]?:\/\/([\w-]+\.)+[\w-]+([\w-./?%&=]*)?$/.test(str);
    },
    //判断是否有大写字母
    hasCapital: function (str) {
        return /^.*[A-Z]+.*$/.test(str);
    },
    //判断是否有小写字母
    hasLowercase: function (str) {
        return /^.*[a-z]+.*$/.test(str);
    },
    //判断是否有数字
    hasNumber: function (str) {
        return /^.*[0-9]+.*$/.test(str);
    },
    //判断是否含有其它字符
    hasOther: function (str) {
        return /^.*[^0-9A-Za-z]+.*$/.test(str);
    },
    //验证登录用户名
    loginUserName: function (str) {
        return /^([0-9a-zA-Z]+[_0-9a-zA-Z@.-]*)$/.test(str);
    },
    //判断是否为数字
    isNumber: function (str) {
        return /^[0-9]+$/.test(str);
    },
    //判断是否是数字或字母
    isCharOrNum: function (char) {
        return /^([0-9]+|\w+)$/.test(char);
    }
};

//其它公用操作及获取消息
$(function () {
    //固定页脚在底部
    $._bottomFix();
    $(window).resize(function () {
        if ($("#mask")[0]){
             var masknum = parseInt($("#mask").attr("masknum"))-1;
             $("#mask").attr("masknum",masknum);
             $._addMask();
        }
        $._bottomFix();
    });

    //分页go按钮
    $(".pagination input").bind({change: function () {
            $(this).closest("#goButton").find("a").attr("href", getGoHref($(this)));
        }, keydown: function (event) {
            if (event.keyCode == 13) {
                window.location.href = getGoHref($(this));
            }
        }});
    //获取分页按钮go的href
    function getGoHref(obj) {
        var goBtn = obj.closest("#goButton");
        var maxPage = goBtn.parent().attr("countpage");
        var inPage = parseInt(obj.val());
        !inPage && (inPage = 1);
        var p = inPage < 1 ? 1 : (inPage > maxPage ? maxPage : inPage);
        var arr = goBtn.find("a").attr("href").split("=");
        arr[arr.length - 1] = p;
        return arr.join("=");
    }

    //=========================显示下拉菜单============================
    //解决IE7下bug modify by ziheng.guo 2015-9-10
    var timer, obj;
    $(document).on('mouseenter', "#header li.dropdown", function (e) {
        clearTimeout(timer);
        var i= $.trim($(this).attr("id"))=="Message" ? 1:0;
        $("#header li.dropdown").find("ul").eq(i).hide();
        obj = $(this).find("ul");
        if (obj.css("display") != "block") {
            timer = setTimeout(function () {
                obj.slideDown(150);
            }, 50);
        }
        return $._stopProp(e);
    });
    $(document).on('mouseleave', "#header li.dropdown", function (e) {
        clearTimeout(timer);
        obj = $(this).find("ul");
        timer = setTimeout(function () {
               obj.slideUp(30);
        }, 500);
        return $._stopProp(e);
    });
    $(document).on('mouseenter', "#logout", function (e) {
        $("#header li.dropdown").find("ul").hide();
    });
    
    //======================= header显示下拉菜单==============================
    $(document).on('mouseenter','#headerTab li',function(){
        $(this).find('ul').show();
    });
    $(document).on('mouseleave','#headerTab li',function(){
        $(this).find('ul').hide();
    });
    //跳转到发布case
    $("#headerTab #issueCase").click(function () {
        $.ajax({
            type: "post",
            url: webServerPath + "/common/login.php?act=ajaxChkLogin",
            data: {chkLevel: 'company'},
            dataType: "json",
            success: function (data) {
                if (data.role == "manager") {
                    window.location.href = webServerPath + "/index.php";
                    return false;
                }
                if (data.status == 100) { //保存、发布成功
                    window.location.href = webServerPath + "/spy/casemanage.php?act=addcase&type=newcase";
                } else if (data.status == 401) { //输出错误信息
                    var str = data.msg + '，无法使用此功能！<a href="' + webServerPath + '/' + data.jumpUrl + '">点击认证</a>';
                    $._panel({msg: str, type: "fail", btnPath1: webServerPath + "/" + data.jumpUrl});
                } else if (data.status == 400) {
                    $._panel({msg: "用户尚未登录", type: "fail"});
                }
            }
        });
    });
    
    //=======================end header显示下拉菜单==============================

    //=======================end 显示下拉菜单==============================

    //***********************************************************  新消息提醒伪代码begin ziheng.guo ***********************************************************/
    //主要逻辑：1.同浏览器多个TAB页面时，保证有1个轮询请求获取新消息数据（长连接服务器有效的情况下优先连接长连接服务器）。其他Tab只读cookie中的消息信息。
    //         2.若当前轮询的页面关闭，则再启动一个浏览器TAB执行轮询。
    //         3.当有TAB正在打开webchat.php页面，所有页面title停止标题闪动效果
    //         4.当无TAB正在打开webchat.php页面，并且有新消息时，所有页面title标题启动闪动效果
    //标识说明：$._cookie('hubComet')作用和意义：$._cookie('hubComet')="浏览器TAB页面唯一标识"|"最新执行轮询的本地时间戳"|"是否长轮询"|"私信页面的心跳时间戳
    //返回本地操作系统时间戳毫秒数
    function getLocalTimestamp() {
        var localData = new Date();
        return localData.getTime();//当前时间的毫秒数
    }
    var webServerCometPath = webServerPath;                       //轮询服务器
    var webServerLongCometPath = webServerPath;                   //长连接服务器默认为轮询服务器
    if (webCometUse == 1 && webCometServer != "") {
        var thisUrl = window.location.href;
        var thisHost = thisUrl;
        var thisName = window.location.pathname;
        if (thisName != "" && thisName != "/") {
            thisHost = thisUrl.substring(0, thisUrl.indexOf(thisName));
        }
        thisHost = thisHost.toLowerCase();
        if (thisHost.indexOf("51jingying.com") >= 0) {
            webServerLongCometPath = "http://comet.51jingying.com"; //长连接服务器.com
        } else if (thisHost.indexOf("51jingying.cn") >= 0) {
            webServerLongCometPath = "http://comet.51jingying.cn";  //长连接服务器.cn
        } else {
            webServerLongCometPath = webCometServer;                //长连接服务器.WWW_COMETSERVER
        }
    }

    var strUrlSource = "?source=cometkeep";                         //长连接服务器访问超时转入轮询服务器首次标识
    if (webServerCometPath == webServerLongCometPath) {
        strUrlSource = '';
    }

    var role = getRole();              //当前用户角色
    var autoPoll_msgTimeStamp = 0;     //最新消息时间戳
    var autoPoll_SetInterval = 0;      //定时自动启动
    var autoPoll_isComet = true;       //当前页是否连接服务器
    var autoPoll_timeOut = 90000;      //当前页是否连接服务器超时：90秒
    var autoPoll_handleAjax;           //当前页Ajax句柄
    var autoPoll_cometAjaxErr = 0;     //当前页Ajax长连接错误次数
    var autoPoll_linkHost = webServerLongCometPath;
    var autoPoll_pollTime = role === "spy" ? SPYTIME : MANAGERTIME; //经理人、猎头轮询时间间隔
    var thisBrowserPageTitle = window.document.title;//浏览器TAB页面Title
    var thisBrowserPageId = getLocalTimestamp();     //浏览器TAB页面唯一标识

    $._cookie("HasMsg", "0|0|0|0", {path: "/", expires: 1});//初始化本地cookie消息信息
    //当前打开的是私信页面，记录私信页面的心跳时间戳。3秒/次
    var startAutoWebchatIsOpen = null;
    function webchatIsOpen() {
        accessCookieMsg();
        var hubArr = $._cookie("hubComet").split("|");
        hubArr[4] = getLocalTimestamp();
        if (hubArr.length > 0 && hubArr[0] != thisBrowserPageId) {
            if (getLocalTimestamp() - hubArr[3] > 10000) {
                hubArr[1] = hubArr[1] - 100000;
            }
            $._cookie('hubComet', hubArr[0] + "|" + hubArr[1] + "|" + hubArr[2] + "|" + hubArr[3] + "|" + hubArr[4], {path: "/", expires: 1});
        } else {
            hubArr[3] = hubArr[4];
            $._cookie('hubComet', hubArr[0] + "|" + hubArr[1] + "|" + hubArr[2] + "|" + hubArr[3] + "|" + hubArr[4], {path: "/", expires: 1});
        }
        if (hubArr.length > 1 && getLocalTimestamp() - hubArr[1] > autoPoll_timeOut) {
            if (autoPoll_cometAjaxErr < 1) {
                autoPoll_linkHost = webServerLongCometPath;
            }
            autoPoll_cometAjaxErr++;
            setBrowserIsActivate();
            clearInterval(autoPoll_SetInterval);
            autoPoll_SetInterval = setInterval(autoPoll, autoPoll_pollTime);
        }
        clearInterval(startAutoWebchatIsOpen);
        startAutoWebchatIsOpen = setInterval(webchatIsOpen, 3000); //定义轮询
    }

    //浏览器标题闪动效果。1秒/次
    var startAutoSetBrowserTitle = null;
    function setBrowserTitle() {
        accessCookieMsg();
        $._bottomFix();
        var strTitle = thisBrowserPageTitle;
        var hubArr = $._cookie("hubComet").split("|");
        if (hubArr.length > 0 && hubArr[0] != thisBrowserPageId) {
            if (getLocalTimestamp() - hubArr[3] > 10000) {
                hubArr[1] = hubArr[1] - 100000;
                $._cookie('hubComet', hubArr[0] + "|" + hubArr[1] + "|" + hubArr[2] + "|" + hubArr[3] + "|" + hubArr[4], {path: "/", expires: 1});
            }
        } else {
            hubArr[3] = getLocalTimestamp();
            $._cookie('hubComet', hubArr[0] + "|" + hubArr[1] + "|" + hubArr[2] + "|" + hubArr[3] + "|" + hubArr[4], {path: "/", expires: 1});
        }
        if (getLocalTimestamp() - hubArr[4] > 5000) {
            var arr = $._cookie("HasMsg").split("|");
            if (arr[0] > 0 || arr[1] > 0 || arr[2] > 0) {
                //闪动效果
                if (window.document.title == "【　　　】" + strTitle) {
                    strTitle = "【新消息】" + strTitle;
                } else {
                    strTitle = "【　　　】" + strTitle;
                }
            }
        }
        window.document.title = strTitle;
        if (hubArr.length > 1 && getLocalTimestamp() - hubArr[1] > autoPoll_timeOut) {
            if (autoPoll_cometAjaxErr < 1) {
                autoPoll_linkHost = webServerLongCometPath;
            }
            autoPoll_cometAjaxErr++;
            setBrowserIsActivate();
            clearInterval(autoPoll_SetInterval);
            autoPoll_SetInterval = setInterval(autoPoll, autoPoll_pollTime);
        }
        clearInterval(startAutoSetBrowserTitle);
        startAutoSetBrowserTitle = setInterval(setBrowserTitle, 1000); //定义轮询
    }

    //当前页面启动轮询方式
    if (window.location.pathname == "/manager/webchat.php" || window.location.pathname == "/spy/webchat.php") {
        webchatIsOpen();  //记录私信页面的心跳时间戳
    } else {
        setBrowserTitle();//浏览器标题闪动效果
    }

    //刷新当前浏览器Tab开启轮询hubComet信息
    function setBrowserIsActivate() {
        autoPoll_isComet = true;
        var hubArr = $._cookie("hubComet").split("|");
        var webchatIsOpen = 0;
        if (hubArr.length > 4) {
            webchatIsOpen = hubArr[4];
        }
        var useKeepComet = 0;
        if (autoPoll_linkHost != webServerCometPath) {
            useKeepComet = 1;
        }
        $._cookie('hubComet', thisBrowserPageId + "|" + getLocalTimestamp() + "|" + useKeepComet + "|" + getLocalTimestamp() + "|" + webchatIsOpen, {path: "/", expires: 1});
    }

    var startPoll_SetInterval = setInterval(startAutoPoll, 2000);
    //轮询是否需要启动轮询逻辑，解决过程中登陆后消息无法轮询的问题。
    function startAutoPoll() {
        clearInterval(startPoll_SetInterval);
        if (!$("#Message")[0]) {
            startPoll_SetInterval = setInterval(startAutoPoll, 2000);     //定义红点轮询
            return;
        }

        $._cookie("HasMsg", "0|0|0|0", {path: "/", expires: 1});//初始化本地cookie消息信息
        setBrowserIsActivate();
        autoPoll();
    }

    //鼠标悬停消息图标，开启轮询
    $(document).on('mouseover', '#Message', function (e) {
        var arr = $._cookie("HasMsg").split("|");
        if (arr.length > 2 && arr[0] >= 0) {
            $(this).find("span[msg]").text(arr[0]);  //私信
            $(this).find("span[card]").text(arr[1]); //名片
            $(this).find("span[sys]").text(arr[2]);  //系统消息
        }
        setBrowserIsActivate();
        clearInterval(autoPoll_SetInterval);
        autoPoll_SetInterval = setInterval(autoPoll, autoPoll_pollTime);
    });

    //当前页被浏览focus，打开本页面轮询
    $(window).bind("focus load", function () {
        if (autoPoll_isComet == false) {
            setBrowserIsActivate();
            clearInterval(autoPoll_SetInterval);
            autoPoll_SetInterval = setInterval(autoPoll, autoPoll_pollTime);
        }
    });

    //当前页失去focus，关闭本页面轮询，注：本事件暂时不使用，ziheng.guo 2015-5-8
    $(window).blur(function () {
        autoPoll_isComet = true;
    });

    //轮询服务器获取消息信息
    function autoPoll() {
        if (autoPoll_isComet == false) {
            return;
        }
        //当前用户切换了或下线了
        if (role != getRole()) {
            autoPoll_isComet = false;
            return;
        }

        var hubArr = $._cookie("hubComet").split("|");
        if (hubArr.length > 0 && hubArr[0] != thisBrowserPageId) {
            return;
        }
        clearInterval(autoPoll_SetInterval);
        setBrowserIsActivate();
        var ajaxData = new Object();
        var cometUrl = autoPoll_linkHost + "/common/comet.php" + strUrlSource;
        if (autoPoll_linkHost != webServerCometPath) {
            ajaxData['t'] = autoPoll_msgTimeStamp;
            ajaxData['id'] = webCometUserId;
            ajaxData['role'] = role;
            cometUrl = autoPoll_linkHost + "/common/cometkeep.php";
        } else {
            strUrlSource = ''; //实现当前页面只发一次长连接异常参数：?source=cometkeep
        }
        if (autoPoll_handleAjax) {
            autoPoll_handleAjax.abort(); //取消 Ajax 请求 
        }
        autoPoll_handleAjax = $.ajax({type: "post", timeout: 85000, dataType: "jsonp", jsonp: "callback", jsonpCallback: "JY", url: cometUrl,
            data: ajaxData,
            success: function (data) {
                if (data === null || data.status == 400) {
                    autoPoll_isComet = false;
                    return;
                }
                var iMsg = data.msg.msg;
                var iCard = data.msg.card;
                var iSys = data.msg.sys;
                if (iMsg < 0) {
                    iMsg = 0;
                }
                if (iCard < 0) {
                    iCard = 0;
                }
                if (iSys < 0) {
                    iSys = 0;
                }
                autoPoll_msgTimeStamp = data.msg.t;
                $._cookie("HasMsg", iMsg + "|" + iCard + "|" + iSys + "|" + autoPoll_msgTimeStamp, {path: "/", expires: 1});
                accessCookieMsg();
                if (typeof (data.msg.l) != 'undefined' && data.msg.l == 1) {
                    autoPoll_linkHost = webServerLongCometPath; //自动转为长连接
                }
                clearInterval(autoPoll_SetInterval);
                if (autoPoll_linkHost == webServerCometPath) {
                autoPoll_SetInterval = setInterval(autoPoll, autoPoll_pollTime);
                } else {
                    var pollTime = 1;
                    if (autoPoll_msgTimeStamp <= 0 || (typeof (data.msg.m) != 'undefined' && data.msg.m != 1)) {
                        pollTime = autoPoll_pollTime; //本次已不是合法请求
                    }
                    autoPoll_SetInterval = setInterval(autoPoll, pollTime);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                var hubArr = $._cookie("hubComet").split("|");
                if (hubArr.length > 0 && hubArr[0] == thisBrowserPageId && autoPoll_linkHost != webServerCometPath) {
                    autoPoll_linkHost = webServerCometPath;
                    autoPoll_isComet = true;
                    clearInterval(autoPoll_SetInterval);
                    autoPoll_SetInterval = setInterval(autoPoll, 1);
                }
            }
        });
    }

    //轮询cookie，查看是否有新消息
    function accessCookieMsg() {
        if (autoPoll_isComet == false) {
            return;
        }
        $("#Message").find("i").hide(); //隐藏消息提示红点
        var arr = $._cookie("HasMsg").split("|");
        if (arr[0] > 0 || arr[1] > 0 || arr[2] > 0) {
            $("#Message").find("i").show(); //显示消息提示红点
        }
    }

    //获取当前用户类型
    function getRole() {
        return $._cookie("jyLoginRole").split("=").pop();
    }
    //***********************************************************  新消息提醒end ziheng.guo ***********************************************************/
});


/**
 * 登陆成功统一逻辑（登陆成功之后调用）
 * @param {type} data.roleType        spy,manager 指定登陆角色
 * @param {type} data.finishProfile   当前登陆角色认证状态完成情况  1-未完成，需跳转到指定完成信息输入页面；其他-已完成，根据实际情况判断留在当前页面或刷新等其他操作
 * @returns {undefined}
 * modify by liufei 2015-12-8 判断是精英角色登录名片信息已填则跳转到找case页
 */
function loginSuccess(data) {
   
    var roleType = data.userType;
    var finishProfile = data.finishprofile;
    if (data.callPushUserInfo == '1') {
        var userId = data.loginId;
        var userRole = data.role;
        var cookieId = data.GUIDCode;
        var cookieDate = data.GUIDDate;
        var cilentIP = data.IP;
        var diviceType = 1;
        setUserInfo(userId, userRole, cookieId, cookieDate, cilentIP, diviceType);//登陆成功，初始化用户行为分析
    }
    $._removeMask();
    $('#loginLayer').remove();
    var strPage = window.location.pathname.toLowerCase();//当前页面名称
    
    //锁定用户跳转到手机认证
    if(data.isshowMobileAuth == true){
         window.location.href = webServerPath + "/index.php?isshowMobileAuth=1";
        return;
    }
    //1.首页优先进入回跳地址
    if (strPage == "/" || strPage.indexOf("/index.php") == 0) {
        var returnUrl = $('#returnUrl').val();
        if (typeof (returnUrl) != 'undefined' && returnUrl != '') {
            window.location.href = returnUrl;
            return;
        }
    }
    //2.进入认证页面
    if (finishProfile == 1) {
        if (roleType == "spy") {
            window.location.href = webServerPath + "/spy/spyauth.php";
            return;
        }
        if (roleType == "manager") {
            //modify by: zhumingming    2016-05-10      精英个人中心改版
//            window.location.href = webServerPath + "/manager/managerprofile.php";
            window.location.href = webServerPath + "/manager/mgrcenter.php";
            return;
        }
    }
    //3.common/login.php、common/lplogin.php、common/forgetpassword.php等页面登陆成功后进入首页
    if (strPage.indexOf("/common/") == 0 && strPage.indexOf("/common/casedetail.php") != 0 && strPage.indexOf("/common/searchcase.php") != 0) {
        if (roleType == "manager") {
            window.location.href = webServerPath + "/common/searchcase.php";
            return;
        }
        window.location.href = webServerPath + "/index.php";
        return;
    }
    //4.找精英、找猎头页面登陆成功特殊处理
    if (strPage.indexOf("/manager/searchspy.php") == 0 || strPage.indexOf("/spy/searchmanager.php") == 0 || strPage.indexOf("/common/searchcase.php") == 0) {
        if ((strPage.indexOf("/manager/searchspy.php") == 0 && roleType != "manager") || (strPage.indexOf("/spy/searchmanager.php") == 0 && roleType != "spy")) {
            //6.1登陆成功后进入首页
            if (roleType == "manager") {
                window.location.href = webServerPath + "/common/searchcase.php";
                return;
            }
            window.location.href = webServerPath + "/index.php";
            return;
        }
        if(roleType == 'spy'){
            $('#footerpop').remove();
        }
        return loginSuccessPartRefresh();//局部刷新
    }
    //5.登陆成功，强制刷新当前页
    if (roleType == "manager" && (strPage == "/" || strPage.indexOf("/index.php") == 0)) {
        window.location.href = webServerPath + "/common/searchcase.php";
        return;
    }
    window.location.reload();
    return;
}

//登陆成功，局部动态刷新数据
function loginSuccessPartRefresh() {
    $.ajax({type: 'post', dataType: 'json', url: webServerPath + '/common/login.php?act=Login_Header',
        success: function (data) {
            if (data.status == 100) {
                $("#header").remove();
                $("#headerTab").remove();
                $('body').prepend(data.html);
                $("#Message").trigger("mouseover");
                $("#Message").trigger("mouseleave");
                var thisName = window.location.pathname.toLowerCase();
                if ((thisName.indexOf("/common/searchcase.php") == 0 && data.role == 'spy')|| thisName.indexOf("/manager/searchspy.php") == 0 ) {
                    $('#headerTab .header_nav_whole').find("li").eq(3).addClass('active');//激活找Case  第4个TAB
                } else {
                    $('#headerTab .header_nav_whole').find("li").eq(1).addClass('active');//激活找精英或找猎头TAB 第2个TAB
                }

                $("#goButton a").trigger("click");                                 //触发分页GO事件,刷新列表数据
            } else {
                window.location.reload();                                          //局部刷新异常，强制重新加载
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert('系统忙，请稍候再试。');
        }
    });
}

//猎头角色，登陆强制下线，返回目标跳转地址
function loginOffline(strReturnUrl) {
    if ($._trim($._urlParams('returnUrl', 0)) != "") {
        strReturnUrl = $._urlParams('returnUrl', 0);
    }
    if ($._trim(strReturnUrl) != "") {
        strReturnUrl = '?returnUrl=' + strReturnUrl;
    }
    window.location.href = webServerPath + '/spy/offline.php' + strReturnUrl
}

//猎头角色，登陆时有强制下线提示，返回目标跳转地址。特殊页面：找精英，找Case
function getValidUrl() {
    var thisUrl = window.location.href;
    var thisName = window.location.pathname;
    var thisHost = thisUrl.substring(0, thisUrl.indexOf(thisName));
    thisName = thisName.toLowerCase();
    //common/login.php、common/lplogin.php、common/forgetpassword.php等页面登陆成功后进入首页
    if (thisName.indexOf("/common/") == 0 && thisName.indexOf("/common/casedetail.php") != 0) {
        return thisHost + "/index.php";
    }
    if (thisName.indexOf("/manager/searchspy.php") == 0) {
        return thisHost + "/index.php";
    }
    //首页单点登录特殊处理
    if (thisName == "/" || thisName.indexOf("/index.php") == 0) {
        var returnUrl = $('#returnUrl').val();
        if (typeof (returnUrl) != 'undefined' && returnUrl != '') {
            return returnUrl;
        }
        return '';           //首页取消跳转地址
    }
    return thisUrl;
}
/**
 * each是一个集合迭代函数，它接受一个函数作为参数和一组可选的参数
 * 这个迭代函数依次将集合的每一个元素和可选参数用函数进行计算，并将计算得的结果集返回
 {%example
 <script>
 var a = [1,2,3,4].each(function(x){return x > 2 ? x : null});
 var b = [1,2,3,4].each(function(x){return x < 0 ? x : null});
 alert(a);
 alert(b);
 </script>
 %}
 * @param {Function} fn 进行迭代判定的函数
 * @param more ... 零个或多个可选的用户自定义参数
 * @returns {Array} 结果集，如果没有结果，返回空集
 */
Array.prototype.each = function (fn) {
    fn = fn || Function.K;
    var a = [];
    var args = Array.prototype.slice.call(arguments, 1);
    for (var i = 0; i < this.length; i++) {
        var res = fn.apply(this, [this[i], i].concat(args));
        if (res != null)
            a.push(res);
    }
    return a;
};
/**
 * 得到一个数组不重复的元素集合<br/>
 * 唯一化一个数组
 * @returns {Array} 由不重复元素构成的数组
 */
Array.prototype.uniquelize = function () {
    var ra = new Array();
    for (var i = 0; i < this.length; i++) {
        if (!ra.contains(this[i])) {
            ra.push(this[i]);
        }
    }
    return ra;
};
/**
 * 确定数组中是否存在一个元素<br/>
 * @returns {Array} true|false
 */
Array.prototype.contains = function (item) {
        return $.inArray(item, this) == -1 ? false : true;
//    return RegExp(item).test(this);
}
/**
 * 求两个集合的补集
 {%example
 <script>
 var a = [1,2,3,4];
 var b = [3,4,5,6];
 alert(Array.complement(a,b));
 </script>
 %}
 * @param {Array} a 集合A
 * @param {Array} b 集合B
 * @returns {Array} 两个集合的补集
 */
Array.complement = function (a, b) {
    return Array.minus(Array.union(a, b), Array.intersect(a, b));
};
/**
 * 求两个集合的交集
 {%example
 <script>
 var a = [1,2,3,4];
 var b = [3,4,5,6];
 alert(Array.intersect(a,b));
 </script>
 %}
 * @param {Array} a 集合A
 * @param {Array} b 集合B
 * @returns {Array} 两个集合的交集
 */
Array.intersect = function (a, b) {
    return a.uniquelize().each(function (o) {
        return b.contains(o) ? o : null
    });
};
/**
 * 求两个集合的差集
 {%example
 <script>
 var a = [1,2,3,4];
 var b = [3,4,5,6];
 alert(Array.minus(a,b));
 </script>
 %}
 * @param {Array} a 集合A
 * @param {Array} b 集合B
 * @returns {Array} 两个集合的差集
 */
Array.minus = function (a, b) {
    return a.uniquelize().each(function (o) {
        return b.contains(o) ? null : o
    });
};
/**
 * 求两个集合的并集
 {%example
 <script>
 var a = [1,2,3,4];
 var b = [3,4,5,6];
 alert(Array.union(a,b));
 </script>
 %}
 * @param {Array} a 集合A
 * @param {Array} b 集合B
 * @returns {Array} 两个集合的并集
 */
Array.union = function (a, b) {
    return a.concat(b).uniquelize();
};
