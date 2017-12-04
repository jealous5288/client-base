
//搜索框部分
var SLoginLogJson = {
    SLoginLog: {
        logType: {
            tagName: "类型",
            ifForm: false,
            spanShow: false
        }
    }
};
//规定表头
var columns = [
    {title: '日志名称', id: 'LOG_NAME', width: '', align: 'center', renderer: "String"},
    {title: '操作用户', id: 'USER_NAME', width: '', align: 'center', renderer: "String"},
    {title: '日志信息', id: 'MESSAGE', width: '', align: 'center', renderer: "String"},
    {title: 'IP地址', id: 'IP', width: '', align: 'center', renderer: "String"},
    {title: '登录时间', id: 'LOGIN_TIME', width: '', align: 'center', renderer: "String"}
];
//登录日志列表主配置
var ModelLoginLogList_Propertys = {
    ModelName: "LoginLogList", //模型名称
    url: "/log/getLoginLogPage?hasDelData=true",  //请求列表数据的url 已自动添加了random不需要在加randon
    columns: columns,
    searchJson: SLoginLogJson,
    SearchModelName: "SLoginLog",
    colSetting: [60, 160, 60, 160, 60, 160]
};
