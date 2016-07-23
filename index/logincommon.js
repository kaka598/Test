/**
 * @description    ��¼���JS
 * @author          yangyang
 * @version         1.1
 * @copyright       Copyright (c) 2014, 51job
 * @since           2014-12-22
 */

//�������span�����ƶ���INPUT��
$(document).on("click", ".inputdiv span", function () {
    $(this).prev('input').focus();
});

//��INPUT������ʱSPAN��������
$(document).on("keydown propertychange input", ".inputdiv input", function () {
    $(this).next('span').hide();
});

//��INPUT��ûֵʱ �Զ���ԭĬ��ֵ
$(document).on("blur", ".inputdiv input", function () {
    if ($(this).val() == "")
        $(this).next('span').show();
});

//�ж�������֤��
function hasVCode(errtype, errmsg) {
    $.ajax({
        type: 'POST',
        url: webServerPath + '/common/verifycode.php?act=hasVCode&type=3',
        dataType: 'json',
        success: function (data) {
            //����������࣬��Ҫ��֤��
            if (data.status == "101") {
                var str = '<div><div style="position:relative">';
                str += '<div id="logincodent" class="point-out" style="left: 0px; top: -29px; display: none;"></div>';
                str += '<div class="popupInput inputdiv"><input class="input input-lg" maxlength="4" type="text" style=" width:122px" id="logincode"  />';
                str += '<span class="popupInputText">��֤��</span>&nbsp;<img id="imgcode" width="122" height="42" class="i-yzm" title="���ˢ��" src="' + webServerPath + '/common/verifycode.php?type=3&a=' + Math.random() + '" /> ';
                str += '<a id="codeclick" style="text-decoration:none;" class="i-changeyzm">��һ��</a></div></div></div>';
                $("#loginLayer #codediv").html(str);
                //    $('#fadent').addClass('alert alert-error').html('<i class="icon-tips-error"></i>�����һ��Сʱ�������������������࣬��Ҫ������֤�롣');//��ӱ�ѡ����ʽ
                $("#logincodent").html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>��������֤��</span>').show();
            }
            if (errtype == "-2") {
                $("#loginpasswordnt").html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>' + errmsg + '</span>').show();
            } else if (errtype == "3") {
                $("#logincodent").html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>' + errmsg + '</span>').show();
            } else if (errtype != null) {
                $("#loginusername").html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>' + errmsg + '</span>').show();
            }
        }, error: function () {
            $('.point-out').hide();
            $("#loginusername").html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>ϵͳæ�����Ժ�����</span>').show();
        }
    });
}

//�󶨻�ȡ��֤�뺯��
$(document).on("click", "#codeclick", function () {
    scode($("#imgcode"), 3)
});
//�󶨻�ȡ��֤�뺯��
$(document).on("focus", "#logincode", function () {
    $('#logincodent').hide()
});
//�˺�Σ�յ���
function danger() {
    closeLoginOrRegister($('#loginLayer')); //ɾ����¼����
    $._panel({
        msg: '���Ƿ��������˺�������ڰ�ȫ����,�������޸�����!',
        btnName1: "�޸�����",
        btnPath1: 'http://www.51job.com'
    });
}
//����¼����
function checkLoginPassword(password) {
    if (password == '') {
        $('.point-out').hide();
        $("#loginpasswordnt").html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>���벻��Ϊ��</span>').show();
        return false;
    } else if (password.length > 16) {
        $('.point-out').hide();
        $("#loginpasswordnt").html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>���벻�ܴ���16λ</span>').show();
        return false;
    }
    return true;
}
//����¼����
function checkLoginData() {
    var loginname = $.trim($('#usernames').val()) || $.trim($("#addrolename").text());          //��ȡ��¼�û���  
    var loginpassword = $.trim($('#passwords').val());      //��ȡ��¼����
    var logincode = $.trim($('#logincode').val());          //��ȡ��֤��
    var checkbox = $("#loginLayer input[type=checkbox]").attr("checked") ? 1 : ''; //��ȡ�Ƿ�ѡ���Զ���¼ 
    var randomCode = $('#randomCode').val();                //��֤��

    //�ж��û��������Ƿ�Ϊ��
    if (loginname == "") {
        $('.point-out').hide();
        $("#loginusername").html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>�û�������Ϊ��</span>').show();
        return false;
    }
    //�ж��û��������Ƿ�Ϊ��
    if (!checkLoginPassword(loginpassword))
        return false;

    //�ж��Ƿ������֤��
    if ($('#logincode').attr('id')) {
        if (logincode == '') {
            $('.point-out').hide();
            $("#logincodent").html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>��֤�벻��Ϊ��</span>').show();
            return false;
        }
    }
    if (getToDay() != $('#randomCode').attr('tody') && randomCode != '') {
        randomCode = ajaxRandomCode();
    }
    return {
        username: loginname,
        userpwd: loginpassword,
        vcode: logincode,
        islayer: 1,
        checked: checkbox,
        randomcode: randomCode
    };
}

//��¼
function loginSubmit(loginrole) {
    var params = checkLoginData();
    if (!params) {
        return false;
    }
    if (loginrole == '') {
        loginrole = $._trim($('body').attr("loginRole")); //ָ����½��ɫ modify by ziheng.guo 2015-8-26
    }
    params.role = loginrole;
    params.pageurl = getValidUrl();
    $(".loginBtn").attr("class", "btn disabled btn-lg loginBtns2");

    $.ajax({type: 'POST', dataType: 'json', timeout: 3000, url: webServerPath + '/common/login.php?act=ajaxlogin',
        data: params,
        success: function (data) {
            $(".loginBtns2").attr("class", "btn btn-primary btn-lg loginBtn");
            if (data.status != '100' && data.status != '201' && $.trim($('#codeclick').html()) != "") {
                $("#logincode").val('');
                scode($("#imgcode"), 3);//ˢ����֤��
            }
            switch (data.status) {
                case '100':
                    loginSuccess(data);
                    return;
                case '101'://���˺����������ط����������¼
                    loginOffline(data.pageurl);
                    break;
                case '200'://��¼�쳣
                    if (data.errType == '28') {//�˺ű�����
                        $('.point-out').hide();
                        $('#fadent').attr('id', 'fadents').addClass('alert alert-error').html('<i class="icon-tips-error"></i>�����˻��ѱ��������� <a class="txt-link repassword">�һص�¼����</a> ���¼');
                    } else {
                        $('.point-out').hide();
                        $("#loginusername").html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>' + data.msg + '</span>').show();
                    }
                    break;
                case '201'://��֤�����
                    $('.point-out').hide();
                    $('#codediv').html('<div><div class="popupInput inputdiv"><div id="logincodent" class="point-out" style="left: 0px; top: -29px; "><span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>' + data.msg + '</span></div><input type="text" style=" width:122px" maxlength="4" id="logincode" class="input input-lg" /><span class="popupInputText">��֤��</span>&nbsp;<img id="imgcode" width="122" height="42" class="i-yzm" title="���ˢ��" src="' + webServerPath + '/common/verifycode.php?type=3&a=' + Math.random() + '"/><a id="codeclick" style="text-decoration:none;" class="i-changeyzm">��һ��</a> </div></div>');
                    break;
                case '202'://�û���Ϣй¶
                    danger();
                    break;
                case '203'://�û����������
                    $('.point-out').hide();
                    $("#loginusername").html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>' + data.msg + '</span>').show();
                    //  $('#codediv').html('<div><div class="popupInput inputdiv"><div id="logincodent" class="point-out" style="left: 0px; top: -29px; "></div><input type="text" maxlength="4" id="logincode" class="input" style="height: 33px;" /><span class="popupInputText">��֤��</span>&nbsp;<img id="imgcode" width="122" height="42" class="i-yzm" title="���ˢ��" src="' + webServerPath + '/common/verifycode.php?type=3&a=' + Math.random() + '"/><a id="codeclick" style="text-decoration:none;" class="i-changeyzm">��һ��</a> </div></div>');
                    break;
                case '204'://�û�������
                    $('.point-out').hide();
                    $("#loginusername").html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>' + data.msg + '</span>').show();
                    //  $('#codediv').html('<div><div class="popupInput inputdiv"><div id="logincodent" class="point-out" style="left: 0px; top: -29px; "></div><input type="text" maxlength="4" id="logincode" class="input" style="height: 33px;" /><span class="popupInputText">��֤��</span>&nbsp;<img id="imgcode" width="122" height="42" class="i-yzm" title="���ˢ��" src="' + webServerPath + '/common/verifycode.php?type=3&a=' + Math.random() + '"/><a id="codeclick" style="text-decoration:none;" class="i-changeyzm">��һ��</a> </div></div>');
                    break;
            }
        },
        error: function () {
            $('.point-out').hide();
            $("#loginusername").html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>ϵͳæ�����Ժ�����</span>').show();
        }
    });
}
//�����������
$(document).on('click', '.repassword', function () {
    window.location.href = webServerPath + '/common/forgetpassword.php';//��ת����������ҳ��
});
//��ȡ��֤��
function scode(obj, type) {
    obj.attr('src', webServerPath + "/common/verifycode.php?type=" + type + "&a=" + Math.random());
}
//�Ƴ���¼��ע�ᵯ��
function closeLoginOrRegister(obj) {
    $('#loginLayer').remove();
    obj.remove();
    $._removeMask();
}
//��ȡ����ʱ��
function getToDay() {
    var newdate;
    var now = new Date();
    var nowYear = now.getFullYear();
    var nowMonth = now.getMonth() + 1;
    var nowDate = now.getDate();
    if (nowMonth < 10) {
        nowMonth = '0' + nowMonth;
    }
    if (nowDate < 10) {
        nowDate = '0' + nowDate;
    }

    return nowYear + "-" + nowMonth + "-" + nowDate;
}
//ajax��ȡ�漴��֤��
function ajaxRandomCode() {
    var code;
    $.ajax({
        type: 'POST',
        async: false,
        url: webServerPath + '/common/login.php?act=getRandomCode',
        dataType: 'json',
        success: function (data) {
            code = data.msg;
        }
    });
    return code;
}