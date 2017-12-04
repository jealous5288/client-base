//model渲染方案配置
var ModelResourceJson = {
    ModelResource: {
        id: {display: false},
        name: {rules: {checkSave: ["notNull"]}},
        code: {rules: {checkSave: ["notNull"]}},
        type: {defaultValue:resourceType},
        parentId:{},
        parentName:{
            type:"layer",
            layerConfig: {
                url: "/resource/resourceTreeSelect?id="+(GetQueryString("id") || "")+"&resourceType="+config.parent+"&",
                title: "选择上级资源",
                callbackFunc: "selectParentCallback",
                style: "tree"
            },
            ifForm: false
        },
        parentType:{},
        url:{},
        icon:{},
        bizType:{},
        description:{maxLength:100},
        sfyx_st: {     //是否有效
            display: false,
            defaultValue: "VALID"
        }
    }
};

//初始状态新增json
var xzStateJson = {
    ModelResource: {
        state: {
            disable: []
        }
    }
};
//查看
var ckStateJson = {
    ModelResource: {
        state: {
            enable: []
        }
    }
};
//修改
var xgStateJson = {
    ModelResource: {
        state: {
            disable: []
        }
    }
};

