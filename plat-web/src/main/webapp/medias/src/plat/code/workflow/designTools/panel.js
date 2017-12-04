var panel = null;

$("document").ready(function () {
    panel = new Panel($("#canvas"));
    var flow = new Flow();
    flow.name = "test flow";
    var p = new workflowProperty();
    flow.property = p;
    panel.flow = flow;
    panel.drawFlow();
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


function setPanel(p) {
    panel = p;
}


function source() {
    alert($("#canvas").html());
}


function dialog() {
    alert($("#dialog-containers").html());
}


function verify() {
    getPanel().flow.verify();
}

function save() {
    var flow = getPanel().flow.property;
    if (flow.id == undefined) {
        flow.id = 0;
    }
    var type = flow.type;
    if (type == null || type == "") {
        layer.alert("流程类别不可为空");
        return false;
    }
    var nodes = flow.nodes;
    if (nodes) {
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].type == "2") {
                if (!nodes[i].roleId || nodes[i].roleId == "null") {
                    layer.alert("活动环节未指定办理角色");
                    return false;
                }
            }
        }
    }
    var json = $.toJSON(flow);
    json.sfyx_st = "VALID";
    $.ajax({
        url: "saveWorkflow",
        type: "POST",
        data: {
            json: json
        },
        success: function (ar) {
            if (ar.success) {
                layer.alert("保存成功");
                $.get("/workflow/designTools/getWorkflowJSON", {id: ar.data, c: Math.random}, function (ar) {
                    if (ar.success) {
                        getWorkflow(ar.data);
                    } else {
                        top.layer.alert(ar.msg);
                    }
                }, 'json');
            } else {
                top.layer.alert(ar.msg);
            }
        },
        error: function (xmlhttp, text, error) {
            top.layer.alert("保存失败" + text + error);
        }
    });
}
function newFlow() {
    var panel = getPanel();
    panel.destroyFlow();
    var flow = new Flow();
    var p = new workflowProperty();
    p.version = "1";
    p.code = "";
    p.name = "新建流程";
    flow.property = p;
    panel.flow = flow;
    $("#canvas").trigger("dblclick");
}

function getWorkflow(sf) {
    var f = sf.workflow;
    var ns = sf.nodes;
    var nss = sf.nodePages;
    var rs = sf.routers;
    var vs = sf.workflowVariables;
    var nodeButtons = sf.nodeButtons;
//    var vas = sf.variableassigns;
    var wfss = sf.workflowPages;

    var p = new workflowProperty();
    p.id = f.id;
    if (f.workflow) {
        p.workflow = f.workflow;
        p.versionName = f.versionName;
    }
    p.code = f.code;
    p.name = f.name;
    p.workflowYwztZd = f.workflowYwztZd;
    //设置原始业务状态字典
    p.initYwztZd = f.workflowYwztZd;
    p.workflowYwztZdName = f.workflowYwztZdName;
    p.description = f.description || "";
    if (f.startup) {
        p.startup = new sysColony(f.startup.id);
        clearColony(p.startup);
    }
    if (f.monitor) {
        p.monitor = new sysColony(f.monitor.id);
        clearColony(p.monitor);
    }
    if (f.manager) {
        p.manager = new sysColony(f.manager.id);
        clearColony(p.manager);
    }
    if (f.type) {
        p.type = f.type.id;
        p.typeName = f.type.name;
    }
    p.autoIssueDate = p.autoIssueDate.replace(/T/ig, " ").replace(/Z/ig, "");

    p.priority = f.priority;
    p.startupProcessSql = f.startupProcessSql || "";
    p.finishProcessSql = f.finishProcessSql || "";
    p.instanceTitle = f.instanceTitle || "";

    var i, j, k;
    var ncount = ns.length;
    var nscount = nss.length;
//    var vascount = vas.length;

    for (i = 0; i < ncount; i++) {
        var n = new nodeProperty();
        n.domid = "";
        n.id = ns[i].id;
        n.name = ns[i].name;
        n.nodeSort = ns[i].sort;
        n.sfxsbc = ns[i].sfxsbc;
        n.sfbxscfj = ns[i].sfbxscfj;

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
                    if (ns[i].decisionType)
                        n.decisionType = ns[i].decisionType.toUpperCase() == "MANUAL" ? 0 : 1;
                }
                break
            case "ACTIVITY_NODE":
            case "CIRCULATION_NODE":
            case "CLUSTER_NODE":
                n.roleId = ns[i].roleId;
//                if (ns[i].colonyId) {
//                    n.transactUser = new sysColony(ns[i].colonyId);
//                    clearColony(n.transactUser);
//                }
                n.startupProcessSql = ns[i].startupProcess || "";
                n.finishProcessSql = ns[i].finishProcess || "";

                if (ns[i].eleOpinion != undefined) {
                    n.eleOpinion = ns[i].eleOpinion;
                }
                if (ns[i].eleTransactUser != undefined) {
                    n.eleTransactUser = ns[i].eleTransactUser;
                }
                if (ns[i].eleFinishDate != undefined) {
                    n.eleFinishDate = ns[i].eleFinishDate;
                }
                if (nt == "ACTIVITY_NODE") {
                    n.type = "2";
                    n.transactType = ns[i].transactType.toUpperCase() == "PREEMPTION" ? 0 : 1;
                    n.countersignParameter = ns[i].countersignParameter.toUpperCase() == "ALL" ? 0 : ns[i].countersignParameter.toUpperCase() == "PROPORTION" ? 1 : 2;
                    n.countersignValue = ns[i].countersignValue ? ns[i].countersignValue : "";
                    n.convergeType = ns[i].convergeType.toUpperCase() == "SYNC_CONVERGE" ? 0 : ns[i].convergeType.toUpperCase() == "ASYNC_CONVERGE" ? 1 : 2;
                    n.disagreeNodeDomid = ns[i].disagree_node_id ? "n" + ns[i].disagree_node_id : "";
                    n.submitName = ns[i].submitName ? ns[i].submitName : "";
                    n.saveName = ns[i].saveName ? ns[i].saveName : "";
                }
                else if (nt == "CLUSTER_NODE") {
                    n.type = "5";
                    if (ns[i].childWorkflow)
                        n.childWorkflow = ns[i].childWorkflow.id;
                }
                else if (nt == "CIRCULATION_NODE") {
                    n.type = "3";
                }
                //环节业务状态
                if (nt == "ACTIVITY_NODE") {
                    n.ywzt = ns[i].ywzt ? ns[i].ywzt : "";
                }
                break
        }
        //
        var buttonsLength = nodeButtons.length;
        for (j = 0; j < buttonsLength; j++) {
            if (nodeButtons[j].node.id == n.id) {
                var nButton = new nodeButton();
                var tempns = nodeButtons[j];
                nButton.id = tempns.id;
                nButton.name = tempns.name;
                nButton.code = tempns.code || "";
                nButton.icon = tempns.icon || "";
                nButton.flag = tempns.flag || "";
                nButton.funcName = tempns.funcName || "";
                nButton.sort = tempns.sort || "";
                nButton.isShowInHandle = tempns.isShowInHandle || "";
                n.addButton(nButton);
            }
        }
        for (j = 0; j < nscount; j++) {
            if (nss[j].node.id == n.id) {
                var nsheet = new nodeSheet();
                var tempns = nss[j];
                nsheet.id = tempns.id;
                if (wfss && wfss.length > 0) {
                    for (var x = 0; x < wfss.length; x++) {
                        if (wfss[x].sysPage.id == tempns.page_id) {
                            nsheet.name = wfss[x].name;
                            break;
                        }
                    }
                }
                nsheet.title = tempns.title;
                nsheet.sheet_id = tempns.page_id;
                nsheet.sort = tempns.sort;
                nsheet.spxName = "";
                nsheet.spxSort = "";
                nsheet.spxPrint = "0";
                nsheet.control = tempns.control;
                switch (tempns.control.toUpperCase()) {
                    case "EDIT":
                        nsheet.sheetMode = "办理";
                        break
                    case "EXAMINE":
                        nsheet.sheetMode = "审批";
                        nsheet.spxSort = tempns.spxSort;
                        nsheet.spxName = tempns.spxName;
                        nsheet.spxPrint = tempns.spxPrint == "1" ? "1" : "0";
                        break
                    case "VIEW":
                        nsheet.sheetMode = "查看";
                        break
                    case "SEAL":
                        nsheet.sheetMode = "签章";
                        break
                }
                n.addSheet(nsheet);
            }
        }
//        for (j = 0; j < vascount; j++) {
//            if (vas[j].node.id == n.id) {
//                var name = sf.va[vas[j].id + ''];
//                var v = new workflowVariable(vas[j].id, name, vas[j].expression);
//                n.addVariable(v);
//            }
//        }
        p.addNode(n);
    }
    var rscount = rs.length;
    for (i = 0; i < rscount; i++) {
        var r = new routerProperty();
        r.domid = "";
        r.id = rs[i].id;
        r.name = rs[i].name || '';
        r.branch = rs[i].branch || '';
        r.startNodeId = rs[i].startNode ? rs[i].startNode.id : 0;
        r.endNodeId = rs[i].endNode ? rs[i].endNode.id : 0;
//        r.description = rs[i].description || '';
        p.addRouter(r);
    }
    var vscount = vs.length;
    for (i = 0; i < vscount; i++) {
        var v = new workflowVariable(vs[i].id, vs[i].name, vs[i].value);
        p.addVariable(v);
    }
    var wfsscount = wfss.length;
    for (i = 0; i < wfsscount; i++) {
        var wfs = wfss[i];
        var title = wfs.name;
        var sort = wfs.sort;
        var name = sf.wfn[wfs.id + ''];
        wfs.title = title;
        var wfsheet = new workflowSheet(wfs.id, name, title, wfss[i].sysPage.id, sort);
        p.addSheet(wfsheet);
    }
    var panel = getPanel();
    panel.destroyFlow();
    var flow = new Flow();
    flow.restoreFlow(p, false);
    panel.flow = flow;
    panel.drawFlow();
}
function clearColony(colony) {
    colony.name = undefined;
    colony.includeOrgans = undefined;
    colony.includePosts = undefined;
    colony.includeUsers = undefined;
    colony.excludeOrgans = undefined;
    colony.excludePosts = undefined;
    colony.excludeUsers = undefined;
}
$(function () {
    $("body").ajaxStart(function () {
        index = top.layer.msg("服务器正在处理您的请求，请稍候...");
    }).ajaxStop(function () {
        top.layer.close(index);
    });
});