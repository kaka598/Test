/**
 * @description    登录相关JS
 * @author          yangyang
 * @version         1.1
 * @copyright       Copyright (c) 2014, 51job
 * @since           2014-12-22
 */

//当点击到span光标标移动到INPUT里
$(document).on("click", ".inputdiv span", function () {
    $(this).prev('input').focus();
});

//当INPUT框输入时SPAN内容隐藏
$(document).on("keydown propertychange input", ".inputdiv input", function () {
    $(this).next('span').hide();
});

//当INPUT框没值时 自动还原默认值
$(document).on("blur", ".inputdiv input", function () {
    if ($(this).val() == "")
        $(this).next('span').show();
});

//判断有无验证码
function hasVCode(errtype, errmsg) {
    $.ajax({
        type: 'POST',
        url: webServerPath + '/common/verifycode.php?act=hasVCode&type=3',
        dataType: 'json',
        success: function (data) {
            //输入次数过多，需要验证码
            if (data.status == "101") {
                var str = '<div><div style="position:relative">';
                str += '<div id="logincodent" class="point-out" style="left: 0px; top: -29px; display: none;"></div>';
                str += '<div class="popupInput inputdiv"><input class="input input-lg" maxlength="4" type="text" style=" width:122px" id="logincode"  />';
                str += '<span class="popupInputText">验证码</span>&nbsp;<img id="imgcode" width="122" height="42" class="i-yzm" title="点击刷新" src="' + webServerPath + '/common/verifycode.php?type=3&a=' + Math.random() + '" /> ';
                str += '<a id="codeclick" style="text-decoration:none;" class="i-changeyzm">换一张</a></div></div></div>';
                $("#loginLayer #codediv").html(str);
                //    $('#fadent').addClass('alert alert-error').html('<i class="icon-tips-error"></i>您最近一个小时内输入密码错误次数过多，需要输入验证码。');//添加被选中样式
                $("#logincodent").html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>请输入验证码</span>').show();
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
            $("#loginusername").html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>系统忙，请稍后再试</span>').show();
        }
    });
}

//绑定获取验证码函数
$(document).on("click", "#codeclick", function () {
    scode($("#imgcode"), 3)
});
//绑定获取验证码函数
$(document).on("focus", "#logincode", function () {
    $('#logincodent').hide()
});
//账号危险弹窗
function danger() {
    closeLoginOrRegister($('#loginLayer')); //删除登录弹窗
    $._panel({
        msg: '我们发现您的账号密码存在安全隐患,建议您修改密码!',
        btnName1: "修改密码",
        btnPath1: 'http://www.51job.com'
    });
}
//检查登录密码
function checkLoginPassword(password) {
    if (password == '') {
        $('.point-out').hide();
        $("#loginpasswordnt").html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>密码不能为空</span>').show();
        return false;
    } else if (password.length > 16) {
        $('.point-out').hide();
        $("#loginpasswordnt").html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>密码不能大于16位</span>').show();
        return false;
    }
    return true;
}
//检测登录数据
function checkLoginData() {
    var loginname = $.trim($('#usernames').val()) || $.trim($("#addrolename").text());          //获取登录用户名  
    var loginpassword = $.trim($('#passwords').val());      //获取登录密码
    var logincode = $.trim($('#logincode').val());          //获取验证码
    var checkbox = $("#loginLayer input[type=checkbox]").attr("checked") ? 1 : ''; //获取是否选中自动登录 
    var randomCode = $('#randomCode').val();                //验证码

    //判断用户名密码是否为空
    if (loginname == "") {
        $('.point-out').hide();
        $("#loginusername").html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>用户名不能为空</span>').show();
        return false;
    }
    //判断用户名密码是否为空
    if (!checkLoginPassword(loginpassword))
        return false;

    //判断是否出现验证码
    if ($('#logincode').attr('id')) {
        if (logincode == '') {
            $('.point-out').hide();
            $("#logincodent").html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>验证码不能为空</span>').show();
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

//登录
function loginSubmit(loginrole) {
    var params = checkLoginData();
    if (!params) {
        return false;
    }
    if (loginrole == '') {
        loginrole = $._trim($('body').attr("loginRole")); //指定登陆角色 modify by ziheng.guo 2015-8-26
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
                scode($("#imgcode"), 3);//刷新验证码
            }
            switch (data.status) {
                case '100':
                    loginSuccess(data);
                    return;
                case '101'://该账号已在其他地方或浏览器登录
                    loginOffline(data.pageurl);
                    break;
                case '200'://登录异常
                    if (data.errType == '28') {//账号被锁定
                        $('.point-out').hide();
                        $('#fadent').attr('id', 'fadents').addClass('alert alert-error').html('<i class="icon-tips-error"></i>您的账户已被锁定，请 <a class="txt-link repassword">找回登录密码</a> 后登录');
                    } else {
                        $('.point-out').hide();
                        $("#loginusername").html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>' + data.msg + '</span>').show();
                    }
                    break;
                case '201'://验证码错误
                    $('.point-out').hide();
                    $('#codediv').html('<div><div class="popupInput inputdiv"><div id="logincodent" class="point-out" style="left: 0px; top: -29px; "><span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>' + data.msg + '</span></div><input type="text" style=" width:122px" maxlength="4" id="logincode" class="input input-lg" /><span class="popupInputText">验证码</span>&nbsp;<img id="imgcode" width="122" height="42" class="i-yzm" title="点击刷新" src="' + webServerPath + '/common/verifycode.php?type=3&a=' + Math.random() + '"/><a id="codeclick" style="text-decoration:none;" class="i-changeyzm">换一张</a> </div></div>');
                    break;
                case '202'://用户信息泄露
                    danger();
                    break;
                case '203'://用户名密码错误
                    $('.point-out').hide();
                    $("#loginusername").html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>' + data.msg + '</span>').show();
                    //  $('#codediv').html('<div><div class="popupInput inputdiv"><div id="logincodent" class="point-out" style="left: 0px; top: -29px; "></div><input type="text" maxlength="4" id="logincode" class="input" style="height: 33px;" /><span class="popupInputText">验证码</span>&nbsp;<img id="imgcode" width="122" height="42" class="i-yzm" title="点击刷新" src="' + webServerPath + '/common/verifycode.php?type=3&a=' + Math.random() + '"/><a id="codeclick" style="text-decoration:none;" class="i-changeyzm">换一张</a> </div></div>');
                    break;
                case '204'://用户被锁定
                    $('.point-out').hide();
                    $("#loginusername").html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>' + data.msg + '</span>').show();
                    //  $('#codediv').html('<div><div class="popupInput inputdiv"><div id="logincodent" class="point-out" style="left: 0px; top: -29px; "></div><input type="text" maxlength="4" id="logincode" class="input" style="height: 33px;" /><span class="popupInputText">验证码</span>&nbsp;<img id="imgcode" width="122" height="42" class="i-yzm" title="点击刷新" src="' + webServerPath + '/common/verifycode.php?type=3&a=' + Math.random() + '"/><a id="codeclick" style="text-decoration:none;" class="i-changeyzm">换一张</a> </div></div>');
                    break;
            }
        },
        error: function () {
            $('.point-out').hide();
            $("#loginusername").html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>系统忙，请稍后再试</span>').show();
        }
    });
}
//点击忘记密码
$(document).on('click', '.repassword', function () {
    window.location.href = webServerPath + '/common/forgetpassword.php';//跳转到忘记密码页面
});
//获取验证码
function scode(obj, type) {
    obj.attr('src', webServerPath + "/common/verifycode.php?type=" + type + "&a=" + Math.random());
}
//移除登录、注册弹窗
function closeLoginOrRegister(obj) {
    $('#loginLayer').remove();
    obj.remove();
    $._removeMask();
}
//获取日期时间
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
//ajax获取随即验证码
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