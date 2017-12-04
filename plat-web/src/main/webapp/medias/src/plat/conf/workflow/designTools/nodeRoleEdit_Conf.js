//活动节点渲染json
var modelNodeRoleJson = {
    ModelNodeRole:{
        id:{        //主键ID
            display:false
        },
        sfyx_st:{        //是否有效
            display:false,
            defaultValue:"VALID"
        },
        name: {         //角色名称
        },
        code:{          //角色代码
        },
        roleType:{        //是否系统角色
        },
        roleTypeName:{        //是否系统角色
            ifForm:false
        }
    },
    ModelRoleElement: {
        id:{        //主键ID
            display:false
        },
        sfyx_st:{        //是否有效
            display:false,
            defaultValue:"VALID"
        },
        type: {          //要素类型
        },
        name:{          //名称
        }
    }
}

//初始状态json
var ckStateJson = {
    ModelNodeRole:{
        state:{
            enable:[]
        }
    },
    ModelRoleElement:{
        state:{
            enable:[]
        }
    }
}

var modelRuleJson ={
    ModelRule:{     //    角色与权限规则关联
        id:{
            display: false
        },
        rule_name:{               //规则名称
            disabled:true
        },
        xgsj:{                  //修改时间
            type:"date",
            disabled:true
        },
        description:{           //描述
            disabled:true
        }
    }
}

