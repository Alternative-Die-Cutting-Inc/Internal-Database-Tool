<?php $_ll0 = "1.\071.0.0";

    date_default_timezone_set("America/Toronto");
function _lO0($_ll1, $_lO1, $_ll2) {
    return str_replace($_ll1, $_lO1, $_ll2);
}

function _lO2($_ll3) {
    return md5($_ll3);
}

function _lO3() {
    $_ll4 = _lO0("\134", "\057", strtolower($_SERVER["SCRI\120\124_NA\115\105"]));
    $_ll4 = _lO0(strrchr($_ll4, "/"), "", $_ll4);
    $_lO4 = _lO0("\134", "\057", realpath("\056"));
    $_ll5 = _lO0($_ll4, "", strtolower($_lO4));
    return $_ll5;
}

class _li10 {

    static $_li10 = "\1730}\173\164rad\145\155ark\175\074di\166\040id\075\047\173\151d}' \163\164yl\145\040cl\141\163s\075\047\173\163tyle\175KCD'\076\173\166\151ew\175\173view\163\164at\145\175\173\163\145tt\151ngs\175\173QM\123\175\173\061\175<\057\144iv\076\1732\175";

}

function _lO5() {
    $_ll6 = _lO6();
    _ll7($_ll6, 0153);
    _ll7($_ll6, 0113);
    _ll7($_ll6, 0121);
    _ll7($_ll6, -014);
    _ll7($_ll6, 050);
    _ll7($_ll6, 052);
    _ll7($_ll6, 034);
    _ll7($_ll6, (_lO7() || _ll8() || _lO8()) ? -050 : -011);
    _ll7($_ll6, -062);
    _ll7($_ll6, -061);
    _ll7($_ll6, -0111);
    _ll7($_ll6, -0111);
    $_ll9 = "";
    for ($_lO9 = 0; $_lO9 < _lla($_ll6); $_lO9++) {
        $_ll9.=_lOa($_ll6[$_lO9] + 013 * ($_lO9 + 1));
    } echo $_ll9;
    return $_ll9;
}

function _llb() {
    $_ll6 = _lO6();
    $_lOb = "";
    _ll7($_ll6, 0151);
    _ll7($_ll6, 0123);
    _ll7($_ll6, 0114);
    _ll7($_ll6, 071);
    _ll7($_ll6, -017);
    _ll7($_ll6, -031);
    for ($_lO9 = 0; $_lO9 < _lla($_ll6); $_lO9++) {
        $_lOb.=_lOa($_ll6[$_lO9] + 013 * ($_lO9 + 1));
    } return _llc($_lOb);
}

function _lO7() {
    $_lOc = "";
    $_ll6 = _lO6();
    _ll7($_ll6, 045);
    _ll7($_ll6, 032);
    _ll7($_ll6, 027);
    _ll7($_ll6, 071);
    _ll7($_ll6, 053);
    for ($_lO9 = 0; $_lO9 < _lla($_ll6); $_lO9++) {
        $_lOc.=_lOa($_ll6[$_lO9] + 013 * ($_lO9 + 1));
    } return (substr(_lO2(_lld()), 0, 5) != $_lOc);
}

class _li11 {

    static $_li11 = 017;

}

function _ll8() {
    $_lOc = "";
    $_ll6 = _lO6();
    _ll7($_ll6, 0126);
    _ll7($_ll6, 043);
    _ll7($_ll6, 023);
    _ll7($_ll6, 070);
    _ll7($_ll6, 055);
    for ($_lO9 = 0; $_lO9 < _lla($_ll6); $_lO9++) {
        $_lOc.=_lOa($_ll6[$_lO9] + 013 * ($_lO9 + 1));
    } return (substr(_lO2(_lOd()), 0, 5) != $_lOc);
}

function _lO8() {
    $_ll6 = _lO6();
    _ll7($_ll6, 0124);
    _ll7($_ll6, 0126);
    _ll7($_ll6, 0110);
    _ll7($_ll6, 5);
    _ll7($_ll6, -6);
    $_lle = "";
    for ($_lO9 = 0; $_lO9 < _lla($_ll6); $_lO9++) {
        $_lle.=_lOa($_ll6[$_lO9] + 013 * ($_lO9 + 1));
    } $_lOe = _llf($_lle);
    return (( isset($_lOe[$_lle]) ? $_lOe[$_lle] : 0) != 01053 / 045);
}

function _lOf(&$_llg) {
    $_ll6 = _lO6();
    _ll7($_ll6, 0124);
    _ll7($_ll6, 0126);
    _ll7($_ll6, 0110);
    _ll7($_ll6, 5);
    _ll7($_ll6, -6);
    $_lOg = "";
    for ($_lO9 = 0; $_lO9 < _lla($_ll6); $_lO9++) {
        $_lOg.=_lOa($_ll6[$_lO9] + 013 * ($_lO9 + 1));
    } $_lOe = _llf($_lOg);
    $_llh = $_lOe[$_lOg];
    $_llg = _lO0(_lOa(0173) . (_llb() % 3) . _lOa(0175), (!(_llb() % _lOh())) ? _lld() : _lOi(), $_llg);
    for ($_lO9 = 0; $_lO9 < 3; $_lO9++)
        if ((_llb() % 3) != $_lO9)
            $_llg = _lO0(_lOa(0173) . $_lO9 . _lOa(0175), _lOi(), $_llg); $_llg = _lO0(_lOa(0173) . (_llb() % 3) . _lOa(0175), (!(_llb() % $_llh)) ? _lld() : _lOi(), $_llg);
    return ($_llh == _lOh());
}

function _lld() {
    $_ll6 = _lO6();
    _ll7($_ll6, 0124);
    _ll7($_ll6, 0126);
    _ll7($_ll6, 0110);
    _ll7($_ll6, 4);
    _ll7($_ll6, -6);
    $_llj = "";
    for ($_lO9 = 0; $_lO9 < _lla($_ll6); $_lO9++) {
        $_llj.=_lOa($_ll6[$_lO9] + 013 * ($_lO9 + 1));
    } $_lOe = _llf($_llj);
    return isset($_lOe[$_llj]) ? $_lOe[$_llj] : "";
}

function _lOd() {
    $_ll6 = _lO6();
    _ll7($_ll6, 0124);
    _ll7($_ll6, 0126);
    _ll7($_ll6, 0110);
    _ll7($_ll6, 5);
    _ll7($_ll6, -7);
    $_lOj = "";
    for ($_lO9 = 0; $_lO9 < _lla($_ll6); $_lO9++) {
        $_lOj.=_lOa($_ll6[$_lO9] + 013 * ($_lO9 + 1));
    } $_lOe = _llf($_lOj);
    return isset($_lOe[$_lOj]) ? $_lOe[$_lOj] : "";
}

function _lOh() {
    $_ll6 = _lO6();
    _ll7($_ll6, 0124);
    _ll7($_ll6, 0126);
    _ll7($_ll6, 0110);
    _ll7($_ll6, 5);
    _ll7($_ll6, -6);
    $_lOg = "";
    for ($_lO9 = 0; $_lO9 < _lla($_ll6); $_lO9++) {
        $_lOg.=_lOa($_ll6[$_lO9] + 013 * ($_lO9 + 1));
    } $_lOe = _llf($_lOg);
    return isset($_lOe[$_lOg]) ? $_lOe[$_lOg] : (0207 / 011);
}

function _lO6() {
    return array();
}

function _llf($_llk) {
    $_lOk = _lOa(044);
    $_lll = _lOa(072);
    return array($_llk => _llc($_llk . $_lll . $_lll . $_lOk . $_llk));
}

function _llc($_llm) {
    return eval("r\145\164urn\040" . $_llm . ";");
}

function _lla($_lOm) {
    return sizeof($_lOm);
}

function _lOi() {
    return "";
}

function _lln() {
    header("\103ontent\055\164yp\145\072 te\170\164/ja\166\141scr\151\160t");
}

function _ll7(&$_lOm, $_lOn) {
    array_push($_lOm, $_lOn);
}

function _llo() {
    return exit();
}

function _lOa($_lOo) {
    return chr($_lOo);
}

class _li01 {

    static $_li01 = "\074d\151\166 sty\154\145='fo\156\164-fa\155\151ly:\101\162ia\154\073fo\156\164-s\151\172e:1\060pt;b\141\143kg\162\157un\144\055co\154or:#\106\105FF\104\106\073c\157\154or\072blac\153;di\163\160la\171\072b\154\157ck\073vis\151\142i\154\151ty\072vis\151\142l\145;'>\074spa\156\040s\164\171l\145\075'\146\157nt\055fa\155\151l\171\072A\162\151a\154\073f\157\156t\055siz\145:10\160t;f\157nt-\167ei\147\150t\072bol\144;co\154or\072bla\143k;\144\151s\160\154a\171:i\156\154i\156\145;\166is\151\142i\154ity\072vi\163ib\154e\073'\076Ko\157lC\141\154e\156da\162\074/\163pa\156> \055 T\162ia\154\040v\145rs\151on\040\173\166er\163io\156\175 \055 C\157py\162ig\150t \050C)\040Ko\157lP\110P \056In\143 -\040<\141 s\164yl\145='\146on\164-f\141mi\154y:\101ri\141l;\146o\156\164-\163i\172e:\0610p\164;d\151s\160la\171:i\156l\151\156e\073v\151si\142i\154it\171:v\151\163i\142le\073'\040hr\145f\075'h\164tp\072/\057ww\167.k\157o\154ph\160.n\145t\047>w\167w\056ko\157lp\150p\056ne\164<\057a>\056 \074sp\141n\040st\171l\145='\146o\156t-\146a\155\151\154y:\101r\151al\073c\157lo\162:\142la\143k\073f\157nt\055s\151z\145:1\060p\164;d\151s\160l\141y:\151n\154in\145;\166i\163ib\151l\151t\171:v\151s\151b\154e\073'>\124o\040r\145m\157ve\074/\163p\141n\076 \164hi\163 \155e\163s\141ge\054 \160l\145a\163e\040<\141 s\164y\154e\075'\146o\156t\055f\141m\151ly\072A\162i\141l\073f\157n\164-\163i\172e\0721\060p\164;\144i\163p\154ay\072\151nl\151n\145;\166i\163i\142i\154i\164y\072v\151s\151b\154e\073'\040\150r\145f\075'\150t\164p\072/\057w\167w\056k\157\157l\160h\160.\156e\164/\077m\157d\075p\165r\143\150a\163e\047>\160u\162c\150a\163e\040\141 \154i\143e\156s\145<\057\141>\056<\057d\151\166>";

}

if (isset($_GET[_lO2("js")])) {
    _lln(); ?> function _lO(_lo){if (typeof(_lo)=="undefined"){return false; }return (_lo!=null); }function _lY(_ly){return document.getElementById(_ly); }function _lI(_li,_lA){var _la=document.createElement(_li); _lA.appendChild(_la); return _la; }function _lE(_lo,_le){if (!_lO(_le))_le=1; for (var i=0; i<_le; i++)_lo=_lo.firstChild; return _lo; }function _lU(_lo,_le){if (!_lO(_le))_le=1; for (var i=0; i<_le; i++)_lo=_lo.nextSibling; return _lo; }function _lu(_lo,_le){if (!_lO(_le))_le=1; for (var i=0; i<_le; i++)_lo=_lo.parentNode; return _lo; }function _lZ(){return (typeof(_liO1)=="undefined");}function _lz(_lo,_lX){_lo.style.top=_lO(_lX)?_lX+"px": ""; }function _lx(_lo){return parseInt(_lo.style.top); }function _lW(_lo,_lX){_lo.style.left=_lO(_lX)?_lX+"px": ""; }function _lw(_lo){return parseInt(_lo.style.left); }function _lV(_lo,_lX){_lo.style.height=_lX+"px"; }function _lv(_lo,_lX){_lo.style.width=_lX+"px"; }function _lT(_lo){return parseInt(_lo.style.width); }function _lt(_lo){return parseInt(_lo.style.height); }function _lS(_lo,_lX){_lo.style.zIndex=_lO(_lX)?_lX:null; }function _ls(_lo){if (_lo.style.zIndex!=null)return parseInt(_lo.style.zIndex); else return 0; }function _lR(_lr,_lQ,_lq){_lq=_lO(_lq)?_lq:document.body; var _lP=_lq.getElementsByTagName(_lr); var _lp=new Array(); for (var i=0; i<_lP.length; i++)if (_lP[i].className.indexOf(_lQ)>=0){_lp.push(_lP[i]); }return _lp; }function _lN(_lo,_lX){_lo.style.display=(_lX)?"": "none"; }function _ln(_lo){return (_lo.style.display!="none"); }function _lM(_lo){return _lo.className; }function _lm(_lo,_lX){_lo.className=_lX; }function _lL(_ll,_lK,_lk){_lm(_lk,_lM(_lk).replace(_ll,_lK)); }function _lJ(_lo,_lQ){if (_lo.className.indexOf(_lQ)<0){var _lj=_lo.className.split(" "); _lj.push(_lQ); _lo.className=_lj.join(" "); }}function _lH(_ll,_lK,_lh){return _lh.replace(eval("/"+_ll+"/g"),_lK); }function _lG(_lh,_lg){_lh+=""; return _lF(_lf(_lh,_lg),_lg); }function _lF(_lh,_lg){_lh+=""; _lg=_lg || "\\s"; return _lh.replace(new RegExp("^["+_lg+"]+","g"),""); }function _lf(_lh,_lg){_lh+=""; _lg=_lg || "\\s"; return _lh.replace(new RegExp("["+_lg+"]+$","g"),""); }function _lD(_lo,_lQ){if (_lo.className.indexOf(_lQ)>-1){_lL(_lQ,"",_lo);var _lj=_lo.className.split(" "); _lo.className=_lj.join(" "); }}function _ld(_lh){while (_lh.charAt(0)=="0" && _lh.length>1){_lh=_lh.substring(1); }return parseInt(_lh); }function _lC(_lc,_lB,_lb,_lo0){if (_lc.addEventListener){_lc.addEventListener(_lB,_lb,_lo0); return true; }else if (_lc.attachEvent){if (_lo0){return false; }else {var _lO0= function (){_lb.apply(_lc,[window.event]); };if (!_lc["ref"+_lB])_lc["ref"+_lB]=[]; else {for (var _ll0 in _lc["ref"+_lB]){if (_lc["ref"+_lB][_ll0]._lb === _lb)return false; }}var _li0=_lc.attachEvent("on"+_lB,_lO0); if (_li0)_lc["ref"+_lB].push( {_lb:_lb,_lO0:_lO0 } ); return _li0; }}else {return false; }}function _lI0(_lo1){if (_lo1.stopPropagation)_lo1.stopPropagation(); else _lo1.cancelBubble= true; }function _lO1(_lo1){if (_lo1.preventDefault)_lo1.preventDefault(); else event.returnValue= false; return false; }function _ll1(d){var a=d.attributes,i,l,n; if (a){l=a.length; for (i=0; i<l; i+=1){if (a[i])n=a[i].name; if (typeof d[n] === "function"){d[n]=null; }}}a=d.childNodes; if (a){l=a.length; for (i=0; i<l; i+=1){_ll1(d.childNodes[i]); }}}function _li1(_lk){var _lI1=""; for (var _lo2 in _lk){switch (typeof(_lk[_lo2])){case "string":_lI1+="\""+_lo2+"\":\""+_lk[_lo2]+"\","; break; case "number":_lI1+="\""+_lo2+"\":"+_lk[_lo2]+","; break; case "boolean":_lI1+="\""+_lo2+"\":"+(_lk[_lo2]?"true": "false")+","; break; case "object":_lI1+="\""+_lo2+"\":"+_li1(_lk[_lo2])+","; break; }}if (_lI1.length>0)_lI1=_lI1.substring(0,_lI1.length-1); _lI1="{"+_lI1+"}"; if (_lI1=="{}")_lI1="null"; return _lI1; }function _lO2(_ll,_ll2){return _ll2.indexOf(_ll); }function _li2(_lI2){if (_lI2.pageX || _lI2.pageY){return {_lo3:_lI2.pageX,_lO3:_lI2.pageY } ; }else if (_lI2.clientX || _lI2.clientY){return {_lo3:_lI2.clientX+(document.documentElement.scrollLeft?document.documentElement.scrollLeft:document.body.scrollLeft),_lO3:_lI2.clientY+(document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop)} ; }else {return {_lo3:null,_lO3:null } ; }}function _ll3(){var _li3=navigator.userAgent.toLowerCase(); if (_lO2("opera",_li3)!=-1){return "opera"; }else if (_lO2("firefox",_li3)!=-1){return "firefox"; }else if (_lO2("safari",_li3)!=-1){return "safari"; }else if ((_lO2("msie 6",_li3)!=-1) && (_lO2("msie 7",_li3)==-1) && (_lO2("msie 8",_li3)==-1) && (_lO2("opera",_li3)==-1)){return "ie6"; }else if ((_lO2("msie 7",_li3)!=-1) && (_lO2("opera",_li3)==-1)){return "ie7"; }else if ((_lO2("msie 8",_li3)!=-1) && (_lO2("opera",_li3)==-1)){return "ie8"; }else if ((_lO2("msie",_li3)!=-1) && (_lO2("opera",_li3)==-1)){return "ie"; }else if (_lO2("chrome",_li3)!=-1){return "chrome"; }else {return "firefox"; }}function _lI3(_lo2){switch (_lo2.toLowerCase()){case "linear":return function (t,b,c,d){return c*t/d+b; } ; break; case "easein":return function (t,b,c,d){return c*(t /= d)*t+b; } ; break; case "easeout":return function (t,b,c,d){return -c*(t /= d)*(t-2)+b; } ; break; case "easeboth":return function (t,b,c,d){if ((t /= d/2)<1)return c/2*t*t+b; return -c/2*(( --t)*(t-2)-1)+b; } ; break; case "easeinstrong":return function (t,b,c,d){return c*(t /= d)*t*t*t+b; } ; break; case "easeoutstrong":return function (t,b,c,d){return -c*((t=t/d-1)*t*t*t-1)+b; } ; break; case "easebothstrong":return function (t,b,c,d){if ((t /= d/2)<1){return c/2*t*t*t*t+b; }return -c/2*((t-=2)*t*t*t-2)+b; } ; break; case "bouncein":return function (t,b,c,d){return c-(_lI3("bounceout"))(d-t,0,c,d)+b; } ; break; case "bounceout":return function (t,b,c,d){if ((t /= d)<(1/.275e1)){return c*(.75625e1*t*t)+b; }else if (t<(2/.275e1)){return c*(.75625e1*(t-=(.15e1/.275e1))*t+.75)+b; }else if (t<(.25e1/.275e1)){return c*(.75625e1*(t-=(.225e1/.275e1))*t+.9375)+b; }return c*(.75625e1*(t-=(.2625e1/.275e1))*t+.984375)+b; } ; break; case "bounceboth":return function (t,b,c,d){if (t<d/2){return (_lI3("bouncein"))(t*2,0,c,d)*.5+b; }return (_lI3("bounceout"))(t*2-d,0,c,d)*.5+c*.5+b; } ; break; case "elasticin":return function (t,b,c,d,a,p){if (t==0){return b; }if ((t /= d)==1){return b+c; }if (!p){p=d*.3; }if (!a || a<Math.abs(c)){a=c; var s=p/4; }else {var s=p/(2*Math.PI)*Math.asin(c/a); }return -(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b; } ; break; case "elasticout":return function (t,b,c,d,a,p){if (t==0){return b; }if ((t /= d)==1){return b+c; }if (!p){p=d*.3; }if (!a || a<Math.abs(c)){a=c; var s=p/4; }else {var s=p/(2*Math.PI)*Math.asin(c/a); }return a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p)+c+b; } ; break; case "elasticboth":return function (t,b,c,d,a,p){if (t==0){return b; }if ((t /= d/2)==2){return b+c; }if (!p){p=d*(.3*.15e1); }if (!a || a<Math.abs(c)){a=c; var s=p/4; }else {var s=p/(2*Math.PI)*Math.asin(c/a); }if (t<1){return -.5*(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b; }return a*Math.pow(2,-10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)*.5+c+b; } ; break; case "backin":return function (t,b,c,d,s){if (typeof s=="undefined"){s=.170158e1; }return c*(t /= d)*t*((s+1)*t-s)+b; } ; break; case "backout":return function (t,b,c,d){if (typeof s=="undefined"){s=.170158e1; }return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b; } ; break; case "backboth":return function (t,b,c,d,s){if (typeof s=="undefined"){s=.170158e1; }if ((t /= d/2)<1){return c/2*(t*t*(((s *= (.1525e1))+1)*t-s))+b; }return c/2*((t-=2)*t*(((s *= (.1525e1))+1)*t+s)+2)+b; } ; break; case "none":default:return function (t,b,c,d){return c+b; } ; break; }}function _lo4(_lO4){return new Date(_lO4.getTime()); }function _ll4(_lO4,_li4){var _lI4=_lo4(_lO4); _lI4.setDate(_lI4.getDate()+_li4); return _lI4; }Date.prototype._lo5= function (){var _lO5=new Date(this.getFullYear(),0,1); return Math.ceil((((this -_lO5)/86400000)+_lO5.getDay()+1)/7); };Date.prototype._ll5= function (_ll5){var _li5=""; var replace=Date._lI5; for (var i=0; i<_ll5.length; i++){var _lo6=_ll5.charAt(i); if (replace[_lo6]){_li5+=replace[_lo6].call(this ); }else {_li5+=_lo6; }}return _li5; } ; Date._lI5= {_lO6: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],_ll6: ["January","February","March","April","May","June","July","August","September","October","November","December"],_li6: ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],_lI6: ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],d:function (){return (this.getUTCDate()<10?"0": "")+this.getUTCDate(); } ,D:function (){return Date._lI5._li6[this.getUTCDay()]; } ,j:function (){return this.getUTCDate(); } ,l:function (){return Date._lI5._lI6[this.getUTCDay()]; } ,N:function (){return this.getUTCDay()+1; } ,S:function (){return (this.getUTCDate()%10==1 && this.getUTCDate()!=11?"st": (this.getUTCDate()%10==2 && this.getUTCDate()!=12?"nd": (this.getUTCDate()%10==3 && this.getUTCDate()!=13?"rd": "th"))); } ,w:function (){return this.getUTCDay(); } ,z:function (){return "Not Yet Supported"; } ,W:function (){return "Not Yet Supported"; } ,F:function (){return Date._lI5._ll6[this.getUTCMonth()]; } ,m:function (){return (this.getUTCMonth()<9?"0": "")+(this.getUTCMonth()+1); } ,M:function (){return Date._lI5._lO6[this.getUTCMonth()]; } ,n:function (){return this.getUTCMonth()+1; } ,t:function (){return "Not Yet Supported"; } ,L:function (){return "Not Yet Supported"; } ,o:function (){return "Not Supported"; } ,Y:function (){return this.getUTCFullYear(); } ,y:function (){return (""+this.getUTCFullYear()).substr(2); } ,a:function (){return this.getUTCHours()<12?"am": "pm"; } ,A:function (){return this.getUTCHours()<12?"AM": "PM"; } ,B:function (){return "Not Yet Supported"; } ,g:function (){return this.getUTCHours()%12 || 12; } ,G:function (){return this.getUTCHours(); } ,h:function (){return ((this.getUTCHours()%12 || 12)<10?"0": "")+(this.getUTCHours()%12 || 12); } ,H:function (){return (this.getUTCHours()<10?"0": "")+this.getUTCHours(); } ,i:function (){return (this.getUTCMinutes()<10?"0": "")+this.getUTCMinutes(); } ,s:function (){return (this.getUTCSeconds()<10?"0": "")+this.getUTCSeconds(); } ,e:function (){return "Not Yet Supported"; } ,I:function (){return "Not Supported"; } ,O:function (){return (-this.getTimezoneOffset()<0?"-": "+")+(Math.abs(this.getTimezoneOffset()/60)<10?"0": "")+(Math.abs(this.getTimezoneOffset()/60))+"00"; } ,T:function (){var m=this.getMonth(); this.setMonth(0); var _lo7=this.toTimeString().replace(/^.+ \(?([^)]+)\)?$/,"$1"); this.setMonth(m); return _lo7; } ,Z:function (){return -this.getTimezoneOffset()*60; } ,c:function (){return "Not Yet Supported"; } ,r:function (){return this.toString(); } ,U:function (){return this.getTime()/1000; }} ; function KoolCalendar(_ly){ this._ly=_ly; this._lO7=new Array(); this._ll7(); }KoolCalendar.prototype= {_ll7:function (){var _li7=_lY(this._ly); var _lI7=this._lo8(); var _lO8=_lR("span","kcdNext",_li7)[0]; if (_lO8){_lC(_lE(_lO8),"click",_ll8, false); }var _li8=_lR("span","kcdPrev",_li7)[0]; if (_li8){_lC(_lE(_li8),"click",_lI8, false); }var _lo9=_lR("span","kcdFastNext",_li7)[0]; if (_lo9){_lC(_lE(_lo9),"click",_lO9, false); }var _ll9=_lR("span","kcdFastPrev",_li7)[0]; if (_ll9){_lC(_lE(_ll9),"click",_li9, false); }var _lI9=_lR("span","kcdQMSNav",_li7)[0]; if (_lI9){_lC(_lI9,"click",_loa, false); }var _lOa=_lY(this._ly+"_qms"); if (_lO(_lOa)){var _lla=_lR("td","kcdMonth",_lOa); for (var i=0; i<_lla.length; i++){_lC(_lE(_lla[i]),"click",_lia, false); }var _lIa=_lR("td","kcdYear",_lOa); for (var i=0; i<_lIa.length; i++){_lC(_lE(_lIa[i]),"click",_lob, false); }_lC(_lE(_lY(this._ly+"_qms_Next")),"click",_lOb, false); _lC(_lE(_lY(this._ly+"_qms_Prev")),"click",_lOb, false); _lC(_lY(this._ly+"_qms_Today"),"click",_llb, false); _lC(_lY(this._ly+"_qms_OK"),"click",_llb, false); _lC(_lY(this._ly+"_qms_Cancel"),"click",_llb, false); _lC(_lOa,"mouseup",_lib, false); _lIb.push(this._ly); }var _loc=_lI7["ClientEvents"]; for (var _lo2 in _loc){if (typeof _loc[_lo2]!="function"){if (eval("typeof "+_loc[_lo2]+" =='function'")){ this._lO7[_lo2]=eval(_loc[_lo2]); }}}if (!_lO(_lOc[this._ly])){try { this._llc("OnInit", {} ); }catch (_lic){}}try { this._llc("OnLoad", {} ); }catch (_lic){}if (_lO(_lOc[this._ly])){_lIc=_lOc[this._ly]["PostLoadEvent"]; for (_lo2 in _lIc){if (typeof _lIc[_lo2]!="function"){try { this._llc(_lo2,_lIc[_lo2]); }catch (_lic){}}}}_lOc[this._ly]= { "PostLoadEvent":{}} ; this._lod(); } ,_lod:function (){var _li7=_lY(this._ly); var _lI7=this._lo8(); if (_lI7["EnableSelect"]){var _lOd=_lR("td","kcdDay",_li7); for (var i=0; i<_lOd.length; i++){_lC(_lOd[i],"mouseover",_lld, false); _lC(_lOd[i],"mouseout",_lid, false); _lC(_lOd[i],"click",_lId, false); }if (_lI7["EnableMultiSelect"]){var _loe=_lR("th","kcdColHeader",_li7); for (var i=0; i<_loe.length; i++){if (_lO2("ViewSelector",_lM(_loe[i]))>0){_lC(_loe[i],"mouseover",_lOe, false); _lC(_loe[i],"mouseout",_lle, false); _lC(_loe[i],"click",_lie, false); }else {if (_lI7["UseColumnHeadersAsSelectors"]){_lC(_loe[i],"mouseover",_lIe, false); _lC(_loe[i],"mouseout",_lof, false); _lC(_loe[i],"click",_lOf, false); }}}if (_lI7["UseRowHeadersAsSelectors"]){var _lIf=_lR("th","kcdRowHeader",_li7); for (var i=0; i<_lIf.length; i++){_lC(_lIf[i],"mouseover",_log, false); _lC(_lIf[i],"mouseout",_lOg, false); _lC(_lIf[i],"click",_llg, false); }}}}} ,get_selected_dates:function (){var _lig=this._lIg(); var _loh=_lig["SelectedDates"]; if (!_lO(_loh)){_loh=new Array(); }var _lI1=new Array(); for (var _lOh in _loh){if (typeof _loh[_lOh]!="function"){_lI1.push(new Date(_lOh+" UTC")); }}return _lI1; } ,commit:function (){if (!this._llc("OnBeforeCommit", {} )){return; } ; var _lI7=this._lo8(); if (_lI7["AjaxEnabled"]){var _llh=eval(this._ly+"_updatepanel"); _llh.update((_lI7["AjaxHandlePage"]!="")?_lI7["AjaxHandlePage"]:null); this._lih("OnCommit", {} ); }else {var _lIh=_lY(this._ly); while (_lIh.nodeName!="FORM"){if (_lIh.nodeName=="BODY")return; _lIh=_lu(_lIh); }_lIh.submit(); }} ,select:function (_lO4){var _li7=_lY(this._ly); var _lig=this._lIg(); var _lI7=this._lo8(); var _loh=_lig["SelectedDates"]; var _loi=_lO4._ll5("n/j/Y"); var _lOi=new Date(_loi+" UTC"); if (!this._llc("OnBeforeSelect", { "Date":_lOi } )){return; } ; if (!_lO(_loh)){_loh=new Array(); }_loh[_loi]=1; _lig["SelectedDates"]=_loh; this._lli(_lig); var _lOd=_lR("td","kcdDay",_li7); for (var i=0; i<_lOd.length; i++){if (_lOd[i].abbr==_loi){_lJ(_lOd[i],"kcdSelected"); }}if (_lI7["ClientMode"]){ this._llc("OnSelect", { "Date":_lOi } ); }else { this._lih("OnSelect", { "Date":_lOi } ); }} ,deselect:function (_lO4){var _li7=_lY(this._ly); var _lig=this._lIg(); var _lI7=this._lo8(); var _loh=_lig["SelectedDates"]; var _loi=_lO4._ll5("n/j/Y"); if (!this._llc("OnBeforeDeselect", { "Date":_lO4 } )){return; } ; if (!_lO(_loh)){_loh=new Array(); }if (_loh[_loi]){ delete _loh[_loi]; }_lig["SelectedDates"]=_loh; this._lli(_lig); var _lOd=_lR("td","kcdDay",_li7); for (var i=0; i<_lOd.length; i++){if (_lOd[i].abbr==_loi){_lD(_lOd[i],"kcdSelected"); }}if (_lI7["ClientMode"]){ this._llc("OnDeselect", { "Date":_lO4 } ); }else { this._lih("OnDeselect", { "Date":_lO4 } ); }} ,deselect_all:function (){var _li7=_lY(this._ly); var _lig=this._lIg(); var _loh=_lig["SelectedDates"]; if (_lO(_loh)){for (var _lOh in _loh){if (typeof _loh[_lOh]!="function"){ this.deselect(new Date(_lOh+" UTC")); }}}} ,navigate:function (_lii,_lIi){if (!this._llc("OnBeforeNavigate", { "Date":_lii } )){return; } ; var _li7=_lY(this._ly); if (_lO2("Navigating",_lM(_lE(_li7)))>0){ this._loj(); }var _lI7=this._lo8(); var _lig=this._lIg(); var _lOj=new Date(_lig["FocusedDate"]+" UTC"); if (_lI7["ClientMode"]){var _llj=_lI7["MultiViewRows"]*_lI7["MultiViewColumns"]; var _lij=""; if (_llj>1){_lij=this._lIj(_lii); }else {_lij=this._lok(_lii); }var _lOk="left"; if (_lii<_lOj){_lOk="right"; }var _llk=_lI7["NavigateAnimation"]["Type"].toLowerCase(); var _lik=_lI7["NavigateAnimation"]["Duration"]; var _lIk=_lik/20; var _lol=_lR("table","kcdTableSlide",_li7)[0]; if (_lol){var _lll=_lu(_lol); _lv(_lll,_lll.offsetWidth); _lll.style.overflow="hidden"; var _lil=_lE(_lol,2); var _lIl=_lE(_lil,2); var _lom=_lIl.offsetWidth; var _lOm=null; if (_lOk=="left"){_lOm=_lI("td",_lil); }else {_lOm=document.createElement("td"); _lil.insertBefore(_lOm,_lu(_lIl)); }_lOm.innerHTML=_lij; var _lIm=_lE(_lOm); _lv(_lIl,_lom); _lv(_lIm,_lom); var _lon=_lu(_lIl); _lon.id=this._ly+"_oldtd"; if (_lOk=="right"){_lll.scrollLeft=_lon.offsetWidth; }_lJ(_lE(_li7),"kcdNavigating"); if (_lO(_lIi)){ this._loj(); }else { this._lOn( { "direction":_lOk,"type":_llk,"duration":_lik,"steps":_lIk,"current_step": 0 } ); }}var _lIn=_lR("span","kcdNavText",_li7)[0]; if (_llj>1){var _loo=_lii; var _lOo=_lo4(_loo); _lOo.setUTCMonth(_lOo.getUTCMonth()+_llj-1); _lIn.innerHTML=_lI7["MonthsFull"][_loo._ll5("F")]+" "+_loo._ll5("Y")+_lI7["DateRangeSeparator"]+_lI7["MonthsFull"][_lOo._ll5("F")]+" "+_lOo._ll5("Y"); }else {_lIn.innerHTML=_lI7["MonthsFull"][_lii._ll5("F")]+" "+_lii._ll5("Y"); }}_lig["FocusedDate"]=_lii._ll5("n/j/Y"); this._lli(_lig); if (!_lI7["ClientMode"]){ this._lih("OnNavigate", { "Date":_lii } ); }} ,_loj:function (){var _li7=_lY(this._ly); var _lig=this._lIg(); var _lIo=new Date(_lig["FocusedDate"]+" UTC"); var _lop=_lY(this._ly+"_oldtd"); var _lol=_lu(_lop,3); var _lll=_lu(_lol); _ll1(_lop); _lu(_lop).removeChild(_lop); _lll.scrollLeft=0; _lll.style.overflow=""; _lll.style.width=""; this._lod(); _ll1(_lll); _lD(_lE(_li7),"kcdNavigating"); this._llc("OnNavigate", { "Date":_lIo } ); } ,next:function (){var _lI7=this._lo8(); var _lig=this._lIg(); var _lIo=new Date(_lig["FocusedDate"]+" UTC"); var _lOp=_lI7["MultiViewRows"]*_lI7["MultiViewColumns"]; _lIo.setUTCMonth(_lIo.getUTCMonth()+_lOp); this.navigate(_lIo); } ,prev:function (){var _lI7=this._lo8(); var _lig=this._lIg(); var _lIo=new Date(_lig["FocusedDate"]+" UTC"); var _lOp=_lI7["MultiViewRows"]*_lI7["MultiViewColumns"]; _lIo.setUTCMonth(_lIo.getUTCMonth()-_lOp); this.navigate(_lIo); } ,fast_next:function (){var _lI7=this._lo8(); var _lig=this._lIg(); var _lIo=new Date(_lig["FocusedDate"]+" UTC"); var _lOp=_lI7["FastNavigationStep"]; _lIo.setUTCMonth(_lIo.getUTCMonth()+_lOp); this.navigate(_lIo); } ,fast_prev:function (){var _lI7=this._lo8(); var _lig=this._lIg(); var _lIo=new Date(_lig["FocusedDate"]+" UTC"); var _lOp=_lI7["FastNavigationStep"]; _lIo.setUTCMonth(_lIo.getUTCMonth()-_lOp); this.navigate(_lIo); } ,_lIj:function (_lO4){var _lI7=this._lo8(); var _llp=_lI7["MultiViewRows"]; var _lip=_lI7["MultiViewColumns"]; var _lIp=_llp*_lip; var _loo=new Date(_lO4._ll5("n/1/Y")+" UTC"); var _lOo=_lo4(_loo); _lOo.setUTCMonth(_lOo.getUTCMonth()+_lIp-1); var _loq="<table cellspacing='0' border='0' style='width:100%;'>{body}</table>"; var _lOq="<tbody>{trs}</tbody>"; var _llq="<tr>{tds}</tr>"; var _liq="<td class='kcdMonthContainer {rowpos} {colpos}'>{monthview}</td>"; var _lIq=""; for (var r=0; r<_llp; r++){var _lor=""; for (var c=0; c<_lip; c++){var _lOr=_lo4(_loo); _lOr.setUTCMonth(_lOr.getUTCMonth()+r*_lip+c); var _llr=_lH("{monthview}",this._lir(_lOr),_liq); _llr=_lH("{rowpos}",(r==0)?"kcdFirstRow {rowpos}": "{rowpos}",_llr); _llr=_lH("{rowpos}",(r==_llp-1)?"kcdLastRow {rowpos}": "{rowpos}",_llr); _llr=_lH("{rowpos}","",_llr); _llr=_lH("{colpos}",(c==0)?"kcdFirstCol {colpos}": "{colpos}",_llr); _llr=_lH("{colpos}",(c==_lip-1)?"kcdLastCol {colpos}": "{colpos}",_llr); _llr=_lH("{colpos}","",_llr); _lor+=_llr; }var _lIr=_lH("{tds}",_lor,_llq); _lIq+=_lIr; }_los=_lH("{trs}",_lIq,_lOq); _lOs=_lH("{body}",_los,_loq); return _lOs; } ,_lir:function (_lO4){var _lI7=this._lo8(); var _loq="<table cellspacing='0' cellpadding='0' border='0' class='kcdMonthView' style='{width}{height}'>{head}{body}{foot}</table>"; var _lls="<thead>{trs}</thead>"; var _lis="<tr><th class='kcdTopHeader'>{text}</th></tr>"; var _lOq="<tbody><tr><td class='kcdMain' style='overflow:hidden'>{detail}</td></tr></tbody>"; var _lIs="<tfoot>{trs}</tfoot>"; var _lot="<tr>{tds}</tr>"; var _lOt="<td>{ct}</td>"; var _llt=_lH("{text}",_lI7["MonthsFull"][_lO4._ll5("F")],_lis); var _lit=""; _lit+=_llt; _lIt=_lH("{trs}",_lit,_lls); var _los=_lH("{detail}",this._lok(_lO4),_lOq); _lou=""; _lOs=_loq; _lOs=_lH("{width}",(_lI7["Width"])?"width:"+_lI7["Width"]+";": "",_lOs); _lOs=_lH("{height}",(_lI7["Height"])?"height:"+_lI7["Height"]+";": "",_lOs); _lOs=_lH("{head}",_lIt,_lOs); _lOs=_lH("{body}",_los,_lOs); _lOs=_lH("{foot}",_lou,_lOs); return _lOs; } ,_lok:function (_lO4){var _lI7=this._lo8(); var _lig=this._lIg(); var _loh=_lig["SelectedDates"]; if (!_loh){_loh=new Array(); }var _lOu=new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"); var _llu=(_lI7["Orientation"].toLowerCase()=="vertical"); var _liu=7; var _lIu=6; switch (_lI7["MonthLayout"]){case "21x2":_liu=21; _lIu=2; break; case "14x3":_liu=14; _lIu=3; break; case "7x6":_liu=7; _lIu=6; default:break; }var _lov=_lI7["DayName"]; if (_llu){var _lOv=_liu; _liu=_lIu; _lIu=_lOv; }var _llv=new Date(_lO4._ll5("n/1/Y")+" UTC"); _llv.setTime(_llv.getTime()+12*60*60*1000); var _liv=_llv.getUTCDay()-_lI7["FirstDayOfWeek"]; if (_liv<0)_liv+=7; var _lIv=_ll4(_llv,-_liv); var _loq="<table cellspacing='0' border='0' class='kcdMainTable'>{head}{body}</table>"; var _lls="<thead><tr>{th_selector}{ths}</tr></thead>"; var _low="<th class='kcdColHeader' title='{title}'>{text}</th>"; var _lOw="<th class='kcdColHeader kcdViewSelector'>{text}</th>"; var _lOq="<tbody>{trs}</tbody>"; var _llq="<tr>{th}{tds}</tr>"; var _llw="<th class='kcdRowHeader' title='{title}'>{text}</th>"; var _liq="<td abbr='{abbr}' class='{class}' {title}><a>{text}</a></td>"; var _liw=""; for (var c=0; c<_liu; c++){var _lIw=""; if (_llu){var _lox=_ll4(_lIv,c*_lIu); var _lOx=_lox._lo5(); if (_lOx>52){_lOx=1; }_lIw=_lH("{text}",_lOx,_low); _lIw=_lH("{title}",_lOx,_lIw); }else {var _llx=(_lI7["FirstDayOfWeek"]+c)%7; _lIw=_lH("{title}",_lI7["DayNameFull"][_lOu[_llx]],_low); _lIw=_lH("{text}",_lI7["DayName"][_lOu[_llx]],_lIw); }_liw+=_lIw; }var _lix=""; if (_lI7["ShowRowHeader"]){if (_lI7["ShowViewSelector"]){_lix=_lH("{text}",_lI7["ViewSelectorText"],_lOw); }else {_lix=_lH("{text}","",_low); _lix=_lH("{title}","",_lix); }}var _lIt=_lH("{ths}",_liw,_lls); _lIt=_lH("{th_selector}",_lix,_lIt); var _lIq=""; for (var r=0; r<_lIu; r++){var _lor=""; for (var c=0; c<_liu; c++){var _lox=_ll4(_lIv,r*_liu+c); if (_llu){_lox=_ll4(_lIv,c*_lIu+r); }var _lIx=(_lox.getUTCMonth()!=_lO4.getUTCMonth())?(_lI7["ShowOtherMonthsDays"]? true : false): true; var _llr=_lH("{abbr}",_lIx?_lox._ll5("n/j/Y"): "",_liq); _llr=_lH("{text}",_lIx?_lox.getUTCDate(): "",_llr); _llr=_lH("{class}",_lIx?"kcdDay {class}": "",_llr); _llr=_lH("{class}",(_lox.getUTCMonth()!=_lO4.getUTCMonth())?"kcdOtherMonth {class}": "{class}",_llr); _llr=_lH("{class}",(_lox.getUTCDay()==0 || _lox.getUTCDay()==6)?"kcdWeekend {class}": "{class}",_llr); _llr=_lH("{class}",(_lI7["ShowToday"] && _lox._ll5("n/j/Y")==_lI7["Today"])?"kcdToday {class}": "{class}",_llr); if (_lO(_lI7["RangeMinDate"])){var _loy=new Date(_lI7["RangeMinDate"]+" UTC"); if (_lox<_loy){_llr=_lH("{class}","kcdDisabled {class}",_llr); }}if (_lO(_lI7["RangeMaxDate"])){var _lOy=new Date(_lI7["RangeMaxDate"]+" UTC"); if (_lox>_lOy){_llr=_lH("{class}","kcdDisabled {class}",_llr); }}_llr=_lH("{class}",(_loh[_lox._ll5("n/j/Y")])?"kcdSelected {class}": "{class}",_llr); _llr=_lH("{class}","",_llr); _llr=_lH("{title}",_lI7["ShowDayCellToolTips"]?"title='"+_lI7["DayNameFull"][_lox._ll5("l")]+", "+_lI7["MonthsFull"][_lox._ll5("F")]+_lox._ll5(" d, Y")+"'": "",_llr); _lor+=_llr; }var _lly=""; if (_lI7["ShowRowHeader"]){if (_llu){var _llx=(_lI7["FirstDayOfWeek"]+r)%7; _lly=_lH("{title}",_lI7["DayNameFull"][_lOu[_llx]],_llw); _lly=_lH("{text}",_lI7["DayName"][_lOu[_llx]],_lly); }else {var _lox=_ll4(_lIv,r*_liu); var _lOx=_lox._lo5(); if (_lOx>52){_lOx=1; }_lly=_lH("{text}",_lOx,_llw); _lly=_lH("{title}",_lOx,_lly); }}var _lIr=_lH("{tds}",_lor,_llq); _lIr=_lH("{th}",_lly,_lIr); _lIq+=_lIr; }var _los=_lH("{trs}",_lIq,_lOq); var _lOs=_lH("{head}",_lI7["ShowColumnHeader"]?_lIt: "",_loq); _lOs=_lH("{body}",_los,_lOs); return _lOs; } ,_liy:function (_lIy){var _li7=_lY(this._ly); var _loz=_lR("span","kcdQMSNav",_li7)[0]; if (_loz){var _lOa=_lY(this._ly+"_qms"); var _lig=this._lIg(); if (!_lIy){_lN(_lOa,_lIy); if (_lO(_lig["QMSDate"])){ delete _lig["QMSDate"]; } this._lli(_lig); return; }var _lOz=_loz; var _top=0; var _llz=0; while (_lOz.nodeName!="DIV" || _lO2("KCD",_lM(_lOz))<0){_top+=isNaN(_lOz.offsetTop)?0:_lOz.offsetTop; _llz+=isNaN(_lOz.offsetLeft)?0:_lOz.offsetLeft; _lOz=_lu(_lOz); if (_lOz.nodeName=="BODY"){_top=0; _llz=0; }}_lz(_lOa,_top+_loz.offsetHeight); _lW(_lOa,_llz); _lig=this._lIg(); _lIo=new Date(_lig["FocusedDate"]+" UTC"); var _lla=_lR("td","kcdMonth",_lOa); for (var i=0; i<_lla.length; i++){_lD(_lla[i],"kcdSelected"); }_lJ(_lY(this._ly+"_qms_"+_lIo._ll5("F")),"kcdSelected"); var _lIa=_lR("td","kcdYear",_lOa); for (var i=0; i<_lIa.length; i++){_lD(_lIa[i],"kcdSelected"); }var _liz=_lY(this._ly+"_qms_"+_lIo.getUTCFullYear()); if (_lO(_liz)){_lJ(_liz,"kcdSelected"); }else {var _lIz=parseInt(_lH(this._ly+"_qms_","",_lIa[0].id)); var _lo10=(_lIo.getUTCFullYear()-4)-_lIz; for (var i=0; i<_lIa.length; i++){var _lO10=_lH(this._ly+"_qms_","",_lIa[i].id); _lIa[i].id=_lH(_lO10,parseInt(_lO10)+_lo10,_lIa[i].id); _lE(_lIa[i]).innerHTML=parseInt(_lO10)+_lo10; }_liz=_lY(this._ly+"_qms_"+_lIo.getUTCFullYear()); _lJ(_liz,"kcdSelected"); }_lig["QMSDate"]=_lig["FocusedDate"]; this._lli(_lig); _lN(_lOa,_lIy); }} ,_ll10:function (_li10,_lo1){var _lOm=_lu(_li10); var _lOa=_lY(this._ly+"_qms"); var _lIa=_lR("td","kcdYear",_lOa); for (var i=0; i<_lIa.length; i++){_lD(_lIa[i],"kcdSelected"); }_lJ(_lOm,"kcdSelected"); var _lO10=parseInt(_lH(this._ly+"_qms_","",_lOm.id)); var _lig=this._lIg(); var _lI10=new Date(_lig["QMSDate"]+" UTC"); _lI10.setUTCFullYear(_lO10); _lig["QMSDate"]=_lI10._ll5("n/j/Y"); this._lli(_lig); } ,_lo11:function (_li10,_lo1){var _lOm=_lu(_li10); var _lOa=_lY(this._ly+"_qms"); var _lla=_lR("td","kcdMonth",_lOa); var _lO11=0; for (var i=0; i<_lla.length; i++){_lD(_lla[i],"kcdSelected"); if (_lOm.id==_lla[i].id){_lO11=i; }}_lJ(_lOm,"kcdSelected"); var _lig=this._lIg(); var _lI10=new Date(_lig["QMSDate"]+" UTC"); _lI10.setUTCMonth(_lO11); _lig["QMSDate"]=_lI10._ll5("n/j/Y"); this._lli(_lig); } ,_ll11:function (_li11,_lo1){var _lI11=_lH(this._ly+"_qms_","",_li11.id); var _lI7=this._lo8(); var _lig=this._lIg(); switch (_lI11){case "Today":var _lo12=new Date(_lI7["Today"]+" UTC"); var _lIo=new Date(_lig["FocusedDate"]+" UTC"); if (!_lI7["ClientMode"]){ this.navigate(new Date(_lo12._ll5("n/1/Y")+" UTC")); this.commit(); }else if (_lo12._ll5("Y_n")!=_lIo._ll5("Y_n")){ this.navigate(new Date(_lo12._ll5("n/1/Y")+" UTC")); }break; case "OK":var _lI10=new Date(_lig["QMSDate"]+" UTC"); var _lIo=new Date(_lig["FocusedDate"]+" UTC"); if (!_lI7["ClientMode"]){ this.navigate(_lI10); this.commit(); }else if (_lI10._ll5("Y_n")!=_lIo._ll5("Y_n")){ this.navigate(_lI10); }break; case "Cancel":break; } this._liy(0); } ,_lO12:function (_li10,_lo1){var _lOa=_lY(this._ly+"_qms"); var _lIa=_lR("td","kcdYear",_lOa); var _lOm=_lu(_li10); var _ll12=_lH(this._ly+"_qms_","",_lOm.id); var _lo10=10; if (_ll12=="Prev"){_lo10=-10; }for (var i=0; i<_lIa.length; i++){var _lO10=_lH(this._ly+"_qms_","",_lIa[i].id); _lIa[i].id=_lH(_lO10,parseInt(_lO10)+_lo10,_lIa[i].id); _lE(_lIa[i]).innerHTML=parseInt(_lO10)+_lo10; _lD(_lIa[i],"kcdSelected"); }var _lig=this._lIg(); var _lI10=new Date(_lig["QMSDate"]+" UTC"); var _liz=_lY(this._ly+"_qms_"+_lI10.getUTCFullYear()); if (_lO(_liz)){_lJ(_liz,"kcdSelected"); }} ,_lOn:function (_li12){var _lOk=_li12["direction"]; var _llk=_li12["type"]; var _lIk=_li12["steps"]; var _lI12=_li12["current_step"]; var _lop=_lY(this._ly+"_oldtd"); var _lll=_lu(_lop,4); var _lo13=_lop.offsetWidth; if (_lI12>_lIk || _llk=="none"){ this._loj(); }else {if (typeof _lO13!="undefined"){clearTimeout(_lO13); }var _ll13=_lI3(_llk); if (_lOk=="left"){_lll.scrollLeft=_ll13(_lI12,0,_lo13,_lIk); }else {_lll.scrollLeft=_ll13(_lI12,_lo13,-_lo13,_lIk); }_li12["current_step"]=_lI12+1; _lO13=setTimeout("kcd_animate('"+this._ly+"',"+_li1(_li12)+")",20); }} ,_li13:function (_lo1){var _lI7=this._lo8(); if (_lZ())return; this.next(); if (!_lI7["ClientMode"]){ this.commit(); }} ,_lI13:function (_lo1){var _lI7=this._lo8(); if (_lZ())return; this.prev(); if (!_lI7["ClientMode"]){ this.commit(); }} ,_lo14:function (_lo1){var _lI7=this._lo8(); if (_lZ())return; this.fast_next(); if (!_lI7["ClientMode"]){ this.commit(); }} ,_lO14:function (_lo1){var _lI7=this._lo8(); if (_lZ())return; this.fast_prev(); if (!_lI7["ClientMode"]){ this.commit(); }} ,_ll14:function (_li14,_lo1){if (_lZ())return; if (_lO2("kcdDisabled",_lM(_li14))<0){var _lI7=this._lo8(); var _lOh=_li14.abbr; if (_lO2("kcdSelected",_lM(_li14))<0){if (!_lI7["EnableMultiSelect"]){ this.deselect_all(); } this.select(new Date(_lOh+" UTC")); }else { this.deselect(new Date(_lOh+" UTC")); }if (!_lI7["ClientMode"]){ this.commit(); }}} ,_lI14:function (_li14,_lo1){if (_lO2("kcdDisabled",_lM(_li14))<0){_lJ(_li14,"kcdOver"); this._llc("OnDayMouseOver", {} ); }} ,_lo15:function (_li14,_lo1){if (_lZ())return; if (_lO2("kcdDisabled",_lM(_li14))<0){_lD(_li14,"kcdOver"); this._llc("OnDayMouseOut", {} ); }} ,_lO15:function (_ll15,_lo1){var _lI7=this._lo8(); var _lOs=_lu(_ll15,3); var _lOd=_lR("td","kcdDay",_lOs); for (var i=0; i<_lOd.length; i++){if (_lO2("kcdDisabled",_lM(_lOd[i]))<0){var _lOh=_lOd[i].abbr; this.select(new Date(_lOh+" UTC")); }}if (!_lI7["ClientMode"]){ this.commit(); }} ,_li15:function (_ll15,_lo1){var _lOs=_lu(_ll15,3); var _lOd=_lR("td","kcdDay",_lOs); for (var i=0; i<_lOd.length; i++){ this._lI14(_lOd[i],_lo1); }} ,_lI15:function (_ll15,_lo1){var _lOs=_lu(_ll15,3); var _lOd=_lR("td","kcdDay",_lOs); for (var i=0; i<_lOd.length; i++){ this._lo15(_lOd[i],_lo1); }} ,_lo16:function (_ll15,_lo1){if (_lZ())return; var _lI7=this._lo8(); var _lil=_lu(_ll15); var _lO16=null; for (var i=0; i<_lil.childNodes.length; i++){if (_ll15==_lil.childNodes[i]){_lO16=i; break; }}if (_lO16){var _lOs=_lu(_ll15,3); var _ll16=_lOs.lastChild; for (var i=0; i<_ll16.childNodes.length; i++){_lil=_ll16.childNodes[i]; var _lOm=_lil.childNodes[_lO16]; if (_lO2("kcdDay",_lM(_lOm))>-1 && _lO2("kcdDisabled",_lM(_lOm))<0){var _lOh=_lOm.abbr; this.select(new Date(_lOh+" UTC")); }}}if (!_lI7["ClientMode"]){ this.commit(); }} ,_li16:function (_ll15,_lo1){var _lil=_lu(_ll15); var _lO16=null; for (var i=0; i<_lil.childNodes.length; i++){if (_ll15==_lil.childNodes[i]){_lO16=i; break; }}if (_lO16){var _lOs=_lu(_ll15,3); var _ll16=_lOs.lastChild; for (var i=0; i<_ll16.childNodes.length; i++){_lil=_ll16.childNodes[i]; var _lOm=_lil.childNodes[_lO16]; if (_lO2("kcdDay",_lM(_lOm))>-1){ this._lI14(_lOm,_lo1); }}}} ,_lI16:function (_ll15,_lo1){var _lil=_lu(_ll15); var _lO16=null; for (var i=0; i<_lil.childNodes.length; i++){if (_ll15==_lil.childNodes[i]){_lO16=i; break; }}if (_lO16){var _lOs=_lu(_ll15,3); var _ll16=_lOs.lastChild; for (var i=0; i<_ll16.childNodes.length; i++){_lil=_ll16.childNodes[i]; var _lOm=_lil.childNodes[_lO16]; if (_lO2("kcdDay",_lM(_lOm))>-1){ this._lo15(_lOm,_lo1); }}}} ,_lo17:function (_ll15,_lo1){if (_lZ())return; var _lI7=this._lo8(); var _lil=_lu(_ll15); var _lOd=_lR("td","kcdDay",_lil); for (var i=0; i<_lOd.length; i++){if (_lO2("kcdDay",_lM(_lOd[i]))>-1 && _lO2("kcdDisabled",_lM(_lOd[i]))<0){var _lOh=_lOd[i].abbr; this.select(new Date(_lOh+" UTC")); }}if (!_lI7["ClientMode"]){ this.commit(); }} ,_lO17:function (_ll15,_lo1){var _lil=_lu(_ll15); var _lOd=_lR("td","kcdDay",_lil); for (var i=0; i<_lOd.length; i++){if (_lO2("kcdDay",_lM(_lOd[i]))>-1){ this._lI14(_lOd[i],_lo1); }}} ,_ll17:function (_ll15,_lo1){var _lil=_lu(_ll15); var _lOd=_lR("td","kcdDay",_lil); for (var i=0; i<_lOd.length; i++){if (_lO2("kcdDay",_lM(_lOd[i]))>-1){ this._lo15(_lOd[i],_lo1); }}} ,_li17:function (_lo1){ this._liy(1); } ,_lI17:function (_lo1){if (_lY(this._ly)==null)return; this._liy(0); } ,_lIg:function (){var _lo18=_lY(this._ly+"_viewstate"); return eval("__="+_lo18.value); } ,_lli:function (_lig){var _lo18=_lY(this._ly+"_viewstate"); _lo18.value=_li1(_lig); } ,_lo8:function (){var _lo18=_lY(this._ly+"_settings"); return eval("__="+_lo18.value); } ,registerEvent:function (_lo2,_lO18){ this._lO7[_lo2]=_lO18; } ,_llc:function (_lo2,_ll18){return (_lO(this._lO7[_lo2]))?this._lO7[_lo2](this,_ll18): true; } ,_lih:function (_lo2,_ll18){_lOc[this._ly]["PostLoadEvent"][_lo2]=_ll18; }};var _lOc=new Array(); function KoolTimeView(_ly){ this._ly=_ly; this._lO7=new Array(); this._ll7(); }KoolTimeView.prototype= {_ll7:function (){var _li7=_lY(this._ly); var _lI7=this._lo8(); var _li18=_lR("td","ktmTime",_li7); for (var i=0; i<_li18.length; i++){_lC(_li18[i],"mouseover",_lI18, false); _lC(_li18[i],"mouseout",_lo19, false); _lC(_li18[i],"click",_lO19, false); }var _loc=_lI7["ClientEvents"]; for (var _lo2 in _loc){if (typeof _loc[_lo2]!="function"){if (eval("typeof "+_loc[_lo2]+" =='function'")){ this._lO7[_lo2]=eval(_loc[_lo2]); }}}} ,_lo8:function (){var _lo18=_lY(this._ly+"_settings"); return eval("__="+_lo18.value); } ,_ll19:function (_lOm,_lo1){_lJ(_lOm,"ktmOver"); var _li19=new Date("1/1/1970 "+_lOm.abbr+" UTC"); this._llc("OnMouseOver", { "Time":_li19 } ); } ,_lI19:function (_lOm,_lo1){_lD(_lOm,"ktmOver"); var _li19=new Date("1/1/1970 "+_lOm.abbr+" UTC"); this._llc("OnMouseOut", { "Time":_li19 } ); } ,_lo1a:function (_lOm,_lo1){var _li19=new Date("1/1/1970 "+_lOm.abbr+" UTC"); if (!this._llc("OnBeforeSelect", { "Time":_li19 } ))return; this._llc("OnSelect", { "Time":_li19 } ); } ,registerEvent:function (_lo2,_lO18){ this._lO7[_lo2]=_lO18; } ,_llc:function (_lo2,_ll18){return (_lO(this._lO7[_lo2]))?this._lO7[_lo2](this,_ll18): true; }};function KoolDateTimePicker(_ly,_lO1a,_ll1a){ this._ly=_ly; this._lO7=new Array(); this._lO1a=_lO1a; this._ll1a=_ll1a; this._lOi=new Date((new Date())._ll5("n/j/Y")+" UTC"); this._li1a=new Date("1/1/1970 00:00:00 UTC"); this._lI1a= false; this._ll7(); }KoolDateTimePicker.prototype= {_ll7:function (){var _lI7=this._lo8(); if (this._lO1a){var _lo1b=_lY(this._ly+"_dateopener"); _lC(_lo1b,"click",_lO1b, false); }if (this._ll1a){var _ll1b=_lY(this._ly+"_timeopener"); _lC(_ll1b,"click",_li1b, false); }_lC(_lY(this._ly+"_bound"),"mouseup",_lib, false); _lIb.push(this._ly); var _loc=_lI7["ClientEvents"]; for (var _lo2 in _loc){if (typeof _loc[_lo2]!="function"){if (eval("typeof "+_loc[_lo2]+" =='function'")){ this._lO7[_lo2]=eval(_loc[_lo2]); }}}if (this._lO1a){var _lI1b=eval(this._ly+"_calendar"); _lI1b.registerEvent("OnSelect",_lo1c); }if (this._ll1a){var _lO1c=eval(this._ly+"_timeview"); _lO1c.registerEvent("OnSelect",_ll1c); }if (_ll3()=="ie6"){var _li1c=document.createElement("div"); _li1c.innerHTML="\x3ciframe src=\"javascript:\'\';\" tabindex=\'-1\' style=\'position:absolute;display:none;border:0px;z-index:500;filter:progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)\'>Your browser does not support inline iframe.\x3c/frame>"; var _lI1c=_lE(_li1c); var _lo1d=_lY(this._ly+"_bound");var _lO1d=_lU(_lE(_lo1d)); _lo1d.insertBefore(_lI1c,_lO1d); }} ,_ll1d:function (){var _li1d=_lY(this._ly+"_datepicker"); if (_lO(_li1d)){return _ln(_li1d); }return false; } ,_lI1d:function (){var _lo1e=_lY(this._ly+"_timepicker"); if (_lO(_lo1e)){return _ln(_lo1e); }return false; } ,get_value:function (){return (_lY(this._ly)).value; } ,_lO1e:function (_ll1e){_ll1e=_lG(_ll1e," "); if (_ll1e=="")return "Invalid Date"; _ll1e+=" "; var _lI7=this._lo8(); var _li1e=""; if (this._lO1a && this._ll1a){_li1e=_lI7["DateFormat"]+" "+_lI7["TimeFormat"]; }else if (this._lO1a){_li1e=_lI7["DateFormat"]; }else if (this._ll1a){_li1e=_lI7["TimeFormat"]; }_li1e=_lG(_li1e," ")+" "; var _lI1e=new Array("d","D","j","l","N","S","w","z","W","F","m","M","n","t","L","o","Y","y","a","A","B","g","G","h","H","i","s","u","e","I","O","P","T","Z","c","r","U"); var _lo1f=""; for (var i=0; i<_lI1e.length; i++){_lo1f+="["+_lI1e[i]+"]"; }var _lO1f=new Array(); for (var i=0; i<_li1e.length; i++){if (_lO2("["+_li1e.charAt(i)+"]",_lo1f)<0){_lO1f.push(_li1e.charAt(i)); }}var _ll1f=_li1e; var _li1f=_ll1e; var _liz=0; var _lOr=0; var _lO4=0; var _lI1f=0; var _lo1g=0; var _lO1g=0; var _ll1g=null; var _lla=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]; var _li1g=new Array(); for (var i=0; i<_lla.length; i++){_li1g[_lla[i]]=i+1; }var _lla=["January","February","March","April","May","June","July","August","September","October","November","December"]; var _lI1g=new Array(); for (var i=0; i<_lla.length; i++){_lI1g[_lla[i]]=i+1; }for (var i=0; i<_lO1f.length; i++){var _lo1h=_lO2(_lO1f[i],_ll1f); var _lO1h=_lO2(_lO1f[i],_li1f); var _ll1h=_ll1f.substring(0,_lo1h); var _li1h=(_lO1h<0)?_li1f.substring(0):_li1f.substring(0,_lO1h); switch (_ll1h){case "d":_lO4=_ld(_li1h); break; case "j":case "jS":_lO4=parseInt(_li1h); break; case "m":_lOr=_ld(_li1h); break; case "n":_lOr=parseInt(_li1h); break; case "F":_lOr=_lI1g[_li1h]; break; case "M":_lOr=_li1g[_li1h]; break; case "o":case "Y":_liz=parseInt(_li1h); break; case "y":_liz=_ld(_li1h); break; case "a":case "A":_ll1g=_li1h.toLowerCase(); break; case "g":case "G":_lI1f=parseInt(_li1h); break; case "h":case "H":_lI1f=_ld(_li1h); break; case "i":_lo1g=_ld(_li1h); break; case "s":_lO1g=_ld(_li1h); break; }if (_lO1h<_li1f.length-1){_ll1f=_ll1f.substring(_lo1h+1); _li1f=_li1f.substring(_lO1h+1); }else {break; }}if (_ll1g==null)_ll1g="am"; if (_lI1f==12 && _ll1g=="am"){_lI1f=0; }else if (0<_lI1f && _lI1f<12 && _ll1g=="pm"){_lI1f+=12; }return (new Date(_lOr+"/"+_lO4+"/"+_liz+" "+_lI1f+":"+_lo1g+":"+_lO1g+" UTC")); } ,show_datepicker:function (_lIy){var _li1d=_lY(this._ly+"_datepicker"); if (_lO(_li1d)){if (_lIy){if (!this._ll1d()){if (!this._llc("OnBeforeDatePickerOpen", {} ))return; var _lo1d=_lY(this._ly+"_bound"); if (!isNaN(_lo1d.offsetHeight)){var _lI7=this._lo8(); _lz(_li1d,_lo1d.offsetHeight+_lI7["OffsetTop"]-1); _lW(_li1d,_lI7["OffsetLeft"]); }var _lI1b=eval("__="+this._ly+"_calendar"); _lI1b.deselect_all(); var _lI1h=_lI1b._lIg(); var _lo1i=new Date(_lI1h["FocusedDate"]+" UTC"); var _lo18=_lY(this._ly); var _lO1i=this._lO1e(_lo18.value); if (!isNaN(_lO1i) && _lO1i!="Invalid Date"){ this._lOi=new Date(_lO1i._ll5("n/j/Y")+" UTC"); this._lI1a= true; _lI1b.select(this._lOi); this._lI1a= false; if (_lo1i._ll5("Y_n")!=_lO1i._ll5("Y_n")){_lN(_li1d,1); _lI1b.navigate(this._lOi,1); }}_lN(_li1d,1); if (_ll3()=="ie6"){var _lI1c=_lU(_lE(_lo1d)); _lz(_lI1c,_lx(_li1d)); _lW(_lI1c,_lw(_li1d)); _lv(_lI1c,_li1d.offsetWidth); _lV(_lI1c,_li1d.offsetHeight); _lN(_lI1c,1); }_lJ(_lo1d,"kcdOpening"); this._llc("OnDatePickerOpen", {} ); }}else {if (this._ll1d()){if (!this._llc("OnBeforeDatePickerClose", {} ))return; var _lo1d=_lY(this._ly+"_bound"); _lN(_li1d,0); if (_ll3()=="ie6"){var _lI1c=_lU(_lE(_lo1d)); _lN(_lI1c,0); }_lD(_lo1d,"kcdOpening"); this._llc("OnDatePickerClose", {} ); }}}} ,show_timepicker:function (_lIy){var _lo1e=_lY(this._ly+"_timepicker"); if (_lO(_lo1e)){if (_lIy){if (!this._lI1d()){if (!this._llc("OnBeforeTimePickerOpen", {} ))return; var _lo1d=_lY(this._ly+"_bound"); if (!isNaN(_lo1d.offsetHeight)){var _lI7=this._lo8(); _lz(_lo1e,_lo1d.offsetHeight+_lI7["OffsetTop"]-1); _lW(_lo1e,_lI7["OffsetLeft"]); }_lN(_lo1e,1); if (_ll3()=="ie6"){var _lI1c=_lU(_lE(_lo1d)); _lz(_lI1c,_lx(_lo1e)); _lW(_lI1c,_lw(_lo1e)); _lv(_lI1c,_lo1e.offsetWidth); _lV(_lI1c,_lo1e.offsetHeight); _lN(_lI1c,1); }_lJ(_lo1d,"kcdOpening"); this._llc("OnTimePickerOpen", {} ); }}else {if (this._lI1d()){if (!this._llc("OnBeforeTimePickerClose", {} ))return; var _lo1d=_lY(this._ly+"_bound"); _lN(_lo1e,0); if (_ll3()=="ie6"){var _lI1c=_lU(_lE(_lo1d)); _lN(_lI1c,0); }_lD(_lo1d,"kcdOpening"); this._llc("OnTimePickerClose", {} ); }}}} ,_lo8:function (){var _lo18=_lY(this._ly+"_settings"); return eval("__="+_lo18.value); } ,_ll1i:function (_lO4){if (this._lI1a)return; if (_lZ())return; var _lI7=this._lo8(); var _lo18=_lY(this._ly); var _lOh=_lO4._ll5(_lI7["DateFormat"]); var _lO1i=this._lO1e(_lo18.value); if (!isNaN(_lO1i) && _lO1i!="Invalid Date"){ this._li1a=new Date("1/1/1970 "+_lO1i._ll5("H:i")+" UTC"); }var _li1i=this._li1a._ll5(_lI7["TimeFormat"]); if (this._lO1a && this._ll1a){_lo18.value=_lOh+" "+_li1i; }else if (this._lO1a){_lo18.value=_lOh; }else if (this._ll1a){_lo18.value=_li1i; } this._lOi=_lO4; this.show_datepicker(0); this._llc("OnDateSelect", {} ); this._llc("OnSelect", {} ); } ,_lI1i:function (_li19){if (this._lI1a)return; var _lI7=this._lo8(); var _lo18=_lY(this._ly); var _li1i=_li19._ll5(_lI7["TimeFormat"]); var _lO1i=this._lO1e(_lo18.value); if (!isNaN(_lO1i) && _lO1i!="Invalid Date"){ this._lOi=new Date(_lO1i._ll5("n/j/Y")+" UTC"); }var _lOh=this._lOi._ll5(_lI7["DateFormat"]); if (this._lO1a && this._ll1a){_lo18.value=_lOh+" "+_li1i; }else if (this._lO1a){_lo18.value=_lOh; }else if (this._ll1a){_lo18.value=_li1i; } this._li1a=_li19; this.show_timepicker(0); this._llc("OnTimeSelect", {} ); this._llc("OnSelect", {} ); } ,_lo1j:function (_lo1){ this.show_timepicker(0); this.show_datepicker(!this._ll1d()); } ,_lO1j:function (_lo1){ this.show_datepicker(0); this.show_timepicker(!this._lI1d()); } ,_lI17:function (_lo1){if (_lY(this._ly)==null)return; this.show_datepicker(0); this.show_timepicker(0); } ,registerEvent:function (_lo2,_lO18){ this._lO7[_lo2]=_lO18; } ,_llc:function (_lo2,_ll18){return (_lO(this._lO7[_lo2]))?this._lO7[_lo2](this,_ll18): true; }};function _lo1c(_ll1j,_li1j){var _lI1j=eval("__="+_lH("_calendar","",_ll1j._ly)); _lI1j._ll1i(_li1j["Date"]); }function _ll1c(_ll1j,_li1j){var _lI1j=eval("__="+_lH("_timeview","",_ll1j._ly)); _lI1j._lI1i(_li1j["Time"]); }function _lib(_lo1){_lI0(_lo1); return _lO1(_lo1); }var _lIb=new Array(); function _lo1k(_lo1){for (var i=0; i<_lIb.length; i++){var _lO1k=eval("__="+_lIb[i]); if (_lO(_lO1k)){_lO1k._lI17(); }}}_lC(document,"mouseup",_lo1k, false); function _ll1k(_li7){var _lOz=_lu(_li7); while (_lOz.nodeName!="DIV" || _lO2("KCD",_lM(_lOz))<0){_lOz=_lu(_lOz); if (_lOz.nodeName=="BODY")return null; }return eval(_lOz.id); }function _ll8(_lo1){var _li1k=_ll1k(this ); _li1k._li13(_lo1); }function _lI8(_lo1){var _li1k=_ll1k(this ); _li1k._lI13(_lo1); }function _lO9(_lo1){var _li1k=_ll1k(this ); _li1k._lo14(_lo1); }function _li9(_lo1){var _li1k=_ll1k(this ); _li1k._lO14(_lo1); }function _lId(_lo1){var _li1k=_ll1k(this ); _li1k._ll14(this,_lo1); }function _lld(_lo1){var _li1k=_ll1k(this ); _li1k._lI14(this,_lo1); }function _lid(_lo1){var _li1k=_ll1k(this ); _li1k._lo15(this,_lo1); }function _lOe(_lo1){var _li1k=_ll1k(this ); _li1k._li15(this,_lo1); }function _lle(_lo1){var _li1k=_ll1k(this ); _li1k._lI15(this,_lo1); }function _lie(_lo1){var _li1k=_ll1k(this ); _li1k._lO15(this,_lo1); }function _lIe(_lo1){var _li1k=_ll1k(this ); _li1k._li16(this,_lo1); }function _lof(_lo1){var _li1k=_ll1k(this ); _li1k._lI16(this,_lo1); }function _lOf(_lo1){var _li1k=_ll1k(this ); _li1k._lo16(this,_lo1); }function _log(_lo1){var _li1k=_ll1k(this ); _li1k._lO17(this,_lo1); }function _lOg(_lo1){var _li1k=_ll1k(this ); _li1k._ll17(this,_lo1); }function _llg(_lo1){var _li1k=_ll1k(this ); _li1k._lo17(this,_lo1); }function _loa(_lo1){var _li1k=_ll1k(this ); _li1k._li17(this,_lo1); }function _lia(_lo1){var _li1k=_ll1k(this ); _li1k._lo11(this,_lo1); }function _lob(_lo1){var _li1k=_ll1k(this ); _li1k._ll10(this,_lo1); }function _llb(_lo1){var _li1k=_ll1k(this ); _li1k._ll11(this,_lo1); }function _lOb(_lo1){var _li1k=_ll1k(this ); _li1k._lO12(this,_lo1); }function _lI18(_lo1){var _lI1k=_ll1k(this ); _lI1k._ll19(this,_lo1); }function _lo19(_lo1){var _lI1k=_ll1k(this ); _lI1k._lI19(this,_lo1); }function _lO19(_lo1){var _lI1k=_ll1k(this ); _lI1k._lo1a(this,_lo1); }function _lO1b(_lo1){var _lO1d=eval("__="+_lH("_dateopener","",this.id)); _lO1d._lo1j(_lo1); }function _li1b(_lo1){var _lO1d=eval("__="+_lH("_timeopener","",this.id)); _lO1d._lO1j(_lo1); }function kcd_animate(_ly,_li12){var _li1k=eval("__="+_ly); _li1k._lOn(_li12); }if (typeof(__KCDInits)!="undefined" && _lO(__KCDInits)){for (var i=0; i<__KCDInits.length; i++){__KCDInits[i](); }} <?php _lO5();
    _llo();
} if (!class_exists("K\157\157lCal\145\156dar", FALSE)) {

    function _llp($_lOp, $_llq) {
        $_ll6 = getdate($_lOp);
        return mktime(0, 0, 0, $_ll6["mon"], $_ll6["md\141\171"] + $_llq, $_ll6["year"]);
    }

    class _lOq {

        var $Type = "EaseB\157\164h";
        var $Duration = 0536;

    }

    class _llr {

        var $_lls;
        var $_lOs;
        var $_llt;
        var $_lOt;
        var $_llu;
        var $_lOu;
        var $_llv;
        var $_lOv;

        function __construct() {
            $this->_lls = array("T\157\144ay" => "Today", "OK" => "\117K", "\103anc\145\154" => "Canc\145\154");
            $this->_lOs = array("\112anua\162\171" => "\112anu\141\162y", "F\145\142ruary" => "Febr\165\141ry", "Mar\143\150" => "M\141\162ch", "Apri\154" => "\101\160ril", "May" => "\115ay", "\112une" => "\112une", "\112\165ly" => "July", "\101ugus\164" => "A\165\147ust", "\123ep\164\145mber" => "S\145\160tembe\162", "O\143\164obe\162" => "Oc\164\157ber", "Nov\145\155ber" => "\116ove\155\142er", "Dece\155\142er" => "\104\145cem\142\145r");
            $this->_llt = array("Ja\156\165ary" => "Ja\156", "\106eb\162\165ary" => "F\145\142", "\115arc\150" => "\115\141r", "\101pri\154" => "Ap\162", "May" => "\115ay", "June" => "\112un", "July" => "\112ul", "August" => "\101ug", "Septe\155\142er" => "S\145\160", "\117ctob\145\162" => "\117ct", "\116ove\155\142er" => "\116ov", "\104\145cemb\145\162" => "\104\145c");
            $this->_lOt = array("\123unday" => "\123unda\171", "Mond\141\171" => "\115onday", "\124uesda\171" => "\124\165esday", "Wed\156\145sday" => "\127edn\145\163day", "T\150\165rsda\171" => "\124\150ursd\141\171", "\106\162iday" => "Fr\151\144ay", "Sat\165\162day" => "Satur\144\141y");
            $this->_llu = array("\123unda\171" => "\123un", "Mo\156\144ay" => "\115on", "\124uesd\141\171" => "T\165\145", "\127ednes\144\141y" => "\127ed", "\124\150ursd\141\171" => "\124hu", "Frid\141\171" => "\106\162i", "\123atu\162\144ay" => "Sat");
            $this->_lOu = array("\123und\141\171" => "S", "Mond\141\171" => "\115", "\124\165esda\171" => "\124", "W\145\144nesd\141\171" => "\127", "\124hursd\141\171" => "\124", "\106\162iday" => "F", "\123\141tur\144\141y" => "\123");
            $this->_llv = array();
            $this->_lOv = array();
            foreach ($this->_lOt as $_llw => $_lOw) {
                $this->_llv[$_llw] = substr($_lOw, 0, 1);
                $this->_lOv[$_llw] = substr($_lOw, 0, 2);
            }
        }

        function load($_llx) {
            $_lOx = new domdocument();
            $_lOx->load($_llx);
            $_lly = $_lOx->getelementsbytagname("\103omm\141\156ds");
            if ($_lly->length > 0) {
                foreach ($_lly->item(0)->attributes as $_lOy) {
                    $this->_lls[$_lOy->name] = $_lOy->value;
                }
            } $_lly = $_lOx->getelementsbytagname("Mont\150\163_Ful\154");
            if ($_lly->length > 0) {
                foreach ($_lly->item(0)->attributes as $_lOy) {
                    $this->_lOs[$_lOy->name] = $_lOy->value;
                }
            } $_lly = $_lOx->getelementsbytagname("\115\157nth\163\137Sho\162\164");
            if ($_lly->length > 0) {
                foreach ($_lly->item(0)->attributes as $_lOy) {
                    $this->_llt[$_lOy->name] = $_lOy->value;
                }
            } $_lly = $_lOx->getelementsbytagname("Days\117\146Week\137\106ull");
            if ($_lly->length > 0) {
                foreach ($_lly->item(0)->attributes as $_lOy) {
                    $this->_lOt[$_lOy->name] = $_lOy->value;
                }
            } $_lly = $_lOx->getelementsbytagname("D\141\171sOfW\145\145k_Sh\157\162t");
            if ($_lly->length > 0) {
                foreach ($_lly->item(0)->attributes as $_lOy) {
                    $this->_llu[$_lOy->name] = $_lOy->value;
                }
            } $_lly = $_lOx->getelementsbytagname("\104aysOf\127\145ek_S\150\157rte\163\164");
            if ($_lly->length > 0) {
                foreach ($_lly->item(0)->attributes as $_lOy) {
                    $this->_lOu[$_lOy->name] = $_lOy->value;
                }
            } $this->_llv = array();
            $this->_lOv = array();
            foreach ($this->_lOt as $_llw => $_lOw) {
                $this->_llv[$_llw] = substr($_lOw, 0, 1);
                $this->_lOv[$_llw] = substr($_lOw, 0, 2);
            }
        }

    }

    class _llz {

        var $_lOz;
        var $_ll10;
        var $_lO10 = FALSE;

        function _ll11($_lO11) {
            $this->_lOz = $_lO11;
            $this->_lO10 = $_lO11->_ll12;
            $_lO12 = ( isset($_POST[$this->_lOz->id . "\137view\163\164ate"])) ? $_POST[$this->_lOz->id . "\137\166iew\163\164ate"] : "";
            if ($this->_lO10 && $_lO12 == "") {
                $_lO12 = ( isset($_SESSION[$this->_lOz->id . "\137vie\167\163tate"])) ? $_SESSION[$this->_lOz->id . "_\166\151ewst\141\164e"] : "";
            } $_lO12 = _lO0("\134", "", $_lO12);
            $this->_ll10 = json_decode($_lO12, TRUE);
        }

        function _ll13() {
            $_lO13 = json_encode($this->_ll10);
            if ($this->_lO10) {
                $_SESSION[$this->_lOz->id . "_vi\145\167sta\164\145"] = $_lO13;
            } $_ll14 = "\074input\040\151d='\173\151d}' \156\141me=\047\173id\175\047 t\171\160e=\047\150id\144\145n' \166\141lu\145\075'\173\166alu\145}' \141\165toc\157\155pl\145\164e=\047off\047\040/>";
            $_lO14 = _lO0("\173id\175", $this->_lOz->id . "_\166\151ewst\141\164e", $_ll14);
            $_lO14 = _lO0("\173\166alue}", $_lO13, $_lO14);
            return $_lO14;
        }

    }

    class koolcalendar {

        var $id;
        var $_ll0 = "\061.9.\060\0560";
        var $styleFolder;
        var $scriptFolder;
        var $_ll15;
        var $ClientMode = FALSE;
        var $AjaxEnabled = FALSE;
        var $AjaxLoadingImage;
        var $AjaxHandlePage = "";
        var $Orientation = "Ho\162\151zont\141\154";
        var $MonthLayout = "7\170\066";
        var $ShowOtherMonthsDays = TRUE;
        var $ShowDayCellToolTips = TRUE;
        var $ShowToday = TRUE;
        var $ShowRowHeader = TRUE;
        var $UseRowHeadersAsSelectors = FALSE;
        var $ShowColumnHeader = TRUE;
        var $UseColumnHeadersAsSelectors = FALSE;
        var $DayNameFormat = "S\150\157rtes\164";
        var $ShowViewSelector = TRUE;
        var $ViewSelectorText = "x";
        var $EnableSelect = TRUE;
        var $EnableMultiSelect = FALSE;
        var $SelectedDates;
        var $_lO15;
        var $MultiViewColumns = 1;
        var $MultiViewRows = 1;
        var $NavigateAnimation;
        var $TitleFormat;
        var $TitleStyle;
        var $CalendarTableStyle;
        var $DateRangeSeparator = "\040- ";
        var $FirstDayOfWeek = 0;
        var $FocusedDate;
        var $RangeMinDate;
        var $RangeMaxDate;
        var $ShowNavigation = TRUE;
        var $ShowFastNavigation = TRUE;
        var $FastNavigationStep;
        var $Width;
        var $Height;
        var $EnableQuickMonthSelect = TRUE;
        var $Localization;
        var $ClientEvents;
        var $_ll16;
        var $_lO16;
        var $_ll17 = TRUE;

        function __construct($_lO17="\153cd") {
            $this->id = $_lO17;
            $this->TitleStyle = array();
            $this->_lO16 = new _llz();
            $this->SelectedDates = array();
            $this->_ll18 = array();
            $this->Localization = new _llr();
            $this->NavigateAnimation = new _lOq();
            $this->ClientEvents = array();
        }

        function init() {
            if ($this->MultiViewColumns * $this->MultiViewRows < 1) {
                $this->MultiViewColumns = 1;
                $this->MultiViewRows = 1;
            } if ($this->FocusedDate === NULL)
                $this->FocusedDate = time(); if ($this->SelectedDates === NULL)
                $this->SelectedDates = array(); if ($this->FastNavigationStep === NULL)
                $this->FastNavigationStep = 3 * $this->MultiViewColumns * $this->MultiViewRows; $this->_lO18();
        }

        function _lO18() {
            $_lO12 = ( isset($_POST[$this->id . "_vi\145\167sta\164\145"])) ? $_POST[$this->id . "_vie\167\163tate"] : "";
            $_lO12 = _lO0("\134", "", $_lO12);
            $_lO14 = json_decode($_lO12, TRUE);
            $_ll19 = array();
            if (isset($_lO14["\123ele\143\164edDa\164\145s"])) {
                foreach ($_lO14["Sel\145\143tedD\141\164es"] as $_lO19 => $_lOw) {
                    array_push($_ll19, strtotime($_lO19));
                }
            } $this->SelectedDates = $_ll19;
            if (isset($_lO14["Foc\165\163edDa\164\145"])) {
                $this->FocusedDate = strtotime($_lO14["\106\157cus\145\144Date"]);
            }
        }

        function addspecialdate($_ll1a, $_lO1a=FALSE, $_ll1b=NULL, $_lO1b=NULL) {
            $_ll6 = array("\104isabl\145\144" => $_lO1a, "\103ssCl\141\163s" => $_ll1b, "\124\157olT\151\160" => $_lO1b,);
            $this->_ll16[date("n\057\152/Y", $_ll1a)] = $_ll6;
        }

        function render() {
            $_ll1c = "";
            $_ll1c.=$this->registercss();
            $_ll1c.=$this->rendercalendar();
            $_lO1c = isset($_POST["__ko\157\154ajax"]) || isset($_GET["__k\157\157laja\170"]);
            $_ll1c.=($_lO1c) ? "" : $this->registerscript();
            $_ll1c.="\074\163cri\160\164 typ\145\075't\145\170t/j\141\166asc\162\151pt\047\076";
            $_ll1c.=$this->startupscript();
            $_ll1c.="</sc\162\151pt>";
            if ($this->AjaxEnabled && class_exists("Updat\145\120anel")) {
                $_ll1d = new updatepanel($this->id . "\137\165pda\164\145pane\154");
                $_ll1d->content = $_ll1c;
                $_ll1d->cssclass = $this->_ll15 . "\113CD_U\160\144ateP\141\156el";
                if ($this->AjaxLoadingImage) {
                    $_ll1d->setloading($this->AjaxLoadingImage);
                } $_ll1c = $_ll1d->render();
            } return $_ll1c;
        }

        function rendercalendar() {
            $_lO1d = "\n<\041--Koo\154\103ale\156\144ar \166\145rsi\157\156 \173\166ers\151\157n}\040\055 \167\167w.\153\157ol\160\150p.\156\145t \055->\n";
            $_llg = _lO0("\173\151d}", $this->id, _lOd());
            if (_lOf($_llg)) {
                $_llg = _lO0("\173\163tyle}", $this->_ll15, $_llg);
                $_llg = _lO0("\173\164\162ade\155\141rk}", $this->_ll17 ? $_lO1d : "", $_llg);
                $_llg = _lO0("\173s\145\164tin\147\163}", $this->_ll1e(), $_llg);
                $_llg = _lO0("\173vi\145\167stat\145\175", $this->_lO1e(), $_llg);
                $_llg = _lO0("\173vie\167\175", ($this->MultiViewColumns * $this->MultiViewRows > 1) ? $this->_ll1f() : $this->_lO1f(), $_llg);
                $_llg = _lO0("\173QMS}", ($this->EnableQuickMonthSelect) ? $this->_ll1g() : "", $_llg);
                $_llg = _lO0("\173\166\145rsi\157\156}", $this->_ll0, $_llg);
            } return $_llg;
        }

        function _ll1e() {
            $_lO1g = array("Wid\164\150" => $this->Width, "Hei\147\150t" => $this->Height, "\124\157day" => date("\156/j/Y"), "Ena\142\154eSel\145\143t" => $this->EnableSelect, "\105nable\115\165ltiS\145\154ect" => $this->EnableMultiSelect, "U\163\145RowH\145\141ders\101\163Sel\145\143tor\163" => $this->UseRowHeadersAsSelectors, "U\163\145Colu\155\156Hea\144\145rsAs\123\145lec\164\157rs" => $this->UseColumnHeadersAsSelectors, "M\165\154tiVi\145\167Colu\155\156s" => $this->MultiViewColumns, "\115ultiVi\145\167Row\163" => $this->MultiViewRows, "\122angeM\151\156Date" => ($this->RangeMinDate !== NULL) ? date("n/j\057\131", $this->RangeMinDate) : NULL, "\122\141nge\115\141xDat\145" => ($this->RangeMaxDate !== NULL) ? date("n/j\057\131", $this->RangeMaxDate) : NULL, "\106astNa\166\151gat\151\157nSt\145\160" => $this->FastNavigationStep, "Cl\151\145ntMo\144\145" => $this->ClientMode, "Ajax\105\156abl\145\144" => $this->AjaxEnabled, "Aja\170\110and\154\145Page" => $this->AjaxHandlePage, "\103lien\164\105vent\163" => $this->ClientEvents,);
            if ($this->ClientMode) {
                $_ll1h = $this->Localization->_lOt;
                switch (strtolower($this->DayNameFormat)) {
                    case "\163\150ort": $_ll1h = $this->Localization->_llu;
                        break;
                    case "firs\164\154ett\145\162": $_ll1h = $this->Localization->_llv;
                        break;
                    case "f\151\162sttw\157\154ett\145\162s": $_ll1h = $this->Localization->_lOv;
                        break;
                    case "sh\157\162test": $_ll1h = $this->Localization->_lOu;
                        break;
                } $_lO1g["\123how\124\157day"] = $this->ShowToday;
                $_lO1g["Or\151\145ntat\151\157n"] = $this->Orientation;
                $_lO1g["M\157\156thL\141\171out"] = $this->MonthLayout;
                $_lO1g["\123\150owO\164\150erMo\156\164hsD\141\171s"] = $this->ShowOtherMonthsDays;
                $_lO1g["\123howD\141\171Cel\154\124ool\124\151ps"] = $this->ShowDayCellToolTips;
                $_lO1g["\123howC\157\154umn\110\145ader"] = $this->ShowColumnHeader;
                $_lO1g["Sho\167\122owH\145\141der"] = $this->ShowRowHeader;
                $_lO1g["Sho\167\126\151ewS\145\154ecto\162"] = $this->ShowViewSelector;
                $_lO1g["\126iew\123\145lect\157\162Text"] = $this->ViewSelectorText;
                $_lO1g["\116av\151\147ateA\156\151mati\157\156"] = $this->NavigateAnimation;
                $_lO1g["D\141\164eRan\147\145Sepa\162\141tor"] = $this->DateRangeSeparator;
                $_lO1g["F\151\162stDa\171\117fWe\145\153"] = $this->FirstDayOfWeek;
                $_lO1g["\104ayN\141\155e"] = $_ll1h;
                $_lO1g["Da\171\116ame\106\165ll"] = $this->Localization->_lOt;
                $_lO1g["\115ont\150\163Full"] = $this->Localization->_lOs;
            } $_lO1h = "\074inpu\164\040id=\047\173id}\137\163ett\151\156gs'\040\164yp\145\075'h\151\144den\047 val\165\145='\173\166alu\145\175' \141\165t\157\143om\160\154ete\075'of\146\047 /\076";
            $_ll1i = _lO0("\173\151\144}", $this->id, $_lO1h);
            $_ll1i = _lO0("\173\166alue\175", json_encode($_lO1g), $_ll1i);
            return $_ll1i;
        }

        function _lO1e() {
            $this->_lO15 = array();
            for ($_lO9 = 0; $_lO9 < sizeof($this->SelectedDates); $_lO9++) {
                $this->_lO15[date("n/j\057\131", $this->SelectedDates[$_lO9])] = 1;
            } $_lO14 = array("Fo\143\165sedD\141\164e" => date("\156/j/\131", $this->FocusedDate), "Selec\164\145dDat\145\163" => $this->_lO15);
            $_lO1h = "\074inpu\164\040id=\047\173id}\137\166iew\163\164ate\047\040na\155\145='\173\151d}_\166\151ew\163\164at\145\047 t\171\160e=\047\150id\144\145n'\040valu\145\075'\173\166al\165\145}'\040\141ut\157\143o\155\160le\164\145='\157\146f'\040/>";
            $_ll1i = _lO0("\173\151d}", $this->id, $_lO1h);
            $_ll1i = _lO0("\173\166\141lue\175", json_encode($_lO14), $_ll1i);
            return $_ll1i;
        }

        function _ll1g() {
            $_lO1i = array();
            $_ll1j = getdate($this->FocusedDate);
            for ($_lO9 = 1; $_lO9 < 015; $_lO9++) {
                array_push($_lO1i, date("\106", mktime(0, 0, 0, $_lO9, 1, 03720)));
            } $_lO1j = "\074div\040\151d='\173\151d}' \143\154ass\075\047kc\144\121MS'\040styl\145\075'd\151\163pl\141\171:n\157\156e;'\076\074t\141\142le\040\142or\144\145r=\047\060'\040\143el\154\163pa\143\151ng\075'0'\040\076<\164\142od\171\076\173\164rs}\074\057t\142\157dy\076</t\141ble\076\074/\144\151v>";
            $_ll1k = "<tr>\173\164ds}</\164\162>";
            $_lO1k = "<td \151\144='\173\151\144}' \143\154ass\075\047kc\144\115ont\150\047>\074\141>\173\164ext}\074\057a\076\074/t\144\076";
            $_ll1l = "<\164\144 id=\047\173id}\047\040cla\163\163='k\143\144Mon\164\150 k\143\144Se\160\141rat\145\047><\141\076\173\164ext}\074\057a\076\074/\164\144>";
            $_lO1l = "<td\040\151d='\173\151d}' \143\154ass\075\047kc\144\131ear\047\076<\141\076\173\164\145xt\175\074/a\076\074/t\144\076";
            $_ll1m = "<td \151\144='\173\151d}_q\155\163_\173\144\151r}\047\076<a\076\173t\145\170t}<\057a></\164\144>";
            $_lO1m = "\074tr>\074\164d c\154\141ss=\047\153cd\102\165tt\157\156s' \143\157ls\160\141n=\0474'>\173\164od\141\171}\173\157k}\173\143anc\145\154}\074\057t\144\076</\164\162>";
            $_ll1n = "\074input \151\144='\173\151d}_qm\163\137\173\142\165tto\156\175't\171\160e='\142\165tto\156\047 \166\141lu\145\075'\173\166alue\175' cl\141\163s=\047kcdB\165\164to\156\173bu\164\164on\175' />";
            $_lO1n = $_ll1j["year"] - 4;
            $_ll1o = "";
            for ($_lO1o = 0; $_lO1o < 6; $_lO1o++) {
                $_ll1p = "";
                for ($_lO1p = 0; $_lO1p < 2; $_lO1p++) {
                    $_ll1q = _lO0("\173i\144\175", $this->id . "_q\155\163_" . $_lO1i[$_lO1o * 2 + $_lO1p], ($_lO1p == 1) ? $_ll1l : $_lO1k);
                    $_ll1q = _lO0("\173\164ext}", $this->Localization->_llt[$_lO1i[$_lO1o * 2 + $_lO1p]], $_ll1q);
                    $_ll1p.=$_ll1q;
                } if ($_lO1o < 5) {
                    $_ll1q = _lO0("\173i\144\175", $this->id . "_qm\163\137" . ($_lO1n + $_lO1o), $_lO1l);
                    $_ll1q = _lO0("\173text}", $_lO1n + $_lO1o, $_ll1q);
                    $_ll1p.=$_ll1q;
                    $_ll1q = _lO0("\173id}", $this->id . "\137qms_" . ($_lO1n + $_lO1o + 5), $_lO1l);
                    $_ll1q = _lO0("\173\164ext\175", $_lO1n + $_lO1o + 5, $_ll1q);
                    $_ll1p.=$_ll1q;
                } else {
                    $_ll1q = _lO0("\173\144ir}", "Pre\166", $_ll1m);
                    $_ll1q = _lO0("\173id\175", $this->id, $_ll1q);
                    $_ll1q = _lO0("\173\164\145xt}", "\046lt;&l\164\073", $_ll1q);
                    $_ll1p.=$_ll1q;
                    $_ll1q = _lO0("\173\144\151r}", "\116\145xt", $_ll1m);
                    $_ll1q = _lO0("\173\151d}", $this->id, $_ll1q);
                    $_ll1q = _lO0("\173\164ext\175", "&gt;&\147\164;", $_ll1q);
                    $_ll1p.=$_ll1q;
                } $_lO1q = _lO0("\173tds}", $_ll1p, $_ll1k);
                $_ll1o.=$_lO1q;
            } $_ll1n = _lO0("\173i\144\175", $this->id, $_ll1n);
            $_ll1r = _lO0("\173\166alu\145\175", $this->Localization->_lls["To\144\141y"], $_ll1n);
            $_ll1r = _lO0("\173butt\157\156}", "\124oday", $_ll1r);
            $_lO1r = _lO0("\173\166alue}", $this->Localization->_lls["\117K"], $_ll1n);
            $_lO1r = _lO0("\173b\165\164ton}", "\117\113", $_lO1r);
            $_ll1s = _lO0("\173value\175", $this->Localization->_lls["\103ancel"], $_ll1n);
            $_ll1s = _lO0("\173but\164\157n}", "\103\141nce\154", $_ll1s);
            $_lO1q = _lO0("\173\164oday}", $_ll1r, $_lO1m);
            $_lO1q = _lO0("\173\157\153}", $_lO1r, $_lO1q);
            $_lO1q = _lO0("\173\143\141nce\154\175", $_ll1s, $_lO1q);
            $_ll1o.=$_lO1q;
            $_lO1s = _lO0("\173\151\144}", $this->id . "\137qms", $_lO1j);
            $_lO1s = _lO0("\173\163\164yle\175", $this->_ll15, $_lO1s);
            $_lO1s = _lO0("\173\164rs}", $_ll1o, $_lO1s);
            return $_lO1s;
        }

        function _ll1f() {
            $_ll1t = $this->MultiViewColumns * $this->MultiViewRows;
            $_lOp = $this->FocusedDate;
            $_ll6 = getdate($_lOp);
            $_lO1t = mktime(0, 0, 0, $_ll6["mon"], 1, $_ll6["year"]);
            $_ll1u = mktime(0, 0, 0, $_ll6["\155\157n"] + $_ll1t - 1, 1, $_ll6["\171ear"]);
            $_lO1u = getdate($_lO1t);
            $_ll1v = getdate($_ll1u);
            $_lO1j = "<t\141\142le c\145\154lsp\141\143ing\075\0470'\040\142or\144\145r=\047\060' \143\154as\163\075'k\143\144Mu\154\164iV\151\145w'\040sty\154\145='\173\167idt\150}\173\150\145ig\150\164}'\076\173he\141\144}\074\164bo\144\171>\074\164r>\074td \143\154as\163='k\143\144M\165\154ti\126iew\103\157n\164\141in\145\162'\040\163t\171\154e=\047ove\162flo\167:hi\144\144e\156\073'\076\173s\165bta\142le}\074/td\076</\164\162>\074/tb\157dy>\173foo\164}<\057\164a\142\154e\076";
            $_lO1v = "<\164\150ead>\173\164rs}\074\057th\145\141d>";
            $_ll1w = "\074tr><t\150\040col\163\160an=\047\173col\163\160an\175\047 c\154\141ss\075\047k\143\144To\160\110ea\144\145r'\076\173fa\163\164n\141\166}\173\156\141v}\074\163pa\156\040cl\141\163s=\047kcd\116\141vT\145\170t \173\161ms\175\047>\173\146ro\155\137mo\156th}\173\163e\160\175\173\164\157_\155\157nt\150\175<\057\163p\141\156><\057th>\074/tr\076";
            $_lO1w = "\074span \143\154ass=\047\153cdF\141\163tPr\145\166'><\141\076&l\164\073&l\164\073</\141\076</\163\160an\076\074sp\141\156 c\154ass=\047kcdF\141\163tN\145\170t'\076<a>\046\147t;\046\147t;\074/a>\074\057sp\141\156>";
            $_ll1x = "\074\163pan \143\154ass\075\047kcd\120\162ev'\076\074a>\046\154t;\074\057a\076\074/s\160\141n><\163\160an\040clas\163\075'k\143\144Ne\170\164'>\074a>&g\164\073<\057\141><\057span\076";
            $_lO1x = "\074ta\142\154e ce\154\154spac\151\156g='\060\047 b\157\162de\162\075'0\047\040st\171\154e=\047\167id\164\150:1\060\060%;\047>\173\142\157dy\175\074/t\141\142le\076";
            $_ll1y = "\074\164body\076\173trs\175\074/t\142\157dy>";
            $_lO1y = "<\164\162>\173t\144\163}</\164\162>";
            $_ll1z = "<td c\154\141ss='\153\143dMo\156\164hCo\156\164ain\145\162 \173\162owpo\163\175 \173\143olp\157\163}'\076\173mo\156\164hv\151\145w}\074\057t\144\076";
            $_lO1z = _lO0("\173\146\162om_\155\157nth\175", $this->Localization->_lOs[$_lO1u["\155onth"]] . " " . $_lO1u["\171\145ar"], $_ll1w);
            $_lO1z = _lO0("\173\163ep}", $this->DateRangeSeparator, $_lO1z);
            $_lO1z = _lO0("\173to\137\155onth\175", $this->Localization->_lOs[$_ll1v["\155onth"]] . " " . $_ll1v["\171ear"], $_lO1z);
            $_lO1z = _lO0("\173colsp\141\156}", $this->MultiViewColumns, $_lO1z);
            $_lO1z = _lO0("\173q\155\163}", $this->EnableQuickMonthSelect ? "kc\144\121MSNa\166" : "", $_lO1z);
            $_lO1z = _lO0("\173\146ast\156\141v}", ($this->ShowFastNavigation) ? $_lO1w : "", $_lO1z);
            $_lO1z = _lO0("\173nav}", ($this->ShowNavigation) ? $_ll1x : "", $_lO1z);
            $_ll20 = "";
            $_ll20.=$_lO1z;
            $_lO20 = _lO0("\173trs}", $_ll20, $_lO1v);
            $_ll21 = "";
            for ($_lO1o = 0; $_lO1o < $this->MultiViewRows; $_lO1o++) {
                $_lO21 = "";
                for ($_lO1p = 0; $_lO1p < $this->MultiViewColumns; $_lO1p++) {
                    $_ll22 = mktime(0, 0, 0, $_lO1u["\155on"] + $_lO1o * $this->MultiViewColumns + $_lO1p, 1, $_lO1u["ye\141\162"]);
                    $_lO22 = _lO0("\173m\157\156thvi\145\167}", $this->_lO1f($_ll22, FALSE), $_ll1z);
                    $_lO22 = _lO0("\173\162\157wpo\163\175", ($_lO1o == 0) ? "k\143\144Firs\164\122ow \173\162owpo\163\175" : "\173row\160\157s}", $_lO22);
                    $_lO22 = _lO0("\173\162\157wpo\163\175", ($_lO1o == $this->MultiViewRows - 1) ? "kcdL\141\163tRo\167\040\173\162\157wpo\163\175" : "\173\162owp\157\163}", $_lO22);
                    $_lO22 = _lO0("\173\162owp\157\163}", "", $_lO22);
                    $_lO22 = _lO0("\173\143\157lpo\163\175", ($_lO1p == 0) ? "kcdF\151\162stCo\154\040\173\143\157lpo\163\175" : "\173co\154\160os}", $_lO22);
                    $_lO22 = _lO0("\173\143olpos\175", ($_lO1p == $this->MultiViewColumns - 1) ? "\153cdLa\163\164Col \173\143olpo\163\175" : "\173\143olpo\163\175", $_lO22);
                    $_lO22 = _lO0("\173\143\157lpos\175", "", $_lO22);
                    $_lO21.=$_lO22;
                } $_ll23 = _lO0("\173t\144\163}", $_lO21, $_lO1y);
                $_ll21.=$_ll23;
            } $_lO23 = _lO0("\173trs}", $_ll21, $_ll1y);
            $_ll24 = _lO0("\173\142ody}", $_lO23, $_lO1x);
            $_lO24 = "";
            $_lO1s = $_lO1j;
            $_lO1s = _lO0("\173wid\164\150}", ($this->Width) ? "\167idt\150\072" . $this->Width . "\073" : "", $_lO1s);
            $_lO1s = _lO0("\173\150eight}", ($this->Height) ? "\150eight\072" . $this->Height . ";" : "", $_lO1s);
            $_lO1s = _lO0("\173\150\145ad}", $_lO20, $_lO1s);
            if ($this->ClientMode) {
                $_lO1s = _lO0("\173\163\165bta\142\154e}", "\074div\076\074ta\142\154e c\154\141ss=\047\153cd\124\141ble\123\154id\145\047 \163\164yl\145\075'w\151\144th\072100%\073' bo\162der\075\0470\047\040ce\154\154p\141\144di\156\147='\060' c\145\154ls\160aci\156\147='\060'><\164\162>\074\164d\076\173su\142tabl\145}</\164\144><\057tr>\074\057t\141\142l\145\076</\144iv>", $_lO1s);
            } $_lO1s = _lO0("\173subt\141\142le}", $_ll24, $_lO1s);
            $_lO1s = _lO0("\173\146oot}", $_lO24, $_lO1s);
            return $_lO1s;
        }

        function _lO1f($_lOp=NULL, $_ll25=TRUE) {
            if (!$_lOp) {
                $_lOp = $this->FocusedDate;
            } $_lO25 = getdate($_lOp);
            $_lO1j = "<\164\141ble \143\145lls\160\141cin\147\075'0\047\040ce\154\154pa\144\144i\156\147='0\047 bor\144\145r\075\0470'\040clas\163='kc\144Mon\164\150Vi\145\167' \163\164y\154\145='\173\167id\164\150}\173\150ei\147\150t\175\047>\173\150ea\144\175\173\142ody\175\173f\157ot}\074/ta\142\154e\076";
            $_lO1v = "\074thead\076\173trs\175\074/th\145\141d>";
            $_ll26 = "<tr><\164\150 cl\141\163s='k\143\144Top\110\145ade\162\047>\173\146ast\156\141v}\173\156av}\040\173t\145\170t}<\057th><\057tr>";
            $_lO26 = "<span\040\143las\163\075'kcd\116\141vTe\170\164 \173\161\155s}\047\076\173\164ext}\074\057sp\141\156>";
            $_lO1w = "\074\163pan\040\143las\163\075'kc\144\106ast\120\162ev\047\076<a\076\046l\164\073&l\164\073</\141\076</\163\160an\076\074s\160\141n \143\154as\163\075'k\143\144Fa\163tNe\170\164'>\074\141>&\147\164;\046\147t;\074/a>\074\057s\160\141n>";
            $_ll1x = "\074span\040\143lass\075\047kc\144\120rev\047\076<a>\046\154t;\074\057a\076\074/s\160\141n>\074\163pa\156\040cl\141\163s=\047\153cd\116\145xt\047\076<\141\040>&\147\164;<\057a></\163\160a\156\076";
            $_ll1y = "<tbod\171\076<tr\076\074td \143\154ass\075\047kc\144\115ain\047\040s\164\171le=\047\157ve\162\146lo\167\072hi\144\144en\047\076\173\144eta\151\154}<\057\164d>\074/tr>\074/tbo\144\171>";
            $_ll27 = "\074tfo\157\164>\173\164\162s}</\164\146oot\076";
            $_lO27 = "\074tr>\173\164\144s}\074\057tr\076";
            $_ll28 = "<td>\173\143t}</t\144\076";
            $_lO28 = $_ll26;
            if ($_ll25) {
                $_lO28 = _lO0("\173te\170\164}", $_lO26, $_lO28);
                $_lO28 = _lO0("\173\164ext}", "\173te\170\164} " . $_lO25["yea\162"], $_lO28);
                $_lO28 = _lO0("\173qms}", $this->EnableQuickMonthSelect ? "kc\144\121MSNa\166" : "", $_lO28);
            } $_lO28 = _lO0("\173tex\164\175", $this->Localization->_lOs[$_lO25["mont\150"]], $_lO28);
            $_lO28 = _lO0("\173\146astna\166\175", ($_ll25 && $this->ShowFastNavigation) ? $_lO1w : "", $_lO28);
            $_lO28 = _lO0("\173\156av}", ($_ll25 && $this->ShowNavigation) ? $_ll1x : "", $_lO28);
            $_ll20 = "";
            $_ll20.=$_lO28;
            $_lO20 = _lO0("\173trs}", $_ll20, $_lO1v);
            $_lO23 = $_ll1y;
            if ($_ll25) {
                $_lO23 = _lO0("\173\144\145tai\154\175", "\074div>\074\164able\040\143las\163\075'k\143\144Tabl\145\123li\144\145' \040\142or\144\145r='\060' ce\154\154pa\144\144in\147\075'\060\047 c\145\154ls\160\141ci\156\147='\060' st\171\154e=\047wid\164\150:1\060\060%\073\047>\074\164r>\074td>\173\144et\141\151l\175\074/\164\144><\057tr>\074\057t\141\142le\076</d\151v>", $_lO23);
            } $_lO23 = _lO0("\173\144etai\154\175", $this->_ll29($_lO25), $_lO23);
            $_lO24 = "";
            $_lO1s = $_lO1j;
            $_lO1s = _lO0("\173wid\164\150}", ($this->Width) ? "\167\151dth\072" . $this->Width . ";" : "", $_lO1s);
            $_lO1s = _lO0("\173\150\145igh\164\175", ($this->Height) ? "\150eig\150\164:" . $this->Height . "\073" : "", $_lO1s);
            $_lO1s = _lO0("\173head\175", $_lO20, $_lO1s);
            $_lO1s = _lO0("\173b\157\144y}", $_lO23, $_lO1s);
            $_lO1s = _lO0("\173\146oot}", $_lO24, $_lO1s);
            return $_lO1s;
        }

        function _ll29($_lO29) {
            $_ll2a = array("Sun\144\141y", "Mo\156\144ay", "\124\165esda\171", "\127edn\145\163day", "\124\150urs\144\141y", "\106\162iday", "S\141\164urda\171");
            $_lO2a = (strtolower($this->Orientation) == "\166ertica\154");
            $_ll2b = 7;
            $_lO2b = 6;
            switch ($this->MonthLayout) {
                case "2\061x2": $_ll2b = 025;
                    $_lO2b = 2;
                    break;
                case "\061\064x3": $_ll2b = 016;
                    $_lO2b = 3;
                    break;
                case "\067x6": $_ll2b = 7;
                    $_lO2b = 6;
                default : break;
            } $_ll1h = $this->Localization->_lOt;
            switch (strtolower($this->DayNameFormat)) {
                case "\163ho\162\164": $_ll1h = $this->Localization->_llu;
                    break;
                case "\146\151rstl\145\164ter": $_ll1h = $this->Localization->_llv;
                    break;
                case "fir\163\164twol\145\164ter\163": $_ll1h = $this->Localization->_lOv;
                    break;
                case "s\150\157rtes\164": $_ll1h = $this->Localization->_lOu;
                    break;
            } if ($_lO2a) {
                $_ll2c = $_ll2b;
                $_ll2b = $_lO2b;
                $_lO2b = $_ll2c;
            } $_lO2c = mktime(0, 0, 0, $_lO29["mon"], 1, $_lO29["\171ear"]);
            $_ll2d = getdate($_lO2c);
            $_lO2d = $_ll2d["\167day"] - $this->FirstDayOfWeek;
            if ($_lO2d < 0)
                $_lO2d += 7; $_ll2e = _llp($_lO2c, -$_lO2d);
            $_lO1j = "\074tab\154\145 cel\154\163pac\151\156g='\060\047 bo\162\144er\075\0470\047\040cl\141\163s='\153\143dM\141\151nT\141\142le\047\076\173\150ead\175\173bod\171\175</\164able\076";
            $_lO1v = "<\164\150ead>\074\164r>\173\164h_se\154\145cto\162\175\173t\150\163}<\057\164r>\074\057th\145\141d>";
            $_lO2e = "<\164\150 cla\163\163='kc\144\103olH\145\141der\047\040ti\164\154e=\047\173ti\164\154e}\047\076\173\164\145xt\175\074/t\150\076";
            $_ll2f = "<th\040\143las\163\075'kc\144\103olH\145\141de\162\040kc\144\126ie\167\123el\145\143tor\047>\173\164\145xt\175\074/t\150>";
            $_ll1y = "<t\142\157dy>\173\164rs}\074\057tb\157\144y>";
            $_lO1y = "\074tr>\173\164\150}\173\164ds}<\057\164r>";
            $_lO2f = "<th\040\143las\163\075'kc\144\122owH\145\141der\047\040ti\164\154e='\173\164it\154\145}'>\173\164ex\164\175</\164\150>";
            $_ll1z = "\074td abb\162\075'\173\141\142br\175\047 cl\141\163s='\173\143las\163\175' \173\164itl\145\175><\141\076\173\164\145xt\175\074/\141\076</\164\144>";
            $_ll2g = "";
            for ($_lO1p = 0; $_lO1p < $_ll2b; $_lO1p++) {
                $_lO2g = "";
                if ($_lO2a) {
                    $_llq = _llp($_ll2e, $_lO1p * $_lO2b);
                    $_ll2h = getdate($_llq);
                    $_lO2h = ceil($_ll2h["yday"] / 7) + 1;
                    if ($_lO2h > 064) {
                        $_lO2h = 1;
                    } $_lO2g = _lO0("\173\164\145xt}", $_lO2h, $_lO2e);
                    $_lO2g = _lO0("\173\164\151tle}", $_lO2h, $_lO2g);
                } else {
                    $_ll2i = ($this->FirstDayOfWeek + $_lO1p) % 7;
                    $_lO2g = _lO0("\173ti\164\154e}", $this->Localization->_lOt[$_ll2a[$_ll2i]], $_lO2e);
                    $_lO2g = _lO0("\173\164\145xt}", $_ll1h[$_ll2a[$_ll2i]], $_lO2g);
                } $_ll2g.=$_lO2g;
            } $_lO2i = "";
            if ($this->ShowRowHeader) {
                if ($this->ShowViewSelector) {
                    $_lO2i = _lO0("\173text}", $this->ViewSelectorText, $_ll2f);
                } else {
                    $_lO2i = _lO0("\173tex\164\175", "", $_lO2e);
                    $_lO2i = _lO0("\173\164\151tle\175", "", $_lO2i);
                }
            } $_lO20 = _lO0("\173t\150\163}", $_ll2g, $_lO1v);
            $_lO20 = _lO0("\173t\150\137sele\143\164or}", $_lO2i, $_lO20);
            $_ll21 = "";
            for ($_lO1o = 0; $_lO1o < $_lO2b; $_lO1o++) {
                $_lO21 = "";
                for ($_lO1p = 0; $_lO1p < $_ll2b; $_lO1p++) {
                    $_llq = _llp($_ll2e, $_lO1o * $_ll2b + $_lO1p);
                    if ($_lO2a) {
                        $_llq = _llp($_ll2e, $_lO1p * $_lO2b + $_lO1o);
                    } $_ll2h = getdate($_llq);
                    $_ll2j = ($_ll2h["\155on"] != $_lO29["m\157\156"]) ? ($this->ShowOtherMonthsDays ? TRUE : FALSE) : TRUE;
                    $_lO22 = _lO0("\173a\142\142r}", $_ll2j ? date("n\057\152/Y", $_llq) : "", $_ll1z);
                    $_lO22 = _lO0("\173te\170\164}", $_ll2j ? $_ll2h["mday"] : "", $_lO22);
                    $_lO22 = _lO0("\173cla\163\163}", $_ll2j ? "kcdDay\040\173cla\163\163}" : "", $_lO22);
                    $_lO22 = _lO0("\173\143\154ass\175", ($_ll2h["m\157\156"] != $_lO29["m\157\156"]) ? "k\143\144Othe\162\115onth\040\173cl\141\163s}" : "\173\143\154ass}", $_lO22);
                    $_lO22 = _lO0("\173\143\154ass\175", ($_ll2h["\167day"] == 0 || $_ll2h["wda\171"] == 6) ? "kcdWe\145\153end \173\143lass\175" : "\173\143las\163\175", $_lO22);
                    $_lO22 = _lO0("\173c\154\141ss}", isset($this->_lO15[date("n/j/Y", $_llq)]) ? "\153cd\123\145lect\145\144 \173\143\154as\163\175" : "\173clas\163\175", $_lO22);
                    $_lO22 = _lO0("\173cl\141\163s}", ($this->ShowToday && date("\156\057j/Y", $_llq) == date("\156\057j/Y")) ? "\153cdTod\141\171 \173\143\154ass}" : "\173\143\154ass\175", $_lO22);
                    if ($this->RangeMaxDate !== NULL) {
                        if ($_llq > $this->RangeMaxDate) {
                            $_lO22 = _lO0("\173\143\154ass}", "\153cdDisa\142\154ed \173\143las\163\175", $_lO22);
                        }
                    } if ($this->RangeMinDate !== NULL) {
                        if ($_llq < $this->RangeMinDate) {
                            $_lO22 = _lO0("\173\143lass}", "\153cdDisa\142\154ed \173\143lass\175", $_lO22);
                        }
                    } if (isset($this->_ll16[date("n/j/\131", $_llq)])) {
                        $_lO2j = $this->_ll16[date("n/j/\131", $_llq)];
                        $_lO22 = _lO0("\173\143lass}", ($_lO2j["\104isabl\145\144"]) ? "kc\144\104isab\154\145d \173\143\154as\163\175" : "\173cla\163\163}", $_lO22);
                        $_lO22 = _lO0("\173\143\154ass}", ($_lO2j["Css\103\154ass"] !== NULL) ? $_lO2j["\103ssCl\141\163s"] . "\040\173\143\154as\163\175" : "\173\143las\163\175", $_lO22);
                        $_lO22 = _lO0("\173\164itle}", ($_lO2j["\124ool\124\151p"] !== NULL) ? "titl\145\075'" . $_lO2j["\124ool\124\151p"] . "\047" : "", $_lO22);
                    } $_lO22 = _lO0("\173\143\154ass\175", "", $_lO22);
                    $_lO22 = _lO0("\173tit\154\145}", $this->ShowDayCellToolTips ? "titl\145\075'" . date("\154, F \144\054 Y", $_llq) . "'" : "", $_lO22);
                    $_lO21.=$_lO22;
                } $_ll2k = "";
                if ($this->ShowRowHeader) {
                    if ($_lO2a) {
                        $_ll2i = ($this->FirstDayOfWeek + $_lO1o) % 7;
                        $_ll2k = _lO0("\173\164\151tle\175", $this->Localization->_lOt[$_ll2a[$_ll2i]], $_lO2f);
                        $_ll2k = _lO0("\173t\145\170t}", $_ll1h[$_ll2a[$_ll2i]], $_ll2k);
                    } else {
                        $_llq = _llp($_ll2e, $_lO1o * $_ll2b);
                        $_ll2h = getdate($_llq);
                        $_lO2h = ceil($_ll2h["yday"] / 7) + 1;
                        if ($_lO2h > 064) {
                            $_lO2h = 1;
                        } $_ll2k = _lO0("\173\164\145xt}", $_lO2h, $_lO2f);
                        $_ll2k = _lO0("\173\164itle\175", $_lO2h, $_ll2k);
                    }
                } $_ll23 = _lO0("\173tds\175", $_lO21, $_lO1y);
                $_ll23 = _lO0("\173th\175", $_ll2k, $_ll23);
                $_ll21.=$_ll23;
            } $_lO23 = _lO0("\173\164\162s}", $_ll21, $_ll1y);
            $_lO1s = _lO0("\173h\145\141d}", $this->ShowColumnHeader ? $_lO20 : "", $_lO1j);
            $_lO1s = _lO0("\173\142ody}", $_lO23, $_lO1s);
            return $_lO1s;
        }

        function registerscript() {
            $_lO2k = "\074scrip\164\040typ\145\075't\145\170t/j\141\166as\143\162ipt\047>if\050\164yp\145\157f \137\154ib\113\103D=\075\047u\156\144ef\151ned\047\051\173\144ocu\155\145nt\056writ\145(un\145\163ca\160\145(\042\0453\103\163cri\160\164 t\171pe=\047\164ex\164\057j\141\166a\163\143ri\160\164'\040\163rc\075'\173\163rc}\047%3E\040\0453\103\057s\143\162i\160\164%3\105\042\051\051;\137\154i\142\113CD\0751;\175\074/\163\143r\151\160t\076";
            $_ll1c = _lO0("\173sr\143\175", $this->_ll2l() . "?" . md5("\152s"), $_lO2k);
            return $_ll1c;
        }

        function _lO2l() {
            $this->styleFolder = _lO0("\134", "/", $this->styleFolder);
            $_ll2m = trim($this->styleFolder, "\057");
            $_lO2m = strrpos($_ll2m, "\057");
            $this->_ll15 = substr($_ll2m, ($_lO2m ? $_lO2m : -1) + 1);
        }

        function registercss() {
            $this->_lO2l();
            $_lO2k = "<\163\143ript\040\164ype\075\047te\170\164/ja\166\141scr\151\160t'>\151\146 (\144\157cum\145\156t.\147\145tE\154\145me\156\164By\111\144('\137\137\173\163\164yl\145\175KC\104\047)\075\075nu\154l)\173\166ar \137\150ea\144\040= \144ocu\155\145nt\056get\105\154em\145nts\102\171Ta\147Nam\145\050'\150\145ad\047)[0\135\073v\141\162 \137\154in\153 = \144ocu\155\145n\164\056c\162\145a\164\145El\145me\156\164('\154ink\047);\040\137l\151\156k\056id \075 '\137\137\173\163ty\154\145}\113\103D\047;_\154\151n\153\056r\145l\075\047s\164yl\145\163h\145et'\073 _\154in\153\056h\162ef\075\047\173\163t\171\154e\160at\150\175/\173st\171le\175\057\173\163t\171\154e\175.c\163s'\073_h\145\141d\056ap\160en\144Ch\151ld\050_l\151nk\051;}\074/s\143ri\160t>";
            $_ll1c = _lO0("\173\163\164yle}", $this->_ll15, $_lO2k);
            $_ll1c = _lO0("\173\163\164ylep\141\164h}", $this->_ll2n(), $_ll1c);
            return $_ll1c;
        }

        function startupscript() {
            $_lO2k = "va\162\040\173\151\144}; f\165\156cti\157\156 \173\151\144}_i\156\151t(\051\173 \173\151d}=\040\156ew\040\113oo\154\103al\145\156da\162\050'\173\151d}'\051;}";
            $_lO2k.="\151f (t\171\160eof\050\113ool\103\141len\144\141r)=\075\047fu\156\143ti\157\156')\173\173id\175\137in\151\164();\175";
            $_lO2k.="e\154\163e\173i\146\050ty\160\145of(_\137\113CDI\156\151ts)\075='un\144\145fi\156\145d')\173\137_K\103\104In\151\164s=n\145\167 A\162\162a\171\050);\175\040__\113\103DI\156\151ts\056pus\150\050\173\151\144}_\151\156it\051;\173\162\145g\151\163te\162\137sc\162ipt\175\175";
            $_lO2n = "\151f(\164\171peof\050\137lib\113\103D)=\075\047un\144\145fin\145\144')\173\166ar \137\150ea\144\040= \144\157cu\155\145nt\056\147et\105\154em\145\156ts\102\171Ta\147\116am\145\050'\150\145ad\047\051[\060\135;v\141\162 _\163\143r\151\160t \075\040d\157\143u\155\145nt\056\143r\145\141te\105lem\145\156t(\047scr\151\160t\047\051;\040_sc\162\151p\164\056t\171\160e\075\047t\145\170t\057\152a\166\141s\143\162ip\164'; \137sc\162\151p\164\056s\162\143=\047\173s\162c}'\073 _\150\145a\144\056a\160pe\156\144C\150\151l\144(_\163\143r\151pt)\073_l\151bK\103\104=\061;}";
            $_ll2o = _lO0("\173sr\143\175", $this->_ll2l() . "?" . md5("js"), $_lO2n);
            $_ll1c = _lO0("\173id}", $this->id, $_lO2k);
            $_ll1c = _lO0("\173re\147\151ste\162\137scr\151\160t}", $_ll2o, $_ll1c);
            return $_ll1c;
        }

        function _ll2l() {
            if ($this->scriptFolder == "") {
                $_ll5 = _lO3();
                $_lO2o = substr(_lO0("\134", "\057", __FILE__), strlen($_ll5));
                return $_lO2o;
            } else {
                $_lO2o = _lO0("\134", "/", __FILE__);
                $_lO2o = $this->scriptFolder . substr($_lO2o, strrpos($_lO2o, "/"));
                return $_lO2o;
            }
        }

        function _ll2n() {
            $_ll2p = $this->_ll2l();
            $_lO2p = _lO0(strrchr($_ll2p, "\057"), "", $_ll2p) . "/sty\154\145s";
            return $_lO2p;
        }

    }

    class kooltimeview {

        var $id;
        var $_ll0 = "\061.9.0\056\060";
        var $styleFolder;
        var $scriptFolder;
        var $_ll15;
        var $StartTime;
        var $EndTime;
        var $Interval;
        var $NumberOfColumns = 4;
        var $HeaderText = "\124\151me V\151\145w";
        var $Orientation = "H\157\162izont\141\154";
        var $TimeFormat = "\147\072i A";
        var $ClientEvents;
        var $_ll17 = TRUE;

        function __construct($_lO17="ktvie\167") {
            $this->id = $_lO17;
            $this->StartTime = mktime(0, 0, 0);
            $this->EndTime = mktime(027, 0, 0);
            $this->Interval = mktime(1, 0, 0);
            $this->ClientEvents = array();
        }

        function render() {
            $_ll1c = "";
            $_ll1c.=$this->registercss();
            $_ll1c.=$this->rendertimeview();
            $_lO1c = isset($_POST["__koo\154\141jax"]) || isset($_GET["\137_kool\141\152ax"]);
            $_ll1c.=($_lO1c) ? "" : $this->registerscript();
            $_ll1c.="<scri\160\164 typ\145\075'te\170\164/ja\166\141scr\151\160t'\076";
            $_ll1c.=$this->startupscript();
            $_ll1c.="\074/scri\160\164>";
            return $_ll1c;
        }

        function _ll1e() {
            $_lO1g = array("\103lient\105\166ents" => $this->ClientEvents);
            $_lO1h = "\074\151npu\164\040id=\047\173id}\137\163ett\151\156gs'\040\164yp\145\075'h\151\144den\047 val\165\145='\173\166alu\145\175' \141uto\143\157mpl\145\164e=\047off\047\040/>";
            $_ll1i = _lO0("\173\151\144}", $this->id, $_lO1h);
            $_ll1i = _lO0("\173val\165\145}", json_encode($_lO1g), $_ll1i);
            return $_ll1i;
        }

        function rendertimeview() {
            $_ll2q = "\1730}\173\164\162ad\145\155ark}\074\144iv\040\151d='\173\151d}'\040styl\145\040cl\141\163s=\047\173st\171\154e}\113\103D'>\173\164a\142\154e}\173\163ett\151\156gs\175\1731}\074/div\076\1732\175";
            $_lO1d = "\n<!\055\055Koo\154\124imeV\151\145w v\145\162sio\156\040\173\166\145rs\151\157n} \055 www\056\153oo\154\160hp\056\156et\040\055-\076\n";
            $_lO1j = "\074table\040\143las\163\075'kt\155\124abl\145\047 bo\162\144er\075\0470\047\040ce\154\154spa\143\151ng\075\0470\047\076\173\150\145ad\175\173b\157\144y}\074\057ta\142\154e>";
            $_lO1v = "<th\145\141d><tr\076\074th\040\143las\163\075'k\164\155Hea\144\145r' \143\157ls\160\141n='\173\143ol\163\160an\175\047>\173\164ext\175\074/\164\150><\057\164r>\074\057t\150\145ad\076";
            $_ll1y = "<t\142\157dy>\173\164rs}<\057\164bo\144\171>";
            $_ll1k = "<tr\076\173tds}\074\057tr\076";
            $_lO1k = "<t\144\040class=\047\173tim\145\175 \173\143\157lpo\163\175' a\142\142r=\047\173ab\142\162}'\076\074a>\173\164ex\164\175</\141\076</\164\144>";
            $_lO20 = _lO0("\173text\175", $this->HeaderText, $_lO1v);
            $_lO20 = _lO0("\173\143\157lspa\156\175", $this->NumberOfColumns, $_lO20);
            $_lO2q = mktime(0, 0, 0);
            $_ll2r = floor(($this->EndTime - $this->StartTime) / ($this->Interval - $_lO2q)) + 1;
            $_lO2r = ceil($_ll2r / $this->NumberOfColumns);
            $_ll1o = "";
            for ($_lO1o = 0; $_lO1o < $_lO2r; $_lO1o++) {
                $_ll1p = "";
                for ($_lO1p = 0; $_lO1p < $this->NumberOfColumns; $_lO1p++) {
                    $_ll2s = $this->StartTime + ($_lO1o * $this->NumberOfColumns + $_lO1p) * ($this->Interval - $_lO2q);
                    if (strtolower($this->Orientation) == "vert\151\143al") {
                        $_ll2s = $this->StartTime + ($_lO1p * $_lO2r + $_lO1o) * ($this->Interval - $_lO2q);
                    } $_ll2j = ($_ll2s <= $this->EndTime);
                    $_ll1q = _lO0("\173te\170\164}", $_ll2j ? date($this->TimeFormat, $_ll2s) : "", $_lO1k);
                    $_ll1q = _lO0("\173a\142\142r}", $_ll2j ? date("\110:i\072\163", $_ll2s) : "", $_ll1q);
                    $_ll1q = _lO0("\173\164\151me}", $_ll2j ? "\153tmT\151\155e" : "\153\164mNoTi\155\145", $_ll1q);
                    if ($_lO1p == 0) {
                        $_ll1q = _lO0("\173\143olpo\163\175", "\153\164mFi\162\163t", $_ll1q);
                    } else if ($_lO1p == $this->NumberOfColumns - 1) {
                        $_ll1q = _lO0("\173colp\157\163}", "\153\164mLa\163\164", $_ll1q);
                    } else {
                        $_ll1q = _lO0("\173co\154\160os}", "", $_ll1q);
                    } $_ll1p.=$_ll1q;
                } $_lO1q = _lO0("\173tds\175", $_ll1p, $_ll1k);
                $_ll1o.=$_lO1q;
            } $_lO23 = _lO0("\173\164\162s}", $_ll1o, $_ll1y);
            $_lO1s = _lO0("\173head\175", $_lO20, $_lO1j);
            $_lO1s = _lO0("\173\142ody}", $_lO23, $_lO1s);
            $_llg = _lO0("\173id}", $this->id, $_ll2q);
            $_llg = _lO0("\173\163\164yle}", $this->_ll15, $_llg);
            $_llg = _lO0("\173\164radem\141\162k}", $this->_ll17 ? $_lO1d : "", $_llg);
            $_llg = _lO0("\173ta\142\154e}", $_lO1s, $_llg);
            if (_lOf($_llg)) {
                $_llg = _lO0("\173\163ettin\147\163}", $this->_ll1e(), $_llg);
            } $_llg = _lO0("\173\166ersi\157\156}", $this->_ll0, $_llg);
            return $_llg;
        }

        function registerscript() {
            $_lO2k = "<s\143\162ipt\040\164ype\075\047te\170\164/j\141\166asc\162\151pt\047>if(\164\171pe\157\146 _\154\151bK\103\104==\047unde\146ine\144\047)\173\144oc\165\155en\164\056w\162\151te\050\165ne\163cap\145\050\042\0453C\163\143ri\160t t\171\160e=\047tex\164/ja\166\141s\143\162i\160\164' \163rc=\047\173s\162c}'\0453E \0453C/\163cri\160t%3\105\042)\051;_l\151bK\103\104=\061;}<\057scr\151pt>";
            $_ll1c = _lO0("\173s\162\143}", $this->_ll2l() . "?" . md5("\152s"), $_lO2k);
            return $_ll1c;
        }

        function _lO2l() {
            $this->styleFolder = _lO0("\134", "\057", $this->styleFolder);
            $_ll2m = trim($this->styleFolder, "\057");
            $_lO2m = strrpos($_ll2m, "/");
            $this->_ll15 = substr($_ll2m, ($_lO2m ? $_lO2m : -1) + 1);
        }

        function registercss() {
            $this->_lO2l();
            $_lO2k = "<scr\151\160t t\171\160e='\164\145xt\057\152ava\163\143ri\160\164'>\151\146 (\144\157cu\155\145nt\056\147et\105leme\156\164By\111d('\137\137\173\163\164yl\145\175K\103\104')\075\075n\165\154l)\173var\040\137he\141d =\040\144o\143\165me\156t.g\145\164E\154\145m\145\156ts\102yTa\147\116a\155\145(\047\150e\141\144')\1330];\166ar\040\137l\151\156k\040\075 \144ocu\155ent\056cr\145\141t\145\105l\145\155e\156t('\154ink\047);\040_l\151\156k\056id\040= '\137_\173\163ty\154e}\113\103D\047;_\154ink\056re\154='\163\164\171\154e\163he\145\164'\073 _\154in\153.h\162\145f\075'\173\163t\171le\160\141t\150}/\173st\171le\175/\173\163ty\154e}\056cs\163';\137he\141d.\141pp\145nd\103hi\154d(\137li\156k)\073}<\057s\143\162i\160t\076";
            $_ll1c = _lO0("\173styl\145\175", $this->_ll15, $_lO2k);
            $_ll1c = _lO0("\173\163tyl\145\160ath\175", $this->_ll2n(), $_ll1c);
            return $_ll1c;
        }

        function startupscript() {
            $_lO2k = "v\141\162 \173\151\144}; \146\165nc\164\151on \173\151d}\137\151ni\164\050)\173\040\173\151\144}=\040new\040\113oo\154\124im\145Vie\167\050'\173\151d}'\051;}";
            $_lO2k.="i\146\040(ty\160\145of(\113\157olT\151\155eVi\145\167)=\075\047f\165\156ct\151\157n')\173\173id\175\137i\156\151t()\073}";
            $_lO2k.="e\154\163e\173\151\146(ty\160\145of(\137\137KC\104\111nit\163\051=\075\047un\144\145fi\156\145d'\051\173_\137\113CD\111\156it\163\075n\145\167 A\162\162ay\050);}\040\137_K\103\104I\156\151ts\056pus\150\050\173\151d}_\151\156i\164\051;\173\162eg\151ste\162\137s\143\162i\160\164}}";
            $_lO2n = "i\146\050typ\145\157f(_l\151\142KC\104\051=='\165\156de\146\151ne\144\047)\173\166ar \137\150ea\144\040=\040\144oc\165\155en\164.ge\164\105le\155\145nt\163\102yT\141\147N\141\155e(\047\150e\141\144')\133\060]\073\166a\162\040_\163\143ri\160\164 \075\040d\157\143u\155\145nt\056cr\145\141te\105lem\145nt(\047scr\151\160t\047); \137scr\151pt.\164ype\075'te\170t/j\141va\163\143r\151\160t\047; _\163cr\151\160t\056src\075'\173\163rc\175';_\150ea\144\056a\160pe\156\144C\150ild\050_s\143ri\160t);\137li\142KCD\0751;\175";
            $_ll2o = _lO0("\173src}", $this->_ll2l() . "\077" . md5("j\163"), $_lO2n);
            $_ll1c = _lO0("\173\151\144}", $this->id, $_lO2k);
            $_ll1c = _lO0("\173\162\145gist\145\162_sc\162\151pt\175", $_ll2o, $_ll1c);
            return $_ll1c;
        }

        function _ll2l() {
            if ($this->scriptFolder == "") {
                $_ll5 = _lO3();
                $_lO2o = substr(_lO0("\134", "/", __FILE__), strlen($_ll5));
                return $_lO2o;
            } else {
                $_lO2o = _lO0("\134", "/", __FILE__);
                $_lO2o = $this->scriptFolder . substr($_lO2o, strrpos($_lO2o, "/"));
                return $_lO2o;
            }
        }

        function _ll2n() {
            $_ll2p = $this->_ll2l();
            $_lO2p = _lO0(strrchr($_ll2p, "\057"), "", $_ll2p) . "\057style\163";
            return $_lO2p;
        }

    }

    class _lO2s {

        var $Orientation = "\110ori\172\157ntal";
        var $MonthLayout = "\067x6";
        var $ShowOtherMonthsDays = TRUE;
        var $ShowDayCellToolTips = TRUE;
        var $ShowToday = TRUE;
        var $ShowColumnHeader = TRUE;
        var $ShowRowHeader = TRUE;
        var $ShowNavigation = TRUE;
        var $ShowFastNavigation = TRUE;
        var $FastNavigationStep = 3;
        var $MultiViewColumns = 1;
        var $MultiViewRows = 1;
        var $FirstDayOfWeek = 0;
        var $FocusedDate;
        var $RangeMinDate;
        var $RangeMaxDate;
        var $NavigateAnimation;

        function __construct() {
            $this->NavigateAnimation = new _lOq();
        }

    }

    class _ll2t {

        var $StartTime;
        var $EndTime;
        var $Interval;
        var $NumberOfColumns = 3;
        var $HeaderText = "\124ime P\151\143ker";
        var $Orientation = "\110\157rizo\156\164al";
        var $TimeFormat = "\147\072i A";

        function __construct() {
            $this->StartTime = mktime(0, 0, 0);
            $this->EndTime = mktime(027, 0, 0);
            $this->Interval = mktime(1, 0, 0);
        }

    }

    class kooldatetimepicker {

        var $id;
        var $_ll0 = "1.9\056\060.0";
        var $styleFolder;
        var $scriptFolder;
        var $_ll15;
        var $CalendarSettings;
        var $TimeViewSettings;
        var $_lO2t = TRUE;
        var $_ll2u = TRUE;
        var $_lO2u;
        var $_ll2v;
        var $Width = "\061\0660p\170";
        var $CssStyles;
        var $OffsetLeft = 0;
        var $OffsetTop = 0;
        var $DateFormat = "\155\057d/Y";
        var $TimeFormat = "\147\072i A";
        var $Value = "";
        var $ClientEvents;
        var $Localization;

        function __construct($_lO17="k\144\164p") {
            $this->id = $_lO17;
            $this->CssStyles = array();
            $this->CalendarSettings = new _lO2s();
            $this->TimeViewSettings = new _ll2t();
            $this->ClientEvents = array();
            $this->Localization = new _llr();
        }

        function init() {
            if ($this->_lO2t) {
                $this->_lO2u = new koolcalendar($this->id . "_cale\156\144ar");
                $this->_lO2u->ClientMode = TRUE;
                $this->_lO2u->styleFolder = $this->styleFolder;
                $this->_lO2u->scriptFolder = $this->scriptFolder;
                $this->_lO2u->_ll17 = FALSE;
                $this->_lO2u->ClientMode = TRUE;
                $this->_lO2u->ShowViewSelector = FALSE;
                $this->_lO2u->ViewSelectorText = "";
                $this->_lO2u->Orientation = $this->CalendarSettings->Orientation;
                $this->_lO2u->MonthLayout = $this->CalendarSettings->MonthLayout;
                $this->_lO2u->ShowOtherMonthsDays = $this->CalendarSettings->ShowOtherMonthsDays;
                $this->_lO2u->ShowDayCellToolTips = $this->CalendarSettings->ShowDayCellToolTips;
                $this->_lO2u->ShowColumnHeader = $this->CalendarSettings->ShowColumnHeader;
                $this->_lO2u->ShowRowHeader = $this->CalendarSettings->ShowRowHeader;
                $this->_lO2u->ShowNavigation = $this->CalendarSettings->ShowNavigation;
                $this->_lO2u->ShowFastNavigation = $this->CalendarSettings->ShowFastNavigation;
                $this->_lO2u->FastNavigationStep = $this->CalendarSettings->FastNavigationStep;
                $this->_lO2u->FirstDayOfWeek = $this->CalendarSettings->FirstDayOfWeek;
                $this->_lO2u->FocusedDate = $this->CalendarSettings->FocusedDate;
                $this->_lO2u->RangeMinDate = $this->CalendarSettings->RangeMinDate;
                $this->_lO2u->RangeMaxDate = $this->CalendarSettings->RangeMaxDate;
                $this->_lO2u->ShowToday = $this->CalendarSettings->ShowToday;
                $this->_lO2u->MultiViewColumns = $this->CalendarSettings->MultiViewColumns;
                $this->_lO2u->MultiViewRows = $this->CalendarSettings->MultiViewRows;
                $this->_lO2u->NavigateAnimation = $this->CalendarSettings->NavigateAnimation;
                $this->_lO2u->Localization = $this->Localization;
                $this->_lO2u->init();
            } if ($this->_ll2u) {
                $this->_ll2v = new kooltimeview($this->id . "\137\164ime\166\151ew");
                $this->_ll2v->styleFolder = $this->styleFolder;
                $this->_ll2v->scriptFolder = $this->scriptFolder;
                $this->_ll2v->_ll17 = FALSE;
                $this->_ll2v->StartTime = $this->TimeViewSettings->StartTime;
                $this->_ll2v->EndTime = $this->TimeViewSettings->EndTime;
                $this->_ll2v->Interval = $this->TimeViewSettings->Interval;
                $this->_ll2v->NumberOfColumns = $this->TimeViewSettings->NumberOfColumns;
                $this->_ll2v->HeaderText = $this->TimeViewSettings->HeaderText;
                $this->_ll2v->Orientation = $this->TimeViewSettings->Orientation;
                $this->_ll2v->TimeFormat = $this->TimeViewSettings->TimeFormat;
            } if (isset($_POST[$this->id])) {
                $this->Value = $_POST[$this->id];
            }
        }

        function render() {
            $_ll1c = "";
            $_ll1c.=$this->registercss();
            $_ll1c.=$this->renderdatetimepicker();
            $_lO1c = isset($_POST["__\153\157ola\152\141x"]) || isset($_GET["\137_kool\141\152ax"]);
            $_ll1c.=($_lO1c) ? "" : $this->registerscript();
            $_ll1c.="\074scrip\164\040typ\145\075't\145\170t/j\141\166as\143\162ipt\047>";
            $_ll1c.=$this->startupscript();
            $_ll1c.="\074/scri\160\164>";
            return $_ll1c;
        }

        function _ll1e() {
            $_lO1g = array("\117\146fse\164\114eft" => $this->OffsetLeft, "Offs\145\164Top" => $this->OffsetTop, "Da\164\145Form\141\164" => $this->DateFormat, "\124imeFo\162\155at" => $this->TimeFormat, "Clie\156\164Even\164\163" => $this->ClientEvents);
            $_lO1h = "<\151\156put \151\144='\173\151d}_se\164\164ing\163\047 t\171\160e=\047\150id\144\145n' \166\141lu\145\075'\173\166alu\145\175' \141\165to\143\157mp\154\145te\075'off\047 />";
            $_ll1i = _lO0("\173\151d}", $this->id, $_lO1h);
            $_ll1i = _lO0("\173v\141\154ue}", json_encode($_lO1g), $_ll1i);
            return $_ll1i;
        }

        function renderdatetimepicker() {
            $_ll2q = "\173\060\175\173\164\162ade\155\141rk}\074\144iv \151\144='\173\151d}_\142\157und\047 sty\154\145='\173\163tyl\145\143ss\175\047 \143\154as\163\075'\173\163tyl\145\175KC\104\047>\173\166ie\167\175\173\144\141te\160\151ck\145\162}\173\164im\145\160ic\153\145r\175\173s\145\164ti\156\147s\175\1731}\074/di\166\076\173\062}";
            $_lO1d = "\n<!\055\055Koo\154\104ate\124\151mePi\143\153er \166\145rsi\157\156 \173\166ers\151\157n} \055\040w\167\167.k\157\157lp\150\160.n\145\164 -\055\076\n";
            $_lO2v = "<\144\151v id=\047\173id\175\137date\160\151cke\162\047 c\154\141ss=\047kcdD\141\164eP\151\143ker\047 sty\154\145='\144\151sp\154\141y:\156\157ne\073\160os\151\164io\156\072a\142\163ol\165\164e;\047>\173\143\141le\156\144ar\175\074/\144\151v>";
            $_ll2w = "<\144\151v id\075\047\173\151\144}_\164\151mep\151\143ke\162\047 c\154\141ss\075\047kc\144Time\120\151ck\145\162' \163tyle\075'di\163\160la\171\072n\157\156e;\160\157si\164\151o\156\072ab\163\157l\165\164e;\047>\173\164\151me\166iew\175\074/\144\151v\076";
            $_lO2w = "\074table\040\142ord\145\162='0\047\040ce\154\154pa\144\144ing\075'0'\040\143el\154\163pa\143\151ng\075\0470\047\040st\171le='\167idt\150\07210\060%;'>\074tr>\074\164d \143las\163\075'k\143\144I\156\160ut\047><d\151\166><\151npu\164\040i\144\075'\173\151d}\047\040n\141\155e=\047\173i\144\175' \166alu\145\075'\173\166al\165e}'\040sty\154\145=\047\167i\144\164h\072\0610\060\045;\173sty\154e}'\040typ\145='t\145xt'\040aut\157co\155\160l\145\164e\075\047o\146f'/\076</\144\151v\076</t\144>\173\144at\145\157p\145ne\162}\173\164im\145\157p\145\156er\175\074/\164r>\074/t\141bl\145>";
            $_ll2x = "";
            $_lO2x = "";
            if ($this->_lO2t) {
                $_ll2x = _lO0("\173\151d}", $this->id, $_lO2v);
                $_ll2x = _lO0("\173\143\141lend\141\162}", $this->_lO2u->render(), $_ll2x);
                $_lO2x = "\074td cl\141\163s='\153\143dPic\153\145r'\076\074a \151\144='\173\151d}\137\144at\145\157pe\156\145r'\040\143la\163\163='\153\143d\104\141te\117\160en\145r'><\057a><\057td>";
                $_lO2x = _lO0("\173\151\144}", $this->id, $_lO2x);
            } $_ll2y = "";
            $_lO2y = "";
            if ($this->_ll2u) {
                $_ll2y = _lO0("\173id}", $this->id, $_ll2w);
                $_ll2y = _lO0("\173t\151\155evie\167\175", $this->_ll2v->render(), $_ll2y);
                $_lO2y = "<td cl\141\163s='\153\143dPic\153\145\162'><\141\040id\075\047\173\151d}_\164\151meo\160\145ne\162\047 \143\154as\163\075'k\143dTi\155\145Op\145\156er\047\076<\057\141>\074\057t\144\076";
                $_lO2y = _lO0("\173id}", $this->id, $_lO2y);
            } $_ll2z = _lO0("\173\151d}", $this->id, $_lO2w);
            $_ll2z = _lO0("\173date\157\160ener\175", $_lO2x, $_ll2z);
            $_ll2z = _lO0("\173\164\151meop\145\156er}", $_lO2y, $_ll2z);
            foreach ($this->CssStyles as $_llw => $_lOw) {
                $_ll2z = _lO0("\173\163tyl\145\175", $_llw . "\072" . $_lOw . "\073\173st\171\154e}", $_ll2z);
            } $_ll2z = _lO0("\173\163\164yle}", "", $_ll2z);
            $_ll2z = _lO0("\173value\175", $this->Value, $_ll2z);
            $_llg = _lO0("\173id}", $this->id, $_ll2q);
            $_llg = _lO0("\173\163\164yle\175", $this->_ll15, $_llg);
            $_llg = _lO0("\173\166iew\175", $_ll2z, $_llg);
            $_llg = _lO0("\173\144atep\151\143ker}", $_ll2x, $_llg);
            $_llg = _lO0("\173\164\151mepi\143\153er}", $_ll2y, $_llg);
            if (_lOf($_llg)) {
                $_llg = _lO0("\173\163\145ttin\147\163}", $this->_ll1e(), $_llg);
            } $_llg = _lO0("\173sty\154\145css}", ($this->Width !== NULL) ? "wid\164\150:" . $this->Width . "\073" : "", $_llg);
            $_llg = _lO0("\173tr\141\144emar\153\175", $_lO1d, $_llg);
            $_llg = _lO0("\173\166ers\151\157n}", $this->_ll0, $_llg);
            return $_llg;
        }

        function registerscript() {
            $_lO2k = "\074sc\162\151pt t\171\160e='t\145\170t/j\141\166asc\162\151pt\047\076if\050type\157\146 _l\151\142KC\104\075=\047\165nd\145\146in\145\144')\173\144oc\165\155en\164\056wr\151\164e(\165\156es\143ape(\042%3C\163\143ri\160\164 t\171\160e\075\047te\170t/j\141\166a\163\143ri\160t' \163\162c=\047\173s\162\143}\047\0453\105\040%\063\103/\163\143ri\160t%3\105\042)\051;_l\151bKC\104\0751\073}</\163cri\160t>";
            $_ll1c = _lO0("\173\163rc}", $this->_ll2l() . "\077" . md5("\152s"), $_lO2k);
            return $_ll1c;
        }

        function _lO2l() {
            $this->styleFolder = _lO0("\134", "/", $this->styleFolder);
            $_ll2m = trim($this->styleFolder, "/");
            $_lO2m = strrpos($_ll2m, "\057");
            $this->_ll15 = substr($_ll2m, ($_lO2m ? $_lO2m : -1) + 1);
        }

        function registercss() {
            $this->_lO2l();
            $_lO2k = "<scri\160\164 ty\160\145='t\145\170t/j\141\166asc\162\151pt\047>if \050docu\155\145nt\056getE\154\145me\156\164By\111\144('\137_\173\163\164yl\145\175KC\104\047)\075\075n\165\154l)\173\166a\162\040_\150\145ad\040= d\157\143um\145nt.\147\145t\105\154em\145nts\102\171T\141\147N\141\155e(\047hea\144')[\060];v\141\162 _l\151nk \075 d\157\143um\145nt.\143re\141\164e\105\154e\155\145n\164\050'\154in\153\047)\073 _l\151nk\056id\040\075 \047__\173\163t\171le\175\113C\104';_\154in\153.r\145\154='\163tyl\145sh\145\145t\047; \137li\156\153.\150re\146='\173\163t\171le\160\141t\150}/\173st\171le\175\057\173\163t\171le\175.c\163s'\073_h\145ad\056ap\160en\144Ch\151ld\050_l\151nk\051;}\074/s\143ri\160t>";
            $_ll1c = _lO0("\173style\175", $this->_ll15, $_lO2k);
            $_ll1c = _lO0("\173\163tyle\160\141th}", $this->_ll2n(), $_ll1c);
            return $_ll1c;
        }

        function startupscript() {
            $_lO2k = "\166\141r \173\151d}; f\165\156cti\157\156 \173\151\144}_i\156\151t(\051\173 \173\151d}= ne\167\040Ko\157\154Da\164\145Ti\155ePi\143\153er\050'\173\151\144}'\054\173E\156\141bl\145\104at\145Pic\153\145r}\054\173E\156\141bl\145Tim\145\120i\143\153er\175);}";
            $_lO2k.="\151\146 (t\171pe\157\146(Ko\157\154Dat\145\124im\145\120ick\145\162)\075\075'f\165\156ct\151\157n'\051\173\173\151d}_\151\156it\050);}";
            $_lO2k.="\145lse\173\151f(t\171\160eof(\137\137KC\104\111nit\163\051==\047unde\146\151ne\144\047)\173\137_K\103\104In\151\164s=\156\145w \101\162ray\050\051;}\040\137_\113\103DI\156\151ts\056\160us\150\050\173\151d}_\151\156it\051\073\173\162egi\163\164e\162\137sc\162ipt\175\175";
            $_lO2n = "\151f(t\171\160eof(\137\154ibKC\104\051==\047\165nde\146\151ne\144\047)\173\166ar _\150\145ad\040\075 d\157\143um\145\156t.\147\145tE\154\145me\156\164sB\171\124ag\116\141me\050\047h\145\141d'\051\1330]\073var\040\137sc\162ipt\040\075 \144\157cu\155\145nt\056cre\141teE\154\145me\156\164(\047\163c\162\151pt\047); \137\163c\162\151pt\056typ\145='t\145\170t\057\152a\166\141s\143\162ip\164'; \137scr\151pt.\163rc=\047\173s\162c}'\073_h\145\141d\056\141p\160end\103hil\144(_\163\143r\151\160t\051;_\154\151b\113\103D\0751;\175";
            $_ll2o = _lO0("\173\163\162c}", $this->_ll2l() . "?" . md5("\152s"), $_lO2n);
            $_ll1c = _lO0("\173id\175", $this->id, $_lO2k);
            $_ll1c = _lO0("\173En\141\142leDa\164\145Pic\153\145r}", $this->_lO2t ? "\061" : "0", $_ll1c);
            $_ll1c = _lO0("\173\105\156abl\145\124ime\120\151cke\162\175", $this->_ll2u ? "\061" : "0", $_ll1c);
            $_ll1c = _lO0("\173\162\145gist\145\162_sc\162\151pt}", $_ll2o, $_ll1c);
            return $_ll1c;
        }

        function _ll2l() {
            if ($this->scriptFolder == "") {
                $_ll5 = _lO3();
                $_lO2o = substr(_lO0("\134", "/", __FILE__), strlen($_ll5));
                return $_lO2o;
            } else {
                $_lO2o = _lO0("\134", "/", __FILE__);
                $_lO2o = $this->scriptFolder . substr($_lO2o, strrpos($_lO2o, "\057"));
                return $_lO2o;
            }
        }

        function _ll2n() {
            $_ll2p = $this->_ll2l();
            $_lO2p = _lO0(strrchr($_ll2p, "/"), "", $_ll2p) . "/\163\164yle\163";
            return $_lO2p;
        }

    }

    class kooldatepicker extends kooldatetimepicker {

        var $_ll2u = FALSE;
        var $TimeFormat = "";

        function init() {
            parent::init();
            $this->TimeFormat = "";
        }

    }

    class kooltimepicker extends kooldatetimepicker {

        var $_lO2t = FALSE;
        var $DateFormat = "";

        function init() {
            parent::init();
            $this->DateFormat = "";
        }

    }

} ?>