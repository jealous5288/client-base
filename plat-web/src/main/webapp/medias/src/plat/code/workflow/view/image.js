var panel = null;
$("document").ready(function () {
    pageAjax();
    panel = new FlowViewer($("#canvas"));
    var flow = new Flow();
    flow.name = "test flow";
    var p = new workflowProperty();
    flow.property = p;
    panel.flow = flow;
    panel.drawFlow();
    var id = GetQueryString("id");
    if (id != "" && !isNaN(id)) {
        $.get("/workflow/instance/getSimpleWorkflowJSON", {id: id, c: Math.random}, function (ar) {
            if (ar.success) {
                getWorkflow(ar.data);
            } else {
                _top.layer.alert(ar.msg);
            }
        }, 'json');
    }
});
function select() {
    getPanel().changeStatus(Status.SELECT, null);
}
function draw(type) {
    getPanel().changeStatus(Status.DRAW, type);
}
function relate(type) {
    getPanel().changeStatus(Status.RELATE, type);
}
function getPanel() {
    return panel;
}
var NodeInstanceStatus = {
    'SYNCHRO_WAITING': 0,
    'RUNNING': 1,
    'FINISHED': 2,
    'ASYNCHRONISM_FINISHED': 3,
    'AUTO_FINISHED': 4
}
function getNodeStatus(instance, nodes) {
    for (var i = 0; i < instance.length; i++) {
        var ins = instance[i];
        if (nodes.length == undefined) {
            if (ins.transactNode.id == nodes.id) {
                return ins.finishDate ? 2 : -1;
            }
        } else {
            for (var j = 0; j < nodes.length; j++) {
                var node = nodes[j];
                if (ins.transactNode.id == node.id) {
                    return ins.finishDate ? 2 : -1;
                }
            }
        }
    }
    return -1;
}
function getIns(instance, nodes) {
    for (var i = 0; i < instance.length; i++) {
        var ins = instance[i];
        if (nodes.length == undefined) {
            if (ins.node_id.id == nodes.id) {
                return ins;
            }
        } else {
            for (var j = 0; j < nodes.length; j++) {
                var node = nodes[j];
                if (ins.node_id.id == node.id) {
                    return ins;
                }
            }
        }
    }
    return null;
}
function nextNode(nodes, routers, node) {
    var startNode = node;
    var endNode = null;
    var rc = routers.length;
    var count = 0;
    var results = [];
    while (count++ < rc) {
        for (var i = 0; i < rc; i++) {
            var r = routers[i];
            if (r.startNode.id == startNode.id) {
                endNode = r.endNode;
                var type = endNode.type;
                if (type == 0 || type == 1 || type == 4) {
                    startNode = endNode;
                    endNode = null;
                } else {
                    results.push(endNode);
                }
            }
        }
    }
    return results;
}
function prevNode(nodes, routers, node) {
    var startNode = null;
    var endNode = node;
    var rc = routers.length;
    var count = 0;
    var results = [];
    while (count++ < rc) {
        for (var i = 0; i < rc; i++) {
            var r = routers[i];
            if (r.endNode.id == endNode.id) {
                startNode = r.startNode;
                var type = startNode.type;
                if (type == 0 || type == 1 || type == 7 || type == 8) {
                    endNode = startNode;
                    startNode = null;
                } else {
                    results.push(startNode);
                }
            }
        }
    }
    return results;
}
function getWorkflow(data) {
    var nodeId = data.nodeId;
    var sf = data.Workflow;
    var ins = data.WorkflowInstance;
    var winstance = data.instance;
    if (sf == null) {
        return;
    }
    var f = sf.workflow;
    var ns = sf.nodes;
    var rs = sf.routers;
    var p = new workflowProperty();
    p.id = f.id;
    p.version = f.version;
    p.code = f.code;
    p.name = f.name;
    p.description = p.description;
    p.type = f.type.id;
    if (f.priority != null) p.priority = f.priority.toUpperCase() == "IMPORTANCE" ? 1 : 2;
    p.startupProcessSql = f.startupProcessSql;
    p.finishProcessSql = f.finishProcessSql;
    p.instanceTitle = f.instanceTitle;
    var i, j, k;
    var ncount = ns.length;
    for (i = 0; i < ncount; i++) {
        var n = new nodeProperty();
        n.domid = "";
        n.id = ns[i].id;
        n.name = ns[i].name;
        n.x = ns[i].x;
        n.y = ns[i].y;
        var nt = ns[i].type.toUpperCase();
        switch (nt) {
            case "START_NODE":
            case "END_NODE":
            case "DECISION_NODE":
                if (nt == "START_NODE")
                    n.type = "0";
                else if (nt == "END_NODE")
                    n.type = "1";
                else if (nt == "DECISION_NODE") {
                    n.type = "4";
                }
                //上一个点和下一个点存在实例
                var prevN = prevNode(ns, rs, n);
                var nextN = nextNode(ns, rs, n);
                if (nextN.length) {
                    if(prevN){
                        n.status = (getIns(ins, nextN) &&  getIns(ins, prevN)) ? 1 : 0;
                    }
                } else {
                    var prevN = prevNode(ns, rs, n);
                    if (prevN) {
                        var instance = getIns(ins, prevN);
                        n.status = instance && instance.finishDate ? 1 : 0;
                        if (nt == "END_NODE" && n.status == 1) {
                            var state = true;
                            for (var insIndex = 0; insIndex < ins.length; insIndex++) {
                                var nodeIns = ins[insIndex];
                                if (!nodeIns.finishDate) {
                                    state = false;
                                    break;
                                }
                            }
                            n.status = state ? 1 : 0;
                        }
                    } else {
                        n.status = 1;
                    }
                }
                if (nt == "END_NODE") {
//                        if(winstance.status.toUpperCase() == "0"){
//                            var prevN = prevNode(ns, rs, n);
//                            var instance = getIns(ins,prevN);
//                            if (instance) {
//                                n.status = 1;
//                            }else if(prevN[0].type== "DECISION_NODE"){
//                                var instance2 = getIns(ins,prevNode(ns, rs, prevN[0]));
//                                var instance2 = getIns(ins,prevNode(ns, rs, prevN[0]));
//                                n.status = 1;
//                            }
//                        }
                    var instance = getIns(ins, n);
                    n.status = instance == null ? 0 : 2;
                }
                if (nt == "DECISION_NODE") {
                    if (winstance.status.toUpperCase() == "0") {
                        var prevN = prevNode(ns, rs, n);
                        var instance = getIns(ins, prevN);
                        if (instance) {
                            var nextN = nextNode(ns, rs, n);
                            if (nextN[0].type == "END_NODE") {
                                n.status = 1;
                            }
                        }
                    }
                }
                break;
            case "ACTIVITY_NODE":
            case "CIRCULATION_NODE":
            case "CLUSTER_NODE":
                if (nt == "ACTIVITY_NODE")
                    n.type = "2";
                else if (nt == "CLUSTER_NODE") {
                    n.type = "5";
                } else if (nt == "CIRCULATION_NODE") {
                    n.type = "3";
                }
                var instance = getIns(ins, n);
                n.status = instance == null ? 0 : 1;
        }
        if (nodeId == ns[i].id) {
            //运行中的环节
            n.status = 2;
            //进入时初始化任务列表，为当前环节
            $(window.parent.document.getElementById("blist")).attr("src", "taskList?wfiId=" + GetQueryString("id") + "&nodeId=" + nodeId);
        }
        p.addNode(n);
    }
    var rscount = rs.length;
    for (i = 0; i < rscount; i++) {
        var r = new routerProperty();
        r.domid = "";
        r.id = rs[i].id;
        r.name = rs[i].name;
        r.branch = rs[i].branch;
        r.startNodeId = rs[i].startNode.id;
        r.endNodeId = rs[i].endNode.id;
        p.addRouter(r);
    }
    var panel = getPanel();
    var flow = new Flow();
    flow.restoreFlow(p, false);
    panel.flow = flow;
    panel.drawFlow();
}
/**
 * 环节单击事件
 * 如果想取得环节id,用node.id即可。
 * @param node
 *  环节
 */
function nodeClick(node) {
    $(window.parent.document.getElementById("node_id")).val(node.id);
    $(window.parent.document.getElementById("transactListDiv")).attr("style", "display:block");
    $(window.parent.document.getElementById("taskListDiv")).attr("style", "display:block");
    $(window.parent.document.getElementById("blist")).attr("src", "taskList?wfiId=" + GetQueryString("id") + "&nodeId=" + node.id);
}
