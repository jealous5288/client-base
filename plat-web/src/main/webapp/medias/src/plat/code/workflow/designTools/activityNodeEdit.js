var pro = window._top.property;      //获取top页面缓存的节点工作流数据
var modelActivityNode,    //全局活动节点model对象声明
    modelNodeRole;   //全局环节角色model对象声明
var sheetTableView,     //全局表单view声明
    tempSheetView;       //全局修改中表单view声明
//节点表单字典项获取
function getNodePageDict() {
    var sheetDict = [], sheets;
    if (pro && (sheets = pro.flow.property.sheets)) {
        for (var i = 0; i < sheets.length; i++) {
            if (sheets[i].sheet_id && sheets[i].sfyx_st != "UNVALID" && sheets[i].name) {
                sheetDict.push({"code": sheets[i].sheet_id, "value": sheets[i].name});
            }
        }
    }
    return sheetDict;
}
function getDisagreeNodeDict(model) {
    var dNodeDict = [], nodes;
    var inTag = false;
    if (pro && (nodes = pro.flow.property.nodes)) {
        for (var i = 0; i < nodes.length; i++) {
            var tnode = nodes[i];
            if (tnode.domid && tnode.sfyx_st != "UNVALID" && model.get("domid") != tnode.domid
                && nodes[i].type == "2" && nodes[i].name) {
                dNodeDict.push({"code": nodes[i].domid, "value": nodes[i].name});
                if (model.get("disagreeNodeDomid") == tnode.domid) {
                    inTag = true;
                }
            }
        }
    }
    if (!inTag) {
        model.set("disagreeNodeDomid", "");
    }
    return dNodeDict;
}
//保存表单对象的修改
function saveSheetEdit() {
    var title = $.getEle("ModelActivityNode", "sheetTitle").val();
    var sort = $.getEle("ModelActivityNode", "sheetSort").val();
    var control = $.getEle("ModelActivityNode", "sheetMode").val();
    var sheetMode = $.getEle("ModelActivityNode", "sheetMode").find("option:selected").text();
    var sheet_id = $.getEle("ModelActivityNode", "sheetId").val();
    var spxName = control == "EXAMINE" ? $.getEle("ModelActivityNode", "spxName").val() : "";
    var spxSort = control == "EXAMINE" ? $.getEle("ModelActivityNode", "spxSort").val() : "";
    var spxPrint = control == "EXAMINE" ? $.getEle("ModelActivityNode", "spxPrint").val() : "0";
    var name = $.getEle("ModelActivityNode", "sheetId").find("option:selected").text();
    if (!title || title.toString().trim() === "") {
        layer.alert("请填写标题");
        return;
    }
    if (!sort || sort.toString().trim() === "") {
        layer.alert("请填写序号");
        return;
    }
    tempSheetView.model.setValue("sort", sort);
    tempSheetView.model.setValue("title", title);
    tempSheetView.model.setValue("control", control);
    tempSheetView.model.setValue("sheetMode", sheetMode);
    tempSheetView.model.setValue("sheet_id", sheet_id);
    tempSheetView.model.setValue("name", name);
    tempSheetView.model.setValue("spxName", spxName);
    tempSheetView.model.setValue("spxSort", spxSort);
    tempSheetView.model.setValue("spxPrint", spxPrint);
    $(".printTag", tempSheetView.el).text(spxPrint == "1" ? "是" : "否");

    $.getEle("ModelActivityNode", "sheetSort").val("");
    $.getEle("ModelActivityNode", "sheetTitle").val("");
    $.getEle("ModelActivityNode", "sheetId").val("");
    $.getEle("ModelActivityNode", "sheetMode").val("EDIT");
    $(".spxItem").hide();
    $(tempSheetView.el).removeClass("editTr");
    $(sheetTableView.el).find(".editTrItem").hide();
    $(sheetTableView.el).find(".addTrItem").show();
    tempSheetView.model.updateModel();
    tempSheetView = null;
}

function reloadRoleDetail(id, roleType) {
    if (id) {
        $("#roleElementFrame").show();
        $("#roleElementFrame").attr("src", RX.handlePath("/role/roleElementView?id=" + id + "&roleType=" + roleType));
    } else {
        $("#roleElementFrame").hide();
    }
}
function roleSelectCallback(id, name, code, roleType) {
    modelActivityNode.set("roleId", id);
    modelActivityNode.setValue("roleName", name);
    modelActivityNode.setValue("roleCode", code);
    modelActivityNode.setValue("roleType", roleType);
    var typeName = "";
    if (roleType == "1") {
        typeName = "系统角色";
    } else if (roleType == "2") {
        typeName = "业务角色";
    } else if (roleType == "3") {
        typeName = "动态角色";
    }
    modelActivityNode.setValue("roleTypeName", typeName);
    reloadRoleDetail(id, roleType);
}

function roleChangeFunc(model) {
    if (!$.getEle("ModelActivityNode", "roleName").val()) {
        modelActivityNode.updateFromObject({roleId: "", roleName: "", roleCode: "", roleType: "", roleTypeName: ""});
        reloadRoleDetail();
    }
}

function sheetIdChangeFunc(model) {
    var title = $.getEle("ModelActivityNode", "sheetId").find("option:selected").text();
    if (title == "请选择") {
        modelActivityNode.setValue("sheetTitle", "");
    } else {
        modelActivityNode.setValue("sheetTitle", title);
        var sheetSort = $.getEle("ModelActivityNode", "sheetSort");
        if (!sheetSort.val()) {
            sheetSort.val(sheetTableView.vaildLength() + 1);
        }
    }
}

function blfsChangeFunc(model) {
    $("[name='transactType']").each(function (index, element) {
        if (element.checked) {
            if (element.value == 1) {
                $("#hqfs").show();
            } else {
                $("#hqfs").hide();
            }
        }
    });
}
$(function () {
    $("#center-tab").omTabs({
        lazyLoad: true
    });
    //创建子model表单对象
    var ModelSheet = DetailModel.extend({
        className: "ModelSheet",
        initJson: modelActivityNodeJson,
        stateJson: xzStateJson,
        setModelName: function () {
            this.set("ModelName", "ModelSheet" + (++modelIndex));
        }
    });

    //创建表单列表
    var SheetCollection = Backbone.Collection.extend({
        model: ModelSheet
    });
    modelActivityNodeJson.ModelActivityNode.ywzt.dictConfig.dictCode = pro.flow.property.workflowYwztZd;
    //创建子model表单对象
    var ModelVariable = DetailModel.extend({
        className: "ModelVariable",
        initJson: modelActivityNodeJson,
        stateJson: xzStateJson,
        setModelName: function () {
            this.set("ModelName", "ModelVariable" + (++modelIndex));
        }
    });

    //创建表单列表
    var VariableCollection = Backbone.Collection.extend({
        model: ModelVariable
    });

    //个性button
    var ModelButton = DetailModel.extend({
        className: "ModelButton",
        initJson: modelActivityNodeJson,
        stateJson: xzStateJson,
        setModelName: function () {
            this.set("ModelName", "ModelButton" + (++modelIndex));
        }
    });
    var ButtonCollection = Backbone.Collection.extend({
        model: ModelButton
    });

    //创建主model活动环节对象
    var ModelActivityNode = DetailModel.extend({
        className: "ModelActivityNode",
        initJson: modelActivityNodeJson,
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
            }, {
                type: Backbone.HasMany,
                key: 'buttons',
                relatedModel: ModelButton,
                collectionType: ButtonCollection
            }
        ]
    });
    modelActivityNode = new ModelActivityNode(pro.property);

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
                "<td><input type='text' class='i_text' data-model='" + this.model.get("ModelName") + "' data-property='sheetMode' value='" + this.model.get("sheetMode") + "'></td>" +
                "<td><input type='text' class='i_text' data-model='" + this.model.get("ModelName") + "' data-property='spxName' value='" + this.model.get("spxName") + "'></td>" +
                "<td><input type='text' class='i_text' data-model='" + this.model.get("ModelName") + "' data-property='spxSort' value='" + this.model.get("spxSort") + "'></td>" +
                "<td class='printTag'>" + (this.model.get("spxPrint") == '1' ? "是" : "否") + "</td>" +
                "<td><a class='editEle'>修改</a><a class='delete'>删除</a></td>";
            $(this.el).html(html);
        },
        editElement: function () {
            tempSheetView = this;
            var model = this.model;
            $(sheetTableView.el).find(".addTrItem").hide();
            $(sheetTableView.el).find(".editTrItem").show();
            $(tempSheetView.el).addClass("editTr");
            $.getEle("ModelActivityNode", "sheetId").val(model.get("sheet_id"));
            $.getEle("ModelActivityNode", "sheetSort").val(model.get("sort"));
            $.getEle("ModelActivityNode", "sheetTitle").val(model.get("title"));
            $.getEle("ModelActivityNode", "sheetMode").val(model.get("control"));
            if (model.get("control") == "EXAMINE") {
                $(".spxItem").show();
                $.getEle("ModelActivityNode", "spxName").val(model.get("spxName"));
                $.getEle("ModelActivityNode", "spxSort").val(model.get("spxSort"));
                $.getEle("ModelActivityNode", "spxPrint").val(model.get("spxPrint"));
            }
        },
        del: function () {
            if (tempSheetView && tempSheetView == this) {
                layer.alert("数据正在修改中，无法删除");
                return;
            }
            var that = this;
            layer.confirm("您确定要删除该条信息吗？", function (index) {
                that.model.set("sfyx_st", "UNVALID");
                that.remove();
                layer.close(index);
            });
        }
    });

    //创建动态列表主体view类
    var SheetTableView = BaseTableView.extend({
        getControlHtml: function () { //实现控制区域渲染接口
            var controlstr =
                "<div style='width:745px;float:left;'>序号：" +
                "<span><input class='i_text' style='width:50px;' data-model='ModelActivityNode' data-property='sheetSort'/></span>" +
                "&nbsp;&nbsp;标题：<input class='i_text' style='width:120px;' data-model='ModelActivityNode' data-property='sheetTitle'/>" +
                "&nbsp;&nbsp;选择表单：<select class='i_select' style='width:120px;' data-model='ModelActivityNode' data-property='sheetId'><option value=''>请选择</option></select>" +
                "&nbsp;&nbsp;表单控制：<select class='i_select' style='width:50px' data-model='ModelActivityNode' data-property='sheetMode'>" +
                "<option value='EDIT'>办理</option><option value='EXAMINE'>审批</option><option value='VIEW'>查看</option><option value='SEAL'>签章</option></select>" +
                "&nbsp;&nbsp;<input type='button' class='button addTrItem' value='保存'/>" +
                "<input type='button' class='button editTrItem' onclick='saveSheetEdit()' style='display:none' value='保存修改'/><br/>" +
                "&nbsp;&nbsp;<span class='spxItem' style='display:none'>审批项名称：<input class='i_text spxItem' style='width:120px;' data-model='ModelActivityNode' data-property='spxName'/></span>" +
                "&nbsp;&nbsp;<span class='spxItem' style='display:none'>审批项序号：<input class='i_text spxItem' style='width:50px;display:none' data-model='ModelActivityNode' data-property='spxSort'/></span>" +
                "&nbsp;&nbsp;<span class='spxItem' style='display:none'>打印审批项：<select class='select' style='width:50px' data-model='ModelActivityNode' data-property='spxPrint'>" +
                "<option value='0' selected>否</option><option value='1'>是</option></select></span>" +
                "</div>";
            return controlstr;
        },
        //主渲染方法
        render: function () {
            var view = this;
            this.index = 0;
            $(this.el).empty();
            //渲染控制区域，放入table的caption中
            $(this.el).append(view.getControlHtml());  //渲染标题和控制区域
            var table = $('<table  cellpadding="0" cellspacing="0" border="0" class="list"></table>');
            table.append(view.getTheadHtml());
            //渲染table的thead部分
            // $(this.el).append(view.getTheadHtml());
            //渲染collection
            if (this.collection != null && this.collection.models != null) {
                $.each(this.collection.models, function (key, model) {
                    if (model.get("sfyx_st") != "UNVALID") {
                        view.index++;
                        var viewel = view.getNewTrView(model, 'renderEditMode', true, view.index, view).render().el;
                        $(table).append(viewel);
                    }
                })
            }
            $(this.el).append(table);
            view.modelRender();
        },
        getTheadHtml: function () {  //实现表头区域渲染接口
            var theadstr = "<thead>" +
                "<th width='5%'>序号</th><th width='16%'>标题</th><th width='16%'>所属表单</th>" +
                "<th width='10%'>表单控制</th><th width='20%'>审批项名称</th><th width='10%'>审批项序号</th><th width='8%'>是否打印</th><th >操作</th>" +
                "</thead>";
            return theadstr;
        },
        getNewModel: function (data) { //实现接口，以关联创建的model
            return new ModelSheet(data);
        },
        //增加新的个体数据时，数据处理与页面渲染触发方法
        addNewItem: function () {
            var sheet_id = $.getEle("ModelActivityNode", "sheetId").val();
            var title = $.getEle("ModelActivityNode", "sheetTitle").val();
            var name = $.getEle("ModelActivityNode", "sheetId").find("option:selected").text();
            var sort = $.getEle("ModelActivityNode", "sheetSort").val();
            var control = $.getEle("ModelActivityNode", "sheetMode").val();
            var sheetMode = $.getEle("ModelActivityNode", "sheetMode").find("option:selected").text();
            var spxName = control == "EXAMINE" ? $.getEle("ModelActivityNode", "spxName").val() : "";
            var spxSort = control == "EXAMINE" ? $.getEle("ModelActivityNode", "spxSort").val() : "";
            var spxPrint = control == "EXAMINE" ? $.getEle("ModelActivityNode", "spxPrint").val() : "0";
            if (!sheet_id || sheet_id.toString().trim() === "") {
                layer.alert("请选择表单");
                return;
            }
            if (!sort || sort.toString().trim() === "") {
                layer.alert("请填写序号");
                return;
            }
            if (!title || title.toString().trim() === "") {
                layer.alert("请填写标题");
                return;
            }
            var view = this;
            var addItem = this.getNewModel({
                sheet_id: sheet_id, title: title, name: name, sort: sort, control: control,
                sheetMode: sheetMode, spxName: spxName, spxSort: spxSort, spxPrint: spxPrint
            });
            addItem.set("sfyx_st", "VALID");
            view.collection.push(addItem);
            view.index++;
            $(view.el).children("table").append(
                view.getNewTrView(addItem, 'renderEditMode', true, view.index).render().el
            );
            $.getEle("ModelActivityNode", "sheetId").val("");
            $.getEle("ModelActivityNode", "sheetName").val("");
            $.getEle("ModelActivityNode", "sheetTitle").val("");
            $.getEle("ModelActivityNode", "sheetSort").val("");
            $.getEle("ModelActivityNode", "spxName").val("");
            $.getEle("ModelActivityNode", "spxSort").val("");
            $.getEle("ModelActivityNode", "spxPrint").val("0");
            $.getEle("ModelActivityNode", "sheetMode").val("EDIT");
            $(".spxItem").hide();
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
    });

    //实例动态列表主view
    sheetTableView = new SheetTableView({
        collection: modelActivityNode.get("sheets"),
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
                "<td><input type='text' class='i_text' data-model='" + this.model.get("ModelName") + "' data-property='sheetMode' value='" + this.model.get("sheetMode") + "'></td>" +
                "<td><a class='editEle'>修改</a><a class='delete'>删除</a></td>";
            $(this.el).html(html);
        },
        editElement: function () {
            tempVariableView = this;
            var model = this.model;
            $(variableTableView.el).find(".addTrItem").hide();
            $(variableTableView.el).find(".editTrItem").show();
            $(tempVariableView.el).addClass("editTr");
            $.getEle("ModelActivityNode", "variableName").val(model.get("name"));
            $.getEle("ModelActivityNode", "variableValue").val(model.get("value"));
        },
        del: function () {
            if (tempVariableView && tempVariableView == this) {
                layer.alert("数据正在修改中，无法删除");
                return;
            }
            var that = this;
            layer.confirm("您确定要删除该条信息吗？", function (index) {
                that.model.set("sfyx_st", "UNVALID");
                that.remove();
                layer.close(index);
            });
        }
    });

    var ButtonTrView = BaseElementView.extend({
        tagName: 'tr',
        className: '',
        renderEditMode: function () {    //实现渲染接口
            var view = this;
            var html ="<td>"+view.index+"</td>"+
                "<td><input type='text' class='i_text' data-model='" + this.model.get("ModelName") + "' data-property='name'></td>" +
                "<td><input type='text' class='i_text' data-model='" + this.model.get("ModelName") + "' data-property='code'></td>" +
                "<td><input type='text' class='i_text' data-model='" + this.model.get("ModelName") + "' data-property='icon'></td>" +
                "<td><input type='text' class='i_text' data-model='" + this.model.get("ModelName") + "' data-property='flag'></td>" +
                "<td><input type='text' class='i_text' data-model='" + this.model.get("ModelName") + "' data-property='funcName'></td>"+
                "<td><input type='text' class='i_text' data-model='" + this.model.get("ModelName") + "' data-property='sort'></td>"+
                "<td><div class='element_box'><select class='i_select' data-model='" + this.model.get("ModelName") + "' data-property='isShowInHandle'></select></div></td>"+
                "<td><a href='javaScript:void(0)' class='delete'>删除</a></td>";
            $(this.el).html(html);
        },
        //删除事件相应方法
        del: function () {
            var view = this;
            layer.confirm("您确定要删除该条信息吗？", function (index) {
                view.model.set("sfyx_st", "UNVALID");
                var parentModels = view.parentView.collection.models;
                for(var i=0,maxLength = parentModels.length;i<maxLength;i++){
                    parentModels[i].updateModel();
                }
                view.parentView.render();
                layer.close(index);
            });
        }
    });
    var ButtonTableView = BaseTableView.extend({
        getControlHtml: function () { //实现控制区域渲染接口
            var controlstr = "<div class='page_title'>" +
                "<h1>个性按钮(标志位和函数名必填一项)</h1>";
            controlstr += "<ul class='action_button' style='float: right;margin: 0 5px 0 0;'>" +
                "<li><a class='addNewItem'>新增</a></li>" +
                "</ul>" +
                "</div>";
            return controlstr;
        },
        getTheadHtml: function () {  //实现表头区域渲染接口
            return "<thead>" +
                "<th width='5%'>序号</th><th width='15%'><b style='color:red'>*</b>名称</th><th width='12%'><b style='color:red'>*</b>code</th>" +
                "<th width='10%'>图标</th><th width='10%'>标志位</th><th width='13%'>函数名</th>" +
                "<th>排序号</th><th>显示时段</th><th>操作</th>" +
                "</thead>";

        },
        getNewModel: function (data) { //实现接口，以关联创建的model
            return new ModelButton(data);
        },
        //事件
        events: {
            'click .addNewItem': 'addNewItem',
            'click .addTrLayerItem': 'openAddLayer',
            'click .deleteItems': 'deleteItems'
        },
        getNewTrView: function (item, mode, display, index,par) {  //实现接口，以关联创建的行view
            return new ButtonTrView({
                model: item,
                renderCallback: mode,
                display: display,
                index: index,
                parentView:par
            });
        }
    });
    //实例动态列表主view
    var buttonTableView = new ButtonTableView({
        collection: modelActivityNode.get("buttons"),
        el: $("#buttonTableView")
    });
    buttonTableView.render();

    //触发主model渲染
    modelActivityNode.render();

    var id = modelActivityNode.get("roleId");
    if (id && id != "null") {
        $.ajax({
            type: "get",
            url: "/role/getRoleById?id=" + id + "&random=" + Math.random(),
            success: function (ar) {
                if (ar.success) {
                    roleSelectCallback(ar.data.id, ar.data.roleName, ar.data.roleCode, ar.data.roleType);
                }
            }
        });

    }

    $("#save").omButton({icons: {left: RX.handlePath('/medias/images/baseModel/button/accept.gif')}}).click(function () {
        if (modelActivityNode.ruleValidate()) {
            var eles = eval("(" + modelActivityNode.getJson() + ")");
            if (pro) {
                for (key in eles) {
                    pro.property[key] = eles[key];
                }
                //给dom赋新名字
                var obj = pro._obj;
                if (obj != null) {
                    var newName = eles.name;
                    obj.attr("title", newName);
                    var text = obj.data("enclosedText");
                    if (text != null) {
                        pro.textWrap2(text, 60, newName, 36);
                        text.attr("title", newName);
                    }
                }
            }
            $("#cancel").trigger("click");
        } else {
            if (!modelActivityNode.get("roleId")) {
                layer.alert("请选择环节办理角色");
                $("#center-tab").omTabs("activate", 1);
            }
        }
    })

    $("#cancel").omButton({icons: {left: RX.handlePath('/medias/images/baseModel/button/cancel.png')}}).click(function () {
        closeLayer(window);
    })


    $("#addRole").click(function () {
        openStack(window, "新增流程角色", "medium", "/role/roleEdit?type=xz&wfTag=1&" +
            "func=roleSelectCallback");
    })
    $("#editRole").click(function () {
        if (modelActivityNode.get("roleType") == 1) {
            layer.alert("系统角色不可修改");
        } else {
            openStack(window, "修改流程角色", "medium", "/role/roleEdit?type=xg&wfTag=1&" +
                "id=" + modelActivityNode.get("roleId") + "&func=roleSelectCallback");
        }
    })
    $("#deleteRole").click(function () {
        layer.confirm("确认删除该角色吗？", function () {
            $.ajax({
                type: "post",
                url: "/role/deleteRole",
                data: {id: modelActivityNode.get("roleId")},
                dataType: "json",
                success: function (ar) {
                    if (ar.success) {
                        layer.alert("删除成功");
                        roleSelectCallback();
                    } else {
                        layer.alert("保存失败");
                    }
                }
            });
        });
    })

})
function changeSheetMode(model) {
    if ($.getEle(model.get("ModelName"), "sheetMode").val() == "EXAMINE") {
        $(".spxItem").show();
    } else {
        $(".spxItem").hide();
    }
}
