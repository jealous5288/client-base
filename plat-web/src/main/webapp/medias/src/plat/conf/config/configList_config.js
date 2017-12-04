//搜索部分配置
var SConfigJson = {
    SConfig: {
        name: {
            tagName: "配置名称",
            maxLength: 20,
            canClear:true
        },
        code: {
            tagName: "配置编码",
            maxLength: 20,
            canClear:true
        }
    }
};

//表头
var columns = [
    {title: '配置名称', id: 'NAME', width: '20%', align: 'center', renderer: "String"},
    {title: '配置编码', id: 'CODE', width: '20%', align: 'center', renderer: "String"},
    {title: '默认值', id: 'VALUE', width: '20%', align: 'center', renderer: "String"},
    {title: '修改时间', id: 'XGSJ', width: '20%', align: 'center', renderer: "Date", format: "yyyy-MM-dd"}
];
//配置动态加载属性
var ModelConfigList_Propertys = {
    ModelName: "ModelConfigList", //模型名称
    url: "/config/getConfigList",  //请求列表数据的url 已自动添加了random不需要在加random
    limit: 10,            //分页页码
    columns: columns,
    searchJson: SConfigJson,
    SearchModelName: "SConfig"
};
