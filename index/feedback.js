/**
 * @description    �������JS
 * @author          yangyang
 * @version         1.1
 * @copyright       Copyright (c) 2014, 51job
 * @since           2014-05-14
 */
(function ($) {
    $._removeMask();                //�Ƴ�����
    $('#loginLayer').remove();      //ɾ����¼����
    $('#register').remove();        //ɾ��ע�ᵯ��
    $('#rolent').remove();          //ɾ���ѱ�ע��ʱ��ʾ����
    var content = '<div class="f-top" style="z-index:9999"><img src="/images/top.png"/><span>����<br/>����</span></div>';
    content += '<div id="feedBack" class="suggestBox" style="z-index:9999"><a class="suggest_link" ></a></div>';
    var contentTop = '<div class="f-top"><img src="/images/top.png"/><span>����<br/>����</span></div>';

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

    //��ajax�û��ж��Ƿ��ѵ�¼
    if ($('#noFeedBack').length == 0) {
        if ($('#header .user_type').attr('user_type')) {
            $(content).appendTo('body');
        } else {
            $(contentTop).appendTo('body');
        }
    }

    //�ײ�����������
    $(document).on('click', '#footerFeedBack', function () {
        $._removeMask();//ȥ������
        if ($('#userpwd').val() == undefined) {
            $('#feedBacks').remove();
            feedBacks();
        } else {
            $('#loginLayer').remove();      //ɾ����¼����
            loginLayer();//������¼
        }
    });

    //�������������    
    $(document).on('click', '#feedBack', function () {
        $._removeMask();//ȥ������
        $('#feedBacks').remove();
        feedBacks();


    });
    //�ر������������
    $(document).on('click', '#feedBacks .trans-50,#removefb', function () {
        $._removeMask();//ȥ������
        $('#feedBacks').remove();
    });
    //�ύ�������
    $(document).on('click', '#feedBacksm', function () {
        var textareaval = $._trim($('#textarea').val());
        var Contact = $._trim($('#inputEmail').val());
        if (textareaval == '') {
            $('#textareanl').show().html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>���ݲ���Ϊ��</span>')
            return false;
        }
        if ($._strLen(textareaval) > 1000) {
            $('#textareanl').show().html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>���ݲ��ܳ���500��</span>')
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
                        $._removeMask();//ȥ������
                        $('#feedBacks').remove();
                        $._prompt('�ύ�ɹ�');
                        break;
                    case '200':
                    default:
                        $('#textareanl').show().html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>' + msg.msg + '</span>');

                        break;
                }
            }
        });

    });
    //�����ϴ�����Ϣ����
    $(document).on('focus', '#textarea', function () {
        $("#textareanl").hide();
    });
    $(document).on('focus', '#inputEmail', function () {
        $("#Contactnl").hide();
    });
    function feedBacks() {
        var content = ' <div id="feedBacks" class="panel operate" style="z-index:10002;">';
        content += '<div  class="panel-head"><h2>�������</h2><a class="icon-panelclose trans-50"></a></div>';
        content += '<div class="panel-content"><div class="panel-body"><div class="form form-small">';
        content += '<ul><li>����д��������</li><li><div class="popupInput inputdiv"><div id="textareanl" class="point-out" style="top:-38px; left:0px; display: none;"></div><textarea maxlength="1000" id="textarea" name="textarea" rows="3" class="input" placeholder="���ÿһ����������Ƕ�����Ҫ"  style="width:356px; _width:354px;resize:none" ></textarea></div></li><li style="color:#ccc">��л��ķ������Ժ����Ǿ�Ӣ���Ŷӻ�ͨ��˽����ϵ����</li>';
        content += '</ul></div></div></div><div class="panel-bottom"><a class="btn btn-warning" id="feedBacksm">ȷ��</a>&nbsp;<a class="btn" id="removefb">ȡ��</a></div></div>';
        $(content).appendTo('body');
        $('#feedBacks')._alignCenter()._dragHandle($('#feedBacks .panel-head'));
    }
})(jQuery);