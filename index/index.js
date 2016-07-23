$(function () {
    var url;
    //�˵�����չ��
    var accordion_n = 2;
    if ($('#header .user_type').length == 0) {
        var tabs_i = 2;
        $('.hovediv').bind('click switches', function () {
            var _self = $(this).parent();
            var j = $('.accordion').index(_self);
            $('.accordion,.hovediv').click(function () {
                accordion_n = -1;
            });
            if (tabs_i == j)
                return false;
            tabs_i = j;
            $('.accordion').each(function (e) {
                if (e == tabs_i) {
                    _self.children('.accordion-main').animate({width: '390'}, 300);
                    _self.siblings().children('.accordion-main').animate({width: 0}, 300);
                    //				$(this).siblings().children('.accordion-main');                                                           
                }
            });
            $('.accordion-key').each(function (e) {
                if (e == tabs_i) {
                    $(this).addClass('key-chose');
                } else {
                    $(this).removeClass('key-chose');
                }
            });

        });
    }
    //�˵���ѭ���л�           
    switches();
    function switches() {
        var k = $('.i-accordion .accordion:eq(' + accordion_n + ') .hovediv');
        if (accordion_n >= 0) {
            $(k).trigger("switches");
            accordion_n--;
            setTimeout(switches, 1000);
        }

    }
    ;
    //�˵�������ʾ
    var tabs_n = 0
    $('.i-tab-nav-a').click(function () {
        var _selfn = $(this);
        var n = $('.i-tab-nav-a').index(_selfn);
        if (tabs_n == n)
            return false;
        tabs_n = n;
        $('.i-tab-nav-a').each(function (e) {
            if (e == tabs_n) {
                $(this).addClass('chose');
            } else {
                $(this).removeClass('chose');
            }
        });

        $('.i-tab-con').each(function (e) {
            if (e == tabs_n) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });
    //ѡ�����
    $(document).on('click', '#area1', function (e) {
        Area("area1", 5, 34);
        return $._stopProp(e);
    });
    $(document).on('click', '#area2', function (e) {
        Area("area2", 5, 34);
        return $._stopProp(e);
    });
    $(document).on('click', '#area3', function (e) {
        Area("area3", 5, 34);
        return $._stopProp(e);
    });

    //ѡ����н����ҵ
    var selTimer;
    $("#highPay, #industry, #highCommission").click(function (e) {
        var id = this.id, list_k2 = $("#" + id + " > div.list_k2");
        if (list_k2.css("display") != "none") {
            list_k2.hide();
            return false;
        }
        $("div.list_k2").hide(); //��������������
        list_k2.show().find("a").bind("click", function (e) {
            var code = $(this).attr("code");
            $("#" + id + " > .speedBut3 > span").text($(this).text());
            $("#" + id + " input").val(code);
            list_k2.hide();
            return $._stopProp(e);
        });
        return $._stopProp(e);
    });
    //��������Ƴ��¼�
    $("#highPay, #industry, #highCommission").mouseleave(function (e) {
        var id = this.id;
        selTimer = setTimeout(function () {
            $("#" + id + " > div.list_k2").hide();
        }, 50);
        return $._stopProp(e);
    });

    //����������ת���
    $('.accordion-main-list [url] ').click(function () {
        url = $(this).attr('url');
        var role = $(this).attr('role');
        $.ajax({
            type: 'POST',
            url: webServerPath + '/common/login.php?act=ajaxChkLogin',
            dataType: 'json',
            beforeSend: function () {
                //Loading IMG
            },
            success: function (msg) {
                if (msg.status == 100 || msg.status == 401) {
                    if (msg.role == role) {
                        window.location.href = url;
                    } else if ($('#switchRole').attr('href')) {
                        if (confirm("�����ڵ���ݲ��ܷ��ʸ�ҳ�棬�Ƿ���Ҫ�л���ɫ��")) {
                            window.location.href = $('#switchRole').attr('href') + '&url=' + url;
                        }
                    } else if (confirm("�����ڵ���ݲ��ܷ��ʸ�ҳ�棬�Ƿ���Ҫ�л��˺ţ�")) {
                        //$.cookie('jingying', '', { expires: -1 }); // ɾ��
                        loginLayer(loginurl);

                    }
                } else if (msg.status == 400) {
                    loginLayer(loginurl);
                }
            }
        });
    });

    //���������˵��ύ      
    $(document).on('click', '#searchmanager', function () {
        $("form[name='searchmanager']").submit();
    });

    $('#searchmanager').parent().find(".i-label input").keydown(function (e) {
        var curKey = e.which;
        if (curKey == 13) {
            $("form[name='searchmanager']").submit();
        }
    });
    //������ͷ�ύ
    $(document).on('click', '#searchspy', function(){
        $("form[name='searchspy']").submit();
    });
    $('#searchspy').parent().find(".i-label input").keydown(function (e) {
        var cKey = e.which;
        if (cKey == 13) {
            $("form[name='searchspy']").submit();
        }
    });
    //����case���ύ	
    $(document).on('click', '#searchcase', function () {
        $("form[name='searchcase']").submit();
    });
    $('#searchcase').parent().find(".i-label input").keydown(function (e) {
        var cKey = e.which;
        if (cKey == 13) {
            $("form[name='searchcase']").submit();
        }
    });

    //hr��ɫ���ʱ	
    $(document).on('click', '.hrdiv', function () {
        register('hr');
    });
    //i-dynamic������a��ǩ�ĵ���¼�
    $(document).on('click', '.i-dynamic a [url]', function () {
        if ($(this).attr("nocheck") != undefined)
            return true; //������û��Ƿ��¼
        url = $(this).attr('url');
        $.ajax({
            type: 'POST',
            url: webServerPath + '/common/login.php?act=ajaxChkLogin',
            dataType: 'json',
            beforeSend: function () {
                //Loading IMG
            },
            success: function (msg) {
                if (msg.status == 100 || msg.status == 401) {
                    window.location.href = url;
                } else if (msg.status == 400) {
                    loginLayer(loginurl);
                }
            }
        });
    });
    //��¼��Ҫ��ת��URL
    function loginurl() {
        window.location.href = url;
    }

    //��ҳ����case��Ϣ��������ͷ������ʾ
    var topCase = $("#topCase"),
            topUser = $("#topUser"),
            time = 100, offset1 = -16, offset2 = -12,
            rollTimer1, rollTimer2;

    //case
    if (topCase.find("li").length > 5) {
        topCase.find("ul").clone().appendTo(topCase);
        rollTimer1 = setInterval(function () {
            roll(topCase, offset1);
        }, time);
    }
    //��ͷ
    if (topUser.find("li").length > 3) {
        topUser.find("ul").clone().appendTo(topUser);
        rollTimer2 = setInterval(function () {
            roll(topUser, offset2);
        }, time);
    }

    //��������
    function roll(obj, h) {
        var UL = obj.find("ul"),
                firstUL = UL.eq(0),
                secondUl = UL.eq(1),
                str = firstUL.css("marginTop"),
                marginTop = parseInt(str.substr(1, str.length - 2)) || 0,
                mTop = firstUL.height() + 15;
        if (marginTop < mTop) {
            marginTop++;
            firstUL.css("marginTop", "-" + marginTop + "px");
        } else {
            secondUl.css("marginTop", h + "px");
            obj.append(firstUL.clone().css("marginTop", "0px"));
            firstUL.remove();
        }
    }

    //���������ͣ�������Ƴ���������
    topCase.hover(
            function () {
                clearInterval(rollTimer1);
            },
            function () {
                if (topCase.find("li").length > 5) {
                    rollTimer1 = setInterval(function () {
                        roll(topCase, offset1);
                    }, time);
                }
            }
    );
    topUser.hover(
            function () {
                clearInterval(rollTimer2);
            },
            function () {
                if (topUser.find("li").length > 3) {
                    rollTimer2 = setInterval(function () {
                        roll(topUser, offset2);
                    }, time);
                }
            }
    );
});

//����ҳ��ת�ж�
function spyinfourl(e) {
    url = $(e).attr('url');

    $.ajax({
        type: 'POST',
        url: webServerPath + '/common/login.php?act=ajaxChkLogin',
        dataType: 'json',
        beforeSend: function () {
            //Loading IMG
        },
        success: function (msg) {
            if (msg.status == 100 || msg.status == 401) {
                window.location.href = url;
            } else if (msg.status == 400) {
                loginLayer(loginurl);
            }
        }
    });
}
// $(".accordion-main-list a").addClass("ie6Hover");

$(".accordion-main-list a").hover(function () {
    $(this).addClass("ie6Hover");
}, function () {
    $(this).removeClass("ie6Hover");
});

/**
 * ���ȫ�������򣬱䶯�ؼ�����ʾ�İ�
 */
$("input[name=alltext]").click(function () {
    if (this.checked) {
        $('#fullTextName').html('ȫ�Ĺؼ���');
        this.value = 1;
    } else {
        $('#fullTextName').html('Case����/ID');
        this.value = 0;
    }
});