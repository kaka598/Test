/**
 * 点击当前页面选择点击的是一页显示多少条的信息
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
            //刷新当前页面
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

//case附件中的样式问题
if ($('#caseattachpage').length > 0) {
    $('#caseattachpage').css({'float': ''});
}
//精英档案页面的分页样式
if ($('#mgrattachpage').length > 0) {
    $('#mgrattachpage').css({'float': ''});
}

if ($('#mgrmemopage').length > 0) {
    $('#mgrmemopage').css({'float': ''});
}


