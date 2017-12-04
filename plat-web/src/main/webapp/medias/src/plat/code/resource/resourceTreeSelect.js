var tree;
var id = GetQueryString("id");
var resourceType = GetQueryString("resourceType");
var func = GetQueryString("func");
$(function () {
    //异步提示注册
    pageAjax();
    //初始化尺寸
    resizeForm();

    tree = $.fn.zTree.init($("#tree"), {
        data: {
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "pid",
                rootPId: 0
            }
        },
        async: {
            enable: true,
            type: "post",
            url: "/resource/getResourceTreeData?removeId="+id+"&resourceType="+resourceType,
            autoParam: ["id"]
        }
    });

    $("#save").click(function () {
        var nodes = tree.getSelectedNodes();
        if(nodes.length == 0){
            layer.alert("未选择");
        }else{
            var evalFunc = eval("getPrevWin()."+func);
            evalFunc(nodes[0].id,nodes[0].name,nodes[0].type);
            closeWin();
        }
    });
});

