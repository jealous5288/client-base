var ModelResource;
var modelResource;
var type = GetQueryString("type");
$(function () {
    //异步提示注册
    pageAjax();
    //初始化尺寸
    resizeForm();
    
    var stateJson;
    if (type === "xz") {
        stateJson = xzStateJson;
    } else if (type === "xg") {
        stateJson = xgStateJson;

    } else if (type === "ck") {
        stateJson = ckStateJson;
        $(".w_button_box").hide();
    }
    ModelResource = DetailModel.extend({
        className: "ModelResource",
        initJson: ModelResourceJson,
        stateJson: stateJson
    });
    var id = GetQueryString("id");
    if (id) {
        $.ajax({
            type: "get",
            url: "/resource/getResourceById?id=" + id + "&r=" + Math.random(),
            success: function (ar) {
                if (ar.success) {
                    renderForm(ar.data);
                } else {
                    layer.alert(ar.msg);
                }
            }
        });
    } else {
        renderForm();
    }

    $("#save").click(function () {
        if (modelResource.ruleValidate()) {
            $.ajax({
                type: "post",
                url: "/resource/saveResource",
                data: {resource: modelResource.getJson()},
                dataType: "json",
                success: function (ar) {
                    if (ar.success) {
                        reloadPrevWin();
                        closeAllWin();
                        layer.alert("保存成功");
                    } else {
                        layer.alert(ar.msg);
                    }
                }
            });
        }
    });
});

function renderForm(data) {
    if(data && data.parentType){
        data.parentName += " ("+getTypeName(data.type)+")";
    }
    modelResource = new ModelResource(data);
    modelResource.render();
}

function selectParentCallback(id,name,type){
    modelResource.setValue("parentId",id);
    modelResource.setValue("parentName",name+" ("+getTypeName(type)+")");
    modelResource.setValue("parentType",type);

}

function getTypeName(code){
    var name = "";
    $.each(resourceDict,function(i,t){
        if(t.code == code){
            name = t.value;
            return false;
        }
    })
    return name;
}