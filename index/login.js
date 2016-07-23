/**
 * @description    登录相关JS
 * @author          yangyang
 * @version         1.1
 * @copyright       Copyright (c) 2014, 51job
 * @since           2014-05-14
 */
(function ($) {
    //===========================头部导航登录框=========================
    //初始化头部登录框
    if ($('#username').val() != '') {
        $('#username').next('span').hide();
    }

    //当按下ESC时 退出当前弹窗
    $(document).on('keypress', '.escClass', function (e) {
        if (e.which == 0) {
            $._removeMask();//去除遮罩
            $('#' + $(this).attr('id')).remove();
        }
    });

    //头部输入框 点击回车
    $(document).on("keypress", "#header input", function (e) {
        if (e.which == 13)
            toplogin();
    });

    //头部导航登录
    $(document).on("click", "#loginc", function () {
        toplogin();
    });

    //指定登陆角色，isTopLogin=1为顶部登陆方式，否则为弹层登陆方式。
    //return 返回精英角色加密后的字符串，猎头角色默认返回为空。
    function loginByRole(isTopLogin) {
        var strPage = window.location.pathname.toLowerCase();
        if (isTopLogin != 1 || typeof isTopLogin == "undefined") {
            //找Case、casedetail.php、spy/spyinfo.php弹层登陆模式，登陆前需指定为精英角色
            if (strPage.indexOf("/common/casedetail.php") == 0 || strPage.indexOf("/spy/spyinfo.php") == 0) {
                return '0pOjlJmZ0w=='; //manager精英角色加密后的字符串：0pOjlJmZ0w==
            }
        }
        return '';                    //spy猎头角色加密后的字符串：2KKu
    }

    //头部登录
    function toplogin() {
        var loginname = $._trim($('#username').val());              //用户名
        var loginpassword = $('#userpwd').val();                    //密码
        var randomCode = $._trim($('#randomCode').val());           //验证码
        var checkbox = $("#autoLogin").attr("checked") ? 1 : "";    //自动登录
        var loginrole = $._trim($('body').attr("loginRole"));       //指定登陆角色 modify by ziheng.guo 2015-8-26
        var params = {
            username: loginname,
            userpwd: loginpassword,
            islayer: 0,
            checked: checkbox,
            randomcode: randomCode,
            role: loginrole
        }

        if (loginname == '' || loginpassword == '') {
            loginLayer(null, null, null, loginname, loginpassword, '1', '用户名、密码不能为空');
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
                loginLayer(null, null, null, loginname, loginpassword, '1', '系统忙，请稍后再试');
            }
        });
    }
    //===========================end 头部导航登录框=========================

    //当前用户类型spy|manager
    var usertype = $._cookie("LoginRole").split("=").pop();

    //登录弹窗函数
    window.loginLayer = function (callback, roleadd, roleaddname, loginname, loginpassword, errtype, errmsg) {
        if (typeof roleadd == "undefined") {
            roleadd = loginByRole(0);
        }
        closeLoginOrRegister($('#register')); //删除注册弹窗
        var str = "",
                loginname = loginname || "",
                loginpassword = loginname ? loginpassword : "",
                roleaddname = roleaddname, //角色来源 当有值时是新增角色
                roleadd = roleadd || "", //要去的角色信息 明文spy 是要添加猎头账号  MANAGER 是要登录精英
                checkboxtext = $("#autoLogin").attr("checked") ? 'checked=""' : "";

        var loginLayerObj = $('<div id="loginLayer" style="z-index: 10000" class="i-model-login"></div>');
        str += '<div class="inner"><div class="i-login-main"><a class="w_close w_close_ie closeBtn"></a><h4>无忧精英</h4>';
        str += '<div id="fadent"></div><div class="inner"><div class="i-login-con">';
        str += '<div class="inner"><div class=" f14 font_b" >登录</div><div class="hr10"></div>';
        str += '<div class="popupInput inputdiv"><div id="loginusername" class="point-out" style="left: 0px; top: -29px; display: none;">';
        str += '</div><input id="usernames" maxlength="100" value="' + (roleaddname ? $._html2Entity(roleaddname) : $._html2Entity(loginname)) + '" class="input input-lg" style="width:302px;padding:10px;" type="text"/>';
        str += '<span' + (loginname || roleaddname ? ' style=" display: none;"' : "") + ' class="popupInputText" style="padding-left: 1px;" >邮箱/手机/用户名/51job账号</span>';
        str += '</div><div class="hr10"></div><div style="position:static;float:right;"><a class="repassword"  >忘记密码?</a></div>';
        str += '<div style="clear:both;"></div><div class="popupInput inputdiv"><div style="position:relative">';
        str += '<div id="loginpasswordnt" class="point-out" style="left: 0px; top: -29px; display: none;"></div>';
        str += '<input id="passwords" value="' + loginpassword + '" type="password" maxlength="20" class="input input-lg" style="width:302px;padding:10px;" />';
        str += '<span ' + (loginpassword ? ' style=" display: none;"' : "") + ' class="popupInputText" style="padding-left: 1px;" >密码</span></div></div>';
        str += '<div class="hr10"></div><div id="codediv"></div>';
        str += '<div class="hr10"></div><input ' + checkboxtext + ' type="checkbox" style="width:13px;" />下次自动登录<div class="hr20"></div>';
        str += '<div class="i-btn-box"><a class="btn btn-primary btn-lg loginBtn" >登录</a><a class="i-dl-zcdoor registerUser">还没有账号？立即注册</a></div>';
        str += '</div></div></div></div></div>';
        loginLayerObj.html(str).appendTo('body')._alignCenter(); //显示弹窗并居中
        hasVCode(errtype, errmsg); //判断有无验证码
        loginLayerObj.find("a.closeBtn").bind("click", function () {
            closeLoginOrRegister(loginLayerObj)
        }); //关闭登录弹窗
        loginLayerObj.find("a.loginBtn").bind("click", function () {
            loginSubmit(roleadd);
        }); //绑定登录事件
        loginLayerObj.find("input").bind("keypress", function (e) {
            if (e.which == 13)
                loginSubmit(roleadd);
        }); //绑定登录事件
        loginLayerObj.find("a.registerUser").bind("click", function () {
            register(usertype)
        }); //注册
        loginLayerObj.find("#usernames").bind("focus", function () {
            $("#loginusername").hide()
        }); //用户名获取焦点事件
        loginLayerObj.find("#passwords").bind("focus", function () {
            $("#loginpasswordnt").hide()
        }); //密码获取焦点事件
    };
    //新增角色登录弹窗
    window.loginrole = function (roleadd, roleaddname) {
        closeLoginOrRegister($('#register')); //删除注册弹窗
        var loginRoleObj = $('<div id="loginLayer" style="z-index: 10000" class="i-model-login"></div>');
        var str = '<div class="inner"><div class="i-login-main"><h4>无忧精英</h4><a class="w_close w_close_ie closeBtn"></a>';
        str += '<div id="addrolent" ></div><div class="inner"><div class="i-login-con"><div class="inner">';
        str += '<div class=" f14 font_b" >新建猎头角色</div><div class="hr10"></div><div class="f12">';
        str += '您的精英帐号是：<span>' + roleaddname + '</span></div><div class="hr20"></div>';
        str += '<div class="popupInput inputdiv"><div class="lost-password" style=" top:-22px; right:6px"><a class="repassword" href="' + webServerPath + '/common/forgetpassword.php">忘记密码？</a></div>';
        str += '<div style="position:relative"><div id="loginpasswordnt" class="point-out" style="left: 0px; top: -29px; display: none;"></div>';
        str += '<input maxlength="20" id="passwords" value="" type="password" style="width:302px;padding:10px;" class="input input-lg" />';
        str += '<span class="popupInputText" style="padding-left: 1px;" >密码</span></div></div><div class="hr20"></div><div id="codediv">';
        //该AJAX用于判断是否有验证码
        $.ajax({
            type: 'POST',
            url: webServerPath + '/common/verifycode.php?act=hasVCode&type=3',
            dataType: 'json',
            success: function (msg) {
                if (msg.status == '101') {
                    str += '<div class="popupInput"><div class="popupInput inputdiv"><div id="logincodent" class="point-out" style="left: 0px; top: -29px; display: none;"></div><input type="text" maxlength="4" style=" width:122px; padding:10px;" id="logincode" class="input input-lg" /><span class="popupInputText">验证码</span>&nbsp;';
                    str += '<img id="imgcode" width="122" height="42" class="i-yzm" title="点击刷新" src="' + webServerPath + '/common/verifycode.php?type=3&a="' + Math.random() + '" /> ';
                    str += '<a id="codeclick" style="text-decoration:none;" class="i-changeyzm">换一张</a> </div></div>';
                }
                str += '</div><div class="hr20"></div><div class="i-btn-box"><a id="loginroles" class="i-dl-btn">登录</a><a id="add" class="i-dl-zcdoor">还没有账号？立即注册</a></div></div></div></div></div></div>'
                if (msg.status == '101') {
                    $('#fadent').addClass('alert alert-error').html('<i class="icon-tips-error"></i>您最近一个小时内输入密码错误次数过多，需要输入验证码。');
                    scode($("#imgcode"), 3);
                }
                loginRoleObj.html(str).appendTo('body')._alignCenter();
                loginRoleObj.find("#add").bind("click", function () {
                    register(usertype)
                });
                loginRoleObj.find("#loginroles").bind("click", function () {
                    loginroleuser(roleadd, roleaddname)
                }); //绑定登录事件
                loginRoleObj.find("#passwords").bind("focus", function () {
                    $("#loginpasswordnt").hide()
                }); //密码获取焦点事件
                loginRoleObj.find("a.closeBtn").bind("click", function () {
                    closeLoginOrRegister(loginRoleObj)
                }); //关闭弹窗
                loginRoleObj.find("#codeclick").bind("click", function () {
                    scode($("#imgcode"), 3)
                }); //获取验证码
            }
        });
    };

    //新增角色登录验证
    function loginroleuser(loginrole, roleaddname) {
        $("#email_submit").attr("class", "btn disabled btn-lg");
        $("#email_submit").attr("id", "email_submit_disabled");
        var loginpassword = $('#passwords').val();  //获取登录密码
        if (!checkLoginPassword(loginpassword))
            return false; //检查密码是否为空
        //判断是否出现验证码
        var logincode = $('#logincode');
        if (logincode[0]) {
            if (logincode.val() == '') {
                $('.point-out').hide();
                $("#logincodent").html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>验证码不能为空</span>').show();
                return false;
            }
        }
        var randomCode = $._trim($('#randomCode').val()); //验证码
        if (loginrole == '') {
            loginrole = $._trim($('body').attr("loginRole")); //指定登陆角色 modify by ziheng.guo 2015-8-26
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
                var userType = data['userType'];     //获取用户信息
                switch (data.status) {
                    case '100':                     //当登录成功时
                        loginSuccess(data);
                        break;
                    case '101'://该账号已在其他地方或浏览器登录
                        loginOffline(data.pageurl);
                        break;
                    case '200':
                        if (data.errType == '28') {
                            $('.point-out').hide();
                            $('#addrolent').addClass('alert alert-error').html('<i class="icon-tips-error"></i>您的账户已被锁定，请 <a class="txt-link repassword">找回登录密码</a> 后登录').show();
                        } else {
                            $('.point-out').hide();
                            $("#loginpasswordnt").html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>' + data.msg + '</span>').show();
                        }
                        break;
                    case '201':
                        $('.point-out').hide();
                        $('#codediv').html('<div><div class="popupInput inputdiv"><div id="logincodent" class="point-out" style="left: 0px; top: -29px; "><span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>' + data.msg + '</span></div><input type="text" style=" width:122px;padding;10px;" maxlength="4" id="logincode" class="input input-lg" /><span class="popupInputText">验证码</span>&nbsp;<img id="imgcode" width="122" height="42" class="i-yzm" title="点击刷新" src="' + webServerPath + '/common/verifycode.php?type=3&a=' + Math.random() + '"/><a id="codeclick" style="text-decoration:none;" class="i-changeyzm">换一张</a> </div></div>');
                        break;
                    case '202'://当用户密码发生泄漏时触发
                        danger();
                        break;
                    case '203':
                        $('.point-out').hide();
                        $("#loginpasswordnt").html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>' + data.msg + '</span>').show();
                        break;
                    case '204'://当用户被锁定
                        loginLayer(null, null, null, roleaddname, loginpassword, '1', data.msg);
                        break;
                }
            },
            error: function () {
                $('.point-out').hide();
                $("#loginusername").html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i>系统忙，请稍后再试</span>').show();
            }
        });
    }
    //立即认证手机
    function showMobileAuth() {
       var  role = $("#Message").attr('role');
       var isshowMobileAuth=$._urlParams('isshowMobileAuth');
      
       if(isshowMobileAuth!=1){
           return;
       }
        var str = '<div class="operate1">';
        str += '<div class="panel-head2" id="mobileAuthHeader"><span> <img src="' + webServerPath + '/images/mobileauth/rz-att.png"/></span><p>注意</p><a class="icon-panelclose trans-50"></a></div>';
        str += '<div class="content-body"><div class="form"><p>您的帐号已解除原有手机认证，请完善帐号手机信息。</p></div>';
        if (role == 'spy') {
            str += '<div class="panel-bouttn"><a class="btn-w " target="_blank" href="' + webServerPath + '/spy/spyauth.php?iscardedit=2">  立即认证  </a>';
        } else if (role == 'manager') {
//            str += '<div class="panel-bouttn"><a class="btn-w " target="_blank" href="' + webServerPath + '/manager/managerprofile.php?isprofileedit=2">  立即认证  </a>';
            //modify by:zhumingming     2016-05-10  精英个人中心改版
            str += '<div class="panel-bouttn"><a class="btn-w " target="_blank" href="' + webServerPath + '/manager/mgrcenter.php?tabid=contactLogin&mod=1&isprofileedit=2">  立即认证  </a>';
        }
        str += '<a class=" btn-w btn-cancle cancle"> &nbsp; &nbsp;取 消 &nbsp &nbsp;</a></div>';
        str += '</div></div>';
        $('<div style="position:absolute;z-index:10000;" id="mobileAuthDiv"></div>').appendTo('body');
        $("#mobileAuthDiv").html(str);
        $("#mobileAuthDiv")._alignCenter()._dragHandle($("#mobileAuthHeader"));
    }

//立即认证关闭事件
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