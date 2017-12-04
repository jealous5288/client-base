var modelMessageTypeList;         //消息类型列表对象
$(function () {
    //异步提示注册
    pageAjax();
    //初始化尺寸
    resizeTable();
    //列表模型
    modelMessageTypeList = new BaseGridModel(ModelMessageTypeList_Propertys);
    //设置列表搜索区
    modelMessageTypeList.buildSearchView();
    //设置双击事件
    if (!modelMessageTypeList.get("mulchose")) {
        modelMessageTypeList.set("onRowDblClick", function onRowDblClick(rowIndex, rowData, isSelected, event) {
            openStack(window, "查看消息类型", "medium", "/message/messageTypeEdit?type=ck&id=" + rowData.ID);
        });
    }
    //渲染列表
    modelMessageTypeList.render();
    //新增
    $("#add").click(function () {
        openStack(window, "新增消息类型", "medium", "/message/messageTypeEdit?type=xz");
    });
    //修改
    $("#edit").click(function () {
        var row = modelMessageTypeList.getSelect();
        if (row && row.length == 1) {
            openStack(window, "修改消息类型", "medium", "/message/messageTypeEdit?type=xg&id=" + row[0].ID);
        } else {
            layer.alert("请选择一条待修改的数据");
        }
    });
    //删除
    $("#del").click(function () {
        var obj = modelMessageTypeList.getSelect();//获取选中行的数据
        if (obj == null || obj.length != 1) {
            layer.alert("请选择一条待删除的数据");
        } else {
            layer.confirm("确定要删除所选记录吗？", function (index) {
                layer.close(index);
                $.ajax({
                    type: "post",
                    url: "/messageType/deleteMessageType",
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

    $("#sendMessage").click(function () {
        $.ajax({
            url: "/message/generateMessage",
            type: "get",
            success: function () {
                layer.alert("发送成功");
            }
        })

    })
});

//列表刷新全局接口
function reloadTable(param) {
    modelMessageTypeList.reloadGrid(param);
}


