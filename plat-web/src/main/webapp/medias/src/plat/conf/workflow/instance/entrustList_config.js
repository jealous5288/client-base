var columns = [
    {title: '委办人', id: 'ENTRUSTUSERNAME', width: '100', align: 'center', renderer: "String"},
    {title: '开始时间', id: 'START_DATE', width: '100', align: 'center', renderer: "Date", format: "yyyy-MM-dd"},
    {title: '结束时间', id: 'END_DATE', width: '100', align: 'center', renderer: "Date",format: "yyyy-MM-dd"}
];

//办理列表主配置
var ModelEntrustList_Propertys = {
    ModelName: "ModelEntrustList", //模型名称
    url: "/testFlow/getEntrustList",  //请求列表数据的url 已自动添加了random不需要在加random
    columns: columns
};
