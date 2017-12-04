var param = _top.winData(window, "param");
$(function () {

    //初始化尺寸
    resizeTable();

    var agreeText = (param.agree ? "下一" : "退回");
    if (param.agree) {
        $("#nextNodeTag").text(agreeText + "环节：");
    } else {
        $("#nextNodeTag").text(agreeText + "环节：");
    }
    $("#xyhjblrtitle").text(agreeText + "环节办理人");
    param.blrList = param.blrList || [];
    if (param.info == "endNode") {
        $("#xyhjblr").hide();
        $("#xyhjblrtitle").show();
        $("#xyhjblrtitle").text("本环节办理完成后流程结束！");
    } else {
        $("#nextNodeName").text(param.nodeName);
        $("#nodeInfoArea").show();
        if (param.info == "noPeople") {
            $("#xyhjblr").hide();
            $("#xyhjblrtitle").show();
            $("#xyhjblrtitle").text(agreeText + "环节未找到办理人，请联系系统服务人员！");
        }
    }

    $("#description").val(param.opinion);
    //上传/查看附件按钮触发事件
    $("#viewFile").click(function () {
        if (!$("#fj_id").val()) {
            var uuid = forms.uuid();
            $("#fj_id").val(uuid);
            openStack(window, "资料附件上传", ["550px", "400px"], "/workflow/instance/handleAttachment?fj_id=" + uuid);
        } else {
            openStack(window, "资料附件上传", ["550px", "400px"], "/workflow/instance/handleAttachment?fj_id=" + $("#fj_id").val());
        }
    });
    //点击提交按钮触发事件
    $("#sure").click(function () {
        $("#sure").prop("disabled", true);
        // 表单验证
        if ($("#description").val() == "") {
            layer.alert("请填写办理意见！");
            $("#sure").prop("disabled", false);
            return false;
        }
        param.sureFunc($("#description").val(), $("#fj_id").val());
        $("#sure").prop("disabled", false);
    });


    //配置动态加载属性
    var ModelBlrList_Propertys = {
        ModelName: "ModelBlrList", //模型名称
        columns: [
            {title: '办理人', id: 'USER_NAME', width: '50', align: 'center', renderer: "String"},
            {title: '所在机构', id: 'ORGAN_NAME', width: '100', align: 'center', renderer: "String"},
            {title: '环节名称', id: 'NEXT_NODE_NAME', width: '100', align: 'center', renderer: "String"}
        ],         //表头
        localData: param.blrList,
        mulchose: false,    //是否多选
        checkbox: false, //是否使用checkbox
        ordinal: false,    //是否有序号
        pagination: false, //是否分页
        columnResize: true
    };

    //专户管理列表模型，继承BaseGridModel
    var modelBlrList = new BaseGridModel(ModelBlrList_Propertys);

    //渲染列表
    modelBlrList.render();
});
////关闭办理页面
//function cancelCheck() {
//    if (param.taskNum == 1) {
//        param.callBackDeleteFunc();
//    } else {
//        param.callBackCloseFunc();
//    }
//    if(_top.workFlowType == "layer"){
//        return false;
//    }
//}

