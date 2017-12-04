var znode,
    func = GetQueryString("func"),
    modelName = GetQueryString("modelName"),
    selectType = GetQueryString("selectType");

var url = "/workflow/designTools/"+(selectType == "workflow" ? "createWorkflowTypeAndWorkflowTree":"createWorkflowTypeTree")+"?ran=" + Math.random();

//树节点点击事件
function zTreeOnClick(event, treeId, treeNode) {
    znode = treeNode;
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
        url:url
    },
    view:{
        selectedMulti:false
    },
    callback:{
        onClick:zTreeOnClick
    }
};

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
            url:url
        },
        callback:{
            onClick:function (event, treeId, treeNode, clickFlag) {
                $("[name=parentCategory]").val(treeNode.name);
                $("#parentId").val(treeNode.id);
                tempTreeNode = mainTree.getNodeByParam("id", treeNode.id, null);
            }
        }
    };
    treename += "流程类别树";
    var treePam = {setting:setting};
    return treePam;
}

$(function(){
    //重置窗口
    resizeForm();
    //初始化mainTree
    mainTree = $.fn.zTree.init($("#tree"), setting);
    //挂载保存方法
    $("#yes").click(function () {
        if(znode.id && znode.name){
            if(selectType == "workflow" && znode.type == "workflowtype"){
                _top.layer.alert("请选择流程");
                return;
            }
            var evalFunc = getPrevWin()[func];
            result = evalFunc(selectType == "workflow"?znode.id.split("_").pop():znode.id, znode.name, modelName);
            if(result || typeof(result) == "undefined"){
                _top.closeLayer(window);
            }
        }else{
            if(znode.type == "workflowtype"){
                _top.layer.alert("未选择流程");
            }else{
                _top.layer.alert("未选择流程类别");
            }
        }
    });
    $("#cancel").click(function(){
      _top.closeLayer(window);
    });
})