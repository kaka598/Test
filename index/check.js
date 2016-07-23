/**
 * @description    ע�� ��¼ �ֻ� ���� ��֤JS
 * @author          yang.yang
 * @version         1.1
 * @copyright       Copyright (c) 2014, 51job
 * @since           2014-12-02
 */
//==========��ȡ������֤�룬���ֻ���֤�룬����ʱͳһ���ú���=============
var isinerval;
var mobilephonetime = 120;
var emailtime = 10;

//��֤����
function cgeckEmail(value) {
    var result = "";
    if (value == '') {
        result = "���䲻��Ϊ��";
    } else if (RegExpObj.yahooemail(value)) {
        result = '���鲻Ҫʹ���Ż����䣬��������ֹͣ����';
    } else if (RegExpObj.email(value)) {
        result = 100;
    } else {
        result = "�����ʽ����ȷ";
    }
    return result;
}

//��֤�û���
function checkUsername(value) {
    var result = "";
    if (value == '') {
        result = "�û�������Ϊ��";
    } else if (value.length < 4) {
        result = "�û�����������4λ";
    } else if (value.length > 50) {
        result = "�û������Ȳ��ܴ���50λ";
    } else if (!RegExpObj.isCharOrNum(value.substr(0, 1))) {
        result = "�û���������ĸ�������ֿ�ͷ";
    } else if (RegExpObj.loginUserName(value)) {
        result = 100;
    } else {
        result = "�û�����ʽ���淶";
    }
    return result;
}
//��֤�ֻ���
function checkPhone(value) {
    var result = "";
    if (value == '') {
        result = "�ֻ��Ų���Ϊ��";
    } else if (RegExpObj.phone(value)) {
        result = 100;
    } else {
        result = "�ֻ��Ÿ�ʽ����ȷ";
    }
    return result;
}
//��֤�ֻ���ȡ������֤��  register
function checkPhonecode(value) {
    var result = "";
    //δ��ȡ��֤��
    if (value == '') {
        result = '��֤�벻��Ϊ��';
    } else if (value.length < 6) {
        result = '��֤�벻��ȷ';
    } else if (RegExpObj.isNumber(value)) {
        result = 100;
    } else {
        result = '��֤�벻��ȷ';
    }
    return result;
}
//����������ʽ��֤ 
function chkPassword(value) {
    var password = value;
    var result = '';
    if (password == '') {
        result = '���벻��Ϊ��';     //����Ϊ��
    } else if (password.length < 6) {
        result = '���볤�Ȳ�������6';    //���볤��С��6
    } else if (password.length > 16) {
        result = '���볤�Ȳ��ܴ���16';     //���볤�ȴ���16
    } else if (password.indexOf(" ") != -1) {
        result = '�����ﲻ���пո�';     //����ո��ж�
    } else if (pwdGroup(password) > 1) {
        result = 100;     //�����ʽ���Ϲ涨
    } else {
        result = '������ĸ������һ����Ϸ�ʽ���ϣ����ִ�Сд';     //�����ʽ�����Ϲ涨
    }
    return result;
}
//��֤���������Ƿ�����һ��  
function checkPasswordtwo(password1, password2) {
    var msg;
    if (password2 == "") {
        msg = "ȷ�����벻��Ϊ��";
    } else if (password1 != password2) {
        msg = "���벻һ�£�����������";
    } else {
        msg = 100;
    }
    return msg;
}
//��֤��ͨ��֤��
function checkCode(value) {
    var result = '';
    if (value == "") {
        // $('#addcodent').html('<span class="point-box errorbgTop dropdown"><i class="sprite icon_arrow_up2 pa"></i></span>').show();
        result = '��֤�벻��Ϊ��';
    } else if (value.length < 4) {
        result = '��֤�벻��ȷ';
    } else {
        result = 100;
    }
    return result;
}
//����������
function pwdGroup(password) {
    var reg = /\s/;
    var level = 0;
    if (RegExpObj.hasCapital(password)) {
        level = 1;//�д�д��ĸ
    }
    if (RegExpObj.hasLowercase(password)) {
        level = 1;//��Сд��ĸ
    }
    if (RegExpObj.hasNumber(password)) {
        level++;//������
    }
    if (RegExpObj.hasOther(password)) {
        level++;//�������ַ�
    }
    if (reg.exec(password) != null) {
        level = 1;//�пո�
    }
    return level;
}

/**
 * @param string type ��֤������email���䣬phone�ֻ�
 * @param object obj  ��Ҫ�󶨻�ȡ��֤��Ķ���
 * @param function eventFunc �󶨵ĺ���
 * @returns {Boolean}
 */
function getVerifyCode(type, obj, eventFunc) {
    var time, limit, msg;
    if (type == 'email') {
        time = emailtime;
        limit = 10;
        msg = '���·���';
    } else {
        time = mobilephonetime;
        limit = 120;
        msg = '������֤��';
    }
    if (time < 0) {
        type == 'email' ? emailtime = 10 : mobilephonetime = 120;
        clearInterval(isinerval);
        type == 'email' ? obj.attr("class", "").val(msg).css('width', '74px').html(msg).bind("click", eventFunc) : obj.attr("class", "btn").html(msg).bind("click", eventFunc); //�󶨷�����֤��Ĵ����¼�
        return;
    }
    if (type == 'email') {
        obj.attr("class", "btn disabled").css('width', '108px').val(time + "������»�ȡ").html(time + "������»�ȡ");
    } else {
        obj.attr("class", "btn disabled").html(time + "������»�ȡ");
    }
    type == 'email' ? emailtime-- : mobilephonetime--;
}