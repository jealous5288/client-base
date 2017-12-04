//搜索部分配置
var SMessageTypeJson = {
    SMessageType: {
        name: {
            tagName: "消息类型名称",
            maxLength: 20,
            canClear:true
        },
        code: {
            tagName: "消息类型编码",
            maxLength: 20,
            canClear:true
        }
    }
};

//表头
var columns = [
    {title: '类型名称', id: 'NAME', width: '20%', align: 'center', renderer: "String"},
    {title: '配置编码', id: 'CODE', width: '20%', align: 'center', renderer: "String"},
    {title: '紧急程度', id: 'URGENT_LEVEL', width: '20%', align: 'center', renderer: "Dict",dictCode:"XXJJCD"},
    {title: '有效时间(天)', id: 'VALID_TIME', width: '20%', align: 'center', renderer: "String"},
    {title: '跳转类型', id: 'SKIP_TYPE', width: '20%', align: 'center', renderer: "Dict",dictCode:"XXTZLX"},
    {title: '窗口大小', id: 'WIN_SIZE', width: '20%', align: 'center', renderer: "String"},
    {title: '操作类型', id: 'OPERATE_TYPE', width: '20%', align: 'center', renderer: "Dict",dictCode:"XXCZLX"},
    {title: '跳转路径', id: 'SKIP_PATH', width: '20%', align: 'center', renderer: "String"}
];
//配置动态加载属性
var ModelMessageTypeList_Propertys = {
    ModelName: "ModelMessageTypeList", //模型名称
    url: "/messageType/getMessageTypeList",  //请求列表数据的url 已自动添加了random不需要在加random
    limit: 10,            //分页页码
    columns: columns,
    searchJson: SMessageTypeJson,
    SearchModelName: "SMessageType",
    colSetting:[100,150,100,150,80,150] //列宽设置
};
