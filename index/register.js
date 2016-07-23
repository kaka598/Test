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
 * @description    ע��ҳ�漰ע�ᵯ��JS
 * @author          yangyang
 * @version         1.1
 * @copyright       Copyright (c) 2014, 51job
 * @since           2014-05-14
 */
$(function () {
    var hrefName = location.pathname; //url��ַ

    //=================================ע�����==================================
    var emailChecked = 2;      //����Ƿ�������ͬ��������ڣ�0-����֤����ͨ�� 1-����֤��ͨ�� 2-δ��֤
    var phoneChecked = 2;      //����Ƿ�������ͬ���ֻ����ڣ�0-����֤����ͨ�� 1-����֤��ͨ�� 2-δ��֤
    var usernameChecked = 2;   //����Ƿ�������ͬ���û������ڣ�0-����֤����ͨ�� 1-����֤��ͨ�� 2-δ��֤
    var usertype = "manager"; //��ǰ�û�����spy|manager
    var checkArr = ['email', "username", "mobilephone"];    //��Ҫ�鿴�������ظ�����������
    var registerType = 'email';//ע�����ͣ�Ĭ������ע��
    var role = "";
    var rolename = "";

    var registermail = "";
    var registercardid = 0;
    var registerinviteid = 0;
    var registercheckcode = "";
    var registertoken = "";
    var registerinviteuserid = 0;

    //ͷ��������ע���¼�
    $(document).on("click", "#emailRegister2", function () {
        register(usertype);
    });

    //ע�ᵯ��
    window.register = function (userType) {
        emailChecked = phoneChecked = usernameChecked = 2;//���ע�����֤״̬
        closeLoginOrRegister($('#loginLayer')); //�Ƴ���¼����
        var registerObj = $('<div id="register" style="z-index:10000;width:690px;" class="i-model-login"></div>');
        var str = '<div id="registerBody" style="display:none" class="inner"><div class="i-login-main"><h4>���Ǿ�Ӣ</h4><a class="w_close w_close_ie closeBtn" ></a>';
        str += '<div id="alert-error"  style="display: none;" ></div> <div class="inner z-index-ie" style="width: 410px;"><div class="i-login-con"><div class="login-con-dt" style="width: 400px;position:relative; z-index:1;">';
        str += '<a usertype="spy" class="login-con-dt-a">��ͷע��</a><a usertype="manager" class="login-con-dt-a chose">��Ӣע��</a><a usertype="hr" id="hradd" class="login-con-dt-a no-line">HRע��</a>';
        str += '</div><div id="register-by"  class="register-by">û�����䣿������<a style="text-decoration:underline;" id="phoneRegister" >�ֻ�ע��</a></div>';
        str += '<div style="display:none;text-align:center;height:330px;padding-top:30px;" id="hrimgshow" ><img width="328" height="306" src="' + imgBasePath + '/images/hr.jpg"></div>';
        str += '<div id="hrimghide" class="inner" >' + (getEmailRegisterStr()) + '</div></div></div></div></div>';

        //ע�ᵯ��չʾǰ����������
        var strNav = '<div id="registerHead" class="i-register-choice">';
        strNav += '<div class="i-register-main"><a class="w_close w_close_ie closeBtn"></a>';
        strNav += '<div class="i-register-qk i-register-jy-hover registerRole" otype="spy">';
        strNav += '<div class="i-register-pic"><img width="114" height="114" src="' + imgBasePath + '/images/circle-pic114-lt.png"><i class="icon46-choise"></i><h2>��ͷ</h2></div>';
        strNav += '<div class="i-register-list">';
        strNav += '<ul>';
        strNav += '<li>�༶��֤��רҵ��ͷ����</li>';
        strNav += '<li>��������ϵ������ǧ��Ӣ�˲�</li>';
        strNav += '<li>����Case����������</li>';
        strNav += '<li>����Ƭ����ȶ�����׬ȡ����</li>';
        strNav += '</ul>';
        strNav += '</div>';
        strNav += '<div class="i-register-btn"><a class="btn btn-primary btn-lg registerRole" otype="spy">��Ҫ��Ϊ��ͷ</a></div>';
        strNav += '</div>';

        strNav += '<div class="i-register-qk registerRole" otype="manager">';
        strNav += '<div class="i-register-pic"><img width="114" height="114" src="' + imgBasePath + '/images/circle-pic114-jy.png"><i class="icon46-choise"></i><h2>��Ӣ</h2>';
        strNav += '</div>';
        strNav += '<div class="i-register-list">';
        strNav += '<ul>';
        strNav += '<li>֧��51job�˻�ע��</li>';
        strNav += '<li>����Profile���������Ϣ</li>';
        strNav += '<li>����������ͷ����Ϊ������</li>';
        strNav += '<li>���ȹ���������</li>';
        strNav += '</ul>';
        strNav += '</div>';
        strNav += '<div class="i-register-btn"><a class="btn btn-primary btn-lg registerRole" otype="manager">��Ҫ��Ϊ��Ӣ</a></div>';
        strNav += '</div>';
        strNav += '</div>';
        strNav += '</div>';

        str += strNav;
        registerObj.html(str).appendTo('body')._alignCenter();
        //�û�ѡ���¼�
        $(document).on("click", "#registerHead .registerRole", function () {
            $("#registerHead").hide();
            $("#registerBody").show();
            $("#register").css("width", "450")._alignCenter();
            $("#registerBody [usertype='" + $(this).attr("otype") + "']").trigger("click");
        });
        //�ر�ע�ᵯ��
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

    //ע��ҳ��register.php
    $(document).on("click", "a.login-con-dt-a", changeRole); //�л�����ɫ

    //�л�ע���ˣ����������
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
    //�ж��Ƿ���Ҫ����ע����ߵ�¼
    if ($('#userpwd ').val() == '') {
        var dialogtype = $._urlParams('dialogtype');
        if (dialogtype == 1 && hrefName != "/common/register.php") {
            register('manager');
        } else if (dialogtype == 2 && hrefName != "/common/register.php") {
            register('spy');
        }
    }
    //���л�����¼�¼�
    $(document).on("click", "#login", loginLayer);
    $(document).on("click", "#directlyLogin", function () {
        if (hrefName == "/common/register.php") {
            window.location.href = webServerPath + "/common/login.php?role=" + role + '&loginname=' + rolename;
        } else {
            loginLayer(null, role, rolename);
        }
    });
    //�󶨻�ȡ��֤���¼�
    $(document).on("click", "#phonecodeclik", function () {
        scode($("#phoneimgcode"), 2);
    });
    //���л��ֻ�ע���¼�
    $(document).on("click", "#phoneRegister", phoneRegisterCon);
    //������ע���¼�
    $(document).on("click", "#email_submit", registerUser);
    //���ֻ�ע���¼�
    $(document).on("click", "#addphonelogin", registerUser);
    //��֤���ȡ�����¼�
    $(document).on("focus", "#addcode", function () {
        $("#addcodent").hide();
    });
    //�û�Э�鹴ѡ�¼�
    $(document).on("click", "#addcheck", function () {
        checkd($(this));
    });
    //�������������������µ�����
    $(document).on('change, keyup', '#email', function () {
        $('#alert-error, #emailNotice').hide();
        emailChecked = 2;//�������������¼���
    });
    //�������Ƴ�����֤����
    $(document).on("blur", "#email", function () {
        var value = $(this).val();
        if (value != "") {
            var bol = verifyEmail(value, usertype);
            if (!bol && usernameChecked == 0) {
                $("#loginnameNotice").hide();
            }
        }
    });
    //�������µ��ֻ�
    $(document).on('change, keyup', '#phone ', function () {
        $("#phoneNotice").hide();
        phoneChecked = 2; //�������������¼���
    });
    //�ֻ�����Ƴ�������ֻ��Ƿ���ע���
    $(document).on('blur', '#phone', function () {
        var value = $(this).val();
        (value != "") && verifyPhone(value, usertype); //��Ϊ����֤�ֻ�
    });
    //�û�������������������µ��û���
    $(document).on('change, keyup', '#loginname ', function () {
        $("#loginnameNotice").hide();
        usernameChecked = 2; //�������������¼���
    });
    //�������µ��ֻ���֤��
    $(document).on('change, keyup', '#phonecode ', function () {
        $("#phonecodeNotice").hide()
    });
    //�û�������Ƴ������û���
    $(document).on("blur", "#loginname", function () {
        //����δ��֤
        if (emailChecked == 2 && !verifyEmail($("#email").val(), usertype)) {
            $("#loginnameNotice").hide(); //�����û���������ʾ
            return false;
        }
        if (emailChecked == 0)
            return false; //������֤��ͨ������
        var value = $(this).val();
        (value != "") && verifyUsername(value, usertype); //��Ϊ����֤����
    });
    //����������
    $(document).on('focus', '#passwordadd, #checkpassword', function () {
        $("#" + (this.id == "checkpassword" ? "checkpasswordNotice" : "passwordNotice")).hide();
    });
    //�������ɫ
    $(document).on("click", "#addrole", function () {
        if (hrefName == "/common/register.php") {
            window.location.href = webServerPath + "/common/login.php?role=" + role + '&rolename=' + rolename;
        } else {
            loginrole(role, rolename);
        }
    });

    //�û�Э���Ƿ�ͬ����֤    
    function checkd(obj) {
        if (!obj.attr("checked")) {
            $("#addcheckNotice").html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>�빴ѡ����</span>').show();
        } else {
            $("#addcheckNotice").hide();
        }
    }

    //��֤����
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

    //��֤�û���
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
    //��֤�ֻ���
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

    //�����ֻ���֤��
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
                        $("#phoneNotice").hide(); //������ʾ����
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

    //��֤�ֻ���ȡ������֤��  register
    function phonecodecheck(value) {
        if (hrefName != "/common/register.php") {
            //δ��ȡ��֤��
            if (!$("#phonecodes").hasClass("disabled")) {
                $('.point-out').hide();
                $("#phonecodeNotice").html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>��֤�����</span>').show();
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

    //ע���û�������ע�ᡢ�ֻ�ע��
    function registerUser() {
        if (registerType == 'email') {
            var email = $("#email").val();
            var username = $("#loginname").val();

            //���䣬�û��������Ϸ���
            if (emailChecked != 1 && !verifyEmail(email, usertype))
                return false;
            if (usernameChecked != 1 && !verifyUsername(username, usertype)) {
                $("#loginnameNotice").show(); //��ʾ������ʾ
                return false;
            }
        } else {
            var phone = $("#phone").val();
            var phonecode = $('#phonecode').val();

            //�ֻ����ֻ���֤�벻���Ϸ���
            if (phoneChecked != 1 && !verifyPhone(phone, usertype))
                return false;
            if (!phonecodecheck(phonecode))
                return false;
        }

        var password = $("#passwordadd").val();
        var checkpassword = $("#checkpassword").val();
        var addcode = $.trim($('#addcode').val()); //��֤��
        var addcheck = $("#addcheck").attr("checked") ? 1 : 0;

        //�������
        if (!checkPassword(password))
            return false;
        //�����������������Ƿ�һ��
        if (!chkTwicePassword(password, checkpassword))
            return false;
        //�����֤��
        if (registerType == 'email') {
            if (!checkCodes(addcode))
                return false;
        }
        //Э�鹴ѡ
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

        //�ύ�Ĳ���
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
                        //ͳ��ע���� modify by liufei 2015-10-9
                        var userId = msg.id;
                        var userRole = msg.type;
                        var cookieId = msg.guidcode;
                        var cookieDate = msg.guiddate;
                        var cilentIP = msg.clientIp;
                        var diviceType = 1;
                        setUserInfo(userId, userRole, cookieId, cookieDate, cilentIP, diviceType);//��½�ɹ�����ʼ���û���Ϊ����
                        pushEvent(4);
                        var url;
                        url = webServerPath + '/common/navigation.php';
                        //����ע��
                        if (registerType == 'email') {
                            var params = {checkNumber: msg.checkNumber, token: msg.token, id: msg.id, emailusername: msg.email, emailkey: msg.emailkey};
                            email_validation(msg.email, msg.emailLoginAdd, params, url, msg.url);
                        }
                        //�ֻ�ע��
                        else {
                            if (hrefName != "/common/register.php") {
                                closeLoginOrRegister($('#register')); //�Ƴ�ע�ᵯ��
                            }
                            $._panel({
                                msg: '��ϲ������ӭ�������Ǿ�Ӣ��',
                                type: "success",
                                btnName1: "ȷ��",
                                btnPath1: url
                            });
                        }
                        break;
                    case '200':
                        var idName;
                        if (registerType == 'email') {
                            scode($("#phoneimgcode"), 2); //��ȡ�µ���֤��
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

    //ע��ɹ��󵯳�������֤
    function email_validation(email, emailurl, params, url, emaillink) {
        if (hrefName != "/common/register.php") {
            closeLoginOrRegister($('#register')); //�Ƴ�ע�ᵯ��
        }
        var msg = '<span class="txt-strong">' + email + '</span><span id="againemails"><a id="againemail" >���·���</a></span></p><p>���¼�������䣬������Ӽ����˺�<span class="txt-sub">��1������Ч��</span><input type="hidden" id="emailurl"  value="'+ emaillink +'"/>';
        $._panel({
            msg: msg,
            type: "success",
            title: "��֤�ʼ��Ѿ����͵���������",
            btnName1: "��¼����",
            btnName2: "�Ժ���֤",
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
        }); //�����·����¼�
    }

    //������·����ʼ�
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
                $._panel({msg: "ϵͳ��æ�����Ժ����ԣ�"});
            }
        });
    }

    //���˺��ѱ�ע��ʱ ��ʾ����
    function roleNotice(role, notice, message) {
        if (hrefName != "/common/register.php") {
            closeLoginOrRegister($('#register')); //�Ƴ�ע�ᵯ��
        }
        var jsid = role ? 'addrole' : 'loginrole';
        var content = '<div id="rolent" style="z-index: 10000" class="i-model-login"><div class="inner"><div class="i-login-main">';
        content += '<h4>���Ǿ�Ӣ</h4><a  class="w_close w_close_ie" ></a><div class="inner"><div class="register-prompt">';
        content += '<div class="register-prompt-inner inner_null"><div class="mail-null"></div><p class="f14 font_b text_null">' + notice + '</p>';
        content += '<div class="hr0"></div><a id="' + jsid + '" class="i-mail-btn btn_nullBg">' + message + '</a> &nbsp;<a id="add" class="i-mail-btn btn_nullBg">ע�����ʺ�</a></div></div></div></div></div></div>';
        $(content).appendTo('body')._alignCenter();
    }

    //��֤�������  register
    function checkPassword(password) {
        var result = chkPassword(password);  //��֤����
        if (result != 100) {
            $('.point-out').hide();
            $("#passwordNotice").html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>' + result + '</span>').show();
            return false;
        }
        $("#passwordNotice").hide();
        return true;
    }
    //��֤���������Ƿ�����һ��  register
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

    //��֤������֤��
    function checkCodes(value) {
        var msg = checkCode(value);
        if (msg != 100) {
            $('#addcodent').html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>' + msg + '</span>').show();
            return false;
        }

        $("#phonecodeNotice").hide();
        return true;

    }

    //��ʾ����ע������
    function emailRegisterCon() {
        $("#register-by").html('û�����䣿������<a style="text-decoration:underline;" id="phoneRegister">�ֻ�ע��</a>');
        $("#hrimghide").html(getEmailRegisterStr());
    }

    //��ʾ�ֻ�ע������
    function phoneRegisterCon() {
        if (isinerval)
            clearInterval(isinerval); //�����֤���¼�
        $("#register-by").html('û���ֻ���������<a style="text-decoration:underline;" id="emailRegister">����ע��</a>');
        $("#hrimghide").html(getPhoneRegisterStr());
        $("#emailRegister").bind("click", emailRegisterCon); //���л�����ע���¼�
        $("#phonecodes").bind("click", sendPhoneCode); //�󶨷�����֤��Ĵ����¼�
    }

    //��ȡ����ע�������
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
            //��ȡcookie�е�������Ϣ����֤�������Ƿ���ȷ��������ȷ������ʾ���䣻������ʾ����   modify by tx 2016-6-23 �޸�����ע��ʱ������ʾ��������� 
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
            '<div style="position:absolute;right:55px;top:55px;"><b id="showManager" style="display:' + isShow + '">���о�Ӣ�˺ţ�����<a href="#" id="newLogin" style="text-decoration:underline">������ͷ��ɫ</a></b></div><div class="popupInput inputdiv"><div id="emailNotice" class="point-out" style="width: 348px;top:-38px; left:0px; display: none;"></div>',
            '<input value="' + email + '" maxlength="100" id="email" class="input input-lg" style="width:302px;padding:10px;" type="text">',
            '<span style="padding-left: 1px;' + (email ? ' display: none;' : "") + ' " class="popupInputText">����</span></div><div class="hr20"></div><div class="hr10"></div>',
            '<div class="popupInput inputdiv"><div id="loginnameNotice" class="point-out" style="width: 348px;top:-38px; left:0px; display: none;"></div>',
            '<input maxlength="50" id="loginname" class="input input-lg" style="width:302px;padding:10px;" type="text">',
            '<span style="padding-left: 1px;" class="popupInputText">�û���</span></div><div class="hr20"></div><div class="hr10"></div>',
            '<div class="popupInput inputdiv"><div id="passwordNotice" class="point-out" style="top:-38px; left:0px; display: none;"></div>',
            '<input maxlength="20" id="passwordadd" value="" class="input input-lg" style="width:138px;padding:10px;" type="password">',
            '<span style="padding-left: 1px;" class="popupInputText">����</span>&nbsp;<div id="checkpasswordNotice" class="point-out" style="top:-38px; left:158px; display: none;">',
            '</div><input value="" maxlength="20" id="checkpassword" class="input input-lg" style="width:138px;padding:10px;" type="password">',
            '<span style="position:absolute;top:12px;left:178px; font-size:14px">ȷ������</span></div><div class="hr10"></div>',
            '<div class="popupInput "><div id="addcodent" class="point-out" style="left: 0px; top: -29px; display: none;"></div>',
            '<div class="popupInput inputdiv"><input id="addcode" class="input input-lg" maxlength="4" style=" width:122px;padding:10px;" type="text">',
            '<span class="popupInputText">��֤��</span>&nbsp;<img id="phoneimgcode" class="i-yzm" src="/common/verifycode.php?type=2&amp;a=0.03148188414707298" height="42" width="122">',
            '<a id="phonecodeclik" class="i-changeyzm">��һ��</a></div></div><div style="position:relative"><div class="point-out" id="addcheckNotice" style="left: 0px; top: -29px; display: none;">',
            '</div><input id="addcheck" checked="checked" value="1" type="checkbox" style="width:13px;">ͬ��<a href="' + webServerPath + '/common/userprotocol.php" target="target" class="undeline">���Ǿ�Ӣ���û�Э��</a></div><div class="hr10"></div>',
            '<div class="i-btn-box"><a id="email_submit" class="btn btn-lg btn-primary">ע��</a><a ' + (hrefName == "/common/register.php" ? 'href="' + webServerPath + '/common/login.php"' : 'id="login"') + ' class="i-zc-undeline">����51job�˺ţ�������¼</a></div>'
        ];
        return arr.join("");
    }
    //��������ͷ��ɫ��ť�����¼� ��ҳ
    $(document).on("click", "#newLogin", function () {
        $(".closeBtn").trigger("click");
        loginLayer(null, 'xpaZpaGgxg==');//���õ�½���ڲ���ע����ͷ��Ϣ
    });
    //common/register.phpҳ��
    $(document).on("click", "#directlyLogins", function () {
        if (hrefName == "/common/register.php") {
            window.location.href = webServerPath + "/common/login.php?role=xpaZpaGgxg==";
        } else {
            loginLayer(null, role, rolename);
        }
    });

    //��ȡ�ֻ�ע������
    function getPhoneRegisterStr() {
        registerType = 'phone';
        var arr = [
            '<div class="popupInput inputdiv"><div id="phoneNotice" class="point-out" style="width: 348px;top:-38px; left:0px; display: none;"></div>',
            '<input id="phone" maxlength="20" value="" class="input input-lg" style="width:302px;padding:10px;" type="text">',
            '<span class="popupInputText">�ֻ�</span></div><div class="hr20"></div><div class="hr10"></div><div>',
            '<div class="popupInput inputdiv"><div id="phonecodeNotice" class="point-out" style="left: 0px; top: -29px; display: none;">',
            '</div><input id="phonecode" name="phonecode" maxlength="6" class="input input-lg" style="width:190px;padding:10px;" type="text">',
            '<span class="popupInputText">��֤��</span>&nbsp;<a id="phonecodes" class="btn " style="padding:10px">������֤��</a></div>',
            '</div><div class="hr20"></div><div class="hr10"></div><div style="position:relative"><div class="popupInput inputdiv">',
            '<div class="point-out" id="passwordNotice" style="left: 0px; top: -29px; display: none;"></div>',
            '<input id="passwordadd" maxlength="20" value="" class="input input-lg" style="width:138px;padding:10px;" type="password">',
            '<span class="popupInputText">����</span>&nbsp;<div class="point-out" id="checkpasswordNotice" style="left: 158px; top: -29px; display: none;">',
            '</div><input value="" id="checkpassword" class="input input-lg" maxlength="20" style="width:138px;padding:10px;" type="password">',
            '<span style="position:absolute;top:12px;left:178px; font-size:14px">ȷ������</span></div></div><div class="hr10"></div>',
            '<div style="position:relative"><div class="point-out" id="addcheckNotice" style="left: 0px; top: -29px; display: none;"></div>',
            '<input id="addcheck" checked="checked" value="1" type="checkbox" style="13px;">ͬ��<a href="' + webServerPath + '/common/userprotocol.php" target="target" class="undeline">���Ǿ�Ӣ���û�Э��</a></div><div class="hr10"></div>',
            '<div class="i-btn-box"><a id="addphonelogin" class="btn btn-lg btn-primary">ע��</a><a ' + (hrefName == "/common/register.php" ? 'href="' + webServerPath + '/common/login.php"' : 'id="login"') + ' class="i-zc-undeline">����51job�˺ţ�������¼</a></div>'
        ];
        return arr.join("");
    }
    //�鿴����ؼ�ֻ����û����Ƿ���ڣ�type�������ͣ�value����ֵ��usertype��¼�û�����
    function checkExist(type, value, usertype) {

        value = $._trim(value); //ȥ���ո�
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
     * ��ȡע��������Ϣ
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

