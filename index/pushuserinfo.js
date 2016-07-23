var _tkd = _tkd || [];
var userInfo = userInfo || '';

/**
 * ��¼�û�������Ϣ
 * @param {int} userId          ע���û�Ψһ��ʾ��ID�ţ���ע���û�Ϊ��
 * @param {string} userType     �û����ͣ�1�������ˣ�2����ͷ, 3:�����û�
 * @param {string} cookieId     �û�cookie id������ָ��Ψһ�û�������ͳ�������û�
 * @param {string} cilentIP     �ͻ���IP
 * @param {int} diviceType      �豸����  1��web����
 * @param {int} version         �汾��
 * @returns {undefined}
 */
function setUserInfo(userId, userRole, cookieId, cookieDate, cilentIP, diviceType) {
    //�û�id���û����ͣ�cookidid���ͻ���ip���豸���ͣ�Ĭ��Ϊ1��web���ʣ� �汾��
    var userType = (userRole == 'manager') ? 1 : ((userRole == 'spy') ? 2 : 3);
    var webId = 1;      //��վid
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
 * �����û�������Ϣ��ÿ��ˢ��ҳ�����
 * @returns {undefined}
 */
function pushUserInfo() {
    _tkd.push(["_trackPageView", userInfo]);
}
/**
 * �����Ҿ�Ӣ��Ϣ
 * data ����
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
 * ������case��Ϣ
 * data ����
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
 * ��������ͷ��Ϣ
 * data ����
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
 * �����¼���־��Ϣ
 * eventype �¼�����
 * recvUid ���շ�userid
 * recvUtype���շ��û�����
 * jyUid ��ӢID
 * caseid caseid
 * company ����ȥ����˾��
 * auctioId  ר��id auctionScore ר������ status ����״̬
 * 14��Ӣ�㱨���������ɱ�����ť�����ֵ���
 * 15��Ӣ�㱨������-��������
 * 16��Ӣ�㱨������-��������
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
