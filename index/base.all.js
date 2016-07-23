/**
 * ��Ŀ���ú�����װ����չ��jQuery�£���������'_'�߿�ͷ������jQuery����ĺ���
 * �෽�����ã�
 *     $.functionName( param1[, param2[, param3, ...] ] );
 *     $._trim( "abcdef", "f" ); //ȥ���ַ�����β��'f'
 * ���󷽷����ã�
 *     jQueryObj.functionName( param1[, param2[, param3, ...] ] );
 *     $("#img")._imgPop(); //ͼƬ�Ŵ���ʾ
 * 
 * ���ú�����
 *     1.  $._trim( string[, char] ); //ȥ���ַ�����β�Ŀո񣨰���ȫ�ǿո񣩣��������ַ�
 *     2.  $._rtrim( string[, char] ); //ȥ���ַ����Ҳ�Ŀո񣨰���ȫ�ǿո񣩣��������ַ�
 *     3.  $._strLen( string ); //��ȡ�ַ������ȣ�һ�������������ֽ�
 *     4.  $._cutStr( string[, len[, replace]] ); //��ȡ�ַ���
 *     5.  $._urlParams( [name] ); //��ȡurl�еĲ���
 *     6.  $._stopProp( e ); //��ֹð�ݴ���
 *     7.  $._date( str[, c]); //��ȡ��ǰ����
 *     8.  $._addMask( [bColor[, zindex]] ); //�������
 *     9.  $._removeMask(); //�Ƴ�����
 *     10. $._formData( id[, boolean] ); //��ȡform���ύ��ֵ
 *     11. $._cookie( [name[, value[, options]]] ); //��ȡ����cookie��ֵ
 *     12. $._removeCookie( name ); //�Ƴ�cookie
 *     13. $._ajaxPage( fn, params[, pageId] ); //ajax��ҳ
 *     14. $._loadingPop( [obj[, msg[, style]]] ); //������ʾ
 *     15. $._panel( [params] ); //ȷ�ϵ���
 *     16. $._html2Entity( str ); //htmlתʵ��
 *     17. $._entity2Html( str ); //ʵ��תhtml
 *     18. $._prompt( msg[, t]); //������ʾ����t���������ʾ
 *     19. $._promptMes(type, mes, obj, kind); //��ʾ��Ϣ
 *     19. $._tooltip(type, kind, mes); //��ʾ��
 *     20. $._mousePos( e ); //��ȡ��ǰ���λ��
 *     21. $._bottomFix(); //�̶�ҳ��
 *     
 *     22. _alignCenter( [offset[, bool[, style]]] ); //����������ʾ
 *     23. _dragHandle( dragId[, cursor] ); //�϶�����
 *     24. _checkTextArea( limitObj, len ); //���textarea������
 *     25. _imgPop( [title[,src]] ); //ͼƬ�Ŵ�
 *     
 * @author xianwei.li@51job.com
 */
//���51jingying.com��������վ�ض������� modify by ziheng.guo 2015-01-14
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
    //��չjQuery�౾��ķ���
    $.extend({
        /**
         * ���ܣ�ȥ���ַ������˵Ŀո��ָ���ַ�
         * @param     string        str       �ַ���
         * @param     char          c         ��Ҫȥ�����ַ�������Ϊȥ���ո�
         * @return    string        �ַ���
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
         * ���ܣ�ȥ���ַ����Ҷ˵Ŀո��ָ���ַ�
         * @param     string        str       �ַ���
         * @param     char          c         ��Ҫȥ�����ַ�������Ϊȥ���ո�
         * @return    string        �ַ���
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
         * ���ܣ���ȡ�ַ������ȣ�һ�������������ֽڣ�����һ���ֽڡ�
         * @param     string        str        �ַ���
         * @return    int           �ַ������ȣ��ֽڴ�С��
         */
        _strLen: function (str) {
            if (!str)
                return 0;
            return str.replace(/[^\x00-\xff]/g, "aa").length;
        },
        /**
         * ���ܣ���ȡ�ַ�����Ĭ�Ͻ�ȡ20���ַ���һ��������2���ַ���������Ĭ����'...'��ʾ��
         * @param     string        str     Ҫ��ȡ���ַ���������
         * @param     int           len     Ҫ��ȡ���ֽڳ��ȣ�Ĭ��20���ַ�
         * @param     string        r       ĩβ����ַ���Ĭ��'...'
         * @return    string        �ַ��� 
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
                //        ����            �ո�             "             %             <               >              [              ��б��          ]            ^               `              {               |              }
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
         * ���ܣ���ȡurl�еĲ��������д��Ż������Ӷ������ֵ��ȡ��
         * @param     string         name     �������ƣ������ȡ���в���
         * @param     string         doExtend ���������Ƿ����⴦��0�����ֲ��䣬 2��תΪ��д,  1�����������תΪСд
         * @return    string|obj     ������Ϊ�շ���ָ��������ֵ������Ϊ��ʱ�������в���
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
                return null; //û�в�������
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
        //��ֹð�ݣ��¼����ݣ�
        _stopProp: function (e) {
            e = e || window.event;
            if (e.stopPropagation) {
                e.stopPropagation();//W3C��ֹð�ݷ���
            } else {
                e.cancelBubble = true;//IE��ֹð�ݷ���  
            }
            return false;
        },
        /**
         * ���ܣ���ȡ��ǰ����,���������ȡ������ʱ�䣬��ʽ'2013-12-22 06:20:21'��
         * @param    string        str     ʱ���ʽ��
         *                                 y���4λ��ݣ��磺2013
         *                                 ym������£��磺201312
         *                                 ymd��������գ���2013-12-20
         * @param    char          c       �ָ����Ĭ��'-'
         * @return    string        ��ǰ����
         */
        _date: function (str, c) {
            var myDate = new Date(), //�������ڶ���
                    yyyy = myDate.getFullYear(), //��ȡ���������(4λ,1970-????)
                    mm = myDate.getMonth() + 1, //��ȡ��ǰ�·�(0-11,0����1��)
                    dd = myDate.getDate(), //��ȡ��ǰ��(1-31)
                    hh = myDate.getHours(), //��ȡ��ǰСʱ��(0-23)
                    ii = myDate.getMinutes(), //��ȡ��ǰ������(0-59)
                    ss = myDate.getSeconds();    //��ȡ��ǰ����(0-59)
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
         * ���ܣ��������
         * @param     string        style     ���ֵ���ʽ��Ĭ�Ϻ�ɫ��͸��
         * @param     string        option     Ϊ1ʱmasknum���Բ�����
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
         * ���ܣ��Ƴ�����
         * @param     string        style     �Ƴ����ֵķ�ʽ��Ĭ��Ϊֱ���Ƴ���Ϊ1ʱ����masknum�����ж��Ƿ��Ƴ�
         */
        _removeMask: function (style) {
            if($("#mask").attr("masknum")>1 && style==1){
                $("#mask").attr("masknum",1);
                return false;
            }
            return $("#mask").remove();
        },
        /**
         * ��ȡ��������ƺͰ汾��
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
         * ���ܣ���ȡform�����ύ��ֵ��
         * @param     object         obj 
         * @param     boolean        bool    ���ص��������ͣ�Ĭ�Ϸ���json���ݣ���Ϊtrue�򷵻�string��ʽ�ַ���
         * @return    string|obj     Ĭ�Ϸ���json���ݣ�json����{param1:param1Value, param2:param2Value, ...}
         *                           ��bool=true�򷵻�string���͵�ֵ��ʽ��'param1=value1&param2=value2...',
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

            //����string��ʽ����ֵ
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

            //����json����ֵ
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
         * ���ܣ���ȡcookieֵ������cookieֵ
         * @param     string     name       ����
         * @param     string     value      ���ƶ�Ӧ��ֵ��valueΪ��ʱΪ��ȡcookie�е�ֵ��value��Ϊ������cookieֵ
         * @param     Object     options    {expires:expires, path:path, domain:domain, secure:secure}
         *                                   expires������ʱ�䣨��λ���죬expries=2Ϊ2���ʧЧ����Ĭ��Ϊ�գ��ر��������cookieֵʧЧ
         *                                   path��·����path���磺/test/���µ�����ҳ�湲���cookie��Ĭ��Ϊ�գ���ǰĿ¼
         *                                   domain��������������ҳ�涼�����cookie��Ĭ��Ϊ�գ���ǰĿ¼
         *                                   secure:��ȫ����Ĭ��Ϊ�ղ����ܣ�������Ϊ"secure"�������ü��ܵ�https��������
         * @return    string     cookie�е�ֵ
         */
        _cookie: function (name, value, options) {
            //��ȡcookie�е�ֵ
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

            //����cookie��ֵ
            else {
                var options = options || {}, expires = "", date, path, domain, secure;

                //ֵΪ��ʱ������cookie
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

                path = options.path ? ";path=" + options.path : ""; //·��
                domain = options.domain ? ";domain=" + options.domain : ""; //��
                secure = options.secure ? ";secure" : ""; //��ȫ
                document.cookie = [name, "=", encodeURIComponent(value), expires, path, domain, secure].join("");
            }
        },
        /**
         * ���ܣ�ɾ��cookie��ָ����ֵ
         * @param     string         name      cookie�е�ֵ
         */
        _removeCookie: function (name) {
            document.cookie = name + "=;expires=" + (new Date(0)).toGMTString();
        },
        /**
         * ���ܣ�AJAX��ҳ
         * @param   function    fn      ajax�ύ��Ļص�����������   
         * @param   object      params  �ύ����
         * @param   mix         pageId  ��ҳ��ťdiv��id
         * @param   object      loadObj ��ʾloading������div����
         * @param   int         offset  loading������div�߶�ƫ��ֵ
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
                currPage = -1;//��ҳGO��ť���ж� ajaxHandle->> params.curr_page == currPage
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
                //�ύ����
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
         * ���ܣ���ʾ������ʾ
         * @param mix obj ��Ҫ��ʾ������ʾ��jQuery���� ����
         * @param string msg ��ʾ��Ϣ
         * @param string style ��ʽ
         * @param int    offset ƫ����
         */
        _loadingPop: function (obj, msg, style, offset) {
            $("#loadingPop").remove();
            obj = obj || $("body");
            msg = msg || "�����У����Ժ�...";
            style = style || "";
            offset = offset || 0;
            var lp = $('<div id="loadingPop" style="position:absolute;margin-left:' + ((obj.width() - 150) / 2) + 'px;margin-top:' + (150 - obj.height() + offset) + 'px;border-radius:4px;border:1px solid #F5BD27;background-color:#FAFAFA;padding:10px;text-align:center;z-index:10000;' + style + '"><img src="' + imgBasePath + '/images/loading.gif" style="margin-right:10px;"/>' + msg + '</div>');
            return lp.appendTo(obj);
        },
        /**
         * ���ܣ������ɹ�ʧ�ܵ���
         * @param object params
         *      params.type         �������ͣ�success:�ɹ�������ΪĬ��:ע��
         *      params.title        �������⣬�������params.type���ж��磬�ɹ���ʧ�ܣ�ע��
         *      params.msg          ������ʾ��Ϣ
         *      params.btnNum       ��ť����Ĭ��Ϊ1��
         *      params.btnName1     ������һ����ť���ƣ�����Ϊ��ȷ����
         *      params.btnPath1     ������һ����ť��ת��ַ
         *      params.btnTarget1   �Ƿ���´��ڣ�true����ҳ��
         *      params.btnName2     �����ڶ�����ť���ƣ�����Ϊ��ȡ����
         *      params.btnPath2     �����ڶ�����ť��ת��ַ
         *      params.btnTarget2   �Ƿ���´��ڣ�true����ҳ��
         *      params.callback1    ��һ����ť�Ļص�����
         *      params.callback2    �ڶ�����ť�Ļص�����
         *      params.btnTarget1   ��һ����ť�Ƿ����ҳ�棬 true���µ�ҳ��
         *      params.closePanel1  ��һ����ť�Ƿ���Ҫ�رյ��� false���رգ�Ĭ��true�ر�
         *      params.closeCallback �رյ����Ļص�����
         *      params.offset       �����������������ƫ������Ĭ��80px
         */
        _panel: function (params) {
            params = params || {};
            var bg, i, title, str = "",
                    num = params.btnNum ? params.btnNum : params.btnName2 || params.callback2 ? 2 : 1,
                    offset = params.offset || 50;
            if (params.type == "success") {
                bg = "panel-success";
                i = "icon-tips-success-large";
                title = params.title || "�ɹ�";
            } else {
                bg = "panel-info";
                i = "icon-tips-info-large";
                title = params.title || "ע��";
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
            str += num >= 1 ? '<a name="sure" ' + (params.btnTarget1 ? 'target="_blank"' : "") + ' href="' + (params.btnPath1 || "javascript:;") + '" class="btn btSure">' + (params.btnName1 || "ȷ��") + '</a>' : "";
            str += num >= 2 ? ' <a name="cancel" ' + (params.btnTarget2 ? 'target="_blank"' : "") + ' href="' + (params.btnPath2 || "javascript:;") + '" class="btn btCancel">' + (params.btnName2 || "ȡ��") + '</a>' : "";
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
        //�����ַ���html��ǩת��Ϊʵ��
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
        //ʵ��ת��Ϊhtml��ǩ
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
         * ���ܣ���ʾ��ͣ��ʾ
         * @param string msg ��Ҫ��ʾ������ʾ��jQuery���� ����
         * @param int    t   ��ʾͣ��������Ĭ��2��
         * @param object obj Ҫ��ʾ���ĸ�div��
         * @param int    offset ���붥����ƫ����
         */
        _prompt: function (msg, t, obj, offset) {
            msg = msg || "�����ɹ�";
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
        //��ʾ��Ϣ
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
        //��ʾ����Ϣ
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
        //��ȡ��ǰ��������
        _mousePos: function (e) {
            var e = e || window.event, db = document.body, dd = document.documentElement;
            return {
                x: e.clientX + db.scrollLeft + dd.scrollLeft,
                y: e.clientY + db.scrollTop + dd.scrollTop
            };
        },
        //ȥ��html�ַ����е�style��Ϣ
        _clearStyle: function (str) {
            str = str || "";
            return str.replace(/style="[\w+-]+:\s+\w+;"/g, "");
        },
        //�̶�ҳ��divʼ���ڵײ�
        _bottomFix: function () {
            var objFoot=$("#footer");
            if ($.trim(objFoot.html()) == ""){
                return;
            }
            strCssText = "";
            var i = document.documentElement.clientHeight - document.body.clientHeight; //��������ڿɼ�����߶� - BODY�����ܸ߶�
            if (i > 0){
                if(i<objFoot.innerHeight()){
                    //i<objFoot.innerHeight()˵���߶Ȳ���"�ײ��߶�"֮�䣬����óȻʹ�þ��Զ�λ��
                    //Ϊ��ֹ�㼶��ϵ��Ӱ��߶ȣ��Ƚ��ײ����أ�Ȼ�󿴸߶ȹ�ϵ��
                    objFoot.hide();
                    var i = document.documentElement.clientHeight - document.body.clientHeight; //�ɼ�����߶�-BODY����߶�
                    if (i > objFoot.innerHeight()){
                        //�߶ȴ���"�ײ��߶�"������ʹ�þ��Զ�λ��
                        strCssText = "position:absolute;top:100%;z-index:-1;margin-top:-" + objFoot.innerHeight() + "px;";
                    }
                }else{
                    //i>0˵����������ݸ߶ȱȽ�С���ײ���ҪCSS���ⶨλ
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
                return false;   //ϵͳ��Ϣ
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
         * ���ܣ��������֣���������ʾ��
         * @param     string       type       ����
         * @param     int          payKind    1-������ 2-����
         * @param     string       str        ��ʾ����
         */
        _coinLayer: function (type, payKind, str, funName) {
            var name = '����';
            if (payKind == 1) {
                name = '������';
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
                                msg: name + "�ܶ<b style='color:#fbad40;'>" + data.msg.coin + "</b><br>����" + name + "���㣬�޷���ɴ˲���",
                                btnName1: "������ֵ",
                                btnPath1: webServerPath + "/spy/pay.php",
                                btnTarget1: true
                            });
                            return;
                        }

                        $._panel({
                            msg: name + "�ܶ<b style='color:#fbad40;'>" + data.msg.coin + "</b>&nbsp;&nbsp;" + "��������:" + "<b style='color:#fbad40;'>"+data.msg.deductCoin  + "</b><br><b style='color:#FF0033;'>"+str,
                            btnName1: "ȷ��",
                            callback1: funName
                        });
                    }
                }
            });
        }
    });

    //��չjQuery���󷽷�
    $.fn.extend({
        /**
         * ���ܣ���������
         * @param     mix           dragId    �����϶��Ķ�������id
         * @param     int           offset     ƫ����
         * @param     boolean       bool       �Ƿ�������֣�false����ӣ�Ĭ���������
         * @param     string        style      ������ʽ
         * @return    object  ������
         */
        _alignCenter: function (offset, bool, style) {
            offset = offset || 0;
            var l = document.body.scrollLeft + (document.body.clientWidth - this.width()) / 2; //div���
            var t = document.body.scrollTop ?
                    (document.documentElement.clientHeight - this.height()) / 2 - offset + document.body.scrollTop :
                    (document.documentElement.clientHeight - this.height()) / 2 - offset + document.documentElement.scrollTop;
            l = l < 0 ? 100 : l;
            t = t < 0 ? 100 : t;
            this.css("zIndex") < 10000 ?
                    this.css({left: l + "px", top: t + "px", position: "absolute"}) :
                    this.css({left: l + "px", top: t + "px", zIndex: 10000, position: "absolute"});
            //�������
            bool === false ? null : $._addMask(style);
            return this;
        },
        /**
         * ���ܣ�����϶�div��
         * @param string dragId     �������id
         * @param string cursor     �϶�ʱ���style
         * @return object �϶���
         */
        _dragHandle: function (dragId, cursor) {
            cursor = cursor || "move";
            var isMousedown = false, clickLeft = 0, clickTop = 0, $this = this;
            var dragDom = typeof dragId === "string" ? $("#" + dragId).css("cursor", cursor)[0] : dragId.css("cursor", cursor)[0];
            $this.css("zIndex") <= 9999 ? $this.css("zIndex", 10000) : null;

            //����������ʱ���¼�
            function startDrag(e) {
                e = window.event || e;  // ��ȡ��ǰ�¼�����
                isMousedown = true;  // ��¼�Ѿ�׼����ʼ�ƶ���
                clickLeft = e.clientX - $this.offset().left; // ��ȡ�����div��ߵľ���
                clickTop = e.clientY - $this.offset().top;   // ��ȡ�����divͷ���ľ���
                document.onmouseup = endDrag;  // ����ͷ��¼�
                document.onmousemove = doDrag; // ����ƶ��¼�
            }

            //��꿪ʼ�ƶ�ʱ���¼�
            function doDrag(e) {
                e = window.event || e; // ��ȡ��ǰ�¼�����
                if (!isMousedown) {
                    return false; // ���_IsMousedown���������˷���
                }
                // ����ƫ����
                var posX = e.clientX - clickLeft;

                // left���ܳ��������������ұ߽�
                if (posX < 0) {
                    posX = 0;
                } else if (posX > document.documentElement.scrollLeft + document.documentElement.clientWidth - $this.width()) {
                    posX = document.documentElement.scrollLeft + document.documentElement.clientWidth - $this.width() - 2;
                }
                // top���ܳ�������ҳ�����±߽�
                var posY = e.clientY - clickTop;
                var documentY = document.body.clientHeight < document.documentElement.clientHeight ?
                        document.documentElement.clientHeight : document.body.clientHeight;
                if (posY < 0) {
                    posY = 0;
                } else if (posY > (documentY - $this.height())) {
                    posY = documentY - $this.height();
                }
                //modify by fengshun ����б�߶ȸ���ҳ�治�����ܳ�ҳ��
                posY = posY < 0 ? 20 : posY;
                $this.css({left: posX + "px", top: posY + "px"});
            }

            // �ͷ�������ʱ���¼�
            function endDrag() {
                if (isMousedown) { // ���_IsMousedown��Ϊ����ô�͸�ֵΪ��
                    if (navigator.appName == "Microsoft Internet Explorer") {
                        $this[0].releaseCapture(); //�ú����ӵ�ǰ�Ĵ����ͷ���겶�񣬲��ָ�ͨ����������봦��
                    }
                    isMousedown = false;
                    document.onmousemove = null;
                    document.onmouseup = null;
                }
            }
            dragDom.onmousedown = startDrag; // ��갴���¼�
            return $this;
        },
        /**
         * ���ܣ�����������е�����
         * @param   object  limitObj   ��ʾ����div��jquery����
         * @param   int     len        ���Ƴ���
         * @returns object  ������textarea����
         */
        _checkTextArea: function (limitObj, len) {
            var lw = typeof limitObj === "string" ? $("#" + limitObj) : limitObj;
            var wordLen = $._strLen($._trim($(this).val()));
            if (wordLen > len) {
                lw.html('�Ѿ�����<span class="f14" style="color:red;font-weight:bold;">' + Math.ceil((wordLen - len) / 2) + '</span>����');
            } else {
                lw.html('��������<span class="f14" style="font-weight:bold;">' + Math.ceil((len - wordLen) / 2) + '</span>����');
            }
            return this;
        },
        //ͼƬ�Ŵ�
        _imgPop: function (title, src) {
            var pathArr = src.split('/');
            var name = pathArr[pathArr.length - 1];
            var nameArr = name.split('-');
            var height = 300;
            var width = 402;
            if (nameArr.length == 4) {
                //�����ͼ�ߴ�
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
        //ͼƬ�Ŵ�,����ת
        _imgRotate: function (title, src, content) {
            content = content || '';
            src = src || $(this).attr("src");
            var str = '<div id="imgPopup" class="custom-panel panel-normal" style="position:absolute;z-index:10000;display:none;">';
            str += '<div class="panel custom-bg">';
            str += '<div class="panel-head" id="imgPopupHeader" style="padding-right:60px;"><a class="close" aria-hidden="true">��</a><h2>' + (title || 'ͼƬԤ��') + '</h2></div>';
            str += '<div class="panel-body-normal">';
            str += content;
            str += '<div class="well penel_card"><img src="' + src + '"  /></div>';
            str += '<div class="rotation_box clearfix">';
            str += '<a class="rotation_left">��ת90��</a>';
            str += '<a class="rotation_center" href="' + src + '" target="_blank">�鿴ԭͼ</a>';
            str += '<a class="rotation_right">��ת90��</a>';
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

//=================================JS��֤����================================
var RegExpObj = {
    //�Ż�����
    yahooemail: function (str) {
        return /^(([0-9a-zA-Z]+)|([0-9a-zA-Z]+[_.0-9a-zA-Z-]*))@yahoo.(\S)+$/.test(str);
    },
    //����
    email: function (str) {
        return /^(([0-9a-zA-Z]+)|([0-9a-zA-Z]+[_.0-9a-zA-Z-]*))@([a-zA-Z0-9-]+[.])+([a-zA-Z]{2}|net|com|gov|mil|org|edu|int|name|asia)$/i.test(str);
    },
    //����+�ֻ�
    phoneRich: function (str) {
        return /(^(([+]{0,1}\d{2,4}|\d{2,4})-?)?1[34578]\d{9}$)/.test(str);
    },
    //����+�绰/����
    telephoneRich: function (str) {
        return /(^(([+]{0,1}\d{2,4}|\d{2,4})-?)?((\d{3,4})-?)?(\d{6,8})(-?(\d{1,6}))?$)/.test(str);
    },
    //�ֻ�
    phone: function (str) {
        return /^1[34578][0-9]{9}$/.test(str);
    },
    //�绰/����
    telephone: function (str) {
        return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?(\(0\d{2,3}\)|0\d{2,3})?(\(0\d{2,3}\)|0\d{2,3})?[1-9]\d{6,7}(\-\d{1,5})?$/.test(str);
    },
    //qq��
    qq: function (str) {
        return /[1-9][0-9]{4,}$/.test(str);
    },
    //΢�źţ���Ӣ���»������֣�
    weixin: function (str) {
        return /^([0-9a-zA-Z]+[_0-9a-zA-Z]*)$/.test(str);
    },
    //������
    url: function (str) {
        return /^http[s]?:\/\/([\w-]+\.)+[\w-]+([\w-./?%&=]*)?$/.test(str);
    },
    //�ж��Ƿ��д�д��ĸ
    hasCapital: function (str) {
        return /^.*[A-Z]+.*$/.test(str);
    },
    //�ж��Ƿ���Сд��ĸ
    hasLowercase: function (str) {
        return /^.*[a-z]+.*$/.test(str);
    },
    //�ж��Ƿ�������
    hasNumber: function (str) {
        return /^.*[0-9]+.*$/.test(str);
    },
    //�ж��Ƿ��������ַ�
    hasOther: function (str) {
        return /^.*[^0-9A-Za-z]+.*$/.test(str);
    },
    //��֤��¼�û���
    loginUserName: function (str) {
        return /^([0-9a-zA-Z]+[_0-9a-zA-Z@.-]*)$/.test(str);
    },
    //�ж��Ƿ�Ϊ����
    isNumber: function (str) {
        return /^[0-9]+$/.test(str);
    },
    //�ж��Ƿ������ֻ���ĸ
    isCharOrNum: function (char) {
        return /^([0-9]+|\w+)$/.test(char);
    }
};

//�������ò�������ȡ��Ϣ
$(function () {
    //�̶�ҳ���ڵײ�
    $._bottomFix();
    $(window).resize(function () {
        if ($("#mask")[0]){
             var masknum = parseInt($("#mask").attr("masknum"))-1;
             $("#mask").attr("masknum",masknum);
             $._addMask();
        }
        $._bottomFix();
    });

    //��ҳgo��ť
    $(".pagination input").bind({change: function () {
            $(this).closest("#goButton").find("a").attr("href", getGoHref($(this)));
        }, keydown: function (event) {
            if (event.keyCode == 13) {
                window.location.href = getGoHref($(this));
            }
        }});
    //��ȡ��ҳ��ťgo��href
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

    //=========================��ʾ�����˵�============================
    //���IE7��bug modify by ziheng.guo 2015-9-10
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
    
    //======================= header��ʾ�����˵�==============================
    $(document).on('mouseenter','#headerTab li',function(){
        $(this).find('ul').show();
    });
    $(document).on('mouseleave','#headerTab li',function(){
        $(this).find('ul').hide();
    });
    //��ת������case
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
                if (data.status == 100) { //���桢�����ɹ�
                    window.location.href = webServerPath + "/spy/casemanage.php?act=addcase&type=newcase";
                } else if (data.status == 401) { //���������Ϣ
                    var str = data.msg + '���޷�ʹ�ô˹��ܣ�<a href="' + webServerPath + '/' + data.jumpUrl + '">�����֤</a>';
                    $._panel({msg: str, type: "fail", btnPath1: webServerPath + "/" + data.jumpUrl});
                } else if (data.status == 400) {
                    $._panel({msg: "�û���δ��¼", type: "fail"});
                }
            }
        });
    });
    
    //=======================end header��ʾ�����˵�==============================

    //=======================end ��ʾ�����˵�==============================

    //***********************************************************  ����Ϣ����α����begin ziheng.guo ***********************************************************/
    //��Ҫ�߼���1.ͬ��������TABҳ��ʱ����֤��1����ѯ�����ȡ����Ϣ���ݣ������ӷ�������Ч��������������ӳ����ӷ�������������Tabֻ��cookie�е���Ϣ��Ϣ��
    //         2.����ǰ��ѯ��ҳ��رգ���������һ�������TABִ����ѯ��
    //         3.����TAB���ڴ�webchat.phpҳ�棬����ҳ��titleֹͣ��������Ч��
    //         4.����TAB���ڴ�webchat.phpҳ�棬����������Ϣʱ������ҳ��title������������Ч��
    //��ʶ˵����$._cookie('hubComet')���ú����壺$._cookie('hubComet')="�����TABҳ��Ψһ��ʶ"|"����ִ����ѯ�ı���ʱ���"|"�Ƿ���ѯ"|"˽��ҳ�������ʱ���
    //���ر��ز���ϵͳʱ���������
    function getLocalTimestamp() {
        var localData = new Date();
        return localData.getTime();//��ǰʱ��ĺ�����
    }
    var webServerCometPath = webServerPath;                       //��ѯ������
    var webServerLongCometPath = webServerPath;                   //�����ӷ�����Ĭ��Ϊ��ѯ������
    if (webCometUse == 1 && webCometServer != "") {
        var thisUrl = window.location.href;
        var thisHost = thisUrl;
        var thisName = window.location.pathname;
        if (thisName != "" && thisName != "/") {
            thisHost = thisUrl.substring(0, thisUrl.indexOf(thisName));
        }
        thisHost = thisHost.toLowerCase();
        if (thisHost.indexOf("51jingying.com") >= 0) {
            webServerLongCometPath = "http://comet.51jingying.com"; //�����ӷ�����.com
        } else if (thisHost.indexOf("51jingying.cn") >= 0) {
            webServerLongCometPath = "http://comet.51jingying.cn";  //�����ӷ�����.cn
        } else {
            webServerLongCometPath = webCometServer;                //�����ӷ�����.WWW_COMETSERVER
        }
    }

    var strUrlSource = "?source=cometkeep";                         //�����ӷ��������ʳ�ʱת����ѯ�������״α�ʶ
    if (webServerCometPath == webServerLongCometPath) {
        strUrlSource = '';
    }

    var role = getRole();              //��ǰ�û���ɫ
    var autoPoll_msgTimeStamp = 0;     //������Ϣʱ���
    var autoPoll_SetInterval = 0;      //��ʱ�Զ�����
    var autoPoll_isComet = true;       //��ǰҳ�Ƿ����ӷ�����
    var autoPoll_timeOut = 90000;      //��ǰҳ�Ƿ����ӷ�������ʱ��90��
    var autoPoll_handleAjax;           //��ǰҳAjax���
    var autoPoll_cometAjaxErr = 0;     //��ǰҳAjax�����Ӵ������
    var autoPoll_linkHost = webServerLongCometPath;
    var autoPoll_pollTime = role === "spy" ? SPYTIME : MANAGERTIME; //�����ˡ���ͷ��ѯʱ����
    var thisBrowserPageTitle = window.document.title;//�����TABҳ��Title
    var thisBrowserPageId = getLocalTimestamp();     //�����TABҳ��Ψһ��ʶ

    $._cookie("HasMsg", "0|0|0|0", {path: "/", expires: 1});//��ʼ������cookie��Ϣ��Ϣ
    //��ǰ�򿪵���˽��ҳ�棬��¼˽��ҳ�������ʱ�����3��/��
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
        startAutoWebchatIsOpen = setInterval(webchatIsOpen, 3000); //������ѯ
    }

    //�������������Ч����1��/��
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
                //����Ч��
                if (window.document.title == "����������" + strTitle) {
                    strTitle = "������Ϣ��" + strTitle;
                } else {
                    strTitle = "����������" + strTitle;
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
        startAutoSetBrowserTitle = setInterval(setBrowserTitle, 1000); //������ѯ
    }

    //��ǰҳ��������ѯ��ʽ
    if (window.location.pathname == "/manager/webchat.php" || window.location.pathname == "/spy/webchat.php") {
        webchatIsOpen();  //��¼˽��ҳ�������ʱ���
    } else {
        setBrowserTitle();//�������������Ч��
    }

    //ˢ�µ�ǰ�����Tab������ѯhubComet��Ϣ
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
    //��ѯ�Ƿ���Ҫ������ѯ�߼�����������е�½����Ϣ�޷���ѯ�����⡣
    function startAutoPoll() {
        clearInterval(startPoll_SetInterval);
        if (!$("#Message")[0]) {
            startPoll_SetInterval = setInterval(startAutoPoll, 2000);     //��������ѯ
            return;
        }

        $._cookie("HasMsg", "0|0|0|0", {path: "/", expires: 1});//��ʼ������cookie��Ϣ��Ϣ
        setBrowserIsActivate();
        autoPoll();
    }

    //�����ͣ��Ϣͼ�꣬������ѯ
    $(document).on('mouseover', '#Message', function (e) {
        var arr = $._cookie("HasMsg").split("|");
        if (arr.length > 2 && arr[0] >= 0) {
            $(this).find("span[msg]").text(arr[0]);  //˽��
            $(this).find("span[card]").text(arr[1]); //��Ƭ
            $(this).find("span[sys]").text(arr[2]);  //ϵͳ��Ϣ
        }
        setBrowserIsActivate();
        clearInterval(autoPoll_SetInterval);
        autoPoll_SetInterval = setInterval(autoPoll, autoPoll_pollTime);
    });

    //��ǰҳ�����focus���򿪱�ҳ����ѯ
    $(window).bind("focus load", function () {
        if (autoPoll_isComet == false) {
            setBrowserIsActivate();
            clearInterval(autoPoll_SetInterval);
            autoPoll_SetInterval = setInterval(autoPoll, autoPoll_pollTime);
        }
    });

    //��ǰҳʧȥfocus���رձ�ҳ����ѯ��ע�����¼���ʱ��ʹ�ã�ziheng.guo 2015-5-8
    $(window).blur(function () {
        autoPoll_isComet = true;
    });

    //��ѯ��������ȡ��Ϣ��Ϣ
    function autoPoll() {
        if (autoPoll_isComet == false) {
            return;
        }
        //��ǰ�û��л��˻�������
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
            strUrlSource = ''; //ʵ�ֵ�ǰҳ��ֻ��һ�γ������쳣������?source=cometkeep
        }
        if (autoPoll_handleAjax) {
            autoPoll_handleAjax.abort(); //ȡ�� Ajax ���� 
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
                    autoPoll_linkHost = webServerLongCometPath; //�Զ�תΪ������
                }
                clearInterval(autoPoll_SetInterval);
                if (autoPoll_linkHost == webServerCometPath) {
                autoPoll_SetInterval = setInterval(autoPoll, autoPoll_pollTime);
                } else {
                    var pollTime = 1;
                    if (autoPoll_msgTimeStamp <= 0 || (typeof (data.msg.m) != 'undefined' && data.msg.m != 1)) {
                        pollTime = autoPoll_pollTime; //�����Ѳ��ǺϷ�����
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

    //��ѯcookie���鿴�Ƿ�������Ϣ
    function accessCookieMsg() {
        if (autoPoll_isComet == false) {
            return;
        }
        $("#Message").find("i").hide(); //������Ϣ��ʾ���
        var arr = $._cookie("HasMsg").split("|");
        if (arr[0] > 0 || arr[1] > 0 || arr[2] > 0) {
            $("#Message").find("i").show(); //��ʾ��Ϣ��ʾ���
        }
    }

    //��ȡ��ǰ�û�����
    function getRole() {
        return $._cookie("jyLoginRole").split("=").pop();
    }
    //***********************************************************  ����Ϣ����end ziheng.guo ***********************************************************/
});


/**
 * ��½�ɹ�ͳһ�߼�����½�ɹ�֮����ã�
 * @param {type} data.roleType        spy,manager ָ����½��ɫ
 * @param {type} data.finishProfile   ��ǰ��½��ɫ��֤״̬������  1-δ��ɣ�����ת��ָ�������Ϣ����ҳ�棻����-����ɣ�����ʵ������ж����ڵ�ǰҳ���ˢ�µ���������
 * @returns {undefined}
 * modify by liufei 2015-12-8 �ж��Ǿ�Ӣ��ɫ��¼��Ƭ��Ϣ��������ת����caseҳ
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
        setUserInfo(userId, userRole, cookieId, cookieDate, cilentIP, diviceType);//��½�ɹ�����ʼ���û���Ϊ����
    }
    $._removeMask();
    $('#loginLayer').remove();
    var strPage = window.location.pathname.toLowerCase();//��ǰҳ������
    
    //�����û���ת���ֻ���֤
    if(data.isshowMobileAuth == true){
         window.location.href = webServerPath + "/index.php?isshowMobileAuth=1";
        return;
    }
    //1.��ҳ���Ƚ��������ַ
    if (strPage == "/" || strPage.indexOf("/index.php") == 0) {
        var returnUrl = $('#returnUrl').val();
        if (typeof (returnUrl) != 'undefined' && returnUrl != '') {
            window.location.href = returnUrl;
            return;
        }
    }
    //2.������֤ҳ��
    if (finishProfile == 1) {
        if (roleType == "spy") {
            window.location.href = webServerPath + "/spy/spyauth.php";
            return;
        }
        if (roleType == "manager") {
            //modify by: zhumingming    2016-05-10      ��Ӣ�������ĸİ�
//            window.location.href = webServerPath + "/manager/managerprofile.php";
            window.location.href = webServerPath + "/manager/mgrcenter.php";
            return;
        }
    }
    //3.common/login.php��common/lplogin.php��common/forgetpassword.php��ҳ���½�ɹ��������ҳ
    if (strPage.indexOf("/common/") == 0 && strPage.indexOf("/common/casedetail.php") != 0 && strPage.indexOf("/common/searchcase.php") != 0) {
        if (roleType == "manager") {
            window.location.href = webServerPath + "/common/searchcase.php";
            return;
        }
        window.location.href = webServerPath + "/index.php";
        return;
    }
    //4.�Ҿ�Ӣ������ͷҳ���½�ɹ����⴦��
    if (strPage.indexOf("/manager/searchspy.php") == 0 || strPage.indexOf("/spy/searchmanager.php") == 0 || strPage.indexOf("/common/searchcase.php") == 0) {
        if ((strPage.indexOf("/manager/searchspy.php") == 0 && roleType != "manager") || (strPage.indexOf("/spy/searchmanager.php") == 0 && roleType != "spy")) {
            //6.1��½�ɹ��������ҳ
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
        return loginSuccessPartRefresh();//�ֲ�ˢ��
    }
    //5.��½�ɹ���ǿ��ˢ�µ�ǰҳ
    if (roleType == "manager" && (strPage == "/" || strPage.indexOf("/index.php") == 0)) {
        window.location.href = webServerPath + "/common/searchcase.php";
        return;
    }
    window.location.reload();
    return;
}

//��½�ɹ����ֲ���̬ˢ������
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
                    $('#headerTab .header_nav_whole').find("li").eq(3).addClass('active');//������Case  ��4��TAB
                } else {
                    $('#headerTab .header_nav_whole').find("li").eq(1).addClass('active');//�����Ҿ�Ӣ������ͷTAB ��2��TAB
                }

                $("#goButton a").trigger("click");                                 //������ҳGO�¼�,ˢ���б�����
            } else {
                window.location.reload();                                          //�ֲ�ˢ���쳣��ǿ�����¼���
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert('ϵͳæ�����Ժ����ԡ�');
        }
    });
}

//��ͷ��ɫ����½ǿ�����ߣ�����Ŀ����ת��ַ
function loginOffline(strReturnUrl) {
    if ($._trim($._urlParams('returnUrl', 0)) != "") {
        strReturnUrl = $._urlParams('returnUrl', 0);
    }
    if ($._trim(strReturnUrl) != "") {
        strReturnUrl = '?returnUrl=' + strReturnUrl;
    }
    window.location.href = webServerPath + '/spy/offline.php' + strReturnUrl
}

//��ͷ��ɫ����½ʱ��ǿ��������ʾ������Ŀ����ת��ַ������ҳ�棺�Ҿ�Ӣ����Case
function getValidUrl() {
    var thisUrl = window.location.href;
    var thisName = window.location.pathname;
    var thisHost = thisUrl.substring(0, thisUrl.indexOf(thisName));
    thisName = thisName.toLowerCase();
    //common/login.php��common/lplogin.php��common/forgetpassword.php��ҳ���½�ɹ��������ҳ
    if (thisName.indexOf("/common/") == 0 && thisName.indexOf("/common/casedetail.php") != 0) {
        return thisHost + "/index.php";
    }
    if (thisName.indexOf("/manager/searchspy.php") == 0) {
        return thisHost + "/index.php";
    }
    //��ҳ�����¼���⴦��
    if (thisName == "/" || thisName.indexOf("/index.php") == 0) {
        var returnUrl = $('#returnUrl').val();
        if (typeof (returnUrl) != 'undefined' && returnUrl != '') {
            return returnUrl;
        }
        return '';           //��ҳȡ����ת��ַ
    }
    return thisUrl;
}
/**
 * each��һ�����ϵ���������������һ��������Ϊ������һ���ѡ�Ĳ���
 * ��������������ν����ϵ�ÿһ��Ԫ�غͿ�ѡ�����ú������м��㣬��������õĽ��������
 {%example
 <script>
 var a = [1,2,3,4].each(function(x){return x > 2 ? x : null});
 var b = [1,2,3,4].each(function(x){return x < 0 ? x : null});
 alert(a);
 alert(b);
 </script>
 %}
 * @param {Function} fn ���е����ж��ĺ���
 * @param more ... ���������ѡ���û��Զ������
 * @returns {Array} ����������û�н�������ؿռ�
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
 * �õ�һ�����鲻�ظ���Ԫ�ؼ���<br/>
 * Ψһ��һ������
 * @returns {Array} �ɲ��ظ�Ԫ�ع��ɵ�����
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
 * ȷ���������Ƿ����һ��Ԫ��<br/>
 * @returns {Array} true|false
 */
Array.prototype.contains = function (item) {
        return $.inArray(item, this) == -1 ? false : true;
//    return RegExp(item).test(this);
}
/**
 * ���������ϵĲ���
 {%example
 <script>
 var a = [1,2,3,4];
 var b = [3,4,5,6];
 alert(Array.complement(a,b));
 </script>
 %}
 * @param {Array} a ����A
 * @param {Array} b ����B
 * @returns {Array} �������ϵĲ���
 */
Array.complement = function (a, b) {
    return Array.minus(Array.union(a, b), Array.intersect(a, b));
};
/**
 * ���������ϵĽ���
 {%example
 <script>
 var a = [1,2,3,4];
 var b = [3,4,5,6];
 alert(Array.intersect(a,b));
 </script>
 %}
 * @param {Array} a ����A
 * @param {Array} b ����B
 * @returns {Array} �������ϵĽ���
 */
Array.intersect = function (a, b) {
    return a.uniquelize().each(function (o) {
        return b.contains(o) ? o : null
    });
};
/**
 * ���������ϵĲ
 {%example
 <script>
 var a = [1,2,3,4];
 var b = [3,4,5,6];
 alert(Array.minus(a,b));
 </script>
 %}
 * @param {Array} a ����A
 * @param {Array} b ����B
 * @returns {Array} �������ϵĲ
 */
Array.minus = function (a, b) {
    return a.uniquelize().each(function (o) {
        return b.contains(o) ? null : o
    });
};
/**
 * ���������ϵĲ���
 {%example
 <script>
 var a = [1,2,3,4];
 var b = [3,4,5,6];
 alert(Array.union(a,b));
 </script>
 %}
 * @param {Array} a ����A
 * @param {Array} b ����B
 * @returns {Array} �������ϵĲ���
 */
Array.union = function (a, b) {
    return a.concat(b).uniquelize();
};
