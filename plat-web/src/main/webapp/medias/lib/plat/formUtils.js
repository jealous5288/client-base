/*****************************************************************
 * 表单通用方法（权限数据通用方法、数据操作工具函数）
 * 最后更新时间：2016-02-24
 * 最后更新人：zhan
 *****************************************************************/

/**********************************************
 * 标志位
 **********************************************/
var isIE = !!window.ActiveXObject;
var isIE6 = isIE && !window.XMLHttpRequest;
var isIE8 = isIE && !!document.documentMode;
var isIE7 = isIE && !isIE6 && !isIE8;

var _ajax = $.ajax;

var parentWin, crossOrigin = false, tempTop = false;
try {
    parentWin = window.parent;
    //平台开发的系统
    if (window.parent.RX) {
        if (window.parent.RX.config.defaultPath != window.RX.config.defaultPath) {
            tempTop = true;
        }
    } else {
        //外部系统
        tempTop = true;
    }
    if (window == window.parent) {
        tempTop = true;
    }
} catch (e) {
    crossOrigin = true;
    tempTop = true;
}

var _top = function () {
    if (tempTop) {
        return window;
    } else {
        var twin = window.parent;
        var i = 0;
        while (!twin.tempTop) {
            twin = twin.parent;
            i++;
            if (i > 10) {
                twin = window;
                tempTop = true;
            }
        }
        return twin;
    }
}();
if (tempTop) {
    //修改
    RX.loadCssBlocked([].concat(["layer", "/medias/plugin/loading/msgbox.css"]));
    RX.loadScriptBlocked(["layer", "/medias/lib/plat/layerManager.js", "msgbox"]);
}

//重写jquery的ajax方法
$.ajax = function (opt) {

    //备份opt中error和success方法
    opt.url = RX.handlePath(opt.url);
    var fn = {
        error: function (XMLHttpRequest, textStatus, errorThrown) {
        },
        success: function (data, textStatus) {
        }
    };
    if (opt.error) {
        fn.error = opt.error;
    }
    if (opt.success) {
        fn.success = opt.success;
    }

    //扩展增强处理
    var _opt = $.extend(opt, {
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //错误方法增强处理

            fn.error(XMLHttpRequest, textStatus, errorThrown);
        },
        success: function (data, textStatus) {
            //成功回调方法增强处理

            fn.success(data, textStatus);
        }
    });
    _ajax(_opt);
};

var _post = $.post;
//重写jquery的post方法
$.post = function (url, data, success, error) {
    //备份opt中error和success方法
    url = RX.handlePath(url);

    _post(url, data, success, error);
};

var _get = $.get;
//重写jquery的post方法
$.get = function (url, data, success, error) {
    //备份opt中error和success方法
    url = RX.handlePath(url);

    _get(url, data, success, error);
};
/**********************************************
 * 布局js控制
 **********************************************/
//初始化表单样式
function resizeForm() {
    $(".form_box").height($(window).height() - $(".operation_box").outerHeight() - $(".w_button_box").outerHeight());
    $(window).resize(function () {
        $(".form_box").height($(window).height() - $(".operation_box").outerHeight() - $(".w_button_box").outerHeight());
    })
}
//初始化列表样式
function resizeTable() {
    window.setTimeout(function () {
        $(".list_box").height($(window).height() - $(".operation_box").outerHeight() - $(".query_box").outerHeight() - 28);
        $(".list_box").width($("base_box").width());
    }, 1);
    $(window).resize(function () {
        $(".list_box").height($(window).height() - $(".operation_box").outerHeight() - $(".query_box").outerHeight() - 28);
        $(".list_box").width($("base_box").width());
    })
}
//载入中提示开启
function openLoading() {
    var height = Math.floor($(window).height() / 2 - 10);
    $(window.document.body).prepend("<div id='loadingGif' style='line-height:40px;height:100%;width:100%;text-align:center;position:absolute;padding-top: " + height + "px; background: #F9F9F9;opacity:0.8; -moz-opacity:0.8;filter: alpha(opacity=80)'>" +
        "<img align='absmiddle' src='" + RX.handlePath("/medias/images/plat/exp_loading.gif") + "'/>" +
        "<span>数据加载中...</span>" +
        "</div>");
}
//载入中提示关闭
function closeLoading() {
    $("#loadingGif").remove();
}

//页面滚动到第一个错误位置
function scrollToError() {
    var scrollTo = $(".TextBoxErr").eq(0), container = scrollTo.find(".form_box").eq(0);
    if (container.length) {
        container.scrollTop(
            scrollTo.offset().top - container.offset().top + container.scrollTop()
        );
    }
}

//给场景图绑定滚动事件
function bindScroll() {
    $(".prev").bind("click", function () {
        scrollToEnd("prev");
    });
    $(".next").bind("click", function () {
        scrollToEnd("next");
    });
}

//滚动到底
function scrollToEnd(type) {
    var scrollTo = $(".Boxcentont").scrollLeft();
    if (type == "next") {
        scrollTo = scrollTo + 200;
    } else {
        scrollTo = scrollTo - 200;
    }
    $(".Boxcentont").animate({scrollLeft: scrollTo}, "slow");
}

/**********************************************
 * 表单元素方法
 **********************************************/
/**
 * 获取表单jq元素
 */
$.getEle = function (modelName, property, type) {
    if (type == "layer") {
        return $("*[layer-model=" + modelName + "][link-property=" + property + "]");
    } else {
        return $("*[data-model=" + modelName + "][data-property=" + property + "]");
    }
}

/**
 * 隐藏表单元素与其标志td
 */
jQuery.fn.hideEleAndTag = function () {
    $(this).parent().addClass("hideElement");
    $(this).parent().prev().addClass("hideElement");
    return $(this);
}

/**
 * 隐藏表单元素
 */
jQuery.fn.hideEle = function () {
    $(this).addClass("hideElement");
    return $(this);
}

/**
 * 隐藏表单元素与其标志td
 */
jQuery.fn.showDisabledEle = function () {
    if ($(this).next().hasClass("spanshow")) {
        $(this).next().remove();
    }
    $(this).show();
    return $(this);
}

/**
 * 滚动到指定元素
 */
jQuery.fn.mScroll = function () {
    $("html,body").stop(true);
    $("html,body").animate({scrollTop: $(this).offset().top}, 1000);
}

/**
 * 隐藏表单元素与其标志td
 */
jQuery.fn.changeTag = function (value) {
    $(this).parent().prev().html(value);
    return $(this);
}

function checkSelected(gridmodel) {
    var sel = gridmodel.getSelect();
    if (sel.length > 0) {
        return sel;
    } else {
        _top.layer.alert("请先选择数据");
    }
    return null;
}

/**********************************************
 * 数据操作工具函数
 **********************************************/
$.prototype.val = function (base) {
    return function () {
        var s = this, n = s.next(), t = s.prop("tagName"), a = "value", p = s.attr(a), isset = arguments.length > 0,
            v = isset ? arguments[0] : null;
        //这里调用基类方法，当然基类方法在何时调用或者是否要调用取决于您的业务逻辑，在这里我们是要调用的，因为要保持它原有的功能。
        if (isset && typeof(base) == "function") {
            base.call(s, v);
            if (s.hasClass("spanparent")) {
                if (n != null && n.length > 0 && n.hasClass("spanshow")) {
                    if (t == "INPUT" && s.prop("type") == "text") {
                        n.text(base.call(s));
                    } else if (t == "SELECT") {
                        n.text(s.find("option:selected").text());
                    }
                }
            }
            if (s.prop("tagName") == "INPUT") {
                s.prop("title", v);
            }
            return s;
        } else {
            return base.call(s);
        }
    }
    //在这里传入基类方法
}($.prototype.val);

//文本框长度验证
function textareachk(obj, name) {
    var maxl = 0;
    if ($(obj).attr("readOnly")) {
        return;
    }
    var maxLength = parseInt($(obj).attr("maxLength"));
    if (obj != null && maxLength > 0) {
        if (maxl === 0) maxl = maxLength; //总长
        var s = obj.value.length;
        var v = obj.value;
        var len = s;
        if (len > maxl) {
            obj.value = obj.value.substr(0, maxl);
            if ($("#" + name)[0] != undefined) {
                $("#" + name)[0].innerHTML = "<span style=color:red>已输入：" + maxl + "/" + maxl + " 字符</spqn>";
            }
        }
        else {
            if ($("#" + name)[0] != undefined) {
                $("#" + name)[0].innerHTML = "已输入：" + len + "/" + maxl + " 字符";
            }
        }
    }
}

function replaceStrChar(str, reallyDo, replaceWith) {
    var e = new RegExp(reallyDo, "g");
    var words = str;
    if (str != null) {
        words = str.toString().replace(e, replaceWith);
    }
    return words;
}

//匹配checked状态
function matchChecked(collection) {
    if (collection != null && collection.models.length > 0) {
        $.each(collection.models, function (key, model) {
            if (model.checked) {
                model.set("sfyx_st", "VALID");
            } else {
                model.set("sfyx_st", "UNVALID");
            }
        })
    }
}
/*************************
 * 非空字符串判断
 * @param str
 * @returns {boolean}
 *************************/
function isNotNullStr(str) {
    if (str != null && $.trim(str.toString()) != "") {
        return true;
    }
    return false;
}
/*************************
 * 非空元素判断
 * @param str
 * @returns {boolean}
 *************************/
function isNotNullObj(obj) {
    if (obj != undefined && obj != null) {
        return true;
    }
    return false;
}

function getDictData(data) {
    if (data && data.data && data.data.sysSubDictList) {
        return data.data.sysSubDictList;
    } else {
        return [];
    }
}

function getDictItem(data) {
    return {code: data.code, value: data.value, remark: data.remark, pcode: data.pcode}
}
/**
 * 实现js缓存的方法
 * @param jspath 文件名称 对应dictType
 * @param pcode 父项code
 * @returns {*}
 * @constructor
 */
function JsCache(jspath, pcode) {
    //是否可以缓存
    if (!RX.browser.canCache) {
        dictData = getZdFromJs(jspath, pcode, true);
    } else {
        if (!_top.RX) {
            _top.RX = {};
        }
        if (!_top.RX._dictPool) {
            _top.RX._dictPool = {};
        }
        var dictData = [], newData = [];
        var poolData = _top.RX._dictPool[jspath];
        if (poolData) {
            dictData = poolData;
        } else {
            dictData = getZdFromJs(jspath, pcode, false);
            if (dictData) {
                _top.RX._dictPool[jspath] = dictData;
            }
        }
    }
    if (pcode && pcode != null) {
        if (typeof(pcode) == "object") {
            if (pcode.length > 0) {
                for (var m = 0; m < pcode.length; m++) {
                    $.each(dictData, function (i, item) {
                        if (item.pcode == pcode[m]) {
                            newData.push(item);
                        }
                    });
                }
            }
        } else {
            $.each(dictData, function (i, item) {
                if (item.pcode == pcode) {
                    newData.push(item);
                }
            });
        }

        return newData;
    } else if (pcode === "") {
        $.each(dictData, function (i, item) {
            if (item.pcode == null) {
                item.pcode = "";
                newData.push(item);
            }
        });
        return newData;
    } else {
        return dictData;
    }
}

function getZdFromJs(jspath, pcode, canCache) {
    var dictCode = jspath;
    var dictData = [];
    var loadpath = "/medias/cache/" + jspath + ".js?r=" + (canCache ? Math.random() : "");
    $.ajax({
        async: false,
        type: "GET",
        url: loadpath,
        dataType: "JSON",
        data: {},
        success: function (jsondata, textStatus) {
            //判断是否过期 如果过期 则删除过期文件 并使用服务器发回的最新数据
            if (jsondata && jsondata.expires && jsondata.expires != null) {
                var expires = jsondata.expires;
                var dateExp = expires.replace(/\-/gi, "/");
                var timeExp = new Date(dateExp).getTime();
                var timeNow = new Date().getTime();
                if (false) {
                    //if(timeExp<timeNow){//过期了
                    $.ajax({
                        async: false,
                        type: "POST",
                        url: "/jscache/jspath",
                        data: {dictCode: dictCode, jspath: jspath, forceUpdate: true},
                        dataType: "JSON",
                        success: function (response2) {
                            dictData = getDictData(response2);
                        }
                    });
                } else {//没过期
                    dictData = getDictData(jsondata);
                }

            } else {//文件有误 更新
                $.ajax({
                    async: false,
                    type: "POST",
                    url: "/jscache/jspath",
                    data: {dictCode: dictCode, jspath: jspath, forceUpdate: true},
                    dataType: "JSON",
                    success: function (response1) {
                        dictData = getDictData(response1);
                    }
                });
            }
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (XMLHttpRequest.status = 404) {//文件不存在，择请求服务器生成文件
                $.ajax({
                    async: false,
                    type: "POST",
                    url: "/jscache/jspath",
                    data: {dictCode: dictCode, jspath: jspath},
                    dataType: "JSON",
                    success: function (response) {
                        dictData = getDictData(response);
                    }
                });
            }
        }
    });
    return dictData;
}

/**
 * 合并js字典获取
 * @param mergePath 合并请求的路劲
 * @param dictCodes 合并请求的参数["htlb",".."] 字典项类型code
 * @param jspath 当前字典项的类型code htlb
 * @param pcode 父项
 * @returns {*}
 * @constructor
 */
function JsMergeCache(mergePath, dictCodes, jspath, pcode) {
    debugger
    var mergePathCache = mergePath + "Cache";
    var loadpath = "/medias/cache/" + mergePathCache + ".js?r=" + Math.random();
    var dictData = [];
    $.ajax({
        async: false,
        type: "GET",
        url: loadpath,
        dataType: "JSON",
        data: {},
        success: function (jsondata, textStatus) {
            //判断是否过期 如果过期 则删除过期文件 并使用服务器发回的最新数据
            if (jsondata && jsondata.expires && jsondata.expires != null) {
                var expires = jsondata.expires;
                var dateExp = expires.replace(/\-/gi, "/");
                var timeExp = new Date(dateExp).getTime();
                var timeNow = new Date().getTime();
                if (false) {
                    //if(timeExp<timeNow){//过期了
                    $.ajax({
                        async: false,
                        type: "POST",
                        url: "/jscache/jsMergePath",
                        data: {mergePath: mergePathCache, dictCodes: dictCodes, forceUpdate: true},
                        dataType: "JSON",
                        success: function (response2) {
                            if (typeof response2.data[jspath] != "undefined") {
                                dictData = eval(response2.data[jspath]);
                            } else {
                                dictData = [];
                            }
                        }
                    });
                } else {//没过期
                    //dictData = jsondata.data;
                    if (typeof jsondata.data[jspath] != "undefined") {
                        dictData = eval(jsondata.data[jspath]);
                    } else {
                        dictData = [];
                    }
                }

            } else {//文件有误 更新
                $.ajax({
                    async: false,
                    type: "POST",
                    url: "/jscache/jsMergePath",
                    data: {mergePath: mergePathCache, dictCodes: dictCodes, forceUpdate: true},
                    dataType: "JSON",
                    success: function (response1) {
                        if (typeof response1.data[jspath] != "undefined") {
                            dictData = eval(response1.data[jspath]);
                        } else {
                            dictData = [];
                        }
                    }
                });
            }
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (XMLHttpRequest.status = 404) {//文件不存在，择请求服务器生成文件
                $.ajax({
                    async: false,
                    type: "POST",
                    url: "/jscache/jsMergePath",
                    data: {mergePath: mergePathCache, dictCodes: dictCodes},
                    dataType: "JSON",
                    success: function (response) {
                        if (typeof response.data[jspath] != "undefined") {
                            dictData = eval(response.data[jspath]);
                        } else {
                            dictData = [];
                        }
                    }
                });
            }
        }
    });

    if (pcode && pcode != null) {
        var newData = [];
        if (typeof(pcode) == "object") {
            if (pcode.length > 0) {
                for (var m = 0; m < pcode.length; m++) {
                    $.each(dictData, function (i, item) {
                        if (item.pcode == pcode[m]) {
                            newData.push(item);
                        }
                    });
                }
            }
        } else {
            $.each(dictData, function (i, item) {
                if (item.pcode == pcode) {
                    newData.push(item);
                }
            });
        }
        return newData;
    } else if (pcode === "") {
        var newData = [];
        $.each(dictData, function (i, item) {
            if (item.pcode == null) {
                item.pcode = "";
                newData.push(item);
            }
        });
        return newData;
    } else {
        return dictData;
    }
}

/**
 * 构造页面功能权限对象
 * @param pageCode 页面编码
 * @param actionAuthCodes 功能权限编码
 * @constructor
 */
function PageActionAuth(pageCode, actionAuthCodes) {
    this.pageCode = pageCode;
    this.actionAuthCodes = actionAuthCodes;
}
PageActionAuth.prototype.hasActionAuth = function (actionAuthCode) {
    var hasTag = false;
    var actionAuthCodes = this.actionAuthCodes;
    if (actionAuthCodes && actionAuthCodes.length > 0) {
        if ($.inArray(actionAuthCode, actionAuthCodes) > -1) {
            hasTag = true;
        }
    }
    return hasTag;
};
/**
 * 根据页面编码获取功能权限
 * @param pageCode 模块编码
 * @returns {pageActionAuth}
 */
function getPageActionAuth(pageCode) {
    var pageActionAuth = new PageActionAuth(pageCode, null);
    $.ajax({
        async: false,
        type: "POST",
        url: "/plat/getPageActionAuthByCode",
        data: {pageCode: pageCode},
        success: function (ar) {
            if (ar.success) {
                if (ar.msg == "2") {
                    var actionAuthCode = ar.data;
                    if (actionAuthCode && actionAuthCode.length > 0) {
                        pageActionAuth.actionAuthCodes = actionAuthCode.split(",");
                    }
                } else if (ar.msg == "1") {
                    return ar.data;
                }
            } else {
                layer.alert("获取页面功能权限出错");
            }
        }
    });
    return pageActionAuth;
}

function getFileSize(byteNum) {
    var byteFloat = parseFloat(byteNum);
    if (byteFloat / 1024 <= 1) {
        return byteFloat + "B";
    } else {
        byteFloat = (byteFloat / 1024).toFixed(2);
    }
    if (byteFloat / 1024 <= 1) {
        return byteFloat + "K";
    } else {
        byteFloat = (byteFloat / 1024).toFixed(2);
    }
    if (byteFloat / 1024 <= 1) {
        return byteFloat + "M";
    } else {
        byteFloat = (byteFloat / 1024).toFixed(2);
    }
    return byteFloat + "G";
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

/**
 *获取当前时间
 */
function getNow(format) {
    var now = new Date();
    return now.Format(format);
}

//完善时间格式函数
function fillZero(num) {
    if (num < 10) {
        return "0" + num;
    } else {
        return num;
    }

}

function getDateRex(length) {
    if (length >= 19) {
        return "%y-%M-%d %H:%m:%s";
    } else if (length <= 8 && length > 0) {
        return "%H:%m:%s";
    }
}
//计算两个日期的时间差
function compareDate(startDate, endDate) {
    if (isNotNull(startDate) && isNotNull(endDate)) {
        var startTime = (new Date(startDate)).getTime();//传过来的开始时间转换为毫秒
        var endTime = (new Date(endDate)).getTime();
        var result = (startTime - endTime) / 24 / 60 / 60 / 1000;
        if (result >= 0) {
            return result;
        }
    }
}
//判断对象不是null也不是空字符串
function isNotNull(str) {
    return str != null && str != '';
}

//汉字转码
function encode(val) {
    return encodeURI(encodeURI(val));
}
//汉字解码
function decode(val) {
    return decodeURI(decodeURI(val));
}

/**
 * 回车事件
 * @param fn
 */
function regEnter(fn) {
    document.onkeydown = function (event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && (e.keyCode == 13 || e.which == 13)) { // enter 键
            if (!$('span.pControl input[type="text"]').is(":focus"))
                fn();
            return false;
        }
    };
}

//替换指定传入参数的值,paramName为参数,replaceWith为新值
function replaceParamVal(paramName, replaceWith) {
    var oUrl = this.location.href.toString();
    var re = eval('/(' + paramName + '=)([^&]*)/gi');
    var nUrl = oUrl.replace(re, paramName + '=' + replaceWith);
    this.location = nUrl;
}
/*****************************************************************
 获取页面传参工具方法"2015-11-16 13:13:13".match(/^(d{4})(-)(d{2})(-)(d{2}) (d{2}):(d{2}):(d{2})$/)
 *****************************************************************/

/**
 * 采用正则表达式获取地址栏参数
 * @param name
 * @returns {*}
 * @constructor
 */
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}

function GetParentQueryString(name) {
    if (name) {
        var query = window.location.search;
        if (query.indexOf("&") > -1) {
            query = query.substr(query.indexOf('&') + 1, query.length);
            if (query != null)return unescape(query);
        }
        return null;
    } else {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = document.referrer.substr(1).match(reg);
        if (r != null)return unescape(r[2]);
        return null;
    }
}

/**
 * 截取字符串,后面多的显示省略号
 * @param data
 * @param length
 * @returns {*}
 */
function getSubStr(data, length) {
    if (data != null && "" != data && data.length > length) {
        return data.substring(0, length) + "...";
    } else {
        return data;
    }
}

window.forms = {
    addAttachment: function (grid, uuid, data, isWorkFlow, options) {
        var data = data || {};
        if (typeof grid == 'string') {
            grid = $("#" + grid);
        }
        var gridid = grid.attr("id");
        data.uuid = uuid;
        data.gridid = gridid;
        var options = options || {};
        options = $.extend({}, {width: 500, height: 350}, options);
        if (!isWorkFlow) {
            window.showDialog('attachment', options, forms.getContextPath() + "/form/addFileUpload?" + $.param(data), grid, true);
        } else {
            window.showDialog('attachment', options, forms.getContextPath() + "/form/addWorkFlowAttachment?" + $.param(data), grid, true);
        }
    }, delAttachment: function (grid, isWorkFlow) {
        if (typeof grid == "string") {
            grid = $("#" + grid);
        }
        $.omMessageBox.confirm({
            title: '确认删除', content: '删除的数据将不可恢复，你确定要这样做吗？', onClose: function (v) {
                if (v) {
                    var selectedRecords = grid.omGrid('getSelections', true);
                    var delJson = [];
                    $.each(selectedRecords, function (i, n) {
                        delJson.push(n.ID);
                    });
                    $.ajax({
                        type: "get",
                        url: forms.getContextPath() + "/form/deleteAttachment",
                        data: {ids: delJson.join(","), isWorkFlow: isWorkFlow, c: Math.random()},
                        success: function (val) {
                            grid.omGrid('reload');
                        }
                    })
                }
            }
        });
    }, getContextPath: function () {
        var path = location.pathname;
        return path.substring(0, path.indexOf("/", 1));
    }, uuid: function (len, radix) {
        var CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
        var chars = CHARS, uuid = [], i;
        radix = radix || chars.length;
        if (len) {
            for (i = 0; i < len; i++)
                uuid[i] = chars[0 | Math.random() * radix];
        } else {
            var r;
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
            uuid[14] = "4";
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join("");
    }, isIdCardNo: function isIdCardNo(g, m) {
        g = $.trim(g);
        if (g == null || g.length == 0) {
            return true;
        }
        g = g.toUpperCase();
        if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(g))) {
            alert("输入的身份证号长度不对，或者号码不符合规定\n15位号码应全为数字，18位号码末位可以为数字或X");
            return false;
        }
        var h, o;
        h = g.length;
        if (h == 15) {
            o = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
            var n = g.match(o);
            var c = new Date("19" + n[2] + "/" + n[3] + "/" + n[4]);
            var b;
            b = (c.getYear() == Number(n[2])) && ((c.getMonth() + 1) == Number(n[3])) && (c.getDate() == Number(n[4]));
            if (!b) {
                alert("输入的身份证号里出生日期不正确");
                return false;
            } else {
                var k = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                var l = new Array("1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2");
                var j = 0, f;
                g = g.substr(0, 6) + "19" + g.substr(6, g.length - 6);
                for (f = 0; f < 17; f++) {
                    j += g.substr(f, 1) * k[f];
                }
                g += l[j % 11];
            }
        } else {
            if (h == 18) {
                o = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
                var n = g.match(o);
                var c = new Date(n[2] + "/" + n[3] + "/" + n[4]);
                var b;
                b = (c.getFullYear() == Number(n[2])) && ((c.getMonth() + 1) == Number(n[3])) && (c.getDate() == Number(n[4]));
                if (!b) {
                    alert("输入的身份证号里出生日期不正确");
                    return false;
                } else {
                    var a;
                    var k = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                    var l = new Array("1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2");
                    var j = 0, f;
                    for (f = 0; f < 17; f++) {
                        j += g.substr(f, 1) * k[f];
                    }
                    a = l[j % 11];
                    if (a != g.substr(17, 1)) {
                        alert("18位身份证的校验码不正确！最后一位应该为：" + a);
                        $("#" + m + "").val($("#" + m + "").val().substr(0, 17) + a);
                        return false;
                    }
                }
            }
        }
        var e = g.substr(6, 4) + "-" + Number(g.substr(10, 2)) + "-" + Number(g.substr(12, 2));
        var d = {
            11: "北京",
            12: "天津",
            13: "河北",
            14: "山西",
            15: "内蒙古",
            21: "辽宁",
            22: "吉林",
            23: "黑龙江",
            31: "上海",
            32: "江苏",
            33: "浙江",
            34: "安徽",
            35: "福建",
            36: "江西",
            37: "山东",
            41: "河南",
            42: "湖北",
            43: "湖南",
            44: "广东",
            45: "广西",
            46: "海南",
            50: "重庆",
            51: "四川",
            52: "贵州",
            53: "云南",
            54: "西藏",
            61: "陕西",
            62: "甘肃",
            63: "青海",
            64: "宁夏",
            65: "新疆",
            71: "台湾",
            81: "香港",
            82: "澳门",
            91: "国外"
        };
        if (d[parseInt(g.substr(0, 2))] == null) {
            alert("错误的地区码：" + g.substr(0, 2));
            return false;
        }
        if (Number(g.substr(6, 2)) < 19) {
            alert("输入身份证号码的出生日期须在1900年之后(" + e + ")");
            return false;
        }
        document.getElementById(m).value = g;
        return true;
    }, clearNoNumAndD: function (obj) {
        obj.val(obj.val().replace(/[^\d.]/g, "").replace(/^\./g, "").replace(/\.{2,}/g, ".").replace(".", "$#$").replace(/\./g, "").replace("$#$", "."));
    }, clearNoNum: function (obj) {
        obj.val(obj.val().replace(/[^\d]/g, ''));
    }
};

function isShow(id, is) {
    if (is) {
        $("#" + id).show();
    } else {
        $("#" + id).hide();
    }
}

/**********************************************
 * 权限数据通用方法
 **********************************************/
/**
 * 设置cookie的方法
 * @param c_name
 * @param value
 * @param expiredays
 */
function setCookie(c_name, value, expiredays) {
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = c_name + "=" + escape(value) +
        ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
}
/**
 * 获取cookie的方法
 * @param c_name
 * @returns {*}
 */
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = document.cookie.length
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
}

/**
 * 初始化权限数据
 *全局的权限数据变量
 *authority;（cookie中的代码）
 */
function loadAuthority() {
    $.post("getAuth", {}, function (data) {
        setCookie("authority", JSON.stringify(data));
    });
}
/**
 * 获取权限数据：需要用权限的模块在引用main.js后调用该无参方法，
 * @returns {*}返回JSON格式的权限数据。
 */
function getAuthority() {
    var authority = getCookie("authority");
    if (authority != null && authority != '')
        return JSON.parse(authority);
    else
        return null;
}

//深度复制方法
function clone(obj) {
    function Fn() {
    }

    Fn.prototype = obj;
    var o = new Fn();
    for (var a in o) {
        if (typeof o[a] == "object") {
            o[a] = clone(o[a]);
        }
    }
    return o;
}

String.prototype.trim = function () {
    return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};

//ajax窗口遮罩  //在当前页增加遮罩
function pageAjax(text, inWin) {
    if (text) {
        if (typeof text == "boolean") {
            inWin = true;
            text = "数据处理中，请稍候...";
        }
    } else {
        text = "数据处理中，请稍候...";
    }
    if (_top.ZENG) {
        $("body").ajaxStart(function () {
            //     index = layer.msg(text);
            _top.ZENG.msgbox.show(text, 6, 0, null, inWin ? window : null);
        }).ajaxStop(function () {
            _top.ZENG.msgbox.hide(100, inWin ? window : null);
        });
    }
}


/**
 * 可维护性列表注册与实现
 * @param moduleId 模块id
 * @returns {*}
 * @constructor
 */
function initTableSetting(gridModel, columns, searchJson) {
    gridModel.searchView;
    columns = columns || gridModel.get("columns");
    searchJson = searchJson || gridModel.get("searchJson");
    var settingObj;  //setting面板
    if (!columns) {
        columns = [];
    }
    var tempJson;
    var tempKey;
    if (!searchJson) {
        tempJson = {};
    } else {
        for (key in searchJson) {
            tempKey = key;
            tempJson = searchJson[key];
        }
    }
    var jLen = 0;
    for (key in tempJson) {
        jLen++;
    }

    var newColumns = columns;  //设置后的columns
    var newSearchJson = tempJson;   //设置后的SearchJson
    if ($(".btn-setting").length > 0) {
        if (gridModel || gridModel.searchView) {
            $(".btn-setting").live("click", function () {
                if (!settingObj) {
                    var cloumnRows = Math.ceil(columns.length / 3);
                    cloumnRows = cloumnRows > 0 ? cloumnRows + 1 : 0;
                    var searchRows = Math.ceil(jLen / 3);
                    searchRows = searchRows > 0 ? searchRows + 1 : 0;
                    var str = "<div class='settingObj' style='display:none;background-color:#ccc;position:absolute;" +
                        "top:50px;right:10px;width:400px;height:" + ((cloumnRows + searchRows) * 20 + 30) + "px;'>";
                    if (cloumnRows > 0) {
                        var colStr = "<span style='height:20px'><b>列配置：</b></span>";
                        colStr += "<table><col width='130px'><col width='130px'><col width='130px'><tr>";
                        var i = 0;
                        for (var i = 0; i < columns.length; i++) {
                            if (i > 0 && i % 3 == 0) {
                                colStr += "</tr><tr>"
                            }
                            colStr += "<td style='height:20px;'><label>" +
                                "<input type='checkbox' name='settingColumn' value='" + columns[i].id + "' checked>" +
                                columns[i].title + "</label></td>";
                        }
                        str += colStr + "</tr></table>";
                    }
                    if (searchRows > 0) {
                        var serStr = "<span style='height:20px'><b>搜索字段配置：</b></span>";
                        serStr += "<table><col width='130px'><col width='130px'><col width='130px'><tr>";
                        var i = 0;
                        for (key in tempJson) {
                            if (i > 0 && i % 3 == 0) {
                                serStr += "</tr><tr>"
                            }
                            if (tempJson[key].display) {
                                serStr += "<td style='height:20px;'><label>" +
                                    "<input type='checkbox' name='settingSearch' value='" + key + "' checked>" +
                                    tempJson[key].tagName + "</label></td>";
                                i++;
                            }
                        }
                        str += serStr + "</tr></table>";
                    }
                    str += "<input type='button' value='确定' style='color:black' id='settingSure'/></div>";
                    settingObj = $(str);
                    $("body").append(settingObj);
                    $("#settingSure").bind("click", function () {
                        if (gridModel) {
                            newColumns = [];
                            $(".settingObj input[name=settingColumn]:checked").each(function (i, t) {
                                for (var i = 0; i < columns.length; i++) {
                                    if ($(t).val() == columns[i].id) {
                                        newColumns.push(columns[i]);
                                        break;
                                    }
                                }
                            })
                            gridModel.set("columns", newColumns);
                            gridModel.render();
                        }
                        if (gridModel.searchView) {
                            newSearchJson = {};
                            $(".settingObj input[name=settingSearch]:checked").each(function (i, t) {
                                var key2 = $(t).val();
                                newSearchJson[key2] = tempJson[key2];
                            })
                            //隐藏区json恢复
                            for (key in tempJson) {
                                if (!tempJson[key].display) {
                                    newSearchJson[key] = tempJson[key];
                                }
                            }
                            var json = {};
                            json[tempKey] = newSearchJson;
                            gridModel.set("searchJson", json);
                            gridModel.buildSearchView();
                        }
                        settingObj.hide();
                        $("body").unbind('click.setting');
                    })
                }
                if (settingObj.is(":hidden")) {
                    settingObj.show();
                    $("body").bind('click.setting', function (e) {
                        if (!$(e.target).hasClass("settingObj") && !$(e.target).parents().hasClass("settingObj")) {
                            settingObj.hide();
                            $("body").unbind('click.setting');
                            e.stopPropagation();
                        }
                    })
                }
            })
        }
        return {
            getNewColumns: function () {
                return newColumns;
            },
            getNewSearchJson: function () {
                if (!tempKey) {
                    return null;
                } else {
                    return {tempKey: newSearchJson};
                }
            }
        };
    } else {
        if (window.console && window.console.log) {
            console.log("页面不存在setting按钮，无法初始化设置面板。");
        }
        return {};
    }
}

//获取方法形参个数
function getFuncParameters(func) {
    if (typeof func == 'function') {
        var mathes = /[^(]+\(([^)]*)?\)/gm.exec(Function.prototype.toString.call(func));
        if (mathes[1]) {
            var args = mathes[1].replace(/[^,\w]*/g, '').split(',');
            return args;
        }
    }
}

// var t_alert = function(a,b,d,g,win){
//     if(!win){
//         win = window;
//     }
//     _top.alertWinName = win.name;
//     try{_top.layer.rx_alert(a,b,d,g);}catch(e){}
// }
// var t_confirm = function(a,b,d,g){
//     _top.alertWinName = window.name;
//     _top.layer.rx_confirm(a,b,d,g);
// }

//iframe跳转接口（兼容ie6性能优化）
function gotoUrl(obj, url) {
    var el = obj[0], iframe = el.contentWindow;
    if (iframe != null) {
        if (iframe.closeFunc) {
            iframe.closeFunc();
        }
    }
    if (el) {
        if (isIE) {
            el.src = 'about:blank';
            try {
                iframe.document.write('');
                iframe.close();
            } catch (e) {
            }
        }
        el.src = RX.handlePath(url);
    }
}

//layer注册(判断当前使用的layer版本是否和模型需要的layer版本相同，是则直接使用top层layer作为window的layer）
if (_top.layer && _top.layer.RXLayerVersion == 1) {
    window.layer = _top.layer;
    // window.layer.alert = t_alert;
    // window.layer.confirm = t_confirm;
}
//窗口管理模块（如果top层已经注册过layerManager则将所有窗口管理接口赋予本window，否则在本窗口重新注册窗口管理，并将接口赋予top层）
if (_top.hasLayerManager) {
    //加入层次页面（√）
    window.pushStackWin = _top.pushStackWin;
    //加入子iframe页面（√）
    window.addFrameWin = _top.addFrameWin;
    //获取前一个层次的关联窗口（√）
    window.getPrevWin = _top.getPrevWin;

    //获取前一个有reloadTable的关联窗口 （√）
    window.getPrevReloadWin = _top.getPrevReloadWin;
    //获取父窗口window（zp add）
    window.getParentWin = _top.getParentWin;
    //刷新前一个有reloadTable的关联窗口 （√）
    window.reloadPrevWin = _top.reloadPrevWin;
    //向前关闭窗口（√）
    window.closeWin = _top.closeWin;
    //向前关闭所有窗口 （√）     待关闭页面加上全局变量notCloseTag = true，若非最上层页面，则停止关闭
    window.closeAllWin = _top.closeAllWin;
    //弹出层内部调用接口，处理关闭后置
    window.closeLayerWin = _top.closeLayerWin;
    //获取指定窗口的数据   （√）
    window.winData = _top.winData;
    //设置页面历史搜索记录
    window.setHistorySearchData = _top.setHistorySearchData;
    //获取页面历史搜索记录
    window.getHistorySearchData = _top.getHistorySearchData;
    //获取最上层窗口
    window.getUpperestWin = _top.getUpperestWin;
    //获取需要的子窗口的win的name
    window.getFrameName = _top.getFrameName;
    //获取窗口下子窗口的名称数组
    window.getFrameNameArray = _top.getFrameNameArray;
    //关闭窗口（需关闭window为参数）
    window.closeLayer = _top.closeLayer;
    //新版窗口管理打开弹出层
    window.openStack = _top.openStack;
    //获取回退跳转路径
    window.getToTagUrl = _top.getToTagUrl;
    window.handleSelect = _top.handleSelect;
    window.handleFrameSelect = _top.handleFrameSelect;
    //获取工作流平铺页面 页面设置为
    window.findWorkflowFrameWin = function (win) {
        return _top.findWorkflowFrameWin(win || window);
    };

    //前往路径
    window.gotoLocation = function (url, name) {
        _top._gotoLocation(window, url, name);
    };
    //前往路径
    window.freshLocation = function (url, name) {
        _top._freshLocation(window, url, name);
    };
    //路径回退，index回退页数,url为可定制的新url，如不填写，则以历史url为准;name为可定制的新name，如不填写，则以历史name为准
    window.backLocation = function (index, url, name) {
        _top._backLocation(window, index, url, name);
    };
    //（暂时停用）回退历史，bindex为退回次数，默认为1
    window.backHistory = function (bindex) {
        _top._backHistory(window, bindex);
    };
    //iframe路径跳转，两个参数，第一个为iframe的jquery选择器元素，第二个为跳转的url
    window.frameGoto = _top.frameGoto;
    //主菜单点击跳转，两个参数，第一个为点击的菜单标签的jquery选择器元素，第二个为跳转的url（可缺省）
    window.clickMainMenu = _top.clickMainMenu;
    //子菜单点击跳转，两个参数，第一个为点击的菜单标签的jquery选择器元素，第二个为跳转的url（可缺省）
    window.clickSubMenu = _top.clickSubMenu;
    //点击其他菜单时，清除未办理的流程实例
    window.menuFlushFlow = _top.menuFlushFlow;
    //根据top层权限数据显示菜单，传入参数obj，menu的li集合的上级元素
    window.showMenu = _top.showMenu;
    //获取用户相关信息
    window.getUserInfo = _top.getUserInfo;
    window.showDialog = _top.showDialog;
} else {

    _top.hasLayerAlert = false;

    _top.flushFlowTaskId = null;
    //winType有三种：
    //stack（堆栈页面，有上下顺序）、
    //frame（子窗口页面，有父页面，父页面一般为stack页面）、
    //top（stack页面的最顶层，也是frame页面的始祖）

    //窗口仓储
    var winStore = new Object();

    var upperestName = "";

    //从仓储中查找页面窗口对象(未传入win则查找top层页面窗口对象)
    function findWinPage(name) {
        name = name || _top.window.name;
        return winStore[name];
    }

    function findChildWinByName(win, name) {
        if (win.name == name) {
            return win;
        } else {
            var frames = win.frames, length = frames.length;
            for (var i = 0; i < length; i++) {
                var targetWin = findChildWinByName(frames[i], name);
                if (targetWin) {
                    return targetWin;
                }
            }
        }
    }

    function findPageWin(page) {
        if (page && page.name) {
            // var frames = window.frames;
            // for()
            //  if(name == "MainIframeR"){
            //      return window["MainIframe"]["MainIframeR"];
            //  }else{
            //      var win = window[page.name];
            //      if(!win) {
            //          win = window["MainIframe"][page.name];
            //          if (!win) {
            //              win = window["MainIframe"]["MainIframeR"][page.name];
            //          }
            //      }
            //      return win;
            //  }
            return findChildWinByName(window, page.name);
        }
    }

    function findWinByName(name) {
        if (name) {
            return findChildWinByName(window, name);
        }
    }

    //往仓储中存入页面窗口对象
    function addWinPage(winPage) {
        if (winStore[winPage.name]) {
            winPage.data = winStore[winPage.name].data;
        }
        winStore[winPage.name] = winPage;
    }

    //页面窗口类构造声明
    var WinPage = function (win, type, sWin, param) {
        var sPage = (sWin ? findWinPage(sWin.name) : null);
        var twin = win || _top.window;
        this.name = twin.name;
        this.type = type || "frame";
        this.dataPool = param || (findWinPage(this.name) && findWinPage(this.name).dataPool) || new Object();
        this.frameWinPool = new Array();
        this.history = new Array();
        if (type == "frame") {
            if (sPage) {
                this.parentName = sPage.name;
                if ($.inArray(this.name, sPage.frameWinPool) < 0) {
                    sPage.frameWinPool.push(this.name);
                }
            }
        } else if (type == "stack") {
            if (sPage) {
                this.prevName = sPage.name;
                sPage.nextName = this.name;
            }

            upperestName = this.name;
        }

    }

    //页面窗口属性声明
    WinPage.prototype = {
        type: "",
        name: "",
        dataPool: null,
        frameWinPool: null,
        prevName: "",
        nextName: "",
        parentName: "",
        history: null,
        // relateName:"",
        // workName:"",
        frameIndex: 0,
        data: function (key, value) {
            var p = this;
            if (arguments.length === 0) {
                return p.dataPool;
            }
            if (!key && key !== 0) {
                throw new Error("方法PageWin.data参数key赋值错误！");
            } else if (typeof(arguments[1]) === "undefined") {
                return p.dataPool[key];
            } else {
                p.dataPool[key] = value;
            }
            return p;
        },
        getFrameName: function () {
            return "son" + (this.frameIndex++) + "_" + this.name;
        }
    }

    //对外接口

    //加入层次页面（√）
    window.pushStackWin = function (win, relateWin, param) {
        if (!win) {
            win = {name: getFrameName(relateWin)};
        }
        var newPage = new WinPage(win, "stack", relateWin, param);
        addWinPage(newPage);
        return newPage.name;
    }
    //加入子iframe页面（√）
    window.addFrameWin = function (win, parentWin, param) {
        if (!win) {
            win = {name: getFrameName(parentWin)};
        }
        var newPage = new WinPage(win, "frame", parentWin, param);
        addWinPage(newPage);
        return newPage.name;
    }
    //获取前一个层次的关联窗口 （√）
    window.getPrevWin = function (index, win) {
        index = index || 1;
        var winPage = findWinPage(win ? win.name : upperestName);
        for (var i = 0; i < index; i++) {
            if (winPage.prevName) {
                winPage = findWinPage(winPage.prevName);
            } else {
                if (winPage.type == "frame") {
                    winPage = findWinPage(winPage.parentName);
                }
                winPage = findWinPage(winPage.prevName);
            }
        }
        var twin = findPageWin(winPage);
        return findPageWin(winPage);
    }
    //获取前一个有reloadTable的关联窗口 （√）
    window.getPrevReloadWin = function (index, win) {
        index = index || 1;
        var winPage = findWinPage(win ? win.name : upperestName);
        var reloadWin = null;
        for (var i = 0; i < index; i++) {
            reloadWin = null;
            while (winPage.prevName || winPage.parentName) {
                if (winPage.type == "frame") {
                    winPage = findWinPage(winPage.parentName);
                } else {
                    winPage = findWinPage(winPage.prevName);
                }
                var twin = findPageWin(winPage);
                if (twin && twin.reloadTable) {
                    reloadWin = twin;
                    break;
                } else {
                    twin = null;
                }
            }
        }
        return reloadWin;
    }
    //刷新前一个有reloadTable的关联窗口 （√）
    window.reloadPrevWin = function (index, win) {
        var reloadWin = getPrevReloadWin(index, win);
        if (reloadWin && reloadWin.reloadTable) {
            reloadWin.reloadTable();
        }
    }
    //或取下一个窗口（×）
    window.getNextWin = function (index, win) {

    }
    //获取父窗口window（zp add）
    window.getParentWin = function (win) {
        if (!win) {
            return;
        }
        var selfPage;
        var parentPage;
        if (typeof win == "string") {
            selfPage = findWinPage(win);
        } else {
            selfPage = findWinPage(win.name);
        }
        if (selfPage || selfPage.parentName) {
            parentPage = findWinPage(selfPage.parentName);
            if (parentPage)return findPageWin(parentPage);
        } else {
            return;
        }
    };
    //弹出层内部调用接口，处理关闭后置
    window.closeLayerWin = function (name) {
        if (!name)return;
        var upperestPage = findWinPage(name);

        while (upperestPage.type == "frame") {
            upperestPage = findWinPage(upperestPage.parentName);
        }
        if (upperestPage.type !== "top") {
            if (name == upperestName) {
                var upperestPrevPage = findWinPage(upperestPage.prevName);
                while (upperestPrevPage && upperestPrevPage.type == "frame") {
                    upperestPrevPage = findWinPage(upperestPrevPage.parentName);
                }
                upperestName = upperestPrevPage.name;
            }
            var prevPage = findWinPage(upperestPage.prevName);
            if (prevPage.nextName == name) {
                prevPage.nextName = "";
            }
            delete winStore[upperestPage.name];
        }
    };

    //找stack层
    function findStackWin(winPage) {
        if (winPage.type == "frame") {
            return findStackWin(findWinPage(winPage.parentName));
        } else {
            return winPage;
        }
    }

    window.handleFrameSelect = function (win, isShow, notHandlePrev) {
        if (win) {
            if (!notHandlePrev) {
                var handlePage = findWinPage(win.name);
                while (handlePage.parentName && handlePage.parentName != "top") {
                    var frameWin = findPageWin(handlePage);
                    if (frameWin) {
                        $(frameWin.document).find("select").each(function (si, st) {
                            st = $(st);
                            if (isShow) {
                                if (st.hasClass("_zbselect") && !st.hasClass("_zbtabselect")) {
                                    st.removeClass("_zbselect").show();
                                }
                            } else {
                                if (!st.is(":hidden") && !st.hasClass("_zbtabselect")) {
                                    st.addClass("_zbselect").hide();
                                }
                            }
                        })
                    }
                    handlePage = findWinPage(handlePage.parentName);
                }
            }
            $(win.document).find("select").each(function (si, st) {
                st = $(st);
                if (isShow) {
                    if (st.hasClass("_zbselect") && !st.hasClass("_zbtabselect")) {
                        st.removeClass("_zbselect").show();
                    }
                } else {
                    if (!st.is(":hidden") && !st.hasClass("_zbtabselect")) {
                        st.addClass("_zbselect").hide();
                    }
                }
            })
            var handlePage = findWinPage(win.name);
            if (handlePage.frameWinPool) {
                for (var i = 0; i < handlePage.frameWinPool.length; i++) {
                    var frameWin = win[handlePage.frameWinPool[i]];
                    window.handleFrameSelect(frameWin, isShow, true);
                }
            }
        }
    }
    window.handleSelect = function (win, isShow) {
        if (isIE6 && !_top.hasLayerAlert) {
            win = win ? win : findWinByName(window.upperestName);
            window.handleFrameSelect(win, isShow);
            if (!isShow) {
                var startWinName = win.name ? win.name : _top.upperestName;
                var handlePage = findWinPage(startWinName);
                while (handlePage.type == "frame") {
                    handlePage = findWinPage(handlePage.parentName);
                }
                while (handlePage && handlePage.type !== "top") {
                    while (handlePage.type == "frame") {
                        handlePage = findWinPage(handlePage.parentName);
                    }
                    window.handleFrameSelect(findPageWin(handlePage), isShow);
                    if (handlePage.prevName) {
                        handlePage = findWinPage(handlePage.prevName);
                    } else {
                        break;
                    }
                }
            } else {
                var startWinName = win.name ? win.name : _top.upperestName;
                var handlePage = findWinPage(startWinName);
                while (handlePage.type == "frame") {
                    handlePage = findWinPage(handlePage.parentName);
                }
                if (handlePage.prevName) {
                    handlePage = findWinPage(handlePage.prevName);
                    window.handleFrameSelect(findPageWin(handlePage), isShow);
                }
            }
        }
    }
    //向前关闭窗口（√）
    window.closeWin = function (index, win) {
        var tUpName = (win && win.name) ? win.name : upperestName;
        setTimeout(function () {
            index = index || 1;
            var upperestPage = findWinPage(tUpName);
            while (upperestPage.type == "frame") {
                upperestPage = findWinPage(upperestPage.parentName);
            }
            for (var i = 0; i < index; i++) {
                if (findPageWin(upperestPage) && findPageWin(upperestPage).closeFunc) {
                    findPageWin(upperestPage).closeFunc();
                }
                layer.close(layer.getFrameIndex(upperestPage.name));
                upperestPage = findWinPage(upperestPage.prevName);
                while (upperestPage.type == "frame") {
                    upperestPage = findWinPage(upperestPage.parentName);
                }
            }
        }, 1);
    }
    //向前关闭所有窗口 （√）       待关闭页面加上全局变量notCloseTag = true，若非最上层页面，则停止关闭
    window.closeAllWin = function () {        //关闭全部窗口接口。待关闭页面加上全局变量notCloseTag = true，若非最上层页面，则停止关闭
        var tUpName = upperestName;
        setTimeout(function () {
            var upperestPage = findWinPage(tUpName);
            if (upperestPage.type == "frame") {
                upperestPage = findWinPage(upperestPage.parentName);
            }
            var notCloseTag = false;
            var tempTopWin = false;
            while (upperestPage.type != "top" && !notCloseTag && !tempTopWin) {
                if (findPageWin(upperestPage) && findPageWin(upperestPage).closeFunc) {
                    findPageWin(upperestPage).closeFunc();
                }
                layer.close(layer.getFrameIndex(upperestPage.name))
                upperestPage = findWinPage(upperestPage.prevName);
                var upperSetWin = findPageWin(upperestPage);
                if (upperSetWin) {
                    if (upperSetWin.notCloseTag) {
                        notCloseTag = true;
                    }
                    if (upperSetWin.tempTop) {
                        tempTopWin = true;
                    }
                }

                // if (findPageWin(upperestPage) && findPageWin(upperestPage).notCloseTag) {
                //     notCloseTag = true;
                // }
                if (upperestPage.type == "frame") {
                    upperestPage = findWinPage(upperestPage.parentName);
                    if (findPageWin(upperestPage) && findPageWin(upperestPage).notCloseTag) {
                        notCloseTag = true;
                    }
                }
            }
        }, 1);
    };
    //获取指定窗口的数据   （√）
    window.winData = function (win, key, value) {
        if (arguments.length == 0) {
            throw new Error("方法winData需包含参数！");
        }
        if (win && win.name) {
            win = win.name;
        }
        var dataPage = findWinPage(win);
        if (arguments.length == 1) {
            return dataPage.data();
        } else if (arguments.length == 2) {
            return dataPage.data(key);
        } else {
            return dataPage.data(key, value);
        }
    };
    //设置页面历史搜索记录
    window.setHistorySearchData = function (data) {
        winData("_top", "listSearchJson", data);
    };
    //获取页面历史搜索记录
    window.getHistorySearchData = function () {
        var data = winData("_top", "listSearchJson");
        winData("_top", "listSearchJson", null);
        return data;
    }
    //获取最上层窗口
    window.getUpperestWin = function () {
        return findWinByName(upperestName);
    }
    //获取需要的子窗口的win的name
    window.getFrameName = function (parentWin) {
        var parentPage = findWinPage(parentWin.name);
        return parentPage.getFrameName();
    }
    //获取窗口下子窗口的名称数组
    window.getFrameNameArray = function (win) {
        if (arguments.length == 0) {
            throw new Error("方法winData需包含参数！");
        }
        var dataPage = findWinPage(win.name);
        return dataPage ? dataPage.frameWinPool : new Array();
    }
    //关闭窗口（需关闭window为参数）
    window.closeLayer = function (win) {
        if (win.closeFunc) {
            win.closeFunc();
        }
        var index = layer.getFrameIndex(win.name); //获取窗口索引
        layer.close(index);
    }
    //新版窗口管理打开弹出层
    window.openStack = function (win, title, areaType, url, param, callBacks) {
        var area;
        var iframeWinName = "";
        if (areaType == "small") {
            area = ['450px', '350px'];
        } else if (areaType == "medium") {
            area = ['700px', '500px'];
        } else if (areaType == "big") {
            area = ['900px', '600px'];
        } else if (areaType == "tree") {
            area = ['400px', '600px'];
        } else {
            area = areaType;
        }
        _top.layer.open({
            //zIndex:1,
            type: 2,
            title: title,
            area: area,
            maxmin: true,
            parentWin: win,
            param: param,
            content: RX.handlePath(url),
            success: function (layero, index) {
                iframeWin = window[layero.find('iframe')[0]['name']];
                iframeWinName = iframeWin && iframeWin.name;
                _top.pushStackWin(iframeWin, win);
                if (win.successCallback) {
                    win.successCallback();
                }
                if (callBacks && typeof(callBacks.success) == "function") {
                    callBacks.success(layero, index);
                }
            },
            end: function () {
                if (_top.ZENG)
                    _top.ZENG.msgbox.hide();
                _top.closeLayerWin(iframeWinName);
                if (callBacks && typeof(callBacks.end) == "function") {
                    callBacks.end();
                }
            },
            cancel: function () {
                var cwin = _top.getUpperestWin();
                if (cwin != null) {
                    if (cwin.cancelCheck) {
                        return cwin.cancelCheck();
                    }
                }
                if (callBacks && typeof(callBacks.cancel) == "function") {
                    callBacks.cancel();
                }
                return true;
            }
        })
    };

    //（暂时停用）回退历史，bindex为退回次数，默认为1
    window._backHistory = function (win, bindex) {
        var page = findWinPage(win.name);
        bindex = bindex ? bindex : 1;
        if (page) {
            var url;
            while (page.history.length > 0 && bindex > 0) {
                url = page.history.pop();
                bindex--;
            }
            if (url) {
                page.frameWinPool = new Array();
                win.location.href = url;
            }
        }
    }

    //frame路径跳转
    window.frameGoto = function (obj, url) {
        url = RX.handlePath(url);
        var el = obj[0], iframe = el.contentWindow;
        if (iframe != null) {
            if (iframe.closeFunc) {
                iframe.closeFunc();
            }
        }
        if (el) {
            if (isIE) {
                el.src = 'about:blank';
                try {
                    iframe.document.write('');
                    iframe.close();
                } catch (e) {
                }
            }
            el.src = url;
        }
    }

    //主菜单点击跳转
    window.clickMainMenu = function (obj, url) {
        url = RX.handlePath(url);
        var mainIframe = $("#MainIframe");
        _top.pushStackWin(window["MainIframe"], window);
        frameGoto(mainIframe, url ? url : $(obj).find("a").attr("url"));
    }

    //子菜单点击跳转
    window.clickSubMenu = function (obj, url) {
        url = RX.handlePath(url);
        var mainIframeWin = window["MainIframe"];
        var mainIframeR = $("#MainIframeR", mainIframeWin.document);
        _top.pushStackWin(mainIframeWin.window["MainIframeR"], mainIframeWin);
        frameGoto(mainIframeR, url ? url : $(obj).find("a").attr("url"));
    }

    window.menuFlushFlow = function () {
        if (_top.flushFlowTaskId) {
            $.post("/workflow/instance/flushWorkflowInstance", {id: _top.flushFlowTaskId});
            _top.flushFlowTaskId = null;
        }
    }
    window.findWorkflowFrameWin = function (win) {
        if (win) {
            if (win.name == "MainIframeR" || win.workflowFrame) {
                return win;
            } else {
                var winPage = findWinPage(win.name);
                if (winPage.type == "frame") {
                    if (winPage.parentName == _top.name) {
                        return findPageWin(winPage);
                    } else {
                        return findWorkflowFrameWin(findPageWin(winStore[winPage.parentName]));
                    }
                } else {
                    if (winPage.prevName == _top.name) {
                        return findPageWin(winPage);
                    } else {
                        return findWorkflowFrameWin(findPageWin(winStore[winPage.prevName]));
                    }
                }
            }
        } else {
            return null;
        }
    };

    if (!window.name) {
        window.name = "top";
    }

    //top页初始化
    var topPage = new WinPage(window, "top");
    addWinPage(topPage);
    upperestName = topPage.name;

    // window.pushStackWin({name: "MainIframe"}, window);
    // window.pushStackWin({name: "MainIframeR"}, {name: "MainIframe"});

    var menuData = null;
    window.getMenuData = function (obj) {
        $.ajax({
            type: "post",
            url: "/jwbzxt/getMenuData",
            dataType: "json",
            success: function (ar) {
                if (ar.success) {
                    menuData = ar.data;
                    showMenu(obj);
                } else {
                    layer.alert(ar.msg);
                }
            }
        })
    }
    window.showMenu = function (obj) {
        $(obj).find("li").each(function () {
            var code = $(this).attr("code");
            if (code) {
                if ($.inArray(code, menuData) > -1) {
                    $(this).removeClass("hideElement");
                }
            }
        })
    }

    var historyArray = [];
    //绘制历史路径区
    window.drawHistory = function () {
        //清除区域
        $("#breadcrumb").find("a").each(function (i, t) {
            if (!$(t).hasClass("tip-bottom")) {
                $(t).remove();
            }
        });
        //重新插入历史项
        for (var i = 0; i < historyArray.length; i++) {
            $("#breadcrumb").append("<a href='javascript:void(0);' historyIndex='" + i +
                "' class='" + (historyArray.length == i + 1 ? "current " : " ") +
                (historyArray[i].url ? "" : "noCursor") + "'>" + historyArray[i].name + "</a>");
        }
        //绑定点击事件
        $("#breadcrumb").find("a").each(function (i, t) {
            if (!$(t).hasClass("tip-bottom") && !$(t).hasClass("noCursor")) {
                $(t).bind("click", function () {
                    clickHistory($(this).attr("historyIndex"));
                });
            }
        });
    }

    //点击路径历史区某历史后置
    var iframeR = $("#MainIframeR");

    function clickHistory(index) {
        //循环推出历史页，维护点击截取后历史array
        var tempHistory = historyArray.pop(), tlength = historyArray.length;
        for (var i = 0; i < tlength - index; i++) {
            tempHistory = historyArray.pop();
        }
        historyArray.push(tempHistory);
        //重新绘制路径历史区
        drawHistory();
        //跳转点击项url
        if (tempHistory.url) {
            if (tempHistory.url.indexOf("?") > -1) {
                tempHistory.url += "&_freshTag=1";
            } else {
                tempHistory.url += "?_freshTag=1";
            }
            gotoUrl(iframeR, tempHistory.url);
        }
    }

    //页面跳转，维护页面历史记录
    //handleTpe-'pMenu'点击主菜单跳转,'sMenu'点击子菜单跳转,'page'页面操作跳转
    window.showHistory = function (handleType, url, name, pName) {
        var lastOne = historyArray.length > 0 ? historyArray[historyArray.length - 1] : null;
        if (name == "我的项目") {     //工作台特殊处理，只保留工作台
            historyArray = [];
            historyArray.push({name: name, url: url, type: "sMenu"});
        } else if (handleType == "pMenu") {      //若点击父菜单，（暂）清空array，插入父菜单历史
            historyArray = [];
            historyArray.push({name: name, url: url, type: "pMenu"});
        } else if (handleType == "sMenu") {         //若点击子菜单，如上一历史为父菜单，直接推入子菜单，否则清空array，推入父子菜单
            if (lastOne && lastOne.type != "pMenu") {
                historyArray = [];
                historyArray.push({name: pName, url: null, type: "pMenu"});
            }
            historyArray.push({name: name, url: url, type: "sMenu"});
        } else {       //若为页面操作跳转，直接加入新页面历史
            historyArray.push({name: name, url: url, type: "page"});
        }
        //重新绘制路径历史区
        drawHistory();
    }

    //刷新当前页历史
    window.freshHistory = function (handleType, url, name) {
        var oldH = historyArray.pop();
        handleType = handleType || oldH.type;
        url = url || oldH.url;
        name = name || oldH.name;
        historyArray.push({name: name, url: url, type: handleType});
        //重新绘制路径历史区
        drawHistory();
        return url;
    }

    //页面后退，维护页面历史记录，返回退回url
    window.showHistoryBack = function (index, url, name) {
        //处理退回页数参数
        index = (index > historyArray.length - 1 ? historyArray.length - 1 : index) || 1;
        var tempHistory = historyArray.pop(); //将当前页作为初始temp页
        //循环推出最后一页
        for (var i = 0; i < index; i++) {
            tempHistory = historyArray.pop();
        }
        //填入定制的url和name，若为空，则以原来的为准
        tempHistory.url = url || tempHistory.url;
        tempHistory.name = name || tempHistory.name;
        //将最后推出页（目标页）重新推出历史array中，绘制历史路径区
        historyArray.push(tempHistory);
        drawHistory();
        //若该页有url，则返回url
        if (tempHistory && tempHistory.url) {
            return tempHistory.url;
        }
    }

    //前往
    window._freshLocation = function (win, url, name) {
        url = RX.handlePath(url);
        var page = findWinPage(win.name);
        if (page) {
            page.history.pop();
            page.history.push(url);
            page.frameWinPool = new Array();
            win.location.href = freshHistory(null, url, name);
        }
    };

    //前往
    window._gotoLocation = function (win, url, name) {
        url = RX.handlePath(url);
        var page = findWinPage(win.name);
        if (page) {
            page.history.push(url);
            page.frameWinPool = new Array();
            win.location.href = url;
            showHistory("page", url, name);
        }
    };

    //回退
    window._backLocation = function (win, index, url, name) {
        url = RX.handlePath(url);
        var page = findWinPage(win.name);
        if (page) {
            url = showHistoryBack(index, url, name);
            if (url) {
                page.history.push(url);
                page.frameWinPool = new Array();
                win.location.href = url;
            }
        }
    };

    //前往路径,url为跳转路径，name为历史区显示的历史项名称
    window.gotoLocation = function (url, name) {
        _top._gotoLocation(window, url, name);
    };
    //路径回退，index回退页数,url为可定制的新url，如不填写，则以历史url为准，name为可定制的新历史项名称，如不填写，则以历史名称为准
    window.backLocation = function (index, url, name) {
        _top._backLocation(window, index, url, name);
    };

    window.hasLayerManager = true;


    window.getFeatureList = function () {
        var featureData = [];
        $.ajax({
            async: false,
            type: "GET",
            url: "/medias/cache/rx_features.js?r=" + Math.random(),
            dataType: "JSON",
            success: function (jsondata, textStatus) {
                //判断是否过期 如果过期 则删除过期文件 并使用服务器发回的最新数据
                if (jsondata) {
                    featureData = jsondata.data;
                }
            }, error: function (XMLHttpRequest, textStatus, errorThrown) {
                if (XMLHttpRequest.status = 404) {//文件不存在，择请求服务器生成文件
                    $.ajax({
                        async: false,
                        type: "POST",
                        url: "/feature/featureFileCreate",
                        dataType: "JSON",
                        success: function (response) {
                            featureData = response;
                        }
                    });
                }
            }
        });
        return featureData;
    };
    window.getToTagUrl = function (win) {
        var windPage = winStore[win.name];
        //查看MainIframeR那一层
        if (windPage.type == "frame" && windPage.parentName != _top.name && windPage.name != "MainIframeR") {
            return getParentWin(win).location.href;
        } else {
            return win.location.href;
        }
    };
    window.showDialog = function (name, option, url, property, isReload, win) {
        if (property != null || property != undefined){
            window.property = property;
        }else{
            window.property = null;
        }
        if (name == "" || name == null || name == undefined) {
            name = "d" + new Date().getTime();
        }
        var option = option || {};
        option.width = option.width || 600;
        option.height = option.height || 400;
        option.title = option.title || '弹出窗口';
        openStack((win || window),option.title,[option.width+"px",option.height+"px"],url);
    }
}

//IE内存回收
function rx_gc() {
    if (isIE) {
        setTimeout(CollectGarbage, 1);
    }
}

function RXLog(content) {
    if (window.console && window.console.log) {
        console.log(content);
    }
}

//在页面上设置select选中的值
function setSelectVal(t, value) {
    if (isIE6) {
        setTimeout(function () {
            $(t).val(value);
        }, 0);
    } else {
        $(t).val(value);
    }
}

function stopBubble(e) {
    // 如果传入了事件对象，那么就是非ie浏览器
    if (e && e.stopPropagation) {
        //因此它支持W3C的stopPropagation()方法
        e.stopPropagation();
    } else {
        //否则我们使用ie的方法来取消事件冒泡
        window.event.cancelBubble = true;
    }
}

//值过长处理
function valueLimitShow(value, limit) {
    if (!value) {
        return "";
    }
    if (!limit) {
        return value;
    }
    value = value.toString();
    return value.length > limit ? value.substring(0, limit) + "…" : value;
}

//判断ie 7-11
function IEType() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
    if (isIE) {
        var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if (fIEVersion == 7) {
            return "7";
        }
        else if (fIEVersion == 8) {
            return "8";
        }
        else if (fIEVersion == 9) {
            return "9";
        }
        else if (fIEVersion == 10) {
            return "10";
        }
        else if (fIEVersion == 11) {
            return "11";
        }
    }
}
//搜索框下拉方法
function toggleSearchView($div, $item, showTag) {
    function showView(noSpeed) {
        if (typeof (noSpeed) == "boolean" && noSpeed) {
            $div.show();
        } else {
            $div.show("normal");
        }
        $item.attr("title", "展开搜索区");
        $item.addClass("rotate");
    }

    function hideView(noSpeed) {
        if (typeof (noSpeed) == "boolean" && noSpeed) {
            $div.hide();
        } else {
            $div.hide("normal");
        }
        $item.attr("title", "收起搜索区");
        $item.removeClass("rotate");
    }

    if (showTag) {
        showView(true);
        $item.toggle(hideView, showView);
    } else {
        hideView(true);
        $item.toggle(showView, hideView);
    }
}
//数组插入
Array.prototype.insert = function (index, value) {
    this.splice(index, 0, value);
    var argLength = arguments.length;
    if (argLength > 2) {
        for (var i = 2; i < argLength; i++) {
            this.splice(++index, 0, arguments[i]);
        }
    }
    return this;
};
//数组替换
Array.prototype.replace = function (index, value) {
    this.splice(index, 1, value);
    return this;
};
//数组删除
Array.prototype.remove = function (index) {
    this.splice(index, 1);
    return this;
};

function prettyPhotoShow(src, title, description) {
    // $.prettyPhoto.open(src);
    if ($("#_rx_pretty_frame").length == 0) {
        $("body").append("<iframe frameborder='0' id='_rx_pretty_frame' name='_rx_pretty_frame' style='position:absolute;top:0;left:0;width:100%;z-index:19999999;'></iframe>");
        $("#_rx_pretty_frame").height($(window).height());
        $(window).resize(function () {
            $("#_rx_pretty_div").height($(window).height());
        })
        var iframeElement = window.document.getElementById("_rx_pretty_frame");
        iframeElement.setAttribute('allowTransparency', 'true');
        var iframeDoc = iframeElement.contentDocument || iframeElement.contentWindow.document;
        var baseUrl = "";
        if (RX && RX.config && RX.config.defaultPath) {
            baseUrl = RX.config.defaultPath;
        }
        baseUrl = baseUrl ? "/" + baseUrl : "";
        iframeDoc.open();
        iframeDoc.write('<!DOCTYPE html><html lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> <meta http-equiv="X-UA-Compatible" content="IE=edge,Chrome=1" /><link rel="stylesheet" type="text/css" href="' + baseUrl + '/medias/utils/prettyPhoto/prettyPhoto.css"/>' +
            '<script type="text/javascript" src="' + baseUrl + '/medias/lib/jquery-1.8.3.js"></script>' +
            '<script type="text/javascript" src="' + baseUrl + '/medias/utils/prettyPhoto/jquery.prettyPhoto.js"></script>' +
            '<script type="text/javascript" src="' + baseUrl + '/medias/utils/prettyPhoto/photoShow.js"></script>' +
            '</head><body style="background-color:transparent"><script>' +
            'window.onload = function(){$("area[rel^=\'prettyPhoto\']").prettyPhoto();' +
            'window.showPhoto = function(src){$.prettyPhoto.open(src);};' +
            'showPhoto(' + JSON.stringify(src) + ');' +
            '} </script></body></html>');
        iframeDoc.close();
    } else {
        $("#_rx_pretty_frame").show();
        window.frames["_rx_pretty_frame"].showPhoto(src);
    }
}