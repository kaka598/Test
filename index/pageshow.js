/**
 * �����ǰҳ��ѡ��������һҳ��ʾ����������Ϣ
 * @param {type} $
 * @returns {undefined}
 */
$(document).on('click', '.everypageshow', function(e) {
    var everypageCurrent = $.trim($(this).html());
    var obj = $(this);
    $.ajax({
        type: 'POST',
        url: webServerPath + '/common/pageshow.php?act=getPageNumber',
        dataType: 'json',
        data: {'pagenumber': everypageCurrent},
        success: function(data) {
            var pageNumber = data.msg;
//            var length = $(".everypageshow").length;
            $(this).removeClass("c_0f82e4");
            //ˢ�µ�ǰҳ��
            obj.parents(".h-lt").siblings('div').find('#goButton input').val(1);
            obj.parents(".h-lt").siblings('div').find('#goButton .search-btn').trigger('click');
            $(this).parents('.h-lt').find("a:contains("+everypageCurrent+")").addClass("c_0f82e4");
//            for (var i = 0; i < length; i++) {
//                var everyPageNumber = $($(".everypageshow")[i]).html();
//                if (parseInt(everyPageNumber) == parseInt(everypageCurrent)) {
//                    $($(".everypageshow")[i]).addClass("c_0f82e4");
//                }
//            }
        }
    });
});

//case�����е���ʽ����
if ($('#caseattachpage').length > 0) {
    $('#caseattachpage').css({'float': ''});
}
//��Ӣ����ҳ��ķ�ҳ��ʽ
if ($('#mgrattachpage').length > 0) {
    $('#mgrattachpage').css({'float': ''});
}

if ($('#mgrmemopage').length > 0) {
    $('#mgrmemopage').css({'float': ''});
}


