var isAdd = true; //弹出窗口中是添加操作还是修改操作
var saveTreeId = -1; //保存的节点id
var tempTreeNode; //缓存节点
var mainTree; //主体树对象

//刷新树父节点方法
function reLoadPartentNode(id, operate) {
    var pId = $("#parentId").val();
    var parentNode = mainTree.getNodeByParam("id",pId);
    mainTree.reAsyncChildNodes(parentNode, "refresh");
}

//树节点点击事件
function zTreeOnClick(event, treeId, treeNode) {
    if (treeNode.level == 0) {
        return false;
    }
//    initTableInfo(false);
}

//初始化tree参数
var setting = {
    data:{
        simpleData:{
            enable:true,
            idKey:"id",
            pIdKey:"pId",
            rootPId:0
        }
    },
    async:{
        type:"get",
        enable:true,
        autoParam:["id"],
        url:"/workflow/designTools/createWorkflowTypeTree?ran=" + Math.random()
    },
    view:{
        addHoverDom:addHoverDom,
        removeHoverDom:removeHoverDom,
        selectedMulti:false
    },
    edit:{
        drag:{
            isCopy:false,
            isMove:true
        },
        enable:true,
        editNameSelectAll:true
    },
    callback:{
        onClick:zTreeOnClick,
        beforeEditName:altherInfoOfTree,
        beforeRemove:beforeRemove,
        beforeDrag:function (treeId, treeNodes) {
            if (treeNodes[0].id == 0) {
                return false;
            }
        },
        beforeDrop:function (treeId, treeNodes, targetNode, moveType, isCopy) {
            return confirm("你确定要移动此节点？");
        },
        onDrop:function (event, treeId, treeNodes, targetNode, moveType) {
            $.ajax({
                type:"post",
                url:"/workflow/designTools/saveWorkflowType",
                data:{
                    parent:targetNode.id,
                    id:treeNodes[0].id
                }
            })
        },
        onAsyncSuccess: zTreeOnAsyncSuccess
    }
};

var zNodes = null;
//新增流程类型处理
function addHoverDom(treeId, treeNode) {
    var sObj = $("#" + treeNode.tId + "_span");
    if (treeNode.editNameFlag || $("#addBtn_" + treeNode.id).length > 0) return;
    var addStr = "<span class='button add' id='addBtn_" + treeNode.id
        + "' title='add node' onfocus='this.blur();'></span>";
    sObj.after(addStr);
    var btn = $("#addBtn_" + treeNode.id);
    if (btn) {
        btn.bind("click", function () {
            saveTreeId = -1;
            initTableInfo(true);
            $(".formCategory input,.formCategory textarea").val("");
            $("[name=parentCategory]").val(treeNode.name);
            $("#parentId").val(treeNode.id);
            $("#oldPid").val(treeNode.id);
            $("#save").show().removeClass("isEdit");
            isAdd = true;
            tempTreeNode = treeNode;
            return false;
        });
    }
}

//删除流程类型处理
function removeHoverDom(treeId, treeNode) {
    $("#addBtn_" + treeNode.id).unbind().remove();
}

//初始化表格内容
function initTableInfo(isEdit) {
    var status = false;
    if (isEdit) {
        status = false;
    } else {
        status = true;
    }
    $(".formCategory input,.formCategory textarea").attr("disabled", status).css({
        "background-color":status ? "#efefef" : "#fff"
    });
}

//修改流程类型时的处理
function altherInfoOfTree(treeId, treeNode, newName) {
    if (treeNode.level == 0) {
        return false;
    }
    getFormTypeInfo(treeNode.id, mainTree.getNodeByParam("id",treeNode.pId).name   );
    saveTreeId = treeNode.id;
    $("#save").show().addClass("isEdit");
    initTableInfo(true);
    return false;
}

//获取修改的节点内容，传至修改表单中
function getFormTypeInfo(id, pname) {
    $.ajax({
        type:'post',
        url:"/workflow/designTools/getWorkflowType",
        data:{
            id:id
        },
        success:function (ar) {
            $("input[alias='name']").val(ar.data["name"]);
            $("input[alias='categoryCode']").val(ar.data["id"]);
            $("#selfId").val(ar.data["id"]);
            $("[name=parentCategory]").val(pname);
            $("#parentId").val(ar.data["parent_id"]);
            $("#oldPid").val(ar.data["parent_id"]);
            $("textarea[alias='description']").val(ar.data["description"]);
        }
    })
}

//删除流程类型的处理
function beforeRemove(treeId, treeNode) {
    if (treeNode.level == 0) {
        return false;
    }
    mainTree.selectNode(treeNode);
    if (!confirm("确认删除 节点 -- " + treeNode.name + " 吗？")) return false;
    //var flag;
    var nodeId = treeNode.id;
    var sureDel = false;
    $.ajax({
        type:"post",
        url:"/workflow/designTools/delWorkflowType",
        data:{
            id:nodeId
        },
        async:false,
        success:function (ar) {
            if (ar.success) {
                sureDel = true;
                _top.layer.mag("删除成功",{icon:1});
                reLoadPartentNode(treeNode.id);
            } else {
                sureDel = false;
                _top.layer.alert(ar.msg);
            }
        }
    });
    return sureDel;

}

//初始化tree参数
function initTreeParm(treename) {
    var setting = {
        data:{
            simpleData:{
                enable:true,
                idKey:"id",
                pIdKey:"pId",
                rootPId:0
            }
        },
        async:{
            type:"get",
            enable:true,
            autoParam:["id", "name", "pId", "children"],
            url:"/workflow/designTools/createWorkflowTypeTree?ran=" + Math.random()
        },
        callback:{
            onClick:function (event, treeId, treeNode, clickFlag) {
                $("[name=parentCategory]").val(treeNode.name);
                $("#parentId").val(treeNode.id);
                tempTreeNode = mainTree.getNodeByParam("id", treeNode.id, null);
            }
        }
    };
    treename += "机构树";
    var zNodes = null;
    var treePam = {setting:setting, zNodes:zNodes};
    return treePam;
}

$(function(){
    //初始化表单内容
    initTableInfo(false);
    //初始化mainTree
    mainTree = $.fn.zTree.init($("#tree"), setting, zNodes);
    //挂载保存方法
    $("#save").click(function () {
        if(!$("input[alias=name]").val()){
            _top.layer.alert("类别名称不能为空");
            return;
        }
        if (!$(this).hasClass("isEdit")) {
            $.ajax({
                type:'post',
                url:"/workflow/designTools/saveWorkflowType",
                data:{
                    name:$("input[alias=name]").val(),
                    description:$("textarea[alias='description']").val(),
                    parent:$("#parentId").val()
                },
                success:function (data) {
                    if (data != "error") {
                        _top.layer.alert("操作成功");
                        $("#save").hide();
                        reLoadPartentNode(data, true);
                        initTableInfo(false);
                    } else {
                        _top.layer.alert("操作失败");
                    }
                }
            });
        } else {
            $.ajax({
                type:'post',
                url:"/workflow/designTools/saveWorkflowType",
                data:{
                    id:$("#selfId").val(),
                    name:$("input[alias=name]").val(),
                    description:$("textarea[alias='description']").val(),
                    parent:$("#parentId").val()
                },
                success:function (data) {
                    if (data != "error") {
                        _top.layer.alert("操作成功");
                        $("#save").hide();
                        reLoadPartentNode(data, false);
                        initTableInfo(false);
                    } else {
                        _top.layer.alert("操作失败");
                    }
                }
            });
        }
        $(this).hide();
    });
    //挂载表单选择树显示事件
    $(".orgPic ").click(function () {
        var treename = $(this).attr("_treeName");
        var treeParm = initTreeParm(treename);
        $.fn.zTree.init($("#parentTree"), treeParm.setting, treeParm.zNodes);
    });
});

//异步加载树默认展开节点
var firstAsyncSuccessFlag = 0;
function zTreeOnAsyncSuccess(event, treeId, msg) {
    if (firstAsyncSuccessFlag == 0) {
        try {
            //调用默认展开第一个结点
            var nodes = mainTree.getNodes();
            mainTree.expandNode(nodes[0], true);
            firstAsyncSuccessFlag = 1;
            closeLoading();
        } catch (err) {
        }
    }
}