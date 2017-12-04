/*****************************************************************
 * 基本动态列表与动态表单块面板
 * 最后更新时间：2016-02-26
 * 最后更新人：zhan
 *****************************************************************/

//创建动态表单块面板view
var BaseFormView = Backbone.View.extend({
    tagName: 'div', //标签名，暂固定为div
    className: '',   //个体样式
    index: 0,    //序号
    mulChose: true,
    //获取实际新实体model方法
    getNewModel: function () {

    },
    //获取实际个体数据view方法
    getNewElementView: function (item, mode, display, index, parent) {

    },
    //获取控制区域html
    getControlHtml: function () {
        var controlstr = "<div style='height:auto;width:auto'><button class='addItem'>新增表单块</button></div>";
        return controlstr;
    },
    //事件
    events: {
        'click button.addFormItem': 'addNewItem',
        'click a.addFormItem': 'addNewItem',
        'click button.addEleLayerItem': 'openAddLayer',
        'click div.addEleLayerItem': 'openAddLayer',
        'click a.addEleLayerItem': 'openAddLayer',
        'click button.deleteFormItems': 'deleteItems',
        'click a.deleteFormItems': 'deleteItems'
    },
    //主渲染方法
    render: function () {
        var view = this;
        $(this.el).empty();
        $(this.el).append(this.getControlHtml());
        if (this.collection != null && this.collection.models != null) {
            $.each(this.collection.models, function (key, model) {
                if (model.get("sfyx_st") != "UNVALID") {
                    view.index++;
                    var viewel = view.getNewElementView(model, 'renderEditMode', true, view.index, view).render().el;
                    $(view.el).append(viewel);
                }
            })
        }
    },
    //渲染model规则接口
    modelRender: function () {
        if (this.collection.models != null) {
            $.each(this.collection.models, function (index, model) {
                model.render();
            })
        }
    },
    //更新表单元素至model
    modelUpdate: function () {
        _.map(this.collection.models, function (model, key) {
            model.updateModel();
        });
    },
    //获取view的collection中的model字段集合，以逗号隔开
    getListPropertys: function (pro) {
        var ids = "";
        if (this.collection.models != null) {
            $.each(this.collection.models, function (key, value) {
                if (value.get("sfyx_st") != "UNVALID" && value.get(pro) != "") {
                    ids += value.get(pro) + ",";
                }
            });
        }
        if (ids.length > 0) {
            ids = ids.substr(0, ids.length - 1);
        }
        return ids;
    },
    //添加选择内容
    addSelItem: function (model) {
        var view = this;
        view.collection.push(model);
        view.index++;
        $(view.el).append(
            view.getNewElementView(model, 'renderEditMode', true, view.index).render().el
        );
        model.render();
    },
    //增加新的个体数据时，数据处理与页面渲染触发方法
    addNewItem: function () {
        var view = this;
        var addItem = this.getNewModel();

        this.collection.push(addItem);
        view.index++;
        $(this.el).append(
            view.getNewElementView(addItem, 'renderEditMode', true, view.index, view).render().el
        );
        addItem.render();
    },
    //批量删除方法
    deleteItems: function () {
        var view = this;
        var dels = new Array();
        _.map(this.collection.models, function (model, key) {
            model.updateModel();
            if (model.checked == true) {
                dels.push(model);
            }
        });
        if (dels.length > 0) {
            _top.layer.confirm("您确定要删除这些信息吗？", function (index) {
                $.each(dels, function (index, model) {
                    model.set("sfyx_st", "UNVALID");
                    model.checked = false;
                });
                view.render();
                _top.layer.close(index);
            });
        } else {
            _top.layer.alert("请勾选要删除的信息")
        }
    },
    eachValidData: function (callback) {
        if (this.collection && this.collection.models) {
            $.each(this.collection.models, function (index, model) {
                if (model.get("sfyx_st") != "UNVALID") {
                    callback.apply(this, arguments);
                }
            })
        }
    }
});
//创建动态列表面板view
var BaseTableView = Backbone.View.extend({
    tagName: 'div', //标签名
    className: '',   //主体样式
    tableElement: null,  //列表jq元素
    index: 0,    //序号迭代器
    mulChose: true,
    //获取表头部分方法
    getTheadHtml: function () {
        return null;
    },
    //获取实际新实体model方法
    getNewModel: function () {

    },
    //获取实际个体数据view方法
    getNewTrView: function (item, mode, index, parent) {

    },
    //获取控制区域html
    getControlHtml: function () {
        var controlstr = "<button class='addTrItem'>新增列表行</button>";
        return controlstr;
    },
    //事件
    events: {
        'click .addTrItem': 'addNewItem',
        'click .addTrLayerItem': 'openAddLayer',
        'click .deleteItems': 'deleteItems'
    },
    //主渲染方法
    render: function () {
        var view = this;
        this.index = 0;
        $(this.el).empty();          //element
        $(this.el).append(view.getControlHtml());  //渲染标题和控制区域
        var table = $('<table  cellpadding="0" cellspacing="0" border="0" class="list"></table>');
        $(table).append(view.getTheadHtml());
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
        view.modelRender()
    },
    //渲染model规则接口
    modelRender: function () {
        if (this.collection.models != null) {
            $.each(this.collection.models, function (index, model) {
                model.render();
            })
        }
    },
    //获取view的collection中的model字段集合，以逗号隔开
    getListPropertys: function (pro) {
        var ids = "";
        if (this.collection.models != null) {
            $.each(this.collection.models, function (key, value) {
                if (value.get("sfyx_st") != "UNVALID" && value.get(pro) != "") {
                    ids += value.get(pro) + ",";
                }
            });
        }
        if (ids.length > 0) {
            ids = ids.substr(0, ids.length - 1);
        }
        return ids;
    },
    //添加选择内容
    addSelItem: function (model) {
        var view = this;
        view.collection.push(model);
        view.index++;
        $(view.el).append(
            view.getNewTrView(model, 'renderEditMode', true, view.index).render().el
        );
        model.render();
    },
    //添加选择内容
    addSelModel: function (model) {
        var view = this;
        view.collection.push(model);
        view.index++;
    },
    //增加新的个体数据时，数据处理与页面渲染触发方法
    addNewItem: function () {
        var view = this;
        var addItem = this.getNewModel();
        addItem.set("sfyx_st", "VALID");
        view.collection.push(addItem);
        view.index++;
        $(view.el).children("table").append(
            view.getNewTrView(addItem, 'renderEditMode', true, view.index).render().el
        );
        addItem.render();
    },
    //批量删除方法
    deleteItems: function () {
        var view = this;
        var dels = new Array();
        _.map(this.collection.models, function (model, key) {
            model.updateModel();
            if (model.checked == true) {
                dels.push(model);
            }
        });
        if (dels.length > 0) {
            _top.layer.confirm("您确定要删除这些信息吗？", function (index) {
                $.each(dels, function (index, model) {
                    model.set("sfyx_st", "UNVALID");
                    model.checked = false;
                });
                view.render();
                _top.layer.close(index);
            });
        } else {
            _top.layer.alert("请勾选要删除的信息")
        }
    },
    eachValidData: function (callback) {
        if (this.collection && this.collection.models) {
            $.each(this.collection.models, function (index, model) {
                if (model.get("sfyx_st") != "UNVALID") {
                    callback.apply(this, arguments);
                }
            })
        }
    },
    //有效的数据长度
    vaildLength: function () {
        var length = 0;
        var view = this;
        if (view.collection && view.collection.models) {
            $.each(view.collection.models, function (index, model) {
                if (model.get("sfyx_st") != "UNVALID") {
                    length++;
                }
            })
        }
        return length;
    }
});
//
// //创建动态列表面板view
// var BaseTableView = Backbone.View.extend({
//     tagName: 'table', //标签名，列表主体暂固定为table
//     className: '',   //主体样式
//     tableElement: null,  //列表jq元素
//     index: 0,    //序号迭代器
//     mulChose: true,
//     //获取表头部分方法
//     getTheadHtml: function () {
//         return null;
//     },
//     //获取实际新实体model方法
//     getNewModel: function () {
//
//     },
//     //获取实际个体数据view方法
//     getNewTrView: function (item, mode, index, parent) {
//
//     },
//     //获取控制区域html
//     getControlHtml: function () {
//         var controlstr = "<button class='addTrItem'>新增列表行</button>";
//         return controlstr;
//     },
//     //事件
//     events: {
//         'click .addTrItem': 'addNewItem',
//         'click .addTrLayerItem': 'openAddLayer',
//         'click .deleteItems': 'deleteItems'
//     },
//     //主渲染方法
//     render: function () {
//         var view = this;
//         this.index = 0;
//         $(this.el).empty();
//         //渲染控制区域，放入table的caption中
//         var x = $(this.el)[0].createCaption();
//         x.innerHTML = this.getControlHtml();
//         //渲染table的thead部分
//         $(this.el).append(view.getTheadHtml());
//         //渲染collection
//         if (this.collection != null && this.collection.models != null) {
//             $.each(this.collection.models, function (key, model) {
//                 if (model.get("sfyx_st") != "UNVALID") {
//                     view.index++;
//                     var viewel = view.getNewTrView(model, 'renderEditMode', true, view.index, view).render().el;
//                     $(view.el).append(viewel);
//                 }
//             })
//         }
//         view.modelRender()
//     },
//     //渲染model规则接口
//     modelRender: function () {
//         if (this.collection.models != null) {
//             $.each(this.collection.models, function (index, model) {
//                 model.render();
//             })
//         }
//     },
//     //获取view的collection中的model字段集合，以逗号隔开
//     getListPropertys: function (pro) {
//         var ids = "";
//         if (this.collection.models != null) {
//             $.each(this.collection.models, function (key, value) {
//                 if (value.get("sfyx_st") != "UNVALID" && value.get(pro) != "") {
//                     ids += value.get(pro) + ",";
//                 }
//             });
//         }
//         if (ids.length > 0) {
//             ids = ids.substr(0, ids.length - 1);
//         }
//         return ids;
//     },
//     //添加选择内容
//     addSelItem: function (model) {
//         var view = this;
//         view.collection.push(model);
//         view.index++;
//         $(view.el).append(
//             view.getNewTrView(model, 'renderEditMode', true, view.index).render().el
//         );
//         model.render();
//     },
//     //添加选择内容
//     addSelModel: function (model) {
//         var view = this;
//         view.collection.push(model);
//         view.index++;
//     },
//     //增加新的个体数据时，数据处理与页面渲染触发方法
//     addNewItem: function () {
//         var view = this;
//         var addItem = this.getNewModel();
//         addItem.set("sfyx_st", "VALID");
//         view.collection.push(addItem);
//         view.index++;
//         $(this.el).append(
//             view.getNewTrView(addItem, 'renderEditMode', true, view.index).render().el
//         );
//         addItem.render();
//     },
//     //批量删除方法
//     deleteItems: function () {
//         var view = this;
//         var dels = new Array();
//         _.map(this.collection.models, function (model, key) {
//             model.updateModel();
//             if (model.checked == true) {
//                 dels.push(model);
//             }
//         });
//         if (dels.length > 0) {
//             _top.layer.confirm("您确定要删除这些信息吗？", function (index) {
//                 $.each(dels, function (index, model) {
//                     model.set("sfyx_st", "UNVALID");
//                     model.checked = false;
//                 });
//                 view.render();
//                 _top.layer.close(index);
//             });
//         } else {
//             _top.layer.alert("请勾选要删除的信息")
//         }
//     },
//     eachValidData: function (callback) {
//         if (this.collection && this.collection.models) {
//             $.each(this.collection.models, function (index, model) {
//                 if (model.get("sfyx_st") != "UNVALID") {
//                     callback.apply(this, arguments);
//                 }
//             })
//         }
//     },
//     //有效的数据长度
//     vaildLength: function(){
//         var length = 0;
//         var view = this;
//         if (view.collection && view.collection.models) {
//             $.each(view.collection.models, function (index, model) {
//                 if (model.get("sfyx_st") != "UNVALID") {
//                     length ++;
//                 }
//             })
//         }
//         return length;
//     }
// });

//创建动态子元素view
var BaseElementView = Backbone.View.extend({
    tagName: '',  //标签名，表单块个体创建为div,行个体创建为tr
    className: '',   //个体样式
    canCheck: false,
    index: 0,        //下标
    display: true,   //是否显示
    parentView: null,//父view记录
    //初始化方法，主要用来设置初始状态
    initialize: function (option) {
        if (option.renderCallback != undefined)
            this.renderCallback = option.renderCallback;
        if (option.canCheck)
            this.canCheck = option.canCheck;
        if (option.index != undefined)
            this.index = option.index;
        this.display = option.display;
        if (option.parentView != undefined && option.parentView != null)
            this.parentView = option.parentView;
    },
    //查看模式渲染方法
    renderViewMode: function () {
        //$(this.el).html("<td>" + this.model.get('kjmc') + "</td><td>" + "<button class='edit'>Edit</button><button class='delete'>Delete</button>" + "</td>");
    },
    //编辑模式渲染方法
    renderEditMode: function () {
        //$(this.el).html("<td><input class='kjmc' value='" + this.model.get('kjmc') + "'></td><td><button class='save'>Save</button><button class='cancel'>Cancel</button>" + "</td>");
    },
    renderCallback: 'renderEditMode', //渲染回调标志
    //渲染主方法
    render: function () {
        this[this.renderCallback]();
        return this;
    },
    //渲染model规则接口
    modelRender: function () {
        this.model.render();
    },
    //事件
    events: {
        'click': 'clickTr',
        'click .editEle': 'editElement',
        'click .delete': 'del',
        'click .checkbox': 'checkModel'
    },
    //点击事件
    clickTr: function () {
        var view = this;
        if (view.canCheck) {
            if (view.$el.hasClass("selectRow")) {
                view.$el.removeClass("selectRow");
                $("input[type='checkbox']", view.$el).prop("checked", false);
                view.model.checked = false;
            }
            else {
                if (view.parentView && !view.parentView.mulChose) {
                    view.parentView.$el.find(".selectRow").removeClass("selectRow");
                    if (view.parentView.collection) {
                        $.each(view.parentView.collection.models, function (index, model) {
                            model.checked = false;
                        })
                    }
                }
                view.$el.addClass("selectRow");
                $("input[type='checkbox']", view.$el).prop("checked", true);
                view.model.checked = true;
            }
        }
    },
    ////编辑事件相应方法
    //edit: function() {
    //    this.renderCallback = 'renderEditMode';
    //    this.render();
    //},
    ////保存事件相应方法
    //save: function() {
    //    if(this.model.saveVariable()) {
    //        for (var i = 0; i < this.model.get("Propertys").length; i++) {
    //            var value = $(this.el).find("*[data-model=" + this.model.get("ModelName") + "][data-property=" + this.model.get("Propertys")[i] + "]").val();
    //            if (value != undefined) {
    //                this.model.set(this.model.get("Propertys")[i], value);
    //            }
    //        }
    //        this.renderCallback = this.setRenderModeAfterSave();
    //        this.render();
    //    }
    //},
    //设置保存后的渲染模式接口
    setRenderModeAfterSave: function () {
        return "renderViewMode";
    },
    //取消编辑事件相应方法
    cancel: function () {
        this.renderCallback = 'renderViewMode';
        this.render();
    },
    //删除事件相应方法
    del: function () {
        var that = this;
        _top.layer.confirm("您确定要删除该条信息吗？", function (index) {
            that.model.set("sfyx_st", "UNVALID");
            that.remove();
            _top.layer.close(index);
        });
    },
    //勾选框选中事件相应方法
    checkModel: function () {
        var view = this;
        var checked = view.$el.find('.checkbox').attr("checked");
        if (checked == undefined || checked == false) {
            view.model.checked = false;
        } else {
            view.model.checked = true;
        }
    },
    editElement: function () {

    }
});


//创建动态check列表view
var BaseCheckListView = Backbone.View.extend({
    tagName: 'div', //标签名，暂固定为div
    className: '',   //个体样式
    index: 0,    //序号
    codePro: "",
    valuePro: "",
    //获取实际新实体model方法
    getNewModel: function () {

    },
    //获取实际个体数据view方法
    getNewElementView: function (item) {

    },
    //获取控制区域html
    getControlHtml: function () {
        var controlstr = "";
        return controlstr;
    },
    getViewDict: function () {
        return [{value: "测试1", code: "1"}, {value: "测试2", code: "2"}];
    },
    //事件
    events: {
        'click button.addFormItem': 'addNewItem',
        'click a.addFormItem': 'addNewItem',
        'click button.addEleLayerItem': 'openAddLayer',
        'click a.addEleLayerItem': 'openAddLayer',
        'click button.deleteFormItems': 'deleteItems',
        'click a.deleteFormItems': 'deleteItems'
    },
    //主渲染方法
    render: function () {
        var view = this;
        $(this.el).empty();
        $(this.el).append(this.getControlHtml());
        var dict = this.getViewDict();
        if (dict != null) {
            var dictEles = $("<div></div>");
            $.each(dict, function (index, value) {
                var inTag = false;
                if (view.collection.models != null) {
                    $.each(view.collection.models, function (key, model) {
                        if (model.get(view.codePro) == value.code) {
                            inTag = true;
                            model.set(view.valuePro, value.value);
                            $(dictEles).append(view.getNewElementView(model).render().el);
                        }
                    });
                }
                if (!inTag) {
                    var newModel = view.getNewModel();
                    newModel.set(view.codePro, value.code);
                    newModel.set(view.valuePro, value.value);
                    newModel.set("sfyx_st", "UNVALID");
                    view.collection.add(newModel);
                    $(dictEles).append(view.getNewElementView(newModel).render().el);
                }
            });
            $(this.el).append(dictEles);
        }
    }
});

//创建动态check列表view
var BaseCheckTableView = Backbone.View.extend({
    tagName: 'table', //标签名，暂固定为div
    className: '',   //个体样式
    index: 0,    //序号
    codePro: "",
    valuePro: "",
    //获取实际新实体model方法
    getNewModel: function () {

    },
    //获取实际个体数据view方法
    getNewElementView: function (item) {

    },
    getTheadHtml: function () {
        return null;
    },
    //获取控制区域html
    getControlHtml: function () {
        var controlstr = "";
        return controlstr;
    },
    getViewDict: function () {
        return [{value: "测试1", code: "1"}, {value: "测试2", code: "2"}];
    },
    //事件
    events: {
        'click button.addFormItem': 'addNewItem',
        'click a.addFormItem': 'addNewItem',
        'click button.addEleLayerItem': 'openAddLayer',
        'click a.addEleLayerItem': 'openAddLayer',
        'click button.deleteFormItems': 'deleteItems',
        'click a.deleteFormItems': 'deleteItems'
    },
    //主渲染方法
    render: function () {
        var view = this;
        this.index = 0;
        $(this.el).empty();
        //渲染控制区域，放入table的caption中
        var x = $(this.el)[0].createCaption();
        x.innerHTML = this.getControlHtml();
        //渲染table的thead部分
        $(this.el).append(view.getTheadHtml());
        var dict = this.getViewDict();
        if (dict != null) {
            $.each(dict, function (index, value) {
                var inTag = false;
                if (view.collection.models != null) {
                    $.each(view.collection.models, function (key, model) {
                        if (model.get(view.codePro) == value.code) {
                            inTag = true;
                            model.set(view.valuePro, value.value);
                            $(view.el).append(view.getNewElementView(model).render().el);
                        }
                    });
                }
                if (!inTag) {
                    var newModel = view.getNewModel();
                    newModel.set(view.codePro, value.code);
                    newModel.set(view.valuePro, value.value);
                    newModel.set("sfyx_st", "UNVALID");
                    view.collection.add(newModel);
                    $(view.el).append(view.getNewElementView(newModel).render().el);
                }
            });
        }
    }
});


//创建动态check元素view
var BaseCheckView = Backbone.View.extend({
    tagName: 'label',  //标签名，表单块个体创建为div,行个体创建为tr
    className: '',   //个体样式
    index: 0,        //下标
    //初始化方法，主要用来设置初始状态
    initialize: function (option) {
        if (option.index != undefined)
            this.index = option.index;
    },
    //渲染方法
    render: function () {
        return this;
    },
    //事件
    events: {
        'change .checkbox': 'changeClick',
        'click a.editEle': 'editElement',
        'click a.delete': 'del'
    },
    //点击事件
    changeClick: function () {
        var view = this;
        var checked = view.$el.find('.checkbox').attr("checked");
        if (checked == undefined || checked == false) {
            view.model.set("sfyx_st", "UNVALID");
        } else {
            view.model.set("sfyx_st", "VALID");
        }
    }
});

//警保个性动态view
var BaseJbTableView = Backbone.View.extend({
    tagName: 'table', //标签名，列表主体暂固定为table
    className: '',   //主体样式
    tableElement: null,  //列表jq元素
    index: 0,    //序号迭代器
    mulChose: true,
    initNum: 0,    //必须有的行数
    finalHtmlClass: 'finalHtml',
    //获取表头部分方法
    getTheadHtml: function () {
        return null;
    },
    //获取实际新实体model方法
    getNewModel: function () {

    },
    //获取实际个体数据view方法
    getNewTrView: function (item, mode, index, parent) {

    },
    //最后一行
    getFinalHtml: function () {

    },
    //事件
    events: {
        'click .addTrItem': 'addNewItem',
        'click .deleteItems': 'deleteItems'
    },
    //主渲染方法
    render: function () {
        var view = this;
        this.index = 0;
        $(this.el).empty();
        //渲染table的thead部分
        $(this.el).append(view.getTheadHtml());
        var collectModels = this.collection.models;
        var modelsLength = 0;
        for (var i = 0, maxLength = collectModels.length; i < maxLength; i++) {
            if (collectModels[i].get("sfyx_st") != "UNVALID") {
                modelsLength++;
            }
        }

        if (modelsLength < view.initNum) {
            for (var i = 0, maxLength = view.initNum - modelsLength; i < maxLength; i++) {
                var addItem = this.getNewModel();
                view.collection.push(addItem);
            }
        }
        //渲染collection
        if (this.collection != null && this.collection.models != null) {
            $.each(this.collection.models, function (key, model) {
                if (model.get("sfyx_st") != "UNVALID") {
                    view.index++;
                    var viewel = view.getNewTrView(model, 'renderEditMode', true, view.index, view).render().el;
                    $(view.el).append(viewel);
                }
            })
        }
        $(this.el).append(view.getFinalHtml);
        view.modelRender();
    },
    //渲染model规则接口
    modelRender: function () {
        if (this.collection.models != null) {
            $.each(this.collection.models, function (index, model) {
                model.render();
            })
        }
    },
    //获取view的collection中的model字段集合，以逗号隔开
    getListPropertys: function (pro) {
        var ids = "";
        if (this.collection.models != null) {
            $.each(this.collection.models, function (key, value) {
                ids += value.get(pro) + ",";
            });
        }
        if (ids.length > 0) {
            ids = ids.substr(0, ids.length - 1);
        }
        return ids;
    },
    //添加选择内容
    addSelItem: function (model) {
        var view = this;
        view.collection.push(model);
        view.index++;
        $(view.el).append(
            view.getNewTrView(model, 'renderEditMode', true, view.index).render().el
        );
        model.render();
    },
    //添加选择内容
    addSelModel: function (model) {
        var view = this;
        view.collection.push(model);
        view.index++;
    },
    //增加新的个体数据时，数据处理与页面渲染触发方法
    addNewItem: function () {
        var view = this;
        var addItem = this.getNewModel();
        addItem.set("sfyx_st", "VALID");
        view.collection.push(addItem);
        view.index++;
        if (view.getFinalHtml()) {
            $(this.el).find("." + view.finalHtmlClass).before(view.getNewTrView(addItem, 'renderEditMode', true, view.index).render().el);
        } else {
            $(this.el).append(
                view.getNewTrView(addItem, 'renderEditMode', true, view.index).render().el
            );
        }
        addItem.render();
        var count = 0;
        for (var i = 0; i < view.collection.models.length; i++) {
            if (view.collection.models[i].get("sfyx_st") == "VALID") {
                count++;
            }
        }
        if (count > view.initNum) {
            $(this.el).find("img[class='deleteItems']").attr("src", "/medias/images//en_minus.png")
                .unbind("click");
        } else {
            $(this.el).find("img[class='deleteItems']").attr("src", "/medias/images/jwbzxt/minus.png")
                .bind("click", function () {
                    return false;
                });
        }
    },
    //删除回调函数
    delCallback: function (viewCollection) {
        return null;
    },
    //批量删除方法
    deleteItems: function () {
        var view = this;
        var dels = [];
        _.map(this.collection.models, function (model, key) {
            model.updateModel();
            if (model.checked == true) {
                dels.push(model);
            }
        });
        var delLength = dels.length;
        if (delLength > 0) {
            var alertStr = "您确定要删除这些信息吗";
            if (delLength == 1) {
                alertStr = "您确定要删除这条信息吗";
            }
            layer.confirm(alertStr, function (index) {
                $.each(dels, function (index, model) {
                    model.set("sfyx_st", "UNVALID");
                    model.checked = false;
                });
                view.delCallback(view.collection);
                view.render();
                //删除回调函数
                layer.close(index);
            });
        } else {
            layer.alert("请勾选要删除的信息");
        }
    },
    eachValidData: function (callback) {
        if (this.collection && this.collection.models) {
            $.each(this.collection.models, function (index, model) {
                callback.apply(this, arguments);
            })
        }
    },
    checkHasData: function (num) {
        num = num || 1;
        var validNum = 0;
        if (this.collection && this.collection.models) {
            var tlength = this.collection.models.length,
                model = null,
                unvalidModels = [];
            for (var i = 0; i < tlength; i++) {
                model = this.collection.models[i];
                if (model.get("sfyx_st") != "UNVALID" && !model.get("_notSaveTag")) {
                    validNum++;
                    if (validNum >= num) {
                        return true;
                    }
                } else {
                    unvalidModels.push(model);
                }
            }
        }
        if (validNum >= num) {
            return true;
        } else {
            for (var i = 0; i < num - validNum; i++) {
                if (unvalidModels[i]) {
                    $("*[data-model=" + unvalidModels[i].get("ModelName") + "][data-property]").each(
                        function (i, t) {
                            if (!$(t).is(":hidden") && !modelNotNull(t)) {
                                return false;
                            }
                        }
                    );
                } else {
                    break;
                }
            }
            return false;
        }
    }
});

var BaseAutoElementView = Backbone.View.extend({
    tagName: '',  //标签名，表单块个体创建为div,行个体创建为tr
    className: '',   //个体样式
    canCheck: false,
    checkBox: false,
    index: 0,        //下标
    display: true,   //是否显示
    parentView: null,//父view记录
    columns: [],
    //初始化方法，主要用来设置初始状态
    initialize: function (option) {
        if (option.renderCallback != undefined)
            this.renderCallback = option.renderCallback;
        if (option.canCheck)
            this.canCheck = option.canCheck;
        if (option.index != undefined)
            this.index = option.index;
        this.display = option.display;
        if (option.parentView != undefined && option.parentView != null)
            this.parentView = option.parentView;
    },
    //查看模式渲染方法
    renderViewMode: function () {
        //$(this.el).html("<td>" + this.model.get('kjmc') + "</td><td>" + "<button class='edit'>Edit</button><button class='delete'>Delete</button>" + "</td>");
    },
    //编辑模式渲染方法
    renderEditMode: function () {
        var view = this;
        var html = "";
        //默认第一行列为序号
        if (view.checkBox) {
            html += "<td style='text-align:center'><input type='checkbox' class='checkbox'>" + this.index + "</td>";
        } else {
            html += "<td style='text-align:center'>" + this.index + "</td>";
        }
        if (view.columns[0] instanceof Array) {
            $.each(view.columns, function (key, value) {
                $.each(value, function (i, t) {
                    var alignPos = t.align;
                    if (t.render) {
                        //待修改
                        html += "<td style='text-align:" + alignPos + "'>" + t.render(view.model) + "</td>";
                    } else {
                        if (t.id) {
                            var modelConfig = view.model.initJson[view.model.className][t.id];
                            if (modelConfig.type == "dict") {
                                //checkBox radio null 3中情况  checkType 字典项控件类型，可为“checkbox”、“radio”，null则为默认下拉字典项。
                                html += "<td><select class='i_select' data-model='" + view.model.get("ModelName") + "' data-property='" + t.id + "'></select></td>";
                            } else {
                                html += "<td style='text-align:" + alignPos + "'><input class='i_text' data-property='" + t.id + "' data-model='" + view.model.get("ModelName") + "'></td>";
                            }
                        }
                    }
                });
            });
        } else {
            $.each(view.columns, function (key, value) {
                    var alignPos = value.align;
                    if (typeof value.renderer == "function") {
                        var valueDiy = value.renderer(view.model, view.model.get(value.id));
                        html += "<td style='text-align:" + alignPos + "' title='" + valueDiy + "'>" + valueDiy + "</td>";
                    } else {
                        if (value.id) {
                            var modelConfig = view.model.initJson[view.model.className][value.id];
                            if (modelConfig.type == "dict") {
                                if (modelConfig.dictConfig.checkType) {
                                    html += "<td><div data-model='" + view.model.get("ModelName") + "' data-property='" + value.id + "'></div></td>";
                                } else {
                                    html += "<td><select class='i_select' data-model='" + view.model.get("ModelName") + "' data-property='" + value.id + "'></select></td>";
                                }
                            } else if (modelConfig.type == "date") {
                                html += "<td style='text-align:" + alignPos + "'><input class='Textdate'  data-property='" + value.id + "' data-model='" + view.model.get("ModelName") + "'></td>";
                            } else {
                                html += "<td style='text-align:" + alignPos + "'><input class='i_text'  data-property='" + value.id + "' data-model='" + view.model.get("ModelName") + "'></td>";
                            }
                        }
                    }
                }
            );
        }
        $(this.el).html(html);
    },
    renderCallback: 'renderEditMode', //渲染回调标志
    //渲染主方法
    render: function () {
        this[this.renderCallback]();
        return this;
    },
    //渲染model规则接口
    modelRender: function () {
        this.model.render();
    },
    //事件
    events: {
        'click': 'clickTr',
        'click .editEle': 'editElement',
        'click .delete': 'del',
        'click .checkbox': 'checkModel'
    },
    //点击事件
    clickTr: function () {
        var view = this;
        if (view.canCheck) {
            if (view.$el.hasClass("selectRow")) {
                view.$el.removeClass("selectRow");
                $("input[type='checkbox']", view.$el).prop("checked", false);
                view.model.checked = false;
            }
            else {
                if (view.parentView && !view.parentView.mulChose) {
                    view.parentView.$el.find(".selectRow").removeClass("selectRow");
                    if (view.parentView.collection) {
                        $.each(view.parentView.collection.models, function (index, model) {
                            model.checked = false;
                        })
                    }
                }
                view.$el.addClass("selectRow");
                $("input[type='checkbox']", view.$el).prop("checked", true);
                view.model.checked = true;
            }
        }
    },
    //设置保存后的渲染模式接口
    setRenderModeAfterSave: function () {
        return "renderViewMode";
    },
    //取消编辑事件相应方法
    cancel: function () {
        this.renderCallback = 'renderViewMode';
        this.render();
    },
    //删除事件相应方法
    del: function () {
        var that = this;
        _top.layer.confirm("您确定要删除该条信息吗？", function (index) {
            that.model.set("sfyx_st", "UNVALID");
            that.remove();
            _top.layer.close(index);
        });
    },
    //勾选框选中事件相应方法
    checkModel: function () {
        var view = this;
        var checked = view.$el.find('.checkbox').attr("checked");
        if (checked == undefined || checked == false) {
            view.model.checked = false;
        } else {
            view.model.checked = true;
        }
    },
    editElement: function () {

    }
});

//创建动态列表面板view
var BaseAutoTableView = Backbone.View.extend({
    tagName: 'table', //标签名，列表主体暂固定为table
    className: '',   //主体样式
    tableElement: null,  //列表jq元素
    index: 0,    //序号迭代器
    mulChose: true,
    canCheck: true,
    columns: [],
    newModel: null,
    eventConfig: [{title: "增加", type: "add"}, {title: "删除", type: "del"}],
    controlHrml: "",
    type: '',  //新增xz 查看 ck 修改 xg
    checkBox: false,    // checkbox选择，还是改变颜色
    viewTitle: '',
    finalClass: 'finalHtml',
    isRequire: false,   //是否必填
    initialize: function () {
        var view = this;
        var controlHrml = "<div class='page_title'>";
        if (view.viewTitle) {
            controlHrml += "<h1>" + this.viewTitle + ":</h1>";
        }
        if (view.type != "ck") {
            var eventsConfig = this.eventConfig;
            if (eventsConfig) {
                function addEventFunc(index, setting) {
                    view["addLayer" + index] = function () {
                        openStack(window, setting.title, setting.size,
                            setting.url + "func=" + setting.callbackFunc, setting.data);
                    }
                }

                controlHrml += "<ul class='action_button' style='float: right;margin: 0 5px 0 0;'>";
                for (var i = 0, maxLength = eventsConfig.length; i < maxLength; i++) {
                    if (eventsConfig[i].type == "add") {
                        controlHrml += "<li><a class='addTrItem'>" + eventsConfig[i].title + "</a></li>";
                    } else if (eventsConfig[i].type == "addLayer") {
                        controlHrml += "<li><a class='addLayer" + i + "'>" + eventsConfig[i].title + "</a></li>";
                        view.events["click .addLayer" + i] = "addLayer" + i;
                        addEventFunc(i, eventsConfig[i].addLayerConfig);
                    } else if (eventsConfig[i].type == "del") {
                        controlHrml += "<li><a class='deleteItems'>" + eventsConfig[i].title + "</a></li>";
                    } else if (eventsConfig[i].type == "diy") {
                        controlHrml += "<li><a class='diy" + i + "'>" + eventsConfig[i].title + "</a></li>";
                        view.events["click .diy" + i] = "diy" + i;
                        view["diy" + i] = eventsConfig[i].diyConfig.diyFunc;
                    }
                }
                controlHrml += "</ul>";
            }
        } else {
            view.checkBox = false;
        }
        controlHrml += "</div>";
        view.controlHrml = controlHrml;
    },
    //获取表头部分方法
    getTheadHtml: function () {
        var view = this;
        var diyTheads = view.getDiyColumHtml();
        var theads = "";
        if (diyTheads) {
            theads = diyTheads;
        } else {
            var colunms = this.columns;
            if (colunms[0] instanceof Array) {
                for (var i = 0, maxLength = colunms.length; i < maxLength; i++) {
                    var columnsTr = colunms[i];
                    theads += "<tr>";
                    for (var j = 0; j < columnsTr.length; j++) {
                        var colpan = columnsTr[j].colspan;
                        if (!colpan) {
                            colpan = 1;
                        }
                        var rowspan = columnsTr[j].rowspan;
                        if (!rowspan) {
                            rowspan = 1;
                        }
                        theads += "<th style='width: " + columnsTr[j].width + "%' rowspan='" + rowspan + "' colspan='" + colpan + "'>";
                        if (columnsTr[j].isRequire) {
                            theads += "<b>*</b>";
                        }
                        if (typeof columnsTr[j].title == "function") {
                            theads += columnsTr[j].title();
                        } else {
                            theads += columnsTr[j].title;
                        }
                        theads += "</th>";
                    }
                    theads += "</tr>";
                }
            } else if (colunms[0] instanceof Object) {
                theads += "<tr>";
                theads += "<th style='width: 50px;'>序号</th>";
                for (var i = 0, maxLength = view.columns.length; i < maxLength; i++) {
                    theads += "<th style='width: " + view.columns[i].width + "%'>";
                    if (view.columns[i].isRequire) {
                        theads += "<b>*</b>";
                    }
                    theads += view.columns[i].title + "</th>";
                }
                theads += "</tr>";
            }
        }
        return theads;
    },
    //获取实际新实体model方法
    getNewModel: function () {
        return new this.newModel()
    },
    //获取实际个体数据view方法
    getNewTrView: function (item, mode, display, index, parent) {
        var view = this;
        if (view.checkBox) {
            view.canCheck = false;
        }
        var autoElementView = BaseAutoElementView.extend({
            tagName: 'tr',
            className: 'rx-grid-tr',
            columns: view.columns,
            canCheck: view.canCheck,
            checkBox: view.checkBox
        });
        return new autoElementView({
            model: item,
            renderCallback: mode,
            display: display,
            index: index,
            parentView: parent
        });
    },
    //获取控制区域html
    getControlHtml: function () {
        return this.controlHrml;
    },
    //事件
    events: {
        'click .addTrItem': 'addNewItem',
        'click .addTrLayerItem': 'openAddLayer',
        'click .deleteItems': 'deleteItems'
    },
    //主渲染方法
    render: function () {
        var view = this;
        this.index = 0;
        $(this.el).empty();
        //渲染控制区域，放入table的caption中
        var x = $(this.el)[0].createCaption();
        x.innerHTML = this.getControlHtml();
        //渲染table的thead部分
        $(this.el).append(view.getTheadHtml());
        //渲染collection
        if (this.collection != null && this.collection.models != null) {
            $.each(this.collection.models, function (key, model) {
                if (model.get("sfyx_st") != "UNVALID") {
                    view.index++;
                    var viewel = view.getNewTrView(model, 'renderEditMode', true, view.index, view).render().el;
                    $(view.el).append(viewel);
                }
            })
        }
        $(view.el).append(view.getFinalHtml());
        view.modelRender()
    },
    //渲染model规则接口
    modelRender: function () {
        if (this.collection.models != null) {
            $.each(this.collection.models, function (index, model) {
                model.render();
            })
        }
    },
    //获取view的collection中的model字段集合，以逗号隔开
    getListPropertys: function (pro) {
        var ids = "";
        if (this.collection.models != null) {
            $.each(this.collection.models, function (key, value) {
                if (value.get("sfyx_st") != "UNVALID" && value.get(pro) != "") {
                    ids += value.get(pro) + ",";
                }
            });
        }
        if (ids.length > 0) {
            ids = ids.substr(0, ids.length - 1);
        }
        return ids;
    },
    //添加选择内容
    addSelItem: function (model) {
        var view = this;
        view.collection.push(model);
        view.index++;
        var finalHtml = view.getFinalHtml();
        if (finalHtml) {
            $(this.el).find("." + view.finalClass).before(view.getNewTrView(model, 'renderEditMode', true, view.index).render().el);
        } else {
            $(this.el).append(
                view.getNewTrView(model, 'renderEditMode', true, view.index).render().el
            );
        }
        model.render();
    },
    //添加选择内容
    addSelModel: function (model) {
        var view = this;
        view.collection.push(model);
        view.index++;
    },
    //增加新的个体数据时，数据处理与页面渲染触发方法
    addNewItem: function () {
        var view = this;
        var addItem = this.getNewModel();
        addItem.set("sfyx_st", "VALID");
        view.collection.push(addItem);
        view.index++;
        var finalHtml = view.getFinalHtml();
        if (finalHtml) {
            $(this.el).find("." + view.finalClass).before(view.getNewTrView(addItem, 'renderEditMode', true, view.index).render().el);
        } else {
            $(this.el).append(
                view.getNewTrView(addItem, 'renderEditMode', true, view.index).render().el
            );
        }
        addItem.render();
    },
    //批量删除方法
    deleteItems: function () {
        var view = this;
        var dels = [];
        _.map(this.collection.models, function (model, key) {
            model.updateModel();
            if (model.checked == true) {
                dels.push(model);
            }
        });
        if (dels.length > 0) {
            _top.layer.confirm("您确定要删除这些信息吗？", function (index) {
                $.each(dels, function (index, model) {
                    model.set("sfyx_st", "UNVALID");
                    model.checked = false;
                });
                view.render();
                _top.layer.close(index);
            });
        } else {
            layer.alert("请勾选要删除的信息")
        }
    },
    eachValidData: function (callback) {
        if (this.collection && this.collection.models) {
            $.each(this.collection.models, function (index, model) {
                if (model.get("sfyx_st") != "UNVALID") {
                    callback.apply(this, arguments);
                }
            })
        }
    },
    //获取选中的数据,可以将canCheck配置在这里
    getSelectDate: function () {
        var view = this;
        var selectDate = [];
        $.each(view.collection.models, function (index, model) {
            model.updateModel();
            if (model.checked == true) {
                selectDate.push(model);
            }
        });
        return selectDate;
    },
    getFinalHtml: function () {

    },
    //自定义表头
    getDiyColumHtml: function () {

    }
});



