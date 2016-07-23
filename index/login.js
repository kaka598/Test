/**
 * @description    ��¼���JS
 * @author          yangyang
 * @version         1.1
 * @copyright       Copyright (c) 2014, 51job
 * @since           2014-05-14
 */
(function ($) {
    //===========================ͷ��������¼��=========================
    //��ʼ��ͷ����¼��
    if ($('#username').val() != '') {
        $('#username').next('span').hide();
    }

    //������ESCʱ �˳���ǰ����
    $(document).on('keypress', '.escClass', function (e) {
        if (e.which == 0) {
            $._removeMask();//ȥ������
            $('#' + $(this).attr('id')).remove();
        }
    });

    //ͷ������� ����س�
    $(document).on("keypress", "#header input", function (e) {
        if (e.which == 13)
            toplogin();
    });

    //ͷ��������¼
    $(document).on("click", "#loginc", function () {
        toplogin();
    });

    //ָ����½��ɫ��isTopLogin=1Ϊ������½��ʽ������Ϊ�����½��ʽ��
    //return ���ؾ�Ӣ��ɫ���ܺ���ַ�������ͷ��ɫĬ�Ϸ���Ϊ�ա�
    function loginByRole(isTopLogin) {
        var strPage = window.location.pathname.toLowerCase();
        if (isTopLogin != 1 || typeof isTopLogin == "undefined") {
            //��Case��casedetail.php��spy/spyinfo.php�����½ģʽ����½ǰ��ָ��Ϊ��Ӣ��ɫ
            if (strPage.indexOf("/common/casedetail.php") == 0 || strPage.indexOf("/spy/spyinfo.php") == 0) {
                return '0pOjlJmZ0w=='; //manager��Ӣ��ɫ���ܺ���ַ�����0pOjlJmZ0w==
            }
        }
        return '';                    //spy��ͷ��ɫ���ܺ���ַ�����2KKu
    }

    //ͷ����¼
    function toplogin() {
        var loginname = $._trim($('#username').val());              //�û���
        var loginpassword = $('#userpwd').val();                    //����
        var randomCode = $._trim($('#randomCode').val());           //��֤��
        var checkbox = $("#autoLogin").attr("checked") ? 1 : "";    //�Զ���¼
        var loginrole = $._trim($('body').attr("loginRole"));       //ָ����½��ɫ modify by ziheng.guo 2015-8-26
        var params = {
            username: loginname,
            userpwd: loginpassword,
            islayer: 0,
            checked: checkbox,
            randomcode: randomCode,
            role: loginrole
        }

        if (loginname == '' || loginpassword == '') {
            loginLayer(null, null, null, loginname, loginpassword, '1', '�û��������벻��Ϊ��');
            return false;
        }
        if (getToDay() != $('#randomCode').attr('tody') && randomCode != '') {
            randomCode = ajaxRandomCode();
        }
        if (loginByRole() != "") {
            params.role = loginByRole(1);
        }
        params.pageurl = getValidUrl();
        $("#loginc").attr("class", "login-dl login-dl-desabled").attr('id', 'loginc2');
        $.ajax({type: 'POST', dataType: 'json', url: webServerPath + '/common/login.php?act=ajaxlogin',
            data: params,
            success: function (data) {
                $("#loginc2").attr("class", "login-dl").attr('id', 'loginc');
                switch (data.status) {
                    case "100":
                        loginSuccess(data);
                        break;
                    case '101':
                        loginOffline(data.pageurl);
                        break;
                    case '200':
                        loginLayer(null, null, null, loginname, loginpassword, data.errType, data.msg);
                        break;
                    case '201':
                        loginLayer(null, null, null, loginname, loginpassword, data.errType, data.msg);
                        break;
                    case '202':
                        danger();
                        break;
                    case '203':
                        loginLayer(null, null, null, loginname, loginpassword, '1', data.msg);
                        break;
                    case '204':
                        loginLayer(null, null, null, loginname, loginpassword, '1', data.msg);
                        break;
                }
            },
            error: function () {
                loginLayer(null, null, null, loginname, loginpassword, '1', 'ϵͳæ�����Ժ�����');
            }
        });
    }
    //===========================end ͷ��������¼��=========================

    //��ǰ�û�����spy|manager
    var usertype = $._cookie("LoginRole").split("=").pop();

    //��¼��������
    window.loginLayer = function (callback, roleadd, roleaddname, loginname, loginpassword, errtype, errmsg) {
        if (typeof roleadd == "undefined") {
            roleadd = loginByRole(0);
        }
        closeLoginOrRegister($('#register')); //ɾ��ע�ᵯ��
        var str = "",
                loginname = loginname || "",
                loginpassword = loginname ? loginpassword : "",
                roleaddname = roleaddname, //��ɫ��Դ ����ֵʱ��������ɫ
                roleadd = roleadd || "", //Ҫȥ�Ľ�ɫ��Ϣ ����spy ��Ҫ�����ͷ�˺�  MANAGER ��Ҫ��¼��Ӣ
                checkboxtext = $("#autoLogin").attr("checked") ? 'checked=""' : "";

        var loginLayerObj = $('<div id="loginLayer" style="z-index: 10000" class="i-model-login"></div>');
        str += '<div class="inner"><div class="i-login-main"><a class="w_close w_close_ie closeBtn"></a><h4>���Ǿ�Ӣ</h4>';
        str += '<div id="fadent"></div><div class="inner"><div class="i-login-con">';
        str += '<div class="inner"><div class=" f14 font_b" >��¼</div><div class="hr10"></div>';
        str += '<div class="popupInput inputdiv"><div id="loginusername" class="point-out" style="left: 0px; top: -29px; display: none;">';
        str += '</div><input id="usernames" maxlength="100" value="' + (roleaddname ? $._html2Entity(roleaddname) : $._html2Entity(loginname)) + '" class="input input-lg" style="width:302px;padding:10px;" type="text"/>';
        str += '<span' + (loginname || roleaddname ? ' style=" display: none;"' : "") + ' class="popupInputText" style="padding-left: 1px;" >����/�ֻ�/�û���/51job�˺�</span>';
        str += '</div><div class="hr10"></div><div style="position:static;float:right;"><a class="repassword"  >��������?</a></div>';
        str += '<div style="clear:both;"></div><div class="popupInput inputdiv"><div style="position:relative">';
        str += '<div id="loginpasswordnt" class="point-out" style="left: 0px; top: -29px; display: none;"></div>';
        str += '<input id="passwords" value="' + loginpassword + '" type="password" maxlength="20" class="input input-lg" style="width:302px;padding:10px;" />';
        str += '<span ' + (loginpassword ? ' style=" display: none;"' : "") + ' class="popupInputText" style="padding-left: 1px;" >����</span></div></div>';
        str += '<div class="hr10"></div><div id="codediv"></div>';
        str += '<div class="hr10"></div><input ' + checkboxtext + ' type="checkbox" style="width:13px;" />�´��Զ���¼<div class="hr20"></div>';
        str += '<div class="i-btn-box"><a class="btn btn-primary btn-lg loginBtn" >��¼</a><a class="i-dl-zcdoor registerUser">��û���˺ţ�����ע��</a></div>';
        str += '</div></div></div></div></div>';
        loginLayerObj.html(str).appendTo('body')._alignCenter(); //��ʾ����������
        hasVCode(errtype, errmsg); //�ж�������֤��
        loginLayerObj.find("a.closeBtn").bind("click", function () {
            closeLoginOrRegister(loginLayerObj)
        }); //�رյ�¼����
        loginLayerObj.find("a.loginBtn").bind("click", function () {
            loginSubmit(roleadd);
        }); //�󶨵�¼�¼�
        loginLayerObj.find("input").bind("keypress", function (e) {
            if (e.which == 13)
                loginSubmit(roleadd);
        }); //�󶨵�¼�¼�
        loginLayerObj.find("a.registerUser").bind("click", function () {
            register(usertype)
        }); //ע��
        loginLayerObj.find("#usernames").bind("focus", function () {
            $("#loginusername").hide()
        }); //�û�����ȡ�����¼�
        loginLayerObj.find("#passwords").bind("focus", function () {
            $("#loginpasswordnt").hide()
        }); //�����ȡ�����¼�
    };
    //������ɫ��¼����
    window.loginrole = function (roleadd, roleaddname) {
        closeLoginOrRegister($('#register')); //ɾ��ע�ᵯ��
        var loginRoleObj = $('<div id="loginLayer" style="z-index: 10000" class="i-model-login"></div>');
        var str = '<div class="inner"><div class="i-login-main"><h4>���Ǿ�Ӣ</h4><a class="w_close w_close_ie closeBtn"></a>';
        str += '<div id="addrolent" ></div><div class="inner"><div class="i-login-con"><div class="inner">';
        str += '<div class=" f14 font_b" >�½���ͷ��ɫ</div><div class="hr10"></div><div class="f12">';
        str += '���ľ�Ӣ�ʺ��ǣ�<span>' + roleaddname + '</span></div><div class="hr20"></div>';
        str += '<div class="popupInput inputdiv"><div class="lost-password" style=" top:-22px; right:6px"><a class="repassword" href="' + webServerPath + '/common/forgetpassword.php">�������룿</a></div>';
        str += '<div style="position:relative"><div id="loginpasswordnt" class="point-out" style="left: 0px; top: -29px; display: none;"></div>';
        str += '<input maxlength="20" id="passwords" value="" type="password" style="width:302px;padding:10px;" class="input input-lg" />';
        str += '<span class="popupInputText" style="padding-left: 1px;" >����</span></div></div><div class="hr20"></div><div id="codediv">';
        //��AJAX�����ж��Ƿ�����֤��
        $.ajax({
            type: 'POST',
            url: webServerPath + '/common/verifycode.php?act=hasVCode&type=3',
            dataType: 'json',
            success: function (msg) {
                if (msg.status == '101') {
                    str += '<div class="popupInput"><div class="popupInput inputdiv"><div id="logincodent" class="point-out" style="left: 0px; top: -29px; display: none;"></div><input type="text" maxlength="4" style=" width:122px; padding:10px;" id="logincode" class="input input-lg" /><span class="popupInputText">��֤��</span>&nbsp;';
                    str += '<img id="imgcode" width="122" height="42" class="i-yzm" title="���ˢ��" src="' + webServerPath + '/common/verifycode.php?type=3&a="' + Math.random() + '" /> ';
                    str += '<a id="codeclick" style="text-decoration:none;" class="i-changeyzm">��һ��</a> </div></div>';
                }
                str += '</div><div class="hr20"></div><div class="i-btn-box"><a id="loginroles" class="i-dl-btn">��¼</a><a id="add" class="i-dl-zcdoor">��û���˺ţ�����ע��</a></div></div></div></div></div></div>'
                if (msg.status == '101') {
                    $('#fadent').addClass('alert alert-error').html('<i class="icon-tips-error"></i>�����һ��Сʱ�������������������࣬��Ҫ������֤�롣');
                    scode($("#imgcode"), 3);
                }
                loginRoleObj.html(str).appendTo('body')._alignCenter();
                loginRoleObj.find("#add").bind("click", function () {
                    register(usertype)
                });
                loginRoleObj.find("#loginroles").bind("click", function () {
                    loginroleuser(roleadd, roleaddname)
                }); //�󶨵�¼�¼�
                loginRoleObj.find("#passwords").bind("focus", function () {
                    $("#loginpasswordnt").hide()
                }); //�����ȡ�����¼�
                loginRoleObj.find("a.closeBtn").bind("click", function () {
                    closeLoginOrRegister(loginRoleObj)
                }); //�رյ���
                loginRoleObj.find("#codeclick").bind("click", function () {
                    scode($("#imgcode"), 3)
                }); //��ȡ��֤��
            }
        });
    };

    //������ɫ��¼��֤
    function loginroleuser(loginrole, roleaddname) {
        $("#email_submit").attr("class", "btn disabled btn-lg");
        $("#email_submit").attr("id", "email_submit_disabled");
        var loginpassword = $('#passwords').val();  //��ȡ��¼����
        if (!checkLoginPassword(loginpassword))
            return false; //��������Ƿ�Ϊ��
        //�ж��Ƿ������֤��
        var logincode = $('#logincode');
        if (logincode[0]) {
            if (logincode.val() == '') {
                $('.point-out').hide();
                $("#logincodent").html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>��֤�벻��Ϊ��</span>').show();
                return false;
            }
        }
        var randomCode = $._trim($('#randomCode').val()); //��֤��
        if (loginrole == '') {
            loginrole = $._trim($('body').attr("loginRole")); //ָ����½��ɫ modify by ziheng.guo 2015-8-26
        }
        var params = {
            username: roleaddname,
            userpwd: loginpassword,
            vcode: logincode.val(),
            islayer: 1,
            role: loginrole,
            randomcode: randomCode
        }
        params.pageurl = getValidUrl();
        $("#loginroles").attr("class", " disabled btn btn-primary btn-lg").attr('id', 'loginroles2');
        $.ajax({type: 'POST', dataType: 'json', timeout: 3000, url: webServerPath + '/common/login.php?act=ajaxlogin',
            data: params,
            success: function (data) {
                $("#loginroles2").attr("class", "i-dl-btn").attr('id', 'loginroles');
                var userType = data['userType'];     //��ȡ�û���Ϣ
                switch (data.status) {
                    case '100':                     //����¼�ɹ�ʱ
                        loginSuccess(data);
                        break;
                    case '101'://���˺����������ط����������¼
                        loginOffline(data.pageurl);
                        break;
                    case '200':
                        if (data.errType == '28') {
                            $('.point-out').hide();
                            $('#addrolent').addClass('alert alert-error').html('<i class="icon-tips-error"></i>�����˻��ѱ��������� <a class="txt-link repassword">�һص�¼����</a> ���¼').show();
                        } else {
                            $('.point-out').hide();
                            $("#loginpasswordnt").html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>' + data.msg + '</span>').show();
                        }
                        break;
                    case '201':
                        $('.point-out').hide();
                        $('#codediv').html('<div><div class="popupInput inputdiv"><div id="logincodent" class="point-out" style="left: 0px; top: -29px; "><span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>' + data.msg + '</span></div><input type="text" style=" width:122px;padding;10px;" maxlength="4" id="logincode" class="input input-lg" /><span class="popupInputText">��֤��</span>&nbsp;<img id="imgcode" width="122" height="42" class="i-yzm" title="���ˢ��" src="' + webServerPath + '/common/verifycode.php?type=3&a=' + Math.random() + '"/><a id="codeclick" style="text-decoration:none;" class="i-changeyzm">��һ��</a> </div></div>');
                        break;
                    case '202'://���û����뷢��й©ʱ����
                        danger();
                        break;
                    case '203':
                        $('.point-out').hide();
                        $("#loginpasswordnt").html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>' + data.msg + '</span>').show();
                        break;
                    case '204'://���û�������
                        loginLayer(null, null, null, roleaddname, loginpassword, '1', data.msg);
                        break;
                }
            },
            error: function () {
                $('.point-out').hide();
                $("#loginusername").html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>ϵͳæ�����Ժ�����</span>').show();
            }
        });
    }
    //������֤�ֻ�
    function showMobileAuth() {
       var  role = $("#Message").attr('role');
       var isshowMobileAuth=$._urlParams('isshowMobileAuth');
      
       if(isshowMobileAuth!=1){
           return;
       }
        var str = '<div class="operate1">';
        str += '<div class="panel-head2" id="mobileAuthHeader"><span> <img src="' + webServerPath + '/images/mobileauth/rz-att.png"/></span><p>ע��</p><a class="icon-panelclose trans-50"></a></div>';
        str += '<div class="content-body"><div class="form"><p>�����ʺ��ѽ��ԭ���ֻ���֤���������ʺ��ֻ���Ϣ��</p></div>';
        if (role == 'spy') {
            str += '<div class="panel-bouttn"><a class="btn-w " target="_blank" href="' + webServerPath + '/spy/spyauth.php?iscardedit=2">  ������֤  </a>';
        } else if (role == 'manager') {
//            str += '<div class="panel-bouttn"><a class="btn-w " target="_blank" href="' + webServerPath + '/manager/managerprofile.php?isprofileedit=2">  ������֤  </a>';
            //modify by:zhumingming     2016-05-10  ��Ӣ�������ĸİ�
            str += '<div class="panel-bouttn"><a class="btn-w " target="_blank" href="' + webServerPath + '/manager/mgrcenter.php?tabid=contactLogin&mod=1&isprofileedit=2">  ������֤  </a>';
        }
        str += '<a class=" btn-w btn-cancle cancle"> &nbsp; &nbsp;ȡ �� &nbsp &nbsp;</a></div>';
        str += '</div></div>';
        $('<div style="position:absolute;z-index:10000;" id="mobileAuthDiv"></div>').appendTo('body');
        $("#mobileAuthDiv").html(str);
        $("#mobileAuthDiv")._alignCenter()._dragHandle($("#mobileAuthHeader"));
    }

//������֤�ر��¼�
    $(document).on('click', '#mobileAuthDiv .trans-50', function (e) {
        $('#mobileAuthDiv').remove();
        $._removeMask();
    });
    $(document).on('click', '#mobileAuthDiv .cancle', function (e) {
        $('#mobileAuthDiv').remove();
        $._removeMask();
    });
   showMobileAuth();
})(jQuery);