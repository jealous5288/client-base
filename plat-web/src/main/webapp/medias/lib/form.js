Array.prototype.contains = function (item) {
    for (var i = 0; i < this.length; i++) {
        if (item == this[i]) {
            return true;
        }
    }
    return false;
};
function regEnter(fn){
    document.onkeydown=function(event){
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if(e && e.keyCode==13){ // enter 键
            if(!$('span.pControl input[type="text"]').is(":focus"))
                fn();
            return false;
        }
    };
}
function limit(){
    var txtNote;//文本框
    //var txtLimit;//提示字数的input
    var limitCount;//限制的字数
    var isbyte;//是否使用字节长度限制（1汉字=2字符）
    var txtlength;//到达限制时，字符串的长度
    var txtByte;
    this.init=function(){
        txtNote=this.txtNote;
        //txtLimit=this.txtLimit;
        limitCount=this.limitCount;
        isbyte=this.isbyte;
        txtNote.onkeydown=function(){wordsLimit()};txtNote.onkeyup=function(){wordsLimit()};
        //txtLimit.value=limitCount;
    }
    function wordsLimit(){
        var noteCount=0;
        if(isbyte){noteCount=txtNote.value.replace(/[^\x00-\xff]/g,"**").length}else{noteCount=txtNote.value.length}
        if(noteCount>limitCount){
            if(isbyte){
                txtNote.value=txtNote.value.substring(0,txtlength+Math.floor((limitCount-txtByte)/2));
                txtByte=txtNote.value.replace(/[^\x00-\xff]/g,"**").length;
                //txtLimit.value=limitCount-txtByte;
            }else{
                txtNote.value=txtNote.value.substring(0,limitCount);
                //txtLimit.value=0;
            }
        }else{
            //txtLimit.value=limitCount-noteCount;
        }
        txtlength=txtNote.value.length;//记录每次输入后的长度
        txtByte=txtNote.value.replace(/[^\x00-\xff]/g,"**").length;
    }
}

(function ($) {
    $(function () {
        try {
            setTimeout(function () {
                _top.$.omMessageBox.waiting("close");
            }, 50);
        } catch (e) {
        }
//        try
//        {
//            setTimeout(function () {
//                $("table:not(.fmTop10):first input:text:first").focus();
//            }, 20)
//        }catch(e){}

//        $("form").submit(function () {
//            if(forms.validate())
//            {
//                $.omMessageBox.waiting({
//                    title:'请稍候',
//                    content:'服务器正在处理您的请求，请稍候...'
//                });
//                return true;
//            }
//            return false;
//        });
    });
    window.forms = {
        clearNoNumAndD:function (obj) {
            obj.val(obj.val().replace(/[^\d.]/g, "").replace(/^\./g, "").replace(/\.{2,}/g, ".").replace(".", "$#$").replace(/\./g, "").replace("$#$", "."));
        }, clearNoNum:function (obj) {
            obj.val(obj.val().replace(/[^\d]/g, ''));
        }, checkLxdh:function(e,g){
            e = $.trim(e);
            var d = /^0?1[358]\d{9}$/;
            var f = /^(([0\+]\d{2,3}-)?(0\d{2,3})-?)?(\d{7,8})(-(\d{3,}))?$/;
            var h = true;
            if (e != "") {
                var c = e.split(",");
                for (var b = 0; b < c.length; b++) {
                    if (!(d.test(c[b])) && !(f.test(c[b]))) {
                        h = false;
                        break;
                    }
                }
                if (!h) {
                    if (g == undefined || g == null || g == "") {
                        g = "请输入正确的联系电话";
                    }
                    alert(g);
                    return false;
                }
            }
            return true;
        },save:function (formid) {
            if (formid) {
                if (forms.validate(formid))
                {
                    $.omMessageBox.waiting({
                        title:'请稍候',
                        content:'服务器正在处理您的请求，请稍候...'
                    });
                    $("#" + formid).submit();
                }
            } else {
                if (forms.validate())
                {
                    $.omMessageBox.waiting({
                        title:'请稍候',
                        content:'服务器正在处理您的请求，请稍候...'
                    });
                    $("form").submit();
                }
            }
        }, add:function (e, formid) {
            var grid = $(e).attr("bindgrid");
            window.open("viewForm?id=" + formid + "&grid=" + (grid ? grid : ''));
        }, edit:function (e, formid) {
            var grid = $(e).attr("bindgrid");
            var sel = $("#" + grid).omGrid('getSelections', true);
            if (sel.length == 0) {
                alert("请您先选择一行记录");
                return;
            }
            var cid = sel[0]._cid;
            var did = sel[0].ID;
            var id = formid;
            window.open("viewForm?id=" + id + "&did=" + did + "&cid=" + cid + "&action=edit&grid=" + (grid ? grid : ''));
        }, del:function (e) {
            var grid = $(e).attr("bindgrid");
            var sel = $("#" + grid).omGrid('getSelections', true);
            if (sel.length == 0) {
                alert("请您先选择一行记录");
                return;
            }
            if (confirm("您确定要删除此行数据吗？")) {
                $.post("deleteBusinessClass", {cid:sel[0]._cid, did:sel[0].ID}, function (data) {
                    if (data) {
                        alert("删除成功");
                        $("#" + grid).omGrid("reload");
                    }
                });
            }
        }, idToName:function (cid, did, name) {
            if (did == "" || did == 0 || did == null) {
                return"";
            }
            var result = "";
            $.ajax({url:"findBusinessClass", data:{cid:cid || "", did:did, name:name || "", random:Math.random(100)}, async:false, success:function (data) {
                result = data;
            }});
            return result;
        }, getClassData:function (cid, did, field, callback) {
            if (did == "" || did == 0 || did == null) {
                return{};
            }
            var result = "";
            $.ajax({url:"findClassData", data:{cid:cid, did:did, field:field}, async:typeof callback == 'function', success:function (data) {
                result = data;
                if (typeof callback == 'function') {
                    callback($.parseJSON(data));
                }
            }});
            return result;
        }, getViewData:function (vid, data, callback) {
            if (vid == "" || vid == 0 || vid == null) {
                return[];
            }
            var result = [];
            data.vid = vid;
            $.ajax({url:"getViewData", data:data, async:typeof callback == 'function', success:function (data) {
                result = data;
                if (typeof callback == 'function') {
                    callback($.parseJSON(data));
                }
            }});
            return result;
        }, wfIdToName:function (id) {
            var result = "";
            $.ajax({url:"getWfNameById", data:{cid:cid, did:did, name:field}, async:false, success:function (data) {
                result = data;
            }});
            return result;
        }, popDialog:function (e, url, option) {
            _top.showDialog("popdialog", option, url, e, true);
        }, confirmDialog:function (grid) {
            if (typeof grid == "string") {
                grid = $("#" + grid);
            }
            var sel = grid.omGrid("getSelections", true);
            if (sel.length == 0) {
                alert("请您先选择一条记录");
                return false;
            }
            if (_top.pros) {
                if (typeof _top.pros == "function") {
                    if (_top.pros(sel) === false) {
                        return;
                    }
                } else {
                    $.each(_top.pros, function (name, e) {
                        var values = [];
                        for (var j = 0; j < sel.length; j++) {
                            var v = sel[j][name];
                            if (v != null && v != undefined)
                                values.push(v);
                        }
                        e.val(values.join(","));
                    });
                }
            }
            if (window.frameElement.dialog)
                window.frameElement.dialog.close();
        }, idToDeepName:function (cids, fields, did, name) {
            if (did == "" || did == 0 || did == null) {
                return"";
            }
            var result = "";
            $.ajax({url:"findDeepBusinessClass", data:{cids:cids, did:did, fields:fields, name:name}, async:false, success:function (data) {
                result = data;
            }});
            return result;
        }, addAttachment:function (grid, uuid, data, isWorkFlow, options) {
            var data = data || {};
            if (typeof grid == 'string') {
                grid = $("#" + grid);
            }
            var gridid = grid.attr("id");
            data.uuid = uuid;
            data.gridid = gridid;
            var options = options || {};
            options = $.extend({}, {width:500, height:350}, options);
            if (!isWorkFlow) {
                window.showDialog('attachment', options, forms.getContextPath() + "/form/addFileUpload?" + $.param(data), grid, true);
            } else {
                window.showDialog('attachment', options, forms.getContextPath() + "/form/addWorkFlowAttachment?" + $.param(data), grid, true);
            }
        }, delAttachment:function (grid, isWorkFlow) {
            if (typeof grid == "string") {
                grid = $("#" + grid);
            }
            $.omMessageBox.confirm({title:'确认删除', content:'删除的数据将不可恢复，你确定要这样做吗？', onClose:function (v) {
                if (v) {
                    var selectedRecords = grid.omGrid('getSelections', true);
                    var delJson = [];
                    $.each(selectedRecords, function (i, n) {
                        delJson.push(n.ID);
                    });
                    $.ajax({type:"get", url:forms.getContextPath() + "/form/deleteAttachment", data:{ids:delJson.join(","), isWorkFlow:isWorkFlow, c:Math.random()}, success:function (val) {
                        alert(val);
                        grid.omGrid('reload');
                    }})
                }
            }});
        }, getContextPath:function () {
            var path = location.pathname;
            return path.substring(0, path.indexOf("/", 1));
        }, incrementName:function (name, id, val) {
            var e = $("<input type='hidden'/>").appendTo("body");
            name = name.split(".");
            name.pop();
            name.push(id);
            e.val(val);
            e.attr("name", name.join("."));
        }, deleteIncrementName:function (name, id) {
            name = name.split(".");
            name.pop();
            name.push(id);
            $("input[name='" + name.join(".") + "']").remove();
        }, changeToEdit:function (did, form) {
            var form = form || $("form");
            if (form.size()) {
                var url = form.attr("action");
                var p = /method=?[^&]*]/ig;
                if (p.test(url)) {
                    url = url.replace(p, "method=edit");
                } else {
                    url += "&method=edit";
                }
                p = /did=?[^&]*/ig;
                if (p.test(url)) {
                    url = url.replace(p, "did=" + did);
                } else {
                    url += "&did=" + did;
                }
                form.attr("action", url);
                return url;
            }
            return false;
        }, validate:function (form) {
            var form = form || $("form");
            form = typeof form == 'string' ? $("#" + form) : form;
            var controls = form.find("[control][isrequired]");
            for (var i = 0; i < controls.size(); i++) {
                var c = controls.eq(i);
                var name = c.attr("name");
                if (name == undefined) {
                    name = c.find("input:first").attr("name");
                }
                if (name == undefined) {
                    continue;
                }
                var v = c.val();
                if (name.indexOf(".CheckBoxField") > -1) {
                    var vs = []
                    c.find("input:checkbox:checked").each(function () {
                        vs.push($(this).val());
                    });
                    v = vs.join(",");
                } else if (name.indexOf(".RadioField") > -1) {
                    var r = c.find("input:radio:checked");
                    v = r.size() ? r.val() : "";
                }
                if (v == "") {
                    alert(c.attr("requiredmsg"));
                    c.focus();
                    return false;
                }
            }
            var controls = form.find("[control][regular]");
            for (var i = 0; i < controls.size(); i++) {
                var c = controls.eq(i);
                var name = c.attr("name");
                var v = c.val();
                var regular = c.attr("regular");
                if (regular != "") {
                    var p = new RegExp(regular, "igm");
                    if (v != "") {
                        if (!p.test(v)) {
                            alert(c.attr("regularmsg"));
                            c.focus();
                            return false;
                        }
                    }
                }
            }
            return true;
        }, uuid:function (len, radix) {
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
        },isIdCardNo:function isIdCardNo(g, m) {
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
            var d = {11:"北京", 12:"天津", 13:"河北", 14:"山西", 15:"内蒙古", 21:"辽宁", 22:"吉林", 23:"黑龙江", 31:"上海", 32:"江苏", 33:"浙江", 34:"安徽", 35:"福建", 36:"江西", 37:"山东", 41:"河南", 42:"湖北", 43:"湖南", 44:"广东", 45:"广西", 46:"海南", 50:"重庆", 51:"四川", 52:"贵州", 53:"云南", 54:"西藏", 61:"陕西", 62:"甘肃", 63:"青海", 64:"宁夏", 65:"新疆", 71:"台湾", 81:"香港", 82:"澳门", 91:"国外"};
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
        }};
})(jQuery);

(function ($) {
    _top.dialogs = window.dialogs = {};
    _top.showDialog = window.showDialog = function (name, option, url, property, isReload) {
        openLayer(option.title,"medium",url);
//        if (property != null || property != undefined)
//            _top.pros = property;
//        if (name == "" || name == null || name == undefined) {
//            name = "d" + new Date().getTime();
//        }
//        option = option || {};
//        option.width = option.width || 600;
//        option.height = option.height || 400;
//        option.title = option.title || '弹出窗口';
//        option.autoOpen = option.autoOpen || false;
//        option.modal = option.modal || true;
//        option.resizable = option.resizable || false;
//        isReload = isReload == undefined ? true : isReload;
//        var d = dialogs[name];
//        if (d) {
//            if (isReload || url != d.url) {
//                var loading = d.iframe.prev().show();
//                var newifr = $("<iframe frameborder='0' src='" + url + "'></iframe>").css({margin:0, padding:0, width:'100%', height:'99%', position:'absolute', top:0, left:0, zIndex:98});
//                d.iframe.after(newifr).remove();
//                d.iframe = newifr;
//                if (newifr.get(0).attachEvent) {
//                    newifr.get(0).attachEvent('onload', function () {
//                        loading.fadeOut(500);
//                    });
//                } else {
//                    newifr.get(0).onload = function () {
//                        loading.fadeOut(500);
//                    }
//                }
//                newifr.get(0).dialog = newifr.get(0).contentWindow.dialog = d;
//            }
//            d.dialog.omDialog(option).omDialog("open");
//        } else {
//            var div = $("<div></div>").appendTo("body");
//            div.attr("id", "d_" + new Date().getTime()).css({margin:0, padding:0, position:'relative'});
//            var loading = $("<div><img src='/medias/images/loading.gif'/></div>").css({textAlign:'center', height:option.height - 30, left:0, top:0, position:'absolute', width:'100%', lineHeight:(option.height - 30) + "px", zIndex:99}).appendTo(div);
//            var iframe = $("<iframe frameborder='0' src='" + url + "'></iframe>").appendTo(div).css({margin:0, padding:0, width:'100%', height:'99%', position:'absolute', top:0, left:0, zIndex:98});
//            div.omDialog(option);
//            dialogs[name] = {dialog:div, url:url, iframe:iframe, open:function () {
//                this.dialog.omDialog("open");
//            }, close:function (callback) {
//                this.dialog.omDialog("close");
//                if (typeof callback == 'function')
//                    callback(this);
//                return this;
//            }, remove:function () {
//                this.dialog.remove();
//                delete dialogs[name];
//                if (typeof callback == 'function')
//                    callback(this);
//                return this;
//            }};
//            try {
//                var ifr = iframe.get(0);
//                ifr.dialog = ifr.contentWindow.dialog = dialogs[name];
//                ifr.contentWindow.property = property;
//                if (ifr.attachEvent) {
//                    ifr.attachEvent('onload', function () {
//                        loading.fadeOut(500);
//                    });
//                } else {
//                    ifr.onload = function () {
//                        loading.fadeOut(500);
//                    }
//                }
//            } catch (e) {
//            }
//            div.omDialog('open');
//        }
//        return dialogs[name];
    }
    _top.findDialog = window.findDialog = function (name) {
        return window.dialogs[name];
    }
})(_top.jQuery || window.jQuery);

$(document).keydown(function (e) {
    var doPrevent;
    if (e.keyCode == 8) {
        var d = e.srcElement || e.target;
        if (d.tagName.toUpperCase() == 'INPUT' || d.tagName.toUpperCase() == 'TEXTAREA') {
            doPrevent = d.readOnly || d.disabled;
        } else
            doPrevent = true;
    } else
        doPrevent = false;
    if (doPrevent)
        e.preventDefault();
});