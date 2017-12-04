//model渲染方案配置
var ModelConfigJson = {
    ModelConfig: {
        id: {display: false},
        name: {rules: {checkSave: ["notNull"]}},
        code: {rules: {checkSave: ["notNull"]}},
        value: {},
        description:{maxLength:100},
        sfyx_st: {     //是否有效
            display: false,
            defaultValue: "VALID"
        }
    }
};

//初始状态新增json
var xzStateJson = {
    ModelConfig: {
        state: {
            disable: []
        }
    }
};
//查看
var ckStateJson = {
    ModelConfig: {
        state: {
            enable: []
        }
    }
};
//修改
var xgStateJson = {
    ModelConfig: {
        state: {
            disable: []
        }
    }
};

