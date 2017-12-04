var modelEntrust;
var type = GetQueryString("type");
var id = GetQueryString("id");
$(function () {
    //初始化尺寸
    resizeForm();
    var stateJson = ckStateJson;
    if (type == "xz") {
        stateJson = xzStateJson;
    } else if (type == "xg") {
        stateJson = xgStateJson;
    } else {
        stateJson = ckStateJson;
        $("#save").hide();
    }
    var ModelEntrust = DetailModel.extend({
        className: "ModelEntrust",
        initJson: ModelEntrustJson,
        stateJson: stateJson
    });

    var entrust = {};
    if (id) {
        $.ajax({
            type: "get",
            url: "/workflow/instance/getEntrustById?id=" + id + "&random=" + Math.random(),
            async: false,
            success: function (ar) {
                if (ar.success) {
                    entrust = eval(ar.data);
                } else {
                    layer.alert(ar.msg);
                }
            }
        });
    }
    modelEntrust = new ModelEntrust(entrust);
    modelEntrust.render();
    //保存方法
    $("#save").click(function () {
        if (modelEntrust.ruleValidate()) {
            $.ajax({
                type: "post",
                url: "/workflow/instance/saveEntrust",
                data: {sysEntrust: modelEntrust.getJson()},
                dataType: "json",
                success: function (ar) {
                    if (ar.success) {
                        layer.alert("保存成功");
                        reloadPrevWin();
                        closeWin();
                    } else {
                        layer.alert(ar.msg);
                    }
                }
            });
        }
    });
});

//选择委办人回调函数
function entrustUserSelectCallback(modelName, name, id) {
    $.getEle(modelName, "entrustUserName").val(name);
    $.getEle(modelName, "entrustUserId").val(id);
}


