
//搜索框部分

var SOperateLogJson = {
    SOperateLog: {
        logType: {
            tagName: "类型",
            ifForm: false,
            spanShow: false
        }
    }
};
//规定表头
var columns = [
    {title: '日志类型', id: 'LOG_TYPE', width: '', align: 'center', renderer: "String"},
    {title: '日志名称', id: 'LOG_NAME', width: '', align: 'center', renderer: "String"},
    {title: '操作用户', id: 'USER_NAME', width: '', align: 'center', renderer: "String"},
    {title: '日志信息', id: 'MESSAGE', width: '', align: 'center', renderer: "String"},
    {title: '创建时间', id: 'CREATE_TIME', width: '', align: 'center', renderer: "String"}
];
//用户列表主配置
var ModelOperateLogList_Propertys = {
    ModelName: "OperateLogList", //模型名称
    url: "/log/getOperateLogPage?hasDelData=true",  //请求列表数据的url 已自动添加了random不需要在加randon
    columns: columns,
    searchJson: SOperateLogJson,
    SearchModelName: "SOperateLog",
    colSetting: [60, 160, 60, 160, 60, 160]
};
