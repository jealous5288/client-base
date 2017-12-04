/*****************************************************************
 * 重构表单detailModel
 * 最后更新时间：2016-08-26
 * 最后更新人：zhan
 *****************************************************************/

//model标记，作为动态model的下标迭代器
var modelIndex = 0;

//创建detailModel类
var DetailModel = Backbone.RelationalModel.extend({
    className: "",   //需赋值：model类名，是model类型的唯一标识
    initJson: "",    //需赋值：配置json
    strictMode: false,    //严格模式，不识别大小写
    stateJson: "",      //需赋值：状态json
    dictJson: null,     //字典项合并json
    checked: false,    //model关联元素是否被选中，作为状态位控制
    idAttribute: "ModelName",    //主键声明
    edit: null,          //建委专用标志
    lookflg: null,           //建委专用标志
    sourseData: null,        //源数据
    historyDataMode: "none",     //数据历史模式：none、不使用；save、仅保存；saveRender、保存并渲染历史
    MR: MR(),        //模型渲染器组件实例
    /*****************************************************************
     *  方法：内部方法，backbone.model自带的初始化构造器
     *****************************************************************/
    initialize: function (data) {
        this.sourseData = data;
        this.initRelations();
        this.initPropertys();
        if (this.get("ModelName") == null || this.get("ModelName") == "") {
            this.setModelName();
        }
        var edit = GetQueryString("edit");
        if (edit != null) {
            this.edit = edit;
        }
        var lookflg = GetQueryString("lookflg");
        if (lookflg != null) {
            this.lookflg = lookflg;
        }
        this.beforeRender();
    },
    /*****************************************************************
     *  方法：需实现接口，设置model名称
     *****************************************************************/
    setModelName: function () {
        this.set("ModelName", this.className);
    },
    /*****************************************************************
     *  方法：需实现接口，渲染前置，一般用来控制区域显示
     *****************************************************************/
    beforeRender: function () {

    },
    /*****************************************************************
     *  方法：内部方法，依据配置初始化属性参数
     *****************************************************************/
    initPropertys: function () {
        var model = this;
        model.idAttribute = "ModelName";
        var json = this.initJson;
        //传入参数为基础配置json
        $.each(json, function (key, value) {
            if (key == model.className) {
                $.each(value, function (key2, value2) {
                    if (!value2.has_json_checked) {
                        model.MR.checkPropertyJson(value2, model);
                        value2.has_json_checked = true;
                    }
                    if (model.strictMode) {
                        var mdata = model.get(key2);
                        if (!mdata) {
                            if (mdata === 0) {
                                model.set(key2, '0');
                            } else {
                                model.set(key2, value2.defaultValue || '');
                            }
                        }
                    } else {
                        if (model.get(key2.toUpperCase())) {
                            if (key2.toUpperCase() != key2) {
                                model.set(key2, model.get(key2.toUpperCase()));
                                model.unset(key2.toUpperCase());
                            }
                        } else if (model.get(key2.toLowerCase())) {
                            if (key2.toLowerCase() != key2) {
                                model.set(key2, model.get(key2.toLowerCase()));
                                model.unset(key2.toLowerCase());
                            }
                        } else if (!model.get(key2)) {
                            if (typeof(model.get(key2)) == "undefined" || model.get(key2) === null) {
                                model.set(key2, '');
                            } else if (model.get(key2) === 0) {
                                model.set(key2, '0');
                            }
                        }

                        //对model属性默认值赋值
                        if (model.get(key2).toString() == "") {
                            if (value2.defaultValue) {
                                model.set(key2, value2.defaultValue);
                            }
                        }
                    }
                });
            }
        });
    },
    /*****************************************************************
     *  方法：内部方法，依据配置初始化关系数据
     *****************************************************************/
    initRelations: function () {
        var model = this;
        var relations = model.relations;
        if (relations.length > 0) {
            for (var n = 0; n < relations.length; n++) {
                var tempkey = relations[n].key.toString();
                if (relations[n].type == Backbone.HasMany) {
                    if (model.get(tempkey) == null) {
                        model.set(tempkey, new relations[n].collectionType());
                    }
                    // if(relations[n].hasFirstData && (model.get(tempkey).models == null || model.get(tempkey).models.length == 0)){
                    //     model.get(tempkey).add(new relations[n].relatedModel());
                    // }
                    if (relations[n].initNum) {
                        var tlength = model.get(tempkey).models ? model.get(tempkey).models.length : 0;
                        for (var i = 0; i < relations[n].initNum - tlength; i++) {
                            model.get(tempkey).add(new relations[n].relatedModel());
                        }
                    }
                } else if (relations[n].type == Backbone.HasOne) {
                    if (model.get(tempkey) == null) {
                        model.set(tempkey, new relations[n].relatedModel());
                    }
                }
            }
        }
    },
    /*****************************************************************
     *  方法：内部接口，递归获取模型的json
     *  属性：relationTag 是否关联model的标志
     *        showAll 显示全部字段
     *        model 递归用变量，无需赋值
     *****************************************************************/
    getModelJson: function (getSelfTag, showAll, model) {
        //若为新增数据，且数据无效，则不上报
        if (isNotNullStr(model.get("sfyx_st")) && model.get("sfyx_st") == "UNVALID") {
            if ($.trim(model.get("id")) == "" || $.trim(model.get("id")) == "null") {
                return "";
            }
        }
        if (model.get("_notSaveTag")) {
            if ($.trim(model.get("id")) == "" || $.trim(model.get("id")) == "null") {
                return "";
            } else {
                model.setValue("sfyx_st", "UNVALID");
            }
        }
        var jsonstr = "{";
        var initJson = model.initJson;
        var json2 = initJson[model.className];
        $.each(json2, function (property, json) {
            if (json.ifForm || showAll) {
                var value = model.get(property);
                value = value ? value.toString() : "";
                value = replaceStrChar(value.replace(/\\/g, "\\\\"), "\"", "\\\"");
                jsonstr += '"' + property + '":"' + value + '",';
            }
        });
        //若处理关联项，则递归本函数
        if (!getSelfTag) {
            var relations = model.relations;
            //alert(relations[0].type == Backbone.HasMany);
            if (relations.length > 0) {
                for (var n = 0; n < relations.length; n++) {
                    var tempkey = relations[n].key.toString();
                    if (relations[n].type == Backbone.HasMany) {
                        if (model.get(tempkey).length > 0) {
                            var itemsstr = "";
                            for (var i = 0; i < model.get(tempkey).length; i++) {
                                itemsstr += this.getModelJson(getSelfTag, showAll, model.get(tempkey).at(i));
                            }
                            if (itemsstr.length > 1) {
                                itemsstr = itemsstr.substr(0, itemsstr.length - 1);
                                jsonstr += "\"" + tempkey + "\":[" + itemsstr + "],";
                            } else {
                                jsonstr += "\"" + tempkey + "\":[],";
                            }
                        } else {
                            jsonstr += "\"" + tempkey + "\":[],";
                        }
                    } else if (relations[n].type == Backbone.HasOne) {
                        if (model.get(tempkey) != null) {
                            jsonstr += "\"" + tempkey + "\":" + this.getModelJson(getSelfTag, showAll, model.get(tempkey));
                        } else {
                            jsonstr += "\"" + tempkey + "\":{},";
                        }
                    }
                }
            }
        }
        if (jsonstr.length > 1) {
            jsonstr = jsonstr.substr(0, jsonstr.length - 1);
        }
        jsonstr += "},";
        return jsonstr;
    },
    /*************************************************
     *  方法：外部接口，获取model转换后json
     *  属性：getSelfTag 是否值返回自己的非关联的json
     ************************************************/
    getJson: function (getSelfTag, notNeedUpdateTag) {
        if (!getSelfTag) {
            getSelfTag = false;
        }
        var model = this;
        //如需更新数据，调用同步dom模型数据接口
        if (!notNeedUpdateTag) {
            model.updateModel();
        }
        var jsonstr = "";
        jsonstr += model.getModelJson(getSelfTag, false, model);
        if (jsonstr.length > 1) {
            jsonstr = jsonstr.substr(0, jsonstr.length - 1);
        }
        jsonstr = model.editGetJson(jsonstr);
        return jsonstr;
    },
    /*************************************************
     *  方法：可实现接口：编辑getJson返回json值
     *  属性：json 传入的model生成的json值
     *  返回值：个性处理后的json值
     ************************************************/
    editGetJson: function (json) {
        return json;
    },
    /*************************************************
     *  方法：外部接口，获取所有字段的json值，不受ifForm影响
     *  属性：getSelfTag 是否值返回自己的非关联的json
     ************************************************/
    getAllJson: function (getSelfTag) {
        if (!getSelfTag) {
            getSelfTag = false;
        }
        var model = this;
        //先更新model数据
        model.updateModel();
        var jsonstr = "";
        jsonstr += model.getModelJson(getSelfTag, true, model);
        if (jsonstr.length > 1) {
            jsonstr = jsonstr.substr(0, jsonstr.length - 1);
        }
        jsonstr = model.editGetJson(jsonstr);
        return jsonstr;
    },
    /*************************************************
     *  方法：外部接口，设置model字段值
     *  属性：property 需设置的字段名
     *  value 需设置的目标值
     *  ifSetDomTag 是否同时设置表单dom元素值，默认为true
     ************************************************/
    setValue: function (property, value, ifSetDomTag) {
        if (!ifSetDomTag) {
            ifSetDomTag = true;
        }
        var model = this;
        this.MR.setValue(property, value, ifSetDomTag, model);
    },
    /*****************************************************************
     *  方法：内部接口，用于渲染字段状态
     *  属性：classJson 传入stateJson属于model类的部分；
     *        model 递归用变量，无需赋值
     *  返回值：状态与历史状态不同的字段集合（用于rerender时局部重渲染）
     *****************************************************************/
    renderState: function (classJson, model) {
        var changedPros = [];
        var initJson = model.initJson;
        if (classJson && classJson.state) {
            if (typeof(classJson.state.disable) != "undefined") {  //禁止模式状态配置
                $("*[data-model=" + model.get("ModelName") + "][data-property]").each(function (i, t) {

                    var pro = $(t).attr("data-property");
                    if (initJson[model.className][pro] == undefined) {
                        if (window.console && window.console.log) {
                            console.log(model.get("ModelName") + "的" + pro + "属性配置不存在");
                        }
                    }
                    if ($.inArray(pro, classJson.state.disable) == -1) {
                        if (initJson[model.className][pro].disabled == true) {
                            if (!$(t).hasClass("disabled")) {
                                changedPros.push(pro);
                            }
                            $(t).attr("disabled", "disabled");
                            $(t).addClass("disabled");
                        } else {
                            if ($(t).hasClass("disabled")) {
                                changedPros.push(pro);
                                $(t).removeClass("disabled");
                            }
                            $(t).attr("disabled", false);
                        }
                    } else {
                        if (!$(t).hasClass("disabled")) {
                            changedPros.push(pro);
                        }
                        $(t).attr("disabled", "disabled");
                        $(t).addClass("disabled");
                    }
                });
            } else if (typeof(classJson.state.enable) != "undefined") {   //工作模式状态配置
                $("*[data-model=" + model.get("ModelName") + "][data-property]").each(function (i, t) {
                    var pro = $(t).attr("data-property");
                    if (initJson[model.className][pro] == undefined) {
                        if (window.console && window.console.log) {
                            console.log(model.get("ModelName") + "的" + pro + "属性配置不存在");
                        }
                    }
                    if ($.inArray(pro, classJson.state.enable) == -1) {
                        if (!$(t).hasClass("disabled")) {
                            changedPros.push(pro);
                        }
                        $(t).attr("disabled", "disabled");
                        $(t).addClass("disabled");
                    } else {
                        if (initJson[model.className][pro].disabled == true) {
                            if (!$(t).hasClass("disabled")) {
                                changedPros.push(pro);
                            }
                            $(t).attr("disabled", "disabled");
                            $(t).addClass("disabled");
                        } else {
                            if ($(t).hasClass("disabled")) {
                                changedPros.push(pro);
                                $(t).removeClass("disabled");
                            }
                            $(t).attr("disabled", false);
                        }
                    }
                })
            }
        }
        return changedPros;
    },
    /*****************************************************************
     *  方法：对外接口，进行初次渲染
     *  属性：stateJson 状态参数，若传入，则覆盖model本身的stateJson；
     *        renderSelfTag 仅渲染自身标志，默认为false
     *        model 递归用变量，无需赋值
     *****************************************************************/
    render: function (stateJson, renderSelfTag, model) {
        //参数初始值处理
        if (!this.stateJson) {
            this.stateJson = {};
        }
        if (typeof(stateJson) == "boolean") {
            renderSelfTag = stateJson;
            stateJson = this.stateJson;
        } else if (!stateJson) {
            stateJson = this.stateJson;
        } else {//若为传入stateJson，则用传入stateJson覆盖原有stateJson。
            this.stateJson = stateJson;
        }
        if (!renderSelfTag) {
            renderSelfTag = false;
        }
        if (!model) {
            model = this;
        }
        var initJson = model.initJson;
        var classJson = stateJson[model.className];
        if (!classJson) {
            classJson = {};
            stateJson[model.className] = {};
        }
        if (!classJson.state) {//若未配置class的状态，则默认全部enable
            classJson.state = {disable: []};
            stateJson[model.className].state = {disable: []};
        }
        //处理字段配置变更的部分
        if (classJson.property) {
            //遍历字段
            for (key in classJson.property) {
                var proInitJson = model.initJson[model.className][key];
                var proClassJson = classJson.property[key];
                //遍历字段属性
                for (key2 in proClassJson) {
                    //如属性是type
                    if (key2 == "type") {
                        var newConfigName = proClassJson.type + "Config";
                        //先比对type是否变化，若变化，则将原有Config删除，type和Config替换成新配置内容
                        if (proInitJson.type != proClassJson.type) {
                            var oldConfigName = proInitJson.type + "Config";
                            if (proInitJson[oldConfigName]) {
                                delete proInitJson[oldConfigName];
                            }
                            if (proClassJson[newConfigName]) {
                                proInitJson[newConfigName] = proClassJson[newConfigName];
                            }
                            proInitJson.type = proClassJson.type;
                        } else { //若type未变化，则比对Config内部属性，将变化字段更换
                            if (proClassJson[newConfigName]) {
                                for (configKey in proClassJson[newConfigName]) {
                                    proInitJson[newConfigName][configKey] = proClassJson[newConfigName][configKey];
                                }
                            }
                        }
                    } else if (key2.indexOf("Config") > 0) { //如属性是Config
                        if (!proClassJson.type) {//如未配置type属性，等同于type未变化，则比对Config内部属性，将变化字段更换
                            if (proClassJson[key2]) {
                                for (configKey in proClassJson[key2]) {
                                    proInitJson[key2][configKey] = proClassJson[key2][configKey];
                                }
                            }
                        }
                    } else {//基础属性，直接更换
                        proInitJson[key2] = proClassJson[key2];
                    }
                }
                model.initJson[model.className][key] = proInitJson;
            }
        }
        model.renderState(classJson, model);

        $("*[data-model=" + model.get("ModelName") + "][data-property]").each(function (i, t) {
            model.MR.renderProperty(t, model);
        });

        //若处理关联项，则递归本函数
        if (!renderSelfTag) {
            var relations = model.relations;
            //alert(relations[0].type == Backbone.HasMany);
            if (relations.length > 0) {
                for (var n = 0; n < relations.length; n++) {
                    var tempkey = relations[n].key.toString();
                    if (relations[n].type == Backbone.HasMany) {
                        if (model.get(tempkey).length > 0) {
                            for (var i = 0; i < model.get(tempkey).length; i++) {
                                model.render(stateJson, renderSelfTag, model.get(tempkey).at(i));
                            }
                        }
                    } else if (relations[n].type == Backbone.HasOne) {
                        if (model.get(tempkey) != null) {
                            model.render(stateJson, renderSelfTag, model.get(tempkey));
                        }
                    }
                }
            }
        }
    },
    /*********************************************************************************************
     *  方法：对外接口，重新渲染。
     *  属性：reRenderJson 重渲染参数，若传入，则有效部分覆盖model本身的stateJson或initJson字段；
     *        renderSelfTag 仅渲染自身标志，默认为false
     *        model 递归用变量，无需赋值
     ********************************************************************************************/
    reRender: function (reRenderJson, renderSelfTag, model) {
        var nReRenderJson = null;
        //参数初始值处理
        if (typeof(reRenderJson) == "boolean") {
            renderSelfTag = reRenderJson;
        } else {
            if (reRenderJson) {
                nReRenderJson = $.extend(true, {}, reRenderJson);
            }
        }
        if (!model) {
            model = this;
        }
        model.updateModel(true, model);
        if (!nReRenderJson) {
            this.render(renderSelfTag, model);
            return;
        }
        var classJson = nReRenderJson[model.className];
        var changePros = {};
        if (classJson) {
            if (classJson.state) {
                if (classJson.state.enable) {
                    delete model.stateJson[model.className].state.disable;
                    model.stateJson[model.className].state.enable = classJson.state.enable;
                } else if (classJson.state.disable) {
                    delete model.stateJson[model.className].state.enable;
                    model.stateJson[model.className].state.disable = classJson.state.disable;
                }
            } else {
                classJson.state = model.stateJson[model.className].state;
            }
            //处理字段配置变更的部分
            if (classJson.property) {
                //遍历字段
                for (key in classJson.property) {
                    changePros[key] = classJson[key];
                    var proInitJson = model.initJson[model.className][key];
                    var proClassJson = classJson.property[key];
                    //遍历字段属性
                    for (key2 in proClassJson) {
                        if (proInitJson.type == "layer") {
                            if (proInitJson.layerConfig.name) {
                                //找到layer关联的我dom元素
                                var linkDom = $("*[layer-model='" + model.get("ModelName") + "'][layer-property='" + proInitJson.layerConfig.name + "']");
                                if (linkDom) {
                                    var dataDom = $("*[data-model=" + model.get("ModelName") + "][data-property=" + key + "]");
                                    dataDom.show();
                                    dataDom.addClass("i_text");
                                    //取消绑定时间
                                    linkDom.parent().unbind("mouseenter").unbind("mouseleave");
                                    //清空dom元素
                                    linkDom.remove();
                                }
                            }
                        }
                        //如属性是type
                        if (key2 == "type") {
                            var newConfigName = proClassJson.type + "Config";
                            //先比对type是否变化，若变化，则将原有Config删除，type和Config替换成新配置内容
                            if (proInitJson.type != proClassJson.type) {
                                var oldConfigName = proInitJson.type + "Config";
                                if (proInitJson[oldConfigName]) {
                                    delete proInitJson[oldConfigName];
                                }
                                if (proClassJson[newConfigName]) {
                                    proInitJson[newConfigName] = proClassJson[newConfigName];
                                }
                                proInitJson.type = proClassJson.type;
                            } else { //若type未变化，则比对Config内部属性，将变化字段更换
                                if (proClassJson[newConfigName]) {
                                    for (configKey in proClassJson[newConfigName]) {
                                        proInitJson[newConfigName][configKey] = proClassJson[newConfigName][configKey];
                                    }
                                }
                            }
                        } else if (key2.indexOf("Config") > 0) { //如属性是Config
                            if (!proClassJson.type) {//如未配置type属性，等同于type未变化，则比对Config内部属性，将变化字段更换
                                if (proClassJson[key2]) {
                                    for (configKey in proClassJson[key2]) {
                                        proInitJson[key2][configKey] = proClassJson[key2][configKey];
                                    }
                                }
                            }
                        } else if (key2 == "rules") {//规则参数
                            for (rulekey in proInitJson.rules) {
                                if (typeof(proClassJson.rules[rulekey]) != "undefined") {
                                    proInitJson.rules[rulekey] = proClassJson.rules[rulekey];
                                }
                            }
                        } else {//基础属性，直接更换
                            proInitJson[key2] = proClassJson[key2];
                        }
                    }
                    model.initJson[model.className][key] = proInitJson;
                }
            }
            //渲染状态，并把状态变更的字段按需插入变更字段集合中去
            var stateChangePros = model.renderState(classJson, model);
            for (var i = 0; i < stateChangePros.length; i++) {
                if (!changePros[stateChangePros[i]]) {
                    changePros[stateChangePros[i]] = {};
                }
            }
            //遍历变更字段集合，渲染各个字段
            for (key in changePros) {
                $("*[data-model=" + model.get("ModelName") + "][data-property=" + key + "]").each(function (i, t) {
                    model.MR.renderProperty(t, model);
                });
            }
        }
        //若处理关联项，则递归本函数
        if (!renderSelfTag) {
            var relations = model.relations;
            //alert(relations[0].type == Backbone.HasMany);
            if (relations.length > 0) {
                for (var n = 0; n < relations.length; n++) {
                    var tempkey = relations[n].key.toString();
                    if (relations[n].type == Backbone.HasMany) {
                        if (model.get(tempkey).length > 0) {
                            for (var i = 0; i < model.get(tempkey).length; i++) {
                                model.reRender(nReRenderJson, renderSelfTag, model.get(tempkey).at(i));
                            }
                        }
                    } else if (relations[n].type == Backbone.HasOne) {
                        if (model.get(tempkey) != null) {
                            model.reRender(nReRenderJson, renderSelfTag, model.get(tempkey));
                        }
                    }
                }
            }
        }
    },
    /************************************************************************************************************
     *  方法：对外接口，清空模型字段内容。
     *  属性：propertyArray 可为字符串（清空一个字段内容），字符串数组（清空多个字段内容），空（清空所有字段内容）
     *        emptyDomTag 是否同时清空页面dom元素的标志,默认为true
     ************************************************************************************************************/
    empty: function (propertyArray, emptyDomTag) {
        var model = this;
        var className = this.className;
        var json = this.initJson;
        var emptyAll = true;
        if (propertyArray) {
            emptyAll = false;
        }
        if (typeof(propertyArray) == "string") {
            var temp = [];
            temp.push(propertyArray);
            propertyArray = temp;
            emptyAll = false;
        }
        if (!emptyDomTag) {
            emptyDomTag = true;
        }
        $.each(json[className], function (property) {
            if (emptyAll || $.inArray(property, propertyArray) > -1) {
                $("*[data-model=" + model.get("ModelName") + "][data-property=" + property + "]").each(function (i, t) {
                    model.MR.emptyProperty(t, property, model, emptyDomTag);
                });
            }
        });
        $.each(model.relations, function (index, relation) {
            if (emptyAll || $.inArray(relation.key.toString(), propertyArray) > -1) {
                if (relation.type == Backbone.HasMany) {
                    model.set(relation.key.toString(), []);
                } else if (relation.type == Backbone.HasOne) {
                    model.set(relation.key.toString(), {});
                }
            }
        });
    },
    /******************************************************
     *  方法：对外接口，清楚模型渲染内容。
     *  属性：clearSelfTag 是否仅清除自身的标志,默认为false
     ******************************************************/
    clearRender: function (clearSelfTag) {
        if (!clearSelfTag) {
            clearSelfTag = false;
        }
        var model = this;

        $("*[data-model=" + model.get("ModelName") + "][data-property]").each(function (i, t) {
            model.MR.clearPropertyRender(t, model);
        });

        //若处理关联项，则递归本函数
        if (!clearSelfTag) {
            var relations = model.relations;
            //alert(relations[0].type == Backbone.HasMany);
            if (relations.length > 0) {
                for (var n = 0; n < relations.length; n++) {
                    var tempkey = relations[n].key.toString();
                    if (relations[n].type == Backbone.HasMany) {
                        if (model.get(tempkey).length > 0) {
                            for (var i = 0; i < model.get(tempkey).length; i++) {
                                model.clearRender(clearSelfTag, model.get(tempkey).at(i));
                            }
                        }
                    } else if (relations[n].type == Backbone.HasOne) {
                        if (model.get(tempkey) != null) {
                            model.clearRender(clearSelfTag, model.get(tempkey));
                        }
                    }
                }
            }
        }
    },
    /************************************************************************
     *  方法：对外接口，更新表单内容至模型数据中。
     *  属性：updateSelfTag 是否仅模型自身二不处理关系模型的标志,默认为false
     ***********************************************************************/
    updateModel: function (updateSelfTag, model) {
        if (!updateSelfTag) {
            updateSelfTag = false;
        }
        if (!model) {
            model = this;
        }
        $("*[data-model=" + model.get("ModelName") + "][data-property]").each(function (i, t) {
            model.MR.updateModelByElement(t, model);
        });
        //若处理关联项，则递归本函数
        if (!updateSelfTag) {
            var relations = model.relations;
            //alert(relations[0].type == Backbone.HasMany);
            if (relations.length > 0) {
                for (var n = 0; n < relations.length; n++) {
                    var tempkey = relations[n].key.toString();
                    if (relations[n].type == Backbone.HasMany) {
                        if (model.get(tempkey).length > 0) {
                            for (var i = 0; i < model.get(tempkey).length; i++) {
                                model.updateModel(updateSelfTag, model.get(tempkey).at(i));
                            }
                        }
                    } else if (relations[n].type == Backbone.HasOne) {
                        if (model.get(tempkey) != null) {
                            model.updateModel(updateSelfTag, model.get(tempkey));
                        }
                    }
                }
            }
        }
    },
    /**********************************************
     *  方法：对外接口，更新json数据至模型数据中
     *  属性：obj 传入的json数据,
     *       ifSetDomTag 是否更新dom表单元素值
     **********************************************/
    updateFromObject: function (obj, ifSetDomTag) {
        var model = this;
        var json = model.initJson;
        if (!ifSetDomTag) {
            ifSetDomTag = true;
        }
        for (var p in obj) {
            $.each(json, function (key, value) {
                if (key == model.className) {
                    $.each(value, function (key2, value2) {
                        if (key2.toLowerCase() == p.toLowerCase()) {
                            if (obj[p] != null) {        //&& obj[p].toString() != ""
                                model.setValue(key2, obj[p], ifSetDomTag);
                            }
                        }
                    });
                }
            });
        }
    },
    /*****************************************************************
     *  方法：检查模型是否未编辑（未填写值）
     *****************************************************************/
    checkHasEdit: function (model) {
        if (!model) {
            model = this;
        }

        var result = false;
        $("*[data-model=" + model.get("ModelName") + "][data-property]").each(function (i, t) {
            if (!$(t).is(":hidden")) {
                if ($(t).val() && $(t).val() != "0") {
                    result = true;
                    return false;
                }
            } else {
                var nextobj = $(t).next();
                if (nextobj.length > 0 && nextobj.hasClass("spanshow")) {
                    if (nextobj.text() && parseInt(nextobj.text()) != 0) {
                        result = true;
                        return false;
                    }
                }
            }
        });

        return result;
    },
    /************************************************************
     *  方法：对外接口，验证model
     *  属性：variableJson 传入的需验证的类字段json
     *        checkSelfTag 是否值验证费关联的model自身，默认false
     *        model 递归参数，无需传入
     *  返回值：是否通过验证，true为通过验证，false为未通过验证
     ************************************************************/
    ruleValidate: function (variableJson, checkSelfTag, model, canEmpty) {
        var result = true;
        //参数初始值处理
        if (typeof(variableJson) == "boolean") {
            checkSelfTag = variableJson;
            variableJson = null;
        }
        if (!checkSelfTag) {
            checkSelfTag = false;
        }
        if (!model) {
            model = this;
        }


        $("*[data-model=" + model.get("ModelName") + "][data-property]").each(function (i, t) {
            if (!$(t).parent().eq(0).hasClass("hideElement") && !$(t).hasClass("disabled")) {
                var rules = model.initJson[model.className][$(t).attr("data-property")].rules;
                if (rules && rules.checkValue && rules.checkValue.length > 0) {
                    return true;
                }
                $(t).removeErrorTip();
                $(t).removeErrorTip2();
            }
        });

        var needValidate = canEmpty ? model.checkHasEdit(model) : true;
        if (needValidate) {
            var variableAllTag = variableJson ? false : true;
            if (variableAllTag) {
                $("*[data-model=" + model.get("ModelName") + "][data-property]").each(function (i, t) {
                    var tresult = model.MR.variableProperty(t, false, model);
                    result = (result ? tresult : false);
                });
            } else {
                var propertys = variableJson[model.className];
                if (propertys) {
                    for (var i = 0; i < propertys.length; i++) {
                        $("*[data-model=" + model.get("ModelName") + "][data-property=" + propertys[i] + "]").each(function (i, t) {
                            var tresult = model.MR.variableProperty(t, false, model);
                            result = (result ? tresult : false);
                        })
                    }
                }
            }
            model.set("_notSaveTag", false);
        } else {
            model.set("_notSaveTag", true);
        }

        //若处理关联项，则递归本函数
        if (!checkSelfTag) {
            var relations = model.relations;
            //alert(relations[0].type == Backbone.HasMany);
            if (relations.length > 0) {
                for (var n = 0; n < relations.length; n++) {
                    var tempkey = relations[n].key.toString();
                    if (relations[n].type == Backbone.HasMany) {
                        if (model.get(tempkey).length > 0) {
                            var itemsstr = "";
                            for (var i = 0; i < model.get(tempkey).length; i++) {
                                var tresult = model.ruleValidate(variableJson, checkSelfTag, model.get(tempkey).at(i),
                                    relations[n].canEmpty);
                                result = (result ? tresult : false);
                            }
                        }
                    } else if (relations[n].type == Backbone.HasOne) {
                        var tresult = true;
                        if (model.get(tempkey) != null) {
                            var tresult = model.ruleValidate(variableJson, checkSelfTag, model.get(tempkey),
                                relations[n].canEmpty);
                            result = (result ? tresult : false);
                        }
                    }
                }
            }
        }
        if (!result) {
            scrollToError();
        }
        return result;
    },
    /************************************************************
     *  方法：对外接口，验证model值是否改变
     *  属性：variableJson 传入的需验证的类字段json
     *        checkSelfTag 是否值验证非关联的model自身，默认false
     *        model 递归参数，无需传入
     *  返回值：是否改变，true为已改变，false为未改变
     ************************************************************/
    changeValidate: function (variableJson, checkSelfTag, model) {
        var result = false;
        //参数初始值处理
        if (typeof(variableJson) == "boolean") {
            checkSelfTag = variableJson;
            variableJson = null;
        }
        if (!checkSelfTag) {
            checkSelfTag = false;
        }
        if (!model) {
            model = this;
        }
        var variableAllTag = variableJson ? false : true;
        if (variableAllTag) {
            $("*[data-model=" + model.get("ModelName") + "][data-property]").each(function (i, t) {
                var tresult = model.MR.variableChange(t, model);
                result = result || tresult;
            });
        } else {
            var propertys = variableJson[model.className];
            if (propertys) {
                for (var i = 0; i < propertys.length; i++) {
                    $("*[data-model=" + model.get("ModelName") + "][data-property=" + propertys[i] + "]").each(function (i, t) {
                        var tresult = model.MR.variableChange(t, model);
                        result = result || tresult;
                    })
                }
            }
        }

        //若处理关联项，则递归本函数
        if (!checkSelfTag) {
            var relations = model.relations;
            //alert(relations[0].type == Backbone.HasMany);
            if (relations.length > 0) {
                for (var n = 0; n < relations.length; n++) {
                    var tempkey = relations[n].key.toString();
                    if (relations[n].type == Backbone.HasMany) {
                        if (model.get(tempkey).length > 0) {
                            var itemsstr = "";
                            for (var i = 0; i < model.get(tempkey).length; i++) {
                                var tresult = model.changeValidate(variableJson, checkSelfTag, model.get(tempkey).at(i));
                                result = result || tresult;
                            }
                        }
                    } else if (relations[n].type == Backbone.HasOne) {
                        var tresult = true;
                        if (model.get(tempkey) != null) {
                            var tresult = model.changeValidate(variableJson, checkSelfTag, model.get(tempkey));
                            result = result || tresult;
                        }
                    }
                }
            }
        }
        return result;
    },
    /*********************************
     *  方法：对外接口，勾选/反选model
     *  属性：state 是否被勾选
     *********************************/
    checkModel: function (state) {
        this.checked = state;
    },
    /*************************************************
     *  方法：外部接口，获取所有字段的json值，不受ifForm影响
     *  属性：getSelfTag 是否值返回自己的非关联的json
     ************************************************/
    deleteLogic: function (cascadeTag) {
        this.setValue("sfyx_st", "UNVALID");
        //若处理关联项，则递归本函数
        if (cascadeTag) {
            var relations = model.relations;
            //alert(relations[0].type == Backbone.HasMany);
            if (relations.length > 0) {
                for (var n = 0; n < relations.length; n++) {
                    var tempkey = relations[n].key.toString();
                    if (relations[n].type == Backbone.HasMany) {
                        if (model.get(tempkey).length > 0) {
                            for (var i = 0; i < model.get(tempkey).length; i++) {
                                model.get(tempkey)[i].deleteLogic(cascadeTag);
                            }
                        }
                    } else if (relations[n].type == Backbone.HasOne) {
                        if (model.get(tempkey) != null) {
                            model.get(tempkey).deleteLogic(cascadeTag);
                        }
                    }
                }
            }
        }
    },
    /*
     **重新渲染字段,renderParam多个以逗号隔开
     * */
    reRenderProperty:function(renderParam){
        var model = this;
        var paramArr = renderParam.split(",");
        for(var i=0,maxLength = paramArr.length;i<maxLength;i++){
            $("*[data-model=" + model.get("ModelName") + "][data-property="+paramArr[i]+"]").each(function (i, t) {
                model.MR.renderProperty(t, model);
            });
        }
    }
});



