$(document).ready(function () {
    $("#center-tab").omTabs({
        lazyLoad:true
    });
    var eles = {};
    var node = _top.property;
    var pro = null;
    if (node) {
        eles.description = $("#description");
    }
    pro = node.property;
    $.each(eles, function (key, e) {
        if (e instanceof  $) {
            if (e.attr("type") == "radio" || e.attr("type") == "checkbox") {
                e.filter(function () {
                    return this.value == pro[key];
                }).attr("checked", true);
            } else {
                e.val(pro[key] || "");
            }
        } else {
            if (pro[key] != undefined && pro[key] != null&&pro[key] != "") {
                e.id.val(pro[key] || "");
            }
        }
    });
    $("#save").omButton({icons:{left:RX.handlePath('/medias/images/baseModel/button/accept.gif')}}).click(function () {
        if (pro) {
            for (var key in eles) {
                var e = eles[key];
                var v = "";
                var require = "";
                if (e instanceof  $) {
                    require = e.attr("require");
                    if (e.attr("type") == "radio" || e.attr("type") == "checkbox") {
                        v = e.filter(function () {
                            return this.checked;
                        }).val();
                    } else {
                        v = e.val();
                    }
                } else {
                    require = e.name.attr("require");
                    v = e.id.val();
                }
                if (require != undefined && (v == "" || v == undefined)) {
                    alert(require);
                    e instanceof  $ ? e.focus() : e.name.focus();
                    return false;
                }
                pro[key] = v;
            }

        }
        $("#cancel").trigger("click");
    });
    $("#cancel").omButton({icons:{left:RX.handlePath('/medias/images/baseModel/button/cancel.png')}}).click(function () {
        _top.property = null;
        closeLayer(window);
    });
});