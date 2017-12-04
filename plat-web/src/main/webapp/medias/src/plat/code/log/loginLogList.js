/**
 * Created by Administrator on 2017/5/18.
 */
var loginLogList;
$(function () {
    //打开加载中标志
    pageAjax();
    loginLogList = new BaseGridModel(ModelLoginLogList_Propertys);
    loginLogList.buildSearchView();
    loginLogList.render();

});
//刷新全局接口
function reloadTable(param) {
    if (param) {
        loginLogList.set("postData", param);
    }
    loginLogList.reloadGrid();
}

