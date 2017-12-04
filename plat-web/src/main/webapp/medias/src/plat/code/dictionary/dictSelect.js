var func = GetQueryString("func");
var modelDictList;
$(function () {
    pageAjax();
    //初始化table尺寸
    resizeTable();
    //列表模型
    modelDictList = new BaseGridModel(ModelDictList_Propertys);
    modelDictList.buildSearchView();
    //设置双击事件
    modelDictList.set("onRowDblClick", onRowDblClick);
    //渲染列表
    modelDictList.render();

    $("#confirm").click(function () {
        selectItem();
    });
});

//双击事件
function onRowDblClick(rowIndex, rowData, isSelected, event) {
    selectItem();
}

function reloadTable(param) {
    modelDictList.set("postData", param);
}

function selectItem() {
    var obj = modelDictList.getSelect();//获取选中行的数据
    if (obj == null || obj.length != 1) {
        layer.alert("请选一条数据");
    } else {
        var evalFunc = eval("getPrevWin()." + func);
        result = evalFunc(obj[0].DICT_CODE, obj[0].DICT_NAME, obj[0].IS_EMPTY);
        if (result || typeof(result) == "undefined") {
            closeWin();
        }
    }
}


