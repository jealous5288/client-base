function initWorkflow(obj) {
    openWorkflow("/workflow/instance/taskHandle", obj.title, {flowCode: obj.flowCode});
}
//确认是否发起流程
//数据id-dataId,流程编码-flowCode,渲染参数(object)-buildParam,源数据参数(object)-sourceData,流程标题-title,toTag-
function confirmWorkflowStart(dataId, flowCode, buildParam, sourceData, title, toTag) {
//    var warn = "是否发起" + title;
//    var i = _top.layer.confirm(warn, function () {
//        _top.layer.close(i);
    startWorkflow(dataId, flowCode, buildParam, sourceData, title, toTag);
//    });
}

//初始化流程
//数据id-dataId,流程编码-flowCode,渲染参数-buildParam,源数据参数-sourceData,流程标题-title,toTag-,
function startWorkflow(dataId, flowCode, buildParam, sourceData, title, toTag) {
    if (!toTag) {
        toTag = getToTagUrl(window);
    }
    if (title) {
        var e = new RegExp("\n", "g");
        title = title.toString().replace(e, "").trim();
    }

    $.post("/workflow/instance/startWorkflow", {
            flowCode: flowCode,
            sourceData: JSON.stringify(sourceData), dataId: dataId, title: title
        },
        function (ar) {
            if (ar.success) {
                var par = {};
                par.buildParam = buildParam;
                par.sourceData = sourceData;
                par.taskId = ar.data.id;
                par.newTag = true;
                par.toTag = toTag;
                par.flowCode = flowCode;
                //流程办理
                openWorkflow(ar.data.url, title, par);
            } else {
                _top.layer.alert(ar.msg);
            }
        }
    );
}

//通过流程编码和业务数据ID办理流程,参数（数据ID，流程编码，标题，个性化参）
function handleWorkflowByCodeAndDataId(dataId, flowCode, title, par, toTag) {
    $.ajax({
        type: "post",
        url: "/workflow/instance/getNewestTaskId",
        data: {flowCode: flowCode, dataId: dataId},
        async: false,
        success: function (ar) {
            if (ar.success) {
                var taskId = ar.data;
                if (taskId) {
                    handleWorkflow(taskId, title, par, toTag);
                } else {
                    handleNoTaskWorkflow(dataId, flowCode, title, par, toTag);
                }
            } else {
                _top.layer.alert(ar.msg);
            }
        }
    });
}

//通过流程实例ID办理流程,参数（流程实例ID，标题，个性化参数）
function handleWorkflowByWiId(wiId, title, par, toTag) {
    if (!toTag) {
        toTag = getToTagUrl(window);
    }
    $.ajax({
        type: "post",
        url: "/workflow/instance/getNewestTaskIdByWiId",
        data: {wiId: wiId},
        async: false,
        success: function (ar) {
            if (ar.success) {
                var taskId = ar.data;
                if (taskId) {
                    handleWorkflow(taskId, title, par, toTag);
                } else {
                    // handleNoTaskWorkflow(dataId, flowCode, title, par);
                    layer.alert("未找到相关工作流");
                }
            } else {
                _top.layer.alert(ar.msg);
            }
        }
    });
}

//通过任务ID办理流程
function handleWorkflow(id, title, buildParam, toTag) {
    if (!toTag) {
        toTag = getToTagUrl(window);
    }
    var par = {};
    par.buildParam = buildParam || {};
    par.taskId = id;
    par.toTag = toTag;
    openWorkflow("/workflow/instance/taskHandle", title, par);
}
function handleNoTaskWorkflow(dataId, flowCode, title, buildParam, toTag) {
    $.ajax({
        type: "post",
        url: "/workflow/instance/getWorkflowSheetUrl",
        data: {flowCode: flowCode, dataId: dataId},
        success: function (ar) {
            if (ar.success) {
                var url = ar.data;
                if (url != null && url != "undefined") {
                    var par = {};
                    par.buildParam = buildParam;
                    par.sourceData = {};
                    par.WdataId = dataId;
                    _top.openStack(window, title, ["900px", "560px"], url, par);
                }
            } else {
                _top.layer.alert(ar.msg);
            }
        }
    });
}
var targetWin = null;
//流程办理
function openWorkflow(url, title, par) {
    _top.winData(_top, "flowParam", par);
    //工作流弹出风格
    if (_top.getWorkflowType() == "layer") {
        _top.layer.open({
            type: 2, // 代表iframe
            closeBtn: 1,
            title: title,
            maxmin: true,
            parentWin: window,
            area: ["1000px", "640px"],
            content: RX.handlePath(url),
            success: function (layero, index) {
                var iframeWin = _top.window[layero.find('iframe')[0]['name']];
                _top.pushStackWin(iframeWin, window);
                if (window.successCallback) {
                    window.successCallback();
                }
            },
            end: function () {
                // flushWorkflowInstance(data);
                if (typeof(reloadIndex) != "undefined") {
                    if (typeof(eval(reloadIndex)) == "function")  //回调首页刷新
                        reloadIndex();
                }
                _top.closeLayerWin();
            },
            cancel: function () {
                var cwin = _top.getUpperestWin();
                if (cwin != null) {
                    if (cwin.cancelCheck) {
                        if (!cwin.cancelCheck()) {
                            return false;
                        }
                    }
                }
                return true;
            }
        });
    } else {
        if (targetWin) {
            _top._gotoLocation(targetWin, url);
        } else {
            _top._gotoLocation(findWorkflowFrameWin(), url);
        }
    }
}

//清理流程实例
function flushWorkflowInstance(url) {
    $.post("/workflow/instance/flushWorkflowInstance", {id: jQuery.url.setUrl(url).param("id")}, function (data) {
    });
}

//查看流程图
function showStatus(id, title, buildParam) { //缺少title参数报错，已添加  wcy17/2/24
    var url = "/workflow/instance/workflowView?id=" + id;
    _top.openStack(window, title, ["850px", "550px"], url, buildParam);
}

var baseOpinionView;
function buildAutoOpinion(oid, param) {
    RX.load({
        module: "opinionView",
        callback: function () {
            baseOpinionView = new OpinionView({
                collection: new OpinionCollection,
                el: $("#" + oid),
                wiId: param.wId,
                npId: param.npId,
                spId: param.spId,
                lookflg: param.lookflg
            });
            baseOpinionView.render();
        }
    })
}

function getFrameOpinion() {
    if (baseOpinionView) {
        var obj = $(".flowEditOpinion");
        if (obj.length > 0) {
            {
                return {npId: obj.attr("npId"), opinion: obj.val()};
            }
        }
    }
}