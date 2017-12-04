var modelConfigList;         //配置列表对象
$(function () {
    //异步提示注册
    pageAjax();
    //初始化尺寸
    resizeTable();
    //列表模型
    modelConfigList = new BaseGridModel(ModelConfigList_Propertys);
    //设置列表搜索区
    modelConfigList.buildSearchView();
    //设置双击事件
    if (!modelConfigList.get("mulchose")) {
        modelConfigList.set("onRowDblClick", function onRowDblClick(rowIndex, rowData, isSelected, event) {
            openStack(window, "查看配置", "medium", "/config/configEdit?type=ck&id=" + rowData.ID);
        });
    }
    //渲染列表
    modelConfigList.render();
    //新增
    $("#add").click(function () {
        openStack(window, "新增配置", "medium", "/config/configEdit?type=xz");
    });
    //修改
    $("#edit").click(function () {
        var row = modelConfigList.getSelect();
        if (row && row.length == 1) {
            openStack(window, "修改配置", "medium", "/config/configEdit?type=xg&id=" + row[0].ID);
        } else {
            layer.alert("请选择一条待修改的数据");
        }
    });
    //删除
    $("#del").click(function () {
        var obj = modelConfigList.getSelect();//获取选中行的数据
        if (obj == null || obj.length != 1) {
            layer.alert("请选择一条待删除的数据");
        } else {
            layer.confirm("确定要删除所选记录吗？", function (index) {
                layer.close(index);
                $.ajax({
                    type: "post",
                    url: "/config/delConfig",
                    data: {id: obj[0].ID},
                    async: false,
                    success: function (ar) {
                        if (ar.success) {
                            reloadTable();
                            layer.alert("删除成功");
                        } else {
                            layer.alert(ar.msg);
                        }
                    }
                });
            });
        }
    });
});

//列表刷新全局接口
function reloadTable(param) {
    modelConfigList.reloadGrid(param);
}


