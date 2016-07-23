/* 
 * 活动ACTIVE20150701 免费下载
 * zengmengfei
 */
$(function () {
    role = $("#Message").attr('role');   
    if (typeof (isshowspycenter) != 'undefined' && isshowspycenter == 1 && role == 'spy') {
        spybannerPop(); //猎头角色下的弹窗
    }
    if (typeof (isshowjycenter) != 'undefined' && isshowjycenter == 1 && role == 'manager') {
        jybannerPop(); //精英角色下的弹窗
    }
    if (typeof (isshowunlogincenter) != 'undefined' && isshowunlogincenter == 1 && role != 'spy' && role != 'manager') {
        unloginbannerPop(); //未登录下的弹窗
    }  
});
var index = 1;//显示第几张图片(默认第一张)
//猎头活动弹层
function spybannerPop() {
    var str = '<div id="bannerpop" class="popup-banner" style="position:absolute;z-index:10010">';
    str += '<div class="hdPic">';
    str += '<img class="activity1 activity" src="' + webServerPath + '/images/activity/pic06.png?20160426" width="660" height="490"  />';
    str += '<img class="activity2 activity" src="' + webServerPath + '/images/activity/pic09.png?20160426" width="660" height="490" style="display:none";/>';
    str += '<img class="activity3 activity" src="' + webServerPath + '/images/activity/yearly.png?20160426" width="660" height="490" style="display:none"; />';
    str += '<img class="activity4 activity" src="' + webServerPath + '/images/activity/pic04.jpg?20160426" width="660" height="490" style="display:none" />';
    str += '<a class="icon_hd f-hdp-blue-btn Link link1" target="_blank" href="' + webServerPath + '/common/newspyauth.php" ></a>';  
    str += '<a class="icon_hd f-hdp-blue  Link link2" target="_blank" href="' + webServerPath + '/common/actives/recruitment/recruitment.php?act=summer" style="display:none";></a>';  
    str += '<a class="icon_hd f-hdp-red Link link3" target="_blank" href="' + webServerPath + '/common/actives/recruitment/recruitment.php?act=yearly" style="display:none";></a>';
    str += '<a class="icon_hd hdpicLink_grey Link link4" target="_blank" href="' + webServerPath + '/salon/salonindex.php" style="display:none"></a>';
    str += '<a class="icon_hd icon_hd_close" id="hd_close"></a>';
    str += '<a class="icon_hd icon_hd_l left" style="display:none;"></a>';
    str += '<a class="icon_hd icon_hd_r right"></a>';
    str += '<div class="page_nav_icon" style="position:relative;bottom:30px;">';
    str += '<a class="active circle1 circle" index="1"></a>';
    str += '<a class="circle2 circle" index="2"></a>';
    str += '<a class="circle3 circle" index="3"></a>';
    str += '<a class="circle4 circle" index="4"></a>';
    str += '</div>';
    str += '</div>';
    str += '</div>';

    var spybannerPop = $(str);
    spybannerPop.appendTo("body");
    alignCenter(spybannerPop);
    $('#hd_close').on('click', function () {
        spybannerPop.remove();
        removeMask();
    });
}
//精英角色下的弹窗
function jybannerPop() {
    var str = '<div id="bannerpop" class="popup-banner" style="position:absolute;z-index:10010">';
    str += '<div class="hdPic">';
    str += '<img class="activity1 activity" src="' + webServerPath + '/images/activity/pic11.png?20160606" width="660" height="490"  />';
    str += '<a class="icon_hd f-hdp-blueB Link link1" target="_blank" href="' + webServerPath + '/auction/auctionindex.php" ></a>';  
    str += '<a class="icon_hd icon_hd_close" id="hd_close"></a>';
//    str += '<a class="icon_hd icon_hd_l left" style="display:none;"></a>';
//    str += '<a class="icon_hd icon_hd_r right"></a>';
//    str += '<div class="page_nav_icon" style="position:relative;bottom:30px;">';
//    str += '<a class="active circle1 circle" index="1"></a>';
//    str += '</div>';
    str += '</div>';
    str += '</div>';

    var jybannerPop = $(str);
    jybannerPop.appendTo("body");
    alignCenter(jybannerPop);
    $('#hd_close').on('click', function () {
        jybannerPop.remove();
        removeMask();
    });
}
// 未登录活动弹层
function unloginbannerPop() {
    var str = '<div id="bannerpop" class="popup-banner" style="position:absolute;z-index:10010">';
    str += '<div class="hdPic">';
    str += '<img class="activity1 activity" src="' + webServerPath + '/images/activity/pic11.png?20160606" width="660" height="490"  />';
    str += '<a class="icon_hd f-hdp-blueB Link link1" target="_blank" href="' + webServerPath + '/auction/auctionindex.php" ></a>'; 
    str += '<a class="icon_hd icon_hd_close" id="hd_close"></a>';
//    str += '<a class="icon_hd icon_hd_l left" style="display:none;"></a>';
//    str += '<a class="icon_hd icon_hd_r right"></a>';
//    str += '<div class="page_nav_icon" style="position:relative;bottom:30px;">';
//    str += '<a class="active circle1 circle" index="1"></a>';
//    str += '</div>';
    str += '</div>';
    str += '</div>';

    var unloginbannerPop = $(str);
    unloginbannerPop.appendTo("body");
    alignCenter(unloginbannerPop);
    $('#hd_close').on('click', function () {
        unloginbannerPop.remove();
        removeMask();
    });
}
//点击图片左右按钮
$(document).on('click', '#bannerpop .left,#bannerpop .right', function () {
    if ($(this).hasClass('left')) {
        index = index - 1;
    } else {
        index = index + 1;
    }
    switchPic();
});
//点击图片下方圆点按钮
$(document).on('click', '.circle', function () {
    index = $(this).attr('index');
    switchPic();

});
//图片切换
function switchPic() {
    //显示左右箭头
    if (index < 2) {
        index = 1;
        $('#bannerpop .left').hide();
        $('#bannerpop .right').show();
    } else if (index > 3) {
        index = 4;
        $('#bannerpop .left').show();
        $('#bannerpop .right').hide();
    } else {
        $('#bannerpop .left').show();
        $('#bannerpop .right').show();
    }
    $('.activity').hide();
    $('.activity' + index).show(); //显示第几张图片
    $('.circle').removeClass('active');
    $('.circle' + index).addClass('active'); //选中第几个圆点按钮
    $('.Link').hide();
    $('.link' + index).show(); //选中第几张图片的链接
}

function alignCenter(bannerPop) {
    var l = document.body.scrollLeft + (document.body.clientWidth - bannerPop.width()) / 2; //div宽度
    var t = document.body.scrollTop ?
            (document.documentElement.clientHeight - bannerPop.height()) / 2 + document.body.scrollTop :
            (document.documentElement.clientHeight - bannerPop.height()) / 2 + document.documentElement.scrollTop;
    l = l < 0 ? 100 : l;
    t = t < 0 ? 100 : t;
    bannerPop.css("zIndex") < 10010 ?
            bannerPop.css({left: l + "px", top: t + "px", position: "absolute"}) :
            bannerPop.css({left: l + "px", top: t + "px", zIndex: 10010, position: "absolute"});
    //添加遮罩
    addMask();
}
function addMask() {
    if ($("#freeMask")[0]) {
        $("#freeMaskiframe_id").css("width", document.body.scrollWidth + "px");
        $("#freeMask").show();
        return;
    }
    var mask = $('<div id="freeMask" class="mask"></div>');
    var str = '<div style="width:' + document.body.scrollWidth + 'px;height:' + ($(window).height() > document.body.scrollHeight ? $(window).height() : document.body.scrollHeight) +
            'px;position:absolute;filter:alpha(opacity=50);opacity:0.5;background-color:#000000;top:0px;left:0px;z-index:10009;' +
            '" id="freeMaskiframe_id"></div>';
    mask.html(str).appendTo("body");
}
function removeMask() {
    $("#freeMask").remove();
}
$(window).resize(function () {
    if ($("#freeMask")[0]) {
        addMask();
    }
});