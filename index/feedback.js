/**
 * @description    意见反馈JS
 * @author          yangyang
 * @version         1.1
 * @copyright       Copyright (c) 2014, 51job
 * @since           2014-05-14
 */
(function ($) {
    $._removeMask();                //移除遮罩
    $('#loginLayer').remove();      //删除登录弹窗
    $('#register').remove();        //删除注册弹窗
    $('#rolent').remove();          //删除已被注册时提示弹窗
    var content = '<div class="f-top" style="z-index:9999"><img src="/images/top.png"/><span>返回<br/>顶部</span></div>';
    content += '<div id="feedBack" class="suggestBox" style="z-index:9999"><a class="suggest_link" ></a></div>';
    var contentTop = '<div class="f-top"><img src="/images/top.png"/><span>返回<br/>顶部</span></div>';

    $(window).scroll(function () {
        var h2 = $(document).scrollTop();
        if (0 < h2) {
            $('.f-top').fadeIn(300);
        } else {
            $('.f-top').fadeOut(300);
        }
    });
    $(document).on('click', '.f-top', function () {
        $('body,html').animate({'scrollTop': 0}, 300);
    });
    $(document).on('mouseover', '.f-top', function () {
        $(".f-top span").css({
            'top': '0',
            'backgroundColor': '#f89406'
        });
    });
    $(document).on('mouseout', '.f-top', function () {
        $(".f-top span").css({
            'top': '-33px',
            'backgroundColor': '#f89406'
        });
    });

    //该ajax用户判断是否已登录
    if ($('#noFeedBack').length == 0) {
        if ($('#header .user_type').attr('user_type')) {
            $(content).appendTo('body');
        } else {
            $(contentTop).appendTo('body');
        }
    }

    //底部意见反馈点击
    $(document).on('click', '#footerFeedBack', function () {
        $._removeMask();//去除遮罩
        if ($('#userpwd').val() == undefined) {
            $('#feedBacks').remove();
            feedBacks();
        } else {
            $('#loginLayer').remove();      //删除登录弹窗
            loginLayer();//弹出登录
        }
    });

    //打开意见反馈弹窗    
    $(document).on('click', '#feedBack', function () {
        $._removeMask();//去除遮罩
        $('#feedBacks').remove();
        feedBacks();


    });
    //关闭意见反馈弹窗
    $(document).on('click', '#feedBacks .trans-50,#removefb', function () {
        $._removeMask();//去除遮罩
        $('#feedBacks').remove();
    });
    //提交意见反馈
    $(document).on('click', '#feedBacksm', function () {
        var textareaval = $._trim($('#textarea').val());
        var Contact = $._trim($('#inputEmail').val());
        if (textareaval == '') {
            $('#textareanl').show().html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>内容不能为空</span>')
            return false;
        }
        if ($._strLen(textareaval) > 1000) {
            $('#textareanl').show().html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>内容不能超过500字</span>')
            return false;
        }
        $.ajax({
            type: 'POST',
            url: webServerPath + '/common/feedback.php?act=feedBack',
            async: false,
            dataType: 'json',
            data: {
                content: textareaval,
                contentinfo: Contact
            },
            beforeSend: function () {
            },
            success: function (msg) {
                var result = msg.status;
                switch (result) {
                    case '100':
                        $._removeMask();//去除遮罩
                        $('#feedBacks').remove();
                        $._prompt('提交成功');
                        break;
                    case '200':
                    default:
                        $('#textareanl').show().html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>' + msg.msg + '</span>');

                        break;
                }
            }
        });

    });
    //鼠标放上错误信息隐藏
    $(document).on('focus', '#textarea', function () {
        $("#textareanl").hide();
    });
    $(document).on('focus', '#inputEmail', function () {
        $("#Contactnl").hide();
    });
    function feedBacks() {
        var content = ' <div id="feedBacks" class="panel operate" style="z-index:10002;">';
        content += '<div  class="panel-head"><h2>意见反馈</h2><a class="icon-panelclose trans-50"></a></div>';
        content += '<div class="panel-content"><div class="panel-body"><div class="form form-small">';
        content += '<ul><li>请填写反馈内容</li><li><div class="popupInput inputdiv"><div id="textareanl" class="point-out" style="top:-38px; left:0px; display: none;"></div><textarea maxlength="1000" id="textarea" name="textarea" rows="3" class="input" placeholder="你的每一个意见对我们都很重要"  style="width:356px; _width:354px;resize:none" ></textarea></div></li><li style="color:#ccc">感谢你的反馈，稍后无忧精英网团队会通过私信联系您。</li>';
        content += '</ul></div></div></div><div class="panel-bottom"><a class="btn btn-warning" id="feedBacksm">确定</a>&nbsp;<a class="btn" id="removefb">取消</a></div></div>';
        $(content).appendTo('body');
        $('#feedBacks')._alignCenter()._dragHandle($('#feedBacks .panel-head'));
    }
})(jQuery);