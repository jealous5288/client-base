$(function () {
    $(".ifrContent").height($(window).height() - 30).width(200);
    $(window).resize(function () {
        $(".ifrContent").height($(window).height() - 30).width(200);
    });
    //通过URL获取参数
    var id = GetQueryString("id");
    //列表参数
    var columns = [
        {title: '办理人', id: 'HANDLER', width: '120', align: 'center', renderer: "String"},
        {title: '派发时间', id: 'ALLOT_DATE', width: '240', align: 'center', renderer: "String"},
        // {title: '签收时间', id: 'ACCEPT_DATE', width: '120', align: 'center', renderer: "String"},
        {title: '办理时间', id: 'FINISH_DATE', width: '240', align: 'center', renderer: "String"},
        {title: '状态', id: 'STATUS', width: '140', align: 'center', renderer: "String"},
        {title: '动作', id: 'ACTION', width: '', align: 'center', renderer: "String"}
    ];
    //拼接请求URL  从后台取数据
    var url = "/workflow/instance/taskPage";
    //流程实例id
    var wfiId = GetQueryString("wfiId");
    //环节id
    var nodeId = GetQueryString("nodeId");

    url = url + "?wfiId=" + wfiId + "&nodeId=" + nodeId;
    //配置动态加载属性
    var ModelTaskList_Propertys = {
        ModelName: "ModelTaskList", //模型名称
        columns: "",         //表头
        url: url,             //表体
        pagination: false
    };
    //创建列表模型实例
    var modelTaskList = new BaseGridModel(ModelTaskList_Propertys);
    //设置表头
    modelTaskList.set("columns", columns);
    //设置行双击事件
    modelTaskList.set("onRowDblClick", onRowDblClick);
    if (wfiId && nodeId) {
        modelTaskList.render();
    }

});
function onRowDblClick(rowIndex, rowData, event) {
    openStack(window, "流程监控", ["860px", "550px"], "/workflow/instance/taskHandle",
        {taskId: rowData.ID, flowViewTag: true});
}
