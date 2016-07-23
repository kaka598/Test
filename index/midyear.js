/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(function () {
    //年中促图片，延时收起函数
    $("#midyear").show();
    $._bottomFix();
    var time = 0;
    delay(time, 5);
});
//s为停止的时间
function delay(time, s) {
    if (time++ < s) {
        setTimeout("delay( " + time + ',' + s + "); ", 1000);
    } else {
        $("#midyear").slideUp('slow');
    }
}