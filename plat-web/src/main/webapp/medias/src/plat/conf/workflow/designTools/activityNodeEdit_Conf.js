//活动节点渲染json
var modelActivityNodeJson = {
    ModelActivityNode: {
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
        transactType: {        //多人办理方式
            defaultValue: "0",
            changeFunc: "blfsChangeFunc"
        },
        countersignParameter: {      //会签处理参数类型
            type: "dict",
            dictConfig: {
                dictCode: "HQFS",
                showPlsSelect: true,
                plsSelectName: "请选择"
            }
        },
        countersignValue: {     //会签处理参数值
            defaultValue: ""
        },
        convergeType: {         //聚合方式
            defaultValue: "2"
        },
        nodeSort: {      //环节序号
            rules: {checkValue: ["isNumber"]}
        },
        sfxsbc: {       //是否显示保存按钮
            defaultValue: "1"
        },
        sfbxscfj: {      //是否必须上传附件
            defaultValue: "0"
        },
        startupProcessSql: {        //前处理程序
        },
        finishProcessSql: {        //后处理程序
        },
        autoHandleSql: {        //自动办理程序
        },
        sheetSort: {          //环节序号
            rules: {checkKeyup: ["isIntGteZero"]},
            ifForm: false
        },
        sheetTitle: {              //辅助字段：表单标题
            ifForm: false
        },
        sheetId: {                   //辅助字段：表单id
            type: "dict",
            dictConfig: {
                reqInterface: "getNodePageDict"
            },
            changeFunc: "sheetIdChangeFunc",
            ifForm: false
        },
        sheetMode: {                //辅助字段：表单操作
            ifForm: false,
            defaultValue: "EDIT",
            changeFunc: "changeSheetMode"
        },
        spxName: {         //审批项名称
            ifForm: false
        },
        spxSort: {         //审批项序号
            rules: {checkKeyup: ["isIntGteZero"]},
            ifForm: false
        },
        spxPrint: {         //审批项是否打印
            ifForm: false,
            defaultValue: "0"
        },
        variableName: {                //辅助字段：变量名称
            ifForm: false
        },
        variableValue: {                //辅助字段：变量值
            ifForm: false
        },
        roleId: {            //环节角色id
        },
        roleName: {            //环节角色id
            rules: {checkSave: ["notNull"]},
            type: "layer",
            layerConfig: {
                title: "选择已有角色",
                style: "medium",
                url: "/role/roleSelect?",
                callbackFunc: "roleSelectCallback",
                canDelete: true
            },
            changeFunc: "roleChangeFunc",
            ifForm: false

        },
        roleCode: {            //环节角色id
            disabled: true,
            ifForm: false
        },
        roleType: {
            ifForm: false
        },
        roleTypeName: {
            disabled: true,
            ifForm: false
        },
        disagreeNodeDomid: {        //多人办理方式
            type: "dict",
            dictConfig: {
                reqInterface: "getDisagreeNodeDict",
                plsSelectName: "默认(退回上一环节)"
            }
            // changeFunc:"sheetIdChangeFunc"
        },
        domid: {
            ifForm: false
        },
        ywzt: {  //环节业务状态
            type: "dict",
            dictConfig: {
                dictCode: ""
            }
        },
        submitName: {   //提交个性设置名称
        },
        saveName: {    //保存个性设置名称
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
        name: {          //名称

        },
        sheet_id: {              //表单id
        },
        sort: {         //序号
        },
        control: {           //表单操作方式
        },
        sheetMode: {           //表单操作方式
            disabled: true
            // ifForm:false
        },
        spxName: {         //审批项名称
        },
        spxSort: {         //审批项序号
        },
        spxPrint: {         //审批项是否打印
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
    },
    ModelButton: {   //个性button
        id: {
            display: false
        },
        name: {                //名称
            rules: {checkSave: ["notNull"]},
            maxLength:25
        },
        code: {
            rules: {checkSave: ["notNull"]},
            maxLength:25
        },
        icon: {
            maxLength:25
        },
        flag: {
            maxLength:25
        },
        funcName: {
            maxLength:25
        },
        nodeId: {},
        sort: {
            rules: {checkKeyup: ["isIntGte"]},
            maxLength:2
        },
        isShowInHandle: {
            type: "dict",
            dictConfig: {
                dictCode:[{value:"办理中",code:1},{value:"办理之后",code:2},{value:"业务控制",code:3}],
                plsSelectName:"任意时间"
            },
            defaultValue:"1"
        },
        sfyx_st: {        //是否有效
            display: false,
            defaultValue: "VALID"
        }
    }
};

//初始状态json
var xzStateJson = {
    ModelActivityNode: {
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
};