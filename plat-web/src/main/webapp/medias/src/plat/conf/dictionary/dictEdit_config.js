//新增
var XzState = {
    ModelDict: {
        state: {
            disable: []
        }
    },
    ModelSubDict: {
        state: {
            enable: []
        }
    }
};

//查看
var CkState = {
    ModelDict: {
        state: {
            enable: []
        }
    },
    ModelSubDict: {
        state: {
            enable: []
        }
    }
};

//model渲染方案配置
var ModelDictJson = {
    ModelDict: {
        id: {display: false}, //主键
        dictName: {        //字典名称
            rules: {checkSave: ["notNull"]},
            maxLength: 50
        },
        dictCode: {        //字典编码
            rules: {checkSave: ["notNull", "isUpperCase"]},
            maxLength: 50
        },
        dictType: {        //字典类型
            rules: {checkSave: ["notNull"]},
            type: "dict",
            dictConfig: {
                dictCode: "DICTLX"
            }
        },
        description: {      //描述
            rules: {checkSave: []},
            maxLength: 100
        },
        sfyx_st: {          //是否有效 默认有效
            defaultValue: "VALID"
        },
        pdictCode: {display: false},
        pdictName: {
            type: "layer",
            layerConfig: {
                url: "/dict/dictSelect?",
                title: "选择上级字典",
                callbackFunc: "dictSelectCallback",
                canDelete: true
            },
            changeFunc: "emptyPdictName",
            ifForm: false
        },
        pdictIsEmpty: {display: false},
        isEmpty: {
            type: "dict",
            dictConfig: {
                dictCode: [{code: 1, value: "是"}, {code: 0, value: "否"}],
                checkType: "radio"
            },
            defaultValue: "0",
            changeFunc: "changeIsEmpty"
        }
    },
    ModelSubDict: {
        id: {         //主键ID
            display: false
        },
        remark: {           //字典项扩展
            maxLength: 100
        },
        sort: {       //序号
            rules: {checkSave: ["notNull"]},
            maxLength: 20
        },
        sfyx_st: {        //是否有效 默认有效
            defaultValue: "VALID"
        },
        dictCode: {},
        code: {},
        value: {},
        pcode: {},
        pdictCode: {}
    }
};

