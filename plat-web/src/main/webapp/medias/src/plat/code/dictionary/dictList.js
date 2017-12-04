var modelDictList;
$(function () {
    pageAjax();
    //初始化table尺寸
    resizeTable();
    //列表模型
    modelDictList = new BaseGridModel(ModelDictList_Propertys);
    new initTableSetting(modelDictList, columns, SDictJson);
    modelDictList.buildSearchView();
    //设置双击事件
    modelDictList.set("onRowDblClick", onRowDblClick);
    //渲染列表
    modelDictList.render();

    //新增
    $("#add").click(function () {
        var url = "/dict/dictEdit?type=xz";
        openStack(window, "新增字典", "medium", url);
    });

    //修改
    $("#edit").click(function () {
        var rowData = modelDictList.getSelect();//获取选中行的数据
        if (rowData && rowData.length == 1) {
            var url = "/dict/dictEdit?type=xg&dictId=" + rowData[0].ID;
            openStack(window, "修改字典", "medium", url);
        } else {
            layer.alert("请选择一条待修改的数据");
        }
    });

    //删除
    $("#del").click(function () {
        var rowData = modelDictList.getSelect();//获取选中行的数据
        if (rowData.length > 0) {
            layer.confirm("确定要删除所选记录吗？", function (index) {
                $.ajax({
                    type: "post",
                    url: "/dict/deleteDict?dictId=" + rowData[0].ID,
                    async: false,
                    success: function (ar) {
                        if (ar.success) {
                            layer.alert("删除成功");
                            reloadTable();
                        } else {
                            layer.alert(ar.msg);
                        }
                    }
                });
                layer.close(index);
            });
        } else {
            layer.alert("请选择一条待删除的数据");
        }
    });

    //重新生成所有字典文件
    $("#allJspath").click(function () {
        $.ajax({
            type: "get",
            url: "/jscache/allJspath?random=" + Math.random(),
            async: false,
            success: function (ar) {
                if (ar.success) {
                    layer.alert("生成成功");
                } else {
                    layer.alert(ar.msg);
                }
            }
        });
    })
});

//noinspection JSUnusedLocalSymbols
function onRowDblClick(rowIndex, rowData, isSelected, event) {   //此处未使用的参数不能省略
    openStack(window, "查看字典", "medium", "/dict/dictEdit?type=ck&dictId=" + rowData.ID);
}

function reloadTable(param) {
    modelDictList.reloadGrid(param);
}



