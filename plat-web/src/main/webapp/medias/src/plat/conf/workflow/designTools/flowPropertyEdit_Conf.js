var modelFlowPropertyJson = {
    ModelFlow: {
        id: {        //主键ID
            display: false
        },
        sfyx_st: {        //是否有效
            display: false,
            defaultValue: "VALID"
        },
        name: {         //流程名称
            rules: {checkSave: ["notNull"]},
            type: "normal"
        },
        version: {          //工作流版本
            rules: {checkValue: ["isNumber"]},
            defaultValue: "1"
        },
        versionName: {             //原始版本流程名称
            type: "layer",
            layerConfig: {
                title: "选择原始流程",
                style: ["300px", "400px"],
                url: "/workflow/designTools/workflowTypeSelect?selectType=workflow&",
                callbackFunc: "versionWorkflowCallback"
            }
        },
        workflow: {              //原始版本流程id
            display: false
        },
        code: {         //流程编码
            rules: {checkKeyup: ["isCode"], checkSave: ["notNull"]},
            maxLength: 50,
            type: "normal"
        },
        // priority: {              //优先级
        //     rules: {checkSave: ["notNull"]},
        //     defaultValue: "high"   //默认为高
        // },
        instanceTitle: {            //流程实例标题
            rules: {checkSave: ["notNull"]},
            type: "normal"
        },
        type: {
            disabled: false,
            display: false
        },
        typeName: {
            rules: {checkSave: ["notNull"]},
            type: "layer",
            layerConfig: {
                title: "选择流程类别",
                style: ["300px", "400px"],
                url: "/workflow/designTools/workflowTypeSelect?",
                callbackFunc: "workflowTypeCallback"
            }
        },
        workflowYwztZd: {  //业务状态字典
            display: false
        },
        workflowYwztZdName: {  //业务状态字典名称
            type: "layer",
            layerConfig: {
                title: "选择字典",
                style: "medium",
                url: "/dict/dictSelect?",
                callbackFunc: "ywzdSelectCallBack"
            }
        },
        sheetId: {
            ifForm: false
        },
        sheetSort: {
            rules: {checkValue: ["isIntGteZero"]},
            ifForm: false
        },
        sheetTitle: {
            ifForm: false
        },
        sheetName: {
            type: "layer",
            layerConfig: {
                title: "选择表单",
                style: "medium",
                url: "/workflow/designTools/sheetSelect?",
                callbackFunc: "sheetCallback"
            },
            ifForm: false
        },
        variableName: {
            ifForm: false
        },
        variableValue: {
            ifForm: false
        },
        startupProcessSql: {
        },
        finishProcessSql: {
        },
        autoHandleSql:{
        },
        description: {
        }
    },
    ModelSheet: {
        id: {        //主键ID
            display: false
        },
        sfyx_st: {        //是否有效
            disabled: false,
            display: false,
            defaultValue: "VALID"
        },
        title: {          //标题
        },
        name: {

        },
        sheet_id: {              //表单id
        },
        sort: {         //序号
        }
    },
    ModelVariable: {
        id: {        //主键ID
            display: false
        },
        sfyx_st: {        //是否有效
            display: false,
            defaultValue: "VALID"
        },
        name: {                //名称
        },
        value: {              //默认值
        }
    }
}

var xzStateJson = {
    ModelFlow: {
        state: {
            disable: []
        }
    },
    ModelSheet: {
        state: {
            enable: []
        }
    },
    ModelVariable: {
        state: {
            enable: []
        }
    }
}

var addSheetStateJson = {
    ModelFlow: {
        property: {
            sheetName: {
                type: "layer",
                layerConfig: {
                    title: "选择表单",
                    style: "medium",
                    url: "/workflow/designTools/sheetSelect?",
                    callbackFunc: "sheetCallback"
                },
                disabled: false,
                ifForm: false
            }
        }
    }
}

var editSheetStateJson = {
    ModelFlow: {
        property: {
            sheetName: {
                type: "normal",
                disabled: true,
                ifForm: false
            }
        }
    }
}

