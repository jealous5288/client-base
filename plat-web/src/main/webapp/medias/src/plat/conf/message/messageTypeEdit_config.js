//model渲染方案配置
var ModelMessageTypeJson = {
    ModelMessageType: {
        id: {display: false},
        name: {
            rules: {checkSave: ["notNull"]}
        },
        code: {
            rules: {checkSave: ["notNull"]}
        },
        urgentLevel: {
            type: "dict",
            dictConfig: {
                dictCode: "XXJJCD"
            }
        },
        validTime: {},
        operateType: {
            type: "dict",
            dictConfig: {
                dictCode: "XXCZLX"
            }
        },
        winSize: {
            type:"dict",
            dictConfig:{
                dictCode:"WINSIZE"
            }
        },
        skipPath: {},
        skipType: {
            type: "dict",
            dictConfig: {
                dictCode: "XXTZLX"
            },
            changeFunc: "SkipTypeChange"
        },
        description: {maxLength: 100},
        sfyx_st: {     //是否有效
            display: false,
            defaultValue: "VALID"
        }
    }
};

//初始状态新增json
var xzStateJson = {
    ModelMessageType: {
        state: {
            disable: []
        }
    }
};
//查看
var ckStateJson = {
    ModelMessageType: {
        state: {
            enable: []
        }
    }
};
//修改
var xgStateJson = {
    ModelMessageType: {
        state: {
            disable: []
        }
    }
};

