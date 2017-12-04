$(function () {
    $(".ifrContent").height($(window).height() - 30).width(200);
    $(window).resize(function () {
        $(".ifrContent").height($(window).height() - 30).width(200);
    });
    //通过URL获取参数
    var workflowInstanceId = GetQueryString("workflowInstanceId");
    var transactNodeid = GetQueryString("transactNodeid");
    if(!transactNodeid){
        transactNodeid = 0;
    }
    //列表参数
    var columns = [
        {title: '创建时间', id: 'create_date', width: '80', align: 'center',  renderer: "Date",format:"yyyy-MM-dd hh:mm:ss"},
        {title: '完成时间', id: 'finish_date', width: '80', align: 'center', renderer: "Date",format:"yyyy-MM-dd hh:mm:ss"},
        {title: '状态', id: 'status', width: 'autoExpand', align: 'center', renderer: function (v, rowData, rowIndex) {
            var zt=v;
            if (v == "1") {
                zt = "运行";
            }else if(v =="2"){
                zt = "完成";
            }
            return  zt ;
        }}
    ];
    //拼接请求URL  从后台取数据
    var url = "/workflow/instance/getTransactList";
    if (workflowInstanceId != null)
        url = url + "?workflowInstanceId=" + workflowInstanceId+"&transactNodeid="+transactNodeid ;
    else
        url = url + "?workflowInstanceId=" + 0+"&transactNodeid="+0;
    //配置动态加载属性
    var ModelTransactList_Propertys = {
        ModelName: "ModelTransactList", //模型名称
        columns: "",         //表头
        url: url,             //表体
        pagination:false
    };
    //创建列表模型实例
    var modelTransactList = new BaseGridModel(ModelTransactList_Propertys);
    //设置表头
    modelTransactList.set("columns", columns);
    //设置行点击事件
    modelTransactList.set("onRowClick", onRowClick);
    modelTransactList.render();
//    if (workflowInstanceId != null){
//        var firstTransactId;
//        $.ajax({
//            type: "post",
//            url: "/workflow/instance/getFirstTransactId",
//            async: false,
//            data: {workflowInstanceId: workflowInstanceId,transactNodeid:transactNodeid},
//            dataType: "json",
//            success: function (ar) {
//                firstTransactId=ar.data;
//            }
//        });
//        $(window.parent.document.getElementById("blist")).attr("src","taskList?id=" + firstTransactId);
//    }
});
function onRowClick(rowIndex, rowData, isSelected, event) {
    $(window.parent.document.getElementById("blist")).attr("src","taskList?id=" + rowData.id);
}