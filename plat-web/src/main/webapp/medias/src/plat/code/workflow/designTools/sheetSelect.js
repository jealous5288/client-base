/*****************************************************************
 * 合同备案监理合同选择关联单位工程列表
 * 最后更新时间：2016-02-26
 * 最后更新人：zhan
 *****************************************************************/
var modelName = GetQueryString("modelName");
var func = GetQueryString("func");
var disids = GetQueryString("disids");
var modelSheetList;
$(function () {
    //初始化尺寸
    resizeForm();
    //注册请求中msg
    pageAjax();
    //规定表头
    var columns = [
        {title: '表单名称', id: 'NAME', width: '300', align: 'left', renderer: "String"},
        {title: '表单路径', id: 'URL', width: '', align: 'left', renderer: "String"}
    ];
    //搜索部分配置
    var SModelSheetJson = {
        SModelSheet: {
            pageName: {        //主键ID
                type: "normal",
                tagName: "表单名称",
                maxLength: 40
            }
        }
    }
    //列表配置
    var ModelSheetList_Propertys = {
        ModelName: "ModelSheetList", //模型名称
        SearchModelName:"SModelSheet",   //搜索模型名称
        columns: columns,         //表头配置
        searchJson: SModelSheetJson,        //搜索区配置
        url: "/workflow/designTools/getPageList",  //请求列表数据的url
        dischose: true,    //是否开启数据禁选
        disObject: {"id":disids}     //禁选数据
    };

    //实例列表模型
    var modelSheetList = new BaseGridModel(ModelSheetList_Propertys);

    //设置双击事件
    modelSheetList.set("onRowDblClick", function(rowIndex, rowData, isSelected, event) {
        $("#confirm").click();
    });

    //渲染搜索区
    modelSheetList.buildSearchView();

    //渲染页面
    modelSheetList.render();

    //保存按钮事件
    $("#confirm").click(function(){
        var sel = modelSheetList.getSelect();
        if(sel.length > 0) {
            var evalFunc = getPrevWin()[func];
            result = evalFunc(sel[0].ID, sel[0].NAME, modelName);
            if(result || typeof(result) == "undefined"){
                _top.closeLayer(window);
            }
        }else{
            _top.layer.alert("请选择一条数据");
        }
    });
});
function reloadTable(param){
    modelSheetList.reloadGrid();
}