var modelFlow;
var sheetTableView, tempSheetView, variableTableView, tempVariableView;
//选择流程类型回调
function workflowTypeCallback(typeId, typeName) {
    modelFlow.setValue("typeName", typeName);
    modelFlow.setValue("type", typeId);
}
//选择原始流程版本回调
function versionWorkflowCallback(workflow, name) {
    modelFlow.setValue("versionName", name);
    modelFlow.setValue("workflow", workflow);
    if (workflow) {
        $.ajax({
            type: "post",
            url: "/workflow/designTools/getWorkflowVersion",
            data: {workflowId: workflow},
            success: function (ar) {
                if (ar.success) {
                    modelFlow.setValue("version", ar.data || "1");
                } else {
                    _top.layer.alert(ar.msg);
                }
            }
        })
    }
}
//选择表单回调
function sheetCallback(sheetId, sheetName, modelName) {
    $.getEle(modelName, "sheetId").val(sheetId);
    var titleobj = $.getEle(modelName, "sheetTitle");
    $.getEle(modelName, "sheetName").val(sheetName);
    var sheetSort = $.getEle(modelName, "sheetSort");
    if (!sheetSort.val()) {
        sheetSort.val(sheetTableView.vaildLength() + 1);
    }
    if (!titleobj.val() || titleobj.val().toString().trim() === "") {
        titleobj.val(sheetName);
    }
}

function saveSheetEdit() {
    var title = $.getEle("ModelFlow", "sheetTitle").val();
    var sort = $.getEle("ModelFlow", "sheetSort").val();
    if (!title || title.toString().trim() === "") {
        _top.layer.alert("请填写标题");
        return;
    }
    if (!sort || sort.toString().trim() === "") {
        _top.layer.alert("请填写序号");
        return;
    }
    $.getEle(tempSheetView.model.get("ModelName"), "sort").val(sort);
    $.getEle(tempSheetView.model.get("ModelName"), "title").val(title);
    $.getEle("ModelFlow", "sheetSort").val("");
    $.getEle("ModelFlow", "sheetTitle").val("");
    $.getEle("ModelFlow", "sheetName").val("");
    modelFlow.reRender(addSheetStateJson);
    $(tempSheetView.el).removeClass("editTr");
    $(sheetTableView.el).find(".editTrItem").hide();
    $(sheetTableView.el).find(".addTrItem").show();

    tempSheetView = null;
}
function saveVariableEdit() {
    var name = $.getEle("ModelFlow", "variableName").val();
    var value = $.getEle("ModelFlow", "variableValue").val();
    if (!name || name.toString().trim() === "") {
        _top.layer.alert("请填写变量名");
        return;
    }
    if (!value || value.toString().trim() === "") {
        _top.layer.alert("请填写默认值");
        return;
    }
    var models = variableTableView.collection.models;
    if (models) {
        for (var i = 0; i < models.length; i++) {
            if (models[i].get("name") == name && models[i].get("sfyx_st") != "UNVALID") {
                _top.layer.alert("变量名称不可重复");
                return;
            }
        }
    }
    $.getEle(tempVariableView.model.get("ModelName"), "name").val(name);
    $.getEle(tempVariableView.model.get("ModelName"), "value").val(value);
    $.getEle("ModelFlow", "variableName").val("");
    $.getEle("ModelFlow", "variableValue").val("");
    $(tempVariableView.el).removeClass("editTr");
    $(variableTableView.el).find(".editTrItem").hide();
    $(variableTableView.el).find(".addTrItem").show();

    tempVariableView = null;
}
var initHjywlxzd; //初始的业务环节字典
var pro = window._top.property;
$(function () {
    $("#center-tab").omTabs({
        lazyLoad: true
    });

    //注册请求中msg
    pageAjax("数据获取中，请稍候……");

    //创建子model表单对象
    var ModelSheet = DetailModel.extend({
        className: "ModelSheet",
        initJson: modelFlowPropertyJson,
        stateJson: xzStateJson,
        setModelName: function () {
            this.set("ModelName", "ModelSheet" + (++modelIndex));
        }
    });

    //创建表单列表
    var SheetCollection = Backbone.Collection.extend({
        model: ModelSheet
    });

    //创建子model表单对象
    var ModelVariable = DetailModel.extend({
        className: "ModelVariable",
        initJson: modelFlowPropertyJson,
        stateJson: xzStateJson,
        setModelName: function () {
            this.set("ModelName", "ModelVariable" + (++modelIndex));
        }
    });

    //创建表单列表
    var VariableCollection = Backbone.Collection.extend({
        model: ModelVariable
    });

    //创建主model流程配置对象
    var ModelFlow = DetailModel.extend({
        className: "ModelFlow",
        initJson: modelFlowPropertyJson,
        stateJson: xzStateJson,
        relations: [
            {
                type: Backbone.HasMany,
                key: 'sheets',
                relatedModel: ModelSheet,
                collectionType: SheetCollection
            }, {
                type: Backbone.HasMany,
                key: 'variables',
                relatedModel: ModelVariable,
                collectionType: VariableCollection
            }]
    });

    modelFlow = new ModelFlow(pro);
    initHjywlxzd = modelFlow.get("workflowYwztZd");
    //创建动态列表行view类
    var SheetTrView = BaseElementView.extend({
        tagName: 'tr',
        className: '',
        renderEditMode: function () {    //实现渲染接口
            var view = this;
            var html =
                "<td><input type='hidden' data-model='" + this.model.get("ModelName") + "' data-property='id' value='" + this.model.get("id") + "'>" +
                "<input type='hidden' data-model='" + this.model.get("ModelName") + "' data-property='sfyx_st' value='" + this.model.get("sfyx_st") + "'>" +
                "<input type='text' class='i_text' data-model='" + this.model.get("ModelName") + "' data-property='sort' value='" + this.model.get("sort") + "'></td>" +
                "<td><input type='text' class='i_text' data-model='" + this.model.get("ModelName") + "' data-property='title' value='" + this.model.get("title") + "'></td>" +
                "<td><input type='text' class='i_text' data-model='" + this.model.get("ModelName") + "' data-property='name' value='" + this.model.get("name") + "'></td>" +
                "<td><a href='javascript:void(0)' class='editEle'>修改</a><a  class='delete'>删除</a></td>";
            $(this.el).html(html);
        },
        editElement: function () {
            tempSheetView = this;
            var model = this.model;
            $(sheetTableView.el).find(".addTrItem").hide();
            $(sheetTableView.el).find(".editTrItem").show();
            $(tempSheetView.el).addClass("editTr");
            $.getEle("ModelFlow", "sheetName").val(model.get("name"));
            $.getEle("ModelFlow", "sheetSort").val(model.get("sort"));
            $.getEle("ModelFlow", "sheetTitle").val(model.get("title"));
            modelFlow.reRender(editSheetStateJson);
        },
        del: function () {
            if (tempSheetView && tempSheetView == this) {
                _top.layer.alert("数据正在修改中，无法删除");
                return;
            }
            var that = this;
            _top.layer.confirm("您确定要删除该条信息吗？", function (index) {
                that.model.set("sfyx_st", "UNVALID");
                that.remove();
                _top.layer.close(index);
            });
        }
    });

    //创建动态列表主体view类
    var SheetTableView = BaseTableView.extend({
        getControlHtml: function () { //实现控制区域渲染接口
            // var controlstr =
            //     "<div>序号：<input type='hidden' data-model='ModelFlow' data-property='sheetId'/>" +
            //     "<span><input class='i_text' style='width:120px;' data-model='ModelFlow' data-property='sheetSort'/></span>" +
            //     "&nbsp;&nbsp;&nbsp;&nbsp;标题：<input class='i_text' style='width:120px;' data-model='ModelFlow' data-property='sheetTitle'/>" +
            //     "&nbsp;&nbsp;&nbsp;&nbsp;选择表单：<input class='i_layer' style='width:120px;' data-model='ModelFlow' data-property='sheetName'/>" +
            //     "&nbsp;&nbsp;&nbsp;&nbsp;<input type='button' class='button addTrItem' value='保存'/>&nbsp;&nbsp;&nbsp;&nbsp;" +
            //     "<input type='button' class='button editTrItem' onclick='saveSheetEdit()' style='display:none' value='保存修改'/></div>";
            // return controlstr;
            var controlstr ="<table style='width: 100%'>" +
                "<colgroup><col width='30px'/><col width='120px'/><col width='50px'/><col width='120px'/><col width='70px'/><col width='120px'/><col/></colgroup>" +
                "<tr>"+
               " <th>序号:</th>"+
                "<td><input type='hidden' data-model='ModelFlow' data-property='sheetId'/>"+
               " <input class='i_text' style='' data-model='ModelFlow' data-property='sheetSort'/></td>"+
                "<th>标题:</th>" +
                "<td><input class='i_text' style='' data-model='ModelFlow' data-property='sheetTitle'/></td>"+
                "<th>选择表单:</th>"+
                "<td><input class='i_layer' style='' data-model='ModelFlow' data-property='sheetName'/></td>"+
                "<td><input type='button' class='button addTrItem' style='float: right' value='保存'/>" +
                "<input type='button' class='button editTrItem' onclick='saveSheetEdit()' style='display:none;float: right;' value='保存修改'/></td>"+
                "</tr></table>";
            return controlstr;

        },
        getTheadHtml: function () {  //实现表头区域渲染接口
            var theadstr = "<thead>" +
                "<th width='10%'>序号</th><th width='30%'>标题</th><th width='40%'>名称</th><th >操作</th>" +
                "</thead>";
            return theadstr;
        },
        getNewModel: function (data) { //实现接口，以关联创建的model
            return new ModelSheet(data);
        },
        //增加新的个体数据时，数据处理与页面渲染触发方法
        addNewItem: function () {
            var sheet_id = $.getEle("ModelFlow", "sheetId").val();
            var title = $.getEle("ModelFlow", "sheetTitle").val();
            var name = $.getEle("ModelFlow", "sheetName").val();
            var sort = $.getEle("ModelFlow", "sheetSort").val();
            if (!name || name.toString().trim() === "") {
                _top.layer.alert("请选择表单名称");
                return;
            }
            if (!sort || sort.toString().trim() === "") {
                _top.layer.alert("请填写序号");
                return;
            }
            if (!title || title.toString().trim() === "") {
                _top.layer.alert("请填写标题");
                return;
            }
            var view = this;
            var addItem = this.getNewModel({sheet_id: sheet_id, title: title, name: name, sort: sort});
            addItem.set("sfyx_st", "VALID");
            view.collection.push(addItem);
            view.index++;
            $(view.el).children("table").eq(1).append(
                view.getNewTrView(addItem, 'renderEditMode', true, view.index).render().el
            );
            $.getEle("ModelFlow", "sheetId").val("");
            $.getEle("ModelFlow", "sheetName").val("");
            $.getEle("ModelFlow", "sheetTitle").val("");
            $.getEle("ModelFlow", "sheetSort").val("");
            addItem.render();
        },
        getNewTrView: function (item, mode, display, index) {  //实现接口，以关联创建的行view
            return new SheetTrView({
                model: item,
                renderCallback: mode,
                display: display,
                index: index
            });
        }
    })

    //实例动态列表主view
    sheetTableView = new SheetTableView({
        collection: modelFlow.get("sheets"),
        el: $("#sheetTableView")
    });

    //触发动态列表主view渲染
    sheetTableView.render();

    //创建动态列表行view类
    var VariableTrView = BaseElementView.extend({
        tagName: 'tr',
        className: '',
        renderEditMode: function () {    //实现渲染接口
            var view = this;
            var html =
                "<td><input type='hidden' data-model='" + this.model.get("ModelName") + "' data-property='id' value='" + this.model.get("id") + "'>" +
                "<input type='hidden' data-model='" + this.model.get("ModelName") + "' data-property='sfyx_st' value='" + this.model.get("sfyx_st") + "'>" +
                "<input type='text' class='i_text' data-model='" + this.model.get("ModelName") + "' data-property='name' value='" + this.model.get("name") + "'></td>" +
                "<td><input type='text' class='i_text' data-model='" + this.model.get("ModelName") + "' data-property='value' value='" + this.model.get("value") + "'></td>" +
                "<td><a href='javascript:void(0)' class='editEle'>修改</a><a  class='delete'>删除</a></td>";
            $(this.el).html(html);
        },
        editElement: function () {
            tempVariableView = this;
            var model = this.model;
            $(variableTableView.el).find(".addTrItem").hide();
            $(variableTableView.el).find(".editTrItem").show();
            $(tempVariableView.el).addClass("editTr");
            $.getEle("ModelFlow", "variableName").val(model.get("name"));
            $.getEle("ModelFlow", "variableValue").val(model.get("value"));
        },
        del: function () {
            if (tempVariableView && tempVariableView == this) {
                _top.layer.alert("数据正在修改中，无法删除");
                return;
            }
            var that = this;
            _top.layer.confirm("您确定要删除该条信息吗？", function (index) {
                that.model.set("sfyx_st", "UNVALID");
                that.remove();
                _top.layer.close(index);
            });
        }
    });

    //创建动态列表主体view类
    var VariableTableView = BaseTableView.extend({
        getControlHtml: function () { //实现控制区域渲染接口
            var controlstr =
                "变量名：<input class='i_text' style='width:120px;' data-model='ModelFlow' data-property='variableName'/>" +
                "&nbsp;&nbsp;&nbsp;&nbsp;默认值：<input class='i_text' style='width:120px;' data-model='ModelFlow' data-property='variableValue'/>" +
                "&nbsp;&nbsp;&nbsp;&nbsp;<input type='button' class='button addTrItem' value='保存'/>&nbsp;&nbsp;&nbsp;&nbsp;" +
                "<input type='button' class='button editTrItem' onclick='saveVariableEdit()' style='display:none' value='保存修改'/>";
            return controlstr;
        },
        getTheadHtml: function () {  //实现表头区域渲染接口
            var theadstr = "<thead>" +
                "<th width='40%'>变量名</th><th width='40%'>默认值</th><th >操作</th>" +
                "</thead>";
            return theadstr;
        },
        getNewModel: function (data) { //实现接口，以关联创建的model
            return new ModelVariable(data);
        },
        //增加新的个体数据时，数据处理与页面渲染触发方法
        addNewItem: function () {
            var name = $.getEle("ModelFlow", "variableName").val();
            var value = $.getEle("ModelFlow", "variableValue").val();
            if (!name || name.toString().trim() === "") {
                _top.layer.alert("请输入变量名");
                return;
            }
            if (!value || value.toString().trim() === "") {
                _top.layer.alert("请输入默认值");
                return;
            }
            var view = this;
            var addItem = this.getNewModel({name: name, value: value});
            addItem.set("sfyx_st", "VALID");
            view.collection.push(addItem);
            view.index++;
            $(view.el).children("table").append(
                view.getNewTrView(addItem, 'renderEditMode', true, view.index).render().el
            );
            $.getEle("ModelFlow", "variableName").val("");
            $.getEle("ModelFlow", "variableValue").val("");
            addItem.render();
        },
        getNewTrView: function (item, mode, display, index) {  //实现接口，以关联创建的行view
            return new VariableTrView({
                model: item,
                renderCallback: mode,
                display: display,
                index: index
            });
        }
    });

    //实例动态列表主view
    variableTableView = new VariableTableView({
        collection: modelFlow.get("variables"),
        el: $("#variableTableView")
    });

    //触发动态列表主view渲染
    variableTableView.render();

    //触发主model渲染
    modelFlow.render();

    $("#save").omButton({icons: {left: RX.handlePath('/medias/images/baseModel/button/accept.gif')}}).click(function () {
        if (modelFlow.ruleValidate()) {
            var eles = eval("(" + modelFlow.getJson() + ")");
            if (initHjywlxzd && initHjywlxzd != modelFlow.get("workflowYwztZd")) {
                clearYwzt();
            }
            if (pro) {
                for (key in eles) {
                    pro[key] = eles[key];
                }
            }
            $("#cancel").trigger("click");
        } else {
            if ($("#tab1").find(".TextBoxErr").length > 0) {
                $("#center-tab").omTabs("activate", 0);
            }
        }
    });

    $("#cancel").omButton({icons: {left: RX.handlePath('/medias/images/baseModel/button/cancel.png')}}).click(function () {
        _top.closeLayer(window);
    })
});
//选择字典
function ywzdSelectCallBack(code, name) {
    hjflag = true;
    $.getEle("ModelFlow", "workflowYwztZdName").val(name);
    $.getEle("ModelFlow", "workflowYwztZd").val(code);
}
//清空环节业务状态
function clearYwzt() {
    var nodes = pro.nodes;
    for (var i = 0, nodesLength = nodes.length; i < nodesLength; i++) {
        //是活动环节或者嵌套环节
        nodes[i].ywzt = "";

    }
}