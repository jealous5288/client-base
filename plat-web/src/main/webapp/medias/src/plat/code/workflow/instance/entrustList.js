var modelEntrustList;  //委办列表
$(function () {
    //初始化尺寸
    resizeTable();
    //注册加载遮蔽层
    pageAjax();
    //创建列表模型类
    modelEntrustList = new BaseGridModel(ModelEntrustList_Propertys);
    //设置双击事件
    modelEntrustList.set("onRowDblClick", function onRowDblClick(rowIndex, rowData, isSelected, event) {
        openStack(window,"查看委办","small","/workflow/instance/entrustEdit?type=ck&id="+rowData.ID);
    });
    //渲染页面
    modelEntrustList.render();
    //新增委办计划
    $("#add").click(function(){
        openStack(window,"新增委办","small","/workflow/instance/entrustEdit?type=xz");
    });
    //停止委办计划
    $("#stop").click(function(){
        var obj = modelEntrustList.getSelect();//获取选中行的数据
        if (obj == null || obj == undefined || obj[0] == null || obj[0].SFYX_ST == "0") {
            layer.alert("请选择一条数据");
        } else {
            layer.confirm("确定要停用委托计划吗？", function (index) {
                $.ajax({type: "post",
                    url: "/workflow/instance/stopEntrust",
                    data: {id: obj[0].ID},
                    dataType: "json",
                    success: function (ar) {
                        if (ar.success) {
                            layer.alert("停止成功");
                            reloadTable();
                        } else {
                            layer.alert(ar.msg);
                        }
                    }
                });
                layer.close(index);
            });
        }
    });
});

/**
 * 载入数据表格
 * @param param
 */
function reloadTable(param){
    modelEntrustList.reloadGrid(param);
}