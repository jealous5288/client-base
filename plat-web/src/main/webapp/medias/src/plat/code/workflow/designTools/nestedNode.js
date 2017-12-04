$(document).ready(function () {
    $("#center-tab").omTabs({
        lazyLoad:true
    });
    var removeSheets = [];
    $("#vars .edit").live("click", function () {
        var td = $(this).parent().prev();
        var input = $('<input type="text" class="TextBoxa"/>');
        input.val(td.text()).css("margin", "5px auto").focusout(function () {
            td.next().children(".ok_button").click();
        });
        td.data("text", td.text()).empty().append(input);
        $(this).parent().html('<input type="button" class="button1 ok_button" value="确定"/><input type="button" class="button1 cancel_button" value="取消"/>');
        input.focus();
    });
    $("#vars .remove").live('click', function () {
        var tr = $(this).parent().parent();
        var index = tr.attr("index");
        if (!confirm("删除后奖不可恢复，确认继续删除吗？")) {
            return false;
        }
        if (index != undefined) {
            removedVars.push(index);
        }
        tr.remove();
    });
    $("#vars .ok_button").live("click", function () {
        var td = $(this).parent().prev();
        td.text(td.children("input").val());
        $(this).parent().html('<input type="button" class="button1 edit" value="修改"/><input type="button" class="button1 remove" value="删除"/>');
    });
    $("#vars .cancel_button").live("click", function () {
        var td = $(this).parent().prev();
        td.text(td.data("text"));
        $(this).parent().html('<input type="button" class="button1 edit" value="修改"/><input type="button" class="button1 remove" value="删除"/>');
    });
    $("#sheets .modify_sheet").live('click', function () {
        var td4 = $(this).parent();
        var td3 = td4.prev();
        var td2 = td3.prev();
        var td1 = td2.prev();
        var tr = td1.parent();

        var title = td1.text();
        td1.data("title", title);
        var input1 = $("<input type='text' class='TextBoxa'/>").css("margin", "5px auto").width(120);
        input1.val(title);
        td1.empty().append(input1);

        td2.data("tempFormName", td2.text()).data('formName', td2.text());//.empty();

//            var input2 = $("<input type='text' class='sheets'>").appendTo(td2).omCombo({
//                dataSource:nodeSheets,
//                optionField:"name",
//                valueField:"sheetId",
//                inputField:"name",
//                editable:false,
//                width:120,
//                onValueChange:function (target, newValue, oldValue, event) {
//                    input1.val(target.val());
//                    td2.data("tempFormName", target.val());
//                },
//                value:td2.attr("sheetid")
//            });

        td3.empty().append($("#sheetMode").clone().show().val(td3.attr("sheetcontr")).width(60));
        td4.html('<input type="button" class="button1 ok_button" value="确定"/><input type="button" class="button1 cancel_button" value="取消"/>');
        input1.focus();
    });
    var nodeSheets;
    $("#sheets .remove_sheet").live('click', function () {
        var tr = $(this).parent().parent();
        var index = tr.attr("index");
        if (!confirm("删除后将不可恢复，确认继续删除吗？")) {
            return false;
        }
        if (index != undefined) {
            removeSheets.push(index);
        }
        tr.remove();
    });
    $("#sheets .config_sheet").live('click', function () {
        var tr = $(this).parent().parent();
        _top.popDialog({
            title:"活动表单配置",
            autoOpen:false,
            modal:true,
            resizable:false,
            width:550,
            height:445
        }, "configureForm?id=" + tr.children(".sheet_name").attr("sheetid"), tr);
    });
    $("#sheets .ok_button").live('click', function () {
        var td4 = $(this).parent();
        var td3 = td4.prev();
        var td2 = td3.prev();
        var td1 = td2.prev();
        var tr = td1.parent();
        var title = td1.children("input").val();
        var name = td2.data("tempFormName");
        var sheetId = td2.attr("sheetid");//td2.find(".sheets").omCombo("value");
        var contr = td3.children("select").val();

        var sheetIds = $("#sheets .sheet_name").not(td2);
        for (var i = 0; i < sheetIds.size(); i++) {
            if (sheetId == sheetIds.eq(i).attr("sheetid")) {
                alert(name + " 已经存在!");
                return false;
            }
        }

        td1.text(title);
        td2.text(name).attr("sheetid", sheetId);
        td3.text(['编辑', '审批', '签章'][contr]).attr("sheetcontr", contr);
        td4.html('<input type="button" class="button1 modify_sheet" value="修改"/><input type="button" class="button1 remove_sheet" value="删除"/>');
    });
    $("#sheets .cancel_button").live('click', function () {
        var td4 = $(this).parent();
        var td3 = td4.prev();
        var td2 = td3.prev();
        var td1 = td2.prev();
        var tr = td1.parent();

        var title = td1.data('title');
        var name = td2.data("formName");
        var contr = td3.attr("sheetcontr");
        td1.text(title);
        td2.text(name);
        td3.text(['编辑', '审批', '签章'][contr]);
        td4.html('<input type="button" class="button1 modify_sheet" value="修改"/><input type="button" class="button1 remove_sheet" value="删除"/>');
    });
    function addSheet(title, name, id, contr, sheetControls, index) {
        var keys = sheets.find(".sheet_name");
        for (var i = 0; i < keys.size(); i++) {
            if (id == keys.eq(i).attr('sheetid')) {
                return false;
            }
        }
        var tr = $("<tr class='trhover'></tr>").appendTo(sheets);
        if (index != undefined) {
            tr.attr("index", index);
        }
        if (sheetControls != undefined) {
            tr.data("sheetControls", sheetControls);
        }
        if (sheets.children("tr").size() % 2 == 0) {
            tr.addClass("se");
        }
        var td1 = $('<td class="sheet_title"></td>').text(title).appendTo(tr);
        var td2 = $('<td class="sheet_name"></td>').text(name || '').attr("sheetid", id).appendTo(tr);
        var td4 = $('<td class="sheet_contr"></td>').text(["编辑", '审批', '签章'][contr]).attr("sheetcontr", contr).appendTo(tr);
        var td3 = $('<td></td>').appendTo(tr).html('<input type="button" class="button1 modify_sheet" value="修改"/><input type="button" class="button1 remove_sheet" value="删除"/>');
        return true;
    }

    var vars = $("#vars");
    var sheets = $("#sheets");
    var eles = {};
    eles.name = $("#titleText");
    eles.nodeSort = $("#nodeSort");
    eles.childWorkflow = {};
    eles.childWorkflow.id = $("#workflowId");
    eles.childWorkflow.name = $("#workflowName");

    var node = _top.property;
    var pro = null;
    if (node) {
        pro = node.property;
        var varName;
        var removedVars = [];

        varName = $("#varName").omCombo({
            dataSource:node.flow.property.variables,
            inputField:function (data, index) {
                //选择'中国'后输入框的文字显示成'中国(zh_CN)'
                return data.name + '(默认值:' + data.value + ')';
            },
            valueField:"name",
            listProvider:function (container, records) {
                var len = records.length;
                var html = '<table cellpadding="0" class="varTable" cellspacing="0"><thead><tr><th>变量名</th><th>默认值</th></tr></thead><tbody>';
                for (var i = 0; i < len; i++) {
                    html += '<tr><td>' + records[i].name + '</td><td>' + records[i].value + '</td></tr>';
                }
                html += "</tbody></table>";
                $(html).appendTo(container);
                return container.find('tbody tr');
            },
            width:"260px"
        });

        var saveVar = $("#saveVar").click(function () {
            var name = varName.omCombo("value");
            if (name == "") {
                alert("请先选择流程变量!");
                return;
            }
            var value = null;
            var result = addVar(name, value);
            if (result == -1) {
                alert("不存在的流程变量");
            } else if (result == 0) {
                alert("该流程变量已经存在于列表中!");
            } else {
                varName.omCombo("value", "");
            }
        });

        function addVar(name, value, index) {
            var v = null;
            for (var i = 0; i < node.flow.property.variables.length; i++) {
                var temp = node.flow.property.variables[i];
                if (name == temp.name) {
                    v = temp.value;
                }
            }
            if (v == null) {
                return -1;
            }
            if (value == null) {
                value = v;
            }
            var keys = vars.find(".var_name");
            for (var i = 0; i < keys.size(); i++) {
                if (name == keys.eq(i).text()) {
                    return 0;
                }
            }
            var tr = $("<tr class='trhover'></tr>");
            if (index != undefined) {
                tr.attr("index", index);
            }
            if (vars.children("tr").size() % 2 == 0) {
                tr.addClass("se");
            }
            var td1 = $("<td class='var_name'></td>").text(name).appendTo(tr);
            var td2 = $("<td></td>").text(value).appendTo(tr);
            var td = $("<td></td>").appendTo(tr);
            $('<input type="button" class="button1 edit" value="修改"/>').appendTo(td);
            $('<input type="button" class="button1 remove" value="删除"/>').appendTo(td);
            tr.appendTo(vars);
            return 1;
        }

        $.each(eles, function (key, e) {
            if (e instanceof  $) {
                if (e.attr("type") == "radio" || e.attr("type") == "checkbox") {
                    e.filter(function () {
                        return this.value == pro[key];
                    }).attr("checked", true);
                } else {
                    e.val(pro[key] || "");
                }
            } else {
                if (pro[key] != undefined && pro[key] != null) {
                    e.id.val(pro[key] || "");
                }
            }
        });
        $.each(pro.variables, function (i, v) {
            addVar(v.name, v.value, i);
        });
        if (pro.sheets) {
            $.each(pro.sheets, function (i, v) {
                addSheet(v.title, v.name, v.sheetId, v.sheetMode, v.sheetControls, i);
            });
        }
    }
    /**
     * 加载工作流类别树
     */
    $.fn.zTree.init($("#workflowTypeTree"), {
        async:{
            type:"get",
            enable:true,
            autoParam:['id'],
            url:"createWorkflowTypeAndWorkflowTree?ran=" + Math.random()
        },
        data:{
            simpleData:{
                enable:true
            }
        },
        callback:{
            onClick:function (event, treeId, treeNode) {
                if (treeNode.type == "workflow") {
                    var id = treeNode.id.split('_').pop();
                    var flag = true;
                    if (pro) {
                        if (eles.childWorkflow.id.val() == id) {
                            flag = false;
                        }
                    }
                    if (flag) {
                        if (pro.childWorkflow && pro.childWorkflow.id) {
                            sheets.find(".remove_sheet").click();
                        } else {
                            sheets.empty();
                        }
                        $.get("getSheetsByWorkflow?ran="+Math.random(), {id:id}, function (data) {
                            $.each(data, function (i, v) {
                                addSheet(v.title, v.name, v.sheetId, v.sheetMode);
                            });
                            nodeSheets = data;
                        }, 'json')
                    }
                    eles.childWorkflow.id.val(id);
                    eles.childWorkflow.name.val(treeNode.name);
                }
            },
            beforeClick:function (treeId, treeNode, clickFlag) {
                return treeNode.type == 'workflow';
            }
        }
    }, null);
    if (eles.childWorkflow.id.val() != "" && eles.childWorkflow.name.val() == "") {
        $.get("findWorkflowById", {id:eles.childWorkflow.id.val()}, function (data) {
            var treeObj = $.fn.zTree.getZTreeObj('workflowTypeTree');
            var curnode = treeObj.getNodeByParam("id", 'f_' + eles.childWorkflow.id.val(), null);
            if (curnode) {
                treeObj.selectNode(curnode, false);
            }
            eles.childWorkflow.name.val(data.name || '');
        }, 'json')
    }
    $("#save").omButton({icons:{left:'/medias/images/baseModel/button/accept.gif'}}).click(function () {
        if (pro) {
            for (var key in eles) {
                var e = eles[key];
                var v = "";
                var require = "";
                if (e instanceof  $) {
                    require = e.attr("require");
                    if (e.attr("type") == "radio" || e.attr("type") == "checkbox") {
                        v = e.filter(function () {
                            return this.checked;
                        }).val();
                    } else {
                        v = e.val();
                    }
                } else {
                    require = e.name.attr("require");
                    v = e.id.val();
                }
                if (require != undefined && (v == "" || v == undefined)) {
                    alert(require);
                    e instanceof  $ ? e.focus() : e.name.focus();
                    return false;
                }
                pro[key] = v;
            }
            var obj = node._obj;
            if (obj != null) {
                var newName = eles.name.val();
                obj.attr("title", newName);
                var text = obj.data("enclosedText");
                if (text != null) {
                    node.textWrap2(text, 45, newName,24);
                    text.attr("title", newName);
                }
            }
            $("#sheets tr").each(function () {
                var index = $(this).attr("index");
                var tds = $(this).children("td");
                var title = tds.eq(0).text();
                var id = tds.eq(1).attr("sheetid");
                var contr = tds.eq(2).attr("sheetcontr");
                var name = tds.eq(1).text();
                var sheet = new nodeSheet();
                sheet.name = name;
                sheet.title = title;
                sheet.sheetId = id;
                sheet.sheetMode = contr;
                sheet.sheetControls = $(this).data("sheetControls");
                if (index == undefined) {
                    pro.addSheet(sheet);
                } else {
                    pro.editSheet(index, sheet);
                }
            });
            $.each(removeSheets, function (i, index) {
                pro.removeVariable(index);
            });
            $("#vars tr").each(function () {
                var index = $(this).attr("index");
                var tds = $(this).children("td");
                var tempvar = new workflowVariable();
                tempvar.name = tds.eq(0).text();
                tempvar.value = tds.eq(1).text();
                if (index == undefined) {
                    tempvar.id = "";
                    pro.addVariable(tempvar);
                } else {
                    pro.editVariable(index, tempvar);
                }
            });
            $.each(removedVars, function (i, index) {
                pro.removeVariable(index);
            });
        }
        $("#cancel").trigger("click");
    });
    $("#cancel").omButton({icons:{left:'/medias/images/baseModel/button/cancel.png'}}).click(function () {
        _top.property = null;
        _top.closeLayer(window);
    });
})