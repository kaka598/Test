/**
 * @description    地区弹出窗口控件
 * @author          lixianwei
 * @version         1.1
 * @copyright       Copyright (c) 2013, 51job
 * @since           2014-04-22
 */
(function ($) {
    var id, //地区div的id属性名
            maxNum, //提交名称
            textLen, //页面显示文字字节长度
            lang, //默认语言
            selectedCity = [], //已选的城市
            numError, //错提示
            prompt = "选择地区",
            areaTitle,
            maxProvinceCnt = 9;

    //地区弹窗
    window.Area = function (name, num, len, l,callBack) {
        id = name || "jobArea"; //地区div的id属性名
        maxNum = num || 5; //最多选择地区数
        textLen = len || 28; //页面显示文字字节长度
        lang = l || "cn"; //默认语言
        numError = "最多只能选择" + maxNum + "个地区";
        selectedCity[id] = [];
        areaTitle = $("#" + id + " a[name=areaTitle]").attr("data") || "选择地区";
        prompt = areaTitle;

        //判断是否有选择的地区
        var areaVal = $("#" + id + " input[name=area]").val();
        if (areaVal) {
            selectedCity[id] = areaVal.split(",");
        }
        //创建窗体
        createBody(callBack);
    };

    //城市
    var areaCity = [
        {
            tag: 'A',
            subIds: ['230400']
        },
        {
            tag: 'L',
            subIds: ['270200', '160300', '120800', '170300', '071200', '140400']
        },
        {
            tag: 'B',
            subIds: ['010000', '280400', '160400']
        },
        {
            tag: 'M',
            subIds: ['090300']
        },
        {
            tag: 'C',
            subIds: ['240200', '190200', '090200', '060000', '070500', '190700', '070700']
        },
        {
            tag: 'N',
            subIds: ['070200', '080300', '130200', '070900', '140200']
        },
        {
            tag: 'D',
            subIds: ['230300', '030800', '230800', '220500']
        },
        {
            tag: 'Q',
            subIds: ['120300', '110400', '160600', '031900']
        },
        {
            tag: 'E',
            subIds: ['280800']
        },
        {
            tag: 'S',
            subIds: ['020000', '040000', '230200', '160200', '070300', '100300', '080500', '030400']
        },
        {
            tag: 'F',
            subIds: ['110200', '030600', '230600']
        },
        {
            tag: ' ',
            subIds: []
        },
        {
            tag: 'G',
            subIds: ['030200', '260200', '130800']
        },
        {
            tag: 'T',
            subIds: ['050000', '210200', '080800', '160500', '071800', '231200']
        },
        {
            tag: 'H',
            subIds: ['220200', '080200', '150200', '100200', '280200', '030300', '190500', '071900', '080900', '160700']
        },
        {
            tag: 'W',
            subIds: ['180200', '070400', '080400', '310200', '150300', '120500', '120600']
        },
        {
            tag: ' ',
            subIds: ['080900', '160700']
        },
        {
            tag: 'X',
            subIds: ['200200', '110300', '071100', '180500', '190400', '200300']
        },
        {
            tag: 'J',
            subIds: ['120200', '080700', '080600', '240300', '031500', '180700', '120900', '130300']
        },
        {
            tag: 'Y',
            subIds: ['120400', '070800', '180300', '071300', '081400', '230500', '290200']
        },
        {
            tag: 'K',
            subIds: ['250200', '070600']
        },
        {
            tag: 'Z',
            subIds: ['110500', '170200', '030700', '030500', '071000', '190300', '031700']
        },
        {
            tag: ' ',
            subIds: []
        },
        {
            tag: ' ',
            subIds: ['031800', '071400', '120700']
        }
    ],
            //省份
            areaProvince = [
                {
                    tag: 'A-G',
                    subIds: ['150000', '340000', '110000', '270000', '030000', '140000', '260000', '360000']
                },
                {
                    tag: 'H-J',
                    subIds: ['100000', '160000', '170000', '220000', '180000', '190000', '240000', '070000', '130000']
                },
                {
                    tag: 'L-S',
                    subIds: ['230000', '280000', '290000', '320000', '120000', '210000', '200000', '090000']
                },
                {
                    tag: 'T-Z',
                    subIds: ['350000', '300000', '330000', '310000', '250000', '080000']
                }
            ],
            //新城市，蓝色粗体标记的城市
            newCity = ['130300', '130800', '200300', '160700', '230400', '230500', '230600', '230800', '231200', '220500', '140400', '290200', '280800'],
            //热点城市，黑体城市
            hotCity = ['010000', '020000', '030200', '040000','080200','090200','120300','070200'],
            //没有子弹层的地区
            noChildArea = ['360000', '340000', '350000', '330000'];

    //创建地区窗体
    function createBody(callBack) {
         var exparea = '';
        if($('#'+id+' .areawidget_exparea').length>0){
            var checked = '';
            if($('#'+id+' .areawidget_exparea').attr('value')==='1'){
                checked = 'checked';
            }
            exparea = '<span><input id="areawidget_exparea" type="checkbox" '+checked+'>期望工作地</span>';
        } 
        var areaObj = $('<div id="' + id + 'Widget" class="model-business modal business-model hide area-model" style="display:none;width:790px;margin-left:0px;z-index:10000;"></div>'),
                areaStr = "",
                i, j, l;

        areaStr += '<div class="modal-header">';
        areaStr += '<div id="' + id + 'Header">';
        areaStr += '<a class="w_close w_close_ie closediv" style="margin-top: 4px; margin-right: 5px;"></a>';
        areaStr += '<span style="font-weight:bold;font-size:14px;padding-right:10px;line-height:30px;margin-top:10px;">' + areaTitle + '</span>(最多只能选择' + maxNum + '个地区)'+exparea+'</div>';
        areaStr += '<div class="selected"><ul class="clearfix">';
        areaStr += '<li><span>已选：</span></li>';

        //已选地区
        areaStr += '<li class="selCity">';

        // 设定删除文字
        var delTip = '全部删除';
        if (maxNum == 1) {
            delTip = '删除';
        }
        //判断是否已有地区选择
        if (selectedCity[id].length > 0) {
            for (i = 0, l = selectedCity[id].length; i < l; i++) {
                if (typeof (dd_jobarea[selectedCity[id][i]]) != 'undefined') {
                    areaStr += '<label style="margin-right:10px;" class="checkbox"><input subid="' + selectedCity[id][i] + '" checked type="checkbox" style="width:14px;height:14px;">' + dd_jobarea[selectedCity[id][i]] + '</label>';
                }
            }
            areaStr += '</li><li><a>' + delTip + '</a></li>';
        } else {
            areaStr += '</li><li style="display:none;"><a style="margin-left:10px;">' + delTip + '</a></li>';
        }

        areaStr += '</ul></div></div>';
        areaStr += '<div class="modal-body" style="padding-top:5px;">';
        areaStr += '<div class="hot_city">热门城市：';
        for (i = 0, l = hotCity.length; i < l; i++) { 
            if (typeof (dd_jobarea[hotCity[i]]) !== 'undefined') { 
                areaStr += '<a subid="' + hotCity[i] + '">' + dd_jobarea[hotCity[i]] + '</a>';   
            }  
        }
        areaStr += '</div>';
        areaStr += '<div class="tab-where">';
        areaStr += '<div id="areaErr"></div>';
        
        areaStr += '<table style="margin-top:10px;margin-bottom:1px;" class="area-table table-condensed table-striped"><tbody class="cityName">'; 
        //城市
        for (i = 0, l = areaCity.length; i < l; i++) {
            areaStr += "<tr>";

            //循环左侧城市
            areaStr += '<td class="cityOrange" style="cursor:auto">' + areaCity[i].tag + '</td>';
            areaStr += addCity(areaCity[i]);

            //循环右侧城市
            i++;
            areaStr += '<td class="cityOrange" style="cursor:auto">' + areaCity[i].tag + '</td>';
            areaStr += addCity(areaCity[i]);
            areaStr += "</tr>";
        }

        areaStr += '</tbody></table></div>';
        areaStr += '<div class="selected"><ul class="clearfix"><li><strong>选择省份：</strong></li></ul></div>';
        areaStr += '<div><table class="area-table table-condensed table-striped" style="margin-bottom:0px;"><tbody class="province">';

        //省份
        for (i = 0, l = areaProvince.length; i < l; i++) {
            areaStr += "<tr>";
            areaStr += '<td class="cityOrange" style="cursor:auto">' + areaProvince[i].tag + '</td>';
            for (var j = 0, k = areaProvince[i].subIds.length; j < k; j++) {
                var sz = areaProvince[i].subIds[j] === "030000" ? "(除深圳)" : "";
                areaStr += !areaProvince[i].subIds[j] ? '<td></td>' : '<td subid="' + areaProvince[i].subIds[j] + '">' + dd_jobarea[areaProvince[i].subIds[j]] + sz + '</td>';
            }
            if (areaProvince[i].subIds.length < maxProvinceCnt) {
                for (var k = 0; k < (maxProvinceCnt - areaProvince[i].subIds.length); k++) {
                    areaStr += '<td class="cityOrange" style="cursor:default;"></td>';
                }
            }
            areaStr += "</tr>";
        }
        areaStr += '<tr></tr></tbody></table></div></div>';
        areaStr += '<div class="modal-footer"><a class="btn btn-primary sureButton">确定</a><a class="btn cancleButton">关闭</a></div>';

        areaObj.html(areaStr).appendTo("body").fadeIn("fast")._alignCenter()._dragHandle($("#" + id + 'Header')).find("td[subid]").bind("mouseover", addBg);
        areaObj.find("input").bind("click", delCity); //绑定取消选中的地区事件
        areaObj.find("li.selCity").next("li").bind("click", delAll); //绑定清除所有地区事件
        $("tbody.cityName").find("td[subid]").bind("click", selCity); //绑定选择城市事件
        $(".hot_city").find("a[subid]").bind("click", selCity); //绑定选择城市事件
        $("tbody.province").find("td[subid]").bind("click", childCity); //绑省份定子菜单事件
        areaObj.find("a.closediv").bind("click", close); //绑定关闭弹窗事件
        $("#" + id + "Widget a.cancleButton").bind("click", cancle);
        $("#" + id + "Widget a.sureButton").on('click', function () {
            setValue();
            close();
            if (typeof (callBack) == "function") {
                callBack();
                return;
            }
        });
    }

    //选择城市
    function selCity(cityId) {
        var cityId = typeof cityId === "string" ? cityId : $(this).attr("subid"),
                str = '<label style="margin-right:10px;" class="checkbox"><input style="width:14px;height:14px;" subid="' + cityId + '" checked type="checkbox">' + dd_jobarea[cityId] + '</label>',
                selCity = $("#" + id + "Widget li.selCity");

        //超出最大地区限制，提示错误
        if (selectedCity[id].length === maxNum && maxNum > 1) {
            var errContent = '<div style="padding:4px 10px;margin-bottom: 0px;color:#FFFFFF;background-color: #fbad40;" class="tooltip_spy alert alert-info alertSm"><i class="icon-tips-info"></i>最多只能选择' + maxNum + '个地区<a onClick="javascript:$(this).parent().remove();" class="icon-panelclose trans-50"></a></div>';
            $("#areaErr").html(errContent).show();
            return false;
        } else {
            $("#areaErr").html('');
            $("#areaErr").hide();
        }

        if (maxNum == 1) {
            delAll();
        }

        //判断当前cityid是否已经存在
        if ($.inArray(cityId, selectedCity[id]) === -1) {
            selectedCity[id].push(cityId);
            selCity.append(str);
        }

        selCity.find("input").bind("click", delCity);
        selCity.next("li").show().bind("click", delAll);
    }

    //设置提交的值，城市id
    function setValue() {
        var obj = $("#" + id),
                arr = [],
                co = "#999999",
                str;
        obj.find("input").val(selectedCity[id].join(","));
        for (var i = 0, l = selectedCity[id].length; i < l; i++) {
            arr[i] = dd_jobarea[selectedCity[id][i]];
        }
        str = arr.join("/");
        if (str == '') {
            str = prompt;
        } else {
            co = "#555555";
        }
        obj.find("span").attr("title", str).css("color", co).text($._cutStr(str, textLen)); //显示选中的城市名称
        $("#bs_area_err").hide().parent().find("> div").css("border", "1px solid #CCCCCC"); //隐藏错误提示
        //add by liukai 期望工作地
        if($('#'+id+' .areawidget_exparea').length>0){ 
            if($('#areawidget_exparea').attr('checked')){
               $('#'+id+' .areawidget_exparea').attr('value','1');
            } else{
                $('#'+id+' .areawidget_exparea').attr('value','0');
            }
        } 
        
        if (typeof setArea == "function") {
            setArea(selectedCity[id]);
        }
        //        if (typeof (sManager) != 'undefined') {
        //            if (selectedCity[id].length > 0) {
        //                sManager.moreArea(selectedCity[id]);
        //            } else {
        //                sManager.moreArea('');
        //            }
        //        }
    }

    //取消操作
    function cancle() {
        close();
    }

    //删除所有选中的城市
    function delAll() {
        selectedCity[id] = [];
        $("#" + id + "Widget li.selCity").empty().next("li").hide();
        $("#areaErr").html('');
        $("#areaErr").hide();
    }

    //删除选中的城市
    function delCity(cityId) {
        var cityId = typeof cityId === "string" ? cityId : $(this).attr("subid"),
                tag;
        tag = $.inArray(cityId, selectedCity[id]);
        if (tag !== -1) {
            selectedCity[id].splice(tag, 1);
        }
        $("#" + id + "Widget li.selCity input[subid=" + cityId + "]").parent().remove();
        if (selectedCity[id].length === 0) {
            $("#" + id + "Widget li.selCity").next("li").hide();
            //$("#" + id).find("span").text(prompt);
        }
        if (selectedCity[id].length === 0) {
            $("#areaErr").html('');
            $("#areaErr").hide();
        }
    }

    //添加城市
    function addCity(obj) {
        var classStr, j, str = "";
        for (j = 0; j < 8; j++) {
            classStr = "";
            if ($.inArray(obj.subIds[j], hotCity) !== -1) {
                classStr = 'style="font-weight:bold"';
            }
            str += !obj.subIds[j] ? '<td></td>' : '<td subid="' + obj.subIds[j] + '" ' + classStr + '>' + dd_jobarea[obj.subIds[j]] + '</td>';
        }
        return str;
    }

    //绑定省份子弹层事件
    function childCity(e) {
        var cc = $("#childCity");
        if (cc[0]) {
            cc.remove(); //删除原有子弹层
        }

        var provinceId = $(this).attr("subid"),
                obj = $('<div id="childCity" style="position:absolute;z-index:20000;overflow:hidden;width:380px;color:#000;" class="alert alert-block"></div>'),
                cityID = parseInt(provinceId, 10),
                str = "", mp, cityIdStr, checkPro, checkStr;

        //没有子弹层退出
        if ($.inArray(provinceId, noChildArea) !== -1) {
            selCity(provinceId);
            return false;
        }
        checkPro = $.inArray(provinceId, selectedCity[id]) !== -1 ? "checked" : "";
        str += '<div class="close" style="margin-right:25px;"><a class="closeChild" style="color:#000000;">x</a></div>';
        str += '<dl><dt><input style="width:14px;padding:0;margin-right:2px;border-radius: 0px;" subid="' + provinceId + '" type="checkbox" ' + checkPro + '>' + dd_jobarea[provinceId] + '</dt><dd>';
        str += '<ul class="model-sf-main">';
        for (var i = 0; i < 29; i++) {
            cityID += 100;
            cityIdStr = provinceId.substr(0, 1) == "0" ? "0" + cityID : cityID + "";
            checkStr = selectedCity[id].length == 0 ? "" : $.inArray(cityIdStr, selectedCity[id]) != -1 ? "checked" : "";
            str += !dd_jobarea[cityIdStr] ? "" : '<li><input style="width:14px;padding:0;margin-right:2px;border-radius: 0px;"' + checkStr + ' subid="' + cityIdStr + '" type="checkbox">' + dd_jobarea[cityIdStr] + '</li>';
        }
        str += '</ul></dd></dl></div>';

        mp = $._mousePos(e); //获取鼠标坐标
        if (mp.x > 980) {
            mp.x -= 400;
        }
        obj.css({
            left: mp.x,
            top: mp.y
        }).html(str).appendTo("body").find("a.closeChild").bind("click", closeChildCity);
        obj.find("input[subid]").bind("click", function () {
            if (this.checked) {
                selCity($(this).attr("subid"));
            } else {
                delCity($(this).attr("subid"));
            }
            obj.remove(); //移除子弹层
        });
    }

    //关闭弹窗事件
    function close() {
        $("#childCity").remove(); //关闭省份子弹层
        $("#" + id + "Widget").remove();
        if(id!='addspy_area'){ //企业管理绑定猎头弹出框的地区控件不需要清除遮罩
            $._removeMask(1); //清除遮罩
        }
    }

    //关闭省份子弹层
    function closeChildCity() {
        var childCity = $("#childCity");
        if (childCity) {
            childCity.delay(50).remove(); //关闭省份子弹层
        }
    }

    //鼠标移入背景变换
    function addBg() {
        $(this).addClass("hover-bg").bind("mouseout", removeBg).unbind("mouseover");
    }

    //鼠标移出变换背景
    function removeBg() {
        $(this).removeClass("hover-bg").bind("mouseover", addBg).unbind("mouseout");
    }
})(jQuery);