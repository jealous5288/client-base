var subTableView;
var ModelSubDict;
var modelDict;
var ModelDict;
//操作类型标志位
var type = GetQueryString("type");
$(function () {
    //异步提示注册
    pageAjax();
    //初始化表单尺寸
    resizeForm();
    //依据参数确定选择的状态配置
    var stateJson;
    if (type === "xz" || type === "xg") {
        stateJson = XzState;
    } else if (type === "ck") {
        stateJson = CkState;
        $(".w_button_box").hide();
    }
    //创建字典的详细信息model
    ModelSubDict = DetailModel.extend({
        className: "ModelSubDict",   //model类名，是model类型的唯一标识
        initJson: ModelDictJson,        //配置json
        stateJson: stateJson,           //状态json
        state: type,                    //
        setModelName: function () {     //设置model名称
            this.set("ModelName", "ModelSubDict" + (++modelIndex));  //全局变量 动态model的下标迭代器
        }
    });

    //创建动态表单块集合collection类（1对多关系必须创建）
    var SubCollection = Backbone.Collection.extend({
        model: ModelSubDict
    });
    //
    ModelDict = DetailModel.extend({
        className: "ModelDict",
        initJson: ModelDictJson,
        stateJson: stateJson,
        state: type,
        relations: [
            {
                type: Backbone.HasMany,
                key: 'sysSubDictList',     //配置为一对多关系属性
                relatedModel: ModelSubDict,
                collectionType: SubCollection
            }
        ]
    });

    //获取初值
    var dictId = GetQueryString("dictId");    //字典id
    if (dictId) {
        $.ajax({
            type: "get",
            url: "/dict/getDictById?dictId=" + dictId + "&random=" + Math.random(),
            async: false,
            success: function (ar) {
                if (ar.success) {
                    renderForm(ar.data);
                } else {
                    layer.alert(ar.msg);
                }
            }
        });
    } else {
        renderForm();
    }

    //创建动态列表行view类
    var SubTrView = BaseElementView.extend({
        canCheck: true,
        tagName: 'tr',     //标签名，表单个体创建为div,行个体创建为tr
        className: 'rx-grid-tr',   //个体样式
        renderEditMode: function () {    //实现渲染接口:渲染编辑模式
            var html = "";
            html += "<td style='text-align:center'>" + this.index + "</td>";
            html += "<td  style='text-align:center'><input type='text' class='i_text' data-property='code' data-model='" + this.model.get("ModelName") + "'/>" + "</td>" +
                "<td style='text-align:center'><input type='text'  class='i_text' data-property='value' data-model='" + this.model.get("ModelName") + "'/>" + "</td>" +
                "<td style='text-align:center'><input type='text'  class='i_select'  data-property='pcode' data-model='" + this.model.get("ModelName") + "'/>" + "</td>" +
                "<td style='text-align:center'><input type='text' class='i_text' data-property='sort' data-model='" + this.model.get("ModelName") + "'/>" + "</td>" +
                "<td style='text-align:center'><input type='text'  class='i_text'  data-property='remark' data-model='" + this.model.get("ModelName") + "'/>" + "</td>";
            $(this.el).html(html);  //？？
        }
    });

    //创建动态列表主体view类
    var SubTableView = BaseTableView.extend({
        mulChose: false,
        getControlHtml: function () {     //实现控制区域渲染接口
            var ctrlStr = "<div class='page_title'><h1>字典项信息</h1>";
            if (type != "ck") {
                ctrlStr += "<ul class='action_button' style='float: right;margin: 0 5px 0 0;'>" +
                    "<li><a class='add'>新增</a></li>" +
                    "<li><a class='edit'>修改</a></li>" +
                    "<li><a class='delete'>删除</a></li></ul>";
            }
            ctrlStr += "</div>";
            return ctrlStr;
        },
        events: {  //事件定义
            'click .add': 'add',
            'click .edit': 'edit',
            'click .delete': 'deleteItems'  //??
        },
        getTheadHtml: function () {  //实现表头区域渲染接口
            return "<thead>" +
                "<th style='width:5%'>序号</th>" +
                "<th style='width:15%'>字典项编码</th>  " +
                "<th style='width:25%'>字典项值</th>" +
                "<th style='width:15%'>上级字典项编码</th>  " +
                "<th style='width:15%'>排序号</th>" +
                "<th style='width:25%'>字典项扩展</th>" +
                "</thead>";
        },
        getNewModel: function () { //实现接口，以关联创建的model
            return new ModelSubDict();
        },
        getNewTrView: function (item, mode, display, index, preView) {  //实现接口，以关联创建的行view
            return new SubTrView({
                model: item,
                renderCallback: mode,
                display: display,
                index: index,
                preView: preView
            });
        },
        edit: function () {
            var edit = [];
            //noinspection JSUnusedLocalSymbols
            _.map(this.collection.models, function (model, key) {
                model.updateModel();
                if (model.checked == true) {
                    edit.push(model);
                }
            });
            if (edit.length == 1) {
                openStack(window, "修改字典项", "small", "/dict/subDictEdit?editFunc=editSubDict" +
                    "&modelName=" + edit[0].get("ModelName") + "&getFunc=getSubDict" +
                    "&pdictCode=" + modelDict.get("pdictCode") +
                    "&pdictIsEmpty=" + modelDict.get("pdictIsEmpty"));
            } else {
                layer.alert("请选择一条待修改的数据");
            }
        },
        add: function () {
            openStack(window, "新增字典项", "small", "/dict/subDictEdit?editFunc=editSubDict" +
                "&pdictCode=" + modelDict.get("pdictCode") +
                "&pdictIsEmpty=" + modelDict.get("pdictIsEmpty"));
        },
        addNewItem: function (model) {  //？？
            var view = this;
            view.collection.push(model);
            view.index++;  //??
            $(view.el).children("table").append(
                view.getNewTrView(model, 'renderEditMode', true, view.index, view).render().el
            );
            model.render();
        }
    });

    //实例动态列表主view
    subTableView = new SubTableView({
        collection: modelDict.get("sysSubDictList"),
        el: $("#subDictList")
    });
    subTableView.render();

    $("#save").click(function () {
        if (modelDict.ruleValidate()) {  //
            setDictCode();
            $.ajax({
                type: "post",
                url: "/dict/saveDict",
                data: {sysDict: modelDict.getJson()},
                dataType: "json",
                success: function (ar) {
                    if (ar.success) {
                        layer.alert("保存成功");
                        reloadPrevWin();
                        closeWin();
                    } else {
                        layer.alert(ar.msg);
                    }
                }
            });
        }
    });
});

//取消
function cancelCheck() {
    if (modelDict.changeValidate()) {
        layer.confirm("页面已修改，确认关闭吗", function (index) {
            layer.close(index);
            closeWin();
        });
        return false;
    }
    return true;
}
function renderForm(data) {
    if (data && data.isEmpty == 0)
        $("#subDictList").show();
    modelDict = new ModelDict(data);
    if (modelDict.get("isEmpty") == 0)
        $("#subDictList").show();
    modelDict.render();
}
//是否为空配置切换
function changeIsEmpty(model, data) {
    var isEmpty = $("input[name='isEmpty']:checked").val();
    if (isEmpty == 1) {
        $("#subDictList").hide();
    } else if (isEmpty == 0) {
        $("#subDictList").show();
    }
}
//noinspection JSUnusedGlobalSymbols   新增、修改属性  回填
function editSubDict(modelName, modelJson) {
    var json = eval('(' + modelJson + ')');
    var result = checkIsRepeat(modelName, json.code, json.value, json.sort);
    if (modelName) { //修改
        if (result == "1") {
            var changeModel = subTableView.collection.get(modelName);
            changeModel.set(json);
            //改变选中标志位
            changeModel.checked = false;
            subTableView.render();
        } else {
            return result;
        }
    } else { //新增
        if (result == "1") {
            subTableView.addNewItem(new ModelSubDict(json));
        } else {
            return result;
        }
    }
}

//noinspection JSUnusedGlobalSymbols
function getSubDict(modelName) {
    return subTableView.collection.get(modelName).getJson();
}

//验证是否重复
function checkIsRepeat(modelName, code, value, sort) {
    var models = subTableView.collection.models;
    var flag = "1";
    for (var i = 0; i < models.length; i++) {
        if (models[i].get("ModelName") == modelName) continue;
        if (models[i].get("code") == code && models[i].get("sfyx_st") !== "UNVALID") {
            flag = "2"; //字典项编码重复
            break;
        }
        if (models[i].get("value") == value && models[i].get("sfyx_st") !== "UNVALID") {
            flag = "3"; //字典项值重复
            break;
        }
        if (models[i].get("sort") == sort && models[i].get("sfyx_st") !== "UNVALID") {
            flag = "4"; //字典项序号重复
            break;
        }
    }
    return flag;
}

//上级字典选择回调
function dictSelectCallback(code, name, isEmpty) {
    modelDict.set("pdictCode", code);
    modelDict.setValue("pdictName", name);
    modelDict.set("pdictIsEmpty", isEmpty);
}

//保存前处理
function setDictCode() {
    debugger
    var models = subTableView.collection.models;
    //同步更新字典项中的dictCode pdictCode
    var dictCode = modelDict.get("dictCode");
    var pdictCode = modelDict.get("pdictCode");
    //字典为空 将sfyx_st设为UNVALID
    var isEmpty = $("input[name='isEmpty']:checked").val();
    if (isEmpty == 1) {
        for (var i = 0, len = models.length; i < len; i++) {
            models[i].setValue("pcode", "");
            models[i].set("sfyx_st", "UNVALID");
        }
    } else if (isEmpty == 0) {
        for (var j = 0, lenn = models.length; j < lenn; j++) {
            models[j].set("dictCode", dictCode);
            models[j].set("pdictCode", pdictCode);
        }
    }
}
//清空model中辅助字段
function emptyPdictName() {
    modelDict.set("pdictCode", "");
    modelDict.set("pdictIsEmpty", "");
}
