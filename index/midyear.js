/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(function () {
    //���д�ͼƬ����ʱ������
    $("#midyear").show();
    $._bottomFix();
    var time = 0;
    delay(time, 5);
});
//sΪֹͣ��ʱ��
function delay(time, s) {
    if (time++ < s) {
        setTimeout("delay( " + time + ',' + s + "); ", 1000);
    } else {
        $("#midyear").slideUp('slow');
    }
}