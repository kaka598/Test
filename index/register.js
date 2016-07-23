/**
 *
 *  Base64 encode / decode
 *  http://www.webtoolkit.info/
 *
 **/
var Base64 = {
// private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
// public method for encoding
    encode: function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                    this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                    this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },
// public method for decoding
    decode: function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },
// private method for UTF-8 encoding
    _utf8_encode: function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },
// private method for UTF-8 decoding
    _utf8_decode: function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }
        return string;
    }
}
/**
 * @description    注册页面及注册弹窗JS
 * @author          yangyang
 * @version         1.1
 * @copyright       Copyright (c) 2014, 51job
 * @since           2014-05-14
 */
$(function () {
    var hrefName = location.pathname; //url地址

    //=================================注册相关==================================
    var emailChecked = 2;      //检查是否已有相同的邮箱存在，0-已验证，不通过 1-已验证，通过 2-未验证
    var phoneChecked = 2;      //检查是否已有相同的手机存在，0-已验证，不通过 1-已验证，通过 2-未验证
    var usernameChecked = 2;   //检查是否已有相同的用户名存在，0-已验证，不通过 1-已验证，通过 2-未验证
    var usertype = "manager"; //当前用户类型spy|manager
    var checkArr = ['email', "username", "mobilephone"];    //需要查看的有无重复的三种类型
    var registerType = 'email';//注册类型，默认邮箱注册
    var role = "";
    var rolename = "";

    var registermail = "";
    var registercardid = 0;
    var registerinviteid = 0;
    var registercheckcode = "";
    var registertoken = "";
    var registerinviteuserid = 0;

    //头部导航绑定注册事件
    $(document).on("click", "#emailRegister2", function () {
        register(usertype);
    });

    //注册弹窗
    window.register = function (userType) {
        emailChecked = phoneChecked = usernameChecked = 2;//清除注册的验证状态
        closeLoginOrRegister($('#loginLayer')); //移除登录弹窗
        var registerObj = $('<div id="register" style="z-index:10000;width:690px;" class="i-model-login"></div>');
        var str = '<div id="registerBody" style="display:none" class="inner"><div class="i-login-main"><h4>无忧精英</h4><a class="w_close w_close_ie closeBtn" ></a>';
        str += '<div id="alert-error"  style="display: none;" ></div> <div class="inner z-index-ie" style="width: 410px;"><div class="i-login-con"><div class="login-con-dt" style="width: 400px;position:relative; z-index:1;">';
        str += '<a usertype="spy" class="login-con-dt-a">猎头注册</a><a usertype="manager" class="login-con-dt-a chose">精英注册</a><a usertype="hr" id="hradd" class="login-con-dt-a no-line">HR注册</a>';
        str += '</div><div id="register-by"  class="register-by">没有邮箱？试试用<a style="text-decoration:underline;" id="phoneRegister" >手机注册</a></div>';
        str += '<div style="display:none;text-align:center;height:330px;padding-top:30px;" id="hrimgshow" ><img width="328" height="306" src="' + imgBasePath + '/images/hr.jpg"></div>';
        str += '<div id="hrimghide" class="inner" >' + (getEmailRegisterStr()) + '</div></div></div></div></div>';

        //注册弹框展示前新增引导层
        var strNav = '<div id="registerHead" class="i-register-choice">';
        strNav += '<div class="i-register-main"><a class="w_close w_close_ie closeBtn"></a>';
        strNav += '<div class="i-register-qk i-register-jy-hover registerRole" otype="spy">';
        strNav += '<div class="i-register-pic"><img width="114" height="114" src="' + imgBasePath + '/images/circle-pic114-lt.png"><i class="icon46-choise"></i><h2>猎头</h2></div>';
        strNav += '<div class="i-register-list">';
        strNav += '<ul>';
        strNav += '<li>多级认证的专业猎头顾问</li>';
        strNav += '<li>搜索、联系、下载千万精英人才</li>';
        strNav += '<li>发布Case和人脉管理</li>';
        strNav += '<li>拍名片邀请等多渠道赚取积分</li>';
        strNav += '</ul>';
        strNav += '</div>';
        strNav += '<div class="i-register-btn"><a class="btn btn-primary btn-lg registerRole" otype="spy">我要成为猎头</a></div>';
        strNav += '</div>';

        strNav += '<div class="i-register-qk registerRole" otype="manager">';
        strNav += '<div class="i-register-pic"><img width="114" height="114" src="' + imgBasePath + '/images/circle-pic114-jy.png"><i class="icon46-choise"></i><h2>精英</h2>';
        strNav += '</div>';
        strNav += '<div class="i-register-list">';
        strNav += '<ul>';
        strNav += '<li>支持51job账户注册</li>';
        strNav += '<li>灵活的Profile补充简历信息</li>';
        strNav += '<li>线上优质猎头顾问为您服务</li>';
        strNav += '<li>坐等工作来找您</li>';
        strNav += '</ul>';
        strNav += '</div>';
        strNav += '<div class="i-register-btn"><a class="btn btn-primary btn-lg registerRole" otype="manager">我要成为精英</a></div>';
        strNav += '</div>';
        strNav += '</div>';
        strNav += '</div>';

        str += strNav;
        registerObj.html(str).appendTo('body')._alignCenter();
        //用户选中事件
        $(document).on("click", "#registerHead .registerRole", function () {
            $("#registerHead").hide();
            $("#registerBody").show();
            $("#register").css("width", "450")._alignCenter();
            $("#registerBody [usertype='" + $(this).attr("otype") + "']").trigger("click");
        });
        //关闭注册弹窗
        registerObj.find("a.closeBtn").bind("click", function () {
            closeLoginOrRegister(registerObj);
        });
        if (userType) {
            $('#register [usertype=' + userType + ']').addClass('chose').siblings().removeClass("chose");
            if (userType == "hr") {
                $("#hradd").trigger("click");
            }
        }
    };

    //注册页面register.php
    $(document).on("click", "a.login-con-dt-a", changeRole); //切换到角色

    //切换注册人，检查项重置
    function changeRole() {
        $(this).addClass("chose").siblings().removeClass("chose");
        usertype = $(this).attr("usertype");
        emailChecked = 2;
        phoneChecked = 2;
        usernameChecked = 2;
        usertype != "spy" ? $("#showManager").hide() : $("#showManager").show();
        if (usertype == "hr") {
            hrefName == "/common/register.php" && $('.login_main').attr('class', 'login_main login_main_bg3');
            $("#hrimghide, #register-by, #alert-error").hide();
            $("#hrimgshow").show();
        } else {

            if (hrefName == "/common/register.php") {
                var login_main_bg = usertype == "manager" ? "login_main_bg2" : "login_main_bg1"
                $('.login_main').attr('class', 'login_main ' + login_main_bg);
            }
            $("#register .point-out, #alert-error, #hrimgshow").hide();
            $("#hrimghide, #register-by").show();
        }

    }
    //判断是否需要弹出注册或者登录
    if ($('#userpwd ').val() == '') {
        var dialogtype = $._urlParams('dialogtype');
        if (dialogtype == 1 && hrefName != "/common/register.php") {
            register('manager');
        } else if (dialogtype == 2 && hrefName != "/common/register.php") {
            register('spy');
        }
    }
    //绑定切换到登录事件
    $(document).on("click", "#login", loginLayer);
    $(document).on("click", "#directlyLogin", function () {
        if (hrefName == "/common/register.php") {
            window.location.href = webServerPath + "/common/login.php?role=" + role + '&loginname=' + rolename;
        } else {
            loginLayer(null, role, rolename);
        }
    });
    //绑定获取验证码事件
    $(document).on("click", "#phonecodeclik", function () {
        scode($("#phoneimgcode"), 2);
    });
    //绑定切换手机注册事件
    $(document).on("click", "#phoneRegister", phoneRegisterCon);
    //绑定邮箱注册事件
    $(document).on("click", "#email_submit", registerUser);
    //绑定手机注册事件
    $(document).on("click", "#addphonelogin", registerUser);
    //验证码获取焦点事件
    $(document).on("focus", "#addcode", function () {
        $("#addcodent").hide();
    });
    //用户协议勾选事件
    $(document).on("click", "#addcheck", function () {
        checkd($(this));
    });
    //邮箱光标锁定，有输入新的邮箱
    $(document).on('change, keyup', '#email', function () {
        $('#alert-error, #emailNotice').hide();
        emailChecked = 2;//输入新内容重新检验
    });
    //邮箱光标移出后验证邮箱
    $(document).on("blur", "#email", function () {
        var value = $(this).val();
        if (value != "") {
            var bol = verifyEmail(value, usertype);
            if (!bol && usernameChecked == 0) {
                $("#loginnameNotice").hide();
            }
        }
    });
    //有输入新的手机
    $(document).on('change, keyup', '#phone ', function () {
        $("#phoneNotice").hide();
        phoneChecked = 2; //输入新内容重新检验
    });
    //手机光标移出，检查手机是否有注册过
    $(document).on('blur', '#phone', function () {
        var value = $(this).val();
        (value != "") && verifyPhone(value, usertype); //不为空验证手机
    });
    //用户名光标锁定，有输入新的用户名
    $(document).on('change, keyup', '#loginname ', function () {
        $("#loginnameNotice").hide();
        usernameChecked = 2; //输入新内容重新检验
    });
    //有输入新的手机验证码
    $(document).on('change, keyup', '#phonecode ', function () {
        $("#phonecodeNotice").hide()
    });
    //用户名光标移出后验用户名
    $(document).on("blur", "#loginname", function () {
        //邮箱未验证
        if (emailChecked == 2 && !verifyEmail($("#email").val(), usertype)) {
            $("#loginnameNotice").hide(); //隐藏用户名错误提示
            return false;
        }
        if (emailChecked == 0)
            return false; //邮箱验证不通过返回
        var value = $(this).val();
        (value != "") && verifyUsername(value, usertype); //不为空验证邮箱
    });
    //密码光标锁定
    $(document).on('focus', '#passwordadd, #checkpassword', function () {
        $("#" + (this.id == "checkpassword" ? "checkpasswordNotice" : "passwordNotice")).hide();
    });
    //绑定新添角色
    $(document).on("click", "#addrole", function () {
        if (hrefName == "/common/register.php") {
            window.location.href = webServerPath + "/common/login.php?role=" + role + '&rolename=' + rolename;
        } else {
            loginrole(role, rolename);
        }
    });

    //用户协议是否同意验证    
    function checkd(obj) {
        if (!obj.attr("checked")) {
            $("#addcheckNotice").html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>请勾选此项</span>').show();
        } else {
            $("#addcheckNotice").hide();
        }
    }

    //验证邮箱
    function verifyEmail(value, usertype) {
        if (emailChecked == 1)
            return true;
        if (emailChecked == 0)
            return false;
        var errMsg = "";
        errMsg = cgeckEmail(value);
        if (errMsg != 100) {
            $(".point-out").hide();
            $("#emailNotice").html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>' + errMsg + '</span>').show();
            return false;
        }
        var bol = checkExist('email', value, usertype);
        emailChecked = !bol ? 0 : 1;
        return bol;
    }

    //验证用户名
    function verifyUsername(value, usertype) {
        if (usernameChecked == 1)
            return true;
        if (usernameChecked == 0)
            return false;
        var errMsg = checkUsername(value);
        if (errMsg != 100) {
            $('.point-out').hide();
            $("#loginnameNotice").html('<span class="point-box errorbgTop dropdown"  ><i class="sprite icon_arrow_up2 pa"></i>' + errMsg + '</span>').show();
            return false;
        }

        var bol = checkExist("username", value, usertype);
        usernameChecked = !bol ? 0 : 1;
        return bol;
    }
    //验证手机号
    function verifyPhone(value, usertype) {
        if (phoneChecked == 1)
            return true;
        if (phoneChecked == 0)
            return false;
        var errMsg = checkPhone(value);
        if (errMsg != 100) {
            $('.point-out').hide();
            $("#phoneNotice").html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>' + errMsg + '</span>').show();
            return false;
        }
        var bol = checkExist("mobilephone", value, usertype);
        phoneChecked = !bol ? 0 : 1;
        return bol;

    }

    //发送手机验证码
    function sendPhoneCode() {
        var mobilephone = $("#phone").val();
        if (!verifyPhone(mobilephone, usertype)) {
            return false;
        }
        $.ajax({
            type: "POST",
            async: false,
            dataType: 'json',
            url: webServerPath + "/common/register.php?act=sendPhoneCode",
            data: {
                mobilephone: mobilephone,
                type: 5
            },
            success: function (msg) {
                switch (msg.status) {
                    case '100':
                        getVerifyCode('phone', $("#phonecodes"), sendPhoneCode);
                        $("#phoneNotice").hide(); //隐藏提示错误
                        $("#phonecodes").unbind("click");
                        isinerval = setInterval(function () {
                            getVerifyCode('phone', $("#phonecodes"), sendPhoneCode)
                        }, 1000);
                        break;
                    case '200':
                        $('.point-out').hide();
                        $('#phoneNotice').html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>' + msg.msg + '</span>').show();
                }
            }
        });
    }

    //验证手机获取到的验证码  register
    function phonecodecheck(value) {
        if (hrefName != "/common/register.php") {
            //未获取验证码
            if (!$("#phonecodes").hasClass("disabled")) {
                $('.point-out').hide();
                $("#phonecodeNotice").html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>验证码错误</span>').show();
                return false;
            }
        }

        var msg = checkPhonecode(value);
        if (msg != 100) {
            $('.point-out').hide();
            $("#phonecodeNotice").html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>' + msg + '</span>').show();
            return false;
        }
        $("#phonecodeNotice").hide();
        return true;

    }

    //注册用户，邮箱注册、手机注册
    function registerUser() {
        if (registerType == 'email') {
            var email = $("#email").val();
            var username = $("#loginname").val();

            //邮箱，用户名不符合返回
            if (emailChecked != 1 && !verifyEmail(email, usertype))
                return false;
            if (usernameChecked != 1 && !verifyUsername(username, usertype)) {
                $("#loginnameNotice").show(); //显示错误提示
                return false;
            }
        } else {
            var phone = $("#phone").val();
            var phonecode = $('#phonecode').val();

            //手机、手机验证码不符合返回
            if (phoneChecked != 1 && !verifyPhone(phone, usertype))
                return false;
            if (!phonecodecheck(phonecode))
                return false;
        }

        var password = $("#passwordadd").val();
        var checkpassword = $("#checkpassword").val();
        var addcode = $.trim($('#addcode').val()); //验证码
        var addcheck = $("#addcheck").attr("checked") ? 1 : 0;

        //检查密码
        if (!checkPassword(password))
            return false;
        //检查两次输入的密码是否一致
        if (!chkTwicePassword(password, checkpassword))
            return false;
        //检查验证码
        if (registerType == 'email') {
            if (!checkCodes(addcode))
                return false;
        }
        //协议勾选
        if (!addcheck) {
            checkd($('#addcode'));
            return false;
        }

        var url_token = "";
        var url_cardid = "";
        var url_inviteid = "";
        var url_checkcode = "";
        var url_spyid = '';
        var randomCode = $("#randomCode");
        if (randomCode[0] && registertoken != "" && registertoken != undefined) {
            url_token = registertoken;
            url_cardid = registercardid;
            url_checkcode = registercheckcode;
            url_inviteid = registerinviteid;

        }
        if (randomCode[0] && registerinviteuserid != undefined && registerinviteuserid !== 0 && registerinviteuserid !== '') {
            url_spyid = registerinviteuserid;
        }

        //提交的参数
        var paramsVal = {
            usertype: usertype,
            password: password,
            checkpassword: checkpassword,
            addcheck: addcheck,
            vcode: addcode,
            url_token: url_token,
            url_cardid: url_cardid,
            url_inviteid: url_inviteid,
            url_checkcode: url_checkcode,
            url_spyid: url_spyid
        };
        if (registerType == 'email') {
            paramsVal.email = email;
            paramsVal.loginname = username;
        } else {
            paramsVal.phone = phone;
            paramsVal.phonecode = phonecode;
        }
        $.ajax({
            type: 'POST',
            url: webServerPath + '/common/register.php?act=register',
            dataType: 'json',
            data: paramsVal,
            timeout: 10000,
            error: function () {
                location.reload();
            },
            success: function (msg) {
                switch (msg.status) {
                    case '100':
                        //统计注册量 modify by liufei 2015-10-9
                        var userId = msg.id;
                        var userRole = msg.type;
                        var cookieId = msg.guidcode;
                        var cookieDate = msg.guiddate;
                        var cilentIP = msg.clientIp;
                        var diviceType = 1;
                        setUserInfo(userId, userRole, cookieId, cookieDate, cilentIP, diviceType);//登陆成功，初始化用户行为分析
                        pushEvent(4);
                        var url;
                        url = webServerPath + '/common/navigation.php';
                        //邮箱注册
                        if (registerType == 'email') {
                            var params = {checkNumber: msg.checkNumber, token: msg.token, id: msg.id, emailusername: msg.email, emailkey: msg.emailkey};
                            email_validation(msg.email, msg.emailLoginAdd, params, url, msg.url);
                        }
                        //手机注册
                        else {
                            if (hrefName != "/common/register.php") {
                                closeLoginOrRegister($('#register')); //移除注册弹窗
                            }
                            $._panel({
                                msg: '恭喜您！欢迎加入无忧精英！',
                                type: "success",
                                btnName1: "确定",
                                btnPath1: url
                            });
                        }
                        break;
                    case '200':
                        var idName;
                        if (registerType == 'email') {
                            scode($("#phoneimgcode"), 2); //获取新的验证码
                            if (msg.errtype == '2') {
                                idName = "addcodent";
                            } else if (msg.errtype == '3') {
                                idName = "loginnameNotice";
                            } else if (msg.errtype == '4') {
                                idName = "passwordNotice";
                            } else if (msg.errtype == '5') {
                                idName = "checkpassword";
                            } else {
                                idName = "emailNotice";
                            }
                        } else {
                            if (msg.errtype == '2') {
                                idName = "phonecodeNotice";
                            } else if (msg.errtype == '4') {
                                idName = "passwordNotice";
                            } else if (msg.errtype == '5') {
                                idName = "checkpassword";
                            } else {
                                idName = "phoneNotice";
                            }
                        }
                        $("#" + idName).html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>' + msg.msg + '</span>').show();
                        break;
                    case '203':
                        role = msg.role;
                        rolename = msg.loginname;
                        roleNotice(msg.role, msg.msg, msg.message);
                        break;
                }
            }

        });
    }

    //注册成功后弹出邮箱验证
    function email_validation(email, emailurl, params, url, emaillink) {
        if (hrefName != "/common/register.php") {
            closeLoginOrRegister($('#register')); //移除注册弹窗
        }
        var msg = '<span class="txt-strong">' + email + '</span><span id="againemails"><a id="againemail" >重新发送</a></span></p><p>请登录您的邮箱，点击链接激活账号<span class="txt-sub">（1天内有效）</span><input type="hidden" id="emailurl"  value="'+ emaillink +'"/>';
        $._panel({
            msg: msg,
            type: "success",
            title: "验证邮件已经发送到您的邮箱",
            btnName1: "登录邮箱",
            btnName2: "稍后认证",
            btnPath1: emailurl,
            btnTarget1: 1,
            btnPath2: url,
            closeCallback: function () {
                window.location.href = url
            },
            closePanel1: false
        });
        $("#againemail").bind("click", function () {
            resend_email(url, params)
        }); //绑定重新发送事件
    }

    //点击重新发送邮件
    function resend_email(url, params) {
        params.type = usertype;
        $.ajax({
            type: 'POST',
            url: webServerPath + '/common/register.php?act=reSendEmail',
            dataType: 'json',
            data: params,
            error: function () {
                location.reload();
            },
            success: function (msg) {
                switch (msg.status) {
                    case '100':
                        getVerifyCode('email', $("#againemail"), function () {
                            resend_email(url, params)
                        });
                        $("#againemail").unbind("click");
                        isinerval = setInterval(function () {
                            getVerifyCode('email', $("#againemail"), function () {
                                resend_email(url, params)
                            })
                        }, 1000);
                        break;
                    case '200':
                        $._panel({msg: msg.msg, btnPath1: url});
                        break;
                }
            },
            error: function () {
                $._panel({msg: "系统繁忙，请稍后再试！"});
            }
        });
    }

    //当账号已被注册时 提示弹窗
    function roleNotice(role, notice, message) {
        if (hrefName != "/common/register.php") {
            closeLoginOrRegister($('#register')); //移除注册弹窗
        }
        var jsid = role ? 'addrole' : 'loginrole';
        var content = '<div id="rolent" style="z-index: 10000" class="i-model-login"><div class="inner"><div class="i-login-main">';
        content += '<h4>无忧精英</h4><a  class="w_close w_close_ie" ></a><div class="inner"><div class="register-prompt">';
        content += '<div class="register-prompt-inner inner_null"><div class="mail-null"></div><p class="f14 font_b text_null">' + notice + '</p>';
        content += '<div class="hr0"></div><a id="' + jsid + '" class="i-mail-btn btn_nullBg">' + message + '</a> &nbsp;<a id="add" class="i-mail-btn btn_nullBg">注册新帐号</a></div></div></div></div></div></div>';
        $(content).appendTo('body')._alignCenter();
    }

    //验证密码规则  register
    function checkPassword(password) {
        var result = chkPassword(password);  //验证密码
        if (result != 100) {
            $('.point-out').hide();
            $("#passwordNotice").html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>' + result + '</span>').show();
            return false;
        }
        $("#passwordNotice").hide();
        return true;
    }
    //验证两次密码是否输入一致  register
    function chkTwicePassword(password1, password2) {
        if (password1 == password2) {
            $("#checkpasswordNotice").hide();
            return true;
        }
        var msg = checkPasswordtwo(password1, password2);
        if (msg != 100) {
            $('.point-out').hide();
            $("#checkpasswordNotice").html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>' + msg + '</span>').show();
            return false;
        }

    }

    //验证邮箱验证码
    function checkCodes(value) {
        var msg = checkCode(value);
        if (msg != 100) {
            $('#addcodent').html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>' + msg + '</span>').show();
            return false;
        }

        $("#phonecodeNotice").hide();
        return true;

    }

    //显示邮箱注册内容
    function emailRegisterCon() {
        $("#register-by").html('没有邮箱？试试用<a style="text-decoration:underline;" id="phoneRegister">手机注册</a>');
        $("#hrimghide").html(getEmailRegisterStr());
    }

    //显示手机注册内容
    function phoneRegisterCon() {
        if (isinerval)
            clearInterval(isinerval); //清除验证码事件
        $("#register-by").html('没有手机？试试用<a style="text-decoration:underline;" id="emailRegister">邮箱注册</a>');
        $("#hrimghide").html(getPhoneRegisterStr());
        $("#emailRegister").bind("click", emailRegisterCon); //绑定切换邮箱注册事件
        $("#phonecodes").bind("click", sendPhoneCode); //绑定发送验证码的触发事件
    }

    //获取邮箱注册的内容
    function getEmailRegisterStr() {
        registerType = 'email';
        var email = '';
        var registerInfo = $._cookie('registerinfo');
        if (registerInfo != '' || registerInfo != undefined) {
            var registerInfoArr = registerInfo.split('&|&');
            $.each(registerInfoArr, function (i, v) {
                var item = v.split('=');
                if (item.length == 2) {
                    if (item[0] == 'registermail') {
                        email = item[1];
                    }
                }
            });
        }
        if (email != '' && email.length > 0) {
            email = email.replace(/\./g, '=').replace(/\_/g, '/').replace(/\-/g, '+');
            email = Base64.decode(email);  
            //获取cookie中的邮箱信息，验证此邮箱是否正确。邮箱正确的则显示邮箱；否则不显示邮箱   modify by tx 2016-6-23 修复线上注册时邮箱显示乱码的问题 
            if (RegExpObj.email(email)) {  
                email = email;
            } else {
                email = '';
            }
        }
        if (usertype != "manager") {
            isShow = "block";
        } else {
            isShow = "none";
        }
        var arr = [
            '<div style="position:absolute;right:55px;top:55px;"><b id="showManager" style="display:' + isShow + '">已有精英账号？可以<a href="#" id="newLogin" style="text-decoration:underline">新增猎头角色</a></b></div><div class="popupInput inputdiv"><div id="emailNotice" class="point-out" style="width: 348px;top:-38px; left:0px; display: none;"></div>',
            '<input value="' + email + '" maxlength="100" id="email" class="input input-lg" style="width:302px;padding:10px;" type="text">',
            '<span style="padding-left: 1px;' + (email ? ' display: none;' : "") + ' " class="popupInputText">邮箱</span></div><div class="hr20"></div><div class="hr10"></div>',
            '<div class="popupInput inputdiv"><div id="loginnameNotice" class="point-out" style="width: 348px;top:-38px; left:0px; display: none;"></div>',
            '<input maxlength="50" id="loginname" class="input input-lg" style="width:302px;padding:10px;" type="text">',
            '<span style="padding-left: 1px;" class="popupInputText">用户名</span></div><div class="hr20"></div><div class="hr10"></div>',
            '<div class="popupInput inputdiv"><div id="passwordNotice" class="point-out" style="top:-38px; left:0px; display: none;"></div>',
            '<input maxlength="20" id="passwordadd" value="" class="input input-lg" style="width:138px;padding:10px;" type="password">',
            '<span style="padding-left: 1px;" class="popupInputText">密码</span>&nbsp;<div id="checkpasswordNotice" class="point-out" style="top:-38px; left:158px; display: none;">',
            '</div><input value="" maxlength="20" id="checkpassword" class="input input-lg" style="width:138px;padding:10px;" type="password">',
            '<span style="position:absolute;top:12px;left:178px; font-size:14px">确认密码</span></div><div class="hr10"></div>',
            '<div class="popupInput "><div id="addcodent" class="point-out" style="left: 0px; top: -29px; display: none;"></div>',
            '<div class="popupInput inputdiv"><input id="addcode" class="input input-lg" maxlength="4" style=" width:122px;padding:10px;" type="text">',
            '<span class="popupInputText">验证码</span>&nbsp;<img id="phoneimgcode" class="i-yzm" src="/common/verifycode.php?type=2&amp;a=0.03148188414707298" height="42" width="122">',
            '<a id="phonecodeclik" class="i-changeyzm">换一张</a></div></div><div style="position:relative"><div class="point-out" id="addcheckNotice" style="left: 0px; top: -29px; display: none;">',
            '</div><input id="addcheck" checked="checked" value="1" type="checkbox" style="width:13px;">同意<a href="' + webServerPath + '/common/userprotocol.php" target="target" class="undeline">无忧精英网用户协议</a></div><div class="hr10"></div>',
            '<div class="i-btn-box"><a id="email_submit" class="btn btn-lg btn-primary">注册</a><a ' + (hrefName == "/common/register.php" ? 'href="' + webServerPath + '/common/login.php"' : 'id="login"') + ' class="i-zc-undeline">已有51job账号？立即登录</a></div>'
        ];
        return arr.join("");
    }
    //点新增猎头角色按钮触发事件 首页
    $(document).on("click", "#newLogin", function () {
        $(".closeBtn").trigger("click");
        loginLayer(null, 'xpaZpaGgxg==');//调用登陆窗口并且注册猎头信息
    });
    //common/register.php页面
    $(document).on("click", "#directlyLogins", function () {
        if (hrefName == "/common/register.php") {
            window.location.href = webServerPath + "/common/login.php?role=xpaZpaGgxg==";
        } else {
            loginLayer(null, role, rolename);
        }
    });

    //获取手机注册内容
    function getPhoneRegisterStr() {
        registerType = 'phone';
        var arr = [
            '<div class="popupInput inputdiv"><div id="phoneNotice" class="point-out" style="width: 348px;top:-38px; left:0px; display: none;"></div>',
            '<input id="phone" maxlength="20" value="" class="input input-lg" style="width:302px;padding:10px;" type="text">',
            '<span class="popupInputText">手机</span></div><div class="hr20"></div><div class="hr10"></div><div>',
            '<div class="popupInput inputdiv"><div id="phonecodeNotice" class="point-out" style="left: 0px; top: -29px; display: none;">',
            '</div><input id="phonecode" name="phonecode" maxlength="6" class="input input-lg" style="width:190px;padding:10px;" type="text">',
            '<span class="popupInputText">验证码</span>&nbsp;<a id="phonecodes" class="btn " style="padding:10px">发送验证码</a></div>',
            '</div><div class="hr20"></div><div class="hr10"></div><div style="position:relative"><div class="popupInput inputdiv">',
            '<div class="point-out" id="passwordNotice" style="left: 0px; top: -29px; display: none;"></div>',
            '<input id="passwordadd" maxlength="20" value="" class="input input-lg" style="width:138px;padding:10px;" type="password">',
            '<span class="popupInputText">密码</span>&nbsp;<div class="point-out" id="checkpasswordNotice" style="left: 158px; top: -29px; display: none;">',
            '</div><input value="" id="checkpassword" class="input input-lg" maxlength="20" style="width:138px;padding:10px;" type="password">',
            '<span style="position:absolute;top:12px;left:178px; font-size:14px">确认密码</span></div></div><div class="hr10"></div>',
            '<div style="position:relative"><div class="point-out" id="addcheckNotice" style="left: 0px; top: -29px; display: none;"></div>',
            '<input id="addcheck" checked="checked" value="1" type="checkbox" style="13px;">同意<a href="' + webServerPath + '/common/userprotocol.php" target="target" class="undeline">无忧精英网用户协议</a></div><div class="hr10"></div>',
            '<div class="i-btn-box"><a id="addphonelogin" class="btn btn-lg btn-primary">注册</a><a ' + (hrefName == "/common/register.php" ? 'href="' + webServerPath + '/common/login.php"' : 'id="login"') + ' class="i-zc-undeline">已有51job账号？立即登录</a></div>'
        ];
        return arr.join("");
    }
    //查看邮箱丶手机或用户名是否存在，type检查的类型，value检查的值，usertype登录用户类型
    function checkExist(type, value, usertype) {

        value = $._trim(value); //去掉空格
        var bol = false, params = {role: usertype};
        if ($.inArray(type, checkArr) == -1)
            return false;
        params[type] = value;
        $.ajax({
            type: 'POST',
            url: webServerPath + '/common/register.php?act=userInfoCheck',
            async: false,
            dataType: 'json',
            data: params,
            success: function (msg) {
                var tmp = (type == "email") ? "emailNotice" : (type == "username") ? "loginnameNotice" : "phoneNotice";
                switch (msg.status) {
                    case '100':
                        $('#' + tmp).hide();
                        (type == "email") ? emailChecked = 1 : (type == "username") ? usernameChecked = 1 : phoneChecked = 1;
                        $("#alert-error").hide();
                        bol = true;
                        break;
                    case '200':
                        $('#' + tmp).hide();
                        role = msg.role;
                        rolename = msg.loginname;
                        $("#alert-error").html($._tooltip('info', 'small', msg.msg)).show();
                        break;
                    case '201':
                        role = msg.role;
                        rolename = value;
                        $('#' + tmp).html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>' + msg.msg + '</span>').show();
                        break;
                }
            }
        });
        return bol;
    }
    parseRegisterInfo();

    /**
     * 获取注册邀请信息
     * @returns {undefined}
     */
    function parseRegisterInfo() {
        var registerInfo = $._cookie('registerinfo');
        if (registerInfo != '' || registerInfo != undefined) {
            var registerInfoArr = registerInfo.split('&|&');
            $.each(registerInfoArr, function (i, v) {
                var item = v.split('=');
                if (item.length == 2) {
                    if (item[0] == 'registermail') {
                        registermail = item[1];
                    } else if (item[0] == 'registercardid') {
                        registercardid = item[1];
                    } else if (item[0] == 'registercheckcode') {
                        registercheckcode = item[1];
                    } else if (item[0] == 'registertoken') {
                        registertoken = item[1];
                    } else if (item[0] == 'registerinviteid') {
                        registerinviteid = item[1];
                    } else if (item[0] == 'registerinviteuserid') {
                        registerinviteuserid = item[1];
                    }
                }
            });
        }
        if (registermail != '' && registermail.length > 0) {
            registermail = registermail.replace(/\./g, '=').replace(/\_/g, '/').replace(/\-/g, '+');
            if(RegExpObj.email(Base64.decode(registermail))){
                registermail = Base64.decode(registermail);
            }else{
                registermail='';
            }
            
        }
    }
});

