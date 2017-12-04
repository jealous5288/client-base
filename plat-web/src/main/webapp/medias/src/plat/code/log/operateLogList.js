/**
 * Created by Administrator on 2017/5/18.
 */
var operateLogList;
$(function () {
    //打开加载中标志
    pageAjax();
    operateLogList = new BaseGridModel(ModelOperateLogList_Propertys);
    operateLogList.buildSearchView();
    operateLogList.render();

});
//刷新全局接口
function reloadTable(param) {
    if (param) {
        operateLogList.set("postData", param);
    }
    operateLogList.reloadGrid();
}

