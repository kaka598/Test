var _tkd = _tkd || [];
var userInfo = userInfo || '';

/**
 * 记录用户基本信息
 * @param {int} userId          注册用户唯一标示的ID号，非注册用户为空
 * @param {string} userType     用户类型，1：经理人，2：猎头, 3:匿名用户
 * @param {string} cookieId     用户cookie id，用于指定唯一用户，便于统计匿名用户
 * @param {string} cilentIP     客户端IP
 * @param {int} diviceType      设备类型  1：web访问
 * @param {int} version         版本号
 * @returns {undefined}
 */
function setUserInfo(userId, userRole, cookieId, cookieDate, cilentIP, diviceType) {
    //用户id，用户类型，cookidid，客户端ip，设备类型，默认为1—web访问， 版本号
    var userType = (userRole == 'manager') ? 1 : ((userRole == 'spy') ? 2 : 3);
    var webId = 1;      //网站id
    var pushString = 'webId=' + webId;
    pushString += '||uid=' + userId;
    pushString += '||utype=' + userType;
    pushString += '||ckid=' + cookieId;
    pushString += '||ckct=' + cookieDate;
    pushString += '||ip=' + cilentIP;
    pushString += '||devType=' + diviceType;
    userInfo = pushString;
}

/**
 * 推送用户访问信息，每次刷新页面加载
 * @returns {undefined}
 */
function pushUserInfo() {
    _tkd.push(["_trackPageView", userInfo]);
}
/**
 * 推送找精英信息
 * data 参数
 * @returns {undefined}
 */
function pushSearchManager(data) {
    var pushString = userInfo;
    pushString += '||searchType=' + data.type;
    pushString += '||responseTime=' + data.visittime;
    pushString += '||totalCount=' + data.count;
    pushString += '||curPageNum=' + data.curPage;
    pushString += '||searchParam=' + encodeURIComponent(data.sendbuf);
    pushString += '||isCallSE=' + data.callengine;
    pushString += '||callType=' + data.calltype;
    pushString += '||seVersion=' + 2;
    pushString += '||company=' + encodeURIComponent(data.company);
    pushString += '||CompanyDiv=' + encodeURIComponent(data.companydiv);
    pushString += '||CompanyArea=' + encodeURIComponent(data.companyarea);
    _tkd.push(['_trackSearch', 'FoxEngine', pushString]);
}

/**
 * 推送找case信息
 * data 参数
 */
function pushSearchCase(data){
    var pushString = userInfo;
    pushString += '||searchType=' + 1;
    pushString += '||responseTime=' + data.time;
    pushString += '||totalCount=' + data.sum;
    pushString += '||curPageNum=' + data.currPage;
    pushString += '||searchParam=' + encodeURIComponent((data.sendBuf || ''));
    pushString += '||isCallSE=' + data.isEngine;
    pushString += '||callType=' + data.callType;
    pushString += '||seVersion=' + 2;
    _tkd.push(['_trackSearch', 'CaseEngine', pushString]);
}

/**
 * 推送找猎头信息
 * data 参数
 */
function pushSearchSpy(data){
    var pushString = userInfo;
    pushString += '||searchType=' + 1;
    pushString += '||responseTime=' + data.time;
    pushString += '||totalCount=' + data.sum;
    pushString += '||curPageNum=' + data.currPage;
    pushString += '||searchinfo=' + encodeURIComponent(data.seachinfo);
    pushString += '||isCallSE=' + false;
    pushString += '||callType=' + data.callType;
    pushString += '||area=' + data.area;
    _tkd.push(['_trackSearch', 'SpyEngine', pushString]);
}

/**
 * 推送事件日志信息
 * eventype 事件类型
 * recvUid 接收方userid
 * recvUtype接收方用户类型
 * jyUid 精英ID
 * caseid caseid
 * company 来龙去脉公司名
 * auctioId  专场id auctionScore 专场评分 status 报名状态
 * 14精英汇报名（点击完成报名按钮并出现弹框）
 * 15精英汇报名弹框-容我想想
 * 16精英汇报名弹框-决定报名
 */
function pushEvent(eventype,recvUid,recvUtype,jyUid,caseid,company,auctioId,auctionScore,status){
    var pushString = userInfo;
    if(eventype == 15 || eventype == 16 || eventype == 6 || eventype == 7 || eventype == 12 || eventype == 13){ 
        _tkd.push(['_trackEvent',eventype,pushString + '||auctionId=' +auctioId]);
    }else if(eventype == 14){
        _tkd.push(['_trackEvent',eventype,pushString + '||auctionId=' +auctioId + '||auctionScore=' + auctionScore + '||status=' + status]);
    }else if(eventype == 11 || eventype == 10){
        _tkd.push(['_trackEvent',eventype,pushString + '||recvUid=' +recvUid + '||recvUtype=' + recvUtype]);
    }else if(eventype == 9){
        _tkd.push(['_trackEvent',eventype,pushString + '||jyUid=' + jyUid]);
    }else if(eventype == 5){
        _tkd.push(['_trackEvent',eventype,pushString + '||caseId=' + caseid]);
    }else if(eventype == 3){
        _tkd.push(['_trackEvent',eventype,pushString + '||company=' + encodeURIComponent(company)]);
    }else{
        _tkd.push(['_trackEvent',eventype,pushString]);
    }
    
}
