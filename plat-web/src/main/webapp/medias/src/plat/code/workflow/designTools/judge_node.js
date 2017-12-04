$(document).ready(function () {
    $("#center-tab").omTabs({
        lazyLoad:true
    });
    $(".edit").live("click", function () {
        var td = $(this).parent().prev();
        var input = $('<input type="text" class="TextBoxa"/>');
        input.val(td.text()).css("margin", "5px auto").focusout(function(){
            td.next().children(".ok_button").click();
        });
        td.data("text", td.text()).empty().append(input);
        $(this).parent().html('<input type="button" class="button1 ok_button" value="确定"/><input type="button" class="button1 cancel_button" value="取消"/>');
        input.focus();
    });
    $(".remove").live('click', function () {
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
    $(".ok_button").live("click", function () {
        var td = $(this).parent().prev();
        td.text(td.children("input").val());
        $(this).parent().html('<input type="button" class="button1 edit" value="修改"/><input type="button" class="button1 remove" value="删除"/>');
    });
    $(".cancel_button").live("click", function () {
        var td = $(this).parent().prev();
        td.text(td.data("text"));
        $(this).parent().html('<input type="button" class="button1 edit" value="修改"/><input type="button" class="button1 remove" value="删除"/>');
    });
    var vars = $("#vars");
    var eles = {};
    eles.name = $("#titleText");
//        eles.description = $("#description");
    eles.decisionType = $("[name=decisionType]");

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
    }
    $("#nodeActive").click(function () {
        $("#active").removeAttr("disabled");
    });
    $("#save").omButton({icons:{left:RX.handlePath('/medias/images/baseModel/button/accept.gif')}}).click(function () {
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
                    node.textWrap2(text, 50, newName,30);
                    text.attr("title", newName);
                }
            }
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
    $("#cancel").omButton({icons:{left:RX.handlePath('/medias/images/baseModel/button/cancel.png')}}).click(function () {
        _top.property = null;
        _top.closeLayer(window);
    });
})