var body = $("#body");
var w = $(window);
var buttonbar = $("#buttonbar");
w.resize(function () {
    body.height(w.height() - buttonbar.outerHeight(true) - 24);
}).resize();
$("document").ready(function () {
    //初始化按钮
    $('#button-new').omButton({
        icons: {left: RX.handlePath('/medias/images/baseModel/button/add.gif')},
        onClick: function () {
            panel().newFlow();
        }
    });
    $('#button-save').omButton({
        icons: {left: RX.handlePath('/medias/images/baseModel/button/disk.gif')},
        onClick: function () {
            panel().save();
        }
    });
    $('#buttonbar').omButtonbar({
        width: "100%",
        btns: [
            {
                label: "选择",
                id: "button-select",
                icons: {left: RX.handlePath('/medias/images/baseModel/lcsj/0069.png')},
                onClick: function () {
                    panel().select();
                }
            },
            {
                label: "开始环节",
                id: "button-draw-start-node",
                icons: {left: RX.handlePath('/medias/images/baseModel/lcsj/0144.png')},
                onClick: function () {
                    panel().draw('StartNode');
                }
            },
            {
                label: "活动环节",
                id: "button-draw-rect",
                icons: {left: RX.handlePath('/medias/images/baseModel/lcsj/0230.png')},
                onClick: function () {
                    panel().draw('ActivityNode');
                }
            },
            {
                label: "决策环节",
                id: "button-draw-diamond",
                icons: {left: RX.handlePath('/medias/images/baseModel/lcsj/0494.png')},
                onClick: function () {
                    panel().draw('DecisionNode');
                }
            },
//                {
//                    label:"嵌套环节",
//                    id:"button-draw-nestedrect",
//                    icons:{left:'/medias/images/baseModel/lcsj/0125.png'},
//                    onClick:function () {
//                        panel().draw('ClusterNode');
//                    }
//                },
//                {
//                    label:"传阅环节",
//                    id:"button-draw-read-node",
//                    icons:{left:'/medias/images/baseModel/lcsj/0362.png'},
//                    onClick:function () {
//                        panel().draw('CirculationNode');
//                    }
//                },
            {
                label: "结束环节",
                id: "button-draw-end-node",
                icons: {left: RX.handlePath('/medias/images/baseModel/lcsj/0143.png')},
                onClick: function () {
                    panel().draw('EndNode');
                }
            },
            {
                label: "流向",
                id: "button-draw-polyline",
                icons: {left: RX.handlePath('/medias/images/baseModel/lcsj/0277.png')},
                onClick: function () {
                    panel().relate('Router');
                }
            }
        ]
    });
    w.resize();
});

var flowlist = $("#flowlist");
var workflowTree = $.fn.zTree.init(flowlist, {
    async: {
        type: "get",
        enable: true,
        autoParam: ['id'],
        url: "/workflow/designTools/createWorkflowTypeAndWorkflowTree?ran=" + Math.random()
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    view: {
        selectedMulti: false
    },
    edit: {
        drag: {
            isCopy: false,
            isMove: false
        },
        showRenameBtn: false,
        enable: true,
        removeTitle: "删除"
    },
    callback: {
        beforeRemove: beforeRemove,
        onClick: function (event, treeId, treeNode) {
            var id = treeNode.id.split("_").pop();
            $.get("/workflow/designTools/getWorkflowJSON", {id: id, c: Math.random}, function (ar) {
                if (ar.success) {
                    panel().getWorkflow(ar.data);
                } else {
                    _top.layer.alert(ar.msg);
                }
            }, 'json');
        },
        beforeClick: function (treeId, treeNode, clickFlag) {
            return treeNode.type == 'workflow';
        },
        onAsyncSuccess: zTreeOnAsyncSuccess
    }
}, null);
function beforeRemove(treeId, treeNode) {
    if (treeNode.isParent) {
        alert("不准删除流程类别！");
        return false;
    }
    if (treeNode.level == 0) {
        return false;
    }
    var zTree = $.fn.zTree.getZTreeObj("flowlist");
    zTree.selectNode(treeNode);
    if (!confirm("确认删除 节点 -- " + treeNode.name + " 吗？")) return false;
    //var flag;
    var nodeId = treeNode.id.replace("f_", "");
    var sureDel = false;
    $.ajax({
        type: "post",
        url: "/workflow/designTools/delWorkflow",
        data: {
            id: nodeId
        },
        async: false,
        success: function (ar) {
            if (ar.success) {
                sureDel = true;
                _top.layer.alert("删除成功");
            } else {
                sureDel = false;
                _top.layer.alert(ar.msg);
            }
        }
    });
    return sureDel;
}
function panel() {
    //chrome 存在本地跨域问题
    return $("#flow-panel")[0].contentWindow;
}
var index;
$("body").ajaxStart(function () {
    index = _top.layer.msg("服务器正在处理您的请求，请稍候...");
}).ajaxStop(function () {
    _top.layer.close(index);
});

//异步加载树默认展开节点
var firstAsyncSuccessFlag = 0;
function zTreeOnAsyncSuccess(event, treeId, msg) {
    if (firstAsyncSuccessFlag == 0) {
        try {
            //调用默认展开第一个结点
            var nodes = workflowTree.getNodes();
            workflowTree.expandNode(nodes[0], true);
            firstAsyncSuccessFlag = 1;
            closeLoading();
        } catch (err) {
        }
    }
}